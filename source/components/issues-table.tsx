import React, { FC, useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { fetchIssue, isFailedIssue, isPendingIssue, Issue, PendingIssue, ResolvedIssue, State } from '../issues';
import dayjs from 'dayjs';
import Spinner from 'ink-spinner';
import { substringAfter, truncate } from '../misc';

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

export const IssueState: FC<{ state: string }> = ({ state }) => {
	return <Text color={colors[state]}>{state.padStart(20)}</Text>;
};

export const IssueId: FC<{ id: string; onBoard?: boolean; duty?: boolean }> = ({ id, onBoard, duty }) => {
	return (
		<Text backgroundColor={onBoard ? 'yellowBright' : undefined} color={duty ? 'blue' : undefined}>
			[{id.padStart(10, ' ')}]
		</Text>
	);
};

export const Date: FC<{ resolved?: string }> = ({ resolved }) => {
	return <Text>{resolved ? dayjs(resolved).format('YYYY-MM-DD') : '----------'}</Text>;
};

export const Branch: FC<{ branch?: string }> = ({ branch }) => {
	if (!branch) return null;
	return <Text color="blue">{truncate(branch, 16)}</Text>;
};

export const TestedBy: FC<{ testedBy?: string }> = ({ testedBy }) => {
	if (!testedBy) return null;
	return <Text color="magenta">[{substringAfter(testedBy, ' ')}] </Text>;
};

export const Flags: FC<{ onBoard: boolean; duty: boolean }> = ({ onBoard, duty }) => {
	return (
		<Text>
			<Text color="yellow">{onBoard ? 'b' : ' '}</Text>
			<Text color="blue">{duty ? 'd' : ' '}</Text>
		</Text>
	);
};

export const IssuesRow: FC<{ issue: Issue | PendingIssue }> = ({ issue }) => {
	const { state, id } = issue;
	if (isPendingIssue(issue))
		return (
			<Text>
				<IssueId id={id} />
				{'  '}
				<Date />
				{'  '}
				<Text color="green">
					<Spinner />
				</Text>{' '}
				Loading...
			</Text>
		);
	if (isFailedIssue(issue))
		return (
			<>
				<Text>
					<IssueId id={id} />
					{'  '}
					<Date />
					{'  '}
					<Text color="red">{':FAILED:'.padStart(20)}</Text>
					{'  '}
					<Text>{truncate(issue.description, 120)}</Text>
				</Text>
			</>
		);
	const { resolved, summary, branch, testedBy, onBoard, duty } = issue as ResolvedIssue;
	return (
		<Box>
			<Text>
				<IssueId id={id} onBoard={onBoard} duty={duty} />
				{'  '}
				<Date resolved={resolved} />
				{'  '}
				<IssueState state={state} />
				{'  '}
				<TestedBy testedBy={testedBy} />
				{truncate(summary, 120)} <Branch branch={branch} />
			</Text>
		</Box>
	);
};

export const IssuesTable: FC<{ token: string; issues: string[] }> = ({ issues, token }) => {
	const [resolved, setResolved] = useState<(Issue | PendingIssue)[]>(
		issues
			.sort((a, b) => a.localeCompare(b))
			.map((id) => ({
				id,
				state: State.PENDING,
			})),
	);
	useEffect(() => {
		for (const issue of issues) {
			fetchIssue(token, issue).then((r) =>
				setResolved((prev) => {
					const newList = prev.filter(({ id }) => id !== r.id);
					return [...newList, r].sort((a, b) => a?.state.localeCompare(b?.state));
				}),
			);
		}
	}, []);

	return (
		<>
			{resolved.map((issue) => {
				return <IssuesRow issue={issue} key={issue.id} />;
			})}
		</>
	);
};
