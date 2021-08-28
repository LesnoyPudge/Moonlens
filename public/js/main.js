import mapInit from './map.js';
import searchBoxInit from './searchBox.js';
import {faqInit} from './FAQ.js';
import {recommendationInit} from './recommendtion.js';
import {howItWorksModalInit} from './howItWorksModal.js';
import {pageScrollInit} from './pageScroll.js';

pageScrollInit();

howItWorksModalInit();  

recommendationInit();

faqInit();

ymaps.ready(mapInit);

searchBoxInit();
