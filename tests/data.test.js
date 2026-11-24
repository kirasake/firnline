"use strict";
// Целостность демо-данных data/*.js (формат — interfaces.md).
const test = require("node:test");
const assert = require("node:assert/strict");
const site = require("../data/site.js");
const games = require("../data/games.js");
const players = require("../data/players.js");
const news = require("../data/news.js");

const GAME_IDS = ["dota2", "cs2", "valorant", "apex"];
const STAT_KEYS = ["matches", "wins", "kills", "deaths", "assists", "hours", "rating"];

test("site: заглушка названия и флаг демо", () => {
  assert.equal(site.name, "[НАЗВАНИЕ]");
  assert.equal(site.demo, true);
  assert.equal(typeof site.tagline, "string");
});

test("games: ровно четыре игры из списка", () => {
  assert.deepEqual(games.map((g) => g.id).sort(), GAME_IDS.slice().sort());
  games.forEach((g) => {
    assert.ok(g.name && g.short, g.id);
    assert.equal(g.ratioLabel, g.id === "dota2" ? "KDA" : "K/D");
  });
});

test("players: 24 игрока с уникальными id и никами", () => {
  assert.equal(players.length, 24);
  assert.equal(new Set(players.map((p) => p.id)).size, 24);
  assert.equal(new Set(players.map((p) => p.nick.toLowerCase())).size, 24);
});

test("players: 1–4 игры, mainGame есть в stats, статистика корректна", () => {
  players.forEach((p) => {
    const ids = Object.keys(p.stats);
    assert.ok(ids.length >= 1 && ids.length <= 4, p.id);
    ids.forEach((g) => {
      assert.ok(GAME_IDS.includes(g), p.id + ": " + g);
      const s = p.stats[g];
      STAT_KEYS.forEach((k) => assert.ok(Number.isInteger(s[k]) && s[k] >= 0, `${p.id}.${g}.${k}`));
      assert.ok(s.wins <= s.matches, `${p.id}.${g}: wins > matches`);
    });
    assert.ok(p.stats[p.mainGame], p.id + ": mainGame нет в stats");
    assert.match(p.joined, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(p.country, /^[A-Z]{2}$/);
  });
});

test("players: у каждой игры не меньше 5 игроков", () => {
  GAME_IDS.forEach((g) => {
    assert.ok(players.filter((p) => p.stats[g]).length >= 5, g);
  });
});

test("news: 12 заглушек, уникальные id, game валиден или null", () => {
  assert.equal(news.length, 12);
  assert.equal(new Set(news.map((n) => n.id)).size, 12);
  news.forEach((n) => {
    assert.ok(n.game === null || GAME_IDS.includes(n.game), n.id);
    assert.match(n.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(n.title.includes("[НОВОСТЬ — впиши]") || n.excerpt.includes("[НОВОСТЬ — впиши]"), n.id);
  });
});
