import {modalOpen, modalClose, emptyFieldsValidate, cleanFields} from './modal.js';

let modalWindow = document.querySelector('#question-modal');
let questionBox = modalWindow.querySelector('#question-box');
let questionForm = questionBox.querySelector('#question-form');
let textArea = questionForm.querySelector('[name=textarea]');
let wrapper = modalWindow.querySelector('[class$=__wrapper]');
let closeButton = questionBox.querySelector('.modal-close');
let fieldsList = questionForm.querySelectorAll('.outlined-input');


export function questionModalOpen() {

    modalOpen(modalWindow);

    textArea.addEventListener('input', onTextAreaInput);
    closeButton.addEventListener('click', questionModalClose);
    wrapper.addEventListener('click', questionModalClose);
    questionForm.addEventListener('submit', questionModalValidate);
}

function questionModalClose() {
    modalClose(modalWindow);
    cleanFields(fieldsList);
}

function onTextAreaInput() {
    console.log('input');
    textArea.style.height = textArea.scrollHeight + 'px';
}

function questionModalValidate (event) {
    event.preventDefault();
    emptyFieldsValidate(modalWindow, questionBox, fieldsList);
}