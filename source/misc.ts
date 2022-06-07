export const substringAfter = (s: string, sub: string): string => {
	const i = s.indexOf(sub);
	return s.slice(i + sub.length);
};

export const truncate = (s: string, n: number): string => {
	if (s.length <= n) return s;
	return s.slice(0, n) + '...';
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(() => resolve(undefined), ms));
