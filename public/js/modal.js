import {toggleState} from './searchBox.js';

export function modalOpen(modalWindow) {

    if (modalWindow.style.display == 'none' || !modalWindow.style.display) {
        document.body.style.overflow = 'hidden';
        modalWindow.style.display = 'block';
        
        setTimeout(() => {
            toggleState(modalWindow);
        }, 0);
    }
}

export function modalClose(modalWindow) {
    document.body.style.overflow = '';

    toggleState(modalWindow);

    setTimeout(() => {
        if (modalWindow.dataset.state = 'close') {
            modalWindow.style.display = 'none';
        }
    }, 200); 
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
        };
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