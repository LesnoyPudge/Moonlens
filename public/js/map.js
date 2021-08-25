import {setCheck, toggleState} from "./searchBox.js";
import {modalOpen} from "./orderModal.js";

export function init() {
    let myMap = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 9
    }, {
        searchControlProvider: 'yandex#search'
    }),
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 64,
            clusterDisableClickZoom: false,
            // geoObjectOpenBalloonOnClick: false,
        });

    myMap.geoObjects.add(objectManager);
    myMap.behaviors.disable('scrollZoom');

    // Определение пользовательского модуля с зависимостями.
    ymaps.modules.define('CustomLayoutModule', [
        'templateLayoutFactory',
        'layout.storage'
    ], function (provide, templateLayoutFactory, layoutStorage) {
        let customLayoutClass = templateLayoutFactory.createClass(
            `<div class="map__balloon balloon">
            <div class="balloon__body">
            <div class="arrow"></div>
            $[[options.contentLayout]]
            <img class="balloon__close" src="images/close-button.svg">
            </div>
            </div>`,
            {
                build: function () {
                    this.constructor.superclass.build.call(this);

                    this._$element = $('.balloon', this.getParentElement());

                    this._$element.find('.balloon__close')
                        .on('click', $.proxy(this.onCloseClick, this));
                },
                clear: function () {
                    this._$element.find('.balloon__close')
                        .off('click');

                    this.constructor.superclass.clear.call(this);
                },
                onSublayoutSizeChange: function () {
                    MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

                    if (!this._isElement(this._$element)) {
                        return;
                    }

                    this.events.fire('shapechange');
                },
                applyElementOffset: function () {
                    this._$element.css({
                        left: -(this._$element[0].offsetWidth / 2),
                        top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
                    });
                },
                onCloseClick: function (e) {
                    e.preventDefault();
                    this.events.fire('userclose');
                },
                getShape: function () {
                    if (!this._isElement(this._$element)) {
                        return MyBalloonLayout.superclass.getShape.call(this);
                    }

                    var position = this._$element.position();

                    return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                        [position.left, position.top], [
                            position.left + this._$element[0].offsetWidth,
                            position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
                        ]
                    ]));
                },
                _isElement: function (element) {
                    return element && element[0] && element.find('.arrow')[0];
                }
            }

        );
        layoutStorage.add('customLayout', customLayoutClass);
        provide(customLayoutClass);
    });

    // Определение пользовательского модуля с зависимостями.
    ymaps.modules.define('CustomContentLayoutModule', [
        'templateLayoutFactory',
        'layout.storage'
    ], function (provide, templateLayoutFactory, layoutStorage) {
        var customContentLayoutClass = templateLayoutFactory.createClass(
            `<div class="balloon__content">
            <h5 class="balloon__title">{{ properties.clinic_name|default:"идет загрузка..." }}</h5>
            <address class="balloon__address">{{ properties.clinic_address|default:"не указан" }}</address>
            <a class="balloon__email" href="mailto:{{ properties.clinic_email|default:"" }}">{{ properties.clinic_email|default:"не указан" }}</a>
            <a class="balloon__site" href="#" >{{ properties.clinic_site|default:"не указан" }}</a>
            <a class="balloon__phone" href="tel:{{ properties.clinic_phone|default:"" }}">{{ properties.clinic_phone|default:"не указан" }}</a>
            <button type="button" class="balloon__order-button order-button" id="order-button" data-clinic-id="{{ properties.clinic_id}}">Записаться на приём</button>
            </div>`
        );
        layoutStorage.add('customContentLayout', customContentLayoutClass);
        provide(customContentLayoutClass);
    });

    ymaps.modules.define('MyIconContentLayoutModule', [
        'templateLayoutFactory',
        'layout.storage'
    ], function (provide, templateLayoutFactory, layoutStorage) {
        let MyIconContentLayoutClass = templateLayoutFactory.createClass(
            `<svg class="map-icon" id="$[id]" data-state="">
                <use xlink:href="#map-icon"></use>
            </svg>`
        );
        layoutStorage.add('MyIconContentLayout', MyIconContentLayoutClass);
        provide(MyIconContentLayoutClass);
    });
    

    // Запрос пользовательского макета
    ymaps.modules.require(['CustomContentLayoutModule']);
    ymaps.modules.require(['CustomLayoutModule']);
    ymaps.modules.require(['MyIconContentLayoutModule']);




    //Events

    objectManager.objects.events.add('balloonopen', (e) => {

        // Получим объект, на котором открылся балун.
        let objectId = e.get('objectId');
        let geoObject = objectManager.objects.getById(objectId);
        
        // Переключаем состояние метки и меняем её цвет
        toggleState(document.getElementById(objectId));

        // Загрузим данные для балуна
        downloadContent([geoObject], objectId).then(() => {
            // Добавляем обработчик для кнопки "Записаться на приём"
            // modalInit([geoObject], objectId);
            // map.addEventListener('click', handler);
        });

        
    });

    objectManager.objects.events.add('balloonclose', (e) => {

        let objectId = e.get('objectId');

        toggleState(document.getElementById(objectId));
    });

    objectManager.objects.events.add('click', (e) => {
        
        let objectId = e.get('objectId');

        if (objectManager.objects.balloon.isOpen(objectId)) {
            objectManager.objects.balloon.close();
        } 
    });

    myMap.events.add('click', () => {
        myMap.balloon.close();
    });

    // При нажатии на кнопку "Записаться на приём" вызываем modalOpen
    map.addEventListener('click', (e) => {
        if (e.target.id != 'order-button') return;

        let objectId = e.target.dataset.clinicId;
        let geoObject = objectManager.objects.getById(objectId);
        modalOpen(geoObject);
    });


    // Конец ивентов

    
    // Загружаем содержимое балуна
    async function downloadContent(geoObjects, id, isCluster) {
        // Создадим массив меток, для которых данные ещё не загружены.
        let array = geoObjects.filter(function (geoObject) {
            return geoObject.properties.balloonTitle === 'идет загрузка...' ||
                geoObject.properties.balloonTitle === 'Not found';
        }),
            // Формируем массив идентификаторов, который будет передан серверу.
            ids = array.map(function (geoObject) {
                return geoObject.id;
            });
        if (ids.length) {
            // Запрос к серверу.
            // Сервер обработает массив идентификаторов и на его основе
            // вернет JSON-объект, содержащий текст балуна для
            // заданных меток.
            ymaps.vow.resolve($.getJSON({
                contentType: 'application/json',
                type: 'POST',
                data: JSON.stringify(ids),
                url: '/clinicDesc',
                dataType: 'json',
                processData: false
            })).then(
                function (data) {
                    // console.log(data);
                    // console.log(data.clinic_name);
                    // console.log(geoObjects);
                    // console.log(geoObjects[0]);
                    
                    geoObjects.forEach(function (geoObject) {
                        // Содержимое балуна берем из данных, полученных от сервера.
                        // Сервер возвращает массив объектов вида:
                        // [ {"clinic_name": "Содержимое балуна"}, ...]
                        geoObject.properties.country_name = data.country_name;
                        geoObject.properties.city_name = data.city_name;
                        geoObject.properties.clinic_id = data.clinic_id;
                        geoObject.properties.clinic_name = data.clinic_name;
                        geoObject.properties.clinic_address = data.clinic_address;
                        geoObject.properties.clinic_email = data.clinic_email;
                        geoObject.properties.clinic_site = data.clinic_site;
                        geoObject.properties.clinic_phone = data.clinic_phone;
                    });
                    // Оповещаем балун, что нужно применить новые данные.
                    setNewData();
                }, function () {
                    geoObjects.forEach(function (geoObject) {
                        geoObject.properties.clinic_title = 'Not found';
                    });
                    // Оповещаем балун, что нужно применить новые данные.
                    setNewData();
                }
            );
        }
    
        function setNewData() {
            if (isCluster && objectManager.clusters.balloon.isOpen(id)) {
                objectManager.clusters.balloon.setData(objectManager.clusters.balloon.getData());
            } else if (objectManager.objects.balloon.isOpen(id)) {
                objectManager.objects.balloon.setData(objectManager.objects.balloon.getData());
            }
        }
    }
    
    
    // Отображаем метки клиник на карте
    $.ajax({
        url: "/clinicCoords"
    }).done(function (data) {
        objectManager.add(data);
    });
    
    // НЕ РАБОТАЕТ:)
    // fetch('/clinicCoords')
    //     .then((response) => {
    //         objectManager.add(response);
    //     });
    

    // Обрабатываем клики по элементам в поле вывода клиник
    output.addEventListener('click', (e) => {
        
        if (!e.target.closest('[class$=item]')) return;
    
        let selectedTarget = e.target.closest('[class$=item]');
        let clinicId = selectedTarget.dataset.id;
        let clinicCoords = getCordsById(clinicId);

        setCheck(output, selectedTarget);

        // Перемещаем карты на координаты клиники
        myMap.setCenter(clinicCoords);
        myMap.setZoom(11);
        myMap.panTo(clinicCoords, {
            delay: 0,
            flying: false
        }).then(() => {
            objectManager.objects.balloon.open(clinicId);
        });
    });
    
    function getCordsById(id) {
        return objectManager.objects._objectsById[id].geometry.coordinates;
    }


}       

export default init;