"use strict";
const input = document.querySelector(".search-input");
const btn = document.querySelector(".search-button");
const result = document.querySelector(".series-container");
const fav = document.querySelector(".fav-choose");
let favList = [];
let list = [];

//Get and Save in LocalStorage
const getSavedFavsFromLocalStorage = JSON.parse(
  localStorage.getItem("userFavs")
);
const setFavsIntoLocalStorage = arr => {
  localStorage.setItem("userFavs", JSON.stringify(arr));
};

//Get series from API
const getDatafromApi = event => {
  event.preventDefault();
  fetch(`http://api.tvmaze.com/search/shows?q=${input.value}`)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        list = data;
        paintSeries(data);
      } else {
        result.innerHTML = "No hay resultados para esta búsqueda";
      }
    });
};

//paint series in DOM
const paintSeries = arrShows => {
  result.innerHTML = "";
  for (let i = 0; i < arrShows.length; i++) {
    const nameData = arrShows[i].show.name;
    const imgData = arrShows[i].show.image;
    const idData = arrShows[i].show.id;

    //Containers and classes
    const boxShow = document.createElement("div");
    boxShow.classList.add("show-container");
    // boxShow.setAttribute("data-id", idData);
    const nameShow = document.createElement("h4");
    nameShow.classList.add("name-show");
    const imgShow = document.createElement("img");
    imgShow.classList.add("img-show");
    const idShow = document.createElement("p");
    idShow.classList.add("id-show");

    const idContent = document.createTextNode(idData);

    const nameContentinData = document.createTextNode(nameData);
    if (imgData === null) {
      imgShow.src =
        "https://via.placeholder.com/210x295/ffffff/666666/?text=TV";
    } else {
      imgShow.src = imgData.medium || imgData.original;
    }

    result.appendChild(boxShow);
    boxShow.appendChild(imgShow);
    boxShow.appendChild(nameShow);
    boxShow.appendChild(idShow);
    nameShow.appendChild(nameContentinData);
    idShow.appendChild(idContent);

    boxShow.addEventListener("click", pickAsFav);
  }
};

//Clear fav section in DOM
const clearFav = () => {
  fav.innerHTML = "";
};

//Paint fav shows in DOM
const paintFav = arr => {
  clearFav();

  const favList = document.createElement("ul");
  favList.classList.add("fav-list");
  fav.appendChild(favList);

  for (let item of arr) {
    const favImgData = item.img;
    const favNameData = item.name;
    const favIdData = item.id;

    //Containers and classes
    const favBoxShow = document.createElement("li");
    favBoxShow.classList.add("fav-box-show");
    // favBoxShow.setAttribute("data-id", favIdData);
    const favNameShow = document.createElement("h3");
    favNameShow.classList.add("fav-name-show");
    const favImgShow = document.createElement("img");
    favImgShow.classList.add("fav-img-show");
    const favDelete = document.createElement("div");
    favDelete.classList.add("fav-delete");
    const favIdShow = document.createElement("div");
    favIdShow.classList.add("fav-id-show");

    const favIdContent = document.createTextNode(favIdData);
    const favNameContent = document.createTextNode(favNameData);
    favImgShow.src = favImgData;

    favList.appendChild(favBoxShow);
    favBoxShow.appendChild(favImgShow);
    favBoxShow.appendChild(favNameShow);
    favBoxShow.appendChild(favIdShow);
    favBoxShow.appendChild(favDelete);
    favNameShow.appendChild(favNameContent);
    favIdShow.appendChild(favIdContent);

    favDelete.addEventListener("click", deleteFav);
  }
};

//Delete from fav
function deleteFav(e) {
  const trigger = e.currentTarget;
  const parent = trigger.parentElement;

  const img = parent.querySelector(".fav-img-show");
  const name = parent.querySelector(".fav-name-show");
  const id = parent.querySelector(".fav-id-show");

  const favImg = img.src;
  const favName = name.innerHTML;
  const favId = id.innerHTML;

  const favObj = { img: favImg, name: favName, id: favId };

  for (let i = 0; i < favList.length; i++) {
    if (favList[i].id === favObj.id) {
      favList.splice(i, 1);
    }
  }
  setFavsIntoLocalStorage(favList);
  paintFav(favList);
}

//Pick series as fav
const pickAsFav = e => {
  const trigger = e.currentTarget;
  trigger.classList.toggle("fav-show");

  const img = trigger.querySelector(".img-show");
  const name = trigger.querySelector(".name-show");
  const id = trigger.querySelector(".id-show");

  const favImg = img.src;
  const favName = name.innerHTML;
  const favId = id.innerHTML;

  const favObj = { img: favImg, name: favName, id: favId };

  // favList.push(list[2]);

  if (trigger.classList.contains("fav-show")) {
    favList.push(favObj);
  }
  setFavsIntoLocalStorage(favList);
  paintFav(favList);
};
//Get from LocalStorage
const getFromLocalStorage = () => {
  if (getSavedFavsFromLocalStorage !== null) {
    favList = getSavedFavsFromLocalStorage;
    paintFav(getSavedFavsFromLocalStorage);
  } else {
    favList = [];
  }
};

getFromLocalStorage();
btn.addEventListener("click", getDatafromApi);
