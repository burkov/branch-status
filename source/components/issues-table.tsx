import React, { FC, useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import { fetchIssue, fromRepoIssue, isFromMaster, isReleased, Issue } from '../issues';
import dayjs from 'dayjs';
import { substringAfter, truncate } from '../misc';
import { RepoIssue } from '../git';
import Spinner from 'ink-spinner';
import { getCliArgumentsAndParams } from '../cli';
import { NoIssuesBranches } from './no-issue-branches';
import { deployedBranch, envs } from '../envs';

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

const dateColor = (date?: number): string | undefined => {
	if (!date) return undefined;
	const daysPassed = dayjs().diff(dayjs(date), 'days');
	if (daysPassed < 10) return 'green';
	if (daysPassed >= 10 && daysPassed < 30) return 'yellow';
	if (daysPassed >= 30) return 'red';
	return undefined;
};

const formatDate = (date?: number) => (date ? dayjs(date).format('YYYY-MM-DD') : '----------');

export const Date: FC<{ resolved?: number }> = ({ resolved }) => {
	return <Text color={dateColor(resolved)}>{formatDate(resolved)}</Text>;
};

export const Branches: FC<{ issue: Issue }> = ({ issue }) => {
	const fromMaster = isFromMaster(issue);
	return <Text color="green">{fromMaster ? 'master' : '      '}</Text>;
};

export const Env: FC<{ branches: string[]; branchEnv: [string, string][]; emptyPlaceholder?: string }> = ({
	branches,
	branchEnv,
	emptyPlaceholder,
}) => {
	const [, env] = branchEnv.find(([b]) => branches.some((e) => e.includes(b))) ?? [];
	if (!env) return emptyPlaceholder ? <Text>{emptyPlaceholder}</Text> : null;
	return <Text color="cyan">[{env}]</Text>;
};

export const TestedBy: FC<{ testedBy?: string }> = ({ testedBy }) => {
	if (!testedBy) return null;
	return <Text color="magenta">[{substringAfter(testedBy, ' ')}] </Text>;
};

export const Description: FC<{ issue: Issue; branchEnv: [string, string][] }> = ({
	issue: { summary, errorDescription, testedBy, branches },
	branchEnv,
}) => {
	if (errorDescription) return <Text>{truncate(errorDescription, 120)}</Text>;
	if (summary)
		return (
			<Text>
				<Env branches={branches} branchEnv={branchEnv} />
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

export const IssuesRow: FC<{ issue: Issue; branchEnv: [string, string][] }> = ({ issue, branchEnv }) => {
	const { issueId, resolvedDate, onBoard, duty } = issue;
	const { showIssuesOnMasterBranch } = getCliArgumentsAndParams();
	return (
		<Box>
			<Text>
				<IssueId id={issueId} onBoard={onBoard} duty={duty} />
				{'  '}
				<Date resolved={resolvedDate} />
				{'  '}
				<IssueState issue={issue} />
				{'  '}
				{showIssuesOnMasterBranch && (
					<>
						<Branches issue={issue} />
						{'  '}
					</>
				)}
				<Description issue={issue} branchEnv={branchEnv} />
			</Text>
		</Box>
	);
};

export const IssuesTable: FC<{ token: string; repoIssues: RepoIssue[]; noIssuesBranches: string[] }> = ({
	repoIssues,
	token,
	noIssuesBranches,
}) => {
	const initialState = repoIssues
		.map(fromRepoIssue)
		.filter((e) => !isFromMaster(e))
		.sort((a, b) => a.issueId.localeCompare(b.issueId));

	const [resolved, setResolved] = useState<Issue[]>(initialState);
	const [branchEnv, setBranchEnv] = useState<[string, string][]>([]);

	useEffect(() => {
		for (const envName in envs) {
			deployedBranch(envName)
				.then((deployedBranchToEnvName) => {
					setBranchEnv((prev) => {
						return [...prev, deployedBranchToEnvName];
					});
				})
				.catch(() => undefined);
		}
		for (const issue of repoIssues) {
			fetchIssue(token, issue).then((resolvedIssue) =>
				setResolved((prev) => {
					if (isFromMaster(resolvedIssue) && isReleased(resolvedIssue)) return prev;
					const newList = prev.filter(({ issueId }) => issueId !== resolvedIssue.issueId);
					return [...newList, resolvedIssue].sort(
						({ state: stateA, resolvedDate: rdA }, { state: stateB, resolvedDate: rdB }) => {
							const byState = (stateA ?? '')?.localeCompare(stateB ?? '');
							const byDate = (rdA ?? 0) - (rdB ?? 0);
							return byState !== 0 ? byState : byDate;
						},
					);
				}),
			);
		}
	}, []);

	return (
		<>
			{resolved.map((issue) => {
				return <IssuesRow issue={issue} key={issue.issueId} branchEnv={branchEnv} />;
			})}
			<NoIssuesBranches noIssuesBranches={noIssuesBranches} branchEnv={branchEnv} />
		</>
	);
};
