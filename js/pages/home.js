/* home.js — главная: hero-цифры, топ-5 по общему рейтингу, карточки игр с обложками, 3 последние новости, штрихкод. */
(function (root) {
  "use strict";
  var GP = root.GP, UI = root.GPUI, D = root.GP_DATA || {};
  if (!GP || !UI) return;
  var el = UI.el, svg = UI.svg;
  var site = D.site || {}, games = D.games || [], players = D.players || [], news = D.news || [];
  var pad = function (n) { return String(n).padStart(2, "0"); };

  function fillHero() {
    document.querySelectorAll("[data-site-name]").forEach(function (n) { if (site.name) n.textContent = site.name; });
    document.querySelectorAll("[data-site-tagline]").forEach(function (n) { if (site.tagline) n.textContent = site.tagline; });
    if (site.name) document.title = site.name + " — платформа для геймеров";
    var counts = { players: players.length, games: games.length, news: news.length };
    document.querySelectorAll("[data-stat]").forEach(function (n) { n.textContent = pad(counts[n.getAttribute("data-stat")] || 0); });
  }

  function fillTop() {
    var list = document.querySelector("[data-top-list]");
    if (!list) return;
    var top = players.slice()
      .map(function (p) { return { p: p, place: GP.overallPlace(players, p.id) }; })
      .sort(function (a, b) { return a.place - b.place; })
      .slice(0, 5);
    if (!top.length) { list.replaceWith(UI.emptyState("Игроков пока нет", "К списку игроков", "players.html")); return; }
    top.forEach(function (row, i) {
      var p = row.p;
      var g = GP.gameById(games, p.mainGame);
      var gamesCount = Object.keys(p.stats || {}).length;
      list.appendChild(el("li", { class: "top-row" + (i === 0 ? " top-row--first" : ""), "data-reveal": "", style: { "--i": String(i) } },
        el("a", { class: "top-row__link", href: "player.html?id=" + encodeURIComponent(p.id) },
          el("span", { class: "top-row__place", "aria-label": "Место " + row.place }, pad(row.place)),
          UI.avatar(p, i === 0 ? 72 : 56),
          el("span", { class: "top-row__who" },
            el("span", { class: "top-row__nick" }, p.nick),
            el("span", { class: "label" },
              p.country + " / MAIN: " + (g ? g.short : p.mainGame) + " / " + pad(gamesCount) + " GAMES")),
          el("span", { class: "top-row__score" },
            el("span", { class: "top-row__points" }, String(GP.totalRating ? GP.totalRating(p) : "")),
            el("span", { class: "label" }, "PTS"),
            el("span", { class: "top-row__arrow", "aria-hidden": "true" }, "↗")))));
    });
  }

  /** Абстрактный «рельеф» для карточки игры: сгенерированные линии, не логотип. */
  function gameArt(index) {
    var lines = [];
    var seed = index * 37 + 11;
    var rnd = function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    var peaks = [];
    for (var k = 0; k < 4; k++) peaks.push({ x: 30 + rnd() * 180, h: 40 + rnd() * 60, w: 30 + rnd() * 40 });
    for (var row = 0; row < 9; row++) {
      var y0 = 40 + row * 14;
      var d = "";
      for (var x = 0; x <= 240; x += 6) {
        var lift = 0;
        peaks.forEach(function (pk) {
          var t = (x - pk.x) / pk.w;
          lift += pk.h * Math.exp(-t * t) * (1 - row / 11);
        });
        var y = Math.max(4, y0 - lift * 0.55);
        d += (x === 0 ? "M" : "L") + x + " " + y.toFixed(1) + " ";
      }
      lines.push(svg("path", { d: d, fill: "none", stroke: "currentColor", "stroke-width": row === 0 ? "1.6" : "1", opacity: String(1 - row * 0.08) }));
    }
    return svg("svg", { class: "game-card__art", viewBox: "0 0 240 170", "aria-hidden": "true", focusable: "false" },
      lines,
      svg("text", { x: "240", y: "166", "text-anchor": "end", "font-family": "Space Mono, monospace", "font-size": "9", fill: "currentColor", "letter-spacing": "1.5" },
        "ALT " + pad(index + 1) + " / GRID " + (index * 7 + 21)));
  }

  /** Обложки игр (assets/img, сгенерированы, без логотипов и арта игр); alt — на русском. */
  var COVERS = {
    dota2: "Арена в снежной долине: ледяная река и три тропы — настроение MOBA",
    cs2: "Пустой бетонный коридор заброшенного цеха в инее — настроение тактического шутера",
    valorant: "Геометрическая площадь со светящимся энергобарьером — настроение тактического шутера с героями",
    apex: "Ледяная пустошь, на горизонте смыкается штормовое кольцо — настроение батл-рояля"
  };

  /** Обложка игры; если файла нет или он не загрузился — абстрактный SVG-рельеф. */
  function gameCover(g, index) {
    if (!Object.prototype.hasOwnProperty.call(COVERS, g.id)) return gameArt(index);
    var img = el("img", { class: "game-card__cover", "data-photo": "", src: "assets/img/" + g.id + ".webp",
      width: "800", height: "600", alt: COVERS[g.id], loading: "lazy", decoding: "async" });
    img.addEventListener("error", function () { img.replaceWith(gameArt(index)); }, { once: true });
    return img;
  }

  /** Статичные фото (hero, манифест): битое прячем — под ним остаётся SVG-фон. */
  function guardPhotos() {
    document.querySelectorAll("img[data-photo]").forEach(function (img) {
      var hide = function () { img.classList.add("is-broken"); };
      if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) hide();
      else img.addEventListener("error", hide, { once: true });
    });
  }

  function fillGames() {
    var list = document.querySelector("[data-games-list]");
    if (!list || !games.length) return;
    list.textContent = "";
    games.forEach(function (g, i) {
      var ranked = GP.rankPlayers(players, g.id, "rating", "desc");
      var leader = ranked[0];
      list.appendChild(el("li", { "data-reveal": "", style: { "--i": String(i) } },
        el("a", { class: "game-card card-chamfer card-chamfer--light", href: "rankings.html?game=" + encodeURIComponent(g.id),
          "aria-label": "Рейтинг по игре " + g.name },
          el("div", { class: "game-card__top" },
            el("span", { class: "label" }, "[ " + pad(i + 1) + " / GAME ]"),
            el("span", { class: "label" }, pad(i + 1) + " — " + pad(games.length))),
          gameCover(g, i),
          el("div", { class: "game-card__bottom" },
            el("div", null,
              el("h3", { class: "game-card__name" }, g.short),
              el("div", { class: "game-card__specs" },
                el("span", { class: "label" }, "PLAYERS: " + pad(ranked.length)),
                el("span", { class: "label" }, "METRIC: " + g.ratioLabel),
                el("span", { class: "label" }, "LEADER: " + (leader ? leader.player.nick : "—")))),
            el("span", { class: "game-card__cta" }, "Рейтинг игры",
              el("span", { class: "game-card__cta-arrow", "aria-hidden": "true" }, "↗"))))));
    });
  }

  function formatDate(iso) {
    var p = String(iso).split("-");
    return p.length === 3 ? p[2] + "." + p[1] + "." + p[0] : String(iso);
  }

  function fillNews() {
    var list = document.querySelector("[data-news-list]");
    if (!list) return;
    var latest = GP.filterNews(news, null).slice(0, 3);
    if (!latest.length) { list.replaceWith(UI.emptyState("Новостей пока нет", "Все новости", "news.html")); return; }
    latest.forEach(function (n, i) {
      var g = n.game ? GP.gameById(games, n.game) : null;
      list.appendChild(el("li", { "data-reveal": "", style: { "--i": String(i) } },
        el("article", { class: "news-card card-chamfer" },
          el("div", { class: "news-card__meta" },
            el("time", { class: "label label--strong", datetime: n.date }, formatDate(n.date)),
            el("span", { class: "label" }, "[ " + (g ? g.short : "ALL GAMES") + " ]")),
          el("div", null,
            el("div", { class: "news-card__head" },
              el("span", { class: "news-card__no", "aria-hidden": "true" }, pad(i + 1))),
            el("h3", { class: "news-card__title", style: { "margin-top": "20px" } }, n.title),
            el("p", { class: "news-card__excerpt" }, n.excerpt)))));
    });
  }

  function fillBarcode() {
    var bc = document.querySelector("[data-barcode]");
    if (!bc) return;
    var seed = 24;
    var x = 0;
    while (x < 220) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      var w = 1 + (seed % 4);
      if ((seed >> 3) % 3) bc.appendChild(svg("rect", { x: x, y: 0, width: w, height: 48 }));
      x += w + 1 + ((seed >> 5) % 3);
    }
  }

  // Наполняем до mount, чтобы reveal увидел новые элементы.
  guardPhotos();
  fillHero();
  fillTop();
  fillGames();
  fillNews();
  fillBarcode();
  UI.mount({ page: "home" });
})(typeof self !== "undefined" ? self : this);
