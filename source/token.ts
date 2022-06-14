import * as fs from 'fs';
import * as os from 'os';

export const appConfDir = `${os.homedir()}/.config/branch-status`;

const tokenFromConfig = () => {
	try {
		return fs.readFileSync(`${appConfDir}/.token`, { encoding: 'utf8' }).trim();
	} catch (e) {}
	return '';
};

export const resolveToken = (cliToken?: string): string => {
	return cliToken ?? tokenFromConfig();
};
