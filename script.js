import { recipes } from "./recipes.js";
let currentRecipes = [...recipes];
const cardsZone = document.querySelector(".cards-zone");
const filtersIngredients = document.getElementById("ingredients");
const filtersAppliances = document.getElementById("appliances");
const filtersUstensils = document.getElementById("ustensils");

// Obtenir une liste d'ingrédients
function getIngredients(recipes) {
  const ingredients = recipes.flatMap((recipe) =>
    recipe.ingredients.map((ingredient) => ingredient.ingredient)
  );
  return [...new Set(ingredients)];
}

// Obtenir une liste d'appareils
function getAppliances(recipes) {
  const appliances = recipes.map((recipe) => recipe.appliance);
  return [...new Set(appliances)];
}

// Obtenir une liste d'ustensiles
function getUstensils(recipes) {
  const ustensils = recipes.flatMap((recipe) => recipe.ustensils);
  return [...new Set(ustensils)];
}

// Créer une liste d'ingrédients
function createIngredientsList(ingredients) {
  return ingredients
    .map(
      (ingredient) =>
        `<li filter-ingredients-attribute="${ingredient}">${ingredient}</li>`
    )
    .join("");
}

// Créer une liste d'appareils
function createAppliancesList(appliances) {
  return appliances
    .map(
      (appliance) =>
        `<li filter-appliances-attribute="${appliance}">${appliance}</li>`
    )
    .join("");
}

// Créer une liste d'ustensiles
function createUstensilsList(ustensils) {
  return ustensils
    .map(
      (ustensil) =>
        `<li filter-ustensils-attribute="${ustensil}">${ustensil}</li>`
    )
    .join("");
}

function getFilters() {
  const nbOfRecipes = document.querySelector(".nb-of-recipes h2");
  const ingredients = getIngredients(currentRecipes);
  const appliances = getAppliances(currentRecipes);
  const ustensils = getUstensils(currentRecipes);

  nbOfRecipes.innerHTML = `${currentRecipes.length} recettes`;
  filtersIngredients.innerHTML = createIngredientsList(ingredients);
  filtersAppliances.innerHTML = createAppliancesList(appliances);
  filtersUstensils.innerHTML = createUstensilsList(ustensils);

  const filters = document.querySelectorAll(".filters li");
  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const filterAttribute = filter.getAttribute(
        "filter-ingredients-attribute"
      );
      const filterAppliance = filter.getAttribute(
        "filter-appliances-attribute"
      );
      const filterUstensil = filter.getAttribute("filter-ustensils-attribute");

      if (filterAttribute) {
        currentRecipes = currentRecipes.filter((recipe) =>
          recipe.ingredients.some(
            (ingredient) => ingredient.ingredient === filterAttribute
          )
        );
      } else if (filterAppliance) {
        currentRecipes = currentRecipes.filter(
          (recipe) => recipe.appliance === filterAppliance
        );
      } else if (filterUstensil) {
        currentRecipes = currentRecipes.filter((recipe) =>
          recipe.ustensils.includes(filterUstensil)
        );
      }

      getDishes();
    });
  });
}

const searchInput = document.getElementById("searchbar");
searchInput.addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();
  // Si l'utilsateur supprime le contenu de l'input est vide, on réinitialise la liste des recettes
  if (searchValue === "") {
    currentRecipes = [...recipes];
  } else if (searchValue.length < 3) return;
  currentRecipes = currentRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchValue)
  );
  getDishes();
});

function getDishes() {
  console.time("getDishes");

  try {
    let cards = ""; // Créer une variable pour stocker toutes les cartes

    for (let i in currentRecipes) {
      const {
        name,
        time,
        image,
        description,
        ingredients,
        appliance,
        ustensils,
      } = currentRecipes[i];
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
      cards += card; // Ajouter la carte à la variable cards
    }

    cardsZone.innerHTML = cards; // Ajouter toutes les cartes en une seule fois
  } catch (error) {
    console.error("Warning :" + error);
  }
  // Mesurer la performance d'une routine
  console.timeEnd("getDishes");
}

// Afficher les différents filtres
const filtersToggle = Array.from(document.querySelectorAll(".filters div p"));
const filtersNatures = Array.from(
  document.querySelectorAll(".searchform-and-list")
);
const filtersContainer = document.querySelector(".filters-and-results");

filtersToggle.forEach((filter) => {
  filter.addEventListener("click", () => {
    filtersNatures.forEach((filterNature) => {
      if (
        filterNature.getAttribute("data-attribute") ===
        filter.getAttribute("data-attribute")
      ) {
        filterNature.classList.toggle("active");
      }
    });

    // si au moins un filtre est ouvert, on ajoute la classe list-is-open
    if (
      filtersNatures.some((filterNature) =>
        filterNature.classList.contains("active")
      )
    ) {
      filtersContainer.classList.add("list-is-open");
    } else {
      filtersContainer.classList.remove("list-is-open");
    }
  });
});

function init() {
  getFilters();
  getDishes();
}

init();
