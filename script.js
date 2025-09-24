// script.js: All functionality for Recipe Maker Web App
// Imports at top (if using external libraries)

// Spoonacular API Key
const SPOONACULAR_API_KEY = 'c7cd163de83a4a22b72ddff2885a7397';
const API_BASE_URL = 'https://api.spoonacular.com/recipes/findByIngredients';

// DOM Elements
const ingredientInput = document.getElementById('ingredient-input');
const searchBtn = document.getElementById('search-btn');
const recipesContainer = document.getElementById('recipes-container');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
ingredientInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Main search handler
async function handleSearch() {
    const ingredients = ingredientInput.value.trim();
    if (!ingredients) {
        showError('Please enter at least one ingredient.');
        return;
    }
    recipesContainer.innerHTML = '<p>Loading recipes...</p>';
    try {
        const recipes = await fetchRecipes(ingredients);
        renderRecipes(recipes);
    } catch (err) {
        showError('Failed to fetch recipes. Please try again.');
    }
}

// Fetch recipes from Spoonacular API
async function fetchRecipes(ingredients) {
    const url = `${API_BASE_URL}?ingredients=${encodeURIComponent(ingredients)}&number=8&ranking=2&ignorePantry=true&apiKey=${SPOONACULAR_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('API error');
    return await response.json();
}

// Render recipes to the DOM
function renderRecipes(recipes) {
    if (!recipes.length) {
        recipesContainer.innerHTML = '<p>No recipes found. Try different ingredients.</p>';
        return;
    }
    recipesContainer.innerHTML = recipes.map(recipe => `
        <div class="recipe-card">
            <img class="recipe-img" src="${recipe.image}" alt="${recipe.title}">
            <div class="recipe-details">
                <div class="recipe-title">${recipe.title}</div>
                <div class="recipe-summary">${recipe.usedIngredientCount} used, ${recipe.missedIngredientCount} missed</div>
                <a class="recipe-link" href="https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-')}-${recipe.id}" target="_blank">View Recipe <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `).join('');
}

// Show error message
function showError(message) {
    recipesContainer.innerHTML = `<p style="color:#c62828;">${message}</p>`;
}

// Future: Modularize for more features (favorites, details, etc.)
