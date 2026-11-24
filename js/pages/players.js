/* players.js — каталог игроков: поиск по нику на лету + фильтр по игре. */
(function (root) {
  "use strict";
  var GP = root.GP, UI = root.GPUI, D = root.GP_DATA || {};
  if (!GP || !UI) return;
  var el = UI.el;
  var games = D.games || [], players = D.players || [];
  var state = { q: "", game: null };

  UI.mount({ page: "players" });

  var toolbar = document.querySelector("[data-toolbar]");
  var results = document.querySelector("[data-results]");
  var count = document.querySelector("[data-count]");
  if (!toolbar || !results || !count) return;

  var input = el("input", { class: "field", id: "player-search", type: "search", name: "q", autocomplete: "off",
    placeholder: "Ник игрока", spellcheck: "false" });
  input.addEventListener("input", function () { state.q = input.value; render(); });

  var sw = UI.gameSwitch(games, null, function (id) { state.game = id; render(); }, { withAll: true, label: "Фильтр по игре" });

  toolbar.appendChild(el("div", { class: "toolbar__row" },
    el("div", { class: "toolbar__field" },
      el("label", { class: "label", for: "player-search" }, "[ ПОИСК ПО НИКУ ]"),
      input),
    el("div", { class: "select-wrap" }, el("span", { class: "label" }, "[ ИГРА ]"), sw)));

  function reset() {
    state.q = ""; state.game = null; input.value = "";
    sw.querySelectorAll("button").forEach(function (b, i) { b.setAttribute("aria-pressed", String(i === 0)); });
    render();
    input.focus();
  }

  function card(p, i) {
    var g = GP.gameById(games, p.mainGame);
    return el("li", { "data-reveal": "", style: { "--i": String(Math.min(i, 8)) } },
      el("a", { class: "player-card card-chamfer card-chamfer--light", href: "player.html?id=" + encodeURIComponent(p.id) },
        UI.avatar(p, 64),
        el("span", { class: "player-card__who" },
          el("span", { class: "player-card__nick" }, p.nick),
          el("span", { class: "label" }, p.country + " / MAIN: " + (g ? g.short : p.mainGame))),
        el("span", { class: "player-card__arrow", "aria-hidden": "true" }, "↗")));
  }

  function render() {
    var found = GP.searchPlayers(players, state.q, state.game);
    results.textContent = "";
    var pad = function (n) { return String(n).padStart(2, "0"); };
    count.textContent = "[ НАЙДЕНО: " + pad(found.length) + " / " + pad(players.length) + " ]";
    if (!found.length) {
      var q = state.q.trim();
      var title = q ? "Никого не нашли по запросу „" + q + "“" : "Игроков по этой игре пока нет";
      var box = el("div", { class: "results-empty" }, UI.emptyState(title));
      var btn = el("button", { type: "button", class: "btn-outline" }, "Сбросить поиск");
      btn.addEventListener("click", reset);
      box.querySelector(".empty-state").appendChild(btn);
      results.appendChild(box);
      return;
    }
    var list = el("ul", { class: "player-grid", "aria-label": "Игроки" }, found.map(card));
    results.appendChild(list);
    UI.reveal(list);
  }

  render();
})(typeof self !== "undefined" ? self : this);
