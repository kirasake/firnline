/* data/site.js — название и подпись платформы. Название — одна константа здесь.
   Подключается обычным <script>, кладёт данные в window.GP_DATA.site.
   В Node (тесты) экспортирует их через module.exports. Формат — README.md. */
(function (root) {
  var data = {
    name: "Firnline",
    tagline: "Профили, статистика и рейтинги игроков по четырём играм — выше линии снега",
    demo: true
  };
  if (typeof module === "object" && module.exports) module.exports = data;
  else { root.GP_DATA = root.GP_DATA || {}; root.GP_DATA.site = data; }
})(typeof self !== "undefined" ? self : this);
