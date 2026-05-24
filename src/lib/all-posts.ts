import { getCollection, type CollectionEntry } from 'astro:content';

/** 統一的 post 型態：可能來自本機 markdown 或 Notion */
export type AnyPost =
	| (CollectionEntry<'blog'> & { _source: 'markdown' })
	| (CollectionEntry<'notionBlog'> & { _source: 'notion' });

/**
 * 取得所有部落格文章 —— 自動合併本機 markdown 與 Notion 來源。
 * 預設依發布日期由新到舊排序。
 */
export async function getAllPosts(): Promise<AnyPost[]> {
	const [local, notion] = await Promise.all([
		getCollection('blog'),
		getCollection('notionBlog'),
	]);

	const merged: AnyPost[] = [
		...local.map((p) => ({ ...p, _source: 'markdown' as const })),
		...notion.map((p) => ({ ...p, _source: 'notion' as const })),
	];

	// 偵測 slug 衝突（同一個 id 同時出現在兩邊）
	const seen = new Map<string, AnyPost>();
	for (const post of merged) {
		const existing = seen.get(post.id);
		if (existing) {
			console.warn(
				`[all-posts] slug 衝突：「${post.id}」同時存在於 markdown 與 Notion。` +
					`保留 markdown 版本，請改 Notion 那邊的「網址代稱」避免衝突。`,
			);
			if (post._source === 'markdown') seen.set(post.id, post);
		} else {
			seen.set(post.id, post);
		}
	}

	return [...seen.values()].sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
}
