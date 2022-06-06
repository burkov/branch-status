import React, { FC } from 'react';
import { NoTokenBanner } from './no-token-banner';
import { IssuesTable } from './issues-table';
import { getIssues } from '../git';
import { NotInAGitRepo } from './not-in-a-git-repo';

const App: FC<{ token?: string }> = ({ token }) => {
	if (!token) return <NoTokenBanner />;
	const issues = getIssues();
	if (!issues) return <NotInAGitRepo />;
	return <IssuesTable token={token} issues={issues} />;
};

module.exports = App;
export default App;
