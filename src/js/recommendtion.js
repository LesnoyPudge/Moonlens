import {sliderInit} from './recommendationSlider.js';
import {recommendationModalOpen} from './recommendationModal.js';


export function recommendationInit() {
    let section = document.querySelector('#recommendation');

    // Создаём слайдер
    sliderInit();
    
    // Обрабатываем открытие видео
    section.addEventListener('click', (e) => {
        if (!e.target.closest('#video-play-button')) return;

        e.preventDefault();
        recommendationModalOpen(e.target.closest('#video-play-button').dataset.src);
    });
}

