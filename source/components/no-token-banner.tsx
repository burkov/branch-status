import React, { FC } from 'react';
import { Text } from 'ink';
import { useExit } from './use-exit';

export const NoTokenBanner: FC = ({}) => {
	useExit();
	return (
		<>
			<Text color="red">No token found</Text>
			<Text>branch-status requires a YouTrack token to fetch issues data</Text>
			<Text>See: https://www.jetbrains.com/help/youtrack/incloud/Manage-Permanent-Token.html</Text>
		</>
	);
};
