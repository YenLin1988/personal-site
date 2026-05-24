// scripts/sync-notion.mjs
// 從 Notion 抓「狀態 = 發布」的文章，轉成 markdown 寫到 src/content/notion-blog/
// 在 build 與 dev 前自動執行（透過 prebuild / predev npm hook）

import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import fs from 'node:fs/promises';
import path from 'node:path';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
// 沒設 env var 時用這個預設（資料庫 ID 不是 secret，可以放在 git）
const DATA_SOURCE_ID =
	process.env.NOTION_BLOG_DATA_SOURCE_ID ||
	'9cdfc63a-ad4f-48ab-9ff1-deb58f010bb7';
const OUTPUT_DIR = path.resolve('src/content/notion-blog');

function slugify(s) {
	const stripped = s
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[̀-ͯ]/g, '');
	// 保留中文、英數、連字
	return stripped
		.replace(/[^一-龥\w\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-');
}

const plainText = (richText) =>
	Array.isArray(richText) ? richText.map((r) => r.plain_text || '').join('') : '';

const readTitle = (p) => (p?.type === 'title' ? plainText(p.title) : '');
const readText = (p) => (p?.type === 'rich_text' ? plainText(p.rich_text) : '');
const readDate = (p) => (p?.type === 'date' && p.date ? p.date.start : null);
const readMultiSelect = (p) =>
	p?.type === 'multi_select' ? p.multi_select.map((o) => o.name) : [];

async function main() {
	// 每次都清空輸出資料夾 —— 這樣從 Notion 撤掉的文章也會從網站消失
	await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
	await fs.mkdir(OUTPUT_DIR, { recursive: true });

	if (!NOTION_TOKEN || !DATA_SOURCE_ID) {
		console.log(
			'[notion] NOTION_TOKEN 或 NOTION_BLOG_DATA_SOURCE_ID 未設定 — 跳過 Notion 同步',
		);
		return;
	}

	const notion = new Client({ auth: NOTION_TOKEN });
	const n2m = new NotionToMarkdown({ notionClient: notion });

	let cursor;
	let total = 0;

	do {
		const response = await notion.dataSources.query({
			data_source_id: DATA_SOURCE_ID,
			filter: { property: '狀態', select: { equals: '發布' } },
			sorts: [{ property: '發布日期', direction: 'descending' }],
			start_cursor: cursor,
			page_size: 100,
		});

		for (const page of response.results) {
			if (page.object !== 'page' || !('properties' in page)) continue;
			const props = page.properties;

			const title = readTitle(props['標題']);
			const description = readText(props['摘要']);
			const pubDate = readDate(props['發布日期']);
			const updatedDate = readDate(props['最後更新']);
			const tags = readMultiSelect(props['標籤']);
			const customSlug = readText(props['網址代稱']).trim();

			if (!title || !pubDate) {
				console.warn(`[notion] 跳過 page ${page.id}: 缺 標題 或 發布日期`);
				continue;
			}

			const slug = customSlug || slugify(title);
			if (!slug) {
				console.warn(`[notion] 跳過 page ${page.id}: 標題無法產生 slug`);
				continue;
			}

			const mdBlocks = await n2m.pageToMarkdown(page.id);
			const mdString = n2m.toMarkdownString(mdBlocks);
			const body = (mdString.parent ?? '').trim();

			const fmLines = [
				'---',
				`title: ${JSON.stringify(title)}`,
				`description: ${JSON.stringify(description || title)}`,
				`pubDate: ${pubDate}`,
			];
			if (updatedDate) fmLines.push(`updatedDate: ${updatedDate}`);
			if (tags.length) fmLines.push(`tags: ${JSON.stringify(tags)}`);
			fmLines.push('---', '');

			const fileContent = fmLines.join('\n') + body + '\n';
			await fs.writeFile(path.join(OUTPUT_DIR, `${slug}.md`), fileContent);
			console.log(`[notion] ✓ ${slug}.md  (${title})`);
			total++;
		}

		cursor = response.next_cursor;
	} while (cursor);

	console.log(`[notion] 完成 — 同步 ${total} 篇已發布文章`);
}

main().catch((e) => {
	console.error('[notion] 同步失敗:', e);
	process.exit(1);
});
