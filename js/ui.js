/* ui.js — общий каркас всех страниц: шапка, бургер, demo-метка, футер, reveal, хелперы DOM.
   Глобально: window.GPUI. Данные выводятся только через textContent. */
(function (root) {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  var data = root.GP_DATA || {};
  var site = data.site || { name: "[НАЗВАНИЕ]", demo: true };

  function append(node, children) {
    if (!Array.isArray(children)) children = [children];
    children.forEach(function (c) {
      if (c == null || c === false) return;
      if (Array.isArray(c)) { append(node, c); return; }
      node.appendChild(typeof c === "object" ? c : document.createTextNode(String(c)));
    });
    return node;
  }

  function setAttrs(node, attrs) {
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === "class") node.setAttribute("class", v);
      else if (k === "text") node.textContent = String(v);
      else if (k === "style" && typeof v === "object") Object.keys(v).forEach(function (p) { node.style.setProperty(p, v[p]); });
      else if (k === "dataset") Object.keys(v).forEach(function (d) { node.dataset[d] = v[d]; });
      else if (k.slice(0, 2) === "on" && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
      else node.setAttribute(k, v === true ? "" : String(v));
    });
    return node;
  }

  /** el(tag, attrs, ...children): строки становятся текстовыми узлами, не HTML. */
  function el(tag, attrs) {
    var node = setAttrs(document.createElement(tag), attrs);
    return append(node, Array.prototype.slice.call(arguments, 2));
  }

  /** svg(tag, attrs, ...children) — то же для SVG-элементов. */
  function svg(tag, attrs) {
    var node = setAttrs(document.createElementNS(SVG_NS, tag), attrs);
    return append(node, Array.prototype.slice.call(arguments, 2));
  }

  /** Подпись в [ скобках ]: скобки декоративные, читалкам не мешают. */
  function bracket(text, cls) {
    return el("span", { class: "label " + (cls || "") },
      el("span", { "aria-hidden": "true" }, "[ "), text, el("span", { "aria-hidden": "true" }, " ]"));
  }

  function tm() { return el("span", { class: "tm", "aria-hidden": "true" }, "™"); }

  function counter(current, total) {
    var pad = function (n) { return String(n).padStart(2, "0"); };
    return el("span", { class: "counter", "aria-label": pad(current) + " из " + pad(total) },
      el("span", { "aria-hidden": "true" }, pad(current)),
      el("span", { class: "counter__line", "aria-hidden": "true" }),
      el("span", { class: "counter__total", "aria-hidden": "true" }, pad(total)));
  }

  function initials(nick) {
    var clean = String(nick || "?").replace(/[^A-Za-zА-Яа-яЁё0-9]/g, " ").trim();
    var caps = clean.match(/[A-ZА-ЯЁ0-9]/g) || [];
    var s = caps.length >= 2 ? caps[0] + caps[1] : clean.slice(0, 2);
    return s.toUpperCase() || "?";
  }

  function hash(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h;
  }

  /** Аватар: монограмма в октагональном контуре + штриховка, зависящая от id. */
  function avatar(player, size) {
    size = size || 56;
    var id = String((player && player.id) || "x");
    var h = hash(id);
    var o = 22; // срез угла в единицах viewBox 100
    var oct = [o, 0, 100 - o, 0, 100, o, 100, 100 - o, 100 - o, 100, o, 100, 0, 100 - o, 0, o].join(" ");
    var hatch = [];
    var step = 7 + (h % 4);
    for (var x = -100; x < 200; x += step) {
      hatch.push(svg("line", { x1: x, y1: 100, x2: x + 100, y2: 0 }));
    }
    var clipId = "av-" + id + "-" + size;
    return svg("svg", {
      class: "avatar", width: size, height: size, viewBox: "0 0 100 100",
      role: "img", "aria-label": "Аватар " + ((player && player.nick) || "")
    },
      svg("defs", null, svg("clipPath", { id: clipId }, svg("polygon", { points: oct }))),
      svg("polygon", { points: oct, class: "avatar__bg" }),
      svg("g", { "clip-path": "url(#" + clipId + ")", class: "avatar__hatch", "stroke-width": "1",
        transform: "rotate(" + ((h % 3) * 30) + " 50 50)" }, hatch),
      svg("polygon", { points: oct, fill: "none", stroke: "currentColor", "stroke-width": "2.5" }),
      svg("text", { x: "50", y: "51", "text-anchor": "middle", "dominant-baseline": "central",
        "font-size": "38", fill: "currentColor" }, initials(player && player.nick)));
  }

  function emptyState(title, actionLabel, href) {
    return el("div", { class: "empty-state", role: "status" },
      bracket("NO RESULTS / 00", ""),
      el("p", { class: "empty-state__title" }, title),
      actionLabel ? el("a", { class: "btn-oct", href: href || "index.html" },
        el("span", null, actionLabel), el("span", { class: "btn-oct__arrow", "aria-hidden": "true" }, "↗")) : null);
  }

  /** Кнопки-фильтры по играм; onChange(id|null). */
  function gameSwitch(games, activeId, onChange, opts) {
    opts = opts || {};
    var wrap = el("div", { class: "game-switch", role: "group", "aria-label": opts.label || "Выбор игры" });
    var items = (opts.withAll ? [{ id: null, short: "Все" }] : []).concat(games || []);
    var buttons = items.map(function (g) {
      var b = el("button", { type: "button", class: "btn-outline", "aria-pressed": String(g.id === (activeId || null)) }, g.short || g.name);
      b.addEventListener("click", function () {
        buttons.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        if (typeof onChange === "function") onChange(g.id);
      });
      return b;
    });
    append(wrap, buttons);
    return wrap;
  }

  var PAGES = [
    { page: "home", href: "index.html", label: "Главная" },
    { page: "players", href: "players.html", label: "Игроки" },
    { page: "player", href: "player.html", label: "Лидер" },
    { page: "rankings", href: "rankings.html", label: "Рейтинги" },
    { page: "news", href: "news.html", label: "Новости" }
  ];

  function leaderHref() {
    var GP = root.GP;
    var players = data.players || [];
    if (!GP || !players.length) return "player.html";
    var best = players.filter(function (p) { return GP.overallPlace(players, p.id) === 1; })[0];
    return best ? "player.html?id=" + encodeURIComponent(best.id) : "player.html";
  }

  function logoMark() {
    return svg("svg", { class: "logo__mark", viewBox: "0 0 30 30", "aria-hidden": "true", focusable: "false" },
      svg("polygon", { points: "8,1 22,1 29,8 29,22 22,29 8,29 1,22 1,8", fill: "none", stroke: "currentColor", "stroke-width": "1.5" }),
      svg("path", { d: "M6 21 L12 11 L15 15 L18 9 L24 21", fill: "none", stroke: "currentColor", "stroke-width": "1.5", "stroke-linejoin": "bevel" }));
  }

  function buildHeader(header, page) {
    var navId = "site-nav";
    var burger = el("button", { type: "button", class: "burger", "aria-expanded": "false", "aria-controls": navId,
      "aria-label": "Открыть меню" }, el("span", { class: "burger__lines", "aria-hidden": "true" }));
    var links = PAGES.map(function (p) {
      var active = p.page === page;
      var href = p.page === "player" ? leaderHref() : p.href;
      return el("li", null, el("a", {
        class: "nav__link", href: href, "aria-current": active ? "page" : null,
        title: p.page === "player" ? "Профиль лидера общего рейтинга" : null
      }, el("span", { class: "br", "aria-hidden": "true" }, "[ "),
         el("span", { class: "nav__text" }, p.label),
         el("span", { class: "br", "aria-hidden": "true" }, " ]")));
    });
    var nav = el("nav", { class: "nav", id: navId, "aria-label": "Основное меню" }, el("ul", { class: "nav__list" }, links));

    header.className = "site-header";
    header.textContent = "";
    append(header, el("div", { class: "container site-header__bar" },
      el("a", { class: "logo", href: "index.html", "aria-label": site.name + " — на главную" },
        logoMark(), el("span", { class: "logo__name" }, site.name, tm())),
      nav,
      el("div", { class: "site-header__tools" },
        site.demo !== false ? el("span", { class: "demo-badge", title: "Игроки и цифры условные" },
          el("span", { class: "demo-badge__dot", "aria-hidden": "true" }), "[ DEMO DATA ]") : null,
        burger)));

    function setOpen(open) {
      header.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    }
    burger.addEventListener("click", function () { setOpen(!header.classList.contains("is-open")); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("is-open")) { setOpen(false); burger.focus(); }
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    var mq = root.matchMedia ? root.matchMedia("(min-width: 768px)") : null;
    if (mq && mq.addEventListener) mq.addEventListener("change", function () { setOpen(false); });
  }

  function buildFooter(footer) {
    footer.className = "site-footer";
    footer.textContent = "";
    var year = new Date().getFullYear();
    append(footer, el("div", { class: "container" },
      el("div", { class: "site-footer__grid" },
        el("div", { class: "label-stack" },
          el("a", { class: "logo", href: "index.html" }, logoMark(), el("span", { class: "logo__name" }, site.name, tm())),
          el("p", { class: "site-footer__note", style: { "margin-top": "16px" } },
            el("strong", null, "Игроки и цифры условные. "),
            "Это демо-данные: ники вымышлены, статистика сгенерирована для примера. Настоящие данные подключаются заменой файлов в папке data/.")),
        el("div", { class: "site-footer__nav" },
          bracket("INDEX", ""),
          PAGES.filter(function (p) { return p.page !== "player"; }).map(function (p) {
            return el("a", { class: "nav__link", href: p.href, style: { padding: "0" } }, p.label);
          })),
        el("div", { class: "label-stack" },
          bracket("STATUS: DEMO DATA", "label--strong"),
          el("span", { class: "label" }, "BUILD: STATIC / NO SERVER"),
          el("span", { class: "label" }, "GAMES: DOTA 2 / CS2 / VALORANT / APEX"),
          el("span", { class: "label" }, "Логотипы и арт игр не используются"))),
      el("div", { class: "site-footer__bottom" },
        el("span", { class: "label" }, "© " + year + " " + site.name),
        el("span", { class: "label" }, "FORGED IN COLD™ / v0.1"))));
  }

  var reduceMotion = !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /** Подключить появление к новым элементам с [data-reveal] / .reveal-lines. */
  var observer = null;
  function reveal(scope) {
    var nodes = (scope || document).querySelectorAll("[data-reveal], .reveal-lines");
    if (reduceMotion || !("IntersectionObserver" in root)) {
      nodes.forEach(function (n) { n.classList.add("is-in"); });
      return;
    }
    if (!observer) {
      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("is-in"); observer.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    }
    nodes.forEach(function (n) { if (!n.classList.contains("is-in")) observer.observe(n); });
  }

  /** Лёгкий параллакс слоёв [data-parallax="0.2"]; выключен при reduced-motion. */
  function parallax() {
    var layers = document.querySelectorAll("[data-parallax]");
    if (reduceMotion || !layers.length) return;
    var ticking = false;
    function update() {
      ticking = false;
      var y = root.scrollY || 0;
      layers.forEach(function (l) {
        var k = parseFloat(l.getAttribute("data-parallax")) || 0;
        l.style.transform = "translate3d(0," + (y * k).toFixed(1) + "px,0)";
      });
    }
    root.addEventListener("scroll", function () { if (!ticking) { ticking = true; root.requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  function mount(opts) {
    var page = (opts && opts.page) || "home";
    var header = document.querySelector("[data-gp-header]");
    var footer = document.querySelector("[data-gp-footer]");
    if (header) buildHeader(header, page);
    if (footer) buildFooter(footer);
    reveal(document);
    parallax();
  }

  // Класс .js до первой отрисовки: стили reveal и бургера работают только при JS.
  document.documentElement.classList.add("js");

  root.GPUI = {
    mount: mount, el: el, svg: svg, avatar: avatar, emptyState: emptyState, gameSwitch: gameSwitch,
    bracket: bracket, tm: tm, counter: counter, reveal: reveal, initials: initials
  };
})(typeof self !== "undefined" ? self : this);
