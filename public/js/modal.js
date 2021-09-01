import {toggleState} from './searchBox.js';

export function modalOpen(modalWindow) {

    if (modalWindow.style.display == 'none' || !modalWindow.style.display) {
        

        // Добавляем отступ шириной равной ширине скролла
        // console.log(`${window.innerWidth} - ${document.body.clientWidth}`)

        document.body.style.paddingRight = window.innerWidth - document.body.clientWidth + 'px';
        document.body.style.overflow = 'hidden';
        toggleState(modalWindow);
    }
}

export function modalClose(modalWindow) {
    if (modalWindow.dataset.state == 'close') return;
    
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';

    toggleState(modalWindow);
}

export function emptyFieldsValidate(modalWindow, modalBox, fields) {
    let validated = true;

    fields.forEach((field) => {
        if (!field.value) {
            field.parentElement.style.borderColor = 'red';
            field.required = true;
            validated = false;
        } else {
            field.parentElement.style.borderColor = '';
        }
    });

    if (validated) {
        alert('мы с вами свяжемся');
        modalClose(modalWindow, modalBox);
        cleanFields(fields);
    }
}

export function cleanFields(fields) {
    fields.forEach((field) => {
        field.value = '';
        field.parentElement.style.borderColor = '';
        field.required = false;
    });
}