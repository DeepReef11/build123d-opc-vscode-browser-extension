(function () {
  var statusEl = document.getElementById("status");

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var tab = tabs[0];
    if (!tab || !tab.url) {
      statusEl.textContent = "";
      return;
    }
    var isViewer =
      tab.url.startsWith("http://localhost:3939") ||
      tab.url.startsWith("http://127.0.0.1:3939");

    statusEl.innerHTML = isViewer
      ? '<span class="active">&#9679; Active on this page</span>'
      : '<span class="inactive">&#9675; Not on OCP CAD Viewer page</span>';
  });
})();
