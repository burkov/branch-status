#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './components/app';

const cli = meow(
	`
	Usage
	  $ branch-status [path]

	Options
	  --token       a YouTrack token if not already save in config file
	  -m, --master  show issues on a master branch
`,
	{
		flags: {
			token: {
				type: 'string',
			},
			master: {
				type: 'boolean',
				alias: 'm',
				default: false,
			},
		},
	},
);

export interface Config {
	path: string;
	showIssuesOnMasterBranch: boolean;
	youTrackApiToken?: string;
}

export const getCliArgumentsAndParams = (): Config => {
	return {
		path: cli.input[0] ?? '.',
		showIssuesOnMasterBranch: cli.flags.master,
		youTrackApiToken: cli.flags.token,
	};
};

render(<App />);
