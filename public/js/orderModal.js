import {modalOpen, modalClose, emptyFieldsValidate, cleanFields} from './modal.js';

let modalWindow = document.querySelector('#order-modal');
let orderBox = modalWindow.querySelector('#order-box');
let orderForm = orderBox.querySelector('#order-form');
let fieldsList = orderForm.querySelectorAll('.outlined-input');


export function orderModalOpen(geoObject) {
    modalOpen(modalWindow);
    // console.log(geoObject);
    orderForm.querySelector('[name=clinic-name]').value = geoObject.properties.clinic_name;
    orderForm.querySelector('[name=clinic-city]').value = geoObject.properties.country_name + ', ' + geoObject.properties.city_name;

    modalWindow.addEventListener('click', clickCheck);
    orderForm.addEventListener('submit', orderModalValidate);
}

function orderModalClose() {
    modalClose(modalWindow);
    cleanFields(fieldsList);
}

function orderModalValidate (event) {
    event.preventDefault();
    emptyFieldsValidate(modalWindow, orderBox, fieldsList);
}

function clickCheck(event) {
    if (event.target.closest('.modal-close') || event.target.className == 'modal__wrapper') {
        orderModalClose();
    } 
}