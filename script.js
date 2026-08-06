(() => {
  "use strict";

  /* ==========================================================================
     B.B UNIVERSE — FRAME SEQUENCE CONFIGURATION
     --------------------------------------------------------------------------
     IMPORTANT: The frame ZIP/folder was not available while this file was
     generated. Replace every value marked FRAME-INSPECTION REQUIRED after
     checking the real image sequence. All runtime logic below is complete.
     ========================================================================== */

  // Read the frame settings directly from the matching HTML section.
  const experienceElement = document.querySelector("[data-experience], #experience, .experience");
  const experienceData = experienceElement?.dataset || {};
  const parsedFrameCount = Number.parseInt(experienceData.frameCount || "", 10);
  const totalFrameCount = Number.isInteger(parsedFrameCount) && parsedFrameCount > 0
    ? parsedFrameCount
    : 180;
  const checkpoint = (ratio) => Math.max(1, Math.round(totalFrameCount * ratio));

  const CONFIG = Object.freeze({
  FRAME_FOLDER: "frames",
FRAME_PREFIX: "frame_",
FRAME_EXTENSION: "jpg",
START_FRAME_NUMBER: 1,
TOTAL_FRAME_COUNT: 240,
ZERO_PADDING: 4,

  FRAME_WIDTH: 1920,
  FRAME_HEIGHT: 1080,

  SCROLL_SECTION_HEIGHT: "900vh",
  EASING_STRENGTH: 0.14,
  MAX_DEVICE_PIXEL_RATIO: 2,
  LOADING_CONCURRENCY: 6,
  INITIAL_PRIORITY_FRAME_COUNT: 24,
  MINIMUM_FRAMES_BEFORE_LOADER_EXIT: 12,
  MOBILE_BREAKPOINT: 768,
  DESKTOP_DRAW_MODE: "contain",
  MOBILE_DRAW_MODE: "cover",
  FRAME_BACKGROUND: "#000000",
  FINAL_FRAME_HOLD_START: 0.92,
  FRAME_SEARCH_RADIUS: 16,

  FOCAL_POINT: Object.freeze({
    desktop: Object.freeze({ x: 0.5, y: 0.5 }),
    mobile: Object.freeze({ x: 0.54, y: 0.5 }),
  }),

  CHECKPOINTS: Object.freeze({
    CAMERA_START: 1,
    MORPH_START: 43,
    PHONE_COMPLETE: 109,
    INSTAGRAM_VISIBLE: 128,
    NOTIFICATIONS_START: 155,
    NOTIFICATIONS_PEAK: 211,
    FINAL_FRAME: 240,
  }),

  CONTACT: Object.freeze({
    instagramUrl: "REPLACE_WITH_INSTAGRAM_URL",
    email: "REPLACE_WITH_EMAIL",
    phone: "REPLACE_WITH_PHONE",
    whatsappUrl: "REPLACE_WITH_WHATSAPP_URL",
    formEndpoint: "REPLACE_WITH_FORM_ENDPOINT",
  }),
});
  const STAGES = Object.freeze([
    Object.freeze({ id: "idea", number: 1, label: "Idea" }),
    Object.freeze({ id: "strategy", number: 2, label: "Strategy" }),
    Object.freeze({ id: "creation", number: 3, label: "Creation" }),
    Object.freeze({ id: "instagram", number: 4, label: "Instagram" }),
    Object.freeze({ id: "engagement", number: 5, label: "Engagement" }),
    Object.freeze({ id: "finale", number: 6, label: "Finale" }),
  ]);

  const SERVICE_LABELS = Object.freeze([
    "Strategy",
    "Direction",
    "Production",
    "Editing",
    "Publishing",
  ]);

  const PROCESS_LABELS = Object.freeze(["Plan", "Create", "Publish", "Grow"]);

  const ENGAGEMENT_LABELS = Object.freeze([
    "More Reach",
    "More Engagement",
    "More Conversations",
    "More Opportunities",
  ]);

  const PLACEHOLDER_PATTERN =
    /replace|placeholder|example\.com|your[-_\s]|000000|change[-_\s]?me/i;

  const state = {
    configValid: false,
    domReady: false,
    experienceReady: false,
    loaderExited: false,
    documentVisible: !document.hidden,
    reducedMotion: false,
    isMobile: false,
    animationFrameId: 0,
    resizeTimer: 0,
    processFrameId: 0,
    targetProgress: 0,
    displayedFrameIndex: 0,
    targetFrameIndex: 0,
    lastDrawnFrameIndex: -1,
    lastActiveStageIndex: -1,
    lastProgressPercent: -1,
    lastScrollY: window.scrollY || 0,
    currentRenderedImage: null,
    currentRenderedIndex: -1,
    measurements: {
      sectionStart: 0,
      sectionHeight: 0,
      viewportHeight: window.innerHeight,
      scrollDistance: 1,
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight,
      dpr: 1,
    },
    processSectionVisible: false,
    menuOpen: false,
    bodyOverflowBeforeMenu: "",
    formSubmitting: false,
  };

  const dom = {
    loader: null,
    loaderProgressText: null,
    loaderProgressBar: null,
    sequenceSection: null,
    stickyVisual: null,
    canvas: null,
    context: null,
    stagePanels: [],
    processStageItems: [],
    serviceLabels: [],
    engagementWords: [],
    scrollProgressFill: null,
    scrollProgressText: null,
    currentStageLabel: null,
    navigation: null,
    navigationLinks: [],
    mobileMenuButton: null,
    mobileMenuPanel: null,
    contactLinks: [],
    contactForm: null,
    submitStatus: null,
    copyrightYear: null,
    revealElements: [],
    magneticButtons: [],
    processSection: null,
    processSteps: [],
  };

  const frameStore = {
    loaded: new Map(),
    failed: new Set(),
    loading: new Set(),
    queued: new Set(),
    queue: [],
    activeRequests: 0,
    completedCount: 0,
    successfulCount: 0,
  };

  const preferenceQueries = {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)"),
    finePointer: window.matchMedia("(pointer: fine) and (hover: hover)"),
  };

  function warn(message, detail) {
    if (detail !== undefined) {
      console.warn(`[B.B Universe] ${message}`, detail);
      return;
    }
    console.warn(`[B.B Universe] ${message}`);
  }

  function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
  }

  function debounce(callback, delay) {
    let timer = 0;
    return (...args) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => callback(...args), delay);
    };
  }

  function normalizeExtension(extension) {
    return String(extension || "").replace(/^\./, "").trim();
  }

  function isPositiveInteger(value) {
    return Number.isInteger(value) && value > 0;
  }

  function lastConfiguredFrameNumber() {
    return CONFIG.START_FRAME_NUMBER + CONFIG.TOTAL_FRAME_COUNT - 1;
  }

  function frameNumberToIndex(frameNumber) {
    return clamp(
      Math.round(frameNumber - CONFIG.START_FRAME_NUMBER),
      0,
      CONFIG.TOTAL_FRAME_COUNT - 1
    );
  }

  function frameIndexToNumber(frameIndex) {
    return CONFIG.START_FRAME_NUMBER + frameIndex;
  }

  function validateConfiguration() {
    const errors = [];

    if (!CONFIG.FRAME_FOLDER || typeof CONFIG.FRAME_FOLDER !== "string") {
      errors.push("FRAME_FOLDER must be a non-empty string.");
    }

    if (!CONFIG.FRAME_PREFIX || typeof CONFIG.FRAME_PREFIX !== "string") {
      errors.push("FRAME_PREFIX must be a non-empty string.");
    }

    if (!normalizeExtension(CONFIG.FRAME_EXTENSION)) {
      errors.push("FRAME_EXTENSION must be provided.");
    }

    if (!Number.isInteger(CONFIG.START_FRAME_NUMBER)) {
      errors.push("START_FRAME_NUMBER must be an integer.");
    }

    if (!isPositiveInteger(CONFIG.TOTAL_FRAME_COUNT)) {
      errors.push("TOTAL_FRAME_COUNT must be a positive integer.");
    }

    if (!Number.isInteger(CONFIG.ZERO_PADDING) || CONFIG.ZERO_PADDING < 0) {
      errors.push("ZERO_PADDING must be zero or a positive integer.");
    }

    if (!isPositiveInteger(CONFIG.FRAME_WIDTH) || !isPositiveInteger(CONFIG.FRAME_HEIGHT)) {
      errors.push("FRAME_WIDTH and FRAME_HEIGHT must be positive integers.");
    }

    if (
      typeof CONFIG.EASING_STRENGTH !== "number" ||
      CONFIG.EASING_STRENGTH <= 0 ||
      CONFIG.EASING_STRENGTH > 1
    ) {
      errors.push("EASING_STRENGTH must be greater than 0 and no more than 1.");
    }

    if (!isPositiveInteger(CONFIG.LOADING_CONCURRENCY)) {
      errors.push("LOADING_CONCURRENCY must be a positive integer.");
    }

    if (
      !isPositiveInteger(CONFIG.MINIMUM_FRAMES_BEFORE_LOADER_EXIT) ||
      CONFIG.MINIMUM_FRAMES_BEFORE_LOADER_EXIT > CONFIG.TOTAL_FRAME_COUNT
    ) {
      errors.push(
        "MINIMUM_FRAMES_BEFORE_LOADER_EXIT must be within the frame range."
      );
    }

    if (!["contain", "cover"].includes(CONFIG.DESKTOP_DRAW_MODE)) {
      errors.push("DESKTOP_DRAW_MODE must be 'contain' or 'cover'.");
    }

    if (!["contain", "cover"].includes(CONFIG.MOBILE_DRAW_MODE)) {
      errors.push("MOBILE_DRAW_MODE must be 'contain' or 'cover'.");
    }

    if (
      typeof CONFIG.FINAL_FRAME_HOLD_START !== "number" ||
      CONFIG.FINAL_FRAME_HOLD_START <= 0 ||
      CONFIG.FINAL_FRAME_HOLD_START >= 1
    ) {
      errors.push("FINAL_FRAME_HOLD_START must be between 0 and 1.");
    }

    const firstFrame = CONFIG.START_FRAME_NUMBER;
    const finalFrame = lastConfiguredFrameNumber();
    const orderedKeys = [
      "CAMERA_START",
      "MORPH_START",
      "PHONE_COMPLETE",
      "INSTAGRAM_VISIBLE",
      "NOTIFICATIONS_START",
      "NOTIFICATIONS_PEAK",
      "FINAL_FRAME",
    ];

    let previousCheckpoint = firstFrame - 1;

    orderedKeys.forEach((key) => {
      const frame = CONFIG.CHECKPOINTS[key];

      if (!Number.isInteger(frame) || frame < firstFrame || frame > finalFrame) {
        errors.push(
          `Checkpoint ${key} must be between ${firstFrame} and ${finalFrame}.`
        );
        return;
      }

      if (frame < previousCheckpoint) {
        errors.push(`Checkpoint ${key} is out of chronological order.`);
      }

      previousCheckpoint = frame;
    });

    if (CONFIG.CHECKPOINTS.FINAL_FRAME !== finalFrame) {
      errors.push(
        `FINAL_FRAME should equal the configured last frame (${finalFrame}).`
      );
    }

    if (errors.length) {
      errors.forEach((error) => warn(error));
      return false;
    }

    return true;
  }

  function firstMatch(...selectors) {
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element) return element;
    }
    return null;
  }

  function allMatches(...selectors) {
    const unique = new Set();
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => unique.add(element));
    });
    return Array.from(unique);
  }

  function cacheDom() {
    dom.loader = firstMatch("[data-loader]", "#siteLoader", ".site-loader");
    dom.loaderProgressText = firstMatch(
      "[data-loader-percentage]",
      "#loaderPercentage",
      ".site-loader__percentage"
    );
    dom.loaderProgressBar = firstMatch(
      "[data-loader-progress-fill]",
      ".site-loader__progress-fill"
    );

    dom.sequenceSection = firstMatch(
      "[data-experience]",
      "#experience",
      ".experience",
      "[data-sequence-section]",
      "#sequence",
      ".sequence-section"
    );
    dom.stickyVisual = firstMatch(
      "[data-sticky-visual]",
      ".experience__sticky",
      ".sequence-sticky",
      ".sticky-visual"
    );
    dom.canvas = firstMatch(
      "canvas[data-sequence-canvas]",
      "#sequenceCanvas",
      ".experience__canvas",
      "#sequence-canvas",
      ".sequence-canvas"
    );
    dom.context = dom.canvas ? dom.canvas.getContext("2d", { alpha: false }) : null;

    dom.stagePanels = allMatches(
      "[data-stage]",
      ".story-panel",
      "[data-sequence-stage]",
      ".sequence-stage"
    );
    dom.processStageItems = allMatches(
      ".story-panel__process [data-process-step]",
      ".story-panel__process li",
      "[data-process-stage-item]",
      ".sequence-process-item"
    );
    dom.serviceLabels = allMatches(
      "[data-reveal-service]",
      ".story-panel__service-labels li",
      "[data-service-label]",
      ".service-label"
    );
    dom.engagementWords = allMatches(
      "[data-metric-word]",
      ".story-panel__metric-words span",
      "[data-engagement-word]",
      ".engagement-word"
    );

    dom.scrollProgressFill = firstMatch(
      "[data-scroll-progress-fill]",
      ".experience__progress-fill",
      "[data-sequence-progress-fill]",
      ".sequence-progress__fill"
    );
    dom.scrollProgressText = firstMatch(
      "[data-scroll-progress-value]",
      ".experience__progress-value",
      "[data-sequence-progress-text]",
      ".sequence-progress__text"
    );
    dom.currentStageLabel = firstMatch(
      "[data-current-stage-name]",
      "[data-current-stage]",
      ".current-stage-label"
    );

    dom.navigation = firstMatch(
      "[data-site-header]",
      "#siteHeader",
      ".site-header",
      "[data-navigation]",
      "#site-nav",
      ".site-nav"
    );
    dom.navigationLinks = allMatches(
      "[data-nav-link]",
      "[data-menu-close-link]",
      ".site-nav a[href^='#']",
      "nav a[href^='#']"
    );
    dom.mobileMenuButton = firstMatch(
      "[data-menu-toggle]",
      "#mobileMenuButton",
      ".site-nav__menu-button",
      "[data-menu-button]",
      "#menu-button",
      ".menu-button"
    );
    dom.mobileMenuPanel = firstMatch(
      "[data-mobile-menu]",
      "#mobileMenu",
      ".mobile-menu",
      "[data-menu-panel]",
      "#mobile-menu"
    );

    dom.contactLinks = allMatches(
      "[data-start-conversation-link]",
      "[data-instagram-link]",
      "[data-footer-instagram-link]",
      "[data-footer-email-link]",
      "[data-contact]",
      "[data-contact-type]",
      ".js-contact-link"
    );
    dom.contactForm = firstMatch(
      "[data-contact-form]",
      "#contact-form",
      ".contact-form"
    );
    dom.submitStatus = firstMatch(
      "[data-form-status]",
      "#contactFormStatus",
      ".contact-form__status",
      "[data-submit-status]",
      "#submit-status",
      ".form-status"
    );

    dom.copyrightYear = firstMatch(
      "[data-current-year]",
      "#current-year",
      ".current-year"
    );
    dom.revealElements = allMatches("[data-reveal]", ".reveal");
    dom.magneticButtons = allMatches("[data-magnetic]", ".magnetic");

    dom.processSection = firstMatch(
      "[data-process-timeline]",
      "#process",
      ".process",
      "[data-process-section]",
      ".process-section"
    );
    dom.processSteps = allMatches(
      "[data-process-timeline-stage]",
      ".process__stage",
      ".process-step"
    );

    if (!dom.canvas || !dom.context) {
      warn("Sequence canvas is missing or does not support a 2D context.");
    }

    if (!dom.sequenceSection) {
      warn("Sequence section is missing; frame-scroll synchronization is disabled.");
    }

    state.domReady = true;
  }

  function buildFrameUrl(frameIndex) {
    const absoluteNumber = frameIndexToNumber(frameIndex);
    const paddedNumber = String(absoluteNumber).padStart(
      CONFIG.ZERO_PADDING,
      "0"
    );
    const folder = CONFIG.FRAME_FOLDER.replace(/\/+$/, "");
    const extension = normalizeExtension(CONFIG.FRAME_EXTENSION);

    return `${folder}/${CONFIG.FRAME_PREFIX}${paddedNumber}.${extension}`;
  }

  function checkpointIndices() {
    return Object.values(CONFIG.CHECKPOINTS).map(frameNumberToIndex);
  }

  function buildLoadPriority() {
    const order = [];
    const seen = new Set();

    const push = (index) => {
      if (
        Number.isInteger(index) &&
        index >= 0 &&
        index < CONFIG.TOTAL_FRAME_COUNT &&
        !seen.has(index)
      ) {
        seen.add(index);
        order.push(index);
      }
    };

    push(0);

    const earlyLimit = Math.min(
      CONFIG.INITIAL_PRIORITY_FRAME_COUNT,
      CONFIG.TOTAL_FRAME_COUNT
    );
    for (let index = 1; index < earlyLimit; index += 1) push(index);

    checkpointIndices().forEach(push);

    for (let index = 0; index < CONFIG.TOTAL_FRAME_COUNT; index += 1) push(index);

    return order;
  }

  function enqueueFrames(indices) {
    indices.forEach((index) => {
      if (
        frameStore.loaded.has(index) ||
        frameStore.failed.has(index) ||
        frameStore.loading.has(index) ||
        frameStore.queued.has(index)
      ) {
        return;
      }

      frameStore.queue.push(index);
      frameStore.queued.add(index);
    });

    pumpFrameQueue();
  }

  function loadFrame(index) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = "async";
      image.loading = "eager";

      let settled = false;

      const finishSuccess = async () => {
        if (settled) return;
        settled = true;

        try {
          if (typeof image.decode === "function") {
            await image.decode();
          }
        } catch {
          // The image can still be drawable after an Image.decode() rejection.
        }

        resolve(image);
      };

      const finishFailure = () => {
        if (settled) return;
        settled = true;
        reject(new Error(`Unable to load ${buildFrameUrl(index)}`));
      };

      image.onload = finishSuccess;
      image.onerror = finishFailure;
      image.src = buildFrameUrl(index);

      if (image.complete && image.naturalWidth > 0) {
        finishSuccess();
      }
    });
  }

  function pumpFrameQueue() {
    if (!state.configValid) return;

    while (
      frameStore.activeRequests < CONFIG.LOADING_CONCURRENCY &&
      frameStore.queue.length
    ) {
      const index = frameStore.queue.shift();
      frameStore.queued.delete(index);

      if (
        frameStore.loaded.has(index) ||
        frameStore.failed.has(index) ||
        frameStore.loading.has(index)
      ) {
        continue;
      }

      frameStore.activeRequests += 1;
      frameStore.loading.add(index);

      loadFrame(index)
        .then((image) => {
          frameStore.loaded.set(index, image);
          frameStore.successfulCount += 1;
          onFrameAvailable(index, image);
        })
        .catch(() => {
          frameStore.failed.add(index);
          warn(`Frame ${frameIndexToNumber(index)} failed to load.`);
        })
        .finally(() => {
          frameStore.loading.delete(index);
          frameStore.activeRequests -= 1;
          frameStore.completedCount += 1;
          updateLoaderProgress();
          maybeExitLoader();
          pumpFrameQueue();
        });
    }
  }

  function updateLoaderProgress() {
    if (!dom.loader) return;

    const readinessTarget = Math.min(
      CONFIG.MINIMUM_FRAMES_BEFORE_LOADER_EXIT,
      CONFIG.TOTAL_FRAME_COUNT
    );
    const usableForReadiness = Math.min(
      frameStore.successfulCount,
      readinessTarget
    );
    const readinessPercent = Math.round(
      (usableForReadiness / readinessTarget) * 100
    );
    const totalPercent = Math.round(
      (frameStore.completedCount / CONFIG.TOTAL_FRAME_COUNT) * 100
    );

    if (dom.loaderProgressText) {
      dom.loaderProgressText.textContent = `${readinessPercent}%`;
      dom.loaderProgressText.setAttribute(
        "data-total-load-progress",
        String(totalPercent)
      );
    }

    if (dom.loaderProgressBar) {
      dom.loaderProgressBar.style.setProperty(
        "--loader-progress",
        `${readinessPercent}%`
      );
      dom.loaderProgressBar.style.width = `${readinessPercent}%`;
      dom.loaderProgressBar.style.transform = "none";
      dom.loaderProgressBar.setAttribute("aria-valuemin", "0");
      dom.loaderProgressBar.setAttribute("aria-valuemax", "100");
      dom.loaderProgressBar.setAttribute(
        "aria-valuenow",
        String(readinessPercent)
      );
    }
  }

  function firstAvailableFrame() {
    if (frameStore.loaded.has(0)) {
      return { index: 0, image: frameStore.loaded.get(0) };
    }

    const loadedIndices = Array.from(frameStore.loaded.keys()).sort((a, b) => a - b);
    if (!loadedIndices.length) return null;

    const index = loadedIndices[0];
    return { index, image: frameStore.loaded.get(index) };
  }

  function onFrameAvailable(index, image) {
    if (!state.currentRenderedImage) {
      state.currentRenderedImage = image;
      state.currentRenderedIndex = index;
      drawFrame(index, true);
    }

    if (index === Math.round(state.displayedFrameIndex)) {
      requestAnimation();
    }
  }

  function maybeExitLoader() {
    if (state.loaderExited) return;

    const enoughFrames =
      frameStore.successfulCount >= CONFIG.MINIMUM_FRAMES_BEFORE_LOADER_EXIT;
    const available = firstAvailableFrame();

    if (enoughFrames && available) {
      drawFrame(available.index, true);
      exitLoader();
      return;
    }

    const allPriorityAttemptsFinished =
      frameStore.completedCount >= CONFIG.TOTAL_FRAME_COUNT &&
      frameStore.activeRequests === 0 &&
      frameStore.queue.length === 0;

    if (allPriorityAttemptsFinished) {
      if (available) {
        drawFrame(available.index, true);
        exitLoader();
      } else {
        warn(
          "No frames could be loaded. Check the frame folder, naming convention, and extension."
        );
        failExperienceGracefully();
      }
    }
  }

  function exitLoader() {
    state.loaderExited = true;
    state.experienceReady = true;

    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");

    if (!dom.loader) {
      requestAnimation();
      return;
    }

    dom.loader.classList.add("is-ready", "is-exiting");
    dom.loader.setAttribute("aria-hidden", "true");

    const removeLoader = () => {
      dom.loader.hidden = true;
      dom.loader.removeEventListener("transitionend", removeLoader);
    };

    dom.loader.addEventListener("transitionend", removeLoader, { once: true });
    window.setTimeout(removeLoader, 900);

    requestAnimation();
  }

  function failExperienceGracefully() {
    state.loaderExited = true;
    state.experienceReady = false;

    document.body.classList.remove("is-loading");
    document.body.classList.add("sequence-unavailable");

    if (dom.sequenceSection) {
      dom.sequenceSection.classList.add("is-unavailable");
    }

    if (dom.loader) {
      dom.loader.classList.add("has-error");
      dom.loader.setAttribute("aria-busy", "false");
    }

    if (dom.loaderProgressText) {
      dom.loaderProgressText.textContent = "Media unavailable";
    }
  }

  function resizeCanvas() {
    if (!dom.canvas || !dom.context) return;

    const cssWidth =
      dom.stickyVisual?.clientWidth ||
      dom.canvas.clientWidth ||
      window.innerWidth;
    const cssHeight =
      dom.stickyVisual?.clientHeight ||
      dom.canvas.clientHeight ||
      window.innerHeight;
    const dpr = Math.min(
      window.devicePixelRatio || 1,
      CONFIG.MAX_DEVICE_PIXEL_RATIO
    );

    state.measurements.canvasWidth = Math.max(1, Math.round(cssWidth));
    state.measurements.canvasHeight = Math.max(1, Math.round(cssHeight));
    state.measurements.dpr = dpr;

    const pixelWidth = Math.max(1, Math.round(cssWidth * dpr));
    const pixelHeight = Math.max(1, Math.round(cssHeight * dpr));

    if (dom.canvas.width !== pixelWidth || dom.canvas.height !== pixelHeight) {
      dom.canvas.width = pixelWidth;
      dom.canvas.height = pixelHeight;
      dom.canvas.style.width = `${cssWidth}px`;
      dom.canvas.style.height = `${cssHeight}px`;
    }

    dom.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    dom.context.imageSmoothingEnabled = true;
    dom.context.imageSmoothingQuality = "high";

    if (state.currentRenderedImage) {
      drawFrame(state.currentRenderedIndex, true);
    } else {
      clearCanvas();
    }
  }

  function clearCanvas() {
    if (!dom.context) return;

    dom.context.save();
    dom.context.setTransform(
      state.measurements.dpr,
      0,
      0,
      state.measurements.dpr,
      0,
      0
    );
    dom.context.fillStyle = CONFIG.FRAME_BACKGROUND;
    dom.context.fillRect(
      0,
      0,
      state.measurements.canvasWidth,
      state.measurements.canvasHeight
    );
    dom.context.restore();
  }

  function calculateContainGeometry(sourceWidth, sourceHeight, targetWidth, targetHeight) {
    const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;

    return {
      x: (targetWidth - width) / 2,
      y: (targetHeight - height) / 2,
      width,
      height,
    };
  }

  function calculateCoverGeometry(
    sourceWidth,
    sourceHeight,
    targetWidth,
    targetHeight,
    focalPoint
  ) {
    const scale = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight);
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;
    const overflowX = Math.max(0, width - targetWidth);
    const overflowY = Math.max(0, height - targetHeight);

    return {
      x: clamp(-overflowX * focalPoint.x, -overflowX, 0),
      y: clamp(-overflowY * focalPoint.y, -overflowY, 0),
      width,
      height,
    };
  }

  function findNearestLoadedFrame(targetIndex) {
    const normalizedTarget = clamp(
      Math.round(targetIndex),
      0,
      CONFIG.TOTAL_FRAME_COUNT - 1
    );

    if (frameStore.loaded.has(normalizedTarget)) {
      return {
        index: normalizedTarget,
        image: frameStore.loaded.get(normalizedTarget),
      };
    }

    const radius = Math.min(
      CONFIG.FRAME_SEARCH_RADIUS,
      CONFIG.TOTAL_FRAME_COUNT - 1
    );

    for (let distance = 1; distance <= radius; distance += 1) {
      const backward = normalizedTarget - distance;
      const forward = normalizedTarget + distance;

      if (backward >= 0 && frameStore.loaded.has(backward)) {
        return { index: backward, image: frameStore.loaded.get(backward) };
      }

      if (
        forward < CONFIG.TOTAL_FRAME_COUNT &&
        frameStore.loaded.has(forward)
      ) {
        return { index: forward, image: frameStore.loaded.get(forward) };
      }
    }

    if (state.currentRenderedImage) {
      return {
        index: state.currentRenderedIndex,
        image: state.currentRenderedImage,
      };
    }

    return firstAvailableFrame();
  }

  function drawFrame(targetIndex, force = false) {
    if (!dom.context || !dom.canvas || !state.documentVisible) return false;

    const nearest = findNearestLoadedFrame(targetIndex);
    if (!nearest) {
      clearCanvas();
      return false;
    }

    if (!force && nearest.index === state.lastDrawnFrameIndex) {
      return true;
    }

    const image = nearest.image;
    const sourceWidth = image.naturalWidth || CONFIG.FRAME_WIDTH;
    const sourceHeight = image.naturalHeight || CONFIG.FRAME_HEIGHT;
    const targetWidth = state.measurements.canvasWidth;
    const targetHeight = state.measurements.canvasHeight;
    const drawMode = state.isMobile
      ? CONFIG.MOBILE_DRAW_MODE
      : CONFIG.DESKTOP_DRAW_MODE;
    const focalPoint = state.isMobile
      ? CONFIG.FOCAL_POINT.mobile
      : CONFIG.FOCAL_POINT.desktop;

    const geometry =
      drawMode === "cover"
        ? calculateCoverGeometry(
            sourceWidth,
            sourceHeight,
            targetWidth,
            targetHeight,
            focalPoint
          )
        : calculateContainGeometry(
            sourceWidth,
            sourceHeight,
            targetWidth,
            targetHeight
          );

    clearCanvas();

    try {
      dom.context.drawImage(
        image,
        geometry.x,
        geometry.y,
        geometry.width,
        geometry.height
      );
    } catch (error) {
      warn(`Frame ${frameIndexToNumber(nearest.index)} could not be drawn.`, error);
      return false;
    }

    state.lastDrawnFrameIndex = nearest.index;
    state.currentRenderedImage = image;
    state.currentRenderedIndex = nearest.index;
    return true;
  }

  function setSequenceHeight() {
    if (!dom.sequenceSection) return;

    if (state.reducedMotion) {
      dom.sequenceSection.style.removeProperty("height");
      dom.sequenceSection.classList.add("is-reduced-motion");
    } else {
      dom.sequenceSection.style.height = CONFIG.SCROLL_SECTION_HEIGHT;
      dom.sequenceSection.classList.remove("is-reduced-motion");
    }
  }

  function measureSequence() {
    state.measurements.viewportHeight = window.innerHeight;

    if (!dom.sequenceSection) {
      state.measurements.sectionStart = 0;
      state.measurements.sectionHeight = 0;
      state.measurements.scrollDistance = 1;
      return;
    }

    const rect = dom.sequenceSection.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset || 0;

    state.measurements.sectionStart = rect.top + scrollY;
    state.measurements.sectionHeight = dom.sequenceSection.offsetHeight;
    state.measurements.scrollDistance = Math.max(
      1,
      state.measurements.sectionHeight - state.measurements.viewportHeight
    );
  }

  function calculateSequenceProgress(scrollY) {
    if (!dom.sequenceSection || state.reducedMotion) return 0;

    const rawProgress =
      (scrollY - state.measurements.sectionStart) /
      state.measurements.scrollDistance;

    return clamp(rawProgress, 0, 1);
  }

  function progressToFrameIndex(progress) {
    const mappedProgress =
      progress >= CONFIG.FINAL_FRAME_HOLD_START
        ? 1
        : progress / CONFIG.FINAL_FRAME_HOLD_START;

    return clamp(mappedProgress, 0, 1) * (CONFIG.TOTAL_FRAME_COUNT - 1);
  }

  function onScroll() {
    state.lastScrollY = window.scrollY || window.pageYOffset || 0;

    updateNavigationScrolledState();

    if (!state.reducedMotion && dom.sequenceSection) {
      state.targetProgress = calculateSequenceProgress(state.lastScrollY);
      state.targetFrameIndex = progressToFrameIndex(state.targetProgress);
      updateProgressUi(state.targetProgress);
      requestAnimation();
    }

    if (state.processSectionVisible) {
      scheduleProcessProgressUpdate();
    }
  }

  function requestAnimation() {
    if (
      state.animationFrameId ||
      !state.documentVisible ||
      state.reducedMotion ||
      !state.experienceReady
    ) {
      return;
    }

    state.animationFrameId = window.requestAnimationFrame(runAnimationFrame);
  }

  function runAnimationFrame() {
    state.animationFrameId = 0;

    if (
      !state.documentVisible ||
      state.reducedMotion ||
      !state.experienceReady
    ) {
      return;
    }

    const difference = state.targetFrameIndex - state.displayedFrameIndex;

    if (Math.abs(difference) <= 0.01) {
      state.displayedFrameIndex = state.targetFrameIndex;
    } else {
      state.displayedFrameIndex += difference * CONFIG.EASING_STRENGTH;
    }

    const roundedIndex = clamp(
      Math.round(state.displayedFrameIndex),
      0,
      CONFIG.TOTAL_FRAME_COUNT - 1
    );

    if (roundedIndex !== state.lastDrawnFrameIndex) {
      drawFrame(roundedIndex);
    }

    updateStageFromFrame(frameIndexToNumber(roundedIndex));

    if (Math.abs(state.targetFrameIndex - state.displayedFrameIndex) > 0.01) {
      requestAnimation();
    }
  }

  function getStageBounds() {
    const checkpoints = CONFIG.CHECKPOINTS;
    const first = CONFIG.START_FRAME_NUMBER;

    return [
      {
        stage: STAGES[0],
        start: first,
        end: Math.max(first, checkpoints.CAMERA_START),
      },
      {
        stage: STAGES[1],
        start: checkpoints.CAMERA_START,
        end: Math.max(checkpoints.CAMERA_START, checkpoints.MORPH_START),
      },
      {
        stage: STAGES[2],
        start: checkpoints.MORPH_START,
        end: Math.max(checkpoints.MORPH_START, checkpoints.PHONE_COMPLETE),
      },
      {
        stage: STAGES[3],
        start: checkpoints.PHONE_COMPLETE,
        end: Math.max(checkpoints.PHONE_COMPLETE, checkpoints.NOTIFICATIONS_START),
      },
      {
        stage: STAGES[4],
        start: checkpoints.NOTIFICATIONS_START,
        end: Math.max(
          checkpoints.NOTIFICATIONS_START,
          checkpoints.NOTIFICATIONS_PEAK
        ),
      },
      {
        stage: STAGES[5],
        start: checkpoints.NOTIFICATIONS_PEAK,
        end: checkpoints.FINAL_FRAME,
      },
    ];
  }

  function getStageForFrame(frameNumber) {
    const bounds = getStageBounds();

    for (let index = 0; index < bounds.length; index += 1) {
      const item = bounds[index];
      const isLast = index === bounds.length - 1;
      const inside = isLast
        ? frameNumber >= item.start && frameNumber <= item.end
        : frameNumber >= item.start && frameNumber < item.end;

      if (inside) {
        const span = Math.max(1, item.end - item.start);
        return {
          index,
          stage: item.stage,
          progress: clamp((frameNumber - item.start) / span, 0, 1),
        };
      }
    }

    return frameNumber < bounds[0].start
      ? { index: 0, stage: bounds[0].stage, progress: 0 }
      : {
          index: bounds.length - 1,
          stage: bounds[bounds.length - 1].stage,
          progress: 1,
        };
  }

  function panelMatchesStage(panel, stage, index) {
    const raw =
      panel.dataset.sequenceStage ||
      panel.dataset.stage ||
      panel.getAttribute("data-stage") ||
      "";
    const normalized = raw.toLowerCase().trim();

    return (
      normalized === stage.id ||
      normalized === String(stage.number) ||
      normalized === String(index + 1)
    );
  }

  function activateStage(stageIndex, stage) {
    dom.stagePanels.forEach((panel) => {
      const active = panelMatchesStage(panel, stage, stageIndex);
      panel.classList.toggle("is-active", active);
      panel.classList.toggle("is-inactive", !active);
      panel.setAttribute("aria-hidden", String(!active));

      if ("inert" in panel) {
        panel.inert = !active;
      }
    });

    if (dom.currentStageLabel) {
      dom.currentStageLabel.textContent = stage.label;
      dom.currentStageLabel.dataset.stage = stage.id;
    }

    if (dom.sequenceSection) {
      dom.sequenceSection.dataset.activeStage = stage.id;
      dom.sequenceSection.style.setProperty(
        "--active-stage-index",
        String(stageIndex)
      );
    }

    state.lastActiveStageIndex = stageIndex;
  }

  function updateStageFromFrame(frameNumber) {
    const stageState = getStageForFrame(frameNumber);

    if (stageState.index !== state.lastActiveStageIndex) {
      activateStage(stageState.index, stageState.stage);
    }

    updateStageSpecificElements(stageState);
  }

  function revealByStageProgress(elements, progress, labels) {
    const count = Math.max(1, elements.length);

    elements.forEach((element, index) => {
      const threshold = index / count;
      const active = progress >= threshold;

      element.classList.toggle("is-active", active);
      element.classList.toggle("is-visible", active);
      element.style.setProperty("--item-index", String(index));

      if (!element.textContent.trim() && labels[index]) {
        element.textContent = labels[index];
      }
    });
  }

  function updateStageSpecificElements(stageState) {
    if (stageState.index === 1) {
      revealByStageProgress(
        dom.serviceLabels,
        stageState.progress,
        SERVICE_LABELS
      );
    } else {
      dom.serviceLabels.forEach((element) => {
        element.classList.remove("is-active", "is-visible");
      });
    }

    if (stageState.index === 2) {
      const itemCount = Math.max(1, dom.processStageItems.length);
      const activeIndex = clamp(
        Math.floor(stageState.progress * itemCount),
        0,
        itemCount - 1
      );

      dom.processStageItems.forEach((item, index) => {
        const active = index === activeIndex;
        const complete = index < activeIndex;

        item.classList.toggle("is-active", active);
        item.classList.toggle("is-complete", complete);
        item.setAttribute("aria-current", active ? "step" : "false");

        if (!item.textContent.trim() && PROCESS_LABELS[index]) {
          item.textContent = `${String(index + 1).padStart(2, "0")} — ${
            PROCESS_LABELS[index]
          }`;
        }
      });
    } else {
      dom.processStageItems.forEach((item) => {
        item.classList.remove("is-active", "is-complete");
        item.setAttribute("aria-current", "false");
      });
    }

    if (stageState.index === 4) {
      const count = Math.max(1, dom.engagementWords.length);

      dom.engagementWords.forEach((word, index) => {
        const threshold = (index + 0.25) / count;
        const active = stageState.progress >= threshold;

        word.classList.toggle("is-active", active);
        word.classList.toggle("is-visible", active);
        word.classList.toggle("is-left", index % 2 === 0);
        word.classList.toggle("is-right", index % 2 !== 0);
        word.style.setProperty("--engagement-index", String(index));

        if (!word.textContent.trim() && ENGAGEMENT_LABELS[index]) {
          word.textContent = ENGAGEMENT_LABELS[index];
        }
      });
    } else {
      dom.engagementWords.forEach((word) => {
        word.classList.remove(
          "is-active",
          "is-visible",
          "is-left",
          "is-right"
        );
      });
    }
  }

  function updateProgressUi(progress) {
    const percent = Math.round(clamp(progress, 0, 1) * 100);

    if (percent === state.lastProgressPercent) return;
    state.lastProgressPercent = percent;

    if (dom.sequenceSection) {
      dom.sequenceSection.style.setProperty(
        "--sequence-progress",
        `${percent}%`
      );
    }

    if (dom.scrollProgressFill) {
      dom.scrollProgressFill.style.setProperty(
        "--sequence-progress",
        `${percent}%`
      );
      dom.scrollProgressFill.style.setProperty(
        "--scroll-progress",
        `${percent}%`
      );
      dom.scrollProgressFill.style.transform = "none";
      dom.scrollProgressFill.setAttribute("aria-valuemin", "0");
      dom.scrollProgressFill.setAttribute("aria-valuemax", "100");
      dom.scrollProgressFill.setAttribute("aria-valuenow", String(percent));
    }

    if (dom.scrollProgressText) {
      dom.scrollProgressText.textContent = `${percent}%`;
    }
  }

  function updateNavigationScrolledState() {
    if (!dom.navigation) return;
    dom.navigation.classList.toggle("is-scrolled", state.lastScrollY > 24);
  }

  function closeMobileMenu({ restoreFocus = false } = {}) {
    if (!dom.mobileMenuButton || !dom.mobileMenuPanel || !state.menuOpen) return;

    state.menuOpen = false;
    dom.mobileMenuButton.setAttribute("aria-expanded", "false");
    dom.mobileMenuPanel.classList.remove("is-open");
    dom.mobileMenuPanel.setAttribute("aria-hidden", "true");
    dom.mobileMenuPanel.hidden = true;
    document.body.classList.remove("menu-open");
    document.body.style.overflow = state.bodyOverflowBeforeMenu;

    if (restoreFocus) {
      dom.mobileMenuButton.focus();
    }
  }

  function openMobileMenu() {
    if (!dom.mobileMenuButton || !dom.mobileMenuPanel || state.menuOpen) return;

    state.menuOpen = true;
    state.bodyOverflowBeforeMenu = document.body.style.overflow;

    dom.mobileMenuButton.setAttribute("aria-expanded", "true");
    dom.mobileMenuPanel.hidden = false;
    dom.mobileMenuPanel.classList.add("is-open");
    dom.mobileMenuPanel.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
    document.body.style.overflow = "hidden";

    const firstFocusable = dom.mobileMenuPanel.querySelector(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    firstFocusable?.focus();
  }

  function toggleMobileMenu() {
    if (state.menuOpen) {
      closeMobileMenu({ restoreFocus: true });
    } else {
      openMobileMenu();
    }
  }

  function handleAnchorNavigation(event) {
    const link = event.currentTarget;
    const href = link.getAttribute("href");

    if (!href || href === "#" || !href.startsWith("#")) return;

    let target;
    try {
      target = document.querySelector(href);
    } catch {
      return;
    }

    if (!target) return;

    event.preventDefault();
    closeMobileMenu();

    target.scrollIntoView({
      behavior: state.reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  function setupNavigation() {
    updateNavigationScrolledState();

    if (dom.mobileMenuButton && dom.mobileMenuPanel) {
      dom.mobileMenuButton.setAttribute("aria-expanded", "false");
      dom.mobileMenuPanel.setAttribute("aria-hidden", "true");
      dom.mobileMenuButton.addEventListener("click", toggleMobileMenu);

      document.querySelectorAll("[data-menu-close], [data-menu-close-link]").forEach((control) => {
        control.addEventListener("click", () => closeMobileMenu());
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && state.menuOpen) {
          closeMobileMenu({ restoreFocus: true });
        }
      });
    }

    dom.navigationLinks.forEach((link) => {
      link.addEventListener("click", handleAnchorNavigation);
    });

    const sectionEntries = dom.navigationLinks
      .map((link) => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#") || href === "#") return null;

        try {
          const section = document.querySelector(href);
          return section ? { link, section } : null;
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    if (!sectionEntries.length || !("IntersectionObserver" in window)) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleEntries.length) return;

        const activeSection = visibleEntries[0].target;

        sectionEntries.forEach(({ link, section }) => {
          const active = section === activeSection;
          link.classList.toggle("is-active", active);

          if (active) {
            link.setAttribute("aria-current", "page");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0, 0.1, 0.3, 0.6],
      }
    );

    sectionEntries.forEach(({ section }) => sectionObserver.observe(section));
  }

  function setupRevealObservers() {
    if (!dom.revealElements.length) return;

    if (!("IntersectionObserver" in window)) {
      dom.revealElements.forEach((element) => element.classList.add("is-revealed"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12,
      }
    );

    dom.revealElements.forEach((element) => revealObserver.observe(element));
  }

  function scheduleProcessProgressUpdate() {
    if (state.processFrameId) return;

    state.processFrameId = window.requestAnimationFrame(() => {
      state.processFrameId = 0;
      updateProcessProgress();
    });
  }

  function updateProcessProgress() {
    if (!dom.processSection || !state.processSectionVisible) return;

    const rect = dom.processSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const travel = viewportHeight + rect.height;
    const progress = clamp((viewportHeight - rect.top) / Math.max(1, travel), 0, 1);

    dom.processSection.style.setProperty(
      "--process-progress",
      String(progress)
    );

    const stepCount = Math.max(1, dom.processSteps.length);

    dom.processSteps.forEach((step, index) => {
      const threshold = (index + 0.35) / stepCount;
      step.classList.toggle("is-active", progress >= threshold);
    });
  }

  function setupProcessObserver() {
    if (!dom.processSection) return;

    if (!("IntersectionObserver" in window)) {
      state.processSectionVisible = true;
      updateProcessProgress();
      return;
    }

    const processObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target !== dom.processSection) return;
          state.processSectionVisible = entry.isIntersecting;

          if (entry.isIntersecting) {
            scheduleProcessProgressUpdate();
          }
        });
      },
      { threshold: 0 }
    );

    processObserver.observe(dom.processSection);
  }

  function isPlaceholder(value) {
    return !value || PLACEHOLDER_PATTERN.test(String(value));
  }

  function contactHref(type) {
    const contact = CONFIG.CONTACT;

    switch (type) {
      case "instagram":
        return contact.instagramUrl;
      case "email":
        return isPlaceholder(contact.email) ? "" : `mailto:${contact.email}`;
      case "phone": {
        if (isPlaceholder(contact.phone)) return "";
        const normalized = contact.phone.replace(/[^\d+]/g, "");
        return `tel:${normalized}`;
      }
      case "whatsapp":
      case "lets-talk":
      case "start-conversation":
        return contact.whatsappUrl;
      default:
        return "";
    }
  }

  function applyContactConfiguration() {
    dom.contactLinks.forEach((link) => {
      const type = (
        link.dataset.contact ||
        link.dataset.contactType ||
        (link.hasAttribute("data-instagram-link") || link.hasAttribute("data-footer-instagram-link")
          ? "instagram"
          : link.hasAttribute("data-footer-email-link")
            ? "email"
            : link.hasAttribute("data-start-conversation-link")
              ? "start-conversation"
              : "")
      ).toLowerCase();
      const href = contactHref(type);

      if (!href || isPlaceholder(href)) {
        link.removeAttribute("href");
        link.setAttribute("aria-disabled", "true");
        link.classList.add("is-disabled", "needs-configuration");
        link.addEventListener("click", (event) => event.preventDefault());
        warn(`Contact link '${type || "unknown"}' still needs configuration.`);
        return;
      }

      link.href = href;
      link.removeAttribute("aria-disabled");
      link.classList.remove("is-disabled", "needs-configuration");

      if (type === "instagram") {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    });
  }

  function getFormField(form, names) {
    for (const name of names) {
      const field = form.elements.namedItem(name);
      if (field instanceof HTMLElement) return field;
    }
    return null;
  }

  function getErrorElement(field) {
    if (!field) return null;

    const fieldName = field.getAttribute("name") || field.id;
    if (!fieldName) return null;

    let errorElement = document.querySelector(
      `[data-error-for="${fieldName}"]`
    );

    if (!errorElement) {
      errorElement = document.createElement("p");
      errorElement.dataset.errorFor = fieldName;
      errorElement.className = "field-error";
      errorElement.id = `${fieldName}-error`;
      errorElement.setAttribute("aria-live", "polite");
      field.insertAdjacentElement("afterend", errorElement);
    }

    const describedBy = new Set(
      (field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean)
    );
    describedBy.add(errorElement.id);
    field.setAttribute("aria-describedby", Array.from(describedBy).join(" "));

    return errorElement;
  }

  function setFieldError(field, message) {
    if (!field) return;
    const errorElement = getErrorElement(field);

    field.classList.add("has-error");
    field.setAttribute("aria-invalid", "true");

    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  function clearFieldError(field) {
    if (!field) return;
    const errorElement = getErrorElement(field);

    field.classList.remove("has-error");
    field.setAttribute("aria-invalid", "false");

    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  function trimmedValue(field) {
    return field && "value" in field ? String(field.value).trim() : "";
  }

  function validateContactForm(form) {
    const fields = {
      name: getFormField(form, ["name", "fullName", "full_name"]),
      brand: getFormField(form, ["brand", "company", "brandCompany"]),
      email: getFormField(form, ["email"]),
      phone: getFormField(form, ["phone", "mobile"]),
      instagram: getFormField(form, ["instagram", "instagramHandle", "handle"]),
      service: getFormField(form, ["service", "requestedService"]),
      message: getFormField(form, ["message", "details"]),
    };

    const errors = [];
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phonePattern = /^[+\d][\d\s().-]{6,20}$/;
    const instagramPattern = /^@?[A-Za-z0-9._]{1,30}$/;

    Object.values(fields).forEach(clearFieldError);

    const name = trimmedValue(fields.name);
    if (!name) {
      errors.push([fields.name, "Please enter your name."]);
    } else if (name.length > 80) {
      errors.push([fields.name, "Please keep your name under 80 characters."]);
    }

    const brand = trimmedValue(fields.brand);
    if (!brand) {
      errors.push([fields.brand, "Please enter your brand or company."]);
    } else if (brand.length > 120) {
      errors.push([fields.brand, "Please keep this under 120 characters."]);
    }

    const email = trimmedValue(fields.email);
    if (!email) {
      errors.push([fields.email, "Please enter your email address."]);
    } else if (!emailPattern.test(email) || email.length > 254) {
      errors.push([fields.email, "Please enter a valid email address."]);
    }

    const phone = trimmedValue(fields.phone);
    if (phone && !phonePattern.test(phone)) {
      errors.push([fields.phone, "Please enter a valid phone number."]);
    }

    const instagram = trimmedValue(fields.instagram);
    if (!instagram) {
      errors.push([fields.instagram, "Please enter your Instagram handle."]);
    } else if (!instagramPattern.test(instagram)) {
      errors.push([fields.instagram, "Please enter a valid Instagram handle."]);
    }

    const service = trimmedValue(fields.service);
    if (!service) {
      errors.push([fields.service, "Please select a requested service."]);
    } else if (service.length > 120) {
      errors.push([fields.service, "Please keep this under 120 characters."]);
    }

    const message = trimmedValue(fields.message);
    if (!message) {
      errors.push([fields.message, "Please tell us what you need."]);
    } else if (message.length < 10) {
      errors.push([fields.message, "Please add a little more detail."]);
    } else if (message.length > 3000) {
      errors.push([fields.message, "Please keep your message under 3,000 characters."]);
    }

    errors.forEach(([field, messageText]) => {
      if (field) setFieldError(field, messageText);
    });

    if (errors.length && errors[0][0]) {
      errors[0][0].focus();
    }

    return {
      valid: errors.length === 0,
      fields,
    };
  }

  function setSubmitStatus(message, type = "") {
    if (!dom.submitStatus) return;

    dom.submitStatus.textContent = message;
    dom.submitStatus.classList.remove("is-success", "is-error", "is-info");

    if (type) {
      dom.submitStatus.classList.add(`is-${type}`);
    }

    dom.submitStatus.setAttribute("role", type === "error" ? "alert" : "status");
  }

  async function submitContactForm(event) {
    event.preventDefault();

    if (!dom.contactForm || state.formSubmitting) return;

    const validation = validateContactForm(dom.contactForm);
    if (!validation.valid) {
      setSubmitStatus("Please correct the highlighted fields.", "error");
      return;
    }

    const endpoint = CONFIG.CONTACT.formEndpoint;

    if (isPlaceholder(endpoint)) {
      setSubmitStatus(
        "Form integration required. Please connect your email or form endpoint before launch.",
        "error"
      );
      warn("Contact form endpoint is not configured.");
      return;
    }

    const submitButton = dom.contactForm.querySelector(
      'button[type="submit"], input[type="submit"]'
    );
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    state.formSubmitting = true;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
    }

    setSubmitStatus("Sending your message…", "info");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(
          Object.fromEntries(new FormData(dom.contactForm).entries())
        ),
        signal: controller.signal,
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (!response.ok) {
        const message =
          payload?.message ||
          (response.status === 422
            ? "Please review your details and try again."
            : "Your message could not be sent. Please try again.");
        throw new Error(message);
      }

      dom.contactForm.reset();
      Object.values(validation.fields).forEach(clearFieldError);
      setSubmitStatus(
        payload?.message || "Thanks — your message has been sent.",
        "success"
      );
    } catch (error) {
      const message =
        error.name === "AbortError"
          ? "The request timed out. Please try again."
          : error.message || "A network error occurred. Please try again.";

      setSubmitStatus(message, "error");
    } finally {
      window.clearTimeout(timeoutId);
      state.formSubmitting = false;

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
      }
    }
  }

  function setupContactForm() {
    if (!dom.contactForm) return;

    dom.contactForm.setAttribute("novalidate", "");
    dom.contactForm.addEventListener("submit", submitContactForm);

    const fields = Array.from(
      dom.contactForm.querySelectorAll("input, select, textarea")
    );

    fields.forEach((field) => {
      const clear = () => {
        if (field.getAttribute("aria-invalid") === "true") {
          clearFieldError(field);
        }
      };

      field.addEventListener("input", clear);
      field.addEventListener("change", clear);
    });
  }

  function setupMagneticButtons() {
    const enabled =
      preferenceQueries.finePointer.matches && !state.reducedMotion;

    dom.magneticButtons.forEach((button) => {
      if (!enabled || button.matches("input, select, textarea")) {
        button.classList.remove("is-magnetic-enabled");
        button.style.removeProperty("--magnetic-x");
        button.style.removeProperty("--magnetic-y");
        return;
      }

      if (button.dataset.magneticBound === "true") {
        button.classList.add("is-magnetic-enabled");
        return;
      }

      button.dataset.magneticBound = "true";
      button.classList.add("is-magnetic-enabled");

      button.addEventListener("pointermove", (event) => {
        if (state.reducedMotion) return;

        const rect = button.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;

        button.style.setProperty("--magnetic-x", `${x.toFixed(2)}px`);
        button.style.setProperty("--magnetic-y", `${y.toFixed(2)}px`);
      });

      button.addEventListener("pointerleave", () => {
        button.style.setProperty("--magnetic-x", "0px");
        button.style.setProperty("--magnetic-y", "0px");
      });
    });
  }

  function applyReducedMotionPreference() {
    state.reducedMotion = preferenceQueries.reducedMotion.matches;

    document.documentElement.classList.toggle(
      "reduced-motion",
      state.reducedMotion
    );

    if (state.animationFrameId) {
      window.cancelAnimationFrame(state.animationFrameId);
      state.animationFrameId = 0;
    }

    setSequenceHeight();
    measureSequence();
    resizeCanvas();

    if (state.reducedMotion) {
      const representativeIndex = frameNumberToIndex(
        CONFIG.CHECKPOINTS.INSTAGRAM_VISIBLE
      );
      state.targetFrameIndex = representativeIndex;
      state.displayedFrameIndex = representativeIndex;
      drawFrame(representativeIndex, true);
      updateStageFromFrame(CONFIG.CHECKPOINTS.INSTAGRAM_VISIBLE);
      updateProgressUi(1);
    } else {
      state.targetProgress = calculateSequenceProgress(state.lastScrollY);
      state.targetFrameIndex = progressToFrameIndex(state.targetProgress);
      state.displayedFrameIndex = state.targetFrameIndex;
      drawFrame(Math.round(state.displayedFrameIndex), true);
      updateProgressUi(state.targetProgress);
      requestAnimation();
    }

    setupMagneticButtons();
  }

  function updateResponsiveMode() {
    const wasMobile = state.isMobile;
    state.isMobile = window.innerWidth < CONFIG.MOBILE_BREAKPOINT;

    document.documentElement.classList.toggle("is-mobile", state.isMobile);

    if (wasMobile && !state.isMobile) {
      closeMobileMenu();
    }
  }

  function handleResize() {
    updateResponsiveMode();
    setSequenceHeight();
    measureSequence();
    resizeCanvas();

    state.targetProgress = calculateSequenceProgress(
      window.scrollY || window.pageYOffset || 0
    );
    state.targetFrameIndex = progressToFrameIndex(state.targetProgress);

    if (!state.reducedMotion) {
      drawFrame(Math.round(state.displayedFrameIndex), true);
      updateProgressUi(state.targetProgress);
      requestAnimation();
    }

    if (state.processSectionVisible) {
      scheduleProcessProgressUpdate();
    }
  }

  const debouncedResize = debounce(handleResize, 160);

  function setupGlobalEvents() {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", debouncedResize, { passive: true });
    window.addEventListener("orientationchange", debouncedResize, {
      passive: true,
    });

    document.addEventListener("visibilitychange", () => {
      state.documentVisible = !document.hidden;

      if (!state.documentVisible) {
        if (state.animationFrameId) {
          window.cancelAnimationFrame(state.animationFrameId);
          state.animationFrameId = 0;
        }
        return;
      }

      measureSequence();
      resizeCanvas();

      if (!state.reducedMotion) {
        state.targetProgress = calculateSequenceProgress(
          window.scrollY || window.pageYOffset || 0
        );
        state.targetFrameIndex = progressToFrameIndex(state.targetProgress);
        requestAnimation();
      }
    });

    const onReducedMotionChange = () => applyReducedMotionPreference();

    if (typeof preferenceQueries.reducedMotion.addEventListener === "function") {
      preferenceQueries.reducedMotion.addEventListener(
        "change",
        onReducedMotionChange
      );
      preferenceQueries.finePointer.addEventListener(
        "change",
        setupMagneticButtons
      );
    } else {
      preferenceQueries.reducedMotion.addListener(onReducedMotionChange);
      preferenceQueries.finePointer.addListener(setupMagneticButtons);
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        measureSequence();
        resizeCanvas();
      });
    }
  }

  function applyStaticConfiguration() {
    document.documentElement.style.setProperty(
      "--frame-background",
      CONFIG.FRAME_BACKGROUND
    );
    document.documentElement.style.setProperty(
      "--sequence-frame-aspect",
      `${CONFIG.FRAME_WIDTH} / ${CONFIG.FRAME_HEIGHT}`
    );

    if (dom.copyrightYear) {
      dom.copyrightYear.textContent = String(new Date().getFullYear());
    }

    applyContactConfiguration();
  }

  function initializeFrameExperience() {
    if (!dom.canvas || !dom.context || !dom.sequenceSection) {
      document.body.classList.remove("is-loading");
      if (dom.loader) dom.loader.hidden = true;
      return;
    }

    document.body.classList.add("is-loading");
    dom.loader?.setAttribute("aria-busy", "true");

    clearCanvas();
    updateLoaderProgress();

    const priority = buildLoadPriority();
    enqueueFrames(priority);
  }

  function initialize() {
    state.configValid = validateConfiguration();
    cacheDom();
    applyStaticConfiguration();
    setupNavigation();
    setupRevealObservers();
    setupProcessObserver();
    setupContactForm();
    updateResponsiveMode();
    setupGlobalEvents();

    if (!state.configValid) {
      failExperienceGracefully();
      return;
    }

    setSequenceHeight();
    resizeCanvas();
    measureSequence();
    applyReducedMotionPreference();

    state.lastScrollY = window.scrollY || window.pageYOffset || 0;
    state.targetProgress = calculateSequenceProgress(state.lastScrollY);
    state.targetFrameIndex = progressToFrameIndex(state.targetProgress);
    state.displayedFrameIndex = state.targetFrameIndex;

    updateProgressUi(state.targetProgress);
    updateStageFromFrame(
      frameIndexToNumber(Math.round(state.displayedFrameIndex))
    );

    initializeFrameExperience();
    onScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
