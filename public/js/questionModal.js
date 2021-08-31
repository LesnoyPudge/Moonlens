import {modalOpen, modalClose, emptyFieldsValidate, cleanFields} from './modal.js';

let modalWindow = document.querySelector('#question-modal');
let questionBox = modalWindow.querySelector('#question-box');
let questionForm = questionBox.querySelector('#question-form');
let textArea = questionForm.querySelector('[name=textarea]');
let fieldsList = questionForm.querySelectorAll('.outlined-input');


export function questionModalOpen() {

    modalOpen(modalWindow);

    textArea.addEventListener('input', onTextAreaInput);
    modalWindow.addEventListener('click', clickCheck);
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

function clickCheck(event) {
    if (event.target.closest('.modal-close') || event.target.className == 'modal__wrapper') {
        questionModalClose();
    } 
}