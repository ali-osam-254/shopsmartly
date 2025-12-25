/* ShopSmartly — Professional bilingual static site
   - Arabic/English toggle
   - Product search/filter/sort
   - Admin mode inside site: ?admin=1
   - Admin edits saved locally + Export products.json for GitHub upload
*/

const STORAGE = {
  LANG: "ss_lang",
  THEME: "ss_theme",
  AFF_TAG: "ss_affiliate_tag",
  LOCAL_PRODUCTS: "ss_products_override"
};

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
      details: "تفاصيل"
    },
    about: {
      title: "من نحن",
      subtitle: "نعرض منتجات مختارة بعناية بهدف تسهيل القرار عليك.",
      c1t: "اختيار ذكي",
      c1d: "نرتّب المنتجات بطريقة تساعدك تقارن بسرعة.",
      c2t: "شفافية",
      c2d: "قد نربح عمولة عند الشراء عبر الروابط (بدون تكلفة إضافية عليك).",
      c3t: "تحديث سهل",
      c3d: "يمكنك تحديث المنتجات من لوحة إدارة داخل الموقع وتصدير ملف JSON."
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
      details: "Details"
    },
    about: {
      title: "About",
      subtitle: "We curate products to make your decision easier.",
      c1t: "Smart curation",
      c1d: "We organize products to help you compare quickly.",
      c2t: "Transparency",
      c2d: "We may earn a commission when you buy through links (at no extra cost).",
      c3t: "Easy updates",
      c3d: "Update products via the admin panel and export a JSON file."
    },
    footer: {
      disclosure: "As an Amazon Associate I earn from qualifying purchases.",
      note: "Note: pages may contain affiliate links.",
      backTop: "Back to top"
    }
  }
};

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

  // admin
  adminFab: document.getElementById("adminFab"),
  adminModal: document.getElementById("adminModal"),
  affiliateTagInput: document.getElementById("affiliateTagInput"),
  addProductBtn: document.getElementById("addProductBtn"),
  exportBtn: document.getElementById("exportBtn"),
  importFile: document.getElementById("importFile"),
  resetLocalBtn: document.getElementById("resetLocalBtn"),
  adminList: document.getElementById("adminList"),
  editor: document.getElementById("editor"),
  editorTitle: document.getElementById("editorTitle"),
  tAr: document.getElementById("tAr"),
  tEn: document.getElementById("tEn"),
  dAr: document.getElementById("dAr"),
  dEn: document.getElementById("dEn"),
  cat: document.getElementById("cat"),
  badge: document.getElementById("badge"),
  img: document.getElementById("img"),
  url: document.getElementById("url"),
  saveBtn: document.getElementById("saveBtn"),
  cancelBtn: document.getElementById("cancelBtn")
};

let state = {
  lang: "ar",
  theme: "light",
  products: [],
  filtered: [],
  editingId: null,
};

function getQS(name){
  return new URLSearchParams(location.search).get(name);
}

function setHtmlLang(lang){
  const html = document.documentElement;
  html.dataset.lang = lang;
  html.lang = lang === "ar" ? "ar" : "en";
  html.dir = lang === "ar" ? "rtl" : "ltr";
}

function setTheme(theme){
  document.documentElement.dataset.theme = theme;
  state.theme = theme;
  localStorage.setItem(STORAGE.THEME, theme);
  els.themeBtn.textContent = theme === "light" ? "🌙" : "☀️";
}

function setLang(lang){
  state.lang = lang;
  localStorage.setItem(STORAGE.LANG, lang);
  setHtmlLang(lang);

  // button label
  els.langBtn.textContent = lang === "ar" ? "EN" : "AR";

  // Translate text nodes
  applyI18n();

  // Update placeholders
  const phKey = els.searchInput.getAttribute("data-i18n-placeholder");
  if (phKey) els.searchInput.placeholder = t(phKey);

  // rerender selects options text
  buildCategoryOptions();
  buildSortOptions();

  // rerender products
  applyFiltersAndRender();
}

function t(key){
  // key can be "hero.title" etc.
  const langPack = I18N[state.lang];
  const parts = key.split(".");
  let cur = langPack;
  for (const p of parts) cur = cur?.[p];
  return typeof cur === "function" ? cur : (cur ?? key);
}

function applyI18n(){
  document.querySelectorAll("[data-i18n]").forEach(node=>{
    const key = node.getAttribute("data-i18n");
    const val = t(key);
    node.textContent = typeof val === "function" ? val() : val;
  });

  // Footer disclosure changes by lang
  // (already handled via data-i18n)
}

function buildSortOptions(){
  // Keep values, just refresh labels
  const options = els.sortSelect.querySelectorAll("option");
  options.forEach(opt=>{
    const k = opt.getAttribute("data-i18n");
    if (k) opt.textContent = t(k);
  });
}

function uniqueCategories(products){
  const set = new Set();
  products.forEach(p=> set.add(p.category || "Other"));
  return Array.from(set).sort((a,b)=> a.localeCompare(b));
}

function buildCategoryOptions(){
  const current = els.categorySelect.value || "ALL";
  const cats = uniqueCategories(state.products);
  els.categorySelect.innerHTML = "";

  const optAll = document.createElement("option");
  optAll.value = "ALL";
  optAll.textContent = t("controls.allCategories");
  els.categorySelect.appendChild(optAll);

  cats.forEach(c=>{
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    els.categorySelect.appendChild(opt);
  });

  // restore selection if still exists
  if ([...els.categorySelect.options].some(o=>o.value===current)){
    els.categorySelect.value = current;
  }
}

function normalize(str){
  return (str || "").toString().trim().toLowerCase();
}

function getAffiliateTag(){
  return localStorage.getItem(STORAGE.AFF_TAG) || "";
}

function withAffiliateTag(url){
  const tag = getAffiliateTag().trim();
  if (!tag) return url;

  try{
    const u = new URL(url);
    // If url already contains tag, replace it
    u.searchParams.set("tag", tag);
    return u.toString();
  }catch{
    // fallback
    const hasQ = url.includes("?");
    if (url.includes("tag=")){
      return url.replace(/tag=[^&]+/i, `tag=${encodeURIComponent(tag)}`);
    }
    return url + (hasQ ? "&" : "?") + `tag=${encodeURIComponent(tag)}`;
  }
}

function pickText(obj){
  if (!obj) return "";
  return obj[state.lang] || obj.en || obj.ar || "";
}

function sortProducts(list){
  const v = els.sortSelect.value;
  const arr = [...list];

  if (v === "featured"){
    arr.sort((a,b)=>{
      const af = a.featured ? 1 : 0;
      const bf = b.featured ? 1 : 0;
      if (bf !== af) return bf - af;
      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  } else if (v === "newest"){
    arr.sort((a,b)=> (b.createdAt || 0) - (a.createdAt || 0));
  } else if (v === "az"){
    arr.sort((a,b)=> pickText(a.title).localeCompare(pickText(b.title)));
  }

  return arr;
}

function applyFiltersAndRender(){
  const q = normalize(els.searchInput.value);
  const cat = els.categorySelect.value;

  let list = [...state.products];

  if (cat && cat !== "ALL"){
    list = list.filter(p => (p.category || "Other") === cat);
  }
  if (q){
    list = list.filter(p=>{
      const title = normalize(pickText(p.title));
      const desc  = normalize(pickText(p.description));
      const c     = normalize(p.category);
      return title.includes(q) || desc.includes(q) || c.includes(q);
    });
  }

  list = sortProducts(list);

  state.filtered = list;
  render();
}

function render(){
  const list = state.filtered;
  els.grid.innerHTML = "";

  els.statusLine.textContent = I18N[state.lang].products.status(list.length);
  els.emptyState.hidden = list.length !== 0;

  list.forEach(p=>{
    const card = document.createElement("article");
    card.className = "card";

    const img = p.image || "https://via.placeholder.com/1200x750?text=Product";
    const badge = (p.badge || "").trim();
    const cat = p.category || "Other";

    const title = pickText(p.title);
    const desc = pickText(p.description);

    const buyText = I18N[state.lang].products.buy;

    const url = withAffiliateTag(p.url || "#");

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
        <a class="btn btn--primary card__btn" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">
          🛒 ${escapeHtml(buyText)}
        </a>
      </div>
    `;

    els.grid.appendChild(card);
  });
}

function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

async function loadProducts(){
  // 1) Local override (admin edits)
  const local = localStorage.getItem(STORAGE.LOCAL_PRODUCTS);
  if (local){
    try{
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length){
        state.products = normalizeProducts(parsed);
        return;
      }
    }catch{}
  }

  // 2) products.json from server
  try{
    const res = await fetch("products.json", { cache: "no-store" });
    if (res.ok){
      const data = await res.json();
      if (Array.isArray(data)){
        state.products = normalizeProducts(data);
        return;
      }
    }
  }catch{}

  // 3) fallback: empty
  state.products = [];
}

function normalizeProducts(list){
  const now = Date.now();
  return list.map((p, idx)=>({
    id: p.id || `p_${idx}_${now}`,
    category: p.category || "Other",
    badge: p.badge || "",
    featured: !!p.featured,
    createdAt: typeof p.createdAt === "number" ? p.createdAt : now - idx * 1000,
    image: p.image || "",
    url: p.url || "",
    title: p.title || { ar:"", en:"" },
    description: p.description || { ar:"", en:"" }
  }));
}

function resetControls(){
  els.searchInput.value = "";
  els.categorySelect.value = "ALL";
  els.sortSelect.value = "featured";
  applyFiltersAndRender();
}

/* Smooth scroll for anchor links */
function enableSmoothScroll(){
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

/* Admin (inside site) */
function adminEnabled(){
  return getQS("admin") === "1";
}

function openAdmin(){
  els.adminModal.hidden = false;
  document.body.style.overflow = "hidden";
  els.affiliateTagInput.value = getAffiliateTag();
  rebuildAdminList();
}

function closeAdmin(){
  els.adminModal.hidden = true;
  document.body.style.overflow = "";
  hideEditor();
}

function rebuildAdminList(){
  els.adminList.innerHTML = "";

  state.products.forEach(p=>{
    const item = document.createElement("div");
    item.className = "admin-item";

    const title = pickText(p.title) || "(no title)";
    item.innerHTML = `
      <div class="admin-item__meta">
        <div class="admin-item__title">${escapeHtml(title)}</div>
        <div class="admin-item__small">${escapeHtml(p.category || "Other")} • ${escapeHtml(p.id)}</div>
      </div>
      <div class="admin-item__actions">
        <button class="btn btn--soft" type="button" data-edit="${escapeHtml(p.id)}">Edit</button>
        <button class="btn btn--danger" type="button" data-del="${escapeHtml(p.id)}">Delete</button>
      </div>
    `;
    els.adminList.appendChild(item);
  });

  // bind edit/delete
  els.adminList.querySelectorAll("[data-edit]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-edit");
      startEdit(id);
    });
  });
  els.adminList.querySelectorAll("[data-del]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const id = btn.getAttribute("data-del");
      deleteProduct(id);
    });
  });
}

function startEdit(id){
  const p = state.products.find(x=>x.id===id);
  if (!p) return;

  state.editingId = id;
  els.editor.hidden = false;
  els.editorTitle.textContent = "تحرير منتج / Edit Product";

  els.tAr.value = p.title?.ar || "";
  els.tEn.value = p.title?.en || "";
  els.dAr.value = p.description?.ar || "";
  els.dEn.value = p.description?.en || "";
  els.cat.value = p.category || "";
  els.badge.value = p.badge || "";
  els.img.value = p.image || "";
  els.url.value = p.url || "";
}

function startAdd(){
  state.editingId = null;
  els.editor.hidden = false;
  els.editorTitle.textContent = "إضافة منتج / Add Product";
  els.tAr.value = "";
  els.tEn.value = "";
  els.dAr.value = "";
  els.dEn.value = "";
  els.cat.value = "";
  els.badge.value = "";
  els.img.value = "";
  els.url.value = "";
}

function hideEditor(){
  els.editor.hidden = true;
  state.editingId = null;
}

function deleteProduct(id){
  const ok = confirm("حذف المنتج؟ Delete product?");
  if (!ok) return;
  state.products = state.products.filter(p=>p.id!==id);
  persistLocalProducts();
  rebuildAdminList();
  buildCategoryOptions();
  applyFiltersAndRender();
}

function saveEditor(){
  const data = {
    title: { ar: els.tAr.value.trim(), en: els.tEn.value.trim() },
    description: { ar: els.dAr.value.trim(), en: els.dEn.value.trim() },
    category: els.cat.value.trim() || "Other",
    badge: els.badge.value.trim(),
    image: els.img.value.trim(),
    url: els.url.value.trim(),
    featured: true,
    createdAt: Date.now()
  };

  if (!data.url){
    alert("ضع رابط المنتج (Amazon URL) قبل الحفظ.");
    return;
  }

  if (state.editingId){
    const idx = state.products.findIndex(p=>p.id===state.editingId);
    if (idx >= 0){
      state.products[idx] = { ...state.products[idx], ...data };
    }
  } else {
    const id = `p_${Date.now()}`;
    state.products.unshift({ id, ...data });
  }

  persistLocalProducts();
  rebuildAdminList();
  buildCategoryOptions();
  applyFiltersAndRender();
  hideEditor();
}

function persistLocalProducts(){
  localStorage.setItem(STORAGE.LOCAL_PRODUCTS, JSON.stringify(state.products, null, 2));
}

function exportJson(){
  const json = JSON.stringify(state.products, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "products.json";
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

async function importJson(file){
  const text = await file.text();
  const data = JSON.parse(text);
  if (!Array.isArray(data)) throw new Error("Invalid JSON");
  state.products = normalizeProducts(data);
  persistLocalProducts();
  rebuildAdminList();
  buildCategoryOptions();
  applyFiltersAndRender();
}

function resetLocalEdits(){
  const ok = confirm("مسح كل التعديلات المحلية؟ (سيعود الملف products.json الأساسي)");
  if (!ok) return;
  localStorage.removeItem(STORAGE.LOCAL_PRODUCTS);
  location.reload();
}

function bindEvents(){
  els.themeBtn.addEventListener("click", ()=>{
    const next = state.theme === "light" ? "dark" : "light";
    setTheme(next);
  });

  els.langBtn.addEventListener("click", ()=>{
    const next = state.lang === "ar" ? "en" : "ar";
    setLang(next);
  });

  els.searchInput.addEventListener("input", applyFiltersAndRender);
  els.categorySelect.addEventListener("change", applyFiltersAndRender);
  els.sortSelect.addEventListener("change", applyFiltersAndRender);
  els.resetBtn.addEventListener("click", resetControls);

  // admin modal close
  els.adminModal.addEventListener("click", (e)=>{
    const t = e.target;
    if (t && t.getAttribute && t.getAttribute("data-close") === "true"){
      closeAdmin();
    }
  });

  els.adminFab.addEventListener("click", openAdmin);

  els.affiliateTagInput.addEventListener("input", ()=>{
    localStorage.setItem(STORAGE.AFF_TAG, els.affiliateTagInput.value.trim());
    applyFiltersAndRender();
  });

  els.addProductBtn.addEventListener("click", startAdd);
  els.saveBtn.addEventListener("click", saveEditor);
  els.cancelBtn.addEventListener("click", hideEditor);
  els.exportBtn.addEventListener("click", exportJson);
  els.resetLocalBtn.addEventListener("click", resetLocalEdits);

  els.importFile.addEventListener("change", async ()=>{
    const f = els.importFile.files?.[0];
    if (!f) return;
    try{
      await importJson(f);
      alert("تم الاستيراد بنجاح ✅");
    }catch(err){
      alert("فشل الاستيراد: " + err.message);
    }finally{
      els.importFile.value = "";
    }
  });

  enableSmoothScroll();
}

async function init(){
  // initial theme/lang
  const savedTheme = localStorage.getItem(STORAGE.THEME);
  setTheme(savedTheme || "light");

  const savedLang = localStorage.getItem(STORAGE.LANG);
  const autoLang = (navigator.language || "en").toLowerCase().startsWith("ar") ? "ar" : "en";
  setLang(savedLang || autoLang);

  // products
  await loadProducts();
  buildCategoryOptions();
  buildSortOptions();
  applyFiltersAndRender();

  // admin
  if (adminEnabled()){
    els.adminFab.hidden = false;
  }
}

bindEvents();
init();
