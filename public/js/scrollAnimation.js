

export function scrollAnimationInit() {

    let targetList = document.querySelectorAll('[class*=animation]');
    let options = {
        root: null,
        rootMargin: '9999px 0px 0px 0px',
        threshold: 0
    };
    
    let observer = new IntersectionObserver((entries) => {
        // Перебираем все элементы
        entries.forEach(element => {
            // Если элемент в зоне видимости, то удаляем его классы анимаций
            if (element.isIntersecting) {
                for (let i = 0; i < element.target.classList.length; i++) {
                    let className = element.target.classList[i];

                    // Для самих анимаций (fadein-animation...)
                    if (className.endsWith('animation')) {
                        classRemove(element.target, className);
                        i--;
                        continue;
                    }

                    // Для параметров анимаций (animation-duration....)
                    if (className.startsWith('animation')) {
                        let classRemoveWithDelay = classRemove.bind(element.target, element.target, className);
                        setTimeout(classRemoveWithDelay, 1000);
                        continue;
                    }
                }
                observer.unobserve(element.target);
            }
        });

    }, options);

    // Для всех элементов, у которых в название класса входит "animation"
    // добавляем отслеживание пересечения
    targetList.forEach((target) => {
        observer.observe(target);
    });
}

function classRemove(target, className) {
    if (target && className) {
        target.classList.remove(className);
    }
}