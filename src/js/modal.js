import {toggleState} from './searchBox.js';

export function modalOpen(modalWindow) {

    if (modalWindow.style.display == 'none' || !modalWindow.style.display) {
        // Добавляем отступ шириной равной ширине скролла
        windowLock();
        toggleState(modalWindow);
    }
}

export function modalClose(modalWindow) {
    if (modalWindow.dataset.state == 'close') return;
    windowLock();
    toggleState(modalWindow);
}

export function windowLock() {
    if (document.body.style.paddingRight && document.body.style.overflow) {
        scrollPadding();
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    } else {
        scrollPadding();
        document.body.style.paddingRight = window.innerWidth - document.body.clientWidth + 'px';
        document.body.style.overflow = 'hidden';
    }
}

function scrollPadding() {
    let itemList = document.querySelectorAll('.scroll-padding');
    itemList.forEach((item) => {
        if (item.style.paddingRight) {
            item.style.paddingRight = '';
        } else {
            // Расчитываем паддинг элемента и добавляем к нему ширину скролла
            item.style.paddingRight = +(getComputedStyle(item).paddingRight.slice(0,-2)) + window.innerWidth - document.body.clientWidth + 'px';
        }
    });
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