/*
 * 每篇文章的标题、分类、标签、摘要、阅读时长在这里。
 * 正文写在 articles/ 里的独立 HTML 文件中。
 * category: algorithm / math / cs / language / life
 */
window.POSTS = [

{
  id: "oneul-yeogikkaji",
  title: "오늘은 여기까지",
  category: "language",
  subcategory: "Korean",
  tags: ["韩语", "日常", "词汇"],
  teaser: "QWQ",
  reading: "约 3 分钟",
  createdAt: "2026-11-07T11:45:00+08:00",
  file: "articles/oneul-yeogikkaji.html"
},

  {
    "id": "sadou-omotenashi",
    "title": "茶道とおもてなし",
    "category": "language",
    "subcategory": "Japanese",
    "tags": [
      "茶道",
      "日本文化",
      "一期一会"
    ],
    "teaser": "",
    "reading": "",
    "createdAt": "2026-11-06T19:21:49+08:00",
    "file": "articles/sadou-omotenashi.html"
  },

  {
    "id": "ABC184F",
    "title": "ABC184F - Programming Contest",
    "category": "algorithm",
    "subcategory": "abc",
    "tags": [
      "折半搜索", "二分"
    ],
    "teaser": "",
    "reading": "",
    "createdAt": "2026-11-06T16:04:42+08:00",
    "file": "articles/ABC184F.html"
  },

  {
    id: "lagrange",
    title: "拉格朗日乘子",
    category: "math",
    tags: ["多元微积分", "优化", "数学"],
    teaser: "e",
    reading: "约 5 分钟",
    file: "articles/lagrange.html"
  }
  
];

window.CATEGORIES = [
  {id: "all", label: "全部"},
  {id: "algorithm", label: "算法"},
  {id: "math", label: "数学"},
  {id: "cs", label: "计算机知识"},
  {id: "language", label: "语言"},
  {id: "life", label: "摸鱼"},
  {id: "other", label: "其他"}
];

window.SUBCATEGORIES = {
  algorithm: [
    { id: "abc", label: "ABC" },
    { id: "cf", label: "CF" },
    { id: "nowcoder", label: "牛客周赛" },
    { id: "regional", label: "ICPC区域赛" },
    { id: "invitational", label: "ICPC邀请赛"},
    { id: "many", label: "多校"},
    { id: "abroad", label: "国外"}
  ],

  language: [
    { id: "English", label: "英语"},
    { id: "Japanese", label: "日语"},
    { id: "Korean", label: "韩语"}
  ],

  math: [
    { id: "linear_algebra", label: "线性代数"},
    { id: "probability", label: "概率论"}
  ]
};