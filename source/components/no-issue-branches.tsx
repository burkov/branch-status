import React, { FC } from 'react';
import { Newline, Text } from 'ink';
import { Env } from './issues-table';

export const NoIssuesBranches: FC<{ noIssuesBranches: string[]; branchEnv: [string, string][] }> = ({
	noIssuesBranches,
	branchEnv,
}) => {
	const prettyBranches = noIssuesBranches.map((e) => e.replace('origin/', '').trim());
	const maxLength = prettyBranches.map((e) => e.length).sort((a, b) => b - a)[0]!;

	return (
		<Text>
			<Newline />
			<Text bold={true}>Was not able to detect issue id on the following branches:</Text>
			<Newline />
			{prettyBranches.map((e) => {
				return (
					<Text key={e}>
						{'  - '}
						<Text>{e.padEnd(maxLength + 1)}</Text>
						<Env branches={[e]} branchEnv={branchEnv} />
						<Newline />
					</Text>
				);
			})}
		</Text>
	);
};
