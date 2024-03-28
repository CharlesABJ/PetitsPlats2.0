// Créer une liste d'ingrédients
export function createIngredientsList(ingredients) {
  return ingredients
    .map(
      (ingredient) =>
        `<li filter-ingredients-attribute="${ingredient}">${ingredient}</li>`
    )
    .join("");
}

// Créer une liste d'appareils
export function createAppliancesList(appliances) {
  return appliances
    .map(
      (appliance) =>
        `<li filter-appliances-attribute="${appliance}">${appliance}</li>`
    )
    .join("");
}

// Créer une liste d'ustensiles
export function createUstensilsList(ustensils) {
  return ustensils
    .map(
      (ustensil) =>
        `<li filter-ustensils-attribute="${ustensil}">${ustensil}</li>`
    )
    .join("");
}
