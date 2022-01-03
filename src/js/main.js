'use strict';

// Variables globales.
const btnSearch = document.querySelector('.js-btnSearch');
const btnReset = document.querySelector('.js-btnReset');
const listResults = document.querySelector('.js-list');
const inputSearch = document.querySelector('.js-inputSearch');
const listFavourites = document.querySelector('.js-listFavourites');
const btnDeleteAllFav = document.querySelector('.js-btnDeleteAll');
const textError = document.querySelector('.js-textError');

let listSeriesArr = [];
let listFavouriteArr = [];

// Función petición servidor + función evento btn buscar para pintar en resultados, función evento Li para pintar en favoritos.
function getDataSeries () {
  fetch(`https://api.jikan.moe/v3/search/anime?q=${inputSearch.value}`)
    .then(response => response.json())
    .then(data => {
      const dataAnime = data.results;
      listSeriesArr = dataAnime;
      listResults.innerHTML = '';
      for (let i = 0; i < dataAnime.length; i++) {
        const imgData = dataAnime[i].image_url;
        if (imgData === null) {
          imgData.innerHTML = `https://via.placeholder.com/210x295/ffffff/666666/?
          text=${inputSearch.value}`;
        } else {
          imgData;
        }
        listResults.innerHTML += `<li class="js-li" id="${dataAnime[i].mal_id}" data-id="${dataAnime[i].mal_id}"> <img class="js-img cursorSelectFav" src="${dataAnime[i].image_url}" alt="Serie Image"><p class="cursorSelectFav">${dataAnime[i].title}</p></li>`;
      }

      function handleClickRenderListFav(event) {
        event.preventDefault();
        const serieID = parseInt(event.currentTarget.dataset.id);
        for (const eachSerie of listSeriesArr) {
          let favData = {
            malId: eachSerie.mal_id,
            url: eachSerie.url,
            imageUrl: eachSerie.image_url,
            title: eachSerie.title,
            airing: eachSerie.airing,
            synopsis: eachSerie.synopsis,
            type: eachSerie.type,
            episodes: eachSerie.episodes,
            score: eachSerie.score,
            startDate: eachSerie.start_date,
            endDate: eachSerie.end_date,
            members: eachSerie.members,
            rated: eachSerie.rated,
          };

          if (serieID === eachSerie.mal_id) {
            listFavourites.innerHTML = '';
            event.currentTarget.classList.toggle('favourite');

            const resultFav = listFavouriteArr.findIndex((row => row.malId === serieID));
            if (resultFav === -1) {
              listFavouriteArr.push(favData);
              localStorage.setItem('Fav', JSON.stringify(listFavouriteArr));
            } else {
              listFavouriteArr.splice(resultFav, 1);
              localStorage.setItem('Fav', JSON.stringify(listFavouriteArr));
            }
            for (const eachFav of listFavouriteArr){
              listFavourites.innerHTML += `<li class="js-li" data-id="${eachFav.malId}"> <img class="js-img" src="${eachFav.imageUrl}" alt="Serie Image"> <p>${eachFav.title}</p><button class="js-btnX colorBtnX" id="${eachFav.malId}">X</button></li>`;
            }
          }
        }
        const allBtnX = document.querySelectorAll('.js-btnX');
        for (const eachBtn of allBtnX) {
          eachBtn.addEventListener('click', handleClickDeleteOne);
        }
      }

      const allLi = document.querySelectorAll('.js-li');
      for (const eachLi of allLi) {
        eachLi.addEventListener('click', (handleClickRenderListFav));
      }

      for (const eachFav of listFavouriteArr) {
        const oneIdFav = eachFav.malId;
        for (const oneLi of allLi){
          const oneIdLi = parseInt(oneLi.id);
          if (oneIdLi === oneIdFav) {
            oneLi.classList.add('favourite');
          }
        }
      }

    });
}

// Funcion usar datos LocalStorage.
function useLocalFav () {
  const localFav = JSON.parse(localStorage.getItem('Fav'));
  if (localFav === null) {
    listFavourites.innerHTML = '';
  } else {
    for (const itemLocal of localFav) {
      listFavourites.innerHTML += `<li class="js-li" data-id="${itemLocal.malId}"> <img class="js-img" src="${itemLocal.imageUrl}" alt="Serie Image"> <p>${itemLocal.title}</p><button class="js-btnX colorBtnX" id="${itemLocal.malId}">X</button></li>`;
      listFavouriteArr.push(itemLocal);
    }
  }

}
useLocalFav ();

// Funcion boton X de listFav.
const allBtnX = document.querySelectorAll('.js-btnX');
for (const eachBtn of allBtnX) {
  eachBtn.addEventListener('click', handleClickDeleteOne);
}
function handleClickDeleteOne (event) {
  event.preventDefault();
  const eachIdBtn = event.currentTarget.id;
  listFavourites.innerHTML = '';
  const resultFav = listFavouriteArr.findIndex( ((row) => row.malId === parseInt(eachIdBtn)));
  listFavouriteArr.splice(resultFav, 1);
  localStorage.setItem('Fav', JSON.stringify(listFavouriteArr));
  for (const eachFav of listFavouriteArr) {
    listFavourites.innerHTML += `<li class="js-li" data-id="${eachFav.malId}"> <img class="js-img" src="${eachFav.imageUrl}" alt="Serie Image"> <p>${eachFav.title}</p><button class="js-btnX colorBtnX" id="${eachFav.malId}">X</button></li>`;
    const allBtnX = document.querySelectorAll('.js-btnX');
    for (const eachBtn of allBtnX) {
      eachBtn.addEventListener('click', handleClickDeleteOne);
    }
  }
}

// Funciones Input, boton Buscar, Reset y Borrar Lista.
function handleDeleteAllFav (event) {
  event.preventDefault();
  listFavourites.innerHTML = '';
  localStorage.removeItem('Fav');
  listFavouriteArr = [];
}

function handleInputSearch () {
  if (inputSearch.value === '') {
    textError.innerHTML = 'Campo de búsqueda vacío';
    btnSearch.setAttribute('disabled', 'disabled');
  } else {
    textError.innerHTML = '';
    btnSearch.removeAttribute('disabled');
  }
}

function handleClickSearch(event) {
  event.preventDefault();
  getDataSeries();
}

function handleClickReset (event) {
  event.preventDefault();
  listResults.innerHTML = '';
  inputSearch.value = '';
  textError.innerHTML = '';
  handleInputSearch ();
}

btnDeleteAllFav.addEventListener('click', (handleDeleteAllFav));
inputSearch.addEventListener('keyup', handleInputSearch);
btnSearch.addEventListener('click', handleClickSearch);
btnReset.addEventListener('click', handleClickReset);

