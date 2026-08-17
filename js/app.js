/* =============================================================================
   Slipknot Tribute CZ — dynamické vykreslení
   Obsah se načítá ZA BĚHU z data.json (fetch při zobrazení stránky).
   Přidání akce/novinky = uprav jen data.json. Nic se negeneruje.
   Pozn.: fetch funguje po nahrání na web (http/https). Otevření souboru
   dvojklikem (file://) prohlížeč z bezpečnostních důvodů blokuje.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Pomocné funkce ------------------------------------------------ */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function getParam(name) { return new URLSearchParams(location.search).get(name); }
  function parseDate(s) { var d = new Date(s); return isNaN(d) ? null : d; }

  var fmtDay  = new Intl.DateTimeFormat("cs-CZ", { day: "2-digit" });
  var fmtWday = new Intl.DateTimeFormat("cs-CZ", { weekday: "short" });
  var fmtFull = new Intl.DateTimeFormat("cs-CZ", { day: "numeric", month: "numeric", year: "numeric" });
  var fmtTime = new Intl.DateTimeFormat("cs-CZ", { hour: "2-digit", minute: "2-digit" });
  var fmtLong = new Intl.DateTimeFormat("cs-CZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  function shortDate(s) {
    var wd = esc(fmtWday.format(s)).replace(/\.$/, "");
    var dd = ("0" + s.getDate()).slice(-2);
    return wd + " " + dd + ". " + (s.getMonth() + 1) + ".";
  }
  function dateTimeRange(startISO, endISO) {
    var s = parseDate(startISO), e = parseDate(endISO);
    if (!s) return "";
    var out = fmtFull.format(s) + " " + fmtTime.format(s);
    if (e) {
      var sameDay = s.toDateString() === e.toDateString();
      out += " – " + (sameDay ? "" : fmtFull.format(e) + " ") + fmtTime.format(e);
    }
    return out;
  }

  /* ---- Ikony sociálních sítí ----------------------------------------- */
  var ICONS = {
    instagram: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm6.2-8.3a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z"/></svg>',
    facebook:  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg>',
    youtube:   '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 3.9 12 3.9 12 3.9s-7.5 0-9.4.5A3 3 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.5.5-5.5s0-3.6-.5-5.5zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>',
    tiktok:    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 5.8c-.9-1-1.4-2.3-1.4-3.8h-3v13.1c0 1.4-1.2 2.6-2.6 2.6a2.6 2.6 0 0 1 0-5.2c.3 0 .5 0 .8.1V9.5a5.7 5.7 0 1 0 4.8 5.6V8.7c1.2.9 2.6 1.4 4.1 1.4V7c-.9 0-1.8-.4-2.7-1.2z"/></svg>'
  };
  function socialList(D) {
    var s = D.social || {};
    var labels = { instagram: "Instagram", facebook: "Facebook", youtube: "YouTube", tiktok: "TikTok" };
    return ["instagram", "facebook", "youtube", "tiktok"].filter(function (k) { return s[k]; }).map(function (k) {
      return '<a href="' + esc(s[k]) + '" target="_blank" rel="noopener" aria-label="' + labels[k] + '">' + ICONS[k] + "</a>";
    }).join("");
  }

  /* ---- Header/patička + mobilní menu --------------------------------- */
  function initChrome(D) {
    document.querySelectorAll("[data-social]").forEach(function (n) { n.innerHTML = socialList(D); });
    document.querySelectorAll("[data-email]").forEach(function (n) {
      n.innerHTML = '<a href="mailto:' + esc(D.site.email) + '">' + esc(D.site.email) + "</a>";
    });
    document.querySelectorAll("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });
    var toggle = qs(".nav-toggle"), links = qs(".nav-links");
    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      links.addEventListener("click", function (e) {
        if (e.target.tagName === "A") { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
      });
    }
  }

  /* ---- SEO: meta + JSON-LD ------------------------------------------- */
  function setMeta(D, opts) {
    if (opts.title) document.title = opts.title;
    function meta(sel, val) {
      if (val == null) return;
      var el = qs(sel);
      if (!el) {
        el = document.createElement("meta");
        var m = sel.match(/\[(name|property)="([^"]+)"\]/);
        if (m) el.setAttribute(m[1], m[2]);
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    }
    meta('meta[name="description"]', opts.description);
    meta('meta[property="og:title"]', opts.title);
    meta('meta[property="og:description"]', opts.description);
    meta('meta[property="og:url"]', opts.url);
    meta('meta[property="og:image"]', opts.image);
    meta('meta[name="twitter:title"]', opts.title);
    meta('meta[name="twitter:description"]', opts.description);
    meta('meta[name="twitter:image"]', opts.image);
    if (opts.url) {
      var link = qs('link[rel="canonical"]');
      if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
      link.href = opts.url;
    }
  }
  function jsonLd(obj) {
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }
  function abs(D, path) {
    if (!path) return undefined;
    return /^https?:/.test(path) ? path : D.site.baseUrl + "/" + String(path).replace(/^\//, "");
  }
  function musicGroup(D) {
    var s = D.social || {};
    return {
      "@type": "MusicGroup", "name": D.site.name, "alternateName": D.site.fullName,
      "url": D.site.baseUrl, "description": D.site.description, "genre": D.site.genre, "email": D.site.email,
      "sameAs": ["instagram", "facebook", "youtube", "tiktok"].filter(function (k) { return s[k]; }).map(function (k) { return s[k]; })
    };
  }
  function eventLd(D, ev) {
    var o = {
      "@type": "MusicEvent", "name": ev.title, "startDate": ev.start, "endDate": ev.end || undefined,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "description": ev.description, "performer": musicGroup(D),
      "organizer": { "@type": "Organization", "name": D.site.fullName, "email": D.site.email },
      "location": { "@type": "Place", "name": ev.venue || ev.city || ev.address,
        "address": { "@type": "PostalAddress", "streetAddress": ev.address, "addressLocality": ev.city, "addressCountry": "CZ" } },
      "url": D.site.baseUrl + "/event.html?id=" + encodeURIComponent(ev.id),
      "image": abs(D, ev.poster) || abs(D, "assets/logo.png")
    };
    if (ev.ticketUrl) o.offers = { "@type": "Offer", "url": ev.ticketUrl, "availability": "https://schema.org/InStock" };
    return o;
  }

  /* ---- Řazení akcí --------------------------------------------------- */
  function splitEvents(D) {
    var now = Date.now(), up = [], past = [];
    (D.events || []).forEach(function (ev) {
      var end = parseDate(ev.end || ev.start);
      (end && end.getTime() < now ? past : up).push(ev);
    });
    up.sort(function (a, b) { return parseDate(a.start) - parseDate(b.start); });
    past.sort(function (a, b) { return parseDate(b.start) - parseDate(a.start); });
    return { up: up, past: past };
  }
  function eventCardHTML(ev, isPast) {
    var s = parseDate(ev.start);
    var date = s
      ? '<div class="event-date"><span class="dd">' + shortDate(s) + '</span><span class="yy">' + s.getFullYear() + "</span></div>"
      : '<div class="event-date"></div>';
    var venue = ev.venue ? "<b>" + esc(ev.venue) + "</b> / " : "";
    return '<li class="event-card' + (isPast ? " past" : "") + '">' + date +
      '<div class="event-main"><h3>' + esc(ev.title) + "</h3>" +
      '<div class="meta">' + venue + esc(ev.address || "") + "</div></div>" +
      '<a class="event-cta" href="event.html?id=' + encodeURIComponent(ev.id) + '">Podrobnosti</a></li>';
  }

  /* ---- HOME ---------------------------------------------------------- */
  function renderHome(D) {
    var hero = qs("[data-hero-tagline]");
    if (hero) hero.textContent = D.site.tagline;

    var evWrap = qs("[data-events]");
    if (evWrap) {
      var ev = splitEvents(D), html = "";
      if (!ev.up.length && !ev.past.length) {
        html = '<p class="events-empty">Momentálně nemáme naplánované žádné akce. Sledujte nás na sítích!</p>';
      } else {
        html += ev.up.length
          ? '<ul class="events-list">' + ev.up.map(function (e) { return eventCardHTML(e, false); }).join("") + "</ul>"
          : '<p class="events-empty">Žádné nadcházející akce – ale brzo přidáme další!</p>';
        if (ev.past.length) {
          html += '<details class="past-details"><summary class="past-toggle">Zobrazit odehrané akce (' + ev.past.length + ")</summary>" +
            '<ul class="events-list" style="margin-top:16px">' + ev.past.map(function (e) { return eventCardHTML(e, true); }).join("") + "</ul></details>";
        }
      }
      evWrap.innerHTML = html;
    }

    var nWrap = qs("[data-news]");
    if (nWrap) {
      nWrap.innerHTML = (D.news || []).map(function (p) {
        return '<article class="news-card"><a class="thumb" href="post.html?id=' + encodeURIComponent(p.id) + '">' +
          '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy" width="400" height="300"></a>' +
          '<div class="body"><h3><a href="post.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.title) + "</a></h3>" +
          "<p>" + esc(p.excerpt) + "</p>" +
          '<div class="foot"><span>' + esc(p.author) + "</span><span>" + (p.views || 0) + " zobrazení</span>" +
          '<span class="likes">♥ ' + (p.likes || 0) + "</span></div></div></article>";
      }).join("");
    }

    var nextWrap = qs("[data-next-event]");
    if (nextWrap) {
      var next = splitEvents(D).up[0];
      if (next) {
        var ns = parseDate(next.start);
        var where = next.venue ? esc(next.venue) + (next.city ? ", " + esc(next.city) : "") : esc(next.city || next.address || "");
        nextWrap.innerHTML =
          '<a class="hero-next-card" href="event.html?id=' + encodeURIComponent(next.id) + '">' +
          '<span class="hn-label">Nejbližší akce</span>' +
          '<span class="hn-date">' + (ns ? esc(shortDate(ns)) + " " + ns.getFullYear() : "") + "</span>" +
          '<span class="hn-title">' + esc(next.title) + "</span>" +
          (where ? '<span class="hn-where">' + where + "</span>" : "") +
          '<span class="hn-go">Podrobnosti →</span></a>';
      } else {
        nextWrap.innerHTML = "";
      }
    }

    var aWrap = qs("[data-about]");
    if (aWrap && D.about) aWrap.innerHTML = D.about.paragraphs.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");

    var mWrap = qs("[data-members]");
    if (mWrap) {
      mWrap.innerHTML = (D.members || []).map(function (m) {
        return '<figure class="member"><div class="photo">' +
          '<img src="' + esc(m.img) + '" alt="' + esc(m.name) + " – " + esc(m.nick) + '" loading="lazy" width="300" height="360"></div>' +
          '<figcaption class="name"><span class="n">' + esc(m.name) + "</span>" +
          '<span class="nick">#' + esc(m.num) + " " + esc(m.nick) + "</span></figcaption></figure>";
      }).join("");
    }

    setMeta(D, { title: D.site.fullName + " – " + D.site.tagline, description: D.site.description, url: D.site.baseUrl + "/", image: abs(D, "assets/logo.png") });
    jsonLd({ "@context": "https://schema.org", "@graph": [musicGroup(D)].concat(splitEvents(D).up.map(function (e) { return eventLd(D, e); })) });
  }

  /* ---- DETAIL AKCE --------------------------------------------------- */
  function renderEvent(D) {
    var host = qs("[data-event-detail]"); if (!host) return;
    var ev = (D.events || []).filter(function (e) { return e.id === getParam("id"); })[0];
    if (!ev) {
      host.innerHTML = '<p class="events-empty">Akce nenalezena. <a href="index.html#akce">Zpět na přehled akcí</a>.</p>';
      setMeta(D, { title: "Akce nenalezena – " + D.site.fullName }); return;
    }
    var url = D.site.baseUrl + "/event.html?id=" + encodeURIComponent(ev.id);
    var s = parseDate(ev.start), mapQ = encodeURIComponent(ev.address || ev.city || "");
    host.innerHTML =
      '<nav class="breadcrumb"><a href="index.html">Domů</a> / <a href="index.html#akce">Akce</a> / ' + esc(ev.title) + "</nav>" +
      '<h1 class="detail-title">' + esc(ev.title) + "</h1>" +
      (s ? '<div class="detail-sub">' + esc(fmtLong.format(s)) + "</div>" : "") +
      '<div class="detail-grid"><div class="detail-body">' +
        (ev.poster ? '<div class="detail-poster"><img src="' + esc(ev.poster) + '" alt="' + esc(ev.title) + '"></div>' : "") +
        "<p>" + esc(ev.description || "") + "</p>" +
        '<div class="share"><span>Sdílet</span>' +
          '<a target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '">Facebook</a>' +
          '<a target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(ev.title) + "&url=" + encodeURIComponent(url) + '">X</a>' +
          '<a target="_blank" rel="noopener" href="https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(url) + '">LinkedIn</a></div>' +
      "</div>" +
      '<aside class="info-box"><dl>' +
        "<dt>Datum a čas</dt><dd>" + esc(dateTimeRange(ev.start, ev.end)) + "</dd>" +
        (ev.venue ? "<dt>Místo</dt><dd>" + esc(ev.venue) + "</dd>" : "") +
        "<dt>Adresa</dt><dd>" + esc(ev.address || "") + "</dd></dl>" +
        (mapQ ? '<a class="btn ghost" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + mapQ + '">Zobrazit na mapě</a>' : "") +
        (ev.ticketUrl ? '<a class="btn" target="_blank" rel="noopener" href="' + esc(ev.ticketUrl) + '">Vstupenky</a>' : "") +
      "</aside></div>";
    setMeta(D, { title: ev.title + " – " + D.site.fullName, description: ev.description || ev.title, url: url, image: abs(D, ev.poster) || abs(D, "assets/logo.png") });
    jsonLd({ "@context": "https://schema.org", "@graph": [eventLd(D, ev)] });
  }

  /* ---- DETAIL NOVINKY ------------------------------------------------ */
  function renderPost(D) {
    var host = qs("[data-post-detail]"); if (!host) return;
    var p = (D.news || []).filter(function (n) { return n.id === getParam("id"); })[0];
    if (!p) {
      host.innerHTML = '<p class="events-empty">Novinka nenalezena. <a href="index.html#novinky">Zpět na novinky</a>.</p>';
      setMeta(D, { title: "Novinka nenalezena – " + D.site.fullName }); return;
    }
    var url = D.site.baseUrl + "/post.html?id=" + encodeURIComponent(p.id);
    host.innerHTML =
      '<nav class="breadcrumb"><a href="index.html">Domů</a> / <a href="index.html#novinky">Novinky</a> / ' + esc(p.title) + "</nav>" +
      '<h1 class="detail-title">' + esc(p.title) + "</h1>" +
      '<div class="detail-sub">' + esc(p.author) + " · " + esc(fmtFull.format(parseDate(p.date) || new Date())) + "</div>" +
      (p.image ? '<div class="detail-poster" style="margin-bottom:24px"><img src="' + esc(p.image) + '" alt="' + esc(p.title) + '"></div>' : "") +
      '<div class="detail-body">' + (p.body || [p.excerpt]).map(function (par) { return "<p>" + esc(par) + "</p>"; }).join("") + "</div>";
    setMeta(D, { title: p.title + " – " + D.site.fullName, description: p.excerpt, url: url, image: abs(D, p.image) || abs(D, "assets/logo.png") });
    jsonLd({ "@context": "https://schema.org", "@type": "NewsArticle", "headline": p.title, "datePublished": p.date,
      "image": abs(D, p.image), "author": { "@type": "Person", "name": p.author }, "publisher": musicGroup(D),
      "description": p.excerpt, "mainEntityOfPage": url });
  }

  /* ---- PRO POŘADATELE ------------------------------------------------ */
  function renderOrganizer(D) {
    var host = qs("[data-organizer]"); if (!host || !D.organizer) return;
    var o = D.organizer;
    var docs = (o.documents || []).filter(function (d) { return d.url; });
    var dl = '<svg class="dl-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>';
    host.innerHTML =
      '<h1 class="detail-title">' + esc(o.heading) + "</h1>" +
      '<p class="about-lead">' + esc(o.intro) + "</p>" +
      '<div class="req-grid">' + o.requirements.map(function (r) {
        return '<div class="req"><h3>' + esc(r.title) + "</h3><p>" + esc(r.text) + "</p></div>";
      }).join("") + "</div>" +
      (docs.length ? '<section class="epk">' +
        (o.epkHeading ? '<h2 class="epk-heading">' + esc(o.epkHeading) + "</h2>" : "") +
        (o.epkIntro ? '<p class="epk-intro">' + esc(o.epkIntro) + "</p>" : "") +
        '<div class="docs">' + docs.map(function (d) {
          return '<a class="btn dl" href="' + esc(d.url) + '" download>' + dl + esc(d.label) + "</a>";
        }).join("") + "</div></section>" : "") +
      '<p style="margin-top:32px"><a class="btn ghost" href="mailto:' + esc(D.site.email) + '">Napiš nám</a></p>';
    setMeta(D, { title: "Pro pořadatele – " + D.site.fullName,
      description: "Chceš Slipknot tribute Eyeless na svojí akci? Technické požadavky, rider, playlist a kontakt.",
      url: D.site.baseUrl + "/pro-poradatele.html", image: abs(D, "assets/logo.png") });
  }

  /* ---- Start: načti data.json a vykresli ----------------------------- */
  function boot(D) {
    initChrome(D);
    var page = document.body.getAttribute("data-page");
    if (page === "home") renderHome(D);
    else if (page === "event") renderEvent(D);
    else if (page === "post") renderPost(D);
    else if (page === "organizer") renderOrganizer(D);
  }
  function fail(err) {
    var main = qs("[data-events]") || qs("[data-event-detail]") || qs("[data-post-detail]") || qs("[data-organizer]") || qs("main");
    if (main) main.innerHTML = '<p class="events-empty" style="padding:40px 0">Obsah se nepodařilo načíst.<br>' +
      "Web je potřeba otevřít přes webovou adresu (http/https), ne přímo ze souboru na disku.</p>";
    console.error("data.json se nepodařilo načíst:", err);
  }
  function start() {
    fetch("data.json", { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(boot).catch(fail);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
