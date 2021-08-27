import {modalOpen, modalClose} from './modal.js';

let modalWindow = document.querySelector('#video-modal');
let modalBox = modalWindow.querySelector('#video-box');
let wrapper = modalWindow.querySelector('[class$=__wrapper]');

export function recommendationModalOpen(videoSrc) {

    if (!modalBox.querySelector('iframe')) {
        let iframe = document.createElement('iframe');
        // Добавить зависимость размеров от размера окна браузера
        iframe.src = videoSrc;
        iframe.height = 480;
        iframe.width = 854;
        iframe.allow = `accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`;
        iframe.allowFullscreen = true;

        modalBox.append(iframe);
    }

    modalOpen(modalWindow);

    wrapper.addEventListener('click', recommendationModalClose);
}

function recommendationModalClose() {
    modalClose(modalWindow);
    modalBox.querySelector('iframe').remove();
}