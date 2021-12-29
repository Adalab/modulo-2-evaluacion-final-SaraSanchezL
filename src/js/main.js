'use strict';

const btnSearch = document.querySelector('.js-btnSearch');
const btnReset = document.querySelector('.js-btnReset');
const list = document.querySelector('.js-list');
const inputSearch = document.querySelector('.js-inputSearch');
const listFavourites = document.querySelector('.js-listFavourites');
const btnDeleteAllFav = document.querySelector('.js-btnDeleteAll');

let listSeries = [];  // Comprobar si se utiliza.
let listFavouriteArr = [];


function getDataSeries () {
  fetch(`https://api.jikan.moe/v3/search/anime?q=${inputSearch.value}`)
    .then(response => response.json())
    .then(data => {
      const dataAnime = data.results;
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
        list.innerHTML += `<li class="js-li" data-id="${dataAnime[i].mal_id}" data-img="${dataAnime[i].image_url}" data-title="${dataAnime[i].title}"> <img class="js-img" src="${dataAnime[i].image_url}" alt="Foto">
          <p>${dataAnime[i].title}</p></li>`;
        let listSeriesOb = {
          img: dataAnime[i].image_url,
          title: dataAnime[i].title,
          id: dataAnime[i].mal_id,
        };
        listSeries.push(listSeriesOb);
      }

      function renderListItemFav(event) {
        const AnimeTitle = event.currentTarget.dataset.title;
        const AnimeImg = event.currentTarget.dataset.img;
        const AnimeId = event.currentTarget.dataset.id;
        const classFav = event.currentTarget.classList.toggle('favourite');
        let dataFav = {
          img: AnimeImg,
          title: AnimeTitle,
          id: AnimeId,
          class: classFav,
        };

        if (classFav === true){
          listFavourites.innerHTML += `<li class="js-li" data-id="${dataFav.mal_id}" ><img class="js-img" src="${dataFav.img}" alt="Foto">
          <p>${dataFav.title}</p><button class="js-btnX">X</button></li>`;
        } else {
          listFavourites.innerHTML = '';
          listFavouriteArr.splice(0);
        }
        // Comprobar añadir/quitar con cada uno a favoritos.


        /* const serieDeleteFav = AnimeId;
        const FavIndex = listFavouriteArr.findIndex(( serie ) => serie.id === serieDeleteFav);
        const ListIndex = listSeries.findIndex((serie => serie.id === serieDeleteFav));
        if (FavIndex === ListIndex) {
          listFavouriteArr.splice(FavIndex, 1);
           const FavIndex = listFavouriteArr.findIndex(( serie ) => serie.class === false);
          const ListIndex = listSeries.findIndex(( serie ) => serie.class === false);
          if (ListIndex === FavIndex) {
          listFavouriteArr.splice(FavIndex, 1);
          console.log(FavIndex);
          console.log(listFavouriteArr);*/

        listFavouriteArr.push(dataFav);
        localStorage.setItem('Fav', JSON.stringify(listFavouriteArr));
      }

      const allLi = document.querySelectorAll('.js-li');
      for (const eachLi of allLi) {
        eachLi.addEventListener('click', (renderListItemFav));
      }

      // Hacer que funcione boton individual para borrar fav.
      /*
      const allBtn = document.querySelectorAll('.js-btnX');
      for (const eachBtn of allBtn) {
        eachBtn.addEventListener('click', (handleClickDeleteBtn));
      }
      function handleClickDeleteBtn (event) {
        event.currentTarget;
        listFavourites.innerHTML = '';
      }*/

    });
}

function useLocalfav () {
  const localFav = JSON.parse(localStorage.getItem('Fav'));
  if (localFav === null) {
    listFavourites.innerHTML = '';
  } else {
    for (const item of localFav) {
      listFavourites.innerHTML +=  `<li class="js-li" data-id="${item.id}" ><img class="js-img" src="${item.img}" alt="Foto">
      <p>${item.title}</p><button class="js-btnX">X</button></li>`;
      listFavouriteArr.push(item);
    }
  }
}
useLocalfav ();


function handleDeleteAllFav (event) {
  event.preventDefault();
  listFavourites.innerHTML = '';
  localStorage.removeItem('Fav');
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

