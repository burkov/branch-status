import chalk from 'chalk';

const colors: { [key: string]: any } = {
  'Implemented': chalk.green,
  'To be discussed': chalk.red,
  'Wait for Reply': chalk.red,
  'In Progress': chalk.yellow,
  'Reopened': chalk.yellow,
  'Incomplete': chalk.yellow,
  'Without Verification': chalk.blue,
  'Under Verification': chalk.blue,
  'Verified': chalk.blue,
}


export const colorizeState = (state: string) => {
  const colorFn = colors[state.trim()];
  return colorFn ? colorFn(state) : state;
};