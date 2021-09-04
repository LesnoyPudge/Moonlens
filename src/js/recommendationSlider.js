export function sliderInit() {

    const swiper = new Swiper('.swiper', {

        speed: 600,
        loop: true,
        autoplay: {
            delay: 3000,
        },
        disableOnInteraction: false,
        pauseOnMouseEnter: true,

        pagination: {
            el: '.swiper-pagination',
        },

        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}