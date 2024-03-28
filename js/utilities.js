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

// Fonction pour appliquer les filtres
export function applyFilters(cardsZone, currentRecipes, activeFilters) {
  currentRecipes = currentRecipes.filter(
    (recipe) =>
      Array.from(activeFilters.ingredients).every((activeIngredient) =>
        recipe.ingredients.some(
          (ingredient) => ingredient.ingredient === activeIngredient
        )
      ) &&
      Array.from(activeFilters.appliances).every(
        (activeAppliance) => recipe.appliance === activeAppliance
      ) &&
      Array.from(activeFilters.ustensils).every((activeUstensil) =>
        recipe.ustensils.includes(activeUstensil)
      )
  );

  displayDishes(cardsZone, currentRecipes);
}
