/* data/games.js — список игр. Только названия текстом: без логотипов и фирменных цветов.
   Подключается обычным <script>, кладёт данные в window.GP_DATA.games.
   В Node (тесты) экспортирует их через module.exports. Формат — README.md. */
(function (root) {
  var data = [
    { id: "dota2", name: "Dota 2", short: "DOTA 2", ratioLabel: "KDA" },
    { id: "cs2", name: "Counter-Strike 2", short: "CS2", ratioLabel: "K/D" },
    { id: "valorant", name: "Valorant", short: "VALORANT", ratioLabel: "K/D" },
    { id: "apex", name: "Apex Legends", short: "APEX", ratioLabel: "K/D" }
  ];
  if (typeof module === "object" && module.exports) module.exports = data;
  else { root.GP_DATA = root.GP_DATA || {}; root.GP_DATA.games = data; }
})(typeof self !== "undefined" ? self : this);
