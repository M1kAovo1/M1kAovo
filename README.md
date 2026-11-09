# M1kAovo · 三日月

个人网站的完整初版。月夜书房、算法与数学笔记、计算机学习、语言、音乐收藏与图片相册。

目前使用 **HTML + CSS + 原生 JavaScript**。没有 React、Node.js、数据库、账号系统或远程依赖。只要一个本地网页服务器，就能在 Mac 的 VS Code 里开发与预览。适合先学会网页工作原理，再决定要不要升级到 Astro + Markdown。

**网站内的技术文章都标注为“内容示范”，并非站主的真实比赛、奖项、科研或学习成果。** 公开发布前请改成自己的内容。

---

## 一、第一次运行：Mac + VS Code

你之前下载的 `m1ka-studio` 是旧版本，新的项目文件夹叫 `M1kAovo`，建议分开放：

```text
个人网站/
├── m1ka-studio/      ← 上次的旧版，可以保留作对照
└── M1kAovo/          ← 这次的新版本，之后主要维护它
```

请依次操作：

1. 下载 `M1kAovo.zip`，用 Finder 双击解压，得到 **M1kAovo** 文件夹。
2. 把 `M1kAovo` 整个文件夹移到你创建的 `个人网站` 文件夹里面。
3. 打开 **VS Code → File（文件）→ Open Folder（打开文件夹）**。
4. 选择最里面的 **`M1kAovo`** 文件夹。VS Code 左边应能看到 `index.html`、`styles.css`、`app.js` 等文件。
5. 在左侧 Extensions / 扩展面板，搜索 **Live Server**，认准作者 **Ritwick Dey**，安装。
6. 右键 `index.html` → **Open with Live Server**，或者打开该文件后点编辑器右下角 **Go Live**。
7. 浏览器会打开类似 `http://127.0.0.1:5500/` 的地址。你应看到深蓝色、弯月和书房插画的首页。
8. 在 `data/site.js` 里修改首页的 `heroNote`，按 **⌘S** 保存，浏览器应该会自动更新。

扩展地址：https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer

### 不想装 Live Server，也有第二个方法

如果你的 Mac 已经有 Python 3，在 VS Code 中打开 Terminal（终端），确认当前位置就是 `M1kAovo` 文件夹，然后运行：

```bash
python3 -m http.server 8000
```

在浏览器打开 `http://localhost:8000/`。每次保存代码后手动刷新一下网页。要停止服务，回终端按 `Control + C`。

**请尽量不要直接双击 `index.html` 在 `file://` 地址下浏览。** 首页可能出现，但文章正文是用 `fetch()` 读取独立文件的，浏览器安全限制可能导致本地文件读取失败。Live Server 或 Python 本地服务器都可以解决。

---

## 二、文件结构和每个文件的作用

```text
M1kAovo/
├── index.html               # HTML 入口，顶部导航、页面容器、脚本加载
├── styles.css               # 所有外观：字体、颜色、排版、手机适配
├── app.js                   # 交互：页面切换、分类搜索、文章加载、相册灯箱等
│
├── data/
│   ├── site.js              # 名字、首页文字、自我介绍、公开联系方式
│   ├── posts.js             # 文章目录：文章标题、分类、简介、正文文件路径
│   └── gallery.js           # 相册目录：图片路径、名称、说明
│
├── articles/
│   ├── hld.html             # 树链剖分：一篇可阅读的内容示范
│   ├── virtual-tree.html    # 虚树笔记
│   ├── lagrange.html        # 数学笔记
│   ├── false-sharing.html   # 计算机体系结构笔记
│   ├── mikazuki.html        # 日语词语笔记
│   └── playlist.html        # 音乐收藏示范
│
├── assets/
│   ├── ui/
│   │   ├── moonroom.svg     # 首页原创月夜书房插画
│   │   └── favicon.svg      # 浏览器标签页弯月图标
│   └── gallery/
│       ├── harbor.svg       # 原创示意插画 1
│       ├── train.svg        # 原创示意插画 2
│       ├── desk.svg         # 原创示意插画 3
│       └── water.svg        # 原创示意插画 4
│
├── .vscode/
│   └── extensions.json      # 推荐的 VS Code 扩展
├── .gitignore               # 不上传的私人、临时文件规则
├── .nojekyll                # 让 GitHub Pages 按原样发布静态文件
└── README.md                # 本使用手册
```

### 这些文件怎么连在一起？

浏览器首先打开 **`index.html`**。它负责引用 `styles.css` 和 JavaScript。

- `styles.css` 决定网页的颜色、字号、位置、留白和手机布局。
- `data/site.js` 提供个人资料。
- `data/posts.js` 告诉网页“有哪几篇文章、文件名是什么”。
- `data/gallery.js` 告诉网页“图库有哪些图片”。
- `app.js` 读取这些资料、响应按钮点击、展示首页/笔记/相册等页面。
- 你打开某篇文章时，`app.js` 会从 `articles/` 读取那个 HTML 文件。
- `assets/` 负责保存 SVG、照片、插画等静态素材。

**以后维护网站，大多数时候只改 `data/site.js`、`data/posts.js`、`articles/` 和 `assets/gallery/`。**

---

## 三、先改成你自己的资料

### 首页

用 VS Code 打开 `data/site.js`。例如：

```js
window.SITE = {
  name: "M1kAovo",
  heroTitle: "敲完最后一行代码<br>就去看看今晚的月亮",
  heroNote: "这里收着我的算法笔记、数学草稿……",
  aboutIntro: "你好，我是 M1kAovo……",
  // ...
};
```

文字可以直接修改。`<br>` 表示在首页标题中主动换行。

名字会同步到网页导航和底部。网站其他位置可能仍有写在正文里的 M1kAovo，如以后更名，可以用 VS Code 的 **⌘Shift+F** 全项目搜索名字后统一修改。

浏览器标签页初始标题和页面描述在 `index.html` 的 `<title>` 和 `<meta name="description">`，也可以一起改。

### 颜色与布局

用 VS Code 打开 `styles.css`。

文件开头的 `:root` 里列出了主要颜色，例如：

```css
--navy: #172b3a;       /* 首页深海蓝 */
--gold: #dfb687;       /* 金色 */
--paper: #f8f5ed;      /* 正文纸张背景 */
--text: #233b42;       /* 正文字色 */
```

改动任何值，保存后看浏览器效果。不建议一次把所有样式都改掉；先从文字、导航、颜色开始。

---

## 四、怎么添加第一篇真正的笔记？

这里让**一篇文章对应一个独立 HTML 文件**。以后数量多了，可以考虑转成 Markdown / Astro。现在先把 HTML 看懂更重要。

假设要新增一篇「线段树合并」笔记：

### 第一步：创建正文文件

在 `articles/` 里新建 `segment-tree-merge.html`。

填入下面这段结构：

```html
<p class="lead">这里写你理解线段树合并的切入点，尽量来自真实做题过程</p>

<h2>什么时候需要合并</h2>
<p>在这里写题目背景、需要维护的数据结构</p>

<h2>核心过程</h2>
<p>解释不同节点的合并方式和正确性</p>

<h2>代码实现</h2>
<pre><code>// 在这里写自己验证过的 C++ 代码
</code></pre>

<h2>复盘</h2>
<p>写下自己遇到的 bug 或可以改进的地方</p>
```

这一文件只写**文章内容本身**，不用再写 `<html>`、`<head>`、`<body>`。

注意：HTML 正文中要显示 C++ 的 `<`、`>`、`&` 时，应分别写成 `&lt;`、`&gt;`、`&amp;`。可以参考 `articles/hld.html` 的完整代码块。

### 第二步：登记文章

打开 `data/posts.js`，在 `window.POSTS = [ ... ]` 数组里增加：

```js
{
  id: "segment-tree-merge",
  title: "线段树合并：节点与复杂度",
  category: "algorithm",
  tags: ["C++", "线段树合并"],
  teaser: "记录自己的理解和实现",
  reading: "约 8 分钟",
  state: "正在整理",
  file: "articles/segment-tree-merge.html"
},
```

注意：

- `id` 必须唯一，尽量使用英文小写和连字符。
- 对象之间用逗号隔开。
- `file` 必须与第一步的文件路径完全一致。
- `state` 可以写「正在整理」「已完成」或其他真实状态。
- 新文章会自动出现在「笔记」分类下，首页“最近整理”默认展示列表的前三篇。
- 如果希望文章排在最前面，把新对象放到数组最前面。

### 分类 ID

| 填在 category 里的值 | 网页显示 |
|---|---|
| `algorithm` | 算法竞赛 |
| `math` | 数学 |
| `cs` | 计算机 |
| `language` | 语言 |
| `life` | 兴趣 |

第一版的搜索会匹配**文章标题、摘要、标签、分类**。暂时没有为正文做全文索引。

---

## 五、相册怎么加自己的图片？

1. 把你拍摄的照片、自己的插画、或者有使用许可的图片，复制到 `assets/gallery/`。
2. 最好先压缩成 `.webp` 或 `.avif`，再命名为清晰的英文文件名，如 `winter-night.webp`。
3. 打开 `data/gallery.js`，按照已有条目添加新记录：

```js
{
  id: "winter-night",
  title: "雪后的夜晚",
  category: "摄影",
  src: "assets/gallery/winter-night.webp",
  description: "照片内容的简短说明与拍摄地点",
  layout: "regular"
},
```

4. 保存，刷新图库；点击照片就能放大。
5. `layout` 为 `wide` 或 `regular`，用于区分展示格式；目前网格的布局主要由 CSS 决定。

照片放在独立文件夹里，在 VS Code 左侧收起 `assets/` 即可隐藏整列图片，不会像默认 Obsidian 根目录附件那样占满文件列表。

**提醒：** 不要把自己喜欢的画师作品直接搬上个人公开网站。优先放自己的照片、原创图，或获得允许的插画，必要时写清作者、授权和来源。

---

## 六、QQ 群、音乐播放器、个人简历

### QQ 群

`data/site.js` 里预留了 `contact.qqGroup`。以后群稳定后，再填你想公开的群入口链接。现阶段不会公开任何群号，防止无关陌生人直接涌入。

### 音乐播放器

当前只做了音乐收藏页面，没有加载或自动播放音乐。这是刻意留下来的后续功能。

浏览器常会限制未经访客交互的**有声音自动播放**。以后的实现更适合让访客点击唱片或播放按钮再随机选曲。公开播放还要确保音乐文件使用权和版权符合要求。

### 简历

「项目 → 个人简历」里是清楚标明的空白模板，点打印按钮可以生成 PDF。请先填上真实学校、项目、竞赛经历和联系信息，检查无误后再对外分享。

---

## 七、怎样把网站放到 GitHub 上？

建议先使用 **GitHub Desktop**，更容易看清每次文件变化。

1. 注册 GitHub 账号：https://github.com/
2. 安装 GitHub Desktop：https://desktop.github.com/
3. 打开 GitHub Desktop 登录账号。
4. 选择 **File → Add Local Repository…**，找到你电脑上的 `个人网站/M1kAovo/`。
5. 如果提示该文件夹还没有 Git 仓库，就选择 **Create a Repository Here** 初始化。
6. 在 Changes 查看准备上传的文件，在 Summary 输入 `First version of my personal website`。
7. 点击 **Commit to main**，在本地保存一次版本记录。
8. 点击 **Publish repository**，将它上传到 GitHub。仓库名称建议用 `m1kaovo`，初学阶段公开仓库即可。

Git 有三个最值得先掌握的概念：

- **Repository（仓库）**：项目文件和版本历史
- **Commit（提交）**：给当前修改保存一个记录（先在本地）
- **Push（推送）**：把已保存的修改上传到 GitHub

以后修改文章或插图，重复：保存文件 → GitHub Desktop 中查看变更 → Commit → Push origin。

### GitHub Pages 免费发布

成功上传之后，打开 GitHub 网页里的 `m1kaovo` 仓库：

1. 进入 **Settings → Pages**。
2. 在 Build and deployment 找到 Source，选择 **Deploy from a branch**。
3. Branch 选 **main**，目录选 **/(root)**。
4. 点击 Save，等部署完成。

如果 GitHub 用户名是 `exampleuser`，仓库是 `m1kaovo`，最终网址一般类似：

```text
https://exampleuser.github.io/m1kaovo/
```

这只是网址格式示例，要用你自己的账号名。

**整个项目可以直接发布。** CSS、图片和文章文件都用相对路径，在仓库子目录网址下也能正常工作，不需要改路径。

官方参考：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

### 关于国内访问

GitHub Pages 在中国大陆的访问情况可能因地区、运营商、时间而不同，不能保证人人直连稳定。你先用它免费上线；以后再让不同网络的朋友实测。确定主要访客群后，再考虑自定义域名、境内托管和备案等事。

---

## 八、公开前检查

- [ ] 首页介绍和网名已检查
- [ ] 所有保留的“内容示范”都清楚标注，或已换成自己的真实笔记
- [ ] 没有虚构学校、奖项、项目成绩
- [ ] 没有 API Key、密码、私人聊天记录、未经授权的图片
- [ ] 在手机上看过主要页面
- [ ] 点击文章能正常打开正文
- [ ] 图库点击放大和关闭正常
- [ ] 在 GitHub Pages 的实际 URL 上检查所有图片和文章路径

这次还没有引入音乐自动播放、评论、登录、访问统计、Node.js 框架。这样第一版就能长期运行，而且方便一点点学习。

如果后来有几十篇以上文章，优先考虑迁移到 Astro / Markdown，并加入 KaTeX 公式、代码高亮和 RSS。第一版保留着也很有价值，可以看到自己从 HTML、CSS、JavaScript 开始的过程。

---

## 九、遇到问题时

**首页是一片空白**：检查 VS Code 是否打开了正确文件夹；打开浏览器开发者工具 Console 查看红色报错。

**首页能看，文章打不开**：常见原因是直接双击 `index.html` 使用 `file://`，或者新文章的 `file` 路径写错。用 Live Server 访问 `http://...` 的网页后再试。

**GitHub Pages 404**：确认仓库已推送、分支 `main`、Pages 目录 `/(root)`、项目根目录有 `index.html`，等待发布完成。

**图片不显示**：检查图片文件名大小写和 `data/gallery.js` 中的 `src` 是否一致，路径不要写成本机的 `/Users/...`。

**改了没效果**：按 `⌘S` 保存，再刷新页面；确认浏览器里打开的是新项目，不是旧的 `m1ka-studio`。

**想完全保留这个主题，但自己换颜色**：只改 `styles.css` 的色彩变量即可。

---

请慢慢完善它。先把第一篇真实笔记写好，比同一天填满所有分类更重要。
