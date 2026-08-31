/* =========================================================
   PORTFOLIO SCRIPT
   Handles: mobile nav, smooth scroll, typing animation,
   scroll-reveal, skill bar animation, active nav link,
   contact form validation, back-to-top, footer year.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Navbar background on scroll ---------- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll);
  onScroll();

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  // Close mobile menu when a link is clicked
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Smooth scroll for nav / footer / hero links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = document.getElementById("navbar").offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset + 1;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ---------- Active nav link highlighting on scroll ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-link");

  const highlightNav = () => {
    let current = "";
    const offset = document.getElementById("navbar").offsetHeight + 20;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - offset;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navAnchors.forEach((link) => {
      link.classList.toggle("active-link", link.getAttribute("href") === `#${current}`);
    });
  };
  window.addEventListener("scroll", highlightNav);
  highlightNav();

  /* ---------- Typing animation for hero title ---------- */
  // EDIT YOUR JOB TITLES HERE — the typing animation cycles through this list
  const titles = [
    "Software Developer",
    "Web Developer",
    "Computer Science Student",
    "Problem Solver",
  ];

  const typedEl = document.getElementById("typedTitle");
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typedEl.textContent = currentTitle.substring(0, charIndex);

    let speed = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === currentTitle.length) {
      speed = 1400; // pause at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      speed = 400;
    }

    setTimeout(typeLoop, speed);
  }

  if (typedEl) typeLoop();

  /* ---------- Scroll-reveal (fade-up) via IntersectionObserver ---------- */
  const revealTargets = document.querySelectorAll(".fade-up");

  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));

  /* ---------- Skill bar fill animation ---------- */
  const skillFills = document.querySelectorAll(".skill-fill");

  const skillObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const level = fill.getAttribute("data-level") || 0;
          fill.style.width = `${level}%`;
          obs.unobserve(fill);
        }
      });
    },
    { threshold: 0.4 }
  );

  skillFills.forEach((fill) => skillObserver.observe(fill));

  /* ---------- Back to top button ---------- */
  const backToTop = document.getElementById("backToTop");
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Contact form validation (no backend) ---------- */
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("formSuccess");

  const fields = {
    name: { el: document.getElementById("name"), error: document.getElementById("nameError") },
    email: { el: document.getElementById("email"), error: document.getElementById("emailError") },
    subject: { el: document.getElementById("subject"), error: document.getElementById("subjectError") },
    message: { el: document.getElementById("message"), error: document.getElementById("messageError") },
  };

  function validateField(key) {
    const { el, error } = fields[key];
    const value = el.value.trim();
    let message = "";

    if (value === "") {
      message = "This field is required.";
    } else if (key === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        message = "Please enter a valid email address.";
      }
    } else if (key === "message" && value.length < 10) {
      message = "Message should be at least 10 characters.";
    }

    el.classList.toggle("invalid", message !== "");
    error.textContent = message;
    return message === "";
  }

  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener("blur", () => validateField(key));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    successMsg.classList.remove("show");

    const results = Object.keys(fields).map((key) => validateField(key));
    const allValid = results.every(Boolean);

    if (allValid) {
      // No backend: simulate a successful send and show a confirmation.
      successMsg.classList.add("show");
      form.reset();
      Object.values(fields).forEach(({ el }) => el.classList.remove("invalid"));

      setTimeout(() => successMsg.classList.remove("show"), 6000);
    } else {
      // Focus first invalid field for accessibility
      const firstInvalidKey = Object.keys(fields).find((key) => !validateField(key));
      if (firstInvalidKey) fields[firstInvalidKey].el.focus();
    }
  });

});
