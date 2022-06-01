const mealsEl = document.getElementById("meals");
const categoriesUl = document.getElementById("categories");
const categoriesContainer = document.querySelector('.categories-container');
const mealPopup = document.getElementById("meal-popup");
const mealInfoEl = document.getElementById("meal-info");
const closeBtn = document.getElementById("close-popup");
const homeBtn = document.getElementById("home");
const searchTerm = document.getElementById("search-term");
const searchBtn = document.getElementById("search");
const MAXINGREDIENTS = 20;

async function randomMeal(){
    const request = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const data = await request.json();
    const randomMeal = data.meals[0];

    addMeal(randomMeal, true);
}

async function addMealById(id) {
    const resp = await fetch(
        "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
    );

    const respData = await resp.json();
    const meal = respData.meals[0];

    addMeal(meal);
}

async function searchMeal(text){
    const request = await fetch(
        "https://www.themealdb.com/api/json/v1/1/search.php?s=" + text
    );

    const data = await request.json();
    const meals = data.meals;

    return meals;
}

async function getCategories(){
    const request = await fetch(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    const data = await request.json();
    const categories = data.categories;

    for (let i = 0; i < categories.length; i++){
        addCategories(categories[i]);
    }
}

async function filterCategory(strCategory){
    meals.innerHTML = "";
    const request = await fetch(
        "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + strCategory
    );
    const data = await request.json();
    const categoryMeals = data.meals;

    if (categoryMeals){
        categoryMeals.forEach((meal) => {
            const idMeal = meal.idMeal;
            addMealById(idMeal);
        })
    }
}

searchBtn.addEventListener("click", async () => {
    mealsEl.innerHTML = "";

    const text = searchTerm.value;
    const meals = await searchMeal(text);

    if (meals){
        meals.forEach((meal) => {
            addMeal(meal);
        });
    };

    categoriesContainer.innerHTML = "";
});

function addCategories(category){    
    const categoryLi = document.createElement('li');
    
    categoryLi.innerHTML = `
        <div class = "categoryItem">
            <img
                src="${category.strCategoryThumb}"
                alt="${category.strCategory}"
            /><span>${category.strCategory}</span>
        </div>
    `;

    const categoryPic = categoryLi.querySelector(".categoryItem");

    categoriesUl.appendChild(categoryLi);

    categoryPic.addEventListener("click", () =>{
        filterCategory(category.strCategory);
        const listItems = categoriesUl.getElementsByTagName('li');
        for (var i = 0; i<listItems.length; i++){
            listItems[i].classList.remove("active-category");
        }
        categoryLi.classList.add("active-category");
    })   

}

function addMeal(mealData, random = false){
    console.log(mealData);

    const meal = document.createElement("div");
    meal.classList.add('meal');

    meal.innerHTML = `
        <div class="meal-header">
            ${random? '<div class="random"> Random Recipe </div>': ""}
            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        </div>
        <div class="meal-body">
            <h3>${mealData.strMeal}</h3>
            <button class="fav-btn">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `;
    
    const favBtn = meal.querySelector(".fav-btn");
    const mealHeader = meal.querySelector(".meal-header");

    favBtn.addEventListener("click", ()=>{
        if (favBtn.classList.contains('active')){
            //removeFavourite(mealData.idMeal);
            favBtn.classList.remove('active');
        } else {
            //addFavourite(mealData.idMeal);
            favBtn.classList.add('active');
        }
    })

    mealHeader.addEventListener("click", () =>{
        mealInfo(mealData);
    })
    
    mealsEl.appendChild(meal);
}

homeBtn.addEventListener("click", () =>{
    location.reload();
})

function mealInfo(data){
    mealInfoEl.innerHTML = "";
    const ingredients = [];
    const mealInfo = document.createElement("div");

    for (let i = 1; i<MAXINGREDIENTS; i++){
        if (data["strIngredient"+i]){
            ingredients.push(`${data["strIngredient" + i]} - ${data["strMeasure" + i]}`);
        }
    }

    console.log(ingredients)

    mealInfo.innerHTML = `
        <h1>${data.strMeal}</h1>
        <img src=${data.strMealThumb} alt=${data.strMeal}/>
        <h3>Ingredients:</h3>  
        <ul>
            ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
        <p>${data.strInstructions}</p>
    `;

    mealInfoEl.appendChild(mealInfo);

    mealPopup.classList.remove("hidden");
}

closeBtn.addEventListener("click", ()=>{
    mealPopup.classList.add("hidden");
})

function main(){
    randomMeal();
    getCategories();
}

main();

