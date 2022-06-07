import React, { FC, useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { fetchIssue, fromRepoIssue, isFromMaster, isReleased, Issue } from '../issues';
import dayjs from 'dayjs';
import { substringAfter, truncate } from '../misc';
import { RepoIssue } from '../git';
import Spinner from 'ink-spinner';

const colors: { [key: string]: any } = {
	Implemented: 'green',
	'To be discussed': 'red',
	'Wait for Reply': 'red',
	'In Progress': 'yellow',
	Reopened: 'yellow',
	Incomplete: 'yellow',
	'Without Verification': 'blue',
	'Under Verification': 'blue',
	Verified: 'blue',
};

const statusPretty = (s: string) => {
	if (s === 'Under Verification') return 'Verification';
	if (s === 'Without Verification') return 'W/o verify';
	return s;
};

export const IssueState: FC<{ issue: Issue }> = ({ issue: { state, errorDescription, summary } }) => {
	const padding = 15;
	if (state) return <Text color={colors[state]}>{statusPretty(state).padStart(padding)}</Text>;
	if (errorDescription) return <Text color="red">{':FAILED:'.padStart(padding)}</Text>;
	if (!state && summary) return <Text color="yellow">{'UNKNOWN'.padStart(padding)}</Text>;
	return <Text color="blue">{'Pending'.padStart(padding)}</Text>;
};

export const IssueId: FC<{ id: string; onBoard?: boolean; duty?: boolean }> = ({ id, onBoard, duty }) => {
	return (
		<Text>
			<Text>[</Text>
			<Text color="yellow">{onBoard ? '*' : ' '}</Text>
			<Text color={duty ? 'blue' : undefined}>{id.padEnd(9, ' ')}</Text>
			<Text>]</Text>
		</Text>
	);
};

const dateColor = (date?: string): string | undefined => {
	if (!date) return undefined;
	const daysPassed = dayjs().diff(dayjs(date), 'days');
	if (daysPassed < 10) return 'green';
	if (daysPassed >= 10 && daysPassed < 30) return 'yellow';
	if (daysPassed >= 30) return 'red';
	return undefined;
};

const formatDate = (date?: string) => (date ? dayjs(date).format('YYYY-MM-DD') : '----------');

export const Date: FC<{ resolved?: string }> = ({ resolved }) => {
	return <Text color={dateColor(resolved)}>{formatDate(resolved)}</Text>;
};

export const Branches: FC<{ issue: Issue }> = ({ issue }) => {
	const fromMaster = isFromMaster(issue);
	return <Text color="green">{fromMaster ? 'master' : '      '}</Text>;
};

export const TestedBy: FC<{ testedBy?: string }> = ({ testedBy }) => {
	if (!testedBy) return null;
	return <Text color="magenta">[{substringAfter(testedBy, ' ')}] </Text>;
};

export const Description: FC<{ issue: Issue }> = ({ issue: { summary, errorDescription, testedBy } }) => {
	if (errorDescription) return <Text>{truncate(errorDescription, 120)}</Text>;
	if (summary)
		return (
			<Text>
				<TestedBy testedBy={testedBy} />
				{truncate(summary ?? '', 120)}
			</Text>
		);
	return (
		<Text>
			<Text color="green">
				<Spinner />
			</Text>{' '}
			Loading...
		</Text>
	);
};

export const IssuesRow: FC<{ issue: Issue }> = ({ issue }) => {
	const { issueId, resolvedDate, onBoard, duty } = issue;
	return (
		<Box>
			<Text>
				<IssueId id={issueId} onBoard={onBoard} duty={duty} />
				{'  '}
				<Date resolved={resolvedDate} />
				{'  '}
				<IssueState issue={issue} />
				{'  '}
				<Branches issue={issue} />
				{'  '}
				<Description issue={issue} />
			</Text>
		</Box>
	);
};

export const IssuesTable: FC<{ token: string; repoIssues: RepoIssue[] }> = ({ repoIssues, token }) => {
	const initialState = repoIssues
		.map(fromRepoIssue)
		.filter((e) => !isFromMaster(e))
		.sort((a, b) => a.issueId.localeCompare(b.issueId));

	const [resolved, setResolved] = useState<Issue[]>(initialState);

	useEffect(() => {
		for (const issue of repoIssues) {
			fetchIssue(token, issue).then((resolvedIssue) =>
				setResolved((prev) => {
					if (isFromMaster(resolvedIssue) && isReleased(resolvedIssue)) return prev;
					const newList = prev.filter(({ issueId }) => issueId !== resolvedIssue.issueId);
					return [...newList, resolvedIssue].sort(({ state: stateA }, { state: stateB }) =>
						(stateA ?? '')?.localeCompare(stateB ?? ''),
					);
				}),
			);
		}
	}, []);

	return (
		<>
			{resolved.map((issue) => {
				return <IssuesRow issue={issue} key={issue.issueId} />;
			})}
		</>
	);
};
