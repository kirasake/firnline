# Интерфейсы

## Правила проекта
- Визуальный источник истины — `references/DESIGN-SYSTEM.md`: раздел 1 и токены `.theme-arctic` из §8. Направления не смешивать.
- Только относительные пути; никаких `fetch` к локальным файлам; никаких сборщиков и npm-зависимостей.
- Имена в коде английские. Тексты интерфейса русские, служебные подписи латиницей.
- Не упоминать реальных игроков и команды; не использовать логотипы, арт и фирменные цвета игр.
- Данные выводятся только через `textContent` или `GPUI.el`, никакого `innerHTML` с данными.

## Границы, решённые в спецификации

### Файлы
```
index.html  players.html  player.html  rankings.html  news.html
css/arctic.css        токены, база, все общие компоненты
js/core.js            чистая логика, UMD: window.GP и module.exports
js/ui.js              общий каркас: шапка, меню, футер, demo-метка, reveal, хелперы DOM
js/pages/<page>.js    сборка страницы из GP_DATA + GP + GPUI (home, players, player, rankings, news)
data/site.js data/games.js data/players.js data/news.js
tests/core.test.js tests/data.test.js     node --test tests/
.nojekyll  README.md
```
Порядок подключения на каждой странице, все с `defer`: `data/site.js, data/games.js, data/players.js, data/news.js, js/core.js, js/ui.js, js/pages/<page>.js`.

### data — владеет данными, ничего не вычисляет
```js
window.GP_DATA = window.GP_DATA || {};
GP_DATA.site    = { name: "[НАЗВАНИЕ]", tagline: string, demo: true };
GP_DATA.games   = [{ id: "dota2"|"cs2"|"valorant"|"apex", name: "Dota 2", short: "DOTA 2", ratioLabel: "KDA"|"K/D" }];
GP_DATA.players = [{ id: "frostbyte", nick: "FrostByte", country: "RU", joined: "2024-03-11",
                     mainGame: "cs2",
                     stats: { cs2: { matches, wins, kills, deaths, assists, hours, rating } } }];
GP_DATA.news    = [{ id: "n01", date: "2026-11-20", game: "cs2"|null, title: string, excerpt: string }];
```
В Node каждый `data/*.js` экспортирует свою часть через `module.exports`, если `module` определён (`site.js` → объект site, `games.js` → массив и т. д.).

### core (window.GP) — чистые функции, без DOM
```js
GP.winrate(s)              -> number|null  // wins/matches, 0..1; matches=0 -> null
GP.ratio(s, gameId)        -> number|null  // dota2: (kills+assists)/max(deaths,1); иначе kills/max(deaths,1); matches=0 -> null
GP.formatPct(x)            -> "57.3%" | "—"
GP.formatRatio(x)          -> "1.42"  | "—"
GP.rankPlayers(players, gameId, sortKey="rating", dir="desc") -> [{ place, player, stat }]
   // только игроки с этой игрой; sortKey: rating|winrate|ratio|matches|nick;
   // при равенстве — по nick asc; place = место по rating desc, не зависит от сортировки
GP.overallPlace(players, id) -> number|null  // место по сумме rating по всем играм
GP.findPlayer(players, id)   -> player|null
GP.searchPlayers(players, query, gameId|null) -> players  // по нику, без регистра, с обрезкой пробелов; gameId — только у кого есть эта игра
GP.filterNews(news, gameId|null) -> news      // date desc; null -> все
GP.parseQuery(search)      -> { [key]: string }
GP.gameById(games, id)     -> game|null
```

### ui (window.GPUI) — общий каркас, вызывается каждой страницей
```js
GPUI.mount({ page: "home"|"players"|"player"|"rankings"|"news" })
   // рисует шапку (логотип, ссылки в [ скобках ], активная подчёркнута, бургер < 768px),
   // demo-метку, футер с пояснением про демо; включает reveal (с учётом prefers-reduced-motion)
GPUI.el(tag, attrs, ...children) -> Element   // тексты только через textContent
GPUI.avatar(player, size) -> SVGElement       // монограмма в срезанном/октагональном контуре
GPUI.emptyState(title, actionLabel, href) -> Element
GPUI.gameSwitch(games, activeId|null, onChange, { withAll: bool }) -> Element  // кнопки-фильтры, aria-pressed
```
В HTML у каждой страницы есть статичные `<a class="skip-link" href="#main">`, `<header data-gp-header>`, `<main id="main">`, `<footer data-gp-footer>`, `<noscript>`.

### Швы для тестов
Только `js/core.js` и `data/*.js` (целостность: уникальные id, mainGame есть в stats, id игр из списка, news.game валиден или null, у каждой игры не меньше 5 игроков). Команда: `node --test tests/`.

## Стек и команды
- HTML5, CSS, ванильный JS (ES2020), без сборки и без npm-зависимостей. Node 26 есть на машине — только для тестов.
- Запуск: открыть `index.html` в браузере, или `npx -y http-server -p 8080 .` для проверки по http.
- **Проверка одной командой:** `node --test tests/`
- Один файл: `node --test tests/core.test.js`
- Визуальная проверка: страницы на ширине 375 и 1280 px; в консоли нет ошибок.
- Не трогать: `.autopilot/`, `AGENTS.md`, `CLAUDE.md`, `references/`.

## Что построили завершённые таски

### 01
- `GP` — все функции из границ, плюс `GP.totalRating(player) -> number` (сумма rating по всем играм).
- `GPUI.mount, el, avatar, emptyState, gameSwitch` — как в границах; плюс `GPUI.svg(tag, attrs, ...children)`, `bracket(text, cls)`, `tm()`, `counter(cur, total)`, `reveal(scope)`, `initials(nick)`.
- `data/*.js` — UMD: в браузере `window.GP_DATA.<key>`, в Node `module.exports`. 24 игрока; у `icefloe` три игры с 0 матчей — valorant, apex, dota2 (проверка «—»). Исправлено по точечному ревью: раньше здесь ошибочно стоял `iceberg9`.
- CSS-классы для страниц: `.container .section .section--deep .section-head(__meta/__aside) .h-mega .display .h2 .h3 .label(--bracket/--strong) .label-stack .lead .counter .btn-oct(--deep/--on-light) .btn-outline[aria-pressed] .link-arrow .card-chamfer(--light/--surface) .game-switch .gp-table(.num, .col-secondary скрыт <768px, th[aria-sort] button) .empty-state .field .noscript-note [data-reveal] .reveal-lines>.line-mask>span [data-parallax]`. Стили главной — в `css/home.css`.
- Шаблон страницы — `index.html`: `html.theme-arctic`, инлайн-скрипт в head ставит класс `.js`, статичная запасная шапка и футер (mount их заменяет), `<noscript>`. Новые страницы копируют этот шаблон.
- Шапка: пятая ссылка «Лидер» ведёт на `player.html?id=<игрок №1 общего рейтинга>`.
