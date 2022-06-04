import * as fs from 'fs';
import { logError } from './misc';
import { program } from 'commander';

let accessToken: string;

export const setToken = (t: string) => {
  accessToken = t;
};

export const appConfDir = `${process.env.HOME}/.config/branch-status`;

export const readToken = () => {
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
