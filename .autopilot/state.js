window.STATE =
{
  "version": 2,
  "slug": "arctic-portfolio",
  "dir": "2026-11-24-arctic-portfolio--wip",
  "title": "Портфолио в стиле Arctic Tech-Wear",
  "mode": "semi",
  "depth": "normal",
  "tier": "T1",
  "briefFile": "2026-11-24-brief.md",
  "memoryFile": "AGENTS.md",
  "memoryOwner": "autopilot",
  "skillDir": "C:/Users/X-GAMING/.claude/skills/autopilot",
  "baseCommit": null,
  "startedAt": "2026-11-24T14:15:29+03:00",
  "updatedAt": "2026-11-24T14:23:19+03:00",
  "finishedAt": null,
  "stages": [
    {
      "id": "preflight",
      "status": "done",
      "startedAt": "2026-11-24T14:15:29+03:00",
      "finishedAt": "2026-11-24T14:15:56+03:00"
    },
    {
      "id": "manifest",
      "status": "done",
      "startedAt": "2026-11-24T14:15:56+03:00",
      "finishedAt": "2026-11-24T14:16:41+03:00"
    },
    {
      "id": "briefing",
      "status": "done",
      "startedAt": "2026-11-24T14:16:41+03:00",
      "finishedAt": "2026-11-24T14:20:03+03:00"
    },
    {
      "id": "spec",
      "status": "done",
      "startedAt": "2026-11-24T14:20:03+03:00",
      "finishedAt": "2026-11-24T14:22:49+03:00"
    },
    {
      "id": "plan",
      "status": "active",
      "startedAt": "2026-11-24T14:22:49+03:00"
    },
    {
      "id": "build",
      "status": "pending"
    },
    {
      "id": "review",
      "status": "pending"
    },
    {
      "id": "final",
      "status": "pending"
    }
  ],
  "requirements": {
    "total": 22,
    "done": 0,
    "inTicket": 16,
    "inSpec": 0,
    "placeholder": 0,
    "deferred": 0,
    "dropped": 6
  },
  "tickets": [
    {
      "id": "01",
      "title": "Каркас, стиль Arctic, данные и главная",
      "requirements": [
        "R02",
        "R03",
        "R04",
        "R06",
        "R09",
        "R11i",
        "R13i",
        "G01",
        "G03",
        "G06",
        "G07",
        "G08",
        "G09"
      ],
      "blockedBy": [],
      "wave": 1,
      "zone": [
        "css/",
        "js/core.js",
        "js/ui.js",
        "js/pages/home.js",
        "data/",
        "tests/",
        "index.html",
        "README.md",
        ".nojekyll",
        "PRODUCT.md"
      ],
      "review": "да — фундамент",
      "model": "сильная",
      "status": "pending",
      "retries": 0,
      "repairs": 0
    },
    {
      "id": "02",
      "title": "Игроки, профили, рейтинги и новости",
      "requirements": [
        "G02",
        "G03",
        "G04",
        "G05",
        "G07",
        "G08",
        "G09",
        "R04",
        "R11i"
      ],
      "blockedBy": [
        "01"
      ],
      "wave": 2,
      "zone": [
        "players.html",
        "player.html",
        "rankings.html",
        "news.html",
        "js/pages/players.js",
        "js/pages/player.js",
        "js/pages/rankings.js",
        "js/pages/news.js"
      ],
      "review": "нет",
      "model": "обычная",
      "status": "pending",
      "retries": 0,
      "repairs": 0
    }
  ],
  "tests": null,
  "debt": {
    "placeholders": [],
    "assumptions": [
      "язык сайта русский, служебные подписи латиницей",
      "третья и далее игры выбраны за пользователя"
    ],
    "emptyEnv": []
  },
  "additions": [],
  "coverage": {
    "found": 1,
    "fixed": 1,
    "deferred": 0,
    "items": []
  },
  "concerns": [],
  "blind": null,
  "beats": [
    "2026-11-24T14:15:29+03:00",
    "2026-11-24T14:15:56+03:00",
    "2026-11-24T14:16:36+03:00",
    "2026-11-24T14:16:41+03:00",
    "2026-11-24T14:16:48+03:00",
    "2026-11-24T14:18:35+03:00",
    "2026-11-24T14:20:02+03:00",
    "2026-11-24T14:20:03+03:00",
    "2026-11-24T14:22:48+03:00",
    "2026-11-24T14:22:49+03:00",
    "2026-11-24T14:23:19+03:00"
  ],
  "rev": 15,
  "waiting": null,
  "waits": [
    {
      "kind": "briefing",
      "from": "2026-11-24T14:16:48+03:00",
      "to": "2026-11-24T14:20:03+03:00"
    }
  ],
  "log": [
    {
      "t": "2026-11-24T14:15:29+03:00",
      "k": "init"
    },
    {
      "t": "2026-11-24T14:15:56+03:00",
      "k": "stage",
      "id": "manifest",
      "act": "start"
    },
    {
      "t": "2026-11-24T14:16:41+03:00",
      "k": "stage",
      "id": "briefing",
      "act": "start"
    },
    {
      "t": "2026-11-24T14:16:48+03:00",
      "k": "ask",
      "kind": "briefing",
      "note": "три вопроса — автор и работы, связь, язык сайта"
    },
    {
      "t": "2026-11-24T14:18:35+03:00",
      "k": "ask",
      "kind": "briefing",
      "note": "задача сменилась на платформу для геймеров — уточняю четыре вопроса"
    },
    {
      "t": "2026-11-24T14:20:02+03:00",
      "k": "add",
      "key": "debt.assumptions",
      "n": 2
    },
    {
      "t": "2026-11-24T14:20:03+03:00",
      "k": "answered",
      "kind": "briefing"
    },
    {
      "t": "2026-11-24T14:20:03+03:00",
      "k": "gate",
      "g": "G1",
      "ok": false,
      "open": 16,
      "total": 22
    },
    {
      "t": "2026-11-24T14:20:03+03:00",
      "k": "stage",
      "id": "spec",
      "act": "start"
    },
    {
      "t": "2026-11-24T14:20:03+03:00",
      "k": "gate",
      "g": "G1",
      "ok": true,
      "open": 0,
      "total": 22
    },
    {
      "t": "2026-11-24T14:22:48+03:00",
      "k": "gate",
      "g": "G2",
      "ok": true,
      "found": 1,
      "fixed": 1,
      "deferred": 0
    },
    {
      "t": "2026-11-24T14:22:49+03:00",
      "k": "stage",
      "id": "plan",
      "act": "start"
    },
    {
      "t": "2026-11-24T14:23:19+03:00",
      "k": "tier",
      "v": "T1"
    },
    {
      "t": "2026-11-24T14:23:19+03:00",
      "k": "tickets",
      "n": 2
    },
    {
      "t": "2026-11-24T14:23:19+03:00",
      "k": "gate",
      "g": "G3",
      "ok": true,
      "problems": 0
    }
  ],
  "reqList": [
    {
      "id": "R01",
      "text": "«Portfolio / showcase»",
      "status": "dropped",
      "why": "пользователь: «да вместо портфоли»"
    },
    {
      "id": "R02",
      "text": "«Web»",
      "status": "in-ticket"
    },
    {
      "id": "R03",
      "text": "«статический HTML/CSS»",
      "status": "in-ticket"
    },
    {
      "id": "R04",
      "text": "«стиль Arctic Tech-Wear»",
      "status": "in-ticket"
    },
    {
      "id": "R05",
      "text": "«честные заглушки вместо работ»",
      "status": "dropped",
      "why": "пользователь: «да вместо портфоли»"
    },
    {
      "id": "R06",
      "text": "«Пока ничего» (материалов нет)",
      "status": "in-ticket"
    },
    {
      "id": "R07",
      "text": "«Смешанная» (аудитория)",
      "status": "dropped",
      "why": "пользователь: «да вместо портфоли»"
    },
    {
      "id": "R08",
      "text": "«Something else» (чьи работы)",
      "status": "dropped",
      "why": "пользователь: «да вместо портфоли»"
    },
    {
      "id": "R09",
      "text": "«по русски пиши»",
      "status": "in-ticket"
    },
    {
      "id": "R10i",
      "text": "(подразумевается) посетитель может связаться с автором",
      "status": "dropped",
      "why": "пользователь: «да вместо портфоли»"
    },
    {
      "id": "R11i",
      "text": "(подразумевается) сайт работает на телефоне (Web)",
      "status": "in-ticket"
    },
    {
      "id": "R12i",
      "text": "(подразумевается) новый проект добавляется без переделки сайта",
      "status": "dropped",
      "why": "пользователь: «да вместо портфоли»"
    },
    {
      "id": "G01",
      "text": "«сделай сайи дляплатформы гейремров»",
      "status": "in-ticket"
    },
    {
      "id": "G02",
      "text": "«профили»",
      "status": "in-ticket"
    },
    {
      "id": "G03",
      "text": "«статистика»",
      "status": "in-ticket"
    },
    {
      "id": "G04",
      "text": "«рейтинги»",
      "status": "in-ticket"
    },
    {
      "id": "G05",
      "text": "«новости»",
      "status": "in-ticket"
    },
    {
      "id": "G06",
      "text": "«на гитхабе чисто сайт»",
      "status": "in-ticket"
    },
    {
      "id": "G07",
      "text": "«для игр дота»",
      "status": "in-ticket"
    },
    {
      "id": "G08",
      "text": "«кс»",
      "status": "in-ticket"
    },
    {
      "id": "G09",
      "text": "«и ещее какие нибудь»",
      "status": "in-ticket"
    },
    {
      "id": "R13i",
      "text": "(подразумевается) без сервера данные — демо, явно помеченные",
      "status": "in-ticket"
    }
  ],
  "gates": {
    "G1": {
      "ok": true,
      "at": "2026-11-24T14:20:03+03:00",
      "open": 0,
      "total": 22
    },
    "G2": {
      "ok": true,
      "at": "2026-11-24T14:22:48+03:00",
      "found": 1,
      "fixed": 1,
      "deferred": 0
    },
    "G3": {
      "ok": true,
      "at": "2026-11-24T14:23:19+03:00",
      "problems": 0
    }
  },
  "result": null
}
