(function () {
  "use strict";

  // =========================================================================
  // KEYBINDING REGISTRY
  //
  // To add a new keybinding:
  //   1. Add an entry to KEYBINDINGS below.
  //   2. Each entry needs:
  //        key      – the keyboard key (lowercase)
  //        selector – CSS selector for the toolbar button to click
  //        label    – human-readable name shown in the toast
  //
  // The toolbar buttons in three-cad-viewer follow the pattern:
  //   <span class="tcv_button_frame">
  //     <input class="tcv_reset tcv_btn tcv_button_<NAME>" type="button">
  //   </span>
  //
  // When active, the frame span gets the class "tcv_btn_click2".
  // =========================================================================

  const KEYBINDINGS = [
    {
      key: "u",
      selector: "input.tcv_button_distance",
      label: "Distance Measurement",
    },
    // --- Add more bindings here ---
    // Example:
    // {
    //   key: "a",
    //   selector: "input.tcv_button_angle",
    //   label: "Angle Measurement",
    // },
  ];

  // Build a lookup map: key -> binding
  const KEY_MAP = {};
  for (const binding of KEYBINDINGS) {
    KEY_MAP[binding.key] = binding;
  }

  // =========================================================================
  // Configuration
  // =========================================================================

  const ACTIVE_CLASS = "tcv_btn_click2";
  const FRAME_SELECTOR = ".tcv_button_frame";
  const TOAST_DURATION_MS = 1500;
  const POLL_INTERVAL_MS = 500;
  const MAX_POLL_ATTEMPTS = 60; // 30 seconds

  // =========================================================================
  // Toast notification
  // =========================================================================

  let toastEl = null;
  let toastTimer = null;

  function getToast() {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.id = "ocp-keybind-toast";
      Object.assign(toastEl.style, {
        position: "fixed",
        top: "12px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "8px 18px",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "600",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#fff",
        zIndex: "999999",
        pointerEvents: "none",
        opacity: "0",
        transition: "opacity 0.2s ease-in-out",
      });
      document.body.appendChild(toastEl);
    }
    return toastEl;
  }

  function showToast(message, isActive) {
    var el = getToast();
    el.style.backgroundColor = isActive
      ? "rgba(34, 139, 34, 0.9)"
      : "rgba(80, 80, 80, 0.9)";
    el.textContent = message;
    el.style.opacity = "1";

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.style.opacity = "0";
    }, TOAST_DURATION_MS);
  }

  // =========================================================================
  // Button helpers
  // =========================================================================

  function findButton(selector) {
    return document.querySelector(selector);
  }

  function isButtonActive(button) {
    var frame = button.closest(FRAME_SELECTOR);
    return frame ? frame.classList.contains(ACTIVE_CLASS) : false;
  }

  // =========================================================================
  // Keydown handler
  // =========================================================================

  function handleKeyDown(event) {
    // Skip when typing in form controls
    var tag = event.target.tagName.toLowerCase();
    if (
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      event.target.isContentEditable
    ) {
      return;
    }

    // Skip when modifier keys are held
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    var pressed = event.key.toLowerCase();
    var binding = KEY_MAP[pressed];
    if (!binding) return;

    var button = findButton(binding.selector);
    if (!button) {
      showToast(binding.label + " — toolbar not ready", false);
      return;
    }

    button.click();

    var active = isButtonActive(button);
    showToast(binding.label + (active ? " ON" : " OFF"), active);
  }

  // =========================================================================
  // Initialization — wait for toolbar then attach listener
  // =========================================================================

  function init() {
    var attempts = 0;
    var firstSelector = KEYBINDINGS[0] ? KEYBINDINGS[0].selector : null;

    function poll() {
      attempts++;
      if (firstSelector && document.querySelector(firstSelector)) {
        attach();
        return;
      }
      if (attempts >= MAX_POLL_ATTEMPTS) {
        attach(); // attach anyway so user gets feedback on keypress
        return;
      }
      setTimeout(poll, POLL_INTERVAL_MS);
    }

    function attach() {
      document.addEventListener("keydown", handleKeyDown);
      console.log(
        "[OCP Keybindings] Ready. Registered keys: " +
          KEYBINDINGS.map(function (b) {
            return b.key.toUpperCase() + "=" + b.label;
          }).join(", ")
      );
    }

    poll();
  }

  init();
})();
