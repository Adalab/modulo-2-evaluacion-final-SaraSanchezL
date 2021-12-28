'use strict';

const btnSearch = document.querySelector('.js-btnSearch');
const btnReset = document.querySelector('.js-btnReset');
const list = document.querySelector('.js-list');
const inputSearch = document.querySelector('.js-inputSearch');
const listFavourites = document.querySelector('.js-listFavourites');



let listFavouriteAnime = [];


function getDataSeries () {
  fetch(`https://api.jikan.moe/v3/search/anime?q=${inputSearch.value}`)
    .then(response => response.json())
    .then(data => {
      const dataAnime = data.results;
      list.innerHTML = '';
      for (let i = 0; i < dataAnime.length; i++) {
        if (dataAnime[i].image_url === '') {
          dataAnime[i].image_url = `https://via.placeholder.com/210x295/ffffff/666666/?
          text=${inputSearch.value}`;
        } else {
          dataAnime[i].image_url;
        }
        list.innerHTML += `<li class="js-li" data-title="${dataAnime[i].title}"> <img class="js-img" src="${dataAnime[i].image_url}" alt="Foto">
          <p>${dataAnime[i].title}</p></li>`;
      }

      const allLi = document.querySelectorAll('.js-li');
      function getEachLi () {
        for (const eachLi of allLi) {
          eachLi.addEventListener('click', (event) => event.currentTarget.classList.toggle('favourite'));
        }
      }
      getEachLi();
    });
}



function handleClickSearch(event) {
  event.preventDefault();
  getDataSeries();
}

function handleClickReset (ev) {
  ev.preventDefault();
  list.innerHTML = '';
  inputSearch.value = '';
}


btnSearch.addEventListener('click', handleClickSearch);
btnReset.addEventListener('click', handleClickReset);

