import { useApp } from 'ink';
import { useEffect } from 'react';

export const useExit = () => {
	const { exit } = useApp();
	useEffect(exit, []);
};
