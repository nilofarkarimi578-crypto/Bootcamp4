/* =========================================================
   EAPRO WEBSITE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  /* =======================================================
     1. NAVBAR ACTIVE LINK
  ======================================================= */

  const sections = document.querySelectorAll("section[id], header[id]");

  const navLinks = document.querySelectorAll(".nil-nav-link");

  function setActiveLink() {
    let currentId = "";

    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;

      const height = section.offsetHeight;

      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("nil-active");

      if (link.getAttribute("href") === "#" + currentId) {
        link.classList.add("nil-active");
      }
    });
  }

  window.addEventListener("scroll", setActiveLink);

  setActiveLink();

  /* =======================================================
     2. SMOOTH SCROLL
  ======================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        const offset = window.innerWidth <= 800 ? 65 : 80;

        const top =
          target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
          top: top,

          behavior: "smooth",
        });
      }
    });
  });

  /* =======================================================
     3. MOBILE MENU
  ======================================================= */

  const menuButton = document.getElementById("nil-menu-button");

  const mobileMenu = document.getElementById("nil-mobile-menu");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("nil-open");
    });
  }

  /* =======================================================
     4. CLOSE MOBILE MENU
     وقتی روی لینک کلیک شد
  ======================================================= */

  const mobileLinks = document.querySelectorAll(
    ".nil-mobile-link, .nil-mobile-power",
  );

  mobileLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (mobileMenu) {
        mobileMenu.classList.remove("nil-open");
      }
    });
  });

  /* =======================================================
     5. CLOSE MENU WHEN CLICKING OUTSIDE
  ======================================================= */

  document.addEventListener("click", function (event) {
    if (!mobileMenu) {
      return;
    }

    const clickedInsideMenu = mobileMenu.contains(event.target);

    const clickedButton = menuButton && menuButton.contains(event.target);

    if (!clickedInsideMenu && !clickedButton) {
      mobileMenu.classList.remove("nil-open");
    }
  });

  /* =======================================================
     6. CLOSE MENU WITH ESC
  ======================================================= */

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mobileMenu) {
      mobileMenu.classList.remove("nil-open");
    }
  });

  /* =======================================================
     7. HERO TITLE ANIMATION
  ======================================================= */

  const typeLines = document.querySelectorAll(".nil-type-line");

  typeLines.forEach(function (line, index) {
    setTimeout(
      function () {
        line.classList.add("nil-typed");
      },
      450 + index * 450,
    );
  });

  /* =======================================================
     8. SCROLL REVEAL
  ======================================================= */

  const revealItems = document.querySelectorAll(".nil-reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("nil-visible");

            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      },
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("nil-visible");
    });
  }

  /* =======================================================
     9. HERO PARALLAX
     فقط Desktop
  ======================================================= */

  const hero = document.querySelector(".nil-hero");

  if (hero) {
    window.addEventListener("scroll", function () {
      if (window.innerWidth > 800) {
        const scroll = window.scrollY;

        if (scroll < 700) {
          hero.style.backgroundPosition = "center " + scroll * 0.08 + "px";
        }
      }
    });
  }

  /* =======================================================
     10. PRODUCT CARD FLIP
  ======================================================= */

  const productCards = document.querySelectorAll(".nil-product-card");

  const flipBackButtons = document.querySelectorAll(".nil-flip-back");

  productCards.forEach(function (card) {
    card.addEventListener("click", function (event) {
      if (event.target.closest(".nil-flip-back")) {
        return;
      }

      card.classList.toggle("nil-flipped");
    });
  });

  flipBackButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.stopPropagation();

      const card = button.closest(".nil-product-card");

      if (card) {
        card.classList.remove("nil-flipped");
      }
    });
  });

  /* =======================================================
     11. PROCESS LINE
  ======================================================= */

  const line = document.getElementById("movingLine");

  const movingDot = document.getElementById("movingDot");

  if (line && movingDot) {
    const length = line.getTotalLength();

    line.style.strokeDasharray = length;

    line.style.strokeDashoffset = length;

    function drawLine() {
      line.animate(
        [
          {
            strokeDashoffset: length,
          },
          {
            strokeDashoffset: 0,
          },
        ],
        {
          duration: 3500,

          easing: "ease-in-out",

          fill: "forwards",
        },
      );
    }

    function moveDot() {
      const startTime = performance.now();

      const duration = 3500;

      function animateDot(currentTime) {
        const elapsed = currentTime - startTime;

        let progress = elapsed / duration;

        if (progress > 1) {
          progress = 1;
        }

        const smoothProgress =
          progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const point = line.getPointAtLength(smoothProgress * length);

        movingDot.setAttribute("cx", point.x);

        movingDot.setAttribute("cy", point.y);

        if (progress < 1) {
          requestAnimationFrame(animateDot);
        } else {
          setTimeout(function () {
            line.style.strokeDashoffset = length;

            moveDot();

            line.animate(
              [
                {
                  strokeDashoffset: length,
                },
                {
                  strokeDashoffset: 0,
                },
              ],
              {
                duration: duration,

                easing: "ease-in-out",

                fill: "forwards",
              },
            );
          }, 1200);
        }
      }

      requestAnimationFrame(animateDot);
    }

    drawLine();
    moveDot();
  }

  /* =======================================================
     12. TESTIMONIAL SLIDER
  ======================================================= */

  const testimonials = [
    {
      quote: `"When my daughter was preparing for JEE, power cuts were our biggest worry. EAPRO solved that completely. She got into IIT, and we credit our reliable power backup for helping her focus."`,

      name: "RAJENDRA PATEL",

      job: "Entrepreneur",
    },

    {
      quote: `"The power backup has made our home much more comfortable. We no longer worry about sudden power cuts, especially during important family moments."`,

      name: "PRIYA SHARMA",

      job: "Business Owner",
    },

    {
      quote: `"Reliable electricity has changed the way we work from home. Everything keeps running smoothly even when there is a power interruption."`,

      name: "AMIT KUMAR",

      job: "IT Professional",
    },

    {
      quote: `"Our business depends on reliable electricity every day. EAPRO gives us the confidence that our work can continue without interruptions."`,

      name: "NEHA VERMA",

      job: "Business Manager",
    },
  ];

  const card = document.getElementById("testimonialCard");

  const quote = document.getElementById("quote");

  const personName = document.getElementById("personName");

  const personJob = document.getElementById("personJob");

  const nextBtn = document.getElementById("nextBtn");

  const prevBtn = document.getElementById("prevBtn");

  let currentIndex = 0;

  function changeTestimonial(direction) {
    if (!card) {
      return;
    }

    if (direction === "next") {
      currentIndex = (currentIndex + 1) % testimonials.length;
    } else {
      currentIndex =
        (currentIndex - 1 + testimonials.length) % testimonials.length;
    }

    const item = testimonials[currentIndex];

    card.style.opacity = "0";

    card.style.transform = "translate(-50%, -50%) translateX(20px)";

    setTimeout(function () {
      if (quote) {
        quote.textContent = item.quote;
      }

      if (personName) {
        personName.textContent = item.name;
      }

      if (personJob) {
        personJob.textContent = item.job;
      }

      card.style.opacity = "1";

      card.style.transform = "translate(-50%, -50%) translateX(0)";
    }, 250);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      changeTestimonial("next");
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      changeTestimonial("prev");
    });
  }

  /* =======================================================
     13. NUMBER ANIMATION
  ======================================================= */

  function animateNumbers() {
    const numbers = document.querySelectorAll(".number");

    numbers.forEach(function (number) {
      const target = parseFloat(number.dataset.target);

      const type = number.dataset.type;

      const duration = 1800;

      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;

        const progress = Math.min(elapsed / duration, 1);

        const ease = 1 - Math.pow(1 - progress, 3);

        const value = target * ease;

        if (type === "million") {
          number.textContent = Math.floor(value) + "M+";
        } else if (type === "rating") {
          number.textContent = value.toFixed(1) + "/5";
        } else if (type === "percent") {
          number.textContent = Math.floor(value) + "%";
        }

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  animateNumbers();

  /* =======================================================
     14. AUTO TESTIMONIAL
  ======================================================= */

  setInterval(function () {
    changeTestimonial("next");
  }, 6000);

  /* =======================================================
     15. SAVINGS CALCULATOR
  ======================================================= */

  window.showSavingsPart4 = function () {
    const billInput = document.getElementById("monthlyBill-part4");

    const result = document.getElementById("savingResult-part4");

    if (!billInput || !result) {
      return;
    }

    const bill = parseFloat(billInput.value);

    if (isNaN(bill) || bill <= 0) {
      result.textContent = "Please enter a valid bill amount.";

      return;
    }

    const monthlySaving = bill * 0.4;

    const yearlySaving = monthlySaving * 12;

    result.textContent = `You could save ₹${monthlySaving.toFixed(
      0,
    )}/month (₹${yearlySaving.toFixed(0)}/year)!`;
  };

  /* =======================================================
     16. CONTACT FORM
  ======================================================= */

  window.sendMessagePart4 = function (event) {
    event.preventDefault();

    const name = document.getElementById("fullName-part4");

    const status = document.getElementById("messageStatus-part4");

    if (!name || !status) {
      return;
    }

    if (!name.value.trim()) {
      status.textContent = "Please enter your name.";

      return;
    }

    status.textContent = `Thank you ${name.value}! Your message has been sent.`;

    event.target.reset();
  };

  /* =======================================================
     17. NEWSLETTER
  ======================================================= */

  const newsletterForm = document.querySelector(".subscribe-box-part4");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const input = newsletterForm.querySelector("input");

      if (!input || input.value === "") {
        return;
      }

      alert("Thank you! You have subscribed successfully.");

      newsletterForm.reset();
    });
  }

  /* =======================================================
     18. SAVINGS ARROW
  ======================================================= */

  const arrow = document.querySelector(".arrow-part4");

  const savingSection = document.querySelector(".saving-area-part4");

  if (arrow && savingSection) {
    function showArrow() {
      const sectionTop = savingSection.getBoundingClientRect().top;

      const screenPosition = window.innerHeight * 0.85;

      if (sectionTop < screenPosition) {
        arrow.classList.add("active-part4");
      }
    }

    window.addEventListener("scroll", showArrow);

    showArrow();
  }
});