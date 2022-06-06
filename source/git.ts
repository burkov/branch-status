import shell from 'shelljs';

export const getIssues = (): string[] | null => {
	const { code, stdout } = shell.exec('git branch -r --sort=committerdate', { silent: true, fatal: true });
	if (code !== 0) return null;

	const issues = stdout
		.split('\n')
		.flatMap((line) => line.match(/\w{2,4}-\d{1,6}/gi) || [])
		.map((x) => x.toUpperCase());
	return [...new Set(issues)];
};
