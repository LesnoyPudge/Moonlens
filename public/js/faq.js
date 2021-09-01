import {toggleState} from './searchBox.js';
import {questionModalOpen} from './questionModal.js';

let faqSection = document.querySelector('#FAQ');
let faqQuestion = faqSection.querySelector('#FAQ-questions');

export function faqInit() {

    faqSection.addEventListener('click', (e) => {
        if (!e.target.closest('#question-button')) return;

        e.preventDefault();
        questionModalOpen();
    });

    faqQuestion.addEventListener('click', (e) => {
        
        if (!e.target.closest('.questions__item')) return;
        if (e.target.tagName == 'P' || e.target.classList == 'questions__text') return;

        let questionItem = e.target.closest('.questions__item');
        let itemText = questionItem.querySelector('.questions__text');

        toggleState(questionItem);
        
        if (questionItem.dataset.state == 'open') {
            itemText.style.height = itemText.scrollHeight + 'px';
        } else {
            itemText.style.height = '';
        }
    });

}