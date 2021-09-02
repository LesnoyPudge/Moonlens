import {toggleState} from './searchBox.js';
import {windowLock} from './modal.js';

let header = document.querySelector('#header');
let navbar = header.querySelector('#navbar');
let burgerButton = navbar.querySelector('#burger');
// let nav = navbar.querySelector('#nav');

export function burgerMenuInit() {
    burgerButton.addEventListener('click', () => {
        if (navbar.dataset.state == 'close' || !navbar.dataset.state) {
            burgerMenuOpen();
        } else {
            burgerMenuClose();
        }
    });

    // Закрываем мобильное меню если ширина экрана больше той, 
    // при которой отбражается burger
    window.addEventListener('resize', () => {
        if (!window.matchMedia('(max-width: 992px)').matches) {
            // console.log(window.matchMedia('(max-width: 992px)').matches)
            burgerMenuClose();
        }
    });
}

function burgerMenuOpen() {
    windowLock();
    toggleState(navbar);
}

export function burgerMenuClose() {
    if (navbar.dataset.state == 'open') {
        windowLock();
        toggleState(navbar);
    }
}