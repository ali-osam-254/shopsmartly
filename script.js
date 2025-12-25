/* ShopSmartly — Bilingual + Theme + Products from products.json (NO ADMIN UI)
   Update products ONLY by editing products.json in GitHub.
*/

const STORAGE = {
  LANG: "ss_lang",
  THEME: "ss_theme",
};

// ضع Tracking ID / Affiliate Tag هنا
const AFFILIATE_TAG = "shopsmart0be0-20"; // <-- Affiliate Tag الخاص بك

const I18N = {
  ar: {
    nav: { home: "الرئيسية", products: "المنتجات", about: "من نحن" },
    hero: {
      eyebrow: "اقتراحات موثوقة • تحديثات مستمرة",
      title: "أفضل المنتجات المختارة بعناية… في مكان واحد",
      subtitle: "ابحث بسرعة، صفِّ حسب التصنيف، واختر المنتج المناسب. روابط شراء مباشرة.",
      ctaPrimary: "ابدأ التصفح",
      ctaSecondary: "كيف نختار المنتجات؟",
      meta1: "⚡ سريع وخفيف",
      meta2: "📱 متجاوب للجوال",
      meta3: "🌍 عربي / English"
    },
    controls: {
      searchPlaceholder: "ابحث عن منتج...",
      sortFeatured: "الأبرز أولاً",
      sortNewest: "الأحدث",
      sortAZ: "A → Z",
      reset: "إعادة ضبط",
      allCategories: "كل التصنيفات"
    },
    products: {
      title: "المنتجات",
      subtitle: "اختر تصنيفًا، أو استخدم البحث للوصول بسرعة.",
      status: (count) => `عدد المنتجات المعروضة: ${count}`,
      emptyTitle: "لا توجد نتائج",
      emptyText: "جرّب تغيير كلمات البحث أو التصنيف.",
      buy: "شراء من أمازون",
      loadError: "تعذر تحميل المنتجات. تأكد من ملف products.json"
    },
    about: {
      title: "من نحن",
      subtitle: "نعرض منتجات مختارة بعناية بهدف تسهيل القرار عليك.",
      c1t: "اختيار ذكي",
      c1d: "نرتّب المنتجات بطريقة تساعدك تقارن بسرعة.",
      c2t: "شفافية",
      c2d: "قد نربح عمولة عند الشراء عبر الروابط (بدون تكلفة إضافية عليك).",
      c3t: "تحديث بالكود",
      c3d: "تحديث المنتجات يتم فقط عبر تعديل ملف products.json على GitHub."
    },
    footer: {
      disclosure: "كمشارك في Amazon قد أحصل على عمولة من عمليات شراء مؤهلة.",
      note: "ملاحظة: قد تحتوي الصفحات على روابط تابعة.",
      backTop: "العودة للأعلى"
    }
  },
  en: {
    nav: { home: "Home", products: "Products", about: "About" },
    hero: {
      eyebrow: "Curated picks • Regular updates",
      title: "Hand-picked products… in one place",
      subtitle: "Search fast, filter by category, and choose confidently. Direct purchase links.",
      ctaPrimary: "Start browsing",
      ctaSecondary: "How we curate",
      meta1: "⚡ Fast & lightweight",
      meta2: "📱 Mobile-friendly",
      meta3: "🌍 Arabic / English"
    },
    controls: {
      searchPlaceholder: "Search products...",
      sortFeatured: "Featured first",
      sortNewest: "Newest",
      sortAZ: "A → Z",
      reset: "Reset",
      allCategories: "All categories"
    },
    products: {
      title: "Products",
      subtitle: "Pick a category or use search to find quickly.",
      status: (count) => `Showing: ${count} product(s)`,
      emptyTitle: "No results",
      emptyText: "Try changing your search or category.",
      buy: "Buy on Amazon",
      loadError: "Failed to load products. Check products.json"
    },
    about: {
      title: "About",
      subtitle: "We curate products to make your decision easier.",
      c1t: "Smart curation",
      c1d: "We organize products to help you compare quickly.",
      c2t: "Transparency",
      c2d: "We may earn a commission when you buy through links (at no extra cost).",
      c3t: "Code-only updates",
      c3d: "Products are updated only by editing products.json on GitHub."
    },
    footer: {
      disclosure: "As an Amazon Associate I earn from qualifying purchases.",
      note: "Note: pages may contain affiliate links.",
      backTop: "Back to top"
    }
  }
};

// عناصر HTML
const els = {
  langBtn: document.getElementById("langBtn"),
  themeBtn: document.getElementById("themeBtn"),
  searchInput: document.getElementById("searchInput"),
  categorySelect: document.getElementById("categorySelect"),
  sortSelect: document.getElementById("sortSelect"),
  resetBtn: document.getElementById("resetBtn"),
  grid: document.getElementById("productsGrid"),
  statusLine: document.getElementById("statusLine"),
  emptyState: document.getElementById("emptyState"),
};

let state = {
  lang: "ar",
  theme: "light",
  products: [],
  filtered: [],
};

// الحصول على معلمات URL
function getQS(name) {
  return new URLSearchParams(location.search).get(name);
}

// تعيين اللغة
function setHtmlLang(lang) {
  const html = document.documentElement;
  html.dataset.lang = lang;
  html.lang = lang === "ar" ? "ar" : "en";
  html.dir = lang === "ar" ? "rtl" : "ltr";
}

// تعيين السمة (الظلام أو الضوء)
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  state.theme = theme;
  localStorage.setItem(STORAGE.THEME, theme);
  els.themeBtn.textContent = theme === "light" ? "🌙" : "☀️";
}

// الترجمة
function t(key) {
  const langPack = I18N[state.lang];
  const parts = key.split(".");
  let cur = langPack;
  for (const p of parts) cur = cur?.[p];
  return typeof cur === "function" ? cur : (cur ?? key);
}

// تطبيق الترجمة على العناصر
function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(node => {
    const key = node.getAttribute("data-i18n");
    const val = t(key);
    node.textContent = typeof val === "function" ? val() : val;
  });

  const phKey = els.searchInput.getAttribute("data-i18n-placeholder");
  if (phKey) els.searchInput.placeholder = t(phKey);

  els.sortSelect.querySelectorAll("option").forEach(opt => {
    const k = opt.getAttribute("data-i18n");
    if (k) opt.textContent = t(k);
  });
}

// تغيير اللغة
function setLang(lang) {
  state.lang = lang;
  localStorage.setItem(STORAGE.LANG, lang);
  setHtmlLang(lang);

  els.langBtn.textContent = lang === "ar" ? "EN" : "AR";

  applyI18n();
  buildCategoryOptions();
  applyFiltersAndRender();
}

// الحصول على فئات المنتجات المميزة
function uniqueCategories(products) {
  const set = new Set();
  products.forEach(p => set.add(p.category || "Other"));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

// بناء خيارات الفئات
function buildCategoryOptions() {
  const current = els.categorySelect.value || "ALL";
  const cats = uniqueCategories(state.products);

  els.categorySelect.innerHTML = "";

  const optAll = document.createElement("option");
  optAll.value = "ALL";
  optAll.textContent = t("controls.allCategories");
  els.categorySelect.appendChild(optAll);

  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    els.categorySelect.appendChild(opt);
  });

  if ([...els.categorySelect.options].some(o => o.value === current)) {
    els.categorySelect.value = current;
  }
}

// تنظيف النصوص
function normalize(str) {
  return (str || "").toString().trim().toLowerCase();
}

// إضافة رابط الأفلييت إلى الرابط
function withAffiliateTag(url) {
  const tag = (AFFILIATE_TAG || "").trim();
  if (!tag) return url;

  try {
    const u = new URL(url);
    u.searchParams.set("tag", tag);
    return u.toString();
  } catch {
    const hasQ = url.includes("?");
    if (url.includes("tag=")) {
      return url.replace(/tag=[^&]+/i, `tag=${encodeURIComponent(tag)}`);
    }
    return url + (hasQ ? "&" : "?") + `tag=${encodeURIComponent(tag)}`;
}

// الحصول على النص حسب اللغة
function pickText(obj) {
  if (!obj) return "";
  return obj[state.lang] || obj.en || obj.ar || "";
}

// فرز المنتجات
function sortProducts(list) {
  const v = els.sortSelect.value;
  const arr = [...list];

  if (v === "featured") {
    arr.sort((a, b) => {
      const af = a.featured ? 1 : 0;
      const bf = b.featured ? 1 : 0;
      if (bf !== af) return bf - af;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  } else if (v === "newest") {
    arr.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } else if (v === "az") {
    arr.sort((a, b) => pickText(a.title).localeCompare(pickText(b.title)));
  }

  return arr;
}

// تطبيق الفلاتر وعرض المنتجات
function applyFiltersAndRender() {
  const q = normalize(els.searchInput.value);
  const cat = els.categorySelect.value;

  let list = [...state.products];

  if (cat && cat !== "ALL") {
    list = list.filter(p => (p.category || "Other") === cat);
  }
  if (q) {
    list = list.filter(p => {
      const title = normalize(pickText(p.title));
      const desc = normalize(pickText(p.description));
      const c = normalize(p.category);
      return title.includes(q) || desc.includes(q) || c.includes(q);
    });
  }

  list = sortProducts(list);
  state.filtered = list;
  render();
}

// عرض المنتجات
function render() {
  const list = state.filtered;
  els.grid.innerHTML = "";

  els.statusLine.textContent = I18N[state.lang].products.status(list.length);
  els.emptyState.hidden = list.length !== 0;

  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";

    const img = p.image || "https://via.placeholder.com/1200x750?text=Product";
    const badge = (p.badge || "").trim();
    const cat = p.category || "Other";

    const title = pickText(p.title);
    const desc = pickText(p.description);

    const url = withAffiliateTag(p.url || "#");
    const buyText = I18N[state.lang].products.buy;

    card.innerHTML = `
      <div class="card__media">
        <img src="${escapeHtml(img)}" alt="${escapeHtml(title)}" loading="lazy" />
      </div>
      <div class="card__body">
        <div class="card__top">
          <span class="kicker">${escapeHtml(cat)}</span>
          ${badge ? `<span class="badge">${escapeHtml(badge)}</span>` : ``}
        </div>
        <h3 class="card__title">${escapeHtml(title)}</h3>
        <p class="card__desc">${escapeHtml(desc)}</p>
      </div>
      <div class="card__actions">
        <a class="btn btn--primary card__btn"
           href="${escapeHtml(url)}"
           target="_blank"
           rel="noopener noreferrer nofollow sponsored">
          🛒 ${escapeHtml(buyText)}
        </a>
      </div>
    `;

    els.grid.appendChild(card);
  });
}

// إضافة الحماية ضد هجمات XSS
function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// تحميل المنتجات من products.json
async function loadProducts() {
  const res = await fetch("products.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load products.json");
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("products.json must be an array");
  state.products = normalizeProducts(data);
}

// تنظيف الفلاتر
function resetControls() {
  els.searchInput.value = "";
  els.categorySelect.value = "ALL";
  els.sortSelect.value = "featured";
  applyFiltersAndRender();
}

// إضافة التمرير السلس
function enableSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

// ربط الأحداث
function bindEvents() {
  els.themeBtn.addEventListener("click", () => {
    setTheme(state.theme === "light" ? "dark" : "light");
  });

  els.langBtn.addEventListener("click", () => {
    setLang(state.lang === "ar" ? "en" : "ar");
  });

  els.searchInput.addEventListener("input", applyFiltersAndRender);
  els.categorySelect.addEventListener("change", applyFiltersAndRender);
  els.sortSelect.addEventListener("change", applyFiltersAndRender);
  els.resetBtn.addEventListener("click", resetControls);

  enableSmoothScroll();
}

// البدء
async function init() {
  bindEvents();

  const savedTheme = localStorage.getItem(STORAGE.THEME);
  setTheme(savedTheme || "light");

  const savedLang = localStorage.getItem(STORAGE.LANG);
  const autoLang = (navigator.language || "en").toLowerCase().startsWith("ar") ? "ar" : "en";
  setLang(savedLang || autoLang);

  try {
    await loadProducts();
  } catch (e) {
    console.error(e);
    els.statusLine.textContent = I18N[state.lang].products.loadError;
    state.products = [];
  }

  buildCategoryOptions();
  applyFiltersAndRender();
}

init();
