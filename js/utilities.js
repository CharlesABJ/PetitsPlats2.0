// RECIPES
export function displayDishes(cardsZone, currentRecipes) {
  console.time("getDishes");

  // Compter le nombre de recettes
  const nbOfRecipes = document.querySelector(".nb-of-recipes h2");
  nbOfRecipes.innerHTML = `${currentRecipes.length} recettes`;

  try {
    // Créer une variable cards pour stocker toutes les cartes
    let cards = "";

    for (let i in currentRecipes) {
      const { name, time, image, description, ingredients } = currentRecipes[i];

      // Créer une carte pour chaque recette
      const card = `
      <div class="card">
          <div class="cover">
            <span class="cooking-time">${time}min</span>
            <img src="./images/data-medias/${image}" alt="${name}" loading="lazy">
          </div>
          <div class="text-content">
            <h2 class="dish-name">${name}</h2>
            <h3>Recette</h3>
            <p class="recipe-content">
              ${description}
            </p>
            <h3>Ingrédients</h3>
            <ul class="ingredients-list">
              ${ingredients
                .map(
                  (ingredient) => `
                <li>
                  <h4 class="ingredient-name">${ingredient.ingredient}</h4>
                  <p class="ingredient-quantity">${
                    ingredient.quantity ? ingredient.quantity : "-"
                  } ${ingredient.unit ? ingredient.unit : ""}</p>
                </li>
              `
                )
                .join("")}
            </ul>
          </div>
        </div>
      `;

      // Ajouter chaque carte à la variable cards
      cards += card;
    }

    // Ajouter toutes les cartes en une seule fois
    cardsZone.innerHTML = cards;
  } catch (error) {
    console.error("Warning :" + error);
  }
  // Mesurer la performance de la fonction
  console.timeEnd("getDishes");
}

export function applyFilters(cardsZone, currentRecipes, activeFilters) {
  let filteredRecipes = [];

  for (let i = 0; i < currentRecipes.length; i++) {
    let recipe = currentRecipes[i];
    let ingredientsMatch = true;
    let appliancesMatch = true;
    let utensilsMatch = true;

    for (const filterIngredient of activeFilters.ingredients) {
      let ingredientMatch = false;
      for (let k = 0; k < recipe.ingredients.length; k++) {
        if (recipe.ingredients[k].ingredient === filterIngredient) {
          ingredientMatch = true;

          break;
        }
      }
      if (!ingredientMatch) {
        ingredientsMatch = false;
        break;
      }
    }
    for (const filterAppliance of activeFilters.appliances) {
      if (recipe.appliance !== filterAppliance) {
        appliancesMatch = false;
        break;
      }
    }

    if (ingredientsMatch && appliancesMatch) {
      for (const filterUstensil of activeFilters.ustensils) {
        let utensilMatch = false;
        for (let k = 0; k < recipe.ustensils.length; k++) {
          if (
            JSON.stringify(recipe.ustensils[k]) ===
            JSON.stringify(filterUstensil)
          ) {
            utensilMatch = true;
            break;
          }
        }
        if (!utensilMatch) {
          utensilsMatch = false;
          break;
        }
      }
    }

    if (ingredientsMatch && appliancesMatch && utensilsMatch) {
      filteredRecipes.push(recipe);
    }
  }

  currentRecipes = filteredRecipes;

  displayDishes(cardsZone, currentRecipes);
  if (currentRecipes.length === 0) {
    const noResults = document.querySelector(".no-results");
    noResults.innerHTML = `Aucune recette ne contient ces critères de recherche.`;
  }
}
