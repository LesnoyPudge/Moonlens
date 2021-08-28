import {modalOpen, modalClose} from './modal.js';

let modalWindow = document.querySelector('#how-it-works-modal');
let questionBox = modalWindow.querySelector('#how-it-works-box');
let wrapper = modalWindow.querySelector('[class$=__wrapper]');
let closeButton = questionBox.querySelector('.modal-close');


export function howItWorksModalInit() {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.more-info-button')) return;

        howItWorksModalOpen();
    });
}

function howItWorksModalOpen() {

    modalOpen(modalWindow);

    closeButton.addEventListener('click', howItWorksModalClose);
    wrapper.addEventListener('click', howItWorksModalClose);
}

function howItWorksModalClose() {
    modalClose(modalWindow);
}