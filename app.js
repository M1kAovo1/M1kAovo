/* M1kAovo · 页面交互
 * 初学者导读
 * - render() 根据 #home / #notes / #article/hld 等地址选择页面
 * - data/*.js 提供文章索引与图库资料
 * - articles/*.html 存放独立文章正文，使用 fetch() 读取
 * - 不依赖框架或外部服务；本地请用 Live Server / python -m http.server
 */

const PLAY_ICON = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.5 5.5L18 12L8.5 18.5Z"
          fill="currentColor"/>
  </svg>
`;

const PAUSE_ICON = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="6" y="5" width="4" height="14"
          rx="1" fill="currentColor"/>
    <rect x="14" y="5" width="4" height="14"
          rx="1" fill="currentColor"/>
  </svg>
`;

(() => {
  "use strict";

  const S = window.SITE;
  const POSTS = window.POSTS;
  const GALLERY = window.GALLERY || [];
  const GALLERY_ALBUMS = window.GALLERY_ALBUMS || [];
  const CATEGORIES = window.CATEGORIES;
  const SUBCATEGORIES = window.SUBCATEGORIES || {};
  const FRAGMENTS = Array.isArray(window.FRAGMENTS)
    ? window.FRAGMENTS.filter(item => item && item.id && item.text) : [];
  const app = document.getElementById("app");
  const toast = document.getElementById("toast");
  const dialog = document.getElementById("lightbox");
  const articleBodyCache = new Map();
  let currentRender = 0;
  let notesCategory = "all";
  let notesSubcategory = "all";
  let notesQuery = "";
  let notesSort = "newest";
  let fragmentsType = "all";
  let fragmentsQuery = "";
  let fragmentsOrder = "newest";
  let galleryReturnFocus = null;
  let galleryCurrentImage = null;
  let toastTimer;

  const h = value => String(value ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);

  const categoryName = id => CATEGORIES.find(c => c.id === id)?.label ?? "笔记";
  
const categoryPath = post => {
  const main = categoryName(post.category);

  const groups = SUBCATEGORIES[post.category] || [];
  const group = groups.find(
    item => item.id === post.subcategory
  );

  return group ? `${main} / ${group.label}` : main;
};

function getPostTime(post) {
  const time = Date.parse(post.createdAt || "");
  return Number.isFinite(time) ? time : null;
}

function formatPostTime(post) {
  if (!post.createdAt) return "";
  return post.createdAt.slice(0, 19).replace("T", " ");
}

function sortPosts(items, order = "newest") {
  return [...items].sort((a, b) => {
    const x = getPostTime(a);
    const y = getPostTime(b);

    if (x === null && y === null) return 0;
    if (x === null) return 1;
    if (y === null) return -1;

    return order === "oldest" ? x - y : y - x;
  });
}

  const routeInfo = () => {
    const raw = (location.hash || "#home").slice(1);
    const slash = raw.indexOf("/");
    const type = slash < 0 ? raw : raw.slice(0, slash);
    let id = slash < 0 ? "" : raw.slice(slash + 1);
    try { id = decodeURIComponent(id); } catch (_) { id = ""; }
    return { type: type || "home", id };
  };
  const sectionHead = (small, title, desc = "", action = "") => `
    <div class="section-head">
      <div><span class="section-kicker">${h(small)}</span><h2>${title}</h2>
      ${desc ? `<p>${h(desc)}</p>` : ""}</div>${action}
    </div>`;
  const linkArrow = (url, text) => `<a class="inline-link" href="${h(url)}">${h(text)} <span aria-hidden="true">↗</span></a>`;
  const eyebrow = text => `<span class="page-kicker"><span class="kicker-diamond" aria-hidden="true">✦</span> ${h(text)}</span>`;
  const pageHead = (small, title, desc) => `
    <section class="page-heading wrap">
      ${eyebrow(small)}<h1>${title}</h1><p>${h(desc)}</p>
    </section>`;

  
function postRow(post, index = 0) {
  const time = formatPostTime(post);

  return `
    <a class="post-row"
       href="#article/${encodeURIComponent(post.id)}">

      <span class="post-index">
        ${String(index + 1).padStart(2, "0")}
      </span>

      <span class="post-main">
        <span class="post-mini">${h(categoryPath(post))}</span>

        <strong>${h(post.title)}</strong>

        ${post.teaser
          ? `<span class="post-teaser">${h(post.teaser)}</span>`
          : ""}
      </span>

      <span class="post-aside">
        ${time
          ? `<time datetime="${h(post.createdAt)}">${h(time)}</time>`
          : (post.reading
              ? `<span>${h(post.reading)}</span>`
              : "")}

        <span class="post-arrow" aria-hidden="true">↗</span>
      </span>
    </a>`;
}

  function picture(item, className = "") {
    return `<button class="picture ${className}" type="button" data-image="${h(item.id)}" aria-label="放大查看：${h(item.title)}">
      <img loading="lazy" decoding="async" src="${h(item.src)}" alt="${h(item.description)}">
      <span class="picture-label">${h(item.title)} <span aria-hidden="true">↗</span></span>
    </button>`;
  }

  function home() {
    const featured = sortPosts(POSTS, "newest").slice(0, 3);
    const showcase = GALLERY.slice(0, 3);
    app.innerHTML = `
      <section class="hero">
        <div class="wide hero-layout">
          <div class="hero-writing">
            <div class="hero-small"><span class="tiny-star">✳</span> 三日月 · みかづき</div>
            <h1>${S.heroTitle}</h1>
            <p>${h(S.heroNote)}</p>
            <div class="hero-links"><a class="hero-primary" href="#notes">笔记 <span aria-hidden="true">↗</span></a>
              <a href="#about" class="hero-secondary">关于我 <span aria-hidden="true">→</span></a></div>
            <div class="hero-bottom"><span class="line-symbol" aria-hidden="true">⌁</span>
              <span>算法 · 数学 · 语言 · 音乐 · 动漫</span></div>
          </div>
          <div class="hero-art">
            <img src="assets/scenes/northern lights.jpg" width="1600" height="900" alt="极光照亮雪山的夜空">
            <span class="hero-drawing-note">おやすみ ☾</span>
          </div>
        </div>
        <div class="hero-bottom-rule wide" aria-hidden="true"><span>☾</span><i></i><span>三日月</span></div>
      </section>

      <div class="paper-content">
        <section class="wrap home-latest">
          ${sectionHead("最近整理的笔记","Recent Notes", "ww", linkArrow("#notes","全部笔记"))}
          <div class="post-list">${featured.map(postRow).join("")}</div>
        </section>

        <section class="subject-section">
          <div class="wrap subject-layout">
            <div class="subject-note">
              <span class="section-kicker">笔记总览</span>
              <h2>未来は<br>そこにあるから</h2>
              <p>aa</p>
              <div class="subject-mark" aria-hidden="true"><span>☾</span><i></i></div>
            </div>
            <div class="subject-index">
              ${CATEGORIES.filter(cat => cat.id !== "all").map((cat, idx) => `
                <a class="subject-line" href="#category/${h(cat.id)}">
                  <span class="subject-num">${String(idx + 1).padStart(2,"0")}</span>
                  <span>${h(cat.label)}</span>
                  <span class="subject-count">${POSTS.filter(post=>post.category === cat.id).length} 篇</span>
                  <span class="subject-arrow" aria-hidden="true">↗</span>
                </a>`).join("")}
            </div>
          </div>
        </section>

        <section class="wrap home-gallery">
          ${sectionHead("相册","照片与插画","",linkArrow("#gallery","打开相册"))}
          <div class="home-gallery-grid">
            ${picture(showcase[0], "home-picture-main")}
            ${picture(showcase[1], "home-picture-small")}
            ${picture(showcase[2], "home-picture-small")}
          </div>
        </section>

        <section class="wrap home-closing">
          <div class="closing-lines"><span>还有一些留白</span><i></i></div>
          <div><h2>网页会不断更新，请期待～</h2>
            <p>bb</p>
            ${linkArrow("#favorites","听歌")}
          </div>
        </section>
      </div>`;
  }

  function notes() {
    notesCategory = routeInfo().type === "category" && CATEGORIES.some(x=>x.id === routeInfo().id)
      ? routeInfo().id : "all";
    notesQuery = "";
    notesSubcategory = "all";

    app.innerHTML = `<div class="paper-content notes-page">
      ${pageHead("笔记","Notes","")}
      <section class="wrap notes-layout">
        <aside class="notes-sidebar" aria-label="笔记分类">
          <p class="notes-sidebar-title">分类</p>
          <div class="notes-filters">${CATEGORIES.map(cat=>`
            <button type="button" class="filter ${notesCategory===cat.id?'active':''}" data-cat="${h(cat.id)}">
              <span>${h(cat.label)}</span><small>${cat.id==="all"?POSTS.length:POSTS.filter(x=>x.category===cat.id).length}</small>
            </button>`).join("")}</div>
          <div class="notes-margin">ee</div>
        </aside>
        <div class="notes-main">
          <label class="search-line">
            <span class="search-lens" aria-hidden="true">⌕</span>
            <input id="notes-search" type="search" autocomplete="off" placeholder="搜索标题或标签" aria-label="搜索文章">
            <kbd>/</kbd>
          </label>
          
<div class="notes-result-top">
  <span id="result-note"></span>

  <label>
    排序
    <select id="notes-sort" aria-label="笔记排序">
      <option value="newest" ${notesSort === "newest" ? "selected" : ""}>
        最新优先 ↓
      </option>
      <option value="oldest" ${notesSort === "oldest" ? "selected" : ""}>
        最早优先 ↑
      </option>
    </select>
  </label>
</div>

<div id="notes-subcategories"
     class="notes-subcategories"
     hidden></div>

          <div id="notes-results" class="post-list"></div>
        </div>
      </section>
    </div>`;
    updateNotes();
  }




function renderNoteSubcategories() {
  const el = document.getElementById(
    "notes-subcategories"
  );

  if (!el) return;

  // 读取当前一级分类对应的二级分类
  const groups = SUBCATEGORIES[notesCategory] || [];

  // 「全部」不显示二级分类
  // 没有设置二级分类的学科也不显示
  if (notesCategory === "all" || groups.length === 0) {
    el.innerHTML = "";
    el.hidden = true;
    return;
  }

  // 只统计当前一级分类的文章
  const categoryPosts = POSTS.filter(
    post => post.category === notesCategory
  );

  const makeButton = (id, label, count) => {
    const active = notesSubcategory === id;

    return `
      <button
        type="button"
        class="sub-filter ${active ? "active" : ""}"
        data-subcat="${h(id)}"
        aria-pressed="${active}">
        ${h(label)}
        <small>${count}</small>
      </button>
    `;
  };

  // 第一行：只放一个「全部」按钮
  const allButton = makeButton(
    "all",
    "全部",
    categoryPosts.length
  );

  // 第二行开始：当前学科的小分类
  const groupButtons = groups.map(group => {
    const count = categoryPosts.filter(
      post => post.subcategory === group.id
    ).length;

    return makeButton(
      group.id,
      group.label,
      count
    );
  }).join("");

  el.innerHTML = `
    <div class="sub-filter-all-row">
      ${allButton}
    </div>

    <div class="sub-filter-list">
      ${groupButtons}
    </div>
  `;

  el.hidden = false;
}

function updateNotes() {
  
const filtered = POSTS.filter(post => {
  const matchCategory =
    notesCategory === "all" ||
    post.category === notesCategory;

  const matchSubcategory =
    notesSubcategory === "all" ||
    post.subcategory === notesSubcategory;

  const searchable = [
    post.title,
    post.teaser,
    ...(post.tags || []),
    categoryPath(post)
  ].join(" ").toLocaleLowerCase();

  return matchCategory &&
    matchSubcategory &&
    searchable.includes(notesQuery.toLocaleLowerCase());
});

  const selected = sortPosts(filtered, notesSort);

  renderNoteSubcategories();

  document.getElementById("result-note").textContent =
    `共 ${selected.length} 篇`;

  document.getElementById("notes-results").innerHTML =
    selected.length
      ? selected.map(postRow).join("")
      : `<div class="no-results">
           <span>☾</span>
           <p>没有找到文章</p>
           <button type="button" data-clear>清除搜索条件</button>
         </div>`;
}

  async function article(id, token) {
    const post = POSTS.find(p=>p.id===id);
    if (!post) { notFound(); return; }
    app.innerHTML = `<div class="paper-content reading-page">
      <div class="wrap reading-top"><a href="#notes">← 返回笔记</a><span>${h(categoryPath(post))}</span></div>
      <header class="wrap reading-title">
        ${eyebrow(categoryName(post.category))}
        <h1>${h(post.title)}</h1><p>${h(post.teaser)}</p>
        
<div class="reading-meta">
  ${post.createdAt
    ? `<span><time datetime="${h(post.createdAt)}">${h(formatPostTime(post))}</time></span>`
    : ""}

  ${post.reading
    ? `<span>${h(post.reading)}</span>`
    : ""}

  ${(post.tags || [])
    .map(tag => `<span>${h(tag)}</span>`)
    .join("")}
</div>
      </header>
      <div class="wrap reading-columns">
        <div class="article-copy" id="article-copy"><p class="loading-note">正在翻开这一页…</p></div>
        <aside class="reading-sidebar"><div class="reading-sidebar-inner">
          <span class="reading-sidebar-label">本页目录</span><div id="article-toc"></div>
          <button id="copy-link" class="reading-copy-link" type="button">复制文章链接 ↗</button>
        </div></aside>
      </div>
      <div class="wrap article-foot">
        <span class="article-end-symbol">☾</span><p>  </p>
        <a href="#notes">返回笔记目录 ↗</a>
      </div>
    </div>`;
    try {
      let body = articleBodyCache.get(post.file);
      if (!body) {
        const res = await fetch(post.file, { cache: "no-cache" });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        body = await res.text();
        articleBodyCache.set(post.file, body);
      }
      if (token !== currentRender) return;
      const article = document.getElementById("article-copy");
      

const isMarkdown = post.file.toLowerCase().endsWith(".md");

if (isMarkdown && !window.markdownit) {
  throw new Error("Markdown 库未加载");
}

article.innerHTML = isMarkdown
  ? window.markdownit({
      html: true,
      linkify: true,
      breaks: false
    }).render(body)
  : body;

// 文章动态加载完后，再处理 LaTeX 公式
if (window.renderMathInElement) {
  window.renderMathInElement(article, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false }
    ],
    throwOnError: false
  });
}

const codeBlocks =
  article.querySelectorAll("pre[data-code-src]");

for (const pre of codeBlocks) {
  const code = pre.querySelector("code");
  const path = pre.dataset.codeSrc;

  if (!code) continue;

  try {
    const response = await fetch(
      new URL(path, document.baseURI)
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    code.textContent = await response.text();
    if (window.hljs) {
  code.classList.add("language-cpp");
  hljs.highlightElement(code);
}

  } catch (error) {
    code.textContent = `代码读取失败：${path}`;
    console.error("加载 C++ 文件失败", error);
  }
}
      const headings = [...article.querySelectorAll("h2")];
      headings.forEach((el,i) => { el.id = `part-${i+1}`; });
      const toc = document.getElementById("article-toc");
      toc.innerHTML = headings.map(el=>`<button type="button" data-scroll="${h(el.id)}">${h(el.textContent)}</button>`).join("");
      article.querySelectorAll("pre").forEach(pre=>{
        const b = document.createElement("button");
        b.className = "copy-code"; b.type="button"; b.textContent="复制代码";
        b.addEventListener("click",async()=>{
          try { await navigator.clipboard.writeText(pre.querySelector("code")?.innerText ?? pre.innerText); notify("代码已复制"); }
          catch { notify("浏览器未允许复制，请手动选中"); }
        });
        pre.appendChild(b);
      });
    } catch(error) {
      if (token !== currentRender) return;
      document.getElementById("article-copy").innerHTML =
        `<div class="load-fail"><h2>这页暂时翻不开</h2><p>请用 VS Code 的 Live Server 运行网站，或检查 articles/ 中的文件是否存在</p><code>${h(String(error.message))}</code></div>`;
    }
  }


  // 05 / 相册：分类入口、照片列表、封面设置
  function albumById(id) {
    return GALLERY_ALBUMS.find(item => item.id === id);
  }

  function albumCoverId(album) {
    // 网页内选择封面只保存在这个浏览器；
    // 公开网站的默认封面以 data/gallery.js 的 coverId 为准。
    let id = album.coverId;
    try {
      id = localStorage.getItem("m1kaovo-cover-" + album.id) || id;
    } catch (_) {}
    if (album.photos.some(photo => photo.id === id)) return id;
    return album.photos[0]?.id || null;
  }

  function albumCover(album) {
    const id = albumCoverId(album);
    return album.photos.find(photo => photo.id === id) || null;
  }

  function gallery(albumId = "") {
    const album = albumId ? albumById(albumId) : null;
    if (albumId && !album) { notFound(); return; }

    if (!album) {
      app.innerHTML = `<div class="paper-content">
        <section class="wrap gallery-top gallery-scene-head">
          <img class="gallery-scene-photo" src="assets/scenes/sky-dream.webp"
               alt="" aria-hidden="true" loading="eager">
          ${eyebrow("相册")}
          <h1>相册</h1>
        </section>
        <section class="wrap gallery-album-list">
          <div class="album-collection">
            ${GALLERY_ALBUMS.map((item, index) => {
              const cover = albumCover(item);
              return `<a class="album-card" href="#gallery/${encodeURIComponent(item.id)}">
                <span class="album-card-visual" data-album="${h(item.id)}">
                  ${cover
                    ? `<img src="${h(cover.src)}" loading="lazy" decoding="async"
                             alt="${h(cover.description || cover.title || item.title)}">`
                    : `<span class="album-empty-art" aria-hidden="true">☾</span>`}
                </span>
                <span class="album-card-foot">
                  <span class="album-card-name"><small>${String(index + 1).padStart(2, "0")}</small> ${h(item.title)}</span>
                  <span class="album-count">${item.photos.length} 张 <span aria-hidden="true">↗</span></span>
                </span>
              </a>`;
            }).join("")}
          </div>
        </section>
      </div>`;
      return;
    }

    const albumIndex = GALLERY_ALBUMS.indexOf(album) + 1;
    const coverId = albumCoverId(album);
    const photoCards = album.photos.map((photo, index) => `
      <div class="album-photo-tile">
        <button class="album-photo-open" type="button"
                data-album-photo="${h(photo.id)}" data-photo-album="${h(album.id)}"
                aria-label="放大查看${h(photo.title || photo.description || "照片 " + (index + 1))}">
          <span class="album-photo-frame" style="--tile-ratio:${h(album.ratio || "4 / 3")}">
            <img src="${h(photo.src)}" loading="lazy" decoding="async"
                 alt="${h(photo.description || photo.title || album.title)}">
          </span>
          <span class="album-photo-label">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <span>${h(photo.title || "")}</span>
            <span class="album-photo-open-icon" aria-hidden="true">↗</span>
          </span>
        </button>
      </div>`).join("");

    app.innerHTML = `<div class="paper-content">
      <section class="wrap album-detail-head">
        <a class="album-back" href="#gallery">← 返回全部相册</a>
        <div class="album-detail-heading">
          <span class="album-detail-no">${String(albumIndex).padStart(2, "0")}</span>
          <div><h1>${h(album.title)}</h1><p>共 ${album.photos.length} 张</p></div>
        </div>
      </section>
      <section class="wrap album-detail-main">
        ${album.photos.length
          ? `<div class="gallery-album-photos" data-album="${h(album.id)}">
               ${photoCards}
             </div>
             <details class="album-cover-tools">
               <summary>选择封面</summary>
               <div class="album-cover-choices">
               ${album.photos.map((photo, index) => `
                 <button type="button" class="album-cover-choice ${coverId === photo.id ? "active" : ""}"
                         data-cover-choice="${h(photo.id)}" data-cover-album="${h(album.id)}">
                   ${String(index + 1).padStart(2, "0")} ${h(photo.title || photo.description || "照片")}
                   ${coverId === photo.id ? " · 当前封面" : ""}
                 </button>`).join("")}
               </div>
               <button type="button" class="album-copy-cover" data-copy-cover="${h(album.id)}">复制 coverId 配置</button>
               <button type="button" class="album-copy-cover" data-reset-cover="${h(album.id)}">恢复文件默认封面</button>
             </details>`
          : `<div class="album-no-photos">
               <span aria-hidden="true">☾</span>
               <p></p>
               <small></small>
             </div>`}
      </section>
    </div>`;
  }

  

  // 08 / Fragments：用户自己的摘录集（数据位于 data/fragments.js）
  const FRAGMENT_TYPES = [
    ["all", "全部"],
    ["lyrics", "歌词"],
    ["book", "书摘"],
    ["anime", "动漫"],
  ];
  const fragmentTypeLabel = type =>
    FRAGMENT_TYPES.find(item => item[0] === type)?.[1] || "摘句";

  function fragments() {
    app.innerHTML = `
      <div class="paper-content fragments-page">
        <header class="wrap page-heading fragments-intro">
          ${eyebrow("摘句")}
          <h1>Fragments</h1>
          <p>。</p>
        </header>
        <section class="wrap fragments-library" aria-label="摘句收藏">
          <div class="fragments-tabs" role="group" aria-label="摘句分类">
            ${FRAGMENT_TYPES.map(([type, label]) => `
              <button type="button" class="fragments-tab"
                      data-frag-type="${h(type)}" aria-pressed="false">
                ${h(label)}
                <small>${type === "all" ? FRAGMENTS.length :
                    FRAGMENTS.filter(item => item.type === type).length}</small>
              </button>`).join("")}
          </div>
          <div class="fragments-tools">
            <label class="fragments-search">
              <span aria-hidden="true">⌕</span>
              <input id="fragments-search" type="search"
                     placeholder="搜索原句、作品、歌手或标签"
                     value="${h(fragmentsQuery)}"
                     autocomplete="off" aria-label="搜索摘句">
            </label>
            <label class="fragments-sort">排序
              <select id="fragments-sort" aria-label="摘句排序">
                <option value="newest" ${fragmentsOrder === "newest" ? "selected" : ""}>最新优先</option>
                <option value="oldest" ${fragmentsOrder === "oldest" ? "selected" : ""}>最早优先</option>
              </select>
            </label>
          </div>
          <p id="fragments-count" class="fragments-count" aria-live="polite"></p>
          <div id="fragments-results" class="fragments-grid"></div>
        </section>
      </div>`;
    updateFragments();
  }

  function fragmentCard(item, position) {
    const type = fragmentTypeLabel(item.type);
    const date = typeof item.date === "string" ? item.date.slice(0, 10) : "";
    const origin = [item.work, item.creator].filter(Boolean);
    const picture = typeof item.image === "string" ? item.image.trim() : "";
    const tags = Array.isArray(item.tags) ? item.tags : [];
    const source = typeof item.sourceUrl === "string" &&
      /^https?:\/\//i.test(item.sourceUrl) ? item.sourceUrl : "";

    return `
      <article class="fragment-entry" id="frag-${h(item.id)}">
        <div class="fragment-topline">
          <span class="fragment-index">${String(position + 1).padStart(2, "0")}</span>
          <span>${h(type)}</span>
          ${date ? `<time datetime="${h(date)}">${h(date)}</time>` : ""}
        </div>
        <blockquote class="fragment-text">${h(item.text)}</blockquote>
        ${item.translation ? `<p class="fragment-translation">${h(item.translation)}</p>` : ""}
        ${picture ? `
          <button type="button" class="fragment-image"
                  data-frag-image="${h(item.id)}" aria-label="放大查看相关图片">
            <img src="${h(picture)}" loading="lazy" decoding="async"
                 alt="${h(item.work || "摘句附图")}" />
            <span>查看图片 <span aria-hidden="true">↗</span></span>
          </button>` : ""}
        <div class="fragment-foot">
          <div class="fragment-attribution">
            ${origin.length ? `<p>${origin.map(h).join(" <span aria-hidden='true'>/</span> ")}</p>` : ""}
            ${tags.length ? `<div class="fragment-tags">${tags.map(tag =>
              `<span>${h(tag)}</span>`).join("")}</div>` : ""}
          </div>
          <div class="fragment-actions">
            ${source ? `<a href="${h(source)}" target="_blank"
                          rel="noopener noreferrer">出处 ↗</a>` : ""}
            <button type="button" data-frag-copy="${h(item.id)}"
                    aria-label="复制这条摘句">复制</button>
          </div>
        </div>
      </article>`;
  }

  function updateFragments() {
    const results = document.getElementById("fragments-results");
    if (!results) return;

    document.querySelectorAll("[data-frag-type]").forEach(button => {
      const active = button.dataset.fragType === fragmentsType;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    const query = fragmentsQuery.toLocaleLowerCase();
    const filtered = FRAGMENTS.filter(item => {
      if (fragmentsType !== "all" && item.type !== fragmentsType) return false;
      const searchable = [
        item.text, item.translation, item.work, item.creator,
        ...(Array.isArray(item.tags) ? item.tags : [])
      ].join(" ").toLocaleLowerCase();
      return searchable.includes(query);
    }).sort((a, b) => {
      const x = Date.parse(a.date || "") || 0;
      const y = Date.parse(b.date || "") || 0;
      return fragmentsOrder === "oldest" ? x - y : y - x;
    });

    document.getElementById("fragments-count").textContent =
      `共 ${filtered.length} 条 · ${fragmentTypeLabel(fragmentsType)}`;

    if (FRAGMENTS.length === 0) {
      results.innerHTML = `
        <div class="fragments-empty">
          <span class="fragments-empty-index">01</span>
          <h2>e</h2>
          <p>ee</p>
        </div>`;
      return;
    }
    if (filtered.length === 0) {
      results.innerHTML = `
        <div class="fragments-empty">
          <span class="fragments-empty-index">NO MATCHES</span>
          <h2>没有找到匹配的摘句。</h2>
          <button type="button" data-frag-reset>清除筛选</button>
        </div>`;
      return;
    }
    results.innerHTML = filtered.map(fragmentCard).join("");
    // 用户在 data/fragments.js 填错图片路径时，隐藏损坏的图片入口。
    results.querySelectorAll(".fragment-image img").forEach(img => {
      img.addEventListener("error", () => {
        img.closest(".fragment-image")?.classList.add("fragment-image-error");
      }, {once:true});
    });
  }

  async function copyFragment(id) {
    const item = FRAGMENTS.find(fragment => String(fragment.id) === id);
    if (!item) return;
    const origin = [item.work, item.creator].filter(Boolean).join(" · ");
    const content = String(item.text) + (origin ? `\n—— ${origin}` : "");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(content);
      notify("摘句已复制");
    } catch (_) {
      const field = document.createElement("textarea");
      field.value = content;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      notify(copied ? "摘句已复制" : "请长按或选择文字复制");
    }
  }

function favorites() {
  
app.innerHTML = `
  <div class="paper-content listen-page">
    <section class="listen-page__inner">
      <span class="listen-page__label">听歌</span>
      <h1 class="listen-page__title">Listen</h1>
      <p class="listen-page__subtitle">日推～</p>

<div id="mika-player-root"></div>

    </section>
  </div>
`;

}

  function projects() {
    app.innerHTML = `<div class="paper-content">
      ${pageHead("项目","Projects","我的项目～")}
      <section class="wrap projects-page">
        <a class="project-leading">
          <div class="project-leading-copy">
            <span class="project-state"><i></i> 进行中</span>
            <span class="project-num">01 / 个人网站</span>
            <h2>M1kAovo</h2>
            <p>nio</p>
            <div class="project-tags"><span>HTML</span><span>CSS</span><span>JavaScript</span><span>GitHub Pages</span></div>
          </div>
          
        </div>
        <div class="project-next">
          <article><span>02</span><h3>ee</h3><p>e</p></article>
          <article><span>03</span><h3>ee</h3><p>e</p></article>
        </div>
        <a class="resume-access" href="#resume"><span>个人简历</span><span>e</span><span aria-hidden="true">↗</span></a>
      </section>
    </div>`;
  }

  function messages() {
    app.innerHTML = `
      <div class="paper-content">
        <section class="page-heading wrap">
          <h1>留言</h1>
        </section>
      </div>`;
  }

  function about() {
    const links = [
      S.contact.github ? `<a href="${h(S.contact.github)}" rel="noopener noreferrer" target="_blank">GitHub ↗</a>` : "",
      S.contact.bilibili ? `<a href="${h(S.contact.bilibili)}" rel="noopener noreferrer" target="_blank">Bilibili ↗</a>` : "",
      S.contact.email ? `<a href="mailto:${h(S.contact.email)}">邮件联系 ↗</a>` : "",
      S.contact.qqGroup ? `<a href="${h(S.contact.qqGroup)}" rel="noopener noreferrer" target="_blank">M1kAovo 的小窝 ↗</a>` : ""
    ].filter(Boolean).join("");
    app.innerHTML = `<div class="paper-content">
      ${pageHead("关于我","About Me","欢迎来到我的个人主页 QWQ")}
      <section class="wrap about-page">
        <div class="about-picture"><img src="assets/scenes/milthm.jpg" alt="头像"><div class="about-picture-note">みかづき　☾</div></div>
        <div class="about-copy">
          <span class="section-kicker">关于我</span>
          <h2>简介</h2>
          <p>${h(S.aboutIntro)}</p>
          <p>M1kAovo 这个 id 来自一句我喜欢的歌词「三日月の船に乗って、星から星へと旅する」</p>
          <p>${h(S.aboutExtra)}</p>
          <div class="about-list"><h3>感兴趣的方向</h3>${S.areas.map(item=>`<span>${h(item)}</span>`).join("")}</div>
          ${links ? `<div class="about-links">${links}</div>` : `<p class="about-quiet"> </p>`}
        </div>
      </section>
      <section class="wrap group-note"><div><span class="section-kicker">M1kAovo 的小窝</span><h2>欢迎大家来我的小窝玩呀～</h2><p>QQ 群号：</p></div><span class="group-moon" aria-hidden="true">☾</span></section>
    </div>`;
  }

  function resume() {
    app.innerHTML = `<div class="paper-content">
      ${pageHead("个人简历","留给以后的履历","这一页可以打印为 PDF。所有空白资料都要由本人如实填写")}
      <div class="wrap resume-tools"><span>目前是未填写的简历模板</span><button type="button" id="print-btn">打印 / 保存 PDF ↗</button></div>
      <section class="resume-paper wrap">
        <div class="resume-title"><div><small>个人履历</small><h2>M1kAovo</h2><p>计算机专业 · 在读</p></div><span>☾</span></div>
        <div class="resume-section"><h3>教育背景</h3><p>e</p></div>
        <div class="resume-section"><h3>技术方向</h3><p>e</p></div>
        <div class="resume-section"><h3>项目经历</h3><p>e</p></div>
        <div class="resume-section"><h3>竞赛与科研</h3><p>e</p></div>
        <div class="resume-section"><h3>公开链接</h3><p>GitHub、联系邮箱：</p></div>
      </section>
    </div>`;
  }

  function notFound() {
    app.innerHTML = `<section class="paper-content missing">
      <span class="missing-moon">☾</span><h1>好像走错了房间</h1><p>这个链接暂时没有对应的页面</p><a href="#home">回到首页 ↗</a>
    </section>`;
  }

  function notify(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
  }


  // 大图查看：沿用网站原来的 dialog，新增相册内图片和下载
  function showPictureInLightbox(image, trigger, albumId = null, photoIndex = -1) {
    if (!image) return;
    if (trigger) galleryReturnFocus = trigger;
    galleryCurrentImage = albumId ? {albumId, photoIndex} : null;

    const img = document.getElementById("lightbox-img");
    img.src = image.src;
    img.alt = image.description || image.title || "图片";
    document.getElementById("lightbox-title").textContent = image.title || image.description || "";
    document.getElementById("lightbox-note").textContent =
      image.title && image.description !== image.title ? (image.description || "") : "";
    document.getElementById("lightbox-credit").textContent = image.credit || "";

    const link = document.getElementById("lightbox-download");
    link.href = image.src;
    link.download = image.src.split("?")[0].split("/").pop() || "photo";
    link.setAttribute("aria-label", "下载图片：" + (image.title || image.description || "照片"));

    const count = albumId ? (albumById(albumId)?.photos.length || 0) : 0;
    document.getElementById("lightbox-prev").hidden = count < 2;
    document.getElementById("lightbox-next").hidden = count < 2;
    if (!dialog.open) dialog.showModal();
    document.getElementById("lightbox-close").focus();
  }

  function openImage(id, trigger) {
    const image = GALLERY.find(item => item.id === id);
    showPictureInLightbox(image, trigger);
  }

  function openAlbumImage(albumId, photoId, trigger = null) {
    const album = albumById(albumId);
    if (!album) return;
    const index = album.photos.findIndex(photo => photo.id === photoId);
    if (index < 0) return;
    const photo = album.photos[index];
    showPictureInLightbox({
      ...photo,
      title: photo.title || photo.description || `${index + 1} / ${album.photos.length}`
    }, trigger, albumId, index);
  }

  function stepAlbumPhoto(delta) {
    if (!dialog.open || !galleryCurrentImage) return;
    const {albumId, photoIndex} = galleryCurrentImage;
    const album = albumById(albumId);
    if (!album || album.photos.length < 2) return;
    const next = (photoIndex + delta + album.photos.length) % album.photos.length;
    openAlbumImage(albumId, album.photos[next].id);
  }

  function saveCoverPreview(albumId, photoId) {
    const album = albumById(albumId);
    if (!album || !album.photos.some(p => p.id === photoId)) return;
    try {
      localStorage.setItem("m1kaovo-cover-" + albumId, photoId);
      notify("本机封面已切换；公开生效还需修改 data/gallery.js 的 coverId");
    } catch (_) {
      notify("无法保存到浏览器；请直接修改 gallery.js 的 coverId");
    }
    // 不刷新整页，保留“选择封面”展开状态
    document.querySelectorAll("[data-cover-choice]").forEach(btn => {
      const active = btn.dataset.coverChoice === photoId;
      btn.classList.toggle("active", active);
      const photo = album.photos.find(p => p.id === btn.dataset.coverChoice);
      const number = String(album.photos.indexOf(photo) + 1).padStart(2, "0");
      btn.textContent = number + " " + (photo.title || photo.description || "照片") +
        (active ? " · 当前封面" : "");
    });
  }

  function closeImage() {
    if (dialog.open) dialog.close();
  }

  function applyTheme() {
    let theme="paper";
    try { if (localStorage.getItem("m1kaovo-theme")==="night") theme="night"; } catch(_) {}
    document.documentElement.dataset.reader = theme;
    document.getElementById("theme-btn").setAttribute("aria-pressed",String(theme==="night"));
  }

  async function render() {
    const token=++currentRender;
    const {type,id}=routeInfo();
    document.body.classList.toggle("is-article",type==="article");
    document.body.classList.toggle("is-home",type==="home");
    document.querySelectorAll("[data-nav]").forEach(link=>{
      const group=type==="article"||type==="category"?"notes":type==="resume"?"projects":type;
      const selected=link.dataset.nav===group;
      link.classList.toggle("active",selected);
      if(selected) link.setAttribute("aria-current","page");
      else link.removeAttribute("aria-current");
    });
    const nav=document.getElementById("nav");
    nav.classList.remove("open");
    document.getElementById("menu-btn").setAttribute("aria-expanded","false");
    const routes={home,gallery,favorites,notes,fragments,messages,projects,about,resume};
    if(type==="article") await article(id,token);
    else if(type==="category") notes();
    else if(routes[type]) routes[type](id);
    else notFound();
    const articleName=type==="article"?POSTS.find(x=>x.id===id)?.title:"";
    const labels={home:"首页",notes:"笔记",fragments:"摘句",category:"笔记",gallery:"相册",favorites:"收藏",projects:"项目",about:"关于",resume:"个人简历",favorites:"听歌",messages:"留言",about:"关于我"};
    document.title = type==="home"?`${S.name} · 三日月`:`${articleName || labels[type] || "未找到页面"} · ${S.name}`;
    scrollTo({top:0,behavior:"instant"});
    progress();
  }

  function progress() {
    const bar=document.getElementById("read-progress");
    if(!document.body.classList.contains("is-article")){bar.style.width="0%";return;}
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    bar.style.width=`${Math.min(100,Math.max(0,scrollY/max*100))}%`;
  }

  document.addEventListener("click",event=>{

    const fragTypeButton = event.target.closest("[data-frag-type]");
    if (fragTypeButton) {
      fragmentsType = fragTypeButton.dataset.fragType;
      updateFragments();
      return;
    }
    if (event.target.closest("[data-frag-reset]")) {
      fragmentsType = "all";
      fragmentsQuery = "";
      fragmentsOrder = "newest";
      const search = document.getElementById("fragments-search");
      if (search) search.value = "";
      const sort = document.getElementById("fragments-sort");
      if (sort) sort.value = "newest";
      updateFragments();
      return;
    }
    const fragCopyButton = event.target.closest("[data-frag-copy]");
    if (fragCopyButton) {
      copyFragment(fragCopyButton.dataset.fragCopy);
      return;
    }
    const fragImageButton = event.target.closest("[data-frag-image]");
    if (fragImageButton) {
      const item = FRAGMENTS.find(x => String(x.id) === fragImageButton.dataset.fragImage);
      if (item?.image) {
        showPictureInLightbox({
          src: item.image,
          title: item.work || "摘句附图",
          description: item.text,
          credit: item.creator || ""
        }, fragImageButton);
      }
      return;
    }

    const catButton=event.target.closest("[data-cat]");
    if(catButton){
      notesCategory=catButton.dataset.cat;
      notesSubcategory = "all";
      document.querySelectorAll("[data-cat]").forEach(btn=>btn.classList.toggle("active",btn===catButton));
      updateNotes();
    }
    if(event.target.closest("[data-clear]")){
      notesQuery="";notesCategory="all";notesSubcategory="all";
      const input=document.getElementById("notes-search");if(input)input.value="";
      document.querySelectorAll("[data-cat]").forEach(btn=>btn.classList.toggle("active",btn.dataset.cat==="all"));
      updateNotes();
    }
    const coverChoice = event.target.closest("[data-cover-choice]");
    if (coverChoice) {
      saveCoverPreview(coverChoice.dataset.coverAlbum, coverChoice.dataset.coverChoice);
      return;
    }
    const coverReset = event.target.closest("[data-reset-cover]");
    if (coverReset) {
      const album = albumById(coverReset.dataset.resetCover);
      if (album) {
        try { localStorage.removeItem("m1kaovo-cover-" + album.id); } catch (_) {}
        gallery(album.id);
        notify("已恢复 data/gallery.js 中设置的默认封面");
      }
      return;
    }
    const coverCopy = event.target.closest("[data-copy-cover]");
    if (coverCopy) {
      const album = albumById(coverCopy.dataset.copyCover);
      if (album) {
        const setting = `coverId: "${albumCoverId(album)}",`;
        navigator.clipboard.writeText(setting)
          .then(() => notify("已复制 " + setting + "；粘贴到 data/gallery.js"))
          .catch(() => notify("复制失败，请在 data/gallery.js 手动修改 coverId"));
      }
      return;
    }
    const albumPhoto = event.target.closest("[data-album-photo]");
    if (albumPhoto) {
      openAlbumImage(albumPhoto.dataset.photoAlbum, albumPhoto.dataset.albumPhoto, albumPhoto);
      return;
    }
    const pic = event.target.closest("[data-image]");
    if (pic) { openImage(pic.dataset.image, pic); return; }
    const scrollButton=event.target.closest("[data-scroll]");
    if(scrollButton)document.getElementById(scrollButton.dataset.scroll)?.scrollIntoView({behavior:"smooth",block:"start"});
    if(event.target.closest("#copy-link")){
      navigator.clipboard.writeText(location.href).then(()=>notify("文章链接已复制")).catch(()=>notify("请从地址栏复制链接"));
    }
    if(event.target.closest("#print-btn"))window.print();
  });

  document.addEventListener("click", event => {
  const button = event.target.closest("[data-subcat]");
  if (!button) return;

  notesSubcategory = button.dataset.subcat;
  updateNotes();
});

  document.addEventListener("input",event=>{
    if (event.target.id === "fragments-search") {
      fragmentsQuery = event.target.value.trim();
      updateFragments();
      return;
    }
    if(event.target.id==="notes-search"){
      notesQuery=event.target.value.trim();
      updateNotes();
    }
  });

  

  document.addEventListener("change", event => {
    if (event.target.id === "fragments-sort") {
      fragmentsOrder = event.target.value;
      updateFragments();
      return;
    }
  if (event.target.id === "notes-sort") {
    notesSort = event.target.value;
    updateNotes();
  }
});

  document.addEventListener("keydown",event=>{
    if(event.key!=="/"||event.metaKey||event.ctrlKey||event.altKey)return;
    if(["INPUT","TEXTAREA"].includes(document.activeElement?.tagName))return;
    const input=document.getElementById("notes-search");
    if(input){event.preventDefault();input.focus();}
  });

  document.getElementById("lightbox-prev").addEventListener("click", () => stepAlbumPhoto(-1));
  document.getElementById("lightbox-next").addEventListener("click", () => stepAlbumPhoto(1));
  document.addEventListener("keydown", event => {
    if (!dialog.open || !galleryCurrentImage) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); stepAlbumPhoto(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); stepAlbumPhoto(1); }
  });
  let touchStart = null;
  document.getElementById("lightbox-stage").addEventListener("touchstart", event => {
    if (event.touches.length === 1) {
      touchStart = {x:event.touches[0].clientX, y:event.touches[0].clientY};
    }
  }, {passive:true});
  document.getElementById("lightbox-stage").addEventListener("touchend", event => {
    if (!touchStart || !galleryCurrentImage || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      stepAlbumPhoto(dx < 0 ? 1 : -1);
    }
    touchStart = null;
  }, {passive:true});
  document.getElementById("lightbox-close").addEventListener("click",closeImage);
  dialog.addEventListener("click",e=>{if(e.target===dialog)closeImage()});
  dialog.addEventListener("close",()=>{galleryReturnFocus?.focus();});

  document.getElementById("menu-btn").addEventListener("click",()=>{
    const nav=document.getElementById("nav");
    const opened=nav.classList.toggle("open");
    document.getElementById("menu-btn").setAttribute("aria-expanded",String(opened));
  });

  document.getElementById("theme-btn").addEventListener("click",()=>{
    const next=document.documentElement.dataset.reader==="night"?"paper":"night";
    document.documentElement.dataset.reader=next;
    document.getElementById("theme-btn").setAttribute("aria-pressed",String(next==="night"));
    try{localStorage.setItem("m1kaovo-theme",next);}catch(_){}
  });

  window.addEventListener("hashchange",render);
  window.addEventListener("scroll",progress,{passive:true});
  window.addEventListener("resize",progress);
  document.querySelector(".brand-name").textContent=S.name;
  document.getElementById("footer-site-name").textContent=S.name;
  document.getElementById("year").textContent=new Date().getFullYear();
  applyTheme();
  render();
})();
