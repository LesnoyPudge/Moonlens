let modalWindow = document.querySelector('#order-modal');
let orderBox = modalWindow.querySelector('#order-box');
let wrapper = modalWindow.querySelector('[class$=__wrapper]');
let closeButton = orderBox.querySelector('#modal-close');
let orderForm = orderBox.querySelector('#order-form');





export function modalOpen(geoObject) {

    orderForm.querySelector('[name=clinic-name]').value = geoObject.properties.clinic_name;
    orderForm.querySelector('[name=clinic-city]').value = geoObject.properties.country_name + ', ' + geoObject.properties.city_name;

    if (modalWindow.style.display == 'none' || !modalWindow.style.display) {
        document.body.style.overflow = 'hidden';
        modalWindow.style.display = 'block';
        
        setTimeout(() => {
            modalWindow.style.opacity = 1;
            orderBox.style.transform  = 'translate(-50%, -50%) scale(1)';
        }, 0);
    }
    closeButton.addEventListener('click', modalClose);
    orderForm.addEventListener('submit', validateForm);
    wrapper.addEventListener('click', modalClose);
}

function validateForm(event) {
    let validated = true;
    event.preventDefault();

    if (!orderForm.querySelector('[name=client-name]').value) {
        orderForm.querySelector('[name=client-name]').parentElement.style.borderColor = 'red';
        orderForm.querySelector('[name=client-name]').required = true;
        validated = false;
    } else {
        orderForm.querySelector('[name=client-name]').parentElement.style.borderColor = '';
    };

    if (!orderForm.querySelector('[name=client-phone]').value) {
        orderForm.querySelector('[name=client-phone]').parentElement.style.borderColor = 'red';
        orderForm.querySelector('[name=client-phone]').required = true;
        validated = false;
    } else {
        orderForm.querySelector('[name=client-phone]').parentElement.style.borderColor = '';
    };

    if (validated) {
        alert('мы вам перезвоним');
        modalClose();
    }
}

function modalClose() {
    // Нужно заменить на toggleState, что бы экспортировать эту функцию в другие окна
    document.body.style.overflow = '';
    modalWindow.style.opacity = 0;
    orderBox.style.transform  = 'translate(-50%, -50%) scale(0.1)';
    setTimeout(() => {
        modalWindow.style.display = 'none';
    }, 200);
}
