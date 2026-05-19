/* ==========================================================
   KayGrafixDesign — Main Script
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ----------------------------------------------------------
       1. PAGE FADE IN
    ---------------------------------------------------------- */
    document.body.classList.add("loaded");


    /* ----------------------------------------------------------
       2. NAVBAR — scroll shrink + hamburger
    ---------------------------------------------------------- */
    var navbar    = document.querySelector(".navbar");
    var hamburger = document.getElementById("hamburger");
    var navMenu   = document.querySelector(".navbar ul");

    window.addEventListener("scroll", function () {
        if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 50);
    });

    window.toggleMenu = function (e) {
        e.stopPropagation();
        if (navMenu)   navMenu.classList.toggle("active");
        if (hamburger) hamburger.classList.toggle("active");
    };

    document.addEventListener("click", function (e) {
        if (!navMenu || !hamburger) return;
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
        }
    });

    document.querySelectorAll(".navbar a").forEach(function (link) {
        link.addEventListener("click", function () {
            if (navMenu)   navMenu.classList.remove("active");
            if (hamburger) hamburger.classList.remove("active");
        });
    });


    /* ----------------------------------------------------------
       3. SCROLL REVEAL
    ---------------------------------------------------------- */
    var revealEls = document.querySelectorAll(".reveal");

    function revealOnScroll() {
        revealEls.forEach(function (el) {
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


    /* ----------------------------------------------------------
       4. TYPING EFFECT
    ---------------------------------------------------------- */
    var typedEl = document.getElementById("typed-text");
    var phrases = [
        "Shaping Visual Identity",
        "Crafting Bold Brands",
        "Designing with Purpose",
        "Making Ideas Visible",
        "Your Vision, Elevated"
    ];
    var pIdx = 0, cIdx = 0, deleting = false;

    function typeLoop() {
        if (!typedEl) return;
        var word = phrases[pIdx];
        if (!deleting) {
            typedEl.textContent = word.slice(0, ++cIdx);
            if (cIdx === word.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
        } else {
            typedEl.textContent = word.slice(0, --cIdx);
            if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
        }
        setTimeout(typeLoop, deleting ? 45 : 80);
    }
    typeLoop();


    /* ----------------------------------------------------------
       5. HERO SLIDER
    ---------------------------------------------------------- */
    var slidesWrap = document.querySelector(".slides");
    var slides     = document.querySelectorAll(".slide");
    var dots       = document.querySelectorAll(".dot");
    var sIdx       = 0;

    function setDot(i) {
        dots.forEach(function (d, n) { d.classList.toggle("active", n === i); });
    }

    if (slidesWrap && slides.length > 0) {
        slidesWrap.appendChild(slides[0].cloneNode(true));

        function nextSlide() {
            sIdx++;
            slidesWrap.style.transition = "transform 1s ease-in-out";
            slidesWrap.style.transform  = "translateX(-" + (sIdx * 100) + "%)";
            setDot(sIdx % slides.length);
            if (sIdx === slides.length) {
                setTimeout(function () {
                    slidesWrap.style.transition = "none";
                    slidesWrap.style.transform  = "translateX(0%)";
                    sIdx = 0;
                    setDot(0);
                }, 1000);
            }
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                sIdx = i;
                slidesWrap.style.transition = "transform 1s ease-in-out";
                slidesWrap.style.transform  = "translateX(-" + (i * 100) + "%)";
                setDot(i);
            });
        });

        setInterval(nextSlide, 4500);
    }


    /* ----------------------------------------------------------
       6. STAT COUNTER
    ---------------------------------------------------------- */
    function animateCounters() {
        document.querySelectorAll(".stat-number").forEach(function (el) {
            var target  = parseInt(el.dataset.target, 10);
            var current = 0;
            var step    = Math.ceil(target / 80);
            var timer   = setInterval(function () {
                current = Math.min(current + step, target);
                el.textContent = current;
                if (current >= target) clearInterval(timer);
            }, 16);
        });
    }


    /* ----------------------------------------------------------
       7. PORTFOLIO FILTER + LOAD MORE
    ---------------------------------------------------------- */
    var filterBtns   = document.querySelectorAll(".filter-btn");
    var allItems     = Array.from(document.querySelectorAll(".grid-item"));
    var loadMoreWrap = document.querySelector(".load-more-wrap");
    var loadMoreBtn  = document.getElementById("load-more-btn");
    var BATCH        = 12;
    var activeFilter = "all";

    function showItem(item, n) {
        item.style.display   = "";
        item.classList.remove("hidden");
        item.style.animation = "none";
        void item.offsetHeight; // force reflow
        item.style.animation = "gridFadeIn 0.4s ease " + ((n % BATCH) * 0.04) + "s both";
    }

    function hideItem(item) {
        item.classList.add("hidden");
        item.style.display = "none";
    }

    function applyFilter(filter) {
        activeFilter = filter;
        var shown = 0;
        allItems.forEach(function (item) {
            var match = filter === "all" || item.dataset.category === filter;
            if (match && shown < BATCH) { shown++; showItem(item, shown); }
            else { hideItem(item); }
        });
        var total = allItems.filter(function (i) {
            return filter === "all" || i.dataset.category === filter;
        }).length;
        if (loadMoreWrap) loadMoreWrap.style.display = total > BATCH ? "block" : "none";
    }

    filterBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            filterBtns.forEach(function (b) { b.classList.remove("active"); });
            btn.classList.add("active");
            applyFilter(btn.dataset.filter);
        });
    });

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", function () {
            var hidden = allItems.filter(function (item) {
                var match = activeFilter === "all" || item.dataset.category === activeFilter;
                return match && item.classList.contains("hidden");
            });
            hidden.slice(0, BATCH).forEach(function (item, i) { showItem(item, i + 1); });
            var still = allItems.filter(function (item) {
                var match = activeFilter === "all" || item.dataset.category === activeFilter;
                return match && item.classList.contains("hidden");
            });
            if (!still.length && loadMoreWrap) loadMoreWrap.style.display = "none";
        });
    }

    applyFilter("all");


    /* ----------------------------------------------------------
       8. LIGHTBOX
          - Click any .grid-item img → opens lightbox
          - Navbar slides up on open, back down on close
          - ← → arrows with smooth slide transition
          - Double-click to zoom 1.6×, double-click again to zoom out
          - Close: X button, dark backdrop, or Escape key
          - Swipe left / right on mobile
    ---------------------------------------------------------- */
    var lb        = document.getElementById("lightbox");
    var lbImg     = document.getElementById("lbImg");
    var lbStage   = document.getElementById("lbStage");
    var lbClose   = document.getElementById("lbClose");
    var lbPrev    = document.getElementById("lbPrev");
    var lbNext    = document.getElementById("lbNext");
    var lbCounter = document.getElementById("lbCounter");
    var lbHint    = document.getElementById("lbHint");

    // Abort if any critical element is missing (prevents silent crashes)
    if (!lb || !lbImg || !lbClose || !lbPrev || !lbNext) {
        console.warn("Lightbox: one or more required elements not found in DOM.");
    } else {

        var imgSrcs   = [];   // all image srcs across whole portfolio
        var curIdx    = 0;
        var zoomed    = false;
        var sliding   = false;
        var hintTimer = null;

        /* Collect every grid image src */
        function buildSrcList() {
            imgSrcs = [];
            document.querySelectorAll(".portfolio-grid .grid-item img").forEach(function (img) {
                imgSrcs.push(img.getAttribute("src"));
            });
        }

        /* --- OPEN --- */
        function openLB(idx) {
            buildSrcList();
            curIdx  = Math.max(0, Math.min(idx, imgSrcs.length - 1));
            zoomed  = false;
            sliding = false;

            // Clear any leftover animation classes
            lbImg.className = "lb-img";
            lbImg.style.cursor = "zoom-in";
            lbImg.src = imgSrcs[curIdx];
            updateCounter();

            // Hide navbar with smooth slide-up
            if (navbar) navbar.classList.add("hidden");
            document.body.classList.add("no-scroll");

            // Show lightbox
            lb.classList.add("lb-open");

            // Show hint briefly
            showHint();
        }

        /* --- CLOSE --- */
        function closeLB() {
            lb.classList.remove("lb-open", "lb-zoomed-active");
            lb.scrollTo(0, 0);
            if (navbar) navbar.classList.remove("hidden");
            clearTimeout(hintTimer);
            isDragging = false;
            setTimeout(function () {
                document.body.classList.remove("no-scroll");
                zoomed    = false;
                sliding   = false;
                lbImg.className = "lb-img";
                lbImg.style.cursor = "zoom-in";
                lbImg.src = "";
            }, 450);
        }

        /* --- COUNTER --- */
        function updateCounter() {
            if (lbCounter) lbCounter.textContent = (curIdx + 1) + " / " + imgSrcs.length;
        }

        /* --- ZOOM HINT --- */
        function showHint() {
            if (!lbHint) return;
            lbHint.classList.remove("hidden");
            clearTimeout(hintTimer);
            hintTimer = setTimeout(function () {
                lbHint.classList.add("hidden");
            }, 2800);
        }

        /* --- NAVIGATE --- */
        function navigate(dir) {
            if (sliding || imgSrcs.length < 2) return;
            sliding = true;
            zoomed  = false;
            isDragging = false;
            lb.classList.remove("lb-zoomed-active");
            lb.scrollTo(0, 0);
            lbImg.className = "lb-img"; // clear zoom class
            lbImg.style.cursor = "zoom-in";

            var outCls = dir === 1 ? "slide-out-left"  : "slide-out-right";
            var inCls  = dir === 1 ? "slide-in-right"  : "slide-in-left";

            // Step 1: slide current image out
            lbImg.classList.add(outCls);

            setTimeout(function () {
                // Step 2: swap image and slide new one in
                lbImg.classList.remove(outCls);
                curIdx = (curIdx + dir + imgSrcs.length) % imgSrcs.length;
                lbImg.src = imgSrcs[curIdx];
                updateCounter();
                lbImg.classList.add(inCls);

                // Step 3: clean up after animation
                setTimeout(function () {
                    lbImg.classList.remove(inCls);
                    sliding = false;
                }, 480);

            }, 400);
        }

        /* --- DELEGATION: click on any portfolio grid image --- */
        var grid = document.querySelector(".portfolio-grid");
        if (grid) {
            grid.addEventListener("click", function (e) {
                // Walk up from click target to find an img inside a grid-item
                var target = e.target;
                while (target && target !== grid) {
                    if (target.tagName === "IMG" && target.closest(".grid-item")) {
                        buildSrcList();
                        var src = target.getAttribute("src");
                        var idx = imgSrcs.indexOf(src);
                        openLB(idx >= 0 ? idx : 0);
                        return;
                    }
                    target = target.parentElement;
                }
            });
        }

        /* --- DOUBLE-CLICK TO ZOOM + PAN --- */
        lbImg.addEventListener("dblclick", function (e) {
            e.stopPropagation();
            if (sliding) return;
            zoomed = !zoomed;
            if (zoomed) {
                lbImg.classList.add("lb-zoomed");
                lb.classList.add("lb-zoomed-active");
                lbImg.style.cursor = "grab";
                // Scroll to centre of zoomed image
                setTimeout(function () {
                    var scrollX = (lb.scrollWidth  - lb.clientWidth)  / 2;
                    var scrollY = (lb.scrollHeight - lb.clientHeight) / 2;
                    lb.scrollTo({ left: scrollX, top: scrollY, behavior: "smooth" });
                }, 520);
            } else {
                lbImg.classList.remove("lb-zoomed");
                lb.classList.remove("lb-zoomed-active");
                lbImg.style.cursor = "zoom-in";
                lb.scrollTo({ left: 0, top: 0, behavior: "smooth" });
            }
        });

        /* --- DRAG TO PAN WHEN ZOOMED (mouse) --- */
        var isDragging = false;
        var dragStartX = 0, dragStartY = 0;
        var scrollStartX = 0, scrollStartY = 0;

        lbImg.addEventListener("mousedown", function (e) {
            if (!zoomed) return;
            isDragging = true;
            dragStartX  = e.clientX;
            dragStartY  = e.clientY;
            scrollStartX = lb.scrollLeft;
            scrollStartY = lb.scrollTop;
            lbImg.style.cursor = "grabbing";
            e.preventDefault();
        });

        document.addEventListener("mousemove", function (e) {
            if (!isDragging || !zoomed) return;
            lb.scrollLeft = scrollStartX - (e.clientX - dragStartX);
            lb.scrollTop  = scrollStartY - (e.clientY - dragStartY);
        });

        document.addEventListener("mouseup", function () {
            if (!isDragging) return;
            isDragging = false;
            if (zoomed) lbImg.style.cursor = "grab";
        });

        /* --- CLOSE TRIGGERS --- */
        lbClose.addEventListener("click", function (e) {
            e.stopPropagation();
            closeLB();
        });

        lb.addEventListener("click", function (e) {
            // Only close when clicking the dark backdrop or stage, not the image/buttons
            if (e.target === lb || e.target === lbStage) closeLB();
        });

        /* --- ARROWS --- */
        lbPrev.addEventListener("click", function (e) { e.stopPropagation(); navigate(-1); });
        lbNext.addEventListener("click", function (e) { e.stopPropagation(); navigate(1);  });

        /* --- KEYBOARD --- */
        document.addEventListener("keydown", function (e) {
            if (!lb.classList.contains("lb-open")) return;
            if (e.key === "Escape")     closeLB();
            if (e.key === "ArrowRight") navigate(1);
            if (e.key === "ArrowLeft")  navigate(-1);
        });

        /* --- TOUCH SWIPE --- */
        var touchX = 0;
        lb.addEventListener("touchstart", function (e) {
            touchX = e.changedTouches[0].clientX;
        }, { passive: true });
        lb.addEventListener("touchend", function (e) {
            var diff = touchX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
        }, { passive: true });

    } // end lightbox block


    /* ----------------------------------------------------------
       9. CONTACT FORM — FormSubmit (sends email to kaygrafx@gmail.com)
    ---------------------------------------------------------- */
    var contactForm   = document.getElementById("contactForm");
    var formSuccess   = document.getElementById("formSuccess");
    var formReset     = document.getElementById("formReset");
    var submitBtn     = document.getElementById("submitBtn");
    var submitText    = document.getElementById("submitText");
    var submitSpinner = document.getElementById("submitSpinner");
    var formNote      = document.getElementById("form-note");

    function setNote(msg, color) {
        if (!formNote) return;
        formNote.textContent = msg;
        formNote.style.color = color || "var(--gold)";
    }

    function setSubmitting(on) {
        if (submitText)    submitText.style.display    = on ? "none"   : "inline";
        if (submitSpinner) submitSpinner.style.display = on ? "inline" : "none";
        if (submitBtn)     submitBtn.disabled          = on;
    }

    function showFormSuccess() {
        if (contactForm) contactForm.style.display = "none";
        if (formSuccess) {
            formSuccess.classList.add("visible");
            formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Always prevent default — we use fetch (Web3Forms AJAX)

            var name    = (document.getElementById("fname")    || {}).value || "";
            var email   = (document.getElementById("femail")   || {}).value || "";
            var service = (document.getElementById("fservice") || {}).value || "";
            var message = (document.getElementById("fmessage") || {}).value || "";

            // Validate
            if (!name.trim() || !email.trim() || !service || !message.trim()) {
                setNote("Please fill in all fields.", "#e05a5a");
                return;
            }

            setNote("");
            setSubmitting(true);

            // Build form data for Web3Forms
            var data = {
                access_key: document.querySelector('[name="access_key"]').value,
                subject:    "New Hire Request — KayGrafix Design",
                from_name:  "KayGrafix Website",
                name:    name.trim(),
                email:   email.trim(),
                service: service,
                message: message.trim()
            };

            // Send via fetch to Web3Forms API
            fetch("https://api.web3forms.com/submit", {
                method:  "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body:    JSON.stringify(data)
            })
            .then(function (res) { return res.json(); })
            .then(function (result) {
                setSubmitting(false);
                if (result.success) {
                    showFormSuccess();
                    contactForm.reset();
                } else {
                    setNote("Something went wrong. Please try again.", "#e05a5a");
                }
            })
            .catch(function () {
                setSubmitting(false);
                setNote("Network error. Please check your connection and try again.", "#e05a5a");
            });
        });
    }

    if (formReset) {
        formReset.addEventListener("click", function () {
            if (formSuccess) formSuccess.classList.remove("visible");
            if (contactForm) {
                contactForm.style.display = "flex";
                contactForm.reset();
            }
            setSubmitting(false);
            setNote("");
        });
    }

}); // end DOMContentLoaded


/* --- Inject keyframe for grid fade animation --- */
(function () {
    var s = document.createElement("style");
    s.textContent = "@keyframes gridFadeIn{"
        + "from{opacity:0;transform:scale(0.95) translateY(12px)}"
        + "to{opacity:1;transform:scale(1) translateY(0)}"
        + "}";
    document.head.appendChild(s);
}());
