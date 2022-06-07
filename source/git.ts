import shell from 'shelljs';

export interface RepoIssue {
	issueId: string;
	branches: string[];
}

const masterCommits = (path: string) => {
	const { code, stdout } = shell.exec(
		`(cd "${path}" && git log --first-parent origin/master --oneline | head -n 100)`,
		{
			silent: true,
			fatal: true,
		},
	);
	return code !== 0 ? [] : stdout.split('\n');
};

const branches = (path: string) => {
	const { code, stdout } = shell.exec(`(cd "${path}" && git branch -r --sort=committerdate)`, {
		silent: true,
		fatal: true,
	});
	return code !== 0 ? [] : stdout.split('\n');
};

const parseIssueIds = (s: string): string[] => {
	return (s.match(/\w{3,4}-\d{2,6}/gi) ?? []).map((e) => e.toUpperCase().trim());
};

export const issuesFromRepo = (path: string): RepoIssue[] => {
	const devMode = false; //__dirname.includes('IdeaProjects/branch-status');

	const idToBranches = new Map<string, Set<string>>();
	for (const branch of branches(path)) {
		for (const issueId of parseIssueIds(branch)) {
			if (!idToBranches.has(issueId)) idToBranches.set(issueId, new Set());
			idToBranches.get(issueId)!.add(branch);
		}
	}

	const result: RepoIssue[] = [];
	idToBranches.forEach((branches, issueId) => {
		result.push({ issueId, branches: [...branches].sort() });
	});

	new Set(masterCommits(path).flatMap(parseIssueIds)).forEach((issueId) => {
		if (!idToBranches.has(issueId)) result.push({ issueId, branches: ['master'] });
	});

	return devMode ? result.slice(1, 5) : result;
};
