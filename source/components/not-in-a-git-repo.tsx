import React, { FC } from 'react';
import { useExit } from './use-exit';
import { Text } from 'ink';

export const NotInAGitRepo: FC<{}> = ({}) => {
	useExit();
	return (
		<>
			<Text color="red">Not in a git repo</Text>
			<Text>branch-status should be called from a git repository</Text>
		</>
	);
};
