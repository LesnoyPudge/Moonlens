// init Swiper:

export function sliderInit() {

    const swiper = new Swiper('.swiper', {

        speed: 600,
        loop: true,
        autoplay: {
            delay: 3000,
        },
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      
        // If we need pagination
        pagination: {
            el: '.swiper-pagination',
        },
      
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
}