import React, { FC } from 'react';
import { Box, Static, Text } from 'ink';

/*
const colors: { [key: string]: any } = {
	'Implemented': chalk.green,
	'To be discussed': chalk.red,
	'Wait for Reply': chalk.red,
	'In Progress': chalk.yellow,
	'Reopened': chalk.yellow,
	'Incomplete': chalk.yellow,
	'Without Verification': chalk.blue,
	'Under Verification': chalk.blue,
	'Verified': chalk.blue,
}
 */

export const IssuesTable: FC<{ token: string; issues: string[] }> = ({ token, issues }) => {
	return (
		<>
			<Static items={issues}>
				{(issue: string) => {
					return (
						<Box key={issue}>
							<Text>{issue}</Text>
						</Box>
					);
				}}
			</Static>
			<Box>
				<Text>Fetching issues... {token}</Text>
			</Box>
		</>
	);
};
