ymaps.ready(init);

function init() {
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
            clusterDisableClickZoom: false
        });

    myMap.geoObjects.add(objectManager);
    myMap.behaviors.disable('scrollZoom');

    // Определение пользовательского модуля с зависимостями.
    ymaps.modules.define('CustomLayoutModule', [
        'templateLayoutFactory',
        'layout.storage'
    ], function (provide, templateLayoutFactory, layoutStorage) {
        let customLayoutClass = templateLayoutFactory.createClass(
            '<div class="map__balloon balloon">' +
            '<div class="balloon__body">' +
            '<div class="arrow"></div>' +
            '$[[options.contentLayout]]' +
            '<img class="balloon__close" src="images/balloon__close.svg">' +
            '</div>' +
            '</div>',
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
            // '<div class="balloon__content">' +
            // '<h5 class="balloon__title">{{ properties.clinic_title|default:"идет загрузка..." }}</h5>' +
            // '<address class="balloon__address">{{ properties.clinic_address|default:"не указан" }}</address>' +
            // '<a class="balloon__email" href="mailto:{{ properties.clinic_email|default:"" }}">{{ properties.clinic_email|default:"не указан" }}</a>' +
            // '<a class="balloon__site-link" href="#" >{{ properties.clinic_siteLink|default:"не указан" }}</a> ' +
            // '<a class="balloon__phone" href="tel:{{ properties.clinic_phone|default:"" }}">{{ properties.clinic_phone|default:"не указан" }}</a> ' +
            // '<a href="#" class="balloon__order-button">Записаться на приём</a>' +
            // '</div>'

            `<div class="balloon__content">
            <h5 class="balloon__title">{{ properties.clinic_title|default:"идет загрузка..." }}</h5>
            <address class="balloon__address">{{ properties.clinic_address|default:"не указан" }}</address>
            <a class="balloon__email" href="mailto:{{ properties.clinic_email|default:"" }}">{{ properties.clinic_email|default:"не указан" }}</a>
            <a class="balloon__site-link" href="#" >{{ properties.clinic_siteLink|default:"не указан" }}</a>
            <a class="balloon__phone" href="tel:{{ properties.clinic_phone|default:"" }}">{{ properties.clinic_phone|default:"не указан" }}</a>
            <a href="#" class="balloon__order-button">Записаться на приём</a>
            </div>`
        );
        layoutStorage.add('customContentLayout', customContentLayoutClass);
        provide(customContentLayoutClass);
    });

    // Запрос пользовательского макета
    ymaps.modules.require(['CustomContentLayoutModule'])
        .spread(
            function (CustomContentLayoutModule) {
                // ...
            },
            this
    );
    ymaps.modules.require(['CustomLayoutModule'])
        .spread(
            function (CustomLayoutModule) {
                // ...
            },
            this
    );


    objectManager.objects.events.add('balloonopen', function (e) {
        console.log('balloonopen')

        // Получим объект, на котором открылся балун.
        var id = e.get('objectId'),
            geoObject = objectManager.objects.getById(id);
        // Загрузим данные для объекта при необходимости.

        downloadContent([geoObject], id);
    });


    function downloadContent(geoObjects, id, isCluster) {
        // Создадим массив меток, для которых данные ещё не загружены.
        var array = geoObjects.filter(function (geoObject) {
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
                // Обратите внимание, что серверную часть необходимо реализовать самостоятельно.
                contentType: 'application/json',
                type: 'POST',
                data: JSON.stringify(ids),
                url: 'clinic-desc.php',
                dataType: 'json',
                processData: false
            })).then(
                function (data) {
                    geoObjects.forEach(function (geoObject) {
                        // Содержимое балуна берем из данных, полученных от сервера.
                        // Сервер возвращает массив объектов вида:
                        // [ {"clinic_title": "Содержимое балуна"}, ...]
                        geoObject.properties.clinic_title = data[geoObject.id].clinic_title;
                        geoObject.properties.clinic_address = data[geoObject.id].clinic_address;
                        geoObject.properties.clinic_email = data[geoObject.id].clinic_email;
                        geoObject.properties.clinic_siteLink = data[geoObject.id].clinic_siteLink;
                        geoObject.properties.clinic_phone = data[geoObject.id].clinic_phone;
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


    $.ajax({
        // В файле data.json заданы геометрия, опции и данные меток .
        url: "/clinic-coords"
        // url: "clinic-coords.php"
    }).done(function (data) {
        console.log(data);
        // objectManager.add(data);
    });

}