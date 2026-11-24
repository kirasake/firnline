/* rankings.js — рейтинг по игре: сортировка по столбцу, состояние в ?game=&sort=&dir=. */
(function (root) {
  "use strict";
  var GP = root.GP, UI = root.GPUI, D = root.GP_DATA || {};
  if (!GP || !UI) return;
  var el = UI.el;
  var games = D.games || [], players = D.players || [];

  UI.mount({ page: "rankings" });

  var toolbar = document.querySelector("[data-toolbar]");
  var results = document.querySelector("[data-results]");
  if (!toolbar || !results || !games.length) return;

  var KEYS = ["rating", "winrate", "ratio", "matches", "nick"];
  var LABELS = { nick: "Игрок", rating: "Очки", winrate: "Винрейт", ratio: "K/D", matches: "Матчи" };
  var query = GP.parseQuery(root.location.search);
  var state = {
    game: GP.gameById(games, query.game) ? query.game : games[0].id,
    sort: KEYS.indexOf(query.sort) >= 0 ? query.sort : "rating",
    dir: null
  };
  state.dir = query.dir === "asc" || query.dir === "desc" ? query.dir : defaultDir(state.sort);

  function defaultDir(key) { return key === "nick" ? "asc" : "desc"; }
  function dirText() { return state.dir === "asc" ? "по возрастанию" : "по убыванию"; }
  function labelOf(key) {
    if (key !== "ratio") return LABELS[key];
    var g = GP.gameById(games, state.game);
    return g ? g.ratioLabel : "K/D";
  }

  function sync() {
    var qs = "?game=" + encodeURIComponent(state.game) + "&sort=" + state.sort + "&dir=" + state.dir;
    try { root.history.replaceState(null, "", root.location.pathname + qs); } catch (e) { /* адрес не меняем */ }
  }

  function setSort(key) {
    if (state.sort === key) state.dir = state.dir === "asc" ? "desc" : "asc";
    else { state.sort = key; state.dir = defaultDir(key); }
    update(true);
  }

  var status = el("p", { class: "visually-hidden", role: "status" });
  var sw = UI.gameSwitch(games, state.game, function (id) { state.game = id; update(false); }, { label: "Игра рейтинга" });

  // На телефоне вторичные столбцы скрыты, поэтому сортировка дублируется выбором и кнопкой направления
  var select = el("select", { class: "field field--select", id: "sort-select" },
    KEYS.map(function (k) { return el("option", { value: k }, labelOf(k)); }));
  select.addEventListener("change", function () { state.sort = select.value; state.dir = defaultDir(state.sort); update(true); });
  var dirBtn = el("button", { type: "button", class: "btn-outline" });
  dirBtn.addEventListener("click", function () { state.dir = state.dir === "asc" ? "desc" : "asc"; update(true); });

  toolbar.appendChild(el("div", { class: "toolbar__row" },
    el("div", { class: "select-wrap" }, el("span", { class: "label" }, "[ ИГРА ]"), sw),
    el("div", { class: "sort-mobile" },
      el("div", { class: "select-wrap" }, el("label", { class: "label", for: "sort-select" }, "[ СОРТИРОВКА ]"), select),
      dirBtn)));
  toolbar.appendChild(status);

  // Шапка строится один раз; меняются только aria-sort и тело
  var heads = {};
  function th(key, cls) {
    var text = el("span", null, labelOf(key));
    var ind = el("span", { class: "sort-ind", "aria-hidden": "true" });
    var btn = el("button", { type: "button" }, text, ind);
    btn.addEventListener("click", function () { setSort(key); });
    var node = el("th", { scope: "col", class: cls || null }, btn);
    heads[key] = { th: node, ind: ind, text: text };
    return node;
  }
  var tbody = el("tbody");
  var table = el("table", { class: "gp-table rank-table" },
    el("caption", { class: "visually-hidden" }, "Рейтинг игроков по выбранной игре. Кнопки в заголовках столбцов сортируют таблицу."),
    el("thead", null, el("tr", null,
      el("th", { scope: "col" }, el("span", { class: "visually-hidden" }, "Место"), el("span", { "aria-hidden": "true" }, "№")),
      th("nick"),
      th("rating", "num"),
      th("winrate", "num col-secondary"),
      th("ratio", "num col-secondary"),
      th("matches", "num col-secondary"))),
    tbody);
  results.appendChild(el("div", { class: "table-wrap" }, table));

  function renderBody() {
    tbody.textContent = "";
    var rows = GP.rankPlayers(players, state.game, state.sort, state.dir);
    if (!rows.length) {
      tbody.appendChild(el("tr", null, el("td", { colspan: "6" }, "По этой игре пока нет игроков")));
      return;
    }
    rows.forEach(function (r) {
      var s = r.stat;
      tbody.appendChild(el("tr", null,
        el("td", { class: "rank-place" }, String(r.place).padStart(2, "0")),
        el("td", null, el("a", { class: "rank-player", href: "player.html?id=" + encodeURIComponent(r.player.id) },
          UI.avatar(r.player, 36), el("span", { class: "rank-player__nick" }, r.player.nick))),
        el("td", { class: "num" }, String(s.rating)),
        el("td", { class: "num col-secondary" }, GP.formatPct(GP.winrate(s))),
        el("td", { class: "num col-secondary" }, GP.formatRatio(GP.ratio(s, state.game))),
        el("td", { class: "num col-secondary" }, String(s.matches))));
    });
  }

  function update(announce) {
    KEYS.forEach(function (k) {
      var h = heads[k];
      if (!h) return;
      h.text.textContent = labelOf(k);
      var on = k === state.sort;
      if (on) h.th.setAttribute("aria-sort", state.dir === "asc" ? "ascending" : "descending");
      else h.th.removeAttribute("aria-sort");
      h.ind.textContent = on ? (state.dir === "asc" ? "↑" : "↓") : "↕";
    });
    select.querySelectorAll("option").forEach(function (o) { o.textContent = labelOf(o.value); });
    select.value = state.sort;
    dirBtn.textContent = state.dir === "asc" ? "↑ По возрастанию" : "↓ По убыванию";
    dirBtn.setAttribute("aria-label", "Направление сортировки: " + dirText());
    renderBody();
    sync();
    if (announce) status.textContent = "Сортировка: " + labelOf(state.sort) + ", " + dirText();
  }

  update(false);
})(typeof self !== "undefined" ? self : this);
