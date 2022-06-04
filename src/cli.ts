import { program } from 'commander';
import { setToken } from './config';

program.version('1.4.2');
program.name('branch-status');
program.arguments('<token>');
program.option('--skip-released', `don't show issues in Released state`, false);
program.option('--no-sort', 'do not sort', false);
program.option('--issue-prefix <prefix>', 'show only issues with given prefix', undefined);
program.action((arg: string) => {
  setToken(arg);
});
program.parse(process.argv);
