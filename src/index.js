#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const shell = require('shelljs');
const axios = require('axios');
const dayjs = require('dayjs');
const Ora = require('ora');

let accessToken;
program.version('1.0.0');
program.name('branch-status');
program.arguments('<token>');
program.option('--skip-released', `don't show issues in Released state`, false);
program.option('--no-sort', 'do not sort', false);
program.action((arg) => {
  accessToken = arg;
});
program.parse(process.argv);

const logError = (message, exitCode = undefined) => {
  console.log(chalk.red(`[ERROR] ${message}`));
  if (exitCode !== undefined) process.exit(exitCode);
};

const appConfDir = `${process.env.HOME}/.config/branch-status`;

const readToken = () => {
  if (accessToken === undefined) {
    try {
      accessToken = fs.readFileSync(`${appConfDir}/.token`, { encoding: 'utf8' }).trim();
    } catch (e) {
      logError('Please provide your token to access YouTack!');
      console.log('See: https://www.jetbrains.com/help/youtrack/incloud/Manage-Permanent-Token.html');
      console.log(`Example: ${program.name()} perm:AMGuaGHuTGlua593.UMAtMTY2MA==.hkjh123123JJLKjl`);
      logError('Failed to read token from file .token', 255);
    }
  }
};

const loadColorMap = () => {
  const configFile = `${appConfDir}/config.js`;
  const defaultColorMapFunction = function (chalk) {
    return {
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
  };
  if (!fs.existsSync(configFile)) {
    console.log(chalk.yellow(`Now you can adjust output colors in config file: `) + configFile);
    fs.mkdirSync(appConfDir, { recursive: true });
    fs.writeFileSync(configFile, `// find available colors at: https://github.com/chalk/chalk#readme
module.exports = {
    makeColorMap: ${defaultColorMapFunction.toString()}
};
`);
  }

  try {
    const { makeColorMap } = require(configFile);
    return makeColorMap(chalk);
  } catch (e) {
    logError(`Failed to load color map from config file, using default one.`);
    return defaultColorMapFunction(chalk);
  }
};

const colorMap = loadColorMap();

const colorizeState = (state) => {
  const found = colorMap[state.trim()];
  return found ? found(state) : state;
};


const main = async () => {
  readToken();
  const { code, stdout } = shell.exec('git branch -r --sort=committerdate', { silent: true, fatal: true });
  if (code !== 0) {
    logError('Failed to run git branch', code);
  }

  const issues = stdout
    .split('\n')
    .flatMap((line) => line.match(/jpf-\d{1,6}/ig) || [])
    .map((x) => x.toUpperCase());

  console.log(chalk.green(`Fetching YT issue statuses for ${issues.length} branches...`));
  program.sort = !program.noSort;

  const result = [];

  const ora = new Ora({
    text: 'Fetching data',
  });

  if (program.sort) ora.start();

  for (const [ i, id ] of issues.entries()) {
    if (program.sort) ora.text = `(${i}/${issues.length}) Fetching issue ${id}`;
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
    const state = customFields.find((e) => e.id === '123-1006').value.name;
    if (state === 'Released' && program.skipReleased) continue;
    const stateColorized = colorizeState(state.padEnd(20));
    const formatted = `[${id.padEnd(9)}]  ${resDate}  ${stateColorized}  ${summary}`;
    if (program.noSort) console.log(formatted);
    else result.push({ state, resolved, formatted });
  }

  if (program.sort) {
    ora.text = 'All required data fetched';
    ora.succeed();
    result
      .sort((a, b) => a.state.localeCompare(b.state) || (a.resolved - b.resolved))
      .forEach(({ formatted }) => console.log(formatted));
  }
};

main();
