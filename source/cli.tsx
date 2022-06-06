#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './components/app';
import {resolveToken} from "./token";

const cli = meow(`
	Usage
	  $ branch-status

	Options
	  --token a YouTrack token if not already save in config file
`, {
	flags: {
		token: {
			type: 'string'
		}
	}
});

render(<App token={resolveToken(cli.flags.token)}/>);
