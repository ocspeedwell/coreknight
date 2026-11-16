
(() => {
  "use strict";

  const cfg = window.COREKNIGHT_AI || {};
  const PHONE = "2347068991864";

  // Create Geraldine's launcher
  const launch = document.createElement("button");
  launch.id = "kc-launch";
  launch.type = "button";
  launch.setAttribute(
    "aria-label",
    "Chat with Geraldine, CoreKnight digital concierge"
  );
  launch.setAttribute("aria-controls", "kc-panel");
  launch.setAttribute("aria-expanded", "false");

  launch.innerHTML = `
    <img src="assets/geraldine-portrait.png" alt="">
    <span>
      <strong>Chat with Geraldine</strong>
      <small>CoreKnight Concierge</small>
    </span>
    <span class="kc-launch-dot" aria-hidden="true"></span>
  `;

  // Create conversation panel
  const panel = document.createElement("section");
  panel.id = "kc-panel";
  panel.hidden = true;
  panel.setAttribute(
    "aria-label",
    "Geraldine, CoreKnight digital concierge"
  );

  panel.innerHTML = `
    <div id="kc-header">
      <img
        class="kc-avatar"
        src="assets/geraldine-portrait.png"
        alt="Geraldine, fictional digital concierge avatar"
      >
      <div class="kc-identity">
        <strong>Geraldine</strong>
        <span>CoreKnight Digital Concierge · AI-powered</span>
      </div>
      <button id="kc-sound" type="button" aria-label="Mute Geraldine sounds" aria-pressed="true" title="Toggle Geraldine sound">♫</button>
      <button id="kc-close" type="button"
        aria-label="Close conversation">×</button>
    </div>

    <div id="kc-messages" role="log" aria-live="polite"></div>

    <div id="kc-actions">
      <button id="kc-human" type="button">
        Speak with a consultant on WhatsApp ↗
      </button>
    </div>

    <div id="kc-challenge"></div>

    <form id="kc-form">
      <input
        id="kc-input"
        maxlength="1200"
        placeholder="How can I help you today?"
        aria-label="Your message"
        required
        autocomplete="off"
      >
      <button id="kc-send" type="submit"
        aria-label="Send message">➤</button>
    </form>

    <div class="kc-disclaimer">
      Geraldine is an AI-powered concierge.
      Formal quotations and commitments require team approval.
    </div>
  `;

  document.body.append(launch, panel);

  const log = panel.querySelector("#kc-messages");
  const input = panel.querySelector("#kc-input");
  const form = panel.querySelector("#kc-form");
  const send = panel.querySelector("#kc-send");
  const challenge = panel.querySelector("#kc-challenge");

  const history = [];

  let widget = null;
  let busy = false;
  let verificationNotice = null;
  let soundEnabled = true;
  const soundButton = panel.querySelector("#kc-sound");
  soundButton.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundButton.textContent = soundEnabled ? "♫" : "♪̸";
    soundButton.setAttribute("aria-pressed", String(soundEnabled));
    soundButton.setAttribute("aria-label", soundEnabled ? "Mute Geraldine sounds" : "Enable Geraldine sounds");
    if (soundEnabled) window.CoreKnightSound?.chime();
  });
  function chime() { if (soundEnabled) window.CoreKnightSound?.chime(); }


  function bubble(role, value) {
    const element = document.createElement("div");

    element.className =
      "kc-msg " + (role === "user" ? "kc-user" : "kc-bot");

    element.textContent = value;
    log.append(element);
    log.scrollTop = log.scrollHeight;

    return element;
  }

  function showNotice(message) {
    if (!verificationNotice) {
      verificationNotice = document.createElement("div");
      verificationNotice.id = "kc-verification-notice";
      verificationNotice.setAttribute("role", "status");
      verificationNotice.style.cssText =
        "padding:8px 12px;font-size:12px;" +
        "color:#d8b778;text-align:center;";

      challenge.insertAdjacentElement(
        "afterend",
        verificationNotice
      );
    }

    verificationNotice.textContent = message;
  }

  function clearNotice() {
    if (verificationNotice) {
      verificationNotice.textContent = "";
    }
  }

  bubble(
    "assistant",
    "Hello, welcome to CoreKnight Technologies. " +
    "I'm Geraldine, your digital client relations concierge. " +
    "What can I help you accomplish today?"
  );

  // Turnstile is loaded once by index.html.
  // Do not inject another Turnstile script here.

  function initWidget() {
    if (widget !== null) return true;

    if (!window.turnstile || !cfg.turnstileSiteKey) {
      return false;
    }

    try {
      widget = window.turnstile.render("#kc-challenge", {
        sitekey: cfg.turnstileSiteKey,
        theme: "dark",
        appearance: "always",

        callback: function () {
          clearNotice();
        },

        "expired-callback": function () {
          showNotice(
            "Security verification expired. " +
            "Please complete it again."
          );
        },

        "error-callback": function (code) {
          console.error(
            "Geraldine Turnstile error:",
            code
          );

          showNotice(
            "Security verification is temporarily unavailable. " +
            "Please refresh the page or use WhatsApp."
          );
        }
      });

      return widget !== null && widget !== undefined;
    } catch (error) {
      console.error(
        "Geraldine widget initialization failed:",
        error
      );

      showNotice(
        "Unable to initialise security verification."
      );

      return false;
    }
  }

  // Wait for the shared Turnstile script to load.
  function waitForTurnstile(attempts = 0) {
    if (window.turnstile) {
      if (!panel.hidden) initWidget();
      return;
    }

    if (attempts < 50) {
      setTimeout(
        () => waitForTurnstile(attempts + 1),
        200
      );
    } else {
      console.error(
        "Geraldine: Turnstile script did not load."
      );

      if (!panel.hidden) {
        showNotice(
          "Security verification could not load. " +
          "Please refresh the page."
        );
      }
    }
  }

  function open() {
    panel.hidden = false;
    chime();
    launch.setAttribute("aria-expanded", "true");

    if (!initWidget()) {
      showNotice("Preparing secure conversation...");
      waitForTurnstile();
    }

    input.focus();
  }

  function close() {
    panel.hidden = true;
    launch.setAttribute("aria-expanded", "false");
    launch.focus();
  }

  launch.addEventListener("click", () => {
    panel.hidden ? open() : close();
  });

  panel.querySelector("#kc-close").addEventListener(
    "click",
    close
  );

  // WhatsApp handover
  function whatsapp(includeSummary = false) {
    let message =
      "Hello CoreKnight, I would like to speak " +
      "with a human consultant.";

    if (includeSummary) {
      const recent = history
        .filter(item => item.role === "user")
        .slice(-3)
        .map(item => item.content)
        .join(" | ")
        .slice(0, 650);

      if (recent) {
        message += " My enquiry: " + recent;
      }
    }

    const url =
      "https://wa.me/" +
      PHONE +
      "?text=" +
      encodeURIComponent(message);

    window.open(url, "_blank", "noopener,noreferrer");
  }

  panel.querySelector("#kc-human").addEventListener(
    "click",
    () => {
      const hasHistory = history.some(
        item => item.role === "user"
      );

      if (!hasHistory) {
        whatsapp(false);
        return;
      }

      const consent = window.confirm(
        "Would you like to include a short summary " +
        "of your recent messages when opening WhatsApp?\n\n" +
        "Select OK to include the summary.\n" +
        "Select Cancel to open WhatsApp without it."
      );

      whatsapp(consent);
    }
  );

  // Submit customer messages
  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (busy) return;

    const message = input.value.trim();
    if (!message) return;

    if (!cfg.apiUrl) {
      showNotice(
        "The concierge service is not configured yet."
      );
      return;
    }

    if (!initWidget()) {
      showNotice(
        "Preparing security verification. " +
        "Please wait a moment."
      );

      waitForTurnstile();
      return;
    }

    let token = "";

    try {
      token = window.turnstile.getResponse(widget);
    } catch (error) {
      console.error(
        "Geraldine verification error:",
        error
      );
    }

    if (!token) {
      showNotice(
        "Please complete the security verification " +
        "above before sending your message."
      );
      return;
    }

    clearNotice();

    const nextHistory = [
      ...history,
      { role: "user", content: message }
    ];

    input.value = "";
    bubble("user", message);

    busy = true;
    send.disabled = true;

    const waiting = bubble(
      "assistant",
      "Geraldine is responding..."
    );

    try {
      const response = await fetch(cfg.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: nextHistory.slice(-10),
          turnstileToken: token
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Service temporarily unavailable"
        );
      }

      const answer = String(
        data.reply ||
        "Please contact hello@coreknight.com " +
        "for further assistance."
      );

      history.push(
        { role: "user", content: message },
        { role: "assistant", content: answer }
      );

      waiting.textContent = answer;
      chime();

    } catch (error) {
      console.error(
        "Geraldine request failed:",
        error
      );

      // Preserve the message so the visitor can retry.
      input.value = message;

      waiting.textContent =
        "I'm unable to complete your request right now. " +
        "Please try again or speak with our team on WhatsApp.";

    } finally {
      busy = false;
      send.disabled = false;

      if (widget !== null && window.turnstile) {
        try {
          window.turnstile.reset(widget);
        } catch (error) {
          console.error(
            "Geraldine Turnstile reset failed:",
            error
          );
        }
      }

      log.scrollTop = log.scrollHeight;
      input.focus();
    }
  });

  // Initialise using the shared Turnstile script.
  waitForTurnstile();

})();
