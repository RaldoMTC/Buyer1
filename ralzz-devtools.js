(function () {
  function init() {
    if (window.__RALZZ_DEVTOOLS__) return;
    window.__RALZZ_DEVTOOLS__ = true;

    // ===== ROOT =====
    const root = document.createElement('div');
    root.style.all = "initial";
    root.style.position = "fixed";
    root.style.top = "60px";
    root.style.left = "10px";
    root.style.width = "320px";
    root.style.height = "240px";
    root.style.background = "#0d1117";
    root.style.color = "#c9d1d9";
    root.style.fontFamily = "monospace";
    root.style.fontSize = "11px";
    root.style.zIndex = "99999999";
    root.style.borderRadius = "10px";
    root.style.boxShadow = "0 0 10px #000";
    root.style.display = "none";
    root.style.overflow = "hidden";
    root.style.pointerEvents = "auto";

    document.body.appendChild(root);

    // ===== HEADER =====
    const header = document.createElement('div');
    header.innerText = "Ralzz Dev";
    header.style.padding = "6px";
    header.style.background = "#161b22";
    header.style.cursor = "move";
    root.appendChild(header);

    // ===== TABS =====
    const tabs = document.createElement('div');
    tabs.style.display = "flex";
    tabs.style.background = "#21262d";
    root.appendChild(tabs);

    const content = document.createElement('div');
    content.style.padding = "5px";
    content.style.height = "180px";
    content.style.overflow = "auto";
    root.appendChild(content);

    const panels = {
      console: document.createElement('div'),
      elements: document.createElement('div'),
      network: document.createElement('div')
    };

    function switchTab(name) {
      content.innerHTML = '';
      content.appendChild(panels[name]);
    }

    Object.keys(panels).forEach(name => {
      const btn = document.createElement('div');
      btn.innerText = name;
      btn.style.flex = "1";
      btn.style.padding = "4px";
      btn.style.textAlign = "center";
      btn.style.cursor = "pointer";
      btn.style.color = "#fff";

      btn.addEventListener('click', () => switchTab(name));
      tabs.appendChild(btn);
    });

    switchTab('console');

    // ===== FLOAT BUTTON =====
    const toggle = document.createElement('div');
    toggle.innerText = "DEV";
    toggle.style.all = "initial";
    toggle.style.position = "fixed";
    toggle.style.bottom = "20px";
    toggle.style.left = "20px";
    toggle.style.background = "#22c55e";
    toggle.style.color = "#fff";
    toggle.style.padding = "8px 12px";
    toggle.style.borderRadius = "20px";
    toggle.style.fontSize = "14px";
    toggle.style.fontFamily = "sans-serif";
    toggle.style.zIndex = "999999999";
    toggle.style.cursor = "pointer";
    toggle.style.pointerEvents = "auto";

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = root.style.display === 'none' || root.style.display === '';
      root.style.display = isHidden ? 'block' : 'none';
    });

    document.body.appendChild(toggle);

    // ===== DRAG (TOUCH FIX) =====
    let isDrag = false, offsetX = 0, offsetY = 0;

    header.addEventListener('touchstart', (e) => {
      isDrag = true;
      const t = e.touches[0];
      offsetX = t.clientX - root.offsetLeft;
      offsetY = t.clientY - root.offsetTop;
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (!isDrag) return;
      const t = e.touches[0];
      root.style.left = (t.clientX - offsetX) + "px";
      root.style.top = (t.clientY - offsetY) + "px";
    });

    document.addEventListener('touchend', () => {
      isDrag = false;
    });

    // ===== CONSOLE =====
    const oldLog = console.log;
    console.log = function (...args) {
      oldLog.apply(console, args);
      const line = document.createElement('div');
      line.innerText = args.join(' ');
      panels.console.appendChild(line);
    };

    // ===== ELEMENTS =====
    panels.elements.innerText = document.documentElement.outerHTML;

    // ===== NETWORK =====
    const oldFetch = window.fetch;
    window.fetch = async (...args) => {
      const log = document.createElement('div');
      log.innerText = "FETCH: " + args[0];
      panels.network.appendChild(log);
      return oldFetch(...args);
    };

    const oldXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function () {
      const xhr = new oldXHR();
      xhr.addEventListener('load', function () {
        const log = document.createElement('div');
        log.innerText = "XHR: " + xhr.responseURL;
        panels.network.appendChild(log);
      });
      return xhr;
    };

    console.log("Ralzz DevTools aktif 🚀");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
