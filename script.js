const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".scroll-progress span");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".nav-link")];
const revealTargets = document.querySelectorAll("[data-reveal]");
const counters = document.querySelectorAll("[data-counter]");
const serviceTabs = [...document.querySelectorAll(".service-tab")];
const servicePanel = document.querySelector(".service-panel");
const serviceKicker = document.getElementById("service-kicker");
const serviceTitle = document.getElementById("service-title");
const serviceDescription = document.getElementById("service-description");
const servicePoints = document.getElementById("service-points");
const serviceStats = document.getElementById("service-stats");
const serviceImage = document.getElementById("service-image");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const projectCards = [...document.querySelectorAll(".project-card")];
const faqItems = [...document.querySelectorAll(".faq-item")];
const budgetRange = document.getElementById("budget-range");
const spaceButtons = [...document.querySelectorAll("[data-space]")];
const styleButtons = [...document.querySelectorAll("[data-style]")];
const estimateTitle = document.getElementById("estimate-title");
const estimateSummary = document.getElementById("estimate-summary");
const estimateBudget = document.getElementById("estimate-budget");
const estimateTimeline = document.getElementById("estimate-timeline");
const estimateList = document.getElementById("estimate-list");
const form = document.getElementById("consultation-form");
const formState = document.getElementById("form-state");
const modal = document.getElementById("project-modal");
const modalImage = document.getElementById("modal-image");
const modalKicker = document.getElementById("modal-kicker");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalList = document.getElementById("modal-list");
const modalCloseTargets = [...document.querySelectorAll("[data-modal-close]")];
const yearNode = document.getElementById("year");
const heroStage = document.querySelector(".hero-stage");
const heroMotionGraphic = document.querySelector(".hero-motion-graphic");
const parallaxLayers = heroStage ? [...heroStage.querySelectorAll("[data-parallax]")] : [];
const magneticTargets = [...document.querySelectorAll("[data-magnetic]")];
const motionSurfaceTargets = [
  ...document.querySelectorAll(
    ".story-card, .trust-card, .service-panel, .project-card, .process-card, .estimator-panel, .estimate-output, .contact-card, .contact-form, .faq-item, .map-frame"
  )
];
const glowTargets = [
  ...document.querySelectorAll(".button, .dock-action, .service-tab, .filter-button, .choice-pill")
];
const processTimeline = document.querySelector(".process-timeline");
const siteLoader = document.getElementById("site-loader");
const siteLoaderBurst = document.getElementById("site-loader-burst");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
const saveData = navigator.connection ? navigator.connection.saveData === true : false;
const deviceMemory = navigator.deviceMemory || 8;
const hardwareThreads = navigator.hardwareConcurrency || 8;
const compactViewport = window.matchMedia("(max-width: 820px)").matches;
const ultraLiteMode =
  saveData || deviceMemory <= 1 || hardwareThreads <= 2 || (compactViewport && coarsePointer && deviceMemory <= 2);
const lowPerformanceMode = saveData || deviceMemory <= 4 || hardwareThreads <= 4 || compactViewport;

if (lowPerformanceMode) {
  document.body.classList.add("lite-mode");
}

if (ultraLiteMode) {
  document.body.classList.add("ultra-lite-mode");
  document.documentElement.classList.add("ultra-lite-mode");
}

if (siteLoader && siteLoaderBurst) {
  const loaderDuration = ultraLiteMode ? 700 : lowPerformanceMode ? 1200 : 1500;
  const loaderSpread = ultraLiteMode ? 0 : lowPerformanceMode ? 520 : 780;
  const tileCount = ultraLiteMode ? 0 : lowPerformanceMode ? 180 : 520;
  const loaderStartedAt = performance.now();
  let loaderDismissed = false;

  siteLoader.style.setProperty("--loader-duration", `${loaderDuration}ms`);

  if (tileCount > 0) {
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < tileCount; index += 1) {
      const tile = document.createElement("span");
      const angle = (index / tileCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const distance = 34 + Math.random() * 180;
      const size = 14 + Math.random() * 26;
      tile.className = "loader-tile";
      tile.style.setProperty("--tile-x", `${Math.cos(angle) * distance}px`);
      tile.style.setProperty("--tile-y", `${Math.sin(angle) * distance}px`);
      tile.style.setProperty("--tile-rotate", `${(Math.random() - 0.5) * 28}deg`);
      tile.style.setProperty("--tile-scale", `${(0.72 + Math.random() * 0.5).toFixed(2)}`);
      tile.style.setProperty("--tile-delay", `${Math.round((index / tileCount) * loaderSpread)}`);
      tile.style.setProperty("--tile-size", `${Math.round(size)}px`);
      tile.style.setProperty("--tile-bg-x", `${Math.round(Math.random() * 100)}%`);
      tile.style.setProperty("--tile-bg-y", `${Math.round(Math.random() * 100)}%`);
      fragment.appendChild(tile);
    }

    siteLoaderBurst.appendChild(fragment);
  }

  const dismissLoader = () => {
    if (loaderDismissed) {
      return;
    }

    loaderDismissed = true;
    const elapsed = performance.now() - loaderStartedAt;
    const remaining = Math.max(0, loaderDuration - elapsed);

    window.setTimeout(() => {
      document.body.classList.add("page-loaded");
      document.body.classList.remove("is-loading");
      window.setTimeout(() => siteLoader.remove(), 420);
    }, remaining);
  };

  if (document.readyState === "complete") {
    dismissLoader();
  } else {
    window.addEventListener("load", dismissLoader, { once: true });
    window.setTimeout(dismissLoader, 1600);
  }
} else {
  document.body.classList.remove("is-loading");
}

const serviceData = {
  residential: {
    kicker: "Residential design track",
    title: "Home interiors planned around storage, lighting and calm movement.",
    description:
      "Ideal for apartments, villas, bedrooms and living areas that need a cleaner layout, better material choices and an intentional luxury feel.",
    points: [
      "Furniture zoning, wardrobe direction and wall treatment ideas",
      "False ceiling and lighting layers shaped around mood and maintenance",
      "Finish selections that keep the home premium without becoming visually heavy"
    ],
    stats: ["Warm modern palettes", "Living and bedroom focus", "Turnkey-friendly scope"],
    image: "assets/images/living-room.jpg",
    alt: "Warm modern living room interior concept"
  },
  kitchen: {
    kicker: "Modular kitchen track",
    title: "Kitchen layouts that balance workflow, storage depth and a brighter finish language.",
    description:
      "Built for clients comparing laminate, acrylic and hardware choices while needing better utility planning and a cleaner visual finish.",
    points: [
      "Layout guidance for straight, parallel, L-shaped and compact cooking zones",
      "Cabinet rhythm, countertop contrast and backsplash detailing",
      "Conversation-ready planning around materials, appliance placement and upkeep"
    ],
    stats: ["Material-first planning", "Utility led", "Hardware-ready detailing"],
    image: "assets/images/kitchen-lux.jpg",
    alt: "Luxury modular kitchen concept"
  },
  office: {
    kicker: "Commercial interior track",
    title: "Office and reception spaces that feel efficient, polished and client-ready.",
    description:
      "Useful for studios, work bays, reception lounges and compact professional environments that need a crisp first impression.",
    points: [
      "Reception and waiting zones with stronger circulation and soft-brand presence",
      "Workstation planning that adds storage without making the room feel crowded",
      "Controlled lighting and finish choices that hold up during daily use"
    ],
    stats: ["Reception ready", "Compact work bays", "Professional material tone"],
    image: "assets/images/office-lobby.jpg",
    alt: "Office reception lounge concept"
  },
  storage: {
    kicker: "Storage design track",
    title: "Wardrobes and built-ins that look cleaner while carrying more.",
    description:
      "A strong option for bedrooms that need better organization, hidden storage and a neater wall composition without bulky visual weight.",
    points: [
      "Floor-to-ceiling wardrobe planning with lofts, drawers and open display moments",
      "Color blocking and handle detailing that keeps storage feeling architectural",
      "Useful for dressing zones, TV units, study corners and secondary bedrooms"
    ],
    stats: ["Wardrobes", "TV units", "Display and utility mix"],
    image: "assets/images/wardrobe-suite.jpg",
    alt: "Premium wardrobe design"
  },
  planning: {
    kicker: "Visualization track",
    title: "3D planning and concept support that makes the interior easier to trust.",
    description:
      "For visitors who want to see finish direction, mood and layout logic before committing to a larger execution conversation.",
    points: [
      "Mood direction using concept images, finish references and layout cues",
      "A bridge between the first enquiry and a more detailed site discussion",
      "Useful when the visitor wants confidence before finalizing budget or scope"
    ],
    stats: ["3D-ready flow", "Concept-led trust", "Better first-call clarity"],
    image: "assets/images/showroom-materials.jpg",
    alt: "Interior material and finish reference display"
  }
};

const projectData = {
  "bedroom-suite": {
    kicker: "Residential concept",
    title: "Warm Modern Bedroom Suite",
    description:
      "A calmer bedroom direction with soft lighting, integrated storage and a premium finish hierarchy that can adapt well to apartment scale projects.",
    image: "assets/images/hero-bedroom.jpg",
    alt: "Warm modern bedroom suite",
    items: [
      "Best for clients who want luxury cues without heavy ornamentation",
      "Strong fit for wardrobe planning, ceiling lighting and bedside symmetry",
      "Works well as a hero concept for premium home consultations"
    ]
  },
  "linear-kitchen": {
    kicker: "Kitchen concept",
    title: "Linear Luxe Kitchen",
    description:
      "A brighter modular kitchen direction focused on efficient workflow, material contrast and cabinet organization with a premium visual finish.",
    image: "assets/images/kitchen-lux.jpg",
    alt: "Linear modular kitchen",
    items: [
      "Useful for lead generation around modular kitchen queries in Durgapur",
      "Highlights backsplash, counter contrast and appliance-friendly planning",
      "Works as a strong case study for compact to mid-size kitchen builds"
    ]
  },
  "living-lounge": {
    kicker: "Residential concept",
    title: "Everyday Living Lounge",
    description:
      "A living room visual built around TV wall detailing, warm wood tones, layered lighting and relaxed circulation for family spaces.",
    image: "assets/images/living-room.jpg",
    alt: "Contemporary living room",
    items: [
      "Demonstrates how feature walls can stay elegant instead of overdone",
      "Useful for visitors comparing living room and full-home design packages",
      "Supports upsell conversations around lighting, wall finish and storage"
    ]
  },
  "office-reception": {
    kicker: "Commercial concept",
    title: "Executive Reception Lounge",
    description:
      "A client-facing office arrival zone with cleaner circulation, soft luxury surfaces and a composed first impression for professional spaces.",
    image: "assets/images/office-lobby.jpg",
    alt: "Office reception lounge",
    items: [
      "Strong for office interior and workspace search intent",
      "Balances reception presence with practical waiting-zone comfort",
      "Shows how compact layouts can still feel premium and organized"
    ]
  },
  "workstation-lab": {
    kicker: "Commercial concept",
    title: "Compact Team Workstation",
    description:
      "A tighter work zone planned for efficiency, upper storage and clear desk rhythm without losing the polished look of a designed office.",
    image: "assets/images/workstation.jpg",
    alt: "Compact office workstation",
    items: [
      "Suitable for smaller teams, back-office layouts and studio operations",
      "Useful for space optimization conversations during consultation",
      "Works well alongside reception concepts to complete the office story"
    ]
  },
  "wardrobe-suite": {
    kicker: "Storage concept",
    title: "Wardrobe Feature Wall",
    description:
      "A storage-led bedroom direction using calmer tones, concealed organization and selective display niches for a more tailored feel.",
    image: "assets/images/wardrobe-suite.jpg",
    alt: "Premium wardrobe feature wall",
    items: [
      "Supports wardrobe-only leads and full-bedroom upgrade enquiries",
      "Shows premium storage without visual heaviness",
      "Useful for clients prioritizing organization, finish and lighting accents"
    ]
  }
};

const estimateConfig = {
  home: {
    label: "home",
    base: [4, 8, 12, 18],
    timelines: ["3 to 5 weeks", "4 to 7 weeks", "6 to 9 weeks", "8 to 12 weeks"],
    inclusions: [
      "Layout refinement and focal wall ideas",
      "Storage zones and lighting direction",
      "Material palette aligned to everyday use"
    ]
  },
  kitchen: {
    label: "kitchen",
    base: [3, 5, 8, 12],
    timelines: ["2 to 4 weeks", "3 to 5 weeks", "4 to 6 weeks", "5 to 8 weeks"],
    inclusions: [
      "Cabinet planning and countertop strategy",
      "Hardware-aware storage layout",
      "Finish direction for shutters and backsplash"
    ]
  },
  office: {
    label: "office",
    base: [5, 8, 12, 18],
    timelines: ["3 to 5 weeks", "4 to 6 weeks", "6 to 8 weeks", "8 to 10 weeks"],
    inclusions: [
      "Reception or workstation layout zoning",
      "Storage and circulation improvement",
      "A cleaner professional finish system"
    ]
  },
  bedroom: {
    label: "bedroom",
    base: [2, 4, 6, 10],
    timelines: ["2 to 3 weeks", "3 to 5 weeks", "4 to 6 weeks", "5 to 7 weeks"],
    inclusions: [
      "Wardrobe direction and bedside planning",
      "Ceiling and lighting mood strategy",
      "Color and soft-finish balancing"
    ]
  }
};

const styleCopy = {
  modern: {
    suffix: "Balanced",
    multiplier: 1,
    summary: "Clean lines, warmer neutrals and polished everyday usability."
  },
  minimal: {
    suffix: "Calm",
    multiplier: 0.9,
    summary: "Lighter visual weight, calmer palettes and reduced detailing."
  },
  premium: {
    suffix: "Premium",
    multiplier: 1.18,
    summary: "Richer materials, layered lighting and stronger luxury cues."
  }
};

let selectedSpace = "home";
let selectedStyle = "modern";
let serviceSwapTimeout = null;

const applyStagger = (selector, step = 80) => {
  document.querySelectorAll(selector).forEach((node, index) => {
    node.style.setProperty("--reveal-delay", `${index * step}ms`);
  });
};

applyStagger(".story-grid [data-reveal]", 90);
applyStagger(".service-tabs [data-reveal]", 55);
applyStagger(".filter-group [data-reveal]", 55);
applyStagger(".portfolio-grid [data-reveal]", 70);
applyStagger(".process-timeline [data-reveal]", 90);
applyStagger(".trust-grid [data-reveal]", 90);
applyStagger("#space-options [data-reveal]", 50);
applyStagger("#style-options [data-reveal]", 50);
applyStagger(".estimate-highlights [data-reveal]", 80);
applyStagger(".faq-list [data-reveal]", 70);
applyStagger(".contact-cards [data-reveal]", 80);

const closeMenu = () => {
  siteNav.classList.remove("is-open");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
};

const openProject = (projectKey) => {
  const project = projectData[projectKey];
  if (!project) return;

  modalImage.src = project.image;
  modalImage.alt = project.alt;
  modalKicker.textContent = project.kicker;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalList.innerHTML = project.items.map((item) => `<li>${item}</li>`).join("");
  modal.hidden = false;
  document.body.classList.add("modal-open");
};

const closeProject = () => {
  modal.hidden = true;
  document.body.classList.remove("modal-open");
};

const renderService = (key) => {
  const service = serviceData[key];
  if (!service) return;

  serviceKicker.textContent = service.kicker;
  serviceTitle.textContent = service.title;
  serviceDescription.textContent = service.description;
  servicePoints.innerHTML = service.points.map((item) => `<li>${item}</li>`).join("");
  serviceStats.innerHTML = service.stats.map((item) => `<span>${item}</span>`).join("");
  serviceImage.src = service.image;
  serviceImage.alt = service.alt;

  serviceTabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.service === key);
  });
};

const updateService = (key, animate = true) => {
  if (!servicePanel || !animate || prefersReducedMotion) {
    renderService(key);
    return;
  }

  window.clearTimeout(serviceSwapTimeout);
  servicePanel.classList.add("is-swapping");
  serviceSwapTimeout = window.setTimeout(() => {
    renderService(key);
    requestAnimationFrame(() => {
      servicePanel.classList.remove("is-swapping");
    });
  }, 120);
};

const formatLakh = (value) => {
  if (value >= 100) {
    return `Rs ${value}+L`;
  }
  const rounded = Math.round(value * 10) / 10;
  return `Rs ${rounded}L`;
};

const updateEstimate = () => {
  const bandIndex = Number(budgetRange.value) - 1;
  const spaceConfig = estimateConfig[selectedSpace];
  const style = styleCopy[selectedStyle];
  const low = Math.round(spaceConfig.base[bandIndex] * style.multiplier * 10) / 10;
  const high = Math.round((low + Math.max(2, low * 0.35)) * 10) / 10;
  const tierLabels = ["Starter", "Balanced", "Expanded", "Signature"];
  const tier = tierLabels[bandIndex];

  estimateTitle.textContent = `${style.suffix} ${spaceConfig.label} package`;
  estimateSummary.textContent = `${tier} ${spaceConfig.label} planning for visitors who want ${style.summary.toLowerCase()} This keeps the enquiry grounded before the first consultation call.`;
  estimateBudget.textContent = `${formatLakh(low)} to ${formatLakh(high)}`;
  estimateTimeline.textContent = spaceConfig.timelines[bandIndex];

  const list = [
    ...spaceConfig.inclusions,
    `Style direction tuned for a ${selectedStyle === "premium" ? "richer" : selectedStyle === "minimal" ? "lighter" : "balanced"} finish language`
  ];

  estimateList.innerHTML = list.map((item) => `<li>${item}</li>`).join("");
};

const updateScrollState = () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
  progressBar.style.transform = `scaleX(${progress})`;
  header.classList.toggle("is-scrolled", scrollTop > 18);
};

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

let scrollTicking = false;

const queueScrollState = () => {
  if (scrollTicking) {
    return;
  }

  scrollTicking = true;
  window.requestAnimationFrame(() => {
    updateScrollState();
    scrollTicking = false;
  });
};

window.addEventListener("scroll", queueScrollState, { passive: true });
updateScrollState();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealTargets.forEach((target) => revealObserver.observe(target));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const node = entry.target;
      const targetValue = Number(node.dataset.counter || 0);
      const start = performance.now();
      const duration = 900;

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        node.textContent = String(Math.floor(targetValue * progress));
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          node.textContent = String(targetValue);
        }
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(node);
    });
  },
  { threshold: 0.45 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.target.id === "process" && processTimeline && entry.isIntersecting) {
        processTimeline.classList.add("is-visible");
      }
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  },
  { threshold: 0.55 }
);

document
  .querySelectorAll("#home, #about, #services, #portfolio, #process, #contact")
  .forEach((section) => sectionObserver.observe(section));

serviceTabs.forEach((tab) => {
  tab.addEventListener("click", () => updateService(tab.dataset.service));
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));

    let visibleIndex = 0;
    projectCards.forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !match);
      if (match) {
        card.classList.remove("is-spotlit");
        window.setTimeout(() => {
          card.classList.add("is-spotlit");
          window.setTimeout(() => card.classList.remove("is-spotlit"), 430);
        }, visibleIndex * 70);
        visibleIndex += 1;
      }
    });
  });
});

projectCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    const trigger = event.target.closest(".project-link") || event.target.closest(".project-card");
    if (!trigger) return;
    openProject(card.dataset.project);
  });
});

modalCloseTargets.forEach((target) => {
  target.addEventListener("click", closeProject);
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeProject();
  }
});

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  button.addEventListener("click", () => {
    const shouldOpen = !item.classList.contains("is-open");
    faqItems.forEach((entry) => {
      entry.classList.remove("is-open");
      entry.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });
    if (shouldOpen) {
      item.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

spaceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedSpace = button.dataset.space;
    spaceButtons.forEach((entry) => entry.classList.toggle("is-active", entry === button));
    updateEstimate();
  });
});

styleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedStyle = button.dataset.style;
    styleButtons.forEach((entry) => entry.classList.toggle("is-active", entry === button));
    updateEstimate();
  });
});

budgetRange.addEventListener("input", updateEstimate);

if (!prefersReducedMotion && supportsFinePointer && !lowPerformanceMode) {
  const resetMotionSurface = (target) => {
    target.style.setProperty("--tilt-x", "0deg");
    target.style.setProperty("--tilt-y", "0deg");
    target.style.setProperty("--glow-x", "50%");
    target.style.setProperty("--glow-y", "50%");
  };

  const resetGlowTarget = (target) => {
    target.style.setProperty("--glow-x", "50%");
    target.style.setProperty("--glow-y", "50%");
  };

  magneticTargets.forEach((target) => {
    target.addEventListener("pointermove", (event) => {
      const rect = target.getBoundingClientRect();
      const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
      const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 6;
      target.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    });

    target.addEventListener("pointerleave", () => {
      target.style.transform = "";
    });
  });

  motionSurfaceTargets.forEach((target) => {
    resetMotionSurface(target);

    target.addEventListener("pointermove", (event) => {
      const rect = target.getBoundingClientRect();
      const ratioX = (event.clientX - rect.left) / rect.width;
      const ratioY = (event.clientY - rect.top) / rect.height;
      const tiltY = (ratioX - 0.5) * 3.6;
      const tiltX = (0.5 - ratioY) * 3.2;

      target.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
      target.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
      target.style.setProperty("--glow-x", `${(ratioX * 100).toFixed(2)}%`);
      target.style.setProperty("--glow-y", `${(ratioY * 100).toFixed(2)}%`);
    });

    target.addEventListener("pointerleave", () => {
      resetMotionSurface(target);
    });
  });

  glowTargets.forEach((target) => {
    resetGlowTarget(target);

    target.addEventListener("pointermove", (event) => {
      const rect = target.getBoundingClientRect();
      const ratioX = (event.clientX - rect.left) / rect.width;
      const ratioY = (event.clientY - rect.top) / rect.height;
      target.style.setProperty("--glow-x", `${(ratioX * 100).toFixed(2)}%`);
      target.style.setProperty("--glow-y", `${(ratioY * 100).toFixed(2)}%`);
    });

    target.addEventListener("pointerleave", () => {
      resetGlowTarget(target);
    });
  });
}

if (!prefersReducedMotion && supportsFinePointer && !lowPerformanceMode && heroStage && parallaxLayers.length) {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationFrame = null;

  const animateParallax = () => {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;

    parallaxLayers.forEach((layer) => {
      const depth = Number(layer.dataset.parallax || 0.2);
      layer.style.transform = `translate3d(${currentX * depth}px, ${currentY * depth}px, 0)`;
    });

    if (heroMotionGraphic) {
      heroMotionGraphic.style.setProperty("--graphic-shift-x", `${(currentX * 0.28).toFixed(2)}px`);
      heroMotionGraphic.style.setProperty("--graphic-shift-y", `${(currentY * 0.28).toFixed(2)}px`);
      heroMotionGraphic.style.setProperty("--graphic-rotate-y", `${(18 + currentX * 0.18).toFixed(2)}deg`);
      heroMotionGraphic.style.setProperty("--graphic-rotate-x", `${(-16 - currentY * 0.18).toFixed(2)}deg`);
    }

    if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
      animationFrame = requestAnimationFrame(animateParallax);
    } else {
      animationFrame = null;
    }
  };

  const queueParallax = () => {
    if (!animationFrame) {
      animationFrame = requestAnimationFrame(animateParallax);
    }
  };

  heroStage.addEventListener("pointermove", (event) => {
    const rect = heroStage.getBoundingClientRect();
    const pointerX = (event.clientX - rect.left) / rect.width - 0.5;
    const pointerY = (event.clientY - rect.top) / rect.height - 0.5;
    targetX = pointerX * 24;
    targetY = pointerY * 18;
    queueParallax();
  });

  heroStage.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
    queueParallax();
  });
}

if (form) {
  form.addEventListener("input", () => {
    formState.textContent = "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (Object.values(payload).some((value) => String(value).trim() === "")) {
      formState.textContent = "Please complete every field before submitting the enquiry.";
      return;
    }

    const saved = JSON.parse(localStorage.getItem("vishalInteriorLeads") || "[]");
    saved.push({
      ...payload,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("vishalInteriorLeads", JSON.stringify(saved));

    formState.textContent = `Thanks ${payload.name}. Your enquiry has been saved on this browser and the form is ready to connect to a live backend.`;
    form.reset();
  });
}

updateService("residential", false);
updateEstimate();

if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}
