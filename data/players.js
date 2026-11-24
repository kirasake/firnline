/* data/players.js — 24 вымышленных демо-игрока. Ники и цифры условные.
   Подключается обычным <script>, кладёт данные в window.GP_DATA.players.
   В Node (тесты) экспортирует их через module.exports. Формат — README.md. */
(function (root) {
  var data = [
  { id: "frostbyte", nick: "FrostByte", country: "RU", joined: "2025-11-03", mainGame: "dota2",
    stats: {
      dota2: { matches: 829, wins: 329, kills: 6887, deaths: 6290, assists: 9119, hours: 622, rating: 1720 }
    } },
  { id: "glacierkid", nick: "GlacierKid", country: "KZ", joined: "2023-06-21", mainGame: "cs2",
    stats: {
      cs2: { matches: 257, wins: 145, kills: 5448, deaths: 3518, assists: 1542, hours: 154, rating: 2146 },
      valorant: { matches: 209, wins: 135, kills: 4445, deaths: 3274, assists: 627, hours: 125, rating: 1722 },
      apex: { matches: 195, wins: 78, kills: 896, deaths: 997, assists: 780, hours: 68, rating: 1864 },
      dota2: { matches: 82, wins: 33, kills: 765, deaths: 526, assists: 738, hours: 62, rating: 1596 }
    } },
  { id: "permafrost", nick: "Permafrost", country: "BY", joined: "2024-07-21", mainGame: "valorant",
    stats: {
      valorant: { matches: 621, wins: 289, kills: 10385, deaths: 6704, assists: 2484, hours: 373, rating: 1674 },
      apex: { matches: 164, wins: 73, kills: 462, deaths: 394, assists: 820, hours: 57, rating: 1613 },
      dota2: { matches: 132, wins: 73, kills: 729, deaths: 557, assists: 1320, hours: 99, rating: 2002 }
    } },
  { id: "northvein", nick: "NorthVein", country: "UA", joined: "2023-09-23", mainGame: "apex",
    stats: {
      apex: { matches: 287, wins: 119, kills: 1214, deaths: 1009, assists: 861, hours: 100, rating: 1883 },
      dota2: { matches: 126, wins: 53, kills: 717, deaths: 729, assists: 1260, hours: 95, rating: 1442 }
    } },
  { id: "tundra7", nick: "Tundra_7", country: "FI", joined: "2024-01-11", mainGame: "dota2",
    stats: {
      dota2: { matches: 390, wins: 230, kills: 1956, deaths: 1592, assists: 4290, hours: 293, rating: 2124 }
    } },
  { id: "polarlight", nick: "Polarlight", country: "NO", joined: "2024-06-02", mainGame: "cs2",
    stats: {
      cs2: { matches: 830, wins: 362, kills: 14233, deaths: 14025, assists: 3320, hours: 498, rating: 1430 },
      valorant: { matches: 222, wins: 124, kills: 3373, deaths: 3702, assists: 1110, hours: 133, rating: 1838 },
      apex: { matches: 135, wins: 67, kills: 577, deaths: 496, assists: 405, hours: 47, rating: 1897 },
      dota2: { matches: 102, wins: 46, kills: 1117, deaths: 1086, assists: 918, hours: 77, rating: 1749 }
    } },
  { id: "avalanchex", nick: "AvalancheX", country: "SE", joined: "2023-07-15", mainGame: "valorant",
    stats: {
      valorant: { matches: 266, wins: 130, kills: 6018, deaths: 3992, assists: 1596, hours: 160, rating: 1599 },
      apex: { matches: 173, wins: 87, kills: 714, deaths: 517, assists: 346, hours: 61, rating: 2079 },
      dota2: { matches: 259, wins: 168, kills: 2109, deaths: 2690, assists: 2849, hours: 194, rating: 1983 }
    } },
  { id: "whiteout", nick: "Whiteout", country: "PL", joined: "2026-08-15", mainGame: "apex",
    stats: {
      apex: { matches: 510, wins: 232, kills: 1636, deaths: 1160, assists: 1530, hours: 179, rating: 1496 },
      dota2: { matches: 243, wins: 139, kills: 1875, deaths: 2285, assists: 2673, hours: 182, rating: 1889 }
    } },
  { id: "snowdrift", nick: "Snowdrift", country: "DE", joined: "2026-02-20", mainGame: "dota2",
    stats: {
      dota2: { matches: 767, wins: 364, kills: 7186, deaths: 5006, assists: 7670, hours: 575, rating: 2005 }
    } },
  { id: "cryonode", nick: "CryoNode", country: "EE", joined: "2026-05-21", mainGame: "cs2",
    stats: {
      cs2: { matches: 601, wins: 261, kills: 13630, deaths: 10171, assists: 3005, hours: 361, rating: 1468 },
      valorant: { matches: 236, wins: 148, kills: 4016, deaths: 4317, assists: 472, hours: 142, rating: 1892 },
      apex: { matches: 109, wins: 64, kills: 389, deaths: 289, assists: 545, hours: 38, rating: 1687 },
      dota2: { matches: 168, wins: 78, kills: 1352, deaths: 1557, assists: 1848, hours: 126, rating: 1601 }
    } },
  { id: "hailstone", nick: "Hailstone", country: "LV", joined: "2023-01-07", mainGame: "valorant",
    stats: {
      valorant: { matches: 482, wins: 305, kills: 10889, deaths: 8809, assists: 2410, hours: 289, rating: 1669 },
      apex: { matches: 201, wins: 117, kills: 826, deaths: 817, assists: 804, hours: 70, rating: 1735 },
      dota2: { matches: 26, wins: 14, kills: 264, deaths: 255, assists: 286, hours: 20, rating: 2057 }
    } },
  { id: "rimeshard", nick: "Rimeshard", country: "LT", joined: "2026-05-26", mainGame: "apex",
    stats: {
      apex: { matches: 504, wins: 276, kills: 1297, deaths: 990, assists: 2520, hours: 176, rating: 1691 },
      dota2: { matches: 109, wins: 57, kills: 792, deaths: 548, assists: 1526, hours: 82, rating: 1910 }
    } },
  { id: "sleetrunner", nick: "SleetRunner", country: "CZ", joined: "2025-12-04", mainGame: "dota2",
    stats: {
      dota2: { matches: 453, wins: 291, kills: 4242, deaths: 3370, assists: 4530, hours: 340, rating: 1752 }
    } },
  { id: "icefloe", nick: "IceFloe", country: "IS", joined: "2025-12-18", mainGame: "cs2",
    stats: {
      cs2: { matches: 475, wins: 268, kills: 7326, deaths: 5409, assists: 1425, hours: 285, rating: 1861 },
      valorant: { matches: 0, wins: 0, kills: 0, deaths: 0, assists: 0, hours: 0, rating: 1000 },
      apex: { matches: 0, wins: 0, kills: 0, deaths: 0, assists: 0, hours: 0, rating: 1000 },
      dota2: { matches: 0, wins: 0, kills: 0, deaths: 0, assists: 0, hours: 0, rating: 1000 }
    } },
  { id: "coldfront", nick: "Coldfront", country: "CA", joined: "2024-02-26", mainGame: "valorant",
    stats: {
      valorant: { matches: 450, wins: 216, kills: 8721, deaths: 10853, assists: 900, hours: 270, rating: 1879 },
      apex: { matches: 132, wins: 74, kills: 476, deaths: 340, assists: 264, hours: 46, rating: 2139 },
      dota2: { matches: 115, wins: 64, kills: 1172, deaths: 1145, assists: 1150, hours: 86, rating: 1720 }
    } },
  { id: "fjordling", nick: "Fjordling", country: "AM", joined: "2024-09-07", mainGame: "apex",
    stats: {
      apex: { matches: 454, wins: 209, kills: 1073, deaths: 1007, assists: 908, hours: 159, rating: 1530 },
      dota2: { matches: 244, wins: 138, kills: 1696, deaths: 1215, assists: 3172, hours: 183, rating: 1619 }
    } },
  { id: "driftwatch", nick: "Driftwatch", country: "GE", joined: "2026-02-16", mainGame: "dota2",
    stats: {
      dota2: { matches: 270, wins: 127, kills: 1649, deaths: 1289, assists: 2430, hours: 203, rating: 1783 }
    } },
  { id: "frostline", nick: "Frostline", country: "RS", joined: "2025-06-20", mainGame: "cs2",
    stats: {
      cs2: { matches: 362, wins: 148, kills: 5527, deaths: 5454, assists: 1086, hours: 217, rating: 1843 },
      valorant: { matches: 234, wins: 99, kills: 4353, deaths: 4611, assists: 702, hours: 140, rating: 1667 },
      apex: { matches: 107, wins: 42, kills: 235, deaths: 210, assists: 428, hours: 37, rating: 1677 },
      dota2: { matches: 134, wins: 82, kills: 756, deaths: 646, assists: 1474, hours: 101, rating: 2205 }
    } },
  { id: "iceberg9", nick: "Iceberg9", country: "RU", joined: "2024-09-07", mainGame: "valorant",
    stats: {
      valorant: { matches: 878, wins: 431, kills: 14081, deaths: 9644, assists: 1756, hours: 527, rating: 1763 },
      apex: { matches: 112, wins: 52, kills: 390, deaths: 255, assists: 672, hours: 39, rating: 2040 },
      dota2: { matches: 49, wins: 32, kills: 401, deaths: 530, assists: 637, hours: 37, rating: 2219 }
    } },
  { id: "kryo", nick: "Kryo", country: "KZ", joined: "2023-02-25", mainGame: "apex",
    stats: {
      apex: { matches: 376, wins: 236, kills: 1771, deaths: 1650, assists: 1880, hours: 132, rating: 2099 },
      dota2: { matches: 144, wins: 89, kills: 1369, deaths: 1145, assists: 2160, hours: 108, rating: 2105 }
    } },
  { id: "nordlicht", nick: "Nordlicht", country: "BY", joined: "2024-07-02", mainGame: "dota2",
    stats: {
      dota2: { matches: 794, wins: 314, kills: 5133, deaths: 4837, assists: 7146, hours: 596, rating: 1945 }
    } },
  { id: "sastrugi", nick: "Sastrugi", country: "UA", joined: "2025-07-12", mainGame: "cs2",
    stats: {
      cs2: { matches: 714, wins: 337, kills: 10815, deaths: 8104, assists: 2856, hours: 428, rating: 1849 },
      valorant: { matches: 255, wins: 151, kills: 4572, deaths: 3452, assists: 510, hours: 153, rating: 2172 },
      apex: { matches: 246, wins: 121, kills: 575, deaths: 432, assists: 1476, hours: 86, rating: 2078 },
      dota2: { matches: 168, wins: 70, kills: 1842, deaths: 1810, assists: 1512, hours: 126, rating: 1405 }
    } },
  { id: "serac", nick: "Serac", country: "FI", joined: "2024-08-21", mainGame: "valorant",
    stats: {
      valorant: { matches: 729, wins: 358, kills: 14885, deaths: 13034, assists: 3645, hours: 437, rating: 1880 },
      apex: { matches: 179, wins: 76, kills: 648, deaths: 463, assists: 537, hours: 63, rating: 1597 },
      dota2: { matches: 218, wins: 118, kills: 1462, deaths: 964, assists: 2398, hours: 164, rating: 1891 }
    } },
  { id: "moraine", nick: "Moraine", country: "NO", joined: "2023-04-04", mainGame: "apex",
    stats: {
      apex: { matches: 304, wins: 178, kills: 743, deaths: 515, assists: 608, hours: 106, rating: 2117 },
      dota2: { matches: 201, wins: 95, kills: 1409, deaths: 1038, assists: 2211, hours: 151, rating: 1476 }
    } }
  ];
  if (typeof module === "object" && module.exports) module.exports = data;
  else { root.GP_DATA = root.GP_DATA || {}; root.GP_DATA.players = data; }
})(typeof self !== "undefined" ? self : this);
