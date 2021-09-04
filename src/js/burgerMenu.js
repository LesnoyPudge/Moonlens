import {toggleState} from './searchBox.js';
import {windowLock} from './modal.js';

let header = document.querySelector('#header');
let navbar = header.querySelector('#navbar');
let burgerButton = navbar.querySelector('#burger');

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
            burgerMenuClose();
        }
    });

    document.addEventListener(
        'scroll',
        () => {
            if (window.scrollY > navbar.clientHeight) {
                if (!navbar.classList.contains('navbar--fixed')) {
                    navbar.classList.add('navbar--fixed');
                }
            } else {
                if (navbar.classList.contains('navbar--fixed')) {
                    navbar.classList.remove('navbar--fixed');
                }
            }
        }, 
        { passive: true }
    );
    
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