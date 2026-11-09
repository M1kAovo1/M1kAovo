/*
 * 相册数据：M1kAovo/data/gallery.js
 * 把图片文件放在 assets/gallery/<album-id>/ 后，
 * 在对应 photos 数组中登记；每张图片的 id 不可重复。
 *
 * coverId: null  -> 第一张图片做相册封面
 * coverId: "xx"  -> 使用该 id 对应的图片做封面
 * ratio: "1 / 1" 或 "3 / 4" 或 "16 / 9" 等 -> 内页缩略图框比例
 *
 * 下方 GALLERY 是旧首页的四张插画，先保留以免影响首页。
 */
window.GALLERY = [
  {
    id: "harbor",
    title: "港口与夜色",
    src: "assets/gallery/harbor.svg",
    category: "插画",
    description: "夜晚的海岸与新月"
  },
  {
    id: "train",
    title: "归途",
    src: "assets/gallery/train.svg",
    category: "插画",
    description: "月下归途"
  },
  {
    id: "desk",
    title: "桌灯",
    src: "assets/gallery/desk.svg",
    category: "插画",
    description: "书桌与台灯"
  },
  {
    id: "water",
    title: "一点月光",
    src: "assets/gallery/water.svg",
    category: "插画",
    description: "海面上的月光"
  }
];

/* 五个相册：先放少量真实存在的示例图片，其余由你自己慢慢添加 */
window.GALLERY_ALBUMS = [
  {
    id: "music",
    title: "网易云封面",
    ratio: "1 / 1",
    coverId: null,
    photos: [
      {
        id: "music-01",
        title: "Fantasia Sonata Reflection",
        src: "assets/gallery/music/covers/Fantasia Sonata Reflection.jpg",
        description: "",
        credit: ""
      },

      {
        id: "music-02",
        title: "Fantasia Sonata Next Ouverture",
        src: "assets/gallery/music/covers/Fantasia Sonata Next Ouverture.jpg",
        description: "",
        credit: ""
      },

      {
        id: "music-03",
        title: "Looking Forward",
        src: "assets/gallery/music/covers/Looking Forward.jpg",
        description: "",
        credit: ""
      },

      {
        id: "music-04",
        title: "KiraKira Noel Story",
        src: "assets/gallery/music/covers/KiraKira Noel Story.jpg",
        description: "",
        credit: ""
      },

      {
        id: "music-05",
        title: "Unravelling",
        src: "assets/gallery/music/covers/Unravelling.jpg",
        description: "",
        credit: ""
      },

      {
        id: "music-06",
        title: "憂い桜",
        src: "assets/gallery/music/covers/憂い桜.jpg",
        description: "",
        credit: ""
      }
    ]
  },

  {
    id: "anime",
    title: "动漫美图",
    ratio: "3 / 4",
    coverId: null,
    photos: [
      
    ]
  },

  {
    id: "nature",
    title: "自然",
    ratio: "3 / 4",
    coverId: null,
    photos: [

    ]
  },

  {
    id: "humanities",
    title: "人文",
    ratio: "3 / 4",
    coverId: null,
    photos: [

    ]
  },

  {
    id: "wallpapers",
    title: "电脑壁纸",
    ratio: "16 / 9",
    coverId: "wallpapers-01",
    photos: [
      {
        id: "wallpapers-01",
        title: "London",
        src: "assets/gallery/wallpapers/London_Highlight.jpg",
        description: "",
        credit: ""
      },

      {
        id: "wallpapers-02",
        title: "Northern Lights",
        src: "assets/gallery/wallpapers/northern lights.jpg",
        description: "",
        credit: ""
      },

      {
        id: "wallpapers-03",
        title: "Sky",
        src: "assets/gallery/wallpapers/Swing.png",
        description: "",
        credit: ""
      }
    ]
  }
];
