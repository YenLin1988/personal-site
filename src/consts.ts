// 全站共用常數。
export const SITE_TITLE = '我的個人網站';
export const SITE_DESCRIPTION = '紀錄我的想法、作品與正在進行的專案。';
export const SITE_AUTHOR = 'Yen';
export const SOCIAL_LINKS = {
	github: 'https://github.com/YenLin1988',
	email: 'mailto:foreverfree90504@gmail.com',
};

/**
 * 電子報訂閱設定（用 Buttondown）。
 * 1. 到 https://buttondown.com 註冊免費帳號
 * 2. 把你的 username 填到下方
 * 3. 留空字串會顯示「尚未啟用」提示，不會顯示表單
 */
export const NEWSLETTER = {
	buttondownUsername: '', // 例：'yen'
};

/**
 * Cloudflare Web Analytics token。
 * 1. 部署到 Cloudflare Pages 之後到 https://dash.cloudflare.com/?to=/:account/web-analytics
 * 2. Add a site，取得 beacon token
 * 3. 填到下方就會開始記錄
 */
export const CF_ANALYTICS_TOKEN = '1d3901bed07f4a76ae10f3efa1995f55';

/**
 * Giscus 留言系統設定。
 * 設定步驟見 README「啟用留言系統」章節。
 * 在 https://giscus.app 取得 repoId 與 categoryId 後填入下方。
 */
export const GISCUS = {
	repo: 'YenLin1988/personal-site' as `${string}/${string}`,
	repoId: 'R_kgDOSjvkyQ',
	category: 'Announcements',
	categoryId: 'DIC_kwDOSjvkyc4C9hfm',
	mapping: 'pathname', // 每篇文章用網址路徑對應一個 Discussion
	strict: '1',
	reactionsEnabled: '1',
	emitMetadata: '0',
	inputPosition: 'top' as 'top' | 'bottom',
	theme: 'light',
	lang: 'zh-TW',
	loading: 'lazy' as 'lazy' | 'eager',
};
