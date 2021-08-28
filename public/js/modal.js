import {toggleState} from './searchBox.js';

export function modalOpen(modalWindow) {

    if (modalWindow.style.display == 'none' || !modalWindow.style.display) {
        document.body.style.overflow = 'hidden';

        // Добавляем отступ шириной равной ширине скролла
        document.body.style.paddingRight = document.body.scrollWidth - window.innerWidth + 'px';

        toggleState(modalWindow);
    }
}

export function modalClose(modalWindow) {
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