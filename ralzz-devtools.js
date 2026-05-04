(function () {
  if (window.__RALZZ_DEVTOOLS__) return;
  window.__RALZZ_DEVTOOLS__ = true;

  // ===== UI ROOT =====
  const root = document.createElement('div');
  root.style = `
    position:fixed; bottom:10px; right:10px;
    width:320px; height:240px;
    background:#0d1117; color:#c9d1d9;
    font-family:monospace; font-size:11px;
    z-index:999999; border-radius:10px;
    box-shadow:0 0 10px #000; display:none;
    overflow:hidden;
  `;
  document.body.appendChild(root);

  // ===== HEADER =====
  const header = document.createElement('div');
  header.innerText = "Ralzz Dev";
  header.style = "background:#161b22;padding:5px;cursor:move;";
  root.appendChild(header);

  // ===== TABS =====
  const tabs = document.createElement('div');
  tabs.style = "display:flex;background:#21262d;";
  root.appendChild(tabs);

  const content = document.createElement('div');
  content.style = "padding:5px;height:180px;overflow:auto;";
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
    btn.style = "flex:1;padding:4px;text-align:center;cursor:pointer;";
    btn.onclick = () => switchTab(name);
    tabs.appendChild(btn);
  });

  // default tab
  switchTab('console');

  // ===== FLOAT BUTTON =====
  const toggle = document.createElement('div');
  toggle.innerText = "DEV";
  toggle.style = `
    position:fixed; bottom:10px; left:10px;
    background:#238636; color:#fff;
    padding:6px 10px; border-radius:20px;
    font-size:12px; z-index:999999;
  `;
  toggle.onclick = () => {
    root.style.display = root.style.display === 'none' ? 'block' : 'none';
  };
  document.body.appendChild(toggle);

  // ===== DRAG =====
  let isDrag = false, offsetX, offsetY;
  header.onmousedown = (e) => {
    isDrag = true;
    offsetX = e.clientX - root.offsetLeft;
    offsetY = e.clientY - root.offsetTop;
  };
  document.onmousemove = (e) => {
    if (isDrag) {
      root.style.left = (e.clientX - offsetX) + "px";
      root.style.top = (e.clientY - offsetY) + "px";
    }
  };
  document.onmouseup = () => isDrag = false;

  // ===== CONSOLE HOOK =====
  const oldLog = console.log;
  console.log = function (...args) {
    oldLog.apply(console, args);
    const line = document.createElement('div');
    line.innerText = args.join(' ');
    panels.console.appendChild(line);
  };

  // ===== ELEMENTS VIEW =====
  panels.elements.innerText = document.documentElement.outerHTML;

  // ===== NETWORK HOOK =====
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
})();
