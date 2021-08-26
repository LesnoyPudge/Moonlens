import {modalOpen, modalClose, emptyFieldsValidate, cleanFields} from './modal.js';

let modalWindow = document.querySelector('#order-modal');
let orderBox = modalWindow.querySelector('#order-box');
let wrapper = modalWindow.querySelector('[class$=__wrapper]');
let closeButton = orderBox.querySelector('#modal-close');
let orderForm = orderBox.querySelector('#order-form');
let fieldsList = orderForm.querySelectorAll('.outlined-input');


export function orderModalOpen(geoObject) {
    modalOpen(modalWindow);

    orderForm.querySelector('[name=clinic-name]').value = geoObject.properties.clinic_name;
    orderForm.querySelector('[name=clinic-city]').value = geoObject.properties.country_name + ', ' + geoObject.properties.city_name;

    closeButton.addEventListener('click', orderModalClose);

    wrapper.addEventListener('click', orderModalClose);

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

// function validateForm(event) {
//     let validated = true;
//     event.preventDefault();

//     if (!orderForm.querySelector('[name=client-name]').value) {
//         orderForm.querySelector('[name=client-name]').parentElement.style.borderColor = 'red';
//         orderForm.querySelector('[name=client-name]').required = true;
//         validated = false;
//     } else {
//         orderForm.querySelector('[name=client-name]').parentElement.style.borderColor = '';
//     };

//     if (!orderForm.querySelector('[name=client-phone]').value) {
//         orderForm.querySelector('[name=client-phone]').parentElement.style.borderColor = 'red';
//         orderForm.querySelector('[name=client-phone]').required = true;
//         validated = false;
//     } else {
//         orderForm.querySelector('[name=client-phone]').parentElement.style.borderColor = '';
//     };

//     if (validated) {
//         alert('мы вам перезвоним');
//         modalClose(modalWindow, orderBox);
//     }
// }
