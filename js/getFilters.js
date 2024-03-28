// Obtenir une liste d'ingrédients
export function getIngredients(currentRecipes) {
  const ingredients = currentRecipes.flatMap((recipe) =>
    recipe.ingredients.map((ingredient) => ingredient.ingredient)
  );
  return [...new Set(ingredients)];
}

// Obtenir une liste d'appareils
export function getAppliances(currentRecipes) {
  const appliances = currentRecipes.map((recipe) => recipe.appliance);
  return [...new Set(appliances)];
}

// Obtenir une liste d'ustensiles
export function getUstensils(currentRecipes) {
  const ustensils = currentRecipes.flatMap((recipe) => recipe.ustensils);
  return [...new Set(ustensils)];
}
