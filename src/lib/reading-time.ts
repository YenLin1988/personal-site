/**
 * 估算閱讀時間（分鐘）。
 * 中文 350 字/分，英文 250 字/分。
 */
export function getReadingTime(text: string): number {
	const stripped = text
		.replace(/```[\s\S]*?```/g, '') // 移除程式碼區塊
		.replace(/`[^`]*`/g, '') // 移除 inline code
		.replace(/!\[.*?\]\(.*?\)/g, '') // 移除圖片
		.replace(/\[(.*?)\]\(.*?\)/g, '$1') // 連結保留文字
		.replace(/[#*_~>\-]+/g, ' '); // 移除常見 markdown 符號

	const chineseChars = (stripped.match(/[一-鿿]/g) || []).length;
	const englishText = stripped.replace(/[一-鿿]/g, ' ');
	const englishWords = englishText.split(/\s+/).filter(Boolean).length;

	const minutes = chineseChars / 350 + englishWords / 250;
	return Math.max(1, Math.round(minutes));
}
