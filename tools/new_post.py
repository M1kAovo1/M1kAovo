
from pathlib import Path
from datetime import datetime
import json
import re

root = Path(__file__).resolve().parent.parent
posts_file = root / "data" / "posts.js"
articles_dir = root / "articles"

choices = {
    "1": "algorithm",
    "2": "math",
    "3": "cs",
    "4": "language",
    "5": "life",
    "6": "other",
}

print("分类：")
print("1 算法 / 2 数学 / 3 计算机知识")
print("4 语言 / 5 生活 / 6 其他")

title = input("标题：").strip()
slug = input("英文 ID（例如 my-note）：").strip().lower()
category = choices.get(input("分类编号：").strip())

tag_input = input("标签（逗号分隔，可留空）：")
tags = [
    tag.strip()
    for tag in re.split(r"[,，]", tag_input)
    if tag.strip()
]

if (
    not title
    or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug)
    or not category
):
    raise SystemExit("输入无效，请检查标题、ID 和分类编号")

source = posts_file.read_text(encoding="utf-8")
marker = "window.POSTS = ["

if marker not in source:
    raise SystemExit("没有找到 window.POSTS = [")

if f'id: "{slug}"' in source or f'"id": "{slug}"' in source:
    raise SystemExit("文章 ID 已存在")

articles_dir.mkdir(parents=True, exist_ok=True)
article_file = articles_dir / f"{slug}.html"

if article_file.exists():
    raise SystemExit("同名文章文件已经存在")

# 获取当前 Mac 的本地日期、时间及 UTC 偏移
created_at = datetime.now().astimezone().isoformat(
    timespec="seconds"
)


# 根据一级分类选择二级归属
subcategory = ""

if category == "algorithm":
    groups = {
        "1": "abc",
        "2": "cf",
        "3": "nowcoder",
        "4": "regional",
    }

    print("\n算法归属：")
    print("1 ABC / 2 CF / 3 牛客周赛 / 4 ICPC区域赛")
    number = input("归属编号：").strip()

    if number not in groups:
        raise SystemExit("归属编号无效")

    subcategory = groups[number]

elif category == "language":
    groups = {
        "1": "English",
        "2": "Japanese",
        "3": "Korean",
    }

    print("\n语言归属：")
    print("1 英语 / 2 日语 / 3 韩语")
    number = input("归属编号：").strip()

    if number not in groups:
        raise SystemExit("归属编号无效")

    subcategory = groups[number]

post = {
    "id": slug,
    "title": title,
    "category": category,
    "subcategory": subcategory,
    "tags": tags,
    "teaser": "",
    "reading": "",
    "createdAt": created_at,
    "file": f"articles/{slug}.html",
}

entry = json.dumps(post, ensure_ascii=False, indent=2)
entry = "\n".join("  " + line for line in entry.splitlines())

new_source = source.replace(
    marker, marker + "\n" + entry + ",", 1
)

article_file.write_text(
    "<!-- 在这里写自己的正文 -->\n",
    encoding="utf-8",
)

posts_file.write_text(new_source, encoding="utf-8")

print(f"已创建：{article_file.name}")
print(f"创建时间：{created_at}")

