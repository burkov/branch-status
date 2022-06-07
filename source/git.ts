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
	return code !== 0
		? []
		: stdout
				.split('\n')
				.map((e) => e.trim())
				.filter((e) => e);
};

export const parseIssueIds = (s: string): string[] => {
	return (s.match(/\w{3,4}-\d{2,6}/gi) ?? []).map((e) => e.toUpperCase().trim());
};

export const issuesFromRepo = (path: string, showMasterIssues: boolean): [RepoIssue[], string[]] => {
	const devMode = false; //__dirname.includes('IdeaProjects/branch-status');

	const noIssueBranches = new Set<string>();
	const idToBranches = new Map<string, Set<string>>();
	for (const branch of branches(path)) {
		const issueIds = parseIssueIds(branch);
		if (issueIds.length === 0 && !['origin/master', 'origin/production'].includes(branch)) noIssueBranches.add(branch);
		for (const issueId of issueIds) {
			if (!idToBranches.has(issueId)) idToBranches.set(issueId, new Set());
			idToBranches.get(issueId)!.add(branch);
		}
	}

	const result: RepoIssue[] = [];
	idToBranches.forEach((branches, issueId) => {
		result.push({ issueId, branches: [...branches].sort() });
	});

	if (showMasterIssues) {
		new Set(masterCommits(path).flatMap(parseIssueIds)).forEach((issueId) => {
			if (!idToBranches.has(issueId)) result.push({ issueId, branches: ['master'] });
		});
	}

	console.log([...noIssueBranches]);

	return [
		devMode ? result.slice(1, 5) : result,
		[...noIssueBranches]
			.map((e) => e.trim())
			.filter((e) => e)
			.sort(),
	];
};
