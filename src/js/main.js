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
        list.innerHTML += `<li class="js-li" data-id="${dataAnime[i].mal_id}" data-title="${dataAnime[i].title}"> <img class="js-img" src="${dataAnime[i].image_url}" alt="Foto"><p>${dataAnime[i].title}</p></li>`;
      }


      function renderListItemFav(event) {
        event.currentTarget.classList.toggle('favourite');
        const serieTitle = event.currentTarget.dataset.title;
        for (const iSerie of listSeriesArr) {
          let favData = {
            title: iSerie.title,
            img: iSerie.image_url,
            id: iSerie.mal_id,
          };
          if (serieTitle === iSerie.title) {
            listFavourites.innerHTML += `<li class="js-li" data-id="${favData.id}" data-title="${favData.title}"> <img class="js-img" src="${favData.img}" alt="Foto"> <p>${favData.title}</p><button class="js-btnX">X</button></li>`;
            listFavouriteArr.push(favData);
            localStorage.setItem('Fav', JSON.stringify(listFavouriteArr));
          }
        }
      }

      /* function compare () {
          const selectSerieResults = listSeriesArr.find(  row  => row.title ===  AnimeTitle  );
          console.log(selectSerieResults);
          const serieFav = listFavouriteArr.find(  row => row.title === AnimeTitle );
          console.log(serieFav);

          if (selectSerieResults.title && serieFav.title === AnimeTitle) {
            console.log('No añadir');
          }
        }
      } */


      // Comprobar una lista con otra para que solo se añada 1 vez a fav cada serie.
      // Comprobar añadir/quitar con cada uno a favoritos.
      // Hacer que funcione boton individual para borrar fav, y del localSt.
      // Al cargar la pagina, si esta en fav mantener el fondo y la letra.


      const allLi = document.querySelectorAll('.js-li');
      for (const eachLi of allLi) {
        eachLi.addEventListener('click', (renderListItemFav));
      }

    });
}

function useLocalfav () {
  const localFav = JSON.parse(localStorage.getItem('Fav'));
  if (localFav === null) {
    listFavourites.innerHTML = '';
  } else {
    for (const item of localFav) {
      listFavourites.innerHTML +=  `<li class="js-li" data-id="${item.id}" data-title="${item.title}"> <img class="js-img" src="${item.img}" alt="Foto"><p>${item.title}</p><button class="js-btnX">X</button></li>`;
      listFavouriteArr.push(item);
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

function handleClickReset (ev) {
  ev.preventDefault();
  list.innerHTML = '';
  inputSearch.value = '';
}


btnSearch.addEventListener('click', handleClickSearch);
btnReset.addEventListener('click', handleClickReset);

