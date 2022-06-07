import React, { FC } from 'react';
import { NoTokenBanner } from './no-token-banner';
import { IssuesTable } from './issues-table';
import { issuesFromRepo } from '../git';
import { NotInAGitRepo } from './not-in-a-git-repo';
import { getCliArgumentsAndParams } from '../cli';
import { resolveToken } from '../token';

const App: FC = () => {
	const { path, youTrackApiToken, showIssuesOnMasterBranch } = getCliArgumentsAndParams();
	const token = resolveToken(youTrackApiToken);
	if (!token) return <NoTokenBanner />;
	const issues = issuesFromRepo(path, showIssuesOnMasterBranch);
	if (!issues) return <NotInAGitRepo />;
	return <IssuesTable token={token} repoIssues={issues} />;
};

module.exports = App;
export default App;
