import * as fs from 'fs';
import * as os from 'os';
import path from 'path';

export const appConfDir = path.join(os.homedir(), '.config', 'branch-status');

const tokenFromConfig = () => {
	try {
		return fs.readFileSync(path.join(appConfDir, '.token'), { encoding: 'utf8' }).trim();
	} catch (e) {}
	return '';
};

export const resolveToken = (cliToken?: string): string => {
	return cliToken ?? tokenFromConfig();
};
