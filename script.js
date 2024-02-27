import { recipes } from "./recipes.js";

let currentRecipes = [...recipes];
const cardsZone = document.querySelector(".cards-zone");
const filtersIngredients = document.getElementById("ingredients");
const filtersAppliances = document.getElementById("appliances");
const filtersUstensils = document.getElementById("ustensils");

// Obtenir une liste d'ingrédients
function getIngredients(currentRecipes) {
  const ingredients = currentRecipes.flatMap((recipe) =>
    recipe.ingredients.map((ingredient) => ingredient.ingredient)
  );
  return [...new Set(ingredients)];
}

// Obtenir une liste d'appareils
function getAppliances(currentRecipes) {
  const appliances = currentRecipes.map((recipe) => recipe.appliance);
  return [...new Set(appliances)];
}

// Obtenir une liste d'ustensiles
function getUstensils(currentRecipes) {
  const ustensils = currentRecipes.flatMap((recipe) => recipe.ustensils);
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

  nbOfRecipes.innerHTML = `${currentRecipes.length} recettes`;

  const ingredients = getIngredients(currentRecipes);
  const appliances = getAppliances(currentRecipes);
  const ustensils = getUstensils(currentRecipes);

  filtersIngredients.innerHTML = createIngredientsList(ingredients);
  filtersAppliances.innerHTML = createAppliancesList(appliances);
  filtersUstensils.innerHTML = createUstensilsList(ustensils);
}

let activeFilters = {
  ingredients: new Set(),
  appliances: new Set(),
  ustensils: new Set(),
};

function applyFilters() {
  currentRecipes = recipes.filter(
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
  getDishes();
}

function getActivesFilters() {
  const filters = document.querySelectorAll(".filters li");
  const ingredientsFiltersActives = document.querySelector(
    ".ingredients-filters-actives"
  );
  const appliancesFiltersActives = document.querySelector(
    ".appliances-filters-actives"
  );
  const ustensilsFiltersActives = document.querySelector(
    ".ustensils-filters-actives"
  );

  filters.forEach((filter) => {
    filter.addEventListener("click", function () {
      const filterIngredient = filter.getAttribute(
        "filter-ingredients-attribute"
      );
      const filterAppliance = filter.getAttribute(
        "filter-appliances-attribute"
      );
      const filterUstensil = filter.getAttribute("filter-ustensils-attribute");

      // Activer ou désactiver le filtre sélectionné.
      filter.classList.toggle("active");

      //Ecrire et supprimer les filtres
      if (filter.classList.contains("active")) {
        if (filter.getAttribute("filter-ingredients-attribute")) {
          ingredientsFiltersActives.innerHTML += `<li filter-ingredients-attribute="${filter.innerHTML}" ><span>${filter.innerHTML}</span> <span  class="croce">x</span> </li>`;
          deleteFilter();
        } else if (filter.getAttribute("filter-appliances-attribute")) {
          appliancesFiltersActives.innerHTML += `<li filter-appliances-attribute="${filter.innerHTML}">${filter.innerHTML}</li>`;
        } else if (filter.getAttribute("filter-ustensils-attribute")) {
          ustensilsFiltersActives.innerHTML += `<li filter-ustensils-attribute ="${filter.innerHTML}">${filter.innerHTML}</li>`;
        }
      } else {
        const activeFilters = document.querySelectorAll(".filters-actives li");
        activeFilters.forEach((activeFilter) => {
          if (activeFilter.innerHTML === filter.innerHTML) {
            activeFilter.remove();
          }
        });
      }

      if (filterIngredient) {
        if (filter.classList.contains("active")) {
          activeFilters.ingredients.add(filterIngredient);
        } else {
          activeFilters.ingredients.delete(filterIngredient);
        }
      }

      if (filterAppliance) {
        if (filter.classList.contains("active")) {
          activeFilters.appliances.add(filterAppliance);
        } else {
          activeFilters.appliances.delete(filterAppliance);
        }
      }

      if (filterUstensil) {
        if (filter.classList.contains("active")) {
          activeFilters.ustensils.add(filterUstensil);
        } else {
          activeFilters.ustensils.delete(filterUstensil);
        }
      }

      applyFilters();
    });
  });
}

function deleteFilter() {
  const croceActiveFilters = document.querySelectorAll(
    ".filters-actives li .croce"
  );
  const activeFiltersElements = document.querySelectorAll("#ingredients li");

  croceActiveFilters.forEach((croceActiveFilter) => {
    croceActiveFilter.addEventListener("click", function () {
      const filterToDelete = croceActiveFilter.parentElement.getAttribute(
        "filter-ingredients-attribute"
      );
      activeFilters.ingredients.delete(filterToDelete);
      activeFiltersElements.forEach((activeFilter) => {
        // console.log(croceActiveFilter.previousSibling.innerHTML);
        if (
          activeFilter.innerHTML ===
          croceActiveFilter.parentElement.getAttribute(
            "filter-ingredients-attribute"
          )
        ) {
          activeFilter.classList.remove("active");
        }
      });
      croceActiveFilter.parentElement.remove();
      applyFilters();
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
  applyFilters();
  getActivesFilters();

  getDishes();
}

init();
