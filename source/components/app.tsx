import React, { FC } from 'react';
import { NoTokenBanner } from './no-token-banner';
import { IssuesTable } from './issues-table';
import { issuesFromRepo } from '../git';
import { NotInAGitRepo } from './not-in-a-git-repo';

const App: FC<{ token?: string; path?: string; showMasterIssues: boolean }> = ({
	token,
	path = '.',
	showMasterIssues,
}) => {
	if (!token) return <NoTokenBanner />;
	const issues = issuesFromRepo(path, showMasterIssues);
	if (!issues) return <NotInAGitRepo />;
	return <IssuesTable token={token} repoIssues={issues} />;
};

module.exports = App;
export default App;
