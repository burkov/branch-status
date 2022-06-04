import chalk from 'chalk';

export const logError = (message: string, exitCode?: number) => {
  console.log(chalk.red(`[ERROR] ${message}`));
  if (exitCode !== undefined) process.exit(exitCode);
};
