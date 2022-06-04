import shell from 'shelljs';
import { logError } from './misc';
import { Command, program } from 'commander';

export type CliOptions = Command & {
  issuePrefix: any;
};

export const getIssues = () => {
  const { code, stdout } = shell.exec('git branch -r --sort=committerdate', { silent: false, fatal: true });
  if (code !== 0) logError('Failed to run git branch', code);

  const { issuePrefix } = program as CliOptions;
  const issues = stdout
    .split('\n')
    .flatMap((line) => line.match(/\w{2,4}-\d{1,6}/gi) || [])
    .filter((issueId) => issuePrefix === undefined || RegExp(issuePrefix, 'i').test(issueId))
    .map((x) => x.toUpperCase());
  return [...new Set(issues)];
};
