# Firnline — платформа для геймеров

Статический сайт: профили игроков, статистика, рейтинги и новости по **Dota 2, CS2, Valorant и Apex Legends**.
Оформление — Arctic Tech-Wear (`references/DESIGN-SYSTEM.md`, раздел 1).
Сервер и сборка не нужны.

> **Все данные демонстрационные.** Ники вымышлены, цифры сгенерированы, тексты новостей и название платформы придуманы для демо: новости рассказывают только о жизни самой платформы (сезоны, лиги, обновления сайта).
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
assets/img/        сгенерированные картинки главной (WebP)
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
{ name: "Firnline", tagline: "Короткая подпись", demo: true }   // demo: false — убрать метку DEMO DATA
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

## Картинки (assets/img)

Все изображения сгенерированы нейросетью **GPT Image 2.6** (`gpt_image_2_6`, Higgsfield CLI), разрешение 1k,
затем через `ffmpeg`: десатурация (`eq=saturation=0.85`), сжатие уровней без чистых чёрного и белого
(`colorlevels`), WebP. На картинках нет логотипов, названий, персонажей и арта игр.
Если файл не загрузился, под ним остаётся SVG-графика (горы в hero и манифесте, рельеф в карточке игры).

| Файл | Где | Параметры генерации |
|---|---|---|
| `hero.webp` 1600×896 | фон hero | 16:9, quality low |
| `hero-figure.webp` 720×900, с прозрачностью | фигура в hero (поверх граффити-тега) | 4:5, quality medium, background transparent |
| `manifest.webp` 1600×896 | фон финального манифеста | 16:9, quality medium |
| `dota2.webp` `cs2.webp` `valorant.webp` `apex.webp` 800×600 | обложки карточек игр | 4:3, quality low |

Фигура вынесена отдельным файлом с прозрачным фоном, чтобы граффити-тег лежал между горами и фигурой.

Общий хвост всех промптов (STYLE):
> Color grade: desaturated cold steel-blue monochrome, hue around 210 degrees, muted blue-gray palette from deep slate (#1E2C3A) to pale ice (#DCE6EF), no pure black and no pure white, lifted soft shadows, cold studio light, atmospheric haze, cinematic photographic 3D render, high detail. Absolutely no text, no letters, no numbers, no logos, no watermark.

Промпты (к каждому в конце добавлен STYLE):
- **hero-figure:** Waist-up studio portrait of an anonymous person in technical winter tech-wear: matte insulated shell jacket with taped seams and high collar, hood up, black balaclava and large reflective ski goggles fully hiding the face, utility harness straps, gloves. Three-quarter view, calm confident pose, head turned slightly to the left. Isolated subject on a fully transparent background, clean crisp edges, cold key light from the left, soft cool rim light.
- **hero:** Wide panorama of a jagged snowy mountain range dissolving in thick cold haze and low clouds, layered ridges receding into fog, overcast pale sky, minimalist and calm, large empty sky area at top and left for headline text, soft diffuse studio-like cold light. No people.
- **manifest:** Dramatic full-frame mountain ridge at blue hour: sharp snow-covered peaks rising in the upper right, wind-blown snow plumes from the summits, dark rocky slopes, the lower left of the frame falls into deep calm shadow and mist leaving empty space for large text overlay. No people.
- **dota2:** Abstract aerial top-down view of a frozen fantasy battle arena: a diagonal river of ice splits a snowy valley into two halves, three winding lanes cross the terrain, silhouettes of ancient stone towers, drifting cold mist, strategic and epic mood. No characters, no creatures, no people.
- **cs2:** Abstract moody interior of an abandoned concrete industrial compound in winter: narrow corridor with an open doorway and stacked crates, shafts of light through dust and frost, cold fluorescent glow, tense tactical silence. Empty, no people, no weapons.
- **valorant:** Abstract futuristic minimalist plaza with angular geometric architecture, sharp-edged panels and a glowing translucent energy barrier wall of frosted light cutting across the space, crisp long shadows, subtle muted cyan accents. Empty, no people, no weapons.
- **apex:** Abstract vast frozen wasteland at dusk: a towering luminous storm wall ring closing in on the horizon, bright contrails of drop pods streaking across the sky, scattered ruined structures half-buried in snow, epic survival mood. Empty, no people, no weapons.

Перегенерировать одну картинку, например:
```
higgsfield generate create gpt_image_2_6 --prompt "<промпт + STYLE>" --aspect_ratio 4:3 --quality low --resolution 1k --output_format png --wait
```

## Публикация на GitHub Pages

1. Создайте репозиторий на GitHub и загрузите туда содержимое этой папки (вместе с файлом `.nojekyll`).
2. В репозитории: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Выберите ветку `main` и папку `/ (root)`, нажмите **Save**.
4. Через минуту сайт будет доступен по адресу `https://<логин>.github.io/<репозиторий>/`.

Все пути относительные, поэтому сайт работает и из подпапки репозитория.
`.nojekyll` отключает обработку Jekyll, чтобы GitHub отдавал файлы как есть.
