import mapInit from './map.js';
import searchBoxInit from './searchBox.js';
import {faqInit} from './FAQ.js';
import {recommendationInit} from './recommendtion.js';


recommendationInit();

faqInit();

ymaps.ready(mapInit);

searchBoxInit();
