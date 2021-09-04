import {modalOpen, modalClose} from './modal.js';

let modalWindow = document.querySelector('#video-modal');
let modalBox = modalWindow.querySelector('#video-box');

export function recommendationModalOpen(videoSrc) {

    if (!modalBox.querySelector('iframe')) {
        let iframe = document.createElement('iframe');
        iframe.src = videoSrc;
        iframe.width = window.innerWidth * 0.8;
        iframe.height = iframe.width * (9/16);
        iframe.allow = `accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`;
        iframe.allowFullscreen = true;

        modalBox.append(iframe);
    }

    modalOpen(modalWindow);

    modalWindow.addEventListener('click', clickCheck);
}

function recommendationModalClose() {
    modalClose(modalWindow);
    modalBox.querySelector('iframe').remove();
}

function clickCheck(event) {
    if (event.target.closest('.modal-close') || event.target.className == 'modal__wrapper') {
        recommendationModalClose();
    } 
}