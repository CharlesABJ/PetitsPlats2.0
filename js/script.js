import { recipes } from "./recipes.js";
import { getIngredients, getAppliances, getUstensils } from "./getFilters.js";
import {
  createIngredientsList,
  createAppliancesList,
  createUstensilsList,
} from "./createFilters.js";
import { displayDishes, applyFilters } from "./utilities.js";

// INITIALISATION DES VARIABLES
// Pour les recettes :
let currentRecipes = [...recipes];
const cardsZone = document.querySelector(".cards-zone");

// Pour les filtres :
const filtersIngredients = document.getElementById("ingredients");
const filtersAppliances = document.getElementById("appliances");
const filtersUstensils = document.getElementById("ustensils");
let activeFilters = {
  ingredients: new Set(),
  appliances: new Set(),
  ustensils: new Set(),
};

// FONCTIONS
// Afficher les filtres d'ingrédients, d'appareils et d'ustensiles :
function displayFilters() {
  const ingredients = getIngredients(currentRecipes);
  const appliances = getAppliances(currentRecipes);
  const ustensils = getUstensils(currentRecipes);

  filtersIngredients.innerHTML = createIngredientsList(ingredients);
  filtersAppliances.innerHTML = createAppliancesList(appliances);
  filtersUstensils.innerHTML = createUstensilsList(ustensils);
}

// Afficher les différents filtres
const filtersToggle = Array.from(document.querySelectorAll(".filters div p"));
const filtersNatures = Array.from(
  document.querySelectorAll(".searchform-and-list")
);
const filtersContainer = document.querySelector(".filters-and-results");

filtersToggle.forEach((filter) => {
  filter.addEventListener("click", () => {
    filter.classList.toggle("active");
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

// Obtenir les filtres actifs
function getActivesFilters() {
  const filters = document.querySelectorAll(".filters li");
  const filterTypes = ["ingredients", "appliances", "ustensils"];
  const filtersIsActives = {};

  filterTypes.forEach((filterType) => {
    filtersIsActives[filterType] = document.querySelector(
      `.${filterType}-filters-actives`
    );
  });

  filters.forEach((filter) => {
    filter.addEventListener("click", function () {
      filter.classList.toggle("active");

      filterTypes.forEach((filterType) => {
        const filterValue = filter.getAttribute(
          `filter-${filterType}-attribute`
        );

        if (filterValue) {
          if (filter.classList.contains("active")) {
            filtersIsActives[
              filterType
            ].innerHTML += `<li data-attribute="${filterType}" filter-${filterType}-attribute="${filter.innerHTML}"><span>${filter.innerHTML}</span> <i class="fa-solid fa-xmark"></i> </li>`;
            deleteFilter(
              filterType,
              activeFilters,
              document.querySelectorAll(`#${filterType} li`)
            );
            activeFilters[filterType].add(filterValue);
          } else {
            const activeFiltersDisplayed = document.querySelectorAll(
              ".filters-actives li "
            );
            activeFiltersDisplayed.forEach((activeFilter) => {
              if (
                activeFilter.textContent.replace(" x", "").trim() ===
                filter.innerHTML.trim()
              ) {
                activeFilter.remove();
              }
            });
            activeFilters[filterType].delete(filterValue);
          }
        }
      });

      applyFilters(cardsZone, currentRecipes, activeFilters);
    });
  });
}

// Supprimer les filtres actifs
function deleteFilter(filterType, activeFilters, activeFiltersElements) {
  const croceActiveFilters = document.querySelectorAll(
    ".filters-actives li .fa-xmark"
  );

  croceActiveFilters.forEach((croceActiveFilter) => {
    croceActiveFilter.addEventListener("click", function () {
      const filterToDelete = croceActiveFilter.parentElement.getAttribute(
        `filter-${filterType}-attribute`
      );
      activeFilters[filterType].delete(filterToDelete);
      activeFiltersElements.forEach((activeFilter) => {
        if (activeFilter.innerHTML === filterToDelete) {
          activeFilter.classList.remove("active");
        }
      });
      croceActiveFilter.parentElement.remove();
      applyFilters(cardsZone, currentRecipes, activeFilters);
    });
  });
}

// SEARCHBAR
// Filtre de recherche de recettes
const forms = document.querySelectorAll("form");
forms.forEach((form) => {
  form.addEventListener("submit", (e) => e.preventDefault());
});
const searchInput = document.getElementById("searchbar");

// Ajouter une croix pour effacer le contenu de l'input
const allInputs = document.querySelectorAll("input");
const clearInput = document.createElement("i");
clearInput.classList.add("fa-solid", "fa-xmark");
allInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    if (e.target.value.length > 0) {
      input.parentElement.appendChild(clearInput);
      clearInput.addEventListener("click", () => {
        input.value = "";
        clearInput.remove();
        currentRecipes = [...recipes];

        displayDishes(cardsZone, currentRecipes);
      });
    } else {
      clearInput.remove();
    }
  });
});

// Filtrer les recettes en fonction de la barre de recherche
function handleInput(e) {
  const searchValue = e.target.value.toLowerCase();
  let noResults = document.querySelector(".no-results");
  noResults.innerHTML = "";
  // Si l'utilsateur supprime le contenu de l'input est vide, on réinitialise la liste des recettes
  if (searchValue === "" || searchValue.length < 3) {
    currentRecipes = [...recipes];
    displayDishes(cardsZone, currentRecipes);
    return;
  }
  currentRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(searchValue) ||
      recipe.description.toLowerCase().includes(searchValue) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.ingredient.toLowerCase().includes(searchValue)
      )
  );
  if (currentRecipes.length === 0) {
    noResults.innerHTML = `Aucune recette ne contient ‘<span>${e.target.value}</span>’ vous pouvez chercher « <span>tarte aux pommes</span> », « <span>poisson</span> », etc.`;
  }
  displayDishes(cardsZone, currentRecipes);
}

searchInput.addEventListener("input", handleInput);
searchInput.addEventListener("change", handleInput);

// Filtre de recherche de tags
const filtersTagsInput = Array.from(
  document.querySelectorAll(".filters input")
);

filtersTagsInput.forEach((input) => {
  input.addEventListener("input", (e) => {
    const searchValue = e.target.value.toLowerCase();

    // Faire fonctionner le filtre de recherche pour chaque catégorie indépendamment
    const filterParent = e.target.parentElement.parentElement.parentElement;
    const filtersTagsList = Array.from(filterParent.querySelectorAll("ul li"));
    filtersTagsList.forEach((filter) => {
      if (filter.textContent.toLowerCase().includes(searchValue)) {
        filter.style.display = "block";
      } else {
        filter.style.display = "none";
      }
    });
  });
});

function init() {
  displayFilters();
  applyFilters(cardsZone, currentRecipes, activeFilters);
  getActivesFilters();

  displayDishes(cardsZone, currentRecipes);
}
init();
