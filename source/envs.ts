import axios from 'axios';

export const envs: { [key: string]: string } = {
	dev2: 'https://active.jetprofile-dev2.intellij.net',
	dev3: 'https://active.jetprofile-dev3.intellij.net',
	dev4: 'https://active.jetprofile-dev4.intellij.net',
	dev5: 'https://active.jetprofile-dev5.intellij.net',
	dev6: 'https://active.jetprofile-dev6.intellij.net',
	audt: 'https://active.jetprofile-audt.intellij.net',
};

export const deployedBranch = async (key: string): Promise<[string, string]> => {
	const host = envs[key];
	const { data }: { data: string } = await axios.get(`${host}/build`, { timeout: 5000 });
	const firstDashIndex = data.indexOf('-');
	const secondDashIndex = data.indexOf('-', firstDashIndex + 1);
	const lastDashIndex = data.lastIndexOf('-');
	return [data.slice(secondDashIndex + 1, lastDashIndex), key];
};
