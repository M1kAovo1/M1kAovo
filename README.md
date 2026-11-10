# M1kAovo 🌙

个人网站，使用 HTML、CSS、JavaScript 开发。

## 1. 主要文件

| 文件                  | 用途         |
| ------------------- | ---------- |
| `index.html`        | 网页入口       |
| `styles.css`        | 网站样式、颜色与排版 |
| `app.js`            | 页面交互与内容加载  |
| `data/site.js`      | 首页、个人介绍    |
| `data/posts.js`     | 笔记目录、分类与标签 |
| `data/gallery.js`   | 相册配置       |
| `data/fragments.js` | 摘句、歌词、书摘   |
| `data/playlist.js`  | 音乐列表       |
| `articles/`         | HTML 笔记正文  |
| `assets/`           | 图片、背景及其他素材 |

## 2. 本地预览

VS Code 打开项目文件夹，使用 Live Preview / Live Server。

也可以在项目根目录运行：

`python3 -m http.server 8000`

浏览器访问：`http://127.0.0.1:8000/`

结束服务器：`Control + C`

## 3. 添加内容

**新建笔记**

`python3 tools/new_post.py`

自动创建 `articles/` 中的正文文件，并更新 `data/posts.js`。

**新增摘句**

直接编辑 `data/fragments.js`。

**新增相册图片**

原图放入 `assets/gallery/`，然后修改 `data/gallery.js`。

生成 WebP 缩略图：

`.venv/bin/python tools/build_gallery_images.py`

## 4. GitHub 更新

在项目根目录依次运行：

```bash
git status --short
git add -A
git diff --cached --stat
git commit -m "Update website"
git push origin main
```

其他常用命令：

* `git diff`：查看具体修改
* `git remote -v`：查看远程仓库
* `git log -1 --oneline`：查看最近一次提交
* `git pull --ff-only origin main`：拉取远程更新

网站通过 GitHub Pages / Cloudflare Pages 部署，使用 `main` 分支。

## 5. 备忘

* 正文 HTML 使用 `<h2>`、`<p>`、`<pre><code>` 等标签。
* 图片、文章路径注意大小写。
* 修改代码后先本地预览，再提交。
* `.gitignore` 用于忽略不需要 Git 追踪的文件。
* 不要提交密码、私钥、Token 或私人资料。
* GitHub Pages 部署完成后，刷新浏览器查看更新。

---

