'use strict';

const btnSearch = document.querySelector('.js-btnSearch');
const btnReset = document.querySelector('.js-btnReset');
const list = document.querySelector('.js-list');
const inputSearch = document.querySelector('.js-inputSearch');
const listFavourites = document.querySelector('.js-listFavourites');
const btnDeleteAllFav = document.querySelector('.js-btnDeleteAll');

let listSeriesArr = [];
let listFavouriteArr = [];


function getDataSeries () {
  fetch(`https://api.jikan.moe/v3/search/anime?q=${inputSearch.value}`)
    .then(response => response.json())
    .then(data => {
      const dataAnime = data.results;
      listSeriesArr = dataAnime;
      list.innerHTML = '';
      for (let i = 0; i < dataAnime.length; i++) {
        const imgData = dataAnime[i].image_url;
        //Comprobar si sustituye la imagen.
        if (imgData === '') {
          imgData.innerHTML = `https://via.placeholder.com/210x295/ffffff/666666/?
          text=${inputSearch.value}`;
        } else {
          imgData;
        }
        list.innerHTML += `<li class="js-li" data-id="${dataAnime[i].mal_id}"> <img class="js-img" src="${dataAnime[i].image_url}" alt="Serie Image"><p>${dataAnime[i].title}</p></li>`;
      }


      function handleClickrenderListFav(event) {
        const serieID = parseInt(event.currentTarget.dataset.id);
        for (const eachSerie of listSeriesArr) {
          let favData = {
            mal_id: eachSerie.mal_id,
            url: eachSerie.url,
            image_url: eachSerie.image_url,
            title: eachSerie.title,
            airing: eachSerie.airing,
            synopsis: eachSerie.synopsis,
            type: eachSerie.type,
            episodes: eachSerie.episodes,
            score: eachSerie.score,
            start_date: eachSerie.start_date,
            end_date: eachSerie.end_date,
            members: eachSerie.members,
            rated: eachSerie.rated,
          };

          if (serieID === eachSerie.mal_id) {
            event.currentTarget.classList.add('favourite');
            listFavourites.innerHTML += `<li class="js-li" data-id="${favData.mal_id}"> <img class="js-img" src="${favData.image_url}" alt="Serie Image"> <p>${favData.title}</p><button class="js-btnX" id="${favData.mal_id}">X</button></li>`;
            listFavouriteArr.push(favData);
            localStorage.setItem('Fav', JSON.stringify(listFavouriteArr));
          }
        }

        const allBtnX = document.querySelectorAll('.js-btnX');
        for (const eachBtn of allBtnX) {
          eachBtn.addEventListener('click', handleClickdeleteOne);
        }

      }

      const allLi = document.querySelectorAll('.js-li');
      for (const eachLi of allLi) {
        eachLi.addEventListener('click', (handleClickrenderListFav));
      }

      function handleClickdeleteOne (event) {
        const eachIdBtn = event.currentTarget.id;
        listFavourites.innerHTML = '';
        const resultFav = listFavouriteArr.findIndex( ((row) => row.mal_id === parseInt(eachIdBtn)));
        listFavouriteArr.splice(resultFav, 1);
        localStorage.setItem('Fav', JSON.stringify(listFavouriteArr));
        for (const eachfav of listFavouriteArr) {
          listFavourites.innerHTML += `<li class="js-li" data-id="${eachfav.mal_id}"> <img class="js-img" src="${eachfav.image_url}" alt="Serie Image"> <p>${eachfav.title}</p><button class="js-btnX" id="${eachfav.mal_id}">X</button></li>`;
          const allBtnX = document.querySelectorAll('.js-btnX');
          for (const eachBtn of allBtnX) {
            eachBtn.addEventListener('click', handleClickdeleteOne);
          }
        }
      }
    });
}

function useLocalfav () {
  const localFav = JSON.parse(localStorage.getItem('Fav'));
  if (localFav === null) {
    listFavourites.innerHTML = '';
  } else {
    for (const item of localFav) {
      listFavourites.innerHTML +=  `<li class="js-li" data-id="${item.mal_id}"> <img class="js-img" src="${item.image_url}" alt="Serie Image"> <p>${item.title}</p><button class="js-btnX" id="${item.mal_id}">X</button></li>`;
      listFavouriteArr.push(item);
    }
  }
  const allBtnX = document.querySelectorAll('.js-btnX');
  for (const eachBtn of allBtnX) {
    eachBtn.addEventListener('click', handleClickdeleteOneLocal);
  }
  function handleClickdeleteOneLocal (event) {
    const eachIdBtn = event.currentTarget.id;
    listFavourites.innerHTML = '';
    const resultFav = listFavouriteArr.findIndex( ((row) => row.mal_id === parseInt(eachIdBtn)));
    listFavouriteArr.splice(resultFav, 1);
    localStorage.setItem('Fav', JSON.stringify(listFavouriteArr));
    for (const eachfav of listFavouriteArr) {
      listFavourites.innerHTML += `<li class="js-li" data-id="${eachfav.mal_id}"> <img class="js-img" src="${eachfav.image_url}" alt="Serie Image"> <p>${eachfav.title}</p><button class="js-btnX" id="${eachfav.mal_id}">X</button></li>`;
      const allBtnX = document.querySelectorAll('.js-btnX');
      for (const eachBtn of allBtnX) {
        eachBtn.addEventListener('click', handleClickdeleteOneLocal);
      }
    }
  }
}
useLocalfav ();

function handleDeleteAllFav (event) {
  event.preventDefault();
  listFavourites.innerHTML = '';
  localStorage.removeItem('Fav');
  listFavouriteArr = [];
}
btnDeleteAllFav.addEventListener('click', (handleDeleteAllFav));

function handleClickSearch(event) {
  event.preventDefault();
  getDataSeries();
}

function handleClickReset (event) {
  event.preventDefault();
  list.innerHTML = '';
  inputSearch.value = '';
}

btnSearch.addEventListener('click', handleClickSearch);
btnReset.addEventListener('click', handleClickReset);


//Comprobar si sustituye la imagen.
// Comprobar una lista con otra para que solo se añada 1 vez a fav cada serie.
// Comprobar añadir/quitar con cada uno a favoritos al clickar en la lista de results.
// Al cargar la pagina, si esta en fav mantener el fondo y la letra.