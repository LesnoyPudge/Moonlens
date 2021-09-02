import {burgerMenuClose} from './burgerMenu.js';

export function pageScrollInit() {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('[data-scroll]')) return;
        e.preventDefault();

        let target = document.querySelector(e.target.closest('[data-scroll]').dataset.scroll);

        burgerMenuClose();

        try {
            target.scrollIntoView({block: "center", behavior: "smooth"});
        } catch (error) {
            console.log(error);
        }
    });
}