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

test("site: настоящее название вместо заглушки и флаг демо", () => {
  assert.equal(typeof site.name, "string");
  assert.ok(!site.name.includes("[НАЗВАНИЕ]") && !/[\[\]]/.test(site.name), "название — заглушка: " + site.name);
  assert.match(site.name, /^[A-Za-z][A-Za-z0-9 ]{2,15}$/, "короткое латинское название");
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

test("news: 12 новостей, уникальные id, game валиден или null", () => {
  assert.equal(news.length, 12);
  assert.equal(new Set(news.map((n) => n.id)).size, 12);
  news.forEach((n) => {
    assert.ok(n.game === null || GAME_IDS.includes(n.game), n.id);
    assert.match(n.date, /^\d{4}-\d{2}-\d{2}$/);
  });
});

test("news: настоящие тексты без заглушек [НОВОСТЬ", () => {
  news.forEach((n) => {
    assert.ok(!n.title.includes("[НОВОСТЬ") && !n.excerpt.includes("[НОВОСТЬ"), n.id + ": осталась заглушка");
    assert.ok(n.title.trim().length > 0 && n.excerpt.trim().length > 0, n.id);
  });
});

test("news: у каждой игры минимум 2 новости, общих 1–2", () => {
  GAME_IDS.forEach((g) => assert.ok(news.filter((n) => n.game === g).length >= 2, g));
  const general = news.filter((n) => n.game === null).length;
  assert.ok(general >= 1 && general <= 2, "общих: " + general);
});

test("news: даты в пределах двух месяцев до 2026-11-24", () => {
  news.forEach((n) => assert.ok(n.date >= "2026-09-24" && n.date <= "2026-11-24", n.id + ": " + n.date));
});
