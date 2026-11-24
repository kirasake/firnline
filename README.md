# [НАЗВАНИЕ] — платформа для геймеров

Статический сайт: профили игроков, статистика, рейтинги и новости по **Dota 2, CS2, Valorant и Apex Legends**.
Оформление — Arctic Tech-Wear (`references/DESIGN-SYSTEM.md`, раздел 1).
Сервер и сборка не нужны.

> **Все данные демонстрационные.** Ники вымышлены, цифры сгенерированы, тексты новостей — заглушки `[НОВОСТЬ — впиши]`.
> На каждой странице стоит метка `[ DEMO DATA ]`.

## Как открыть

- **Двойным щелчком** по `index.html`: сайт работает прямо с диска (`file://`).
- **Через локальный сервер** (по желанию): `npx -y http-server -p 8080 .` → http://localhost:8080
  или `python -m http.server 8080`.

Нужен JavaScript: страницы собираются скриптами из файлов `data/`. Без JS видны навигация, заголовки разделов и пояснение.

## Структура

```
index.html players.html player.html rankings.html news.html   страницы
css/arctic.css     токены .theme-arctic и общие компоненты
css/home.css       стили главной
js/core.js         чистая логика (винрейт, K/D, рейтинги, поиск) — window.GP
js/ui.js           шапка, меню, футер, демо-метка, анимации — window.GPUI
js/pages/*.js      сборка конкретной страницы
data/*.js          данные: site, games, players, news
tests/             node --test tests/
```

## Данные: как заменить демо настоящими

Файлы в `data/` — обычные скрипты, а не JSON: так сайт работает и с `file://`, где `fetch` запрещён.
Каждый кладёт свою часть в `window.GP_DATA`. Правьте только значение `var data = …`.

**`data/site.js`** — название платформы (одна константа на весь сайт):
```js
{ name: "[НАЗВАНИЕ]", tagline: "Короткая подпись", demo: true }   // demo: false — убрать метку DEMO DATA
```

**`data/games.js`** — список игр. `id` используется в ссылках (`rankings.html?game=cs2`):
```js
{ id: "dota2", name: "Dota 2", short: "DOTA 2", ratioLabel: "KDA" }   // id: dota2 | cs2 | valorant | apex
```

**`data/players.js`** — игроки. `id` — латиница без пробелов, идёт в адрес `player.html?id=…`:
```js
{ id: "frostbyte", nick: "FrostByte", country: "RU", joined: "2024-03-11", mainGame: "cs2",
  stats: {
    cs2: { matches: 412, wins: 230, kills: 7310, deaths: 5120, assists: 1400, hours: 260, rating: 2140 }
  } }
```
- в `stats` — от одной до четырёх игр, `mainGame` должна быть среди них;
- все числа — целые, `wins ≤ matches`.

**`data/news.js`** — новости, сортируются по дате (новые сверху):
```js
{ id: "n01", date: "2026-11-20", game: "cs2", title: "Заголовок", excerpt: "Короткий текст" }   // game: null — общая
```

### Как считаются цифры
- винрейт = победы / матчи;
- K/D = убийства / max(смерти, 1); для Dota 2 — KDA = (убийства + помощь) / max(смерти, 1);
- при 0 матчей показывается «—»;
- общий рейтинг игрока — сумма `rating` по всем его играм.

После правки данных проверьте их: `node --test tests/` (нужен Node 18+). Тест целостности ловит
повторяющиеся `id`, неизвестные игры и `mainGame`, которой нет в `stats`.

## Публикация на GitHub Pages

1. Создайте репозиторий на GitHub и загрузите туда содержимое этой папки (вместе с файлом `.nojekyll`).
2. В репозитории: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Выберите ветку `main` и папку `/ (root)`, нажмите **Save**.
4. Через минуту сайт будет доступен по адресу `https://<логин>.github.io/<репозиторий>/`.

Все пути относительные, поэтому сайт работает и из подпапки репозитория.
`.nojekyll` отключает обработку Jekyll, чтобы GitHub отдавал файлы как есть.
