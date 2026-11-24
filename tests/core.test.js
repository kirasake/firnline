"use strict";
// Тесты чистой логики js/core.js. Ожидаемые значения посчитаны вручную.
const test = require("node:test");
const assert = require("node:assert/strict");
const GP = require("../js/core.js");

const s = (matches, wins, kills, deaths, assists, rating) =>
  ({ matches, wins, kills, deaths, assists, hours: 10, rating });

const players = [
  { id: "a", nick: "Zeta", stats: { cs2: s(10, 5, 100, 50, 10, 1500), dota2: s(4, 1, 10, 10, 20, 900) } },
  { id: "b", nick: "alpha", stats: { cs2: s(10, 8, 60, 60, 0, 1500) } },
  { id: "c", nick: "Mira", stats: { cs2: s(0, 0, 0, 0, 0, 1200), valorant: s(5, 5, 50, 0, 3, 2000) } },
  { id: "d", nick: "Bolt", stats: { dota2: s(20, 10, 40, 20, 60, 1800) } }
];

test("winrate: победы / матчи", () => {
  assert.equal(GP.winrate(s(10, 5, 0, 0, 0, 0)), 0.5);
  assert.equal(GP.winrate(s(4, 1, 0, 0, 0, 0)), 0.25);
});

test("winrate: 0 матчей -> null", () => {
  assert.equal(GP.winrate(s(0, 0, 0, 0, 0, 0)), null);
});

test("ratio: K/D для cs2/valorant/apex = kills / max(deaths,1)", () => {
  assert.equal(GP.ratio(s(10, 5, 100, 50, 10, 0), "cs2"), 2);
  assert.equal(GP.ratio(s(10, 5, 30, 20, 99, 0), "apex"), 1.5);
});

test("ratio: KDA для dota2 = (kills+assists) / max(deaths,1)", () => {
  assert.equal(GP.ratio(s(4, 1, 10, 10, 20, 0), "dota2"), 3);
});

test("ratio: 0 смертей делится на 1", () => {
  assert.equal(GP.ratio(s(5, 5, 50, 0, 3, 0), "valorant"), 50);
  assert.equal(GP.ratio(s(5, 5, 7, 0, 3, 0), "dota2"), 10);
});

test("ratio: 0 матчей -> null", () => {
  assert.equal(GP.ratio(s(0, 0, 0, 0, 0, 0), "cs2"), null);
});

test("formatPct и formatRatio", () => {
  assert.equal(GP.formatPct(0.573), "57.3%");
  assert.equal(GP.formatPct(1), "100.0%");
  assert.equal(GP.formatPct(null), "—");
  assert.equal(GP.formatRatio(1.4166), "1.42");
  assert.equal(GP.formatRatio(2), "2.00");
  assert.equal(GP.formatRatio(null), "—");
});

test("rankPlayers: только игроки игры, по rating desc, равенство — по nick asc", () => {
  const rows = GP.rankPlayers(players, "cs2");
  assert.deepEqual(rows.map((r) => r.player.id), ["b", "a", "c"]); // alpha < Zeta без регистра
  assert.deepEqual(rows.map((r) => r.place), [1, 2, 3]);
  assert.equal(rows[0].stat.rating, 1500);
});

test("rankPlayers: сортировка по winrate, place не зависит от сортировки", () => {
  const rows = GP.rankPlayers(players, "cs2", "winrate", "desc");
  assert.deepEqual(rows.map((r) => r.player.id), ["b", "a", "c"]);
  const asc = GP.rankPlayers(players, "cs2", "winrate", "asc");
  // null-винрейт (0 матчей) всегда внизу
  assert.deepEqual(asc.map((r) => r.player.id), ["a", "b", "c"]);
  assert.deepEqual(asc.map((r) => r.place), [2, 1, 3]);
});

test("rankPlayers: сортировка по nick и matches с равенством", () => {
  assert.deepEqual(GP.rankPlayers(players, "cs2", "nick", "asc").map((r) => r.player.id), ["b", "c", "a"]);
  assert.deepEqual(GP.rankPlayers(players, "cs2", "matches", "desc").map((r) => r.player.id), ["b", "a", "c"]);
  assert.deepEqual(GP.rankPlayers(players, "dota2", "ratio", "desc").map((r) => r.player.id), ["d", "a"]); // 5 vs 3
});

test("rankPlayers: игра без игроков -> пустой список", () => {
  assert.deepEqual(GP.rankPlayers(players, "apex"), []);
});

test("overallPlace: место по сумме rating по всем играм", () => {
  // суммы: a=2400, b=1500, c=3200, d=1800
  assert.equal(GP.overallPlace(players, "c"), 1);
  assert.equal(GP.overallPlace(players, "a"), 2);
  assert.equal(GP.overallPlace(players, "d"), 3);
  assert.equal(GP.overallPlace(players, "b"), 4);
  assert.equal(GP.overallPlace(players, "nope"), null);
});

test("findPlayer", () => {
  assert.equal(GP.findPlayer(players, "d").nick, "Bolt");
  assert.equal(GP.findPlayer(players, "zzz"), null);
  assert.equal(GP.findPlayer(players, ""), null);
});

test("searchPlayers: без регистра, с обрезкой пробелов, фильтр по игре", () => {
  assert.deepEqual(GP.searchPlayers(players, "  ALP ", null).map((p) => p.id), ["b"]);
  assert.deepEqual(GP.searchPlayers(players, "", null).map((p) => p.id), ["a", "b", "c", "d"]);
  assert.deepEqual(GP.searchPlayers(players, "", "dota2").map((p) => p.id), ["a", "d"]);
  assert.deepEqual(GP.searchPlayers(players, "i", "valorant").map((p) => p.id), ["c"]);
  assert.deepEqual(GP.searchPlayers(players, "xyz", null), []);
});

test("filterNews: date desc, null -> все", () => {
  const news = [
    { id: "n1", date: "2026-11-01", game: "cs2" },
    { id: "n2", date: "2026-11-20", game: null },
    { id: "n3", date: "2026-11-10", game: "cs2" },
    { id: "n4", date: "2026-11-15", game: "dota2" }
  ];
  assert.deepEqual(GP.filterNews(news, null).map((n) => n.id), ["n2", "n4", "n3", "n1"]);
  assert.deepEqual(GP.filterNews(news, "cs2").map((n) => n.id), ["n3", "n1"]);
  assert.deepEqual(GP.filterNews(news, "apex"), []);
  assert.equal(news[0].id, "n1", "исходный массив не мутирует");
});

test("parseQuery", () => {
  assert.deepEqual(GP.parseQuery("?game=cs2&sort=winrate&dir=desc"), { game: "cs2", sort: "winrate", dir: "desc" });
  assert.deepEqual(GP.parseQuery("?id=frost%20byte"), { id: "frost byte" });
  assert.deepEqual(GP.parseQuery(""), {});
});

test("gameById", () => {
  const games = [{ id: "cs2", name: "CS2" }];
  assert.equal(GP.gameById(games, "cs2").name, "CS2");
  assert.equal(GP.gameById(games, "x"), null);
});
