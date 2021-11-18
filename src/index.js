import './sass/main.scss';

// -------------- Header-----------------
// burger
const burgerMenu = document.querySelector('.burger')
const headerMenu = document.querySelector('.header-menu')

burgerMenu.addEventListener('click', function () {
    document.body.classList.toggle('lock')
    burgerMenu.classList.toggle('active')
    headerMenu.classList.toggle('active')
})
// navigation
const menuLinks = document.querySelectorAll('[data-goto]');
if (menuLinks.length > 0) {
    menuLinks.forEach(menuLink => {
        menuLink.addEventListener('click', onMenuLinkClick)
    })
    function onMenuLinkClick(event) {
        const menuLink = event.target
        const gotoBlock = document.querySelector(menuLink.dataset.goto)

        const header = document.querySelector('header')
        const gotoBlockValue = gotoBlock.getBoundingClientRect().top + scrollY - header.offsetHeight;

        window.scrollTo({
            top: gotoBlockValue,
            behavior: 'smooth'
        })
        event.preventDefault()
        
    }
}
//-------------------------------------------------

// ------------------------------- Accordion
const accordion = document.getElementsByClassName('questions-item')

for (let i = 0; i < accordion.length; i++) {
    accordion[i].addEventListener('click', function () {
        this.classList.toggle('active')
    })
    
}
// ------------------------------------------------------

// ------------------------------- Modal-Order
const openModalBtn = document.querySelector('[data-modal-target]')
const closeModalBtn = document.querySelector('[data-close-button]')

const overlay = document.getElementById('overlay')
const modalWindow = document.getElementById('modal-details')

const amountOfDays = document.getElementById('days')
amountOfDays.oninput = () => {
    let resultBox = document.getElementById('days-result')
    resultBox.innerHTML = amountOfDays.value
}

openModalBtn.addEventListener('click', (button) => {
    const modal = document.querySelector(button.target.dataset.modalTarget)

    renderModal(modalWindow)
    openModal(modal)
})

function openModal(modal) {
    document.body.classList.add('lock')
    modal.classList.add('active')
    overlay.classList.add('active')
}

function renderModal(wrapper) {
    let form = document.querySelector('.form')
    let ckeckBox = document.getElementById('c-yes')
    if (ckeckBox.checked) {
       ckeckBox = 'included'
    } else {
        ckeckBox = 'not included'
    }

    let price;
    if (form.elements.days.value == 1) {
        price = '371';
    } else if (form.elements.days.value > 1 && form.elements.days.value <= 6) {
        price = '371' * form.elements.days.value;
    } else if (form.elements.days.value > 6 && form.elements.days.value <= 13) {
        price = '510' * form.elements.days.value;
    } else if (form.elements.days.value > 13 && form.elements.days.value <= 29) {
        price = '490' * form.elements.days.value;
    } else{
        price = '465' * form.elements.days.value;
    }

    let contentString = '';
    contentString += `
        <p>You have chosen <b>${form.elements.program.value}</b> program for <b>${form.elements.days.value}</b> (day/days) </p>
        <p>Price: ${price} uah</p>
        <p>Cutlery: ${ckeckBox} </b></p>
        <p>Delivery time: from <b>${form.elements.from.value}</b> to <b>${form.elements.to.value}</b></p>
        <p>Name: <b>${form.elements.name.value}</b></p>
        <p>Phone: <b>${form.elements.phone.value}</b> </p>
        <p>Email: <b>${form.elements.email.value}</b> </p>
        <p>Delivery address and comments:  <b>${form.elements.text.value}</b> </p>
    `
    wrapper.innerHTML = contentString
}


overlay.addEventListener('click', () => {
    closeModal(modal)
})

closeModalBtn.addEventListener('click', (button) => {
    const modal = button.target.closest('.modal')
    console.log(modal);
    closeModal(modal)
})


function closeModal(modal) {
    document.body.classList.remove('lock')
    modal.classList.remove('active')
    overlay.classList.remove('active')
}

// -----------------------------------------------------

// ------------------------------------------ api

// https://www.themealdb.com/api.php

const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');

const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// autocomplete
const searchBox = document.querySelector('.meal-search-box');
const inputBox = searchBox.querySelector('input')
const suggBox = searchBox.querySelector('.autocom-box')


searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
    document.body.classList.remove('lock')
});

let ingredients = [];
fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
.then(response => response.json())
.then((data) => {
    data.meals.map(({strIngredient}) => {
        ingredients.push(strIngredient)
    })})
.then(data => getIngredient(suggBox, ingredients));

function getIngredient(wrap, data) {
    inputBox.oninput = (event) => {
        let userEntered = event.target.value; 
        let matchList = [];

        if (userEntered) {
            matchList = data.filter((items) => {
                return items.toLocaleLowerCase().includes(userEntered.toLocaleLowerCase())
            })
            matchList = matchList.map((items) => {
                return items = `<li> ${items} </li>`;
            })

            searchBox.classList.add('active')
            showSuggestions(matchList)

            let allItems = wrap.querySelectorAll('li')
            allItems.forEach(element => {
                element.addEventListener('click', () => {
                    let selectData = element.textContent
                    inputBox.value = selectData;
                    searchBox.classList.remove('active')
                })
            })
        } else {
            searchBox.classList.remove('active')
        }
    }
}

function showSuggestions(list) {
    let listData;
    if (!list.length) {
        let userValue = inputBox.value;
        listData = `<li> ${userValue} </li>`;
    } else {
        listData = list.join('');
    }
   
    suggBox.innerHTML = listData;
}

function getMealList() {
    const searchInputTxt = document.getElementById('search-input').value.trim()
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                <div class="meal-item" data-id="${meal.idMeal}">
                    <div class="meal-img">
                        <img src="${meal.strMealThumb}" alt="food">
                    </div>
                    <h3>${meal.strMeal}</h3>
                    <div>
                        <a class="recipe-btn">Get Recipe</a>
                    </div>
                </div>`
            })
            mealList.classList.remove('notFound');
            
        } else {
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;

    })

    
}


function getMealRecipe(event) {
    event.preventDefault();
    if(event.target.classList.contains('recipe-btn')) {
        let mealItem = event.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => mealRecipeModal(data.meals[0]));
    }
}

function mealRecipeModal(meal){
    let contentString = ''
    contentString += `
        <h2 class="recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class="recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="recipe-meal-img">
            <img src="${meal.strMealThumb}" alt="food">
        </div>
        <div class="recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
        </div>`;
        mealDetailsContent.innerHTML = contentString;
        mealDetailsContent.parentElement.classList.add('showRecipe');
        document.body.classList.add('lock')
}

// -----------------------------------------------------

