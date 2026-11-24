/* core.js — чистая логика платформы, без DOM.
   UMD: в браузере window.GP, в Node — module.exports. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.GP = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var SORT_KEYS = ["rating", "winrate", "ratio", "matches", "nick"];

  function hasMatches(s) {
    return !!s && Number(s.matches) > 0;
  }

  /** Винрейт 0..1; null при 0 матчей. */
  function winrate(s) {
    if (!hasMatches(s)) return null;
    return s.wins / s.matches;
  }

  /** Dota 2 — KDA = (kills+assists)/max(deaths,1); остальные — K/D = kills/max(deaths,1). */
  function ratio(s, gameId) {
    if (!hasMatches(s)) return null;
    var deaths = Math.max(Number(s.deaths) || 0, 1);
    var kills = Number(s.kills) || 0;
    if (gameId === "dota2") return (kills + (Number(s.assists) || 0)) / deaths;
    return kills / deaths;
  }

  function isNum(x) {
    return typeof x === "number" && isFinite(x);
  }

  function formatPct(x) {
    return isNum(x) ? (x * 100).toFixed(1) + "%" : "—";
  }

  function formatRatio(x) {
    return isNum(x) ? x.toFixed(2) : "—";
  }

  function nickCmp(a, b) {
    var x = String(a.nick).toLowerCase();
    var y = String(b.nick).toLowerCase();
    return x < y ? -1 : x > y ? 1 : 0;
  }

  function statValue(row, key, gameId) {
    if (key === "winrate") return winrate(row.stat);
    if (key === "ratio") return ratio(row.stat, gameId);
    if (key === "matches") return Number(row.stat.matches);
    return Number(row.stat.rating);
  }

  /** Места по rating desc (при равенстве — по нику), затем сортировка по sortKey/dir.
      Пустые значения (0 матчей) всегда внизу; равенство — по nick asc. */
  function rankPlayers(players, gameId, sortKey, dir) {
    sortKey = SORT_KEYS.indexOf(sortKey) >= 0 ? sortKey : "rating";
    var sign = dir === "asc" ? 1 : -1;
    var rows = (players || [])
      .filter(function (p) { return p.stats && p.stats[gameId]; })
      .map(function (p) { return { place: 0, player: p, stat: p.stats[gameId] }; });

    rows.slice()
      .sort(function (a, b) {
        return (b.stat.rating - a.stat.rating) || nickCmp(a.player, b.player);
      })
      .forEach(function (r, i) { r.place = i + 1; });

    return rows.sort(function (a, b) {
      if (sortKey === "nick") return sign * nickCmp(a.player, b.player);
      var va = statValue(a, sortKey, gameId);
      var vb = statValue(b, sortKey, gameId);
      var na = !isNum(va), nb = !isNum(vb);
      if (na !== nb) return na ? 1 : -1;
      if (!na && va !== vb) return sign * (va - vb);
      return nickCmp(a.player, b.player);
    });
  }

  function totalRating(p) {
    var sum = 0;
    Object.keys(p.stats || {}).forEach(function (g) { sum += Number(p.stats[g].rating) || 0; });
    return sum;
  }

  /** Место игрока по сумме rating по всем играм; null, если игрока нет. */
  function overallPlace(players, id) {
    var sorted = (players || []).slice().sort(function (a, b) {
      return (totalRating(b) - totalRating(a)) || nickCmp(a, b);
    });
    for (var i = 0; i < sorted.length; i++) if (sorted[i].id === id) return i + 1;
    return null;
  }

  function findPlayer(players, id) {
    if (!id) return null;
    for (var i = 0; i < (players || []).length; i++) if (players[i].id === id) return players[i];
    return null;
  }

  function searchPlayers(players, query, gameId) {
    var q = String(query == null ? "" : query).trim().toLowerCase();
    return (players || []).filter(function (p) {
      if (gameId && !(p.stats && p.stats[gameId])) return false;
      return !q || String(p.nick).toLowerCase().indexOf(q) >= 0;
    });
  }

  function filterNews(news, gameId) {
    return (news || [])
      .filter(function (n) { return !gameId || n.game === gameId; })
      .sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
  }

  function parseQuery(search) {
    var out = {};
    String(search || "").replace(/^\?/, "").split("&").forEach(function (pair) {
      if (!pair) return;
      var i = pair.indexOf("=");
      var k = i >= 0 ? pair.slice(0, i) : pair;
      var v = i >= 0 ? pair.slice(i + 1) : "";
      try {
        out[decodeURIComponent(k.replace(/\+/g, " "))] = decodeURIComponent(v.replace(/\+/g, " "));
      } catch (e) {
        out[k] = v; // битая кодировка — оставляем как есть
      }
    });
    return out;
  }

  function gameById(games, id) {
    for (var i = 0; i < (games || []).length; i++) if (games[i].id === id) return games[i];
    return null;
  }

  return {
    winrate: winrate, ratio: ratio, formatPct: formatPct, formatRatio: formatRatio,
    rankPlayers: rankPlayers, overallPlace: overallPlace, findPlayer: findPlayer,
    searchPlayers: searchPlayers, filterNews: filterNews, parseQuery: parseQuery,
    gameById: gameById, totalRating: totalRating
  };
});
