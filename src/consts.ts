// 全站共用常數。
export const SITE_TITLE = '我的個人網站';
export const SITE_DESCRIPTION = '紀錄我的想法、作品與正在進行的專案。';
export const SITE_AUTHOR = 'Yen';
export const SOCIAL_LINKS = {
	github: 'https://github.com/YenLin1988',
	email: 'mailto:foreverfree90504@gmail.com',
};

/**
 * Giscus 留言系統設定。
 * 設定步驟見 README「啟用留言系統」章節。
 * 在 https://giscus.app 取得 repoId 與 categoryId 後填入下方。
 */
export const GISCUS = {
	repo: 'your-handle/personal-site' as `${string}/${string}`,
	repoId: '', // 例：R_kgDOxxxxxxx
	category: 'Announcements',
	categoryId: '', // 例：DIC_kwDOxxxxxx
	mapping: 'pathname', // 每篇文章用網址路徑對應一個 Discussion
	strict: '1',
	reactionsEnabled: '1',
	emitMetadata: '0',
	inputPosition: 'top' as 'top' | 'bottom',
	theme: 'light',
	lang: 'zh-TW',
	loading: 'lazy' as 'lazy' | 'eager',
};
