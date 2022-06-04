#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import * as fs from 'fs';
import shell from 'shelljs';
import axios from 'axios';
import dayjs from 'dayjs';
import Ora from 'ora';
import { logError } from './misc';
import { readToken } from './config';
import { getIssues } from './issues';

const main = async () => {
  getIssues();
  // readToken();

  //
  // console.log(chalk.green(`Fetching YT issue statuses for ${issues.length} branches...`));
  // program.sort = !program.noSort;
  //
  // const result = [];
  //
  // const ora = new Ora({
  //   text: 'Fetching data',
  // });
  //
  // if (program.sort) ora.start();
  //
  // for (const [i, id] of issues.entries()) {
  //   if (program.sort) ora.text = `(${i}/${issues.length}) Fetching issue ${id}`;
  //   try {
  //     const {
  //       data: {
  //         resolved,
  //         customFields,
  //         summary,
  //       },
  //     } = await axios.get(`https://youtrack.jetbrains.com/api/issues/${id}`, {
  //       timeout: 5000,
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       params: {
  //         fields: 'summary,resolved,customFields(id,projectCustomField(field(name)),value(name))',
  //       },
  //     });
  //     const resDate = resolved ? dayjs(resolved).format('YYYY-MM-DD') : '----------';
  //     const state = customFields.find((e) => e.id === '123-1006').value.name;
  //     if (state === 'Released' && program.skipReleased) continue;
  //     const stateColorized = colorizeState(state.padEnd(20));
  //     const formatted = `[${id.padEnd(9)}]  ${resDate}  ${stateColorized}  ${summary}`;
  //     if (program.noSort) console.log(formatted);
  //     else result.push({state, resolved, formatted});
  //   } catch (e) {
  //     ora.fail(`Failed to fetch issue ${id} data: ${e.message}`);
  //     ora.start(`Resuming...`);
  //   }
  // }
  //
  // if (program.sort) {
  //   ora.text = 'All required data fetched';
  //   ora.succeed();
  //   result
  //       .sort((a, b) => a.state.localeCompare(b.state) || (a.resolved - b.resolved))
  //       .forEach(({formatted}) => console.log(formatted));
  // }
};

main().catch(console.error);
