import {modalOpen, modalClose} from './modal.js';

let modalWindow = document.querySelector('#how-it-works-modal');

export function howItWorksModalInit() {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.more-info-button')) return;
        howItWorksModalOpen();
    });
}

function howItWorksModalOpen() {
    modalOpen(modalWindow);
    modalWindow.addEventListener('click', clickCheck);
}

function clickCheck(event) {
    if (event.target.closest('.modal-close') || event.target.className == 'modal__wrapper') {
        modalClose(modalWindow);
    } 
}