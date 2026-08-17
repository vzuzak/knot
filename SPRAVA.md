# Jak spravovat web (návod pro kapelu)

Celý obsah webu je v jednom souboru **`data.json`**. Fotky jsou ve složce **`assets/`**.
Vše se dá upravit přímo na webu github.com – **není potřeba nic instalovat**.

Po každé uložené změně se web sám aktualizuje zhruba **do 1 minuty**.

> 💡 Nemůžeš nic nenávratně rozbít. Kdyby se něco pokazilo, dá se každá změna vrátit
> zpět v historii (záložka **Commits** v repozitáři).

---

## ✏️ Upravit text / přidat akci / přidat novinku

1. Otevři soubor s obsahem (odkaz rovnou do editoru):
   **https://github.com/vzuzak/knot/edit/main/data.json**
   (nebo v repu klikni na `data.json` a na **tužtičku ✏️** vpravo nahoře)
2. Uprav text.
3. Dole klikni na zelené **Commit changes…** → ještě jednou **Commit changes**.

Za minutu je to na webu.

### Přidat koncert

V souboru najdi řádek `"events": [` a hned pod něj vlož nový blok. Zkopíruj tenhle
a jen změň hodnoty:

```json
    {
      "id": "eyeless-praha-klub-xy",
      "title": "Eyeless v Klubu XY",
      "start": "2027-05-16T20:00:00+02:00",
      "end":   "2027-05-16T23:30:00+02:00",
      "venue": "Klub XY",
      "address": "Nějaká 123, 100 00 Praha",
      "city": "Praha",
      "description": "Krátký popis koncertu.",
      "poster": "",
      "ticketUrl": ""
    },
```

- **`id`** = krátký název bez mezer a bez háčků/čárek (použije se v odkazu), musí být jiný než u ostatních akcí.
- **`start` / `end`** = datum a čas ve tvaru `ROK-MĚSÍC-DENThodina:minuta:00+02:00`.
  V létě je na konci `+02:00`, v zimě `+01:00`.
- **`venue`, `poster`, `ticketUrl`** můžou zůstat prázdné `""`.
  `ticketUrl` (odkaz na vstupenky) přidá na detailu akce tlačítko „Vstupenky".
- ⚠️ Mezi bloky `{ … }` musí být **čárka**. Poslední blok před `]` čárku mít nemá.

Odehrané koncerty **nemusíš mazat** – jakmile datum uplyne, samy se schovají do
rozbalovacího „Zobrazit odehrané akce".

### Přidat novinku

Stejně, ale v části `"news": [`. Nejdřív nahraj obrázek (viz níže) do `assets/news/`
a pak vlož blok:

```json
    {
      "id": "nazev-novinky",
      "title": "Nadpis novinky",
      "date": "2026-08-17",
      "author": "spudiljosef",
      "image": "assets/news/muj-obrazek.jpg",
      "excerpt": "Krátký úvodní text, který se ukáže na hlavní stránce.",
      "body": [
        "První odstavec celého článku.",
        "Druhý odstavec."
      ],
      "views": 0,
      "likes": 0
    },
```

---

## 🖼️ Nahrát fotku (novinka nebo člen)

1. Otevři složku, kam obrázek patří:
   - fotky členů: **https://github.com/vzuzak/knot/upload/main/assets/members**
   - obrázky k novinkám: **https://github.com/vzuzak/knot/upload/main/assets/news**
2. **Přetáhni** obrázek do okna (nebo *choose your files*).
3. Dole **Commit changes**.

Doporučení: pojmenuj soubor bez mezer a háčků, např. `pepa-novy.jpg`, ať se dobře odkazuje.

---

## 🧑‍🎤 Vyměnit jméno nebo fotku člena

V `data.json` v části `"members": [` je pro každého člena jeden řádek:

```json
    { "num": "1", "name": "Josef Spudil", "nick": "Joey", "img": "assets/members/1-josef-spudil.jpg" },
```

- **Změnit jméno / přezdívku:** přepiš `"name"` nebo `"nick"`.
- **Vyměnit fotku – dvě možnosti:**
  1. **Jednodušší:** nahraj novou fotku pod **stejným názvem** jako je v `"img"` (přepíše
     starou) – v `data.json` pak neměníš nic.
  2. Nebo nahraj fotku s novým názvem a v `"img"` přepiš cestu na nový soubor.

- `num` = číslo Slipknot masky (0–8), `nick` = přezdívka (např. „Joey").

---

## ✅ Na co si dát pozor

- **Čárky a uvozovky** v `data.json` musí sedět. Když si nejsi jistý, zkopíruj obsah do
  <https://jsonlint.com> a klikni *Validate* – ukáže, kde je chyba.
- Kdyby web po úpravě hlásil, že se obsah nepodařilo načíst, je skoro jistě chyba čárka/uvozovka
  v `data.json`. Otevři **Commits** v repu a vrať poslední změnu (*Revert*), nebo chybu oprav.
- Háčky a čárky v **textech** (název akce, popis, jména) jsou v pořádku – ty klidně používej.
