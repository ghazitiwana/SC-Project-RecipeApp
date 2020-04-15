import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Like';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';
import { elements, renderLoader, clearLoader } from './views/base';

//global state objects
const state = {};
window.state = state;

//search controller
const controlSearch = async () => {
//getting query
  const query = searchView.getInput();

  if(query){
//adding new search object to state
  state.search = new Search(query);

  try {
//clearing previous results to make room for new 
    searchView.clearInput();
    searchView.clearResList();
    renderLoader(elements.searchRes);
//searching for recipes
    await state.search.getResults();

//renering results on UI
    clearLoader();
    searchView.renderResult(state.search.recipes);
  }
  catch(err) {
    alert(`Something is wrong for searcing.`);
    clearLoader();
  }
  }
};




elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPage.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');

  if(btn) {
  const goToPage = parseInt(btn.dataset.goto, 10);
  searchView.clearResList();
  searchView.renderResult(state.search.recipes, goToPage);
}
});




//recipe controller

const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');

  if(id) {
//clearing previous result
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    if(state.search) searchView.highlightSelected(id);

//creating new recipe object
    state.recipe = new Recipe(id);

    try {
//getting recipe data and parseIngredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

//calculating servings and time
      state.recipe.calcTime();
      state.recipe.calcServing();

//rendering recipe
      clearLoader();
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
      );
    }
    catch(err) {
      alert(`Error processing recipes.`);
      console.log(err);
    }
  }
};

  ['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));



//list controller
 const controllList = () => {
//creating new list
   if(!state.list) state.list = new List();

//adding each new ingredient to list
   state.recipe.ingredients.forEach(el => {
      const item = state.list.addItem(el.count, el.unit, el.ingredient)
      listView.renderItem(item);
   });
 };




//like controller
const controlLike = () => {
//creating new Like object
  if(!state.likes) state.likes = new Like();

  const currentID = state.recipe.id;
//adding item to list if its not liked already
  if(!state.likes.isLiked(currentID)){
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.image
    )

    likeView.toggleLikeBtn(true);
//rendering like in UI
    likeView.renderLike(newLike);
  }
//deleting item from list if it has been liked already
  else {

    state.likes.deleteLike(currentID);
    likeView.toggleLikeBtn(false);
    likeView.deleteLike(currentID);
  }
   likeView.toggleLikeMenu(state.likes.getNumLikes());
};

//checking if there is any like data already in localstorage
  window.addEventListener('load', () => {
    state.likes = new Like();
    state.likes.readStorage()
    likeView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => likeView.renderLike(like));
  })




 //handling deleting and updating of objects
 elements.shopping.addEventListener('click', e => {
   const id = e.target.closest('.shopping__item').dataset.itemid;

   if(e.target.matches('.shopping__delete, .shopping__delete *')){
     state.list.deleteItem(id);
     listView.deleteItem(id);
   }
   else if(e.target.matches('.shopping__count--value')){
     const val = parseFloat(e.target.value, 10);
     if(val > 0) state.list.updateCount(id, val);
   }
 });




//handling number of servings and amount of ingredients
  elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
//decrease
      state.recipe.updateServings('dec');
      recipeView.updateServingsIngredients(state.recipe);
    }
    else if(e.target.matches('.btn-increase, .btn-increase *')){
//increase
    state.recipe.updateServings('inc');
    recipeView.updateServingsIngredients(state.recipe);
    }
    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
      controllList();
    }
    else if(e.target.matches('.recipe__love, .recipe__love *')){
      controlLike();
    }
  }
);



window.l = new List();
