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

function countRecipes(currentRecipes) {
  const nbOfRecipes = document.querySelector(".nb-of-recipes h2");

  nbOfRecipes.innerHTML = `${currentRecipes.length} recettes`;
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
  countRecipes(currentRecipes);
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
          ingredientsFiltersActives.innerHTML += `<li data-attribute="ingredients" filter-ingredients-attribute="${filter.innerHTML}"><span>${filter.innerHTML}</span> <i class="fa-solid fa-xmark"></i> </li>`;
          deleteFilter(
            "ingredients",
            activeFilters,
            document.querySelectorAll("#ingredients li")
          );
        } else if (filter.getAttribute("filter-appliances-attribute")) {
          appliancesFiltersActives.innerHTML += `<li data-attribute="appliances" filter-appliances-attribute="${filter.innerHTML}"><span>${filter.innerHTML}</span> <i class="fa-solid fa-xmark"></i> </li>`;
          deleteFilter(
            "appliances",
            activeFilters,
            document.querySelectorAll("#appliances li")
          );
        } else if (filter.getAttribute("filter-ustensils-attribute")) {
          ustensilsFiltersActives.innerHTML += `<li data-attribute="ustensils" filter-ustensils-attribute ="${filter.innerHTML}"><span>${filter.innerHTML}</span> <i class="fa-solid fa-xmark"></i> </li>`;
          deleteFilter(
            "ustensils",
            activeFilters,
            document.querySelectorAll("#ustensils li")
          );
        }
      } else {
        const activeFilters = document.querySelectorAll(".filters-actives li");
        activeFilters.forEach((activeFilter) => {
          if (
            activeFilter.textContent.replace(" x", "").trim() ===
            filter.innerHTML.trim()
          ) {
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
      applyFilters();
    });
  });
}

function getDishes() {
  console.time("getDishes");
  //JSBENCh

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
        getDishes();
      });
    } else {
      clearInput.remove();
    }
    countRecipes(currentRecipes);
  });
});

function handleInput(e) {
  const searchValue = e.target.value.toLowerCase();
  let noResults = document.querySelector(".no-results");
  noResults.innerHTML = "";
  // Si l'utilsateur supprime le contenu de l'input est vide, on réinitialise la liste des recettes
  if (searchValue === "") {
    currentRecipes = [...recipes];
  } else if (searchValue.length < 3) {
    currentRecipes = [...recipes];
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
  getDishes();
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
  getFilters();
  applyFilters();
  getActivesFilters();

  getDishes();
}
init();
