document.addEventListener("DOMContentLoaded", () => {

    // Page load fade
    document.body.classList.add("loaded");

    // Scroll reveal
    // SCROLL REVEAL (IMPROVED)
    const reveals = document.querySelectorAll(".reveal");

    function revealOnScroll() {
        reveals.forEach(section => {
            const windowHeight = window.innerHeight;
            const elementTop = section.getBoundingClientRect().top;

            if (elementTop < windowHeight - 100) {
                section.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", revealOnScroll);

    // ALSO trigger after clicking nav links
    // CLOSE MENU + TRIGGER ANIMATION
    document.querySelectorAll(".navbar a").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("active");
            hamburger.classList.remove("active");

            setTimeout(() => {
                revealOnScroll();
            }, 300);
        });
    });

    // HERO SLIDER (SAFE)
    const slidesContainer = document.querySelector(".slides");
    const slides = document.querySelectorAll(".slide");
    let index = 0;

    if (slidesContainer && slides.length > 0) {
        const firstClone = slides[0].cloneNode(true);
        slidesContainer.appendChild(firstClone);

        function nextSlide() {
            index++;
            slidesContainer.style.transition = "transform 1s ease-in-out";
            slidesContainer.style.transform = `translateX(-${index * 100}%)`;

            if (index === slides.length) {
                setTimeout(() => {
                    slidesContainer.style.transition = "none";
                    slidesContainer.style.transform = `translateX(0%)`;
                    index = 0;
                }, 1000);
            }
        }

        setInterval(nextSlide, 4000);
    }

    // LIGHTBOX
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    let isZoomed = false;

    // OPEN LIGHTBOX
    window.openLightbox = function(src) {
        lightbox.style.display = "flex";
        lightboxImg.src = src;

        document.body.classList.add("no-scroll");

        isZoomed = false;
        lightbox.classList.remove("zoomed");

        // reset scroll position
        lightbox.scrollTop = 0;
        lightbox.scrollLeft = 0;
    };

    // CLOSE LIGHTBOX (CLICK OUTSIDE IMAGE)
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
            document.body.classList.remove("no-scroll");

            isZoomed = false;
            lightbox.classList.remove("zoomed");
        }
    });

    // DOUBLE CLICK TO ZOOM
    lightboxImg.addEventListener("dblclick", (e) => {
    e.stopPropagation();

    isZoomed = !isZoomed;

    if (isZoomed) {
        lightbox.classList.add("zoomed");

        // 🔥 CENTER SCROLL POSITION AFTER ZOOM
        setTimeout(() => {
            const scrollX = (lightbox.scrollWidth - lightbox.clientWidth) / 2;
            const scrollY = (lightbox.scrollHeight - lightbox.clientHeight) / 2;

            lightbox.scrollLeft = scrollX;
            lightbox.scrollTop = scrollY;
        }, 50,);

    } else {
        lightbox.classList.remove("zoomed");

        // reset scroll
        lightbox.scrollTop = 0;
        lightbox.scrollLeft = 0;
    }
});

        // CATEGORY TOGGLE
        window.toggleCategory = function(header) {
            const category = header.parentElement;

            document.querySelectorAll(".category").forEach(cat => {
                if (cat !== category) cat.classList.remove("active");
            });

            category.classList.toggle("active");
        };

        // HAMBURGER MENU
        const hamburger = document.getElementById("hamburger");
        const menu = document.querySelector(".navbar ul");

        window.toggleMenu = function(event) {
            event.stopPropagation(); // prevent closing immediately
            menu.classList.toggle("active");
            hamburger.classList.toggle("active");
        };

        // CLOSE MENU WHEN CLICKING OUTSIDE
        document.addEventListener("click", (e) => {
            if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
                menu.classList.remove("active");
                hamburger.classList.remove("active");
            }
        });

        // CLOSE MENU WHEN LINK IS CLICKED
        document.querySelectorAll(".navbar a").forEach(link => {
            link.addEventListener("click", () => {
                menu.classList.remove("active");
                hamburger.classList.remove("active");
            });
        });

        // NAVBAR SCROLL EFFECT
        const navbar = document.querySelector(".navbar");
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });


});