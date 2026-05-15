document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. PAGE LOAD FADE
    ===================================================== */
    document.body.classList.add("loaded");


    /* =====================================================
       2. NAVBAR
    ===================================================== */
    const navbar    = document.querySelector(".navbar");
    const hamburger = document.getElementById("hamburger");
    const navMenu   = document.querySelector(".navbar ul");

    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 50);
    });

    window.toggleMenu = function (e) {
        e.stopPropagation();
        navMenu.classList.toggle("active");
        hamburger.classList.toggle("active");
    };

    document.addEventListener("click", (e) => {
        if (navMenu && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
        }
    });

    document.querySelectorAll(".navbar a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
            setTimeout(revealOnScroll, 300);
        });
    });


    /* =====================================================
       3. SCROLL REVEAL
    ===================================================== */
    const revealEls = document.querySelectorAll(".reveal");

    function revealOnScroll() {
        revealEls.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight - 80) {
                el.classList.add("active");
                if (el.classList.contains("stats-bar") && !el.dataset.counted) {
                    el.dataset.counted = "true";
                    animateCounters();
                }
            }
        });
    }

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();


    /* =====================================================
       4. TYPING EFFECT
    ===================================================== */
    const typedEl = document.getElementById("typed-text");
    const phrases = [
        "Shaping Visual Identity",
        "Crafting Bold Brands",
        "Designing with Purpose",
        "Making Ideas Visible",
        "Your Vision, Elevated"
    ];
    let pIdx = 0, cIdx = 0, deleting = false;

    function typeLoop() {
        const word = phrases[pIdx];
        if (!deleting) {
            typedEl.textContent = word.slice(0, ++cIdx);
            if (cIdx === word.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
        } else {
            typedEl.textContent = word.slice(0, --cIdx);
            if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
        }
        setTimeout(typeLoop, deleting ? 45 : 80);
    }
    if (typedEl) typeLoop();


    /* =====================================================
       5. HERO SLIDER
    ===================================================== */
    const slidesWrap = document.querySelector(".slides");
    const slides     = document.querySelectorAll(".slide");
    const dots       = document.querySelectorAll(".dot");
    let   sIdx       = 0;

    function setDot(i) {
        dots.forEach((d, n) => d.classList.toggle("active", n === i));
    }

    if (slidesWrap && slides.length) {
        slidesWrap.appendChild(slides[0].cloneNode(true));

        function nextSlide() {
            sIdx++;
            slidesWrap.style.transition = "transform 1s ease-in-out";
            slidesWrap.style.transform  = "translateX(-" + (sIdx * 100) + "%)";
            setDot(sIdx % slides.length);
            if (sIdx === slides.length) {
                setTimeout(() => {
                    slidesWrap.style.transition = "none";
                    slidesWrap.style.transform  = "translateX(0%)";
                    sIdx = 0; setDot(0);
                }, 1000);
            }
        }

        dots.forEach((dot, i) => dot.addEventListener("click", () => {
            sIdx = i;
            slidesWrap.style.transition = "transform 1s ease-in-out";
            slidesWrap.style.transform  = "translateX(-" + (i * 100) + "%)";
            setDot(i);
        }));

        setInterval(nextSlide, 4500);
    }


    /* =====================================================
       6. STAT COUNTER
    ===================================================== */
    function animateCounters() {
        document.querySelectorAll(".stat-number").forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            let current  = 0;
            const step   = Math.ceil(target / 100);
            const timer  = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = current;
                if (current >= target) clearInterval(timer);
            }, 16);
        });
    }


    /* =====================================================
       7. PORTFOLIO FILTER + LOAD MORE
    ===================================================== */
    const filterBtns   = document.querySelectorAll(".filter-btn");
    const allGridItems = Array.from(document.querySelectorAll(".grid-item"));
    const loadMoreWrap = document.querySelector(".load-more-wrap");
    const loadMoreBtn  = document.getElementById("load-more-btn");
    const BATCH        = 12;
    let   activeFilter = "all";

    function showItem(item, delay) {
        item.style.display = "";
        item.classList.remove("hidden");
        item.style.animation = "none";
        item.offsetHeight;
        item.style.animation = "gridFadeIn 0.4s ease " + ((delay % BATCH) * 0.04) + "s both";
    }

    function hideItem(item) {
        item.classList.add("hidden");
        item.style.display = "none";
    }

    function applyFilter(filter) {
        activeFilter = filter;
        let shown = 0;
        allGridItems.forEach(item => {
            const match = filter === "all" || item.dataset.category === filter;
            if (match && shown < BATCH) { shown++; showItem(item, shown); }
            else { hideItem(item); }
        });
        const total = allGridItems.filter(i => filter === "all" || i.dataset.category === filter).length;
        if (loadMoreWrap) loadMoreWrap.style.display = total > BATCH ? "block" : "none";
    }

    filterBtns.forEach(btn => btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        applyFilter(btn.dataset.filter);
    }));

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
            const hidden = allGridItems.filter(item => {
                const match = activeFilter === "all" || item.dataset.category === activeFilter;
                return match && item.classList.contains("hidden");
            });
            hidden.slice(0, BATCH).forEach((item, i) => showItem(item, i + 1));
            const stillHidden = allGridItems.filter(item => {
                const match = activeFilter === "all" || item.dataset.category === activeFilter;
                return match && item.classList.contains("hidden");
            });
            if (!stillHidden.length && loadMoreWrap) loadMoreWrap.style.display = "none";
        });
    }

    applyFilter("all");


    /* =====================================================
       8. LIGHTBOX
         - Click any grid image to open
         - Navbar slides up on open, down on close
         - Prev / Next arrows with slide transition
         - Double-click to zoom 1.6x, double-click again to unzoom
         - Close: X button, backdrop click, or Escape key
         - Swipe left/right on mobile
    ===================================================== */
    const lightbox  = document.getElementById("lightbox");
    const lbImg     = document.getElementById("lbImg");
    const lbStage   = document.getElementById("lbStage");
    const lbClose   = document.getElementById("lbClose");
    const lbPrev    = document.getElementById("lbPrev");
    const lbNext    = document.getElementById("lbNext");
    const lbCounter = document.getElementById("lbCounter");
    const lbHint    = document.getElementById("lbHint");

    if (!lightbox || !lbImg) {
        console.warn("KayGFX: Lightbox HTML elements missing — check index.html");
    } else {

        let imgList    = [];
        let curIdx     = 0;
        let zoomed     = false;
        let sliding    = false;
        let hintTimer  = null;

        /* Collect src from ALL grid images (even hidden ones for full cycling) */
        function buildList() {
            imgList = Array.from(
                document.querySelectorAll(".grid-item img")
            ).map(img => img.getAttribute("src"));
        }

        /* Event delegation — one listener on the whole grid, catches all img clicks */
        const grid = document.querySelector(".portfolio-grid");
        if (grid) {
            grid.addEventListener("click", function(e) {
                const img = e.target.closest("img");
                if (!img || !img.closest(".grid-item")) return;
                buildList();
                const src = img.getAttribute("src");
                const idx = imgList.indexOf(src);
                openLB(idx >= 0 ? idx : 0);
            });
        }

        /* ---------- OPEN ---------- */
        function openLB(idx) {
            curIdx  = idx;
            zoomed  = false;
            sliding = false;
            lbImg.classList.remove("lb-zoomed", "slide-in-right", "slide-in-left", "slide-out-left", "slide-out-right");
            lbImg.style.cursor = "zoom-in";
            lbImg.src          = imgList[curIdx];
            updateCounter();
            navbar.classList.add("hidden");
            document.body.classList.add("no-scroll");
            lightbox.classList.add("lb-open");
            flashHint();
        }

        /* ---------- CLOSE ---------- */
        function closeLB() {
            lightbox.classList.remove("lb-open");
            navbar.classList.remove("hidden");
            clearTimeout(hintTimer);
            setTimeout(() => {
                document.body.classList.remove("no-scroll");
                zoomed  = false;
                sliding = false;
                lbImg.classList.remove("lb-zoomed");
            }, 450);
        }

        /* ---------- COUNTER ---------- */
        function updateCounter() {
            if (lbCounter) lbCounter.textContent = (curIdx + 1) + " / " + imgList.length;
        }

        /* ---------- HINT ---------- */
        function flashHint() {
            if (!lbHint) return;
            lbHint.classList.remove("hidden");
            clearTimeout(hintTimer);
            hintTimer = setTimeout(() => lbHint.classList.add("hidden"), 2800);
        }

        /* ---------- NAVIGATE ---------- */
        function navigate(dir) {
            if (sliding || imgList.length < 2) return;
            sliding = true;
            zoomed  = false;
            lbImg.classList.remove("lb-zoomed");
            lbImg.style.cursor = "zoom-in";

            const outCls = dir === 1 ? "slide-out-left"  : "slide-out-right";
            const inCls  = dir === 1 ? "slide-in-right"  : "slide-in-left";

            lbImg.classList.add(outCls);

            setTimeout(function() {
                lbImg.classList.remove(outCls);
                curIdx    = (curIdx + dir + imgList.length) % imgList.length;
                lbImg.src = imgList[curIdx];
                updateCounter();
                lbImg.classList.add(inCls);

                // Remove class after animation and unlock
                setTimeout(function() {
                    lbImg.classList.remove(inCls);
                    sliding = false;
                }, 480);

            }, 400);
        }

        /* ---------- DOUBLE-CLICK ZOOM ---------- */
        lbImg.addEventListener("dblclick", function(e) {
            e.stopPropagation();
            if (sliding) return;
            zoomed = !zoomed;
            lbImg.classList.toggle("lb-zoomed", zoomed);
            lbImg.style.cursor = zoomed ? "zoom-out" : "zoom-in";
        });

        /* ---------- CLOSE TRIGGERS ---------- */
        lbClose.addEventListener("click", function(e) { e.stopPropagation(); closeLB(); });

        lightbox.addEventListener("click", function(e) {
            // Close only when clicking the dark backdrop (not the image or buttons)
            if (e.target === lightbox || e.target === lbStage) closeLB();
        });

        /* ---------- ARROW BUTTONS ---------- */
        lbPrev.addEventListener("click", function(e) { e.stopPropagation(); navigate(-1); });
        lbNext.addEventListener("click", function(e) { e.stopPropagation(); navigate(1);  });

        /* ---------- KEYBOARD ---------- */
        document.addEventListener("keydown", function(e) {
            if (!lightbox.classList.contains("lb-open")) return;
            if (e.key === "Escape")     closeLB();
            if (e.key === "ArrowRight") navigate(1);
            if (e.key === "ArrowLeft")  navigate(-1);
        });

        /* ---------- SWIPE (mobile) ---------- */
        var touchStartX = 0;
        lightbox.addEventListener("touchstart", function(e) {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });
        lightbox.addEventListener("touchend", function(e) {
            var diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
        }, { passive: true });

    } // end lightbox block


    /* =====================================================
       9. CONTACT FORM
    ===================================================== */
    var contactForm   = document.getElementById("contactForm");
    var formSuccess   = document.getElementById("formSuccess");
    var formReset     = document.getElementById("formReset");
    var submitBtn     = document.getElementById("submitBtn");
    var submitText    = document.getElementById("submitText");
    var submitSpinner = document.getElementById("submitSpinner");
    var formNote      = document.getElementById("form-note");

    if (window.location.search.includes("sent=true") && formSuccess) {
        if (contactForm) contactForm.style.display = "none";
        formSuccess.classList.add("visible");
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(function() {
            formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function(e) {
            var svc = document.getElementById("service");
            if (svc && !svc.value) {
                e.preventDefault();
                if (formNote) { formNote.textContent = "Please select a type of service."; formNote.style.color = "#e05a5a"; }
                return;
            }
            if (submitText)    submitText.style.display    = "none";
            if (submitSpinner) submitSpinner.style.display = "inline";
            if (submitBtn)     submitBtn.disabled          = true;
        });
    }

    if (formReset) {
        formReset.addEventListener("click", function() {
            if (formSuccess) formSuccess.classList.remove("visible");
            if (contactForm) { contactForm.style.display = "flex"; contactForm.reset(); }
            if (submitText)    submitText.style.display    = "inline";
            if (submitSpinner) submitSpinner.style.display = "none";
            if (submitBtn)     submitBtn.disabled          = false;
            if (formNote)      formNote.textContent        = "";
        });
    }

}); // end DOMContentLoaded


/* Inject grid fade keyframes */
(function() {
    var s = document.createElement("style");
    s.textContent =
        "@keyframes gridFadeIn {" +
        "  from { opacity: 0; transform: scale(0.95) translateY(12px); }" +
        "  to   { opacity: 1; transform: scale(1) translateY(0); }" +
        "}";
    document.head.appendChild(s);
})();
