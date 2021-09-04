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


export function searchBoxInit() {

    getClinicList(citySelect.querySelector('[data-value="0"]'));
    setHeight(citySelect);
    setHeight(countrySelect);
    getCountryList();
    setOption(citySelect, citySelect.querySelector('[data-value="0"]'))
    setOption(countrySelect, countrySelect.querySelector('[data-value="0"]'))

    select.addEventListener('click', (e) => {

        // Обрабатываем только клики на блоки селектов
        if (!e.target.closest('#country-select')) {
            if (!e.target.closest('#city-select')) {
                return;
            } else {
                currentSelect = citySelect;
            }
        } else {
            currentSelect = countrySelect;
        }
      
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
        }
    });
}

function cleanList(listToDelete) {
    listToDelete.forEach(elem => {
        elem.remove();
    });
}

export function toggleState(currentSelect) {
    if (currentSelect.dataset.state == 'close' || currentSelect.dataset.state == '') {
        currentSelect.dataset.state = 'open';
    } else {
        currentSelect.dataset.state = 'close';
    }
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
    }
}

function setOption(currentSelect, selectedTarget) {

    // Устанавливаем checked на выбранную опцию
    setCheck(currentSelect, selectedTarget);

    // Устанавливаем заголовок
    currentSelect.querySelector('.select-text').innerText = selectedTarget.innerText;

    // Устанавливаем id выбранной опции
    currentSelect.dataset.value = selectedTarget.dataset.value;
}



async function setCity(selectedTarget) {
    let dataValue = selectedTarget.dataset.value;

    if (!dataValue || dataValue == '') return;

    // Если был выбран пункт 'Все страны' с data-value = 0, удаляем все города из списка
    // и устанавливаем пункт 'Все города'
    if (dataValue == '0') {
        getClinicList(citySelect.querySelector('[data-value="0"]'));
        setOption(citySelect, citySelect.querySelector('[data-value="0"]'));
        cleanList(citySelect.querySelectorAll('[data-value]:not([data-value="0"])'));
    } else {
        // Удаляем текущие города и, в зависимости от выбранной страны, загружаем список городов
        setOption(citySelect, citySelect.querySelector('[data-value="0"]'));
        await getCityList(dataValue);

        getClinicList(selectedTarget)
    }
    setHeight(citySelect); 
}


async function getCountryList() {
    let response = await fetch('/getCountryList');
    if (!response.ok) {
        console.log("Ошибка HTTP: " + response.status);
        return;
    }
    let countries = await response.json();

    let countryContainer;
    countries.forEach(country => {
        countryContainer = `<li class="country-select__item" data-value="${country._id}" data-checked>${country.country_name}</li>`;
        countryOutput.insertAdjacentHTML('beforeend', countryContainer);
    });
}

async function getCityList(countryId) {
    reqBody = {
        countryId
    };
    let response = await fetch('/getCityList', {
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
    }
    let cities = await response.json();

    // Очищаем список городов, что-бы убрать мерцание опций
    cleanList(citySelect.querySelectorAll('[data-value]:not([data-value="0"])'));
    let cityContainer;
    cities.forEach(city => {
        cityContainer = `<li class="city-select__item" data-value="${city._id}" data-checked>${city.city_name}</li>`;
        cityOutput.insertAdjacentHTML('beforeend', cityContainer);
    });
}

async function getClinicList(selectedTarget) {
    let dataValue = selectedTarget.dataset.value;
    if (!dataValue || dataValue == '') return;

    cleanList(Array.from(output.children));
    let isCountry = true;


    // Вывод списка всех клиник при первой инициализации карты
    if (selectedTarget.className.includes('city') && !countrySelect.dataset.value) {
        switch (dataValue) {
            case '0':
                reqBody = {};
                break;
            
            default:
                reqBody = {
                    dataValue
                };
                break;
        }
    // Если выбранной опцией был город при уже установленной стране
    } else if (selectedTarget.className.includes('city') && countrySelect.dataset.value != '0') {
        switch (dataValue) {
            case '0':
                // При выборе опции "Все города" меняем dataValue на id страны
                // и добавляем параметр isCountry, из за чего выборка будет из стран, а не городов
                dataValue = countrySelect.dataset.value;
                reqBody = {
                    dataValue,
                    isCountry
                };
                break;
            
            default:
                reqBody = {
                    dataValue,
                };
                break;
        }
    // Если выбранной опцией был город (все города), но страна не выбрана
    } else if (selectedTarget.className.includes('city') && countrySelect.dataset.value == '0') {
        switch (dataValue) {
            case '0':
                reqBody = {};
                break;
            
            default:
                break;
        }

    // Если выбранной опцией была страна
    } else if (selectedTarget.className.includes('country')) {
        switch (dataValue) {
            case '0':
                return;
            
            default:
                reqBody = {
                    dataValue,
                    isCountry
                };
                break;
        }
    }

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
    }

    let clinicList = await response.json();
    
    let clinicContainer;
    let counter = 1;

    clinicList.forEach(clinic => {
        clinicContainer = `
        <li class='output__item' data-id='${clinic._id}' data-checked>
            <div class='output__name'>${counter}. <b>${clinic.clinic_name}</b></div>
            <address class='output__address'>${clinic.clinic_address}</address>
            <div class='output__email'>${clinic.clinic_email}</div>
            <div class='output__site'>${clinic.clinic_site}</div>
            <div class='output__phone'>${clinic.clinic_phone}</div>
        </li>
        `;
        counter++;
        output.insertAdjacentHTML('beforeend', clinicContainer);
    });
}

export function setCheck(currentSelect, selectedTarget) {
    // Устанавливаем checked на выбранную опцию
    if (!selectedTarget.dataset.checked) {
        let targetToUncheck = currentSelect.querySelector('[data-checked=true]');
        if (targetToUncheck) {
            targetToUncheck.dataset.checked = '';
        }
    }
    selectedTarget.dataset.checked = 'true';
}