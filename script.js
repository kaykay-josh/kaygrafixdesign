document.addEventListener("DOMContentLoaded", () => {

    // PAGE LOAD FADE
    document.body.classList.add("loaded");

    // HAMBURGER MENU
    // FIX: declared hamburger & menu first so nav link listeners below can safely reference them
    const hamburger = document.getElementById("hamburger");
    const menu = document.querySelector(".navbar ul");

    window.toggleMenu = function(event) {
        event.stopPropagation();
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

    // SCROLL REVEAL
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
    revealOnScroll(); // run once on load in case sections are already visible

    // CLOSE MENU + TRIGGER REVEAL when nav links clicked
    document.querySelectorAll(".navbar a").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("active");
            hamburger.classList.remove("active");

            setTimeout(() => {
                revealOnScroll();
            }, 300);
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

    // HERO SLIDER
    const slidesContainer = document.querySelector(".slides");
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    let index = 0;

    // FIX: wired dots to the slider so they update as slides change
    function updateDots(activeIndex) {
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === activeIndex);
        });
    }

    if (slidesContainer && slides.length > 0) {
        // Clone first slide for seamless loop
        const firstClone = slides[0].cloneNode(true);
        slidesContainer.appendChild(firstClone);

        function nextSlide() {
            index++;
            slidesContainer.style.transition = "transform 1s ease-in-out";
            slidesContainer.style.transform = `translateX(-${index * 100}%)`;

            // Update dots (wrap around using modulo)
            updateDots(index % slides.length);

            if (index === slides.length) {
                setTimeout(() => {
                    slidesContainer.style.transition = "none";
                    slidesContainer.style.transform = `translateX(0%)`;
                    index = 0;
                    updateDots(0);
                }, 1000);
            }
        }

        // Allow clicking dots to jump to a slide
        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => {
                index = i;
                slidesContainer.style.transition = "transform 1s ease-in-out";
                slidesContainer.style.transform = `translateX(-${index * 100}%)`;
                updateDots(index);
            });
        });

        setInterval(nextSlide, 4000);
    }

    // LIGHTBOX
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    let isZoomed = false;

    // OPEN LIGHTBOX
    window.openLightbox = function(src) {
        lightboxImg.src = src;

        // Reset state
        isZoomed = false;
        lightbox.classList.remove("zoomed");
        lightbox.scrollTop = 0;
        lightbox.scrollLeft = 0;

        // Slide navbar up
        navbar.classList.add("hidden");
        document.body.classList.add("no-scroll");

        // Trigger fade-in smoothly on next frame
        requestAnimationFrame(() => {
            lightbox.classList.add("open");
        });
    };

    // CLOSE LIGHTBOX (click outside image)
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            // Fade out first, then hide
            lightbox.classList.remove("open");
            navbar.classList.remove("hidden");

            setTimeout(() => {
                document.body.classList.remove("no-scroll");
                isZoomed = false;
                lightbox.classList.remove("zoomed");
                lightbox.scrollTop = 0;
                lightbox.scrollLeft = 0;
            }, 400); // match CSS transition duration
        }
    });

    // DOUBLE CLICK TO ZOOM
    lightboxImg.addEventListener("dblclick", (e) => {
        e.stopPropagation();

        isZoomed = !isZoomed;

        if (isZoomed) {
            // Smoothly scale up — CSS transition handles the animation
            lightbox.classList.add("zoomed");
        } else {
            // Smoothly scale back down
            lightbox.classList.remove("zoomed");
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

});
