import type { AnyPost } from './all-posts';

export interface DayCell {
	day: number | null;
	posts: AnyPost[];
}

export interface MonthGrid {
	year: number;
	month: number; // 1-12
	posts: AnyPost[];
	cells: DayCell[];
}

const WEEK_LENGTH = 7;
const MAX_ROWS = 6;

function ymKey(date: Date): string {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/** Group posts into reverse-chronological monthly buckets and build calendar grids. */
export function groupPostsByMonth(posts: AnyPost[]): MonthGrid[] {
	const byMonth = new Map<string, AnyPost[]>();
	for (const post of posts) {
		const key = ymKey(post.data.pubDate);
		if (!byMonth.has(key)) byMonth.set(key, []);
		byMonth.get(key)!.push(post);
	}

	const keys = [...byMonth.keys()].sort().reverse(); // newest first

	return keys.map((key) => {
		const [year, month] = key.split('-').map(Number);
		const monthPosts = byMonth.get(key)!.sort(
			(a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
		);

		const postsByDay = new Map<number, AnyPost[]>();
		for (const post of monthPosts) {
			const d = post.data.pubDate.getDate();
			if (!postsByDay.has(d)) postsByDay.set(d, []);
			postsByDay.get(d)!.push(post);
		}

		const firstWeekday = new Date(year, month - 1, 1).getDay(); // 0=Sun
		const daysInMonth = new Date(year, month, 0).getDate();

		const cells: DayCell[] = [];
		for (let i = 0; i < firstWeekday; i++) cells.push({ day: null, posts: [] });
		for (let d = 1; d <= daysInMonth; d++) {
			cells.push({ day: d, posts: postsByDay.get(d) ?? [] });
		}
		while (cells.length < WEEK_LENGTH * MAX_ROWS) cells.push({ day: null, posts: [] });

		return { year, month, posts: monthPosts, cells };
	});
}
