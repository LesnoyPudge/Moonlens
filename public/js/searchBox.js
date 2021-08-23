export function searchBoxInit() {

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
            };
        } else {
            currentSelect = countrySelect;
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
        setCheck(currentSelect, selectedTarget);

        // Устанавливаем заголовок
        currentSelect.querySelector('.select-text').innerText = selectedTarget.innerText;
    }

    function setCheck(currentSelect, selectedTarget) {
        // Устанавливаем checked на выбранную опцию
        if (!selectedTarget.dataset.checked) {
            let targetToUncheck = currentSelect.querySelector('[data-checked=true]');
            if (targetToUncheck) {
                targetToUncheck.dataset.checked = '';
            };
        };
        selectedTarget.dataset.checked = 'true';
    }
    
    async function setCity(selectedTarget) {
        let dataValue = selectedTarget.dataset.value;
    
        if (!dataValue || dataValue == '') return;
    
        // Если был выбран пункт 'Все страны' с data-value = 0, удаляем все города из списка
        // и устанавливаем пункт 'Все города'
        if (dataValue == '0') {
            getClinicList(citySelect.querySelector('[data-value="0"]'));
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
        // console.log(cities);
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
        // console.log('dataValue: ', dataValue);
        // console.log('reqBody: ', reqBody);
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
    
        let clinicList = await response.json();
        
        let clinicContainer;
        let counter = 1;
        if (!clinicList.length) {
            clinicContainer = `
            <li class='output__item' data-id='${clinicList._id}' data-checked>
                <div class='output__name'>${counter}. <b>${clinicList.clinic_name}</b></div>
                <address class='output__address'>${clinicList.clinic_address}</address>
                <div class='output__email'>${clinicList.clinic_email}</div>
                <div class='output__site'>${clinicList.clinic_site}</div>
                <div class='output__phone'>${clinicList.clinic_phone}</div>
            </li>
            `;
            output.insertAdjacentHTML('beforeend', clinicContainer);
            return;
        };
    
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

    // output.addEventListener('click', (e) => {
        
    //     if (!e.target.closest('[class$=item]')) return;

    //     let selectedTarget = e.target.closest('[class$=item]');
    //     let clinicId = selectedTarget.dataset.id;

    //     setCheck(output, selectedTarget);

    //     let clinicCoords = getCordsById(clinicId);
    //     myMap.setCenter(clinicCoords);
    //     objectManager.objects.balloon.close();
    //     myMap.setZoom(12);
    //     myMap.panTo(clinicCoords, {
    //         delay: 0,
    //         flying: true
    //     });

    //     setTimeout(
    //         function () {
    //             objectManager.objects.balloon.open(clinicId);
    //         }, 700);
    //     objectManager.objects.setObjectOptions(clinicId, {
    //         iconImageHref: 'images/map__icon--light.svg'
    //     });

    // });

    // function getCordsById(id) {
    //     return objectManager.objects._objectsById[id].geometry.coordinates;
    // }

}

export default searchBoxInit;