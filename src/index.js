#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const shell = require('shelljs');
const axios = require('axios');
const dayjs = require('dayjs');

let accessToken;
program.version('1.0.0');
program.name('branch-status');
program.arguments('<token>');
program.option('--skip-released', `don't show issues in Released state`, false);
program.action((arg) => {
  accessToken = arg;
});
program.parse(process.argv);

const logError = (message, exitCode = undefined) => {
  console.log(chalk.red(`[ERROR] ${message}`));
  if (exitCode !== undefined) process.exit(exitCode);
};

const readToken = () => {
  if (accessToken === undefined) {
    try {
      accessToken = fs.readFileSync('~/.config/branch-status/.token', {encoding: 'utf8'});
    } catch (e) {
      logError('Please provide your token to access YouTack!');
      console.log('See: https://www.jetbrains.com/help/youtrack/incloud/Manage-Permanent-Token.html');
      console.log(`Example: ${program.name()} perm:AMGuaGHuTGlua593.UMAtMTY2MA==.hkjh123123JJLKjl`);
      logError('Failed to read token from file .token', 255);
    }
  }
};

const colorizeState = (state) => {
  const map = {
    'Implemented': chalk.green,
    'To be discussed': chalk.red,
    'Wait for Reply': chalk.red,
    'In Progress': chalk.yellow,
    'Reopened': chalk.yellow,
    'Incomplete': chalk.yellow,
    'Without Verification': chalk.blue,
    'Under Verification': chalk.blue,
    'Verified': chalk.blue,
  };
  const func = map[state.trim()] ? map[state.trim()] : (e) => e;
  return func(state);
};


const main = async () => {
  readToken();
  const {code, stdout} = shell.exec('git branch -r --sort=committerdate', {silent: true, fatal: true});
  if (code !== 0) {
    logError('Failed to run git branch', code);
  }

  const issues = stdout
    .split('\n')
    .map((l) => {
      let result = /(JPF-[0-9]+)/.exec(l);
      return result ? result[1] : undefined;
    })
    .filter((e) => e !== undefined);

  console.log(chalk.green(`Fetching YT issue statuses for ${issues.length} branches...`));

  for (const id of issues) {
    const {
      data: {
        resolved,
        customFields,
        summary,
      },
    } = await axios.get(`https://youtrack.jetbrains.com/api/issues/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        fields: 'summary,resolved,customFields(id,projectCustomField(field(name)),value(name))',
      },
    });
    const resDate = resolved ? dayjs(resolved).format('YYYY-MM-DD') : '----------';
    let stateRaw = customFields.find((e) => e.id === '123-1006').value.name;
    if (stateRaw === 'Released' && program.skipReleased) continue;
    const state = colorizeState(stateRaw.padEnd(20));
    console.log(`[${id.padEnd(9)}]  ${resDate}  ${state}  ${summary}`);
  }
};

main();
