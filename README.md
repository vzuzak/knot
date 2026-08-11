# Slipknot Tribute CZ — Eyeless (web)

Věrná kopie webu [slipknot1.cz](https://www.slipknot1.cz/). Čisté HTML + CSS + JavaScript,
bez frameworku a bez backendu. Obsah se **načítá za běhu z jednoho souboru `data.json`**
(fetch při zobrazení stránky), takže přidání akce = úprava jediného souboru.

## Jak to funguje

Když se stránka zobrazí, JavaScript si stáhne `data.json` a vykreslí z něj akce, novinky
i sestavu. **Edituješ jen `data.json`** — nic se negeneruje, nic se nekompiluje.

| Soubor | K čemu je |
|---|---|
| **`data.json`** | **Jediné místo, které edituješ** — akce, novinky, členové, kontakt, texty. |
| `index.html` | Domů (hero, akce, novinky, kdo jsme). |
| `event.html` | Detail akce — `event.html?id=<id-akce>`. |
| `post.html` | Detail novinky — `post.html?id=<id-novinky>`. |
| `pro-poradatele.html` | Stránka pro pořadatele. |
| `js/app.js` | Načtení `data.json` + vykreslení. Needituje se kvůli obsahu. |
| `css/style.css` | Vzhled. |
| `assets/` | Logo a fotky (`members/`, `news/`). |
| `sitemap.xml`, `robots.txt` | SEO. |

> ⚠️ **Důležité:** `fetch` funguje jen přes webovou adresu (**http/https**). Web tedy musí
> běžet na hostingu (GitHub Pages, Netlify, Vercel, běžný webhosting/FTP…). Když soubor
> `index.html` jen otevřeš dvojklikem z disku (`file://`), prohlížeč z bezpečnostních důvodů
> načtení `data.json` zablokuje a zobrazí se hláška, ať web otevřeš přes adresu.

## Přidání nové akce (1 krok)

Otevři **`data.json`**, v sekci `"events"` zkopíruj jeden blok `{ … }` a uprav hodnoty:

```json
{
  "id": "nazev-akce-bez-diakritiky",
  "title": "Eyeless v Klubu XY",
  "start": "2027-05-16T20:00:00+02:00",
  "end":   "2027-05-16T23:30:00+02:00",
  "venue": "Klub XY",
  "address": "Nějaká 123, 100 00 Praha",
  "city": "Praha",
  "description": "Krátký popis koncertu.",
  "poster": "",
  "ticketUrl": ""
}
```

Ulož, nahraj `data.json` na web — a je to. Akce se objeví v seznamu i její detail na
`event.html?id=nazev-akce-bez-diakritiky`. Nic negeneruješ.

- Datum: `"RRRR-MM-DDThh:mm:00+02:00"` (v létě `+02:00`, v zimě `+01:00`).
- Bloky odděl **čárkou**. Odehrané akce se samy schovají do „Zobrazit odehrané akce".
- `poster` a `ticketUrl` jsou nepovinné (prázdné `""` = nezobrazí se).
- Volitelně přidej řádek do `sitemap.xml` (pomáhá SEO).

**Novinku** přidáš stejně v sekci `"news"` (obrázek dej do `assets/news/`).
**Fotku člena / kontakt / sítě** změníš v sekcích `"members"`, `"site"`, `"social"`.
**Rider / Playlist / Stage plan**: nahraj PDF (např. do `assets/`) a doplň `url` v `organizer.documents`.

## Náhled během vývoje

Protože se `data.json` načítá přes http, spusť si lokálně jednoduchý server (jen pro náhled
na svém počítači — na hostingu už to řeší hosting sám):

```bash
python3 -m http.server 8000
```

Pak otevři <http://localhost:8000>.

## Nasazení

Nahraj celou složku na statický hosting. Po změně domény uprav `baseUrl` v `data.json`
a odkazy v `sitemap.xml` / `robots.txt`.

## Vylepšení oproti originálu (Wix)

- **Vlastní čistý kód** — bez závislosti na Wixu, rychlé, plná kontrola.
- **SEO:** popisné `<title>`/meta pro každou stránku, Open Graph/Twitter karty, kanonické URL,
  `sitemap.xml`, `robots.txt` a strukturovaná data JSON-LD (`MusicGroup`, `MusicEvent`,
  `NewsArticle`) generovaná za běhu — koncerty se můžou zobrazovat v Google jako události.
- **Responzivita:** plynulé rozvržení + mobilní menu (hamburger), optimalizované fotky.
- **Přístupnost:** „přeskočit na obsah", `aria` popisky, ohled na `prefers-reduced-motion`.
- **Automatický archiv:** odehrané akce se schovávají podle data.

## Písma

Originál používá komerční písma **Avenir** a **Futura** (licence Wixu, nelze je legálně vložit
na jiný web). Nahrazena jsou volnými ekvivalenty z Google Fonts: **Montserrat** (≈ Avenir) a
**Jost** (≈ Futura). Nadpisy používají **Oswald** — přesně původní písmo.
