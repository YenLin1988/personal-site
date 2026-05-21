import type { CollectionEntry } from 'astro:content';

/**
 * 根據標籤重疊度找相關文章。
 * 演算法：標籤交集數越多排越前；同重疊數則 pubDate 較新者優先。
 */
export function getRelatedPosts(
	current: CollectionEntry<'blog'>,
	all: CollectionEntry<'blog'>[],
	limit = 3,
): CollectionEntry<'blog'>[] {
	const currentTags = new Set(current.data.tags ?? []);
	if (currentTags.size === 0) {
		// 沒有標籤，退而求其次：用最新文章
		return all.filter((p) => p.id !== current.id).slice(0, limit);
	}

	type Scored = { post: CollectionEntry<'blog'>; score: number };
	const scored: Scored[] = all
		.filter((p) => p.id !== current.id)
		.map((p) => {
			const overlap = (p.data.tags ?? []).filter((t) => currentTags.has(t)).length;
			return { post: p, score: overlap };
		})
		.filter((s) => s.score > 0);

	scored.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		return b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf();
	});

	return scored.slice(0, limit).map((s) => s.post);
}
