import {burgerMenuClose} from './burgerMenu.js';

export function pageScrollInit() {
    document.addEventListener('click', (e) => {
        if (!e.target.dataset.scroll) return;
        e.preventDefault();

        let target = document.querySelector(e.target.dataset.scroll);

        burgerMenuClose();

        try {
            target.scrollIntoView({block: "center", behavior: "smooth"});
        } catch (error) {
            console.log(error);
        }
    });
}