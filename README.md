# 個人網站

用 Astro 6 + Tailwind CSS 4 打造的個人網站，包含首頁、部落格、作品集、關於頁。

## 技術棧

- **[Astro 6](https://astro.build/)** — 靜態網站框架
- **[Tailwind CSS 4](https://tailwindcss.com/)** + `@tailwindcss/typography` — 樣式
- **MDX** — 部落格內容（支援在 Markdown 中嵌入元件）
- **TypeScript (strict)** — Content Collections 自動 type-check
- **Noto Sans TC** — 透過 Astro 內建 Google Fonts provider 載入

## 常用指令

| 指令 | 用途 |
| --- | --- |
| `npm run dev` | 啟動開發伺服器（預設 <http://localhost:4321>） |
| `npm run build` | 產出靜態檔到 `dist/` |
| `npm run preview` | 預覽 build 後的網站 |
| `npx astro sync` | 重新產生 content collection 型別 |

## 目錄結構

```
src/
├── assets/            圖片、字型等靜態資源
├── components/        共用元件（Header、Footer、BaseHead⋯）
├── content/
│   ├── blog/          部落格文章（.md / .mdx）
│   └── projects/      作品集條目（.md / .mdx）
├── content.config.ts  Content Collections schema 定義（zod 驗證）
├── layouts/           頁面樣板（Base、BlogPost、ProjectPost）
├── pages/             路由
│   ├── index.astro    首頁
│   ├── about.astro    關於我
│   ├── blog/          /blog 列表與單篇
│   ├── projects/      /projects 列表與單篇
│   └── rss.xml.js     RSS feed
├── styles/global.css  Tailwind 入口 + 全站樣式
└── consts.ts          站名、作者、社群連結
```

## 新增一篇部落格

在 `src/content/blog/` 建一個 `.md` 或 `.mdx`：

```markdown
---
title: '文章標題'
description: '一句話摘要，用在卡片與 SEO。'
pubDate: 2026-05-21
tags: ['筆記', 'web']
# heroImage: ../../assets/some-image.jpg   # 可選
---

內文寫在這裡。可以正常用 Markdown 語法。
```

## 新增一件作品

在 `src/content/projects/` 建一個 `.md`：

```markdown
---
title: '專案名稱'
description: '一句話介紹。'
pubDate: 2026-05-21
tags: ['Astro', 'TypeScript']
repoUrl: 'https://github.com/...'    # 可選
demoUrl: 'https://...'                # 可選
featured: true                        # true 會出現在首頁的「精選作品」
---

詳細說明。
```

## 客製化重點

- **站名／作者／社群連結** — `src/consts.ts`
- **正式網址** — `astro.config.mjs` 的 `site` 欄位（影響 sitemap、RSS、og:url）
- **主色** — `src/styles/global.css` 裡的 `--color-accent`
- **字型** — `astro.config.mjs` 的 `fonts` 陣列

## 啟用留言系統（Giscus）

每篇部落格底部已預留 Giscus 留言區，但要先在 GitHub 設定一次才會生效。
Giscus 把留言存在你 GitHub repo 的 **Discussions** 區，讀者用 GitHub 帳號登入留言，你可以從 GitHub 直接編輯、刪除、釘選、隱藏留言。

### 步驟

1. **將 repo 設為 Public**
   留言可見性 = repo 可見性。私人 repo 沒辦法用 Giscus。

2. **在 repo 啟用 Discussions**
   到 repo 的 **Settings → General → Features** 把 **Discussions** 打勾。

3. **安裝 giscus app 到 repo**
   到 <https://github.com/apps/giscus> 點 **Install**，選你的 repo。

4. **建立留言用的 Discussion 分類（建議）**
   在 repo 的 Discussions 頁面建立一個新 category，命名例如 `Comments`，類型選 **Announcement**（這樣只有你能開新串、訪客只能回覆）。

5. **到 giscus 設定頁拿 4 個值**
   開 <https://giscus.app>，按照頁面填好 repo、分類等選項，往下滾它會印出一段 `<script>`。從那段 script 裡複製 4 個值：
   - `data-repo` → `repo`
   - `data-repo-id` → `repoId`
   - `data-category` → `category`
   - `data-category-id` → `categoryId`

6. **貼到 `src/consts.ts` 的 `GISCUS` 物件**
   填好之後重新跑 `npm run dev`，部落格底部的留言區就會出現。

### 管理留言

從 GitHub repo 的 Discussions 頁面操作即可：

- **回覆** — 直接在 Discussion 串裡回覆，會即時同步到網站
- **刪除留言** — 在留言右上角 ⋯ → Delete
- **隱藏留言** — 在留言右上角 ⋯ → Hide（標記為 spam/off-topic 等）
- **鎖定整串** — 在 Discussion 頁面點 Lock conversation
- **封鎖使用者** — 到 repo Settings → Moderation → Interaction limits 或 Blocked users

> 註：Giscus 沒有 IP 封鎖。如果之後遇到需要封 IP 的鬧版情境，可以再升級成自架後端（會需要重寫這部分）。

## 部署（免費）

推薦 **Cloudflare Pages**：

1. `git init && git add . && git commit -m "init"`
2. 推到 GitHub
3. 到 Cloudflare Pages → Connect to Git → 選 repo
4. Build command: `npm run build`，Output directory: `dist`
5. 部署完成，會拿到 `*.pages.dev` 網址

替代方案：[Vercel](https://vercel.com)、[Netlify](https://netlify.com)、GitHub Pages 都可，設定一樣（build → `dist`）。
