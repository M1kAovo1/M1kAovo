# Fragments｜摘句 · 添加内容指南

## 先看效果
打开项目的 `index.html`，启动 Live Preview 或 Live Server。
点顶部的「摘句」，也可以直接访问 `index.html#fragments`。
这个页面目前是空的，因为你上传的 `data/fragments.js` 只有注释模板。

## 新增第一条摘句
打开 `M1kAovo/data/fragments.js`。
保留外层 `window.FRAGMENTS = [` 和最后的 `];`。
把里面注释的 `/*` 和 `*/` 删除，再修改成自己的内容，例如：

```javascript
window.FRAGMENTS = [
  {
    id: "f001",
    type: "lyrics",
    text: "这里写你收藏的原句",
    translation: "自己的翻译，可以留空",
    work: "歌曲名",
    creator: "歌手名",
    image: "",
    sourceUrl: "",
    date: "2026-11-09",
    tags: ["日语", "音乐"]
  }
];
```

保存（⌘S）并刷新浏览器。

### 每个字段是什么
- `id`：每条独一无二，例如 `f001`、`f002`
- `type`：`lyrics` 歌词、`book` 书摘、`anime` 动漫台词、`personal` 自己的话
- `text`：原句，换行用 `\n`，例如 `"第一行\n第二行"`
- `translation`：自己的翻译；没有就填 `""`
- `work`：歌曲、书或作品的名字
- `creator`：歌手或作者
- `image`：图片文件位置；没有就填 `""`
- `sourceUrl`：公开的原始出处链接（https://...）；没有就填 `""`
- `date`：自己记录该摘句的日期
- `tags`：标签，放在 `[]` 内，可以写多个

## 如何放图片
1. 用 Mac 访达打开 `M1kAovo/assets/fragments/`。
2. 把照片或歌词截图复制进去，例如 `f001.jpg` 或 `f001.webp`。
3. 将对应摘句的 `image` 改成 `"assets/fragments/f001.jpg"`。
4. 保存、刷新，图片就显示在这条摘句下方；点击可放大。
5. 支持长图，默认完整显示，不会强行裁切。

## 如何增加第 2 条
在第 1 条对象的 `}` 后面加逗号 `,`，再贴一个新 `{...}`，并将 id 改成 `f002`。
注意：JS 使用英文引号、英文逗号；不要在 `[...]` 外面添加内容。

## 这次改了哪些文件
- `index.html`：引入 `data/fragments.js`、`fragments.css` 并增加顶部「摘句」菜单
- `app.js`：新增 `#fragments` 页面、筛选、搜索、排序、图片放大、复制
- `fragments.css`：摘句专属样式（包括手机端、深色模式）
- `styles.css`：只停掉首页 SVG 插画的上下浮动动画
- `assets/fragments/`：新图片目录（没有放任何你的私人图片）

没有改动 `music.js`、`music-global.css`、`data/playlist.js`、
`data/posts.js`、`data/gallery.js`、文章正文或相册图片、音频文件。

## 后面换成你挑选的精美图片
本次没有增画 SVG，也没有塞入不知道版权的图片。
首页背景、夜行列车、月光信纸、极光与海、唱片视觉的图片替换
留到你选好照片之后再做，避免破坏这份已经可以工作的版本。

## 公网发布前的提醒
项目里有本地 MP3。将整个项目上传到公开的 GitHub Pages，
也等于把这些音乐文件公开提供下载；购买或订阅音乐通常不包含公开传播授权。
建议正式公开时先去掉无传播许可的 MP3，并改用官方允许的嵌入播放器
或具有公开分发许可的音频。个人本地预览可以继续保留现有音乐。
