import * as fs from 'fs';

// @ts-ignore
const appConfDir = `${process.env.HOME}/.config/branch-status`;

const tokenFromConfig = () => {
	try {
		return fs.readFileSync(`${appConfDir}/.token`, { encoding: 'utf8' }).trim();
	} catch (e) {}
	return '';
};

export const resolveToken = (cliToken?: string): string => {
	return cliToken ?? tokenFromConfig();
};
