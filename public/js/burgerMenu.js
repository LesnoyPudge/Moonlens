import {toggleState} from './searchBox.js';

let header = document.querySelector('#header');
let navbar = header.querySelector('#navbar');
let burgerButton = navbar.querySelector('#burger');
let nav = navbar.querySelector('#nav');

export function burgerMenuInit() {
    burgerButton.addEventListener('click', () => {
        if (navbar.dataset.state == 'close' || !navbar.dataset.state) {
            burgerMenuOpen();
        } else {
            burgerMenuClose();
        }
    });
}

function burgerMenuOpen() {
    header.style.marginBottom = navbar.clientHeight + 'px';
    // nav.style.visibility = 'visible';
    // console.log(`
    // nav.innerHeight: ${nav.innerHeight}
    // nav.clientHeight: ${nav.clientHeight}
    // nav.scrollHeight: ${nav.scrollHeight}
    // nav.offsetHeight: ${nav.offsetHeight}
    // `);
    // if (questionItem.dataset.state == 'open') {
    //     itemText.style.height = itemText.scrollHeight + 'px';
    // } else {
    //     itemText.style.height = '';
    // }
    // nav.style.height = nav.scrollHeight + 'px';
    toggleState(navbar);
}

export function burgerMenuClose() {
    if (navbar.dataset.state == 'open') {
        header.style.marginBottom = '';
        // nav.style.visibility = 'hidden';
        // nav.style.height = 0;
        toggleState(navbar);
    }
}