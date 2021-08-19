import mapInit from './map.js';

// Создаём карту
ymaps.ready(mapInit);

let searchBox = document.querySelector('#search-box');

let countrySelect = searchBox.querySelector('#country-select');
let citySelect = searchBox.querySelector('#city-select');

