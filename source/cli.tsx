#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import meow from 'meow';
import App from './components/app';
import { resolveToken } from './token';

const cli = meow(
	`
	Usage
	  $ branch-status [path]

	Options
	  --token       a YouTrack token if not already save in config file
	  -m, --master  show issue on master branch
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

render(<App token={resolveToken(cli.flags.token)} path={cli.input[0]} showMasterIssues={cli.flags.master} />);
