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
    root.style.width = "380px";
    root.style.height = "460px";
    root.style.background = "#1e1e1e";
    root.style.color = "#d4d4d4";
    root.style.fontFamily = "Consolas, monospace";
    root.style.fontSize = "12px";
    root.style.zIndex = "99999999";
    root.style.borderRadius = "8px";
    root.style.boxShadow = "0 4px 20px rgba(0,0,0,0.5)";
    root.style.display = "none";
    root.style.overflow = "hidden";
    root.style.pointerEvents = "auto";
    root.style.border = "1px solid #3c3c3c";

    document.body.appendChild(root);

    // ===== HEADER =====
    const header = document.createElement('div');
    header.innerHTML = "🔧 Ralzz DevTools <span style='font-size:10px;color:#888;'>v2.0</span>";
    header.style.padding = "8px 12px";
    header.style.background = "#2d2d2d";
    header.style.cursor = "move";
    header.style.borderBottom = "1px solid #3c3c3c";
    header.style.userSelect = "none";
    root.appendChild(header);

    // Close button
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = "✕";
    closeBtn.style.float = "right";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.color = "#888";
    closeBtn.style.fontSize = "16px";
    closeBtn.style.marginLeft = "8px";
    closeBtn.onclick = () => { root.style.display = "none"; };
    header.appendChild(closeBtn);

    // ===== TABS =====
    const tabs = document.createElement('div');
    tabs.style.display = "flex";
    tabs.style.background = "#252526";
    tabs.style.borderBottom = "1px solid #3c3c3c";
    root.appendChild(tabs);

    const content = document.createElement('div');
    content.style.padding = "8px";
    content.style.height = "calc(100% - 80px)";
    content.style.overflow = "auto";
    content.style.background = "#1e1e1e";
    root.appendChild(content);

    const panels = {
      console: createConsolePanel(),
      elements: createElementsPanel(),
      network: createNetworkPanel(),
      storage: createStoragePanel(),
      'local storage': createLocalStoragePanel()
    };

    function switchTab(name) {
      content.innerHTML = '';
      content.appendChild(panels[name]);
      // Update active tab style
      Array.from(tabs.children).forEach(btn => {
        btn.style.background = btn.innerText.toLowerCase() === name ? "#0e639c" : "transparent";
      });
    }

    Object.keys(panels).forEach(name => {
      const btn = document.createElement('div');
      btn.innerText = name;
      btn.style.flex = "1";
      btn.style.padding = "6px";
      btn.style.textAlign = "center";
      btn.style.cursor = "pointer";
      btn.style.color = "#ccc";
      btn.style.fontSize = "11px";
      btn.style.textTransform = "capitalize";

      btn.addEventListener('click', () => switchTab(name.toLowerCase()));
      tabs.appendChild(btn);
    });

    switchTab('console');

    // ===== FLOAT BUTTON =====
    const toggle = document.createElement('div');
    toggle.innerHTML = "🐞 DEV";
    toggle.style.all = "initial";
    toggle.style.position = "fixed";
    toggle.style.bottom = "20px";
    toggle.style.left = "20px";
    toggle.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    toggle.style.color = "#fff";
    toggle.style.padding = "10px 16px";
    toggle.style.borderRadius = "25px";
    toggle.style.fontSize = "13px";
    toggle.style.fontFamily = "sans-serif";
    toggle.style.fontWeight = "bold";
    toggle.style.zIndex = "999999999";
    toggle.style.cursor = "pointer";
    toggle.style.pointerEvents = "auto";
    toggle.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
    toggle.style.border = "1px solid rgba(255,255,255,0.2)";

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = root.style.display === 'none' || root.style.display === '';
      root.style.display = isHidden ? 'block' : 'none';
      if (isHidden) refreshPanels();
    });

    document.body.appendChild(toggle);

    // ===== DRAG FUNCTION =====
    let isDrag = false, offsetX = 0, offsetY = 0;

    header.addEventListener('mousedown', (e) => {
      if (e.target === closeBtn) return;
      isDrag = true;
      offsetX = e.clientX - root.offsetLeft;
      offsetY = e.clientY - root.offsetTop;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDrag) return;
      root.style.left = (e.clientX - offsetX) + "px";
      root.style.top = (e.clientY - offsetY) + "px";
    });

    document.addEventListener('mouseup', () => { isDrag = false; });

    // Touch support
    header.addEventListener('touchstart', (e) => {
      if (e.target === closeBtn) return;
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

    document.addEventListener('touchend', () => { isDrag = false; });

    // ===== CONSOLE PANEL =====
    function createConsolePanel() {
      const container = document.createElement('div');
      container.style.height = "100%";
      container.style.display = "flex";
      container.style.flexDirection = "column";

      const output = document.createElement('div');
      output.style.flex = "1";
      output.style.overflow = "auto";
      output.style.background = "#1e1e1e";
      output.style.fontFamily = "Consolas, monospace";
      output.style.fontSize = "11px";
      output.style.marginBottom = "8px";
      output.style.border = "1px solid #3c3c3c";
      output.style.borderRadius = "4px";
      output.style.padding = "4px";

      const inputContainer = document.createElement('div');
      inputContainer.style.display = "flex";
      inputContainer.style.gap = "8px";
      inputContainer.style.marginTop = "4px";

      const input = document.createElement('input');
      input.type = "text";
      input.placeholder = "> Jalankan JavaScript...";
      input.style.flex = "1";
      input.style.background = "#2d2d2d";
      input.style.color = "#d4d4d4";
      input.style.border = "1px solid #3c3c3c";
      input.style.borderRadius = "4px";
      input.style.padding = "6px";
      input.style.fontFamily = "Consolas, monospace";
      input.style.fontSize = "11px";

      const runBtn = document.createElement('button');
      runBtn.innerText = "▶ Run";
      runBtn.style.background = "#0e639c";
      runBtn.style.color = "#fff";
      runBtn.style.border = "none";
      runBtn.style.borderRadius = "4px";
      runBtn.style.padding = "6px 12px";
      runBtn.style.cursor = "pointer";
      runBtn.style.fontSize = "11px";

      function addLog(msg, type = 'log') {
        const line = document.createElement('div');
        line.style.padding = "2px 4px";
        line.style.borderBottom = "1px solid #2d2d2d";
        line.style.fontSize = "11px";
        
        let prefix = ">";
        let color = "#d4d4d4";
        if (type === 'error') { prefix = "✗"; color = "#f48771"; }
        else if (type === 'warn') { prefix = "⚠"; color = "#cca700"; }
        else if (type === 'success') { prefix = "✓"; color = "#6a9955"; }
        
        line.innerHTML = `<span style="color:${color}">${prefix} ${escapeHtml(String(msg))}</span>`;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
      }

      function evalCode(code) {
        try {
          const result = eval(code);
          if (result !== undefined) {
            addLog(`← ${JSON.stringify(result, null, 2)}`, 'success');
          }
        } catch (e) {
          addLog(e.message, 'error');
        }
      }

      runBtn.onclick = () => {
        const code = input.value.trim();
        if (code) {
          addLog(`▶ ${code}`, 'log');
          evalCode(code);
          input.value = '';
        }
      };

      input.onkeypress = (e) => {
        if (e.key === 'Enter') runBtn.onclick();
      };

      inputContainer.appendChild(input);
      inputContainer.appendChild(runBtn);

      container.appendChild(output);
      container.appendChild(inputContainer);

      // Override console methods
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;

      console.log = function(...args) {
        originalLog.apply(console, args);
        addLog(args.join(' '), 'log');
      };
      console.error = function(...args) {
        originalError.apply(console, args);
        addLog(args.join(' '), 'error');
      };
      console.warn = function(...args) {
        originalWarn.apply(console, args);
        addLog(args.join(' '), 'warn');
      };

      addLog("Console siap! Kamu bisa jalankan JavaScript seperti:", 'success');
      addLog("  • document.title = 'Halo'", 'log');
      addLog("  • alert('test')", 'log');
      addLog("  • 1 + 2 + 3", 'log');

      return container;
    }

    // ===== ELEMENTS PANEL =====
    function createElementsPanel() {
      const container = document.createElement('div');
      container.style.height = "100%";
      container.style.overflow = "auto";

      function refreshElements() {
        container.innerHTML = '';
        const pre = document.createElement('pre');
        pre.style.margin = "0";
        pre.style.fontSize = "10px";
        pre.style.whiteSpace = "pre-wrap";
        pre.style.wordBreak = "break-all";
        
        const html = document.documentElement.outerHTML;
        pre.innerHTML = syntaxHighlight(html);
        container.appendChild(pre);
      }

      refreshElements();
      
      // Refresh button
      const refreshBtn = document.createElement('button');
      refreshBtn.innerText = "🔄 Refresh";
      refreshBtn.style.position = "absolute";
      refreshBtn.style.top = "5px";
      refreshBtn.style.right = "35px";
      refreshBtn.style.background = "#0e639c";
      refreshBtn.style.color = "#fff";
      refreshBtn.style.border = "none";
      refreshBtn.style.borderRadius = "3px";
      refreshBtn.style.padding = "2px 6px";
      refreshBtn.style.cursor = "pointer";
      refreshBtn.style.fontSize = "10px";
      refreshBtn.onclick = () => refreshElements();
      container.appendChild(refreshBtn);
      
      return container;
    }

    // ===== NETWORK PANEL =====
    function createNetworkPanel() {
      const container = document.createElement('div');
      container.style.height = "100%";
      container.style.overflow = "auto";
      container.style.fontSize = "10px";

      const logContainer = document.createElement('div');
      container.appendChild(logContainer);

      // Intercept fetch
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        const startTime = Date.now();
        let url = args[0];
        if (typeof url !== 'string') url = url.url;
        
        const logItem = document.createElement('div');
        logItem.style.padding = "4px";
        logItem.style.borderBottom = "1px solid #2d2d2d";
        logItem.style.fontFamily = "monospace";
        
        try {
          const response = await originalFetch(...args);
          const duration = Date.now() - startTime;
          logItem.innerHTML = `<span style="color:#6a9955">✓</span> <span style="color:#569cd6">FETCH</span> ${url} <span style="color:#888">(${duration}ms, ${response.status})</span>`;
          logContainer.appendChild(logItem);
          logContainer.scrollTop = logContainer.scrollHeight;
          return response;
        } catch (err) {
          logItem.innerHTML = `<span style="color:#f48771">✗</span> <span style="color:#569cd6">FETCH</span> ${url} <span style="color:#888">(error: ${err.message})</span>`;
          logContainer.appendChild(logItem);
          throw err;
        }
      };

      // Intercept XHR
      const originalXHR = window.XMLHttpRequest;
      window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const startTime = Date.now();
        let url = '';
        
        const originalOpen = xhr.open;
        xhr.open = function(method, _url) {
          url = _url;
          return originalOpen.apply(this, arguments);
        };
        
        xhr.addEventListener('load', function() {
          const duration = Date.now() - startTime;
          const logItem = document.createElement('div');
          logItem.style.padding = "4px";
          logItem.style.borderBottom = "1px solid #2d2d2d";
          logItem.innerHTML = `<span style="color:#6a9955">✓</span> <span style="color:#569cd6">XHR</span> ${url} <span style="color:#888">(${duration}ms, ${xhr.status})</span>`;
          logContainer.appendChild(logItem);
          logContainer.scrollTop = logContainer.scrollHeight;
        });
        
        xhr.addEventListener('error', function() {
          const logItem = document.createElement('div');
          logItem.style.padding = "4px";
          logItem.style.borderBottom = "1px solid #2d2d2d";
          logItem.innerHTML = `<span style="color:#f48771">✗</span> <span style="color:#569cd6">XHR</span> ${url} <span style="color:#888">(error)</span>`;
          logContainer.appendChild(logItem);
        });
        
        return xhr;
      };

      const clearBtn = document.createElement('button');
      clearBtn.innerText = "🗑 Clear";
      clearBtn.style.position = "absolute";
      clearBtn.style.top = "5px";
      clearBtn.style.right = "10px";
      clearBtn.style.background = "#0e639c";
      clearBtn.style.border = "none";
      clearBtn.style.borderRadius = "3px";
      clearBtn.style.padding = "2px 6px";
      clearBtn.style.cursor = "pointer";
      clearBtn.style.fontSize = "10px";
      clearBtn.onclick = () => { logContainer.innerHTML = ''; };
      container.appendChild(clearBtn);
      
      return container;
    }

    // ===== STORAGE PANEL =====
    function createStoragePanel() {
      const container = document.createElement('div');
      container.style.fontSize = "10px";
      
      function refresh() {
        container.innerHTML = '<strong>📦 Session Storage</strong><br>';
        if (sessionStorage.length === 0) {
          container.innerHTML += '<span style="color:#888">(kosong)</span><br><br>';
        } else {
          for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            const val = sessionStorage.getItem(key);
            container.innerHTML += `<span style="color:#569cd6">${escapeHtml(key)}</span>: <span style="color:#ce9178">${escapeHtml(val.substring(0, 100))}</span><br>`;
          }
          container.innerHTML += '<br>';
        }
        
        container.innerHTML += '<strong>🍪 Cookies</strong><br>';
        if (document.cookie) {
          document.cookie.split(';').forEach(cookie => {
            const [key, val] = cookie.split('=');
            container.innerHTML += `<span style="color:#569cd6">${escapeHtml(key.trim())}</span>: <span style="color:#ce9178">${escapeHtml((val || '').substring(0, 100))}</span><br>`;
          });
        } else {
          container.innerHTML += '<span style="color:#888">(kosong)</span><br>';
        }
      }
      
      const refreshBtn = document.createElement('button');
      refreshBtn.innerText = "🔄 Refresh";
      refreshBtn.style.marginBottom = "8px";
      refreshBtn.style.background = "#0e639c";
      refreshBtn.style.border = "none";
      refreshBtn.style.borderRadius = "3px";
      refreshBtn.style.padding = "4px 8px";
      refreshBtn.style.cursor = "pointer";
      refreshBtn.style.fontSize = "10px";
      refreshBtn.onclick = () => refresh();
      
      const wrapper = document.createElement('div');
      wrapper.appendChild(refreshBtn);
      wrapper.appendChild(container);
      refresh();
      
      return wrapper;
    }

    // ===== LOCAL STORAGE PANEL =====
    function createLocalStoragePanel() {
      const container = document.createElement('div');
      container.style.fontSize = "10px";
      
      function refresh() {
        container.innerHTML = '<strong>💾 Local Storage</strong><br>';
        if (localStorage.length === 0) {
          container.innerHTML += '<span style="color:#888">(kosong)</span><br>';
        } else {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const val = localStorage.getItem(key);
            container.innerHTML += `<span style="color:#569cd6">${escapeHtml(key)}</span>: <span style="color:#ce9178">${escapeHtml(val.substring(0, 100))}</span><br>`;
          }
        }
        
        // Add action buttons
        container.innerHTML += '<br><button id="ralzz-clear-ls" style="background:#c42e2e;border:none;padding:4px 8px;border-radius:3px;cursor:pointer;color:#fff;font-size:10px;">🗑 Clear All</button>';
        
        setTimeout(() => {
          const clearBtn = document.getElementById('ralzz-clear-ls');
          if (clearBtn) {
            clearBtn.onclick = () => {
              if (confirm('Hapus semua Local Storage?')) {
                localStorage.clear();
                refresh();
              }
            };
          }
        }, 10);
      }
      
      const refreshBtn = document.createElement('button');
      refreshBtn.innerText = "🔄 Refresh";
      refreshBtn.style.marginBottom = "8px";
      refreshBtn.style.background = "#0e639c";
      refreshBtn.style.border = "none";
      refreshBtn.style.borderRadius = "3px";
      refreshBtn.style.padding = "4px 8px";
      refreshBtn.style.cursor = "pointer";
      refreshBtn.style.fontSize = "10px";
      refreshBtn.onclick = () => refresh();
      
      const wrapper = document.createElement('div');
      wrapper.appendChild(refreshBtn);
      wrapper.appendChild(container);
      refresh();
      
      return wrapper;
    }

    function refreshPanels() {
      if (panels.elements) {
        const pre = panels.elements.querySelector('pre');
        if (pre) pre.innerHTML = syntaxHighlight(document.documentElement.outerHTML);
      }
      if (panels['local storage']) {
        const refreshBtn = panels['local storage'].querySelector('button');
        if (refreshBtn) refreshBtn.onclick();
      }
      if (panels.storage) {
        const refreshBtn = panels.storage.querySelector('button');
        if (refreshBtn) refreshBtn.onclick();
      }
    }

    // Helper functions
    function escapeHtml(str) {
      if (!str) return '';
      return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
      });
    }

    function syntaxHighlight(html) {
      return html.replace(/(&lt;\/?[a-zA-Z][^&gt;]*&gt;)/g, '<span style="color:#569cd6">$1</span>')
                 .replace(/(=["'])([^"']*)(["'])/g, '$1<span style="color:#ce9178">$2</span>$3');
    }

    console.log("✅ Ralzz DevTools v2.0 aktif! Klik tombol 🐞 DEV di pojok kiri bawah");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
