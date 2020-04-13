import { elements } from './base';
import fracty from 'fracty';


export const clearRecipe = () => {
  elements.recipe.innerHTML = '';
};

const formatCount = count => {
  if (count) {
    return `${fracty(count)}`;
  }
  return '?';
};

const createIngredient = ingredient =>
  `
    <li class="recipe__item">
        
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
  `

export const renderRecipe = (recipe, isLiked) => {
    const markup =
    `
      <figure class="recipe__fig">
          <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img">
          <h1 class="recipe__title">
              <span>${recipe.title}</span>
          </h1>
      </figure>
      <div class="recipe__details">
          <div class="recipe__info">
              <span class="recipe__info-data recipe__info-data--minutes">Time: ${recipe.time}</span>
              <span class="recipe__info-text"> minutes</span>
          </div>
          <div class="recipe__info">
              <span class="recipe__info-data recipe__info-data--people">${recipe.serving}</span>
              <span class="recipe__info-text"> servings</span>

              <div class="recipe__info-buttons">
                  <button class="btn-tiny btn-decrease">
                      <svg>
                          <use href="img/icons.svg#icon-circle-with-minus"></use>
                      </svg>
                  </button>
                  <button class="btn-tiny btn-increase">
                      <svg>
                          <use href="img/icons.svg#icon-circle-with-plus"></use>
                      </svg>
                  </button>
              </div>

          </div>
          <button class="recipe__love">
              <svg class="header__likes">
                  <use href="img/icons.svg#icon-heart${ isLiked ? '' : '-outlined'}"></use>
              </svg>
          </button>
      </div>



      <div class="recipe__ingredients">
          <ul class="recipe__ingredient-list">
            ${recipe.ingredients.map(el => createIngredient(el)).join('')}
          </ul>

          <button class="btn-small recipe__btn recipe__btn--add">
              <span>Add to shopping list</span>
          </button>
      </div>

      <div class="recipe__directions">
          <p class="recipe__directions-text">
              Click here to get directions for this recipe
          </p>
          <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
              <span>Directions</span>

          </a>
      </div>
    `
    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const updateServingsIngredients = recipe => {
  // update serving
  document.querySelector('.recipe__info-data--people').textContent = recipe.serving;

  // update Ingredients
  const countElements = Array.from(document.querySelectorAll('.recipe__count'));

  countElements.forEach((el, i) => {
    el.textContent = formatCount(recipe.ingredients[i].count);
  });
};
