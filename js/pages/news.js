/* news.js — лента новостей: новые сверху, фильтр по игре. */
(function (root) {
  "use strict";
  var GP = root.GP, UI = root.GPUI, D = root.GP_DATA || {};
  if (!GP || !UI) return;
  var el = UI.el;
  var games = D.games || [], news = D.news || [];

  UI.mount({ page: "news" });

  var toolbar = document.querySelector("[data-toolbar]");
  var results = document.querySelector("[data-results]");
  if (!toolbar || !results) return;

  var query = GP.parseQuery(root.location.search);
  var active = GP.gameById(games, query.game) ? query.game : null;

  var sw = UI.gameSwitch(games, active, function (id) { active = id; sync(); render(); }, { withAll: true, label: "Фильтр новостей по игре" });
  toolbar.appendChild(el("div", { class: "select-wrap" }, el("span", { class: "label" }, "[ ИГРА ]"), sw));

  function sync() {
    try {
      root.history.replaceState(null, "", root.location.pathname + (active ? "?game=" + encodeURIComponent(active) : ""));
    } catch (e) { /* адрес не меняем, если браузер не даёт */ }
  }

  function fmtDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso));
    return m ? m[3] + "." + m[2] + "." + m[1] : String(iso);
  }

  function item(n, i) {
    var g = GP.gameById(games, n.game);
    return el("li", { "data-reveal": "", style: { "--i": String(Math.min(i, 6)) } },
      el("article", { class: "news-item card-chamfer card-chamfer--light" },
        el("div", { class: "news-item__meta" },
          el("time", { class: "label", datetime: n.date }, fmtDate(n.date)),
          el("span", { class: "label" }, "[ " + (g ? g.short : "ОБЩЕЕ") + " ]")),
        el("div", null,
          el("h2", { class: "news-item__title" }, n.title),
          el("p", { class: "news-item__excerpt" }, n.excerpt))));
  }

  function render() {
    var list = GP.filterNews(news, active);
    results.textContent = "";
    if (!list.length) {
      var box = el("div", { class: "results-empty" }, UI.emptyState("Новостей по этой игре пока нет"));
      var btn = el("button", { type: "button", class: "btn-outline" }, "Показать все новости");
      btn.addEventListener("click", function () {
        active = null; sync();
        sw.querySelectorAll("button").forEach(function (b, i) { b.setAttribute("aria-pressed", String(i === 0)); });
        render();
        sw.querySelector("button").focus();
      });
      box.querySelector(".empty-state").appendChild(btn);
      results.appendChild(box);
      return;
    }
    var ul = el("ul", { class: "news-feed", "aria-label": "Лента новостей" }, list.map(item));
    results.appendChild(ul);
    UI.reveal(ul);
  }

  render();
})(typeof self !== "undefined" ? self : this);
