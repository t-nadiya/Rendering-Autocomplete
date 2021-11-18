import {menuData} from './data.js';

const tabs = document.getElementsByClassName('program-btn')
const contents = document.getElementsByClassName('program-text')
const dayBtn = document.querySelectorAll('.week-content a');
const container = document.querySelector('.week-menu');

for (let i = 0; i < tabs.length; i++) {
    tabs[i].onclick = function () {
      let currentBtn = tabs[i];
      let tabId = currentBtn.getAttribute('data-program')
      let curentContent = document.getElementById(tabId)

          for (let i = 0; i < contents.length; i++) {
            contents[i].classList.remove('active') 
          }
          for (let i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove('active') 
          }
          
      currentBtn.classList.add('active')
      curentContent.classList.add('active')

      for (let i = 0; i < dayBtn.length; i++) {
          dayBtn[i].onclick = function () {  
              let currentDay = dayBtn[i]
                  for (let i = 0; i < dayBtn.length; i++) {
                  dayBtn[i].classList.remove('active') 
                  }
              currentDay.classList.add('active')
              
              let program = menuData[tabId]
              const filteredMenu = program.filter((dayMenu) => {
                  return dayMenu.id == this.dataset.forDay
              })
              renderMenu(filteredMenu, container)
          }
      }
      document.querySelector('.week-content a').click()
    }
  }
  
function renderMenu(menuArray, menuWrapper) {
  let contentString = '';

  menuArray.forEach(daymenu => {
    contentString += `
    <div id="${daymenu.id}" class="day-menu active" data-day="">
        <div class="menu">
            <div class="tbl-title">Меню</div>
                <div class="tbl-body">
                    <div class="flex tbl-row">
                      <div>Завтрак</div>
                      <div class="flex tbl-body-content">
                          <div class="dishes">${daymenu.breakfast.dish}</div>
                          <div class="weight">${daymenu.breakfast.weight}</div>
                      </div> 
                      </div>
                    <div class="flex tbl-row">
                      <div>Обед</div>
                      <div class="flex tbl-body-content">
                          <div class="dishes">
                            <span>${daymenu.lunch.dish.first_dish}</span>
                            <span>${daymenu.lunch.dish.second_dish}</span>
                          </div>
                          <div class="weight">
                            <span>${daymenu.lunch.weight.first_weight}</span>
                            <span>${daymenu.lunch.weight.second_weight}</span>
                          </div>
                      </div> 
                    </div>
                    <div class="flex tbl-row">
                      <div>Полдник</div>
                      <div class="flex tbl-body-content">
                          <div class="dishes">${daymenu.snack.dish}</div>
                          <div class="weight">${daymenu.snack.weight}</div> 
                      </div> 
                    </div>
                    <div class="flex tbl-row">
                      <div>Ужин</div>
                      <div class="flex tbl-body-content">
                          <div class="dishes">
                            <span>${daymenu.dinner.dish.first_dish}</span>
                            <span>${daymenu.dinner.dish.second_dish}</span>
                          </div>
                          <div class="weight">
                            <span>${daymenu.dinner.weight.first_weight}</span>
                            <span>${daymenu.dinner.weight.second_weight}</span>
                          </div>
                      </div> 
                  </div>
              </div>
        </div>
    </div>
  `
});

menuWrapper.innerHTML = contentString;
}

document.querySelector('.programs button').click()
