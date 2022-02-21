'use strict';

// Variables globales.
const btnSearch = document.querySelector('.js-btnSearch');
const btnReset = document.querySelector('.js-btnReset');
const listResults = document.querySelector('.js-list');
const inputSearch = document.querySelector('.js-inputSearch');
const listFavourites = document.querySelector('.js-listFavourites');
const btnDeleteAllFav = document.querySelector('.js-btnDeleteAll');
const textError = document.querySelector('.js-textError');
const form = document.querySelector('.js-form');

let listSeriesArr = [];
let listFavouriteArr = [];


// Función petición servidor, añadir evento click resultados para pintar en fav, pintar como favorito en resultados si esta en array fav.
function getDataSeries() {
  fetch(`https://api.jikan.moe/v3/search/anime?q=${inputSearch.value}`)
    .then(response => response.json())
    .then(data => {
      const dataAnime = data.results;
      const dataMapAnime = dataAnime.map((anime => {
        const objectDataAnime = {
          id: anime.mal_id,
          title: anime.title,
          img: anime.image_url,
          airing: anime.airing,
          url: anime.url
        };
        return objectDataAnime;
      }));
      listSeriesArr = dataMapAnime;
      listResults.innerHTML = '';
      for (let i = 0; i < listSeriesArr.length; i++) {
        if (dataAnime[i].airing === false) {
          listResults.innerHTML += `<li class="js-li colorLi" id="${listSeriesArr[i].id}" data-id="${listSeriesArr[i].id}"> <img class="js-img cursorSelectFav" title="Marcar / Desmarcar Favorita" src="${listSeriesArr[i].img}" alt="Serie Image"><p class="cursorSelectFav" title="Marcar / Desmarcar Favorita">${listSeriesArr[i].title}</p> <p> ${listSeriesArr[i].airing} : No se está transmitiendo. </p> </li>`;

        } else {
          listResults.innerHTML += `<li class="js-li colorLi" id="${listSeriesArr[i].id}" data-id="${listSeriesArr[i].id}"> <img class="js-img cursorSelectFav" title="Marcar / Desmarcar Favorita" src="${listSeriesArr[i].img}" alt="Serie Image"><p class="cursorSelectFav" title="Marcar / Desmarcar Favorita">${listSeriesArr[i].title}</p> <p> ${listSeriesArr[i].airing} : Se está transmitiendo. Click para ver más detalle.</p></li> <li><a class="link" href="${listSeriesArr[i].url}">Más detalles</a></li>`;
        }
      }

      const allLi = document.querySelectorAll('.js-li');
      for (const eachLi of allLi) {
        eachLi.addEventListener('click', (handleClickRenderListFav));
      }

      for (const eachFav of listFavouriteArr) {
        const oneIdFav = eachFav.malId;
        for (const oneLi of allLi) {
          const oneIdLi = parseInt(oneLi.id);
          if (oneIdLi === oneIdFav) {
            oneLi.classList.add('favourite');
          }
        }
      }

    });
}

// Función renderizar lista fav al clickar en lista resultados, evento click boton X, evento click lista favoritos.
function handleClickRenderListFav(event) {
  event.preventDefault();
  const serieID = parseInt(event.currentTarget.dataset.id);
  for (const eachSerie of listSeriesArr) {
    let favData = {
      malId: eachSerie.id,
      url: eachSerie.url,
      imageUrl: eachSerie.img,
      title: eachSerie.title,
      airing: eachSerie.airing,
    };

    if (serieID === eachSerie.id) {
      listFavourites.innerHTML = '';

      const resultFav = listFavouriteArr.findIndex((row => row.malId === serieID));
      if (resultFav === -1) {
        event.currentTarget.classList.add('favourite');
        listFavouriteArr.push(favData);
        localStorage.setItem('Fav', JSON.stringify(listFavouriteArr));
      } else {
        event.currentTarget.classList.remove('favourite');
        listFavouriteArr.splice(resultFav, 1);
        localStorage.setItem('Fav', JSON.stringify(listFavouriteArr));
      }
      renderFavHTML();
    }
  }
  const allBtnX = document.querySelectorAll('.js-btnX');
  for (const eachBtn of allBtnX) {
    eachBtn.addEventListener('click', handleClickDeleteOne);
  }

  const allLiFav = document.querySelectorAll('.js-liFav');
  for (const eachLiFav of allLiFav) {
    eachLiFav.addEventListener('click', handleClickListFav);
  }
}
// Funcion clickar lista de fav y mostrar titulo por consola.
function handleClickListFav(event) {
  const liIdFav = parseInt(event.currentTarget.dataset.id);
  const resultFindFav = listFavouriteArr.find((row => row.malId === liIdFav));
  if (resultFindFav !== -1) {
    //console.log(resultFindFav.title);
  }
}

//Funcion bucle for en array favoritos para pintar en HTML.
function renderFavHTML() {
  for (const eachFav of listFavouriteArr) {
    listFavourites.innerHTML += `<li class="js-liFav colorLi" data-id="${eachFav.malId}"> <img class="js-img" src="${eachFav.imageUrl}" alt="Serie Image"> <p>${eachFav.title}</p><button class="js-btnX colorBtnX" title="Pulse para borrar de la lista" id="${eachFav.malId}">X</button></li>`;
  }
}

// Funcion usar datos LocalStorage.
function useLocalFav() {
  const localFav = JSON.parse(localStorage.getItem('Fav'));
  if (localFav === null) {
    listFavourites.innerHTML = '';
  } else {
    for (const itemLocal of localFav) {
      listFavourites.innerHTML += `<li class="js-li colorLi" data-id="${itemLocal.malId}"> <img class="js-img" src="${itemLocal.imageUrl}" alt="Serie Image"> <p>${itemLocal.title}</p><button class="js-btnX colorBtnX" title="Pulse para borrar de la lista" id="${itemLocal.malId}">X</button></li>`;
      listFavouriteArr.push(itemLocal);
    }
  }
}
useLocalFav();

// Funcion boton X de list fav.
const allBtnX = document.querySelectorAll('.js-btnX');
for (const eachBtn of allBtnX) {
  eachBtn.addEventListener('click', handleClickDeleteOne);
}
function handleClickDeleteOne(event) {
  event.preventDefault();
  const eachIdBtn = event.currentTarget.id;
  listFavourites.innerHTML = '';

  const allLi = document.querySelectorAll('.js-li');
  for (const eachLi of allLi) {
    const eachID = eachLi.id;
    if (eachID === eachIdBtn) {
      eachLi.classList.remove('favourite');
    }
  }

  const resultFav = listFavouriteArr.findIndex(((row) => row.malId === parseInt(eachIdBtn)));
  listFavouriteArr.splice(resultFav, 1);
  localStorage.setItem('Fav', JSON.stringify(listFavouriteArr));

  renderFavHTML();
  const allBtnX = document.querySelectorAll('.js-btnX');
  for (const eachBtn of allBtnX) {
    eachBtn.addEventListener('click', handleClickDeleteOne);
  }
}

// Funciones  Borrar Lista, Input, boton Buscar, Reset.
function handleDeleteAllFav(event) {
  event.preventDefault();
  listFavourites.innerHTML = '';
  localStorage.removeItem('Fav');
  listFavouriteArr = [];
  const allLi = document.querySelectorAll('.js-li');
  for (const eachLi of allLi) {
    const eachID = eachLi.id;
    const resultFav = listFavouriteArr.findIndex((row => row.malId === eachID));
    if (resultFav === -1) {
      eachLi.classList.remove('favourite');
    }
  }
}
btnDeleteAllFav.addEventListener('click', (handleDeleteAllFav));

function handleInputSearch() {
  if (inputSearch.value === '') {
    textError.innerHTML = 'Campo de búsqueda vacío';
    btnSearch.setAttribute('disabled', 'disabled');
  } else {
    textError.innerHTML = '';
    btnSearch.removeAttribute('disabled');
  }
}
inputSearch.addEventListener('keyup', handleInputSearch);

function handleClickSearch(event) {
  event.preventDefault();
  getDataSeries();
}
btnSearch.addEventListener('click', handleClickSearch);

function handleClickReset(event) {
  event.preventDefault();
  listResults.innerHTML = '';
  inputSearch.value = '';
  handleInputSearch();
  textError.innerHTML = '';
}
btnReset.addEventListener('click', handleClickReset);

const handleForm = (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
  }
};
form.addEventListener('keypress', handleForm);


