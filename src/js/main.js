'use strict';

const btnSearch = document.querySelector('.js-btnSearch');
const btnReset = document.querySelector('.js-btnReset');
const list = document.querySelector('.js-list');
const inputSearch = document.querySelector('.js-inputSearch');
const listFavourites = document.querySelector('.js-listFavourites');
const btnDeleteAllFav = document.querySelector('.js-btnDeleteAll');

let listFavouriteArr = [];


function getDataSeries () {
  fetch(`https://api.jikan.moe/v3/search/anime?q=${inputSearch.value}`)
    .then(response => response.json())
    .then(data => {
      const dataAnime = data.results;
      list.innerHTML = '';
      for (let i = 0; i < dataAnime.length; i++) {
        //Comprobar si sustituye la imagen.
        if (dataAnime[i].image_url === '') {
          dataAnime[i].image_url = `https://via.placeholder.com/210x295/ffffff/666666/?
          text=${inputSearch.value}`;
        } else {
          dataAnime[i].image_url;
        }
        list.innerHTML += `<li class="js-li" data-img="${dataAnime[i].image_url}" data-title="${dataAnime[i].title}"> <img class="js-img" src="${dataAnime[i].image_url}" alt="Foto">
          <p>${dataAnime[i].title}</p></li>`;
      }

      function renderListItemFav(event) {
        const favAnimeTitle = event.currentTarget.dataset.title;
        const favAnimeImg = event.currentTarget.dataset.img;
        let dataFav = {
          img: favAnimeImg,
          title: favAnimeTitle,
        };
        event.currentTarget.classList.toggle('favourite');
        for (let i = 0; i < dataAnime.length; i++) {
          if (favAnimeTitle === dataAnime[i].title){
            listFavourites.innerHTML += `<li class="js-li"><img class="js-img" src="${dataAnime[i].image_url}" alt="Foto">
          <p>${dataAnime[i].title}</p></li><button class="js-btnX">X</button>`;
          }
        }
        listFavouriteArr.push(dataFav);
        // console.log(listFavouriteArr);
        localStorage.setItem('Fav', JSON.stringify(listFavouriteArr));

      }
      const allLi = document.querySelectorAll('.js-li');
      for (const eachLi of allLi) {
        eachLi.addEventListener('click', (renderListItemFav));
      }

    });
}

function useLocalfav () {
  const localFav = JSON.parse(localStorage.getItem('Fav'));
  // console.log(localFav);
  if (localFav === null) {
    listFavourites.innerHTML = '';
  } else {
    for (const item of localFav) {
      listFavourites.innerHTML += item.img + item.title;
    }
  }
}
useLocalfav ();  // Carga url y no la imagen.

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

