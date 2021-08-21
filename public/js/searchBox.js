let searchBox = document.querySelector('#search-box');
let select = searchBox.querySelector('#select');
let output = searchBox.querySelector('#output');
let countrySelect = searchBox.querySelector('#country-select');
let countryOutput = countrySelect.querySelector('[class$="__content"]');
let citySelect = searchBox.querySelector('#city-select');
let cityOutput = citySelect.querySelector('[class$="__content"]');

let currentSelect;
let selectedTarget;
let reqBody;

select.addEventListener('click', (e) => {

    // Обрабатываем только клики на блоки селектов
    if (!e.target.closest('#country-select')) {
        if (!e.target.closest('#city-select')) {
            return;
        } else {
            currentSelect = e.target.closest('#city-select');
        };
    } else {
        currentSelect = e.target.closest('#country-select');
    };
  
    // Меняем состояние селекта
    toggleState(currentSelect);
    setHeight(currentSelect);
    // Если кликнули на страну/город 
    if (e.target.hasAttribute('data-checked')) {

        selectedTarget = e.target;

        // меняем текст заголовка и ставим атрибут checked 
        setOption(currentSelect, selectedTarget)

        // Если клик был на выбор страны загружаем список городов
        if (currentSelect == countrySelect) {
            setCity(selectedTarget);
        }
        if (currentSelect == citySelect) {
            getClinicList(selectedTarget);
        }
    };
});

function cleanList(listToDelete) {
    listToDelete.forEach(elem => {
        elem.remove();
    });
}

function toggleState(currentSelect) {

    // Получаем массив элементов и суммируем их высоту
    // let collection = Array.from(currentSelect.querySelector('[class$="__content"]').children);
    // let contentHeight = 0;
    // collection.forEach(element => {
    //     contentHeight += element.offsetHeight;
    // });

    // Задаём высоту для списка опций
    // Если высота больше заданной в max-height, то появится сроллбар
    if (currentSelect.dataset.state === 'close') {
        currentSelect.dataset.state = 'open';
        // currentSelect.querySelector('[class$="__content"]').style.height = contentHeight + collection.length + 'px';
    } else {
        currentSelect.dataset.state = 'close';
        // currentSelect.querySelector('[class$="__content"]').style.height = '';
    };
}

function setHeight(currentSelect) {

    // Получаем массив элементов и суммируем их высоту
    let collection = Array.from(currentSelect.querySelector('[class$="__content"]').children);
    let contentHeight = 0;
    collection.forEach(element => {
        contentHeight += element.offsetHeight;
    });

    // Задаём высоту для списка опций
    // Если высота больше заданной в max-height, то появится сроллбар
    if (currentSelect.dataset.state === 'close') {
        currentSelect.querySelector('[class$="__content"]').style.height = '0px'; 
    } else {
        currentSelect.querySelector('[class$="__content"]').style.height = contentHeight + collection.length + 'px';
    };
}

function setOption(currentSelect, selectedTarget) {
    // Устанавливаем checked на выбранную опцию
    if (!selectedTarget.dataset.checked) {
        currentSelect.querySelector('[data-checked=true]').dataset.checked = '';
    };
    selectedTarget.dataset.checked = 'true';

    // Устанавливаем заголовок
    currentSelect.querySelector('.select-text').innerText = selectedTarget.innerText;
}

async function setCity(selectedTarget) {
    let dataValue = selectedTarget.dataset.value;

    if (!dataValue || dataValue == '') return;

    // Если был выбран пункт 'Все страны' с data-value = 0, удаляем все города из списка
    // и устанавливаем пункт 'Все города'
    if (dataValue == '0') {
        setOption(citySelect, citySelect.querySelector('[data-value="0"]'));
        // toggleState(citySelect);
        cleanList(citySelect.querySelectorAll('[data-value]:not([data-value="0"])'));
    } else {
        // Удаляем текущие города и, в зависимости от выбранной страны, загружаем список городов
        setOption(citySelect, citySelect.querySelector('[data-value="0"]'));
        await getCityList(dataValue);
    };
    setHeight(citySelect); 
}

async function getCountryList() {
    let response = await fetch('/getCountryList');
    if (!response.ok) {
        console.log("Ошибка HTTP: " + response.status);
        return;
    };
    let countries = await response.json();

    let countryContainer;
    countries.forEach(country => {
        countryContainer = `<li class="country-select__item" data-value="${country._id}" data-checked>${country.country_name}</li>`;
        // countryOutput.append(countryContainer);
        countryOutput.insertAdjacentHTML('beforeend', countryContainer);
    });
}

getCountryList();

async function getCityList(countryId) {
    reqBody = {
        countryId
    };
    let response = await fetch('/getCityList', {
        method: 'POST',
        // headers: {
        //     'Content-Type': 'application/json;'
        // },
        // body: JSON.stringify(countryId)
        headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }),
        mode: 'same-origin',
        body: JSON.stringify(reqBody),
    });
    if (!response.ok) {
        console.log("Ошибка HTTP: " + response.status);
        return;
    };
    let cities = await response.json();

    // Очищаем список городов, что-бы убрать мерцание опций
    cleanList(citySelect.querySelectorAll('[data-value]:not([data-value="0"])'));
    console.log(cities);
    let cityContainer;
    cities.forEach(city => {
        cityContainer = `<li class="city-select__item" data-value="${city._id}" data-checked>${city.city_name}</li>`;
        cityOutput.insertAdjacentHTML('beforeend', cityContainer);
    });
}

async function getClinicList(selectedTarget) {
    let dataValue = selectedTarget.dataset.value;

    if (!dataValue || dataValue == '') return;
    
    // cleanOutput
    cleanList(Array.from(output.children));
    switch (dataValue) {
        case '0':
            reqBody = {};
            break;
        
        default:
            reqBody = {
                dataValue
            };
            break;
    };
    console.log('dataValue: ', dataValue);
    console.log('reqBody: ', reqBody);
    let response = await fetch('/getClinicList', {
        method: 'POST',
        headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }),
        mode: 'same-origin',
        body: JSON.stringify(reqBody),
    });
    
    if (!response.ok) {
        console.log("Ошибка HTTP: " + response.status);
        return;
    };

    let clinics = await response.json();
    console.log(clinics);

    let clinicContainer;

    if (!clinics.length) {
        clinicContainer = `<li class="city-select__item" data-value="${clinics._id}" data-checked>${clinics.clinic_name}</li>`;
        output.insertAdjacentHTML('beforeend', clinicContainer);
        return;
    };

    clinics.forEach(clinic => {
        clinicContainer = `<li class="city-select__item" data-value="${clinic._id}" data-checked>${clinic.clinic_name}</li>`;
        output.insertAdjacentHTML('beforeend', clinicContainer);
    });
}