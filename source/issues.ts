import axios from 'axios';
import { RepoIssue } from './git';

export interface Issue {
	issueId: string;
	branches: string[];
	state?: string;
	errorDescription?: string;
	testedBy?: string;
	resolvedDate?: string;
	summary?: string;
	onBoard?: boolean;
	duty?: boolean;
}

export const isFromMaster = ({ branches }: Issue): boolean => {
	return branches.length === 1 && branches[0] === 'master';
};

export const isReleased = ({ state }: Issue) => {
	return state === 'Released';
};

export const fromRepoIssue = ({ issueId, branches }: RepoIssue): Issue => {
	return { issueId, branches };
};

const httpGet = (accessToken: string, url: string, params?: any) => {
	return axios.get(url, {
		timeout: 5000,
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		params,
	});
};

export const fetchIssue = async (accessToken: string, { issueId, branches }: RepoIssue): Promise<Issue> => {
	try {
		const {
			data: { resolved: resolvedDate, customFields, summary, tags },
		} = await httpGet(accessToken, `https://youtrack.jetbrains.com/api/issues/${issueId}`, {
			fields: 'summary,resolved,tags(name,id),customFields(id,projectCustomField(field(name)),value(name))',
		});
		return {
			issueId,
			state: customFields.find((e: any) => e.id === '123-1006')?.value.name,
			testedBy: customFields.find((e: any) => e.id === '133-531')?.value?.name,
			// branch: customFields.find((e: any) => e.id === '113-1375').value,
			branches,
			onBoard: tags?.findIndex(({ id }: any) => id === '68-150282') !== -1,
			duty: tags?.findIndex(({ id }: any) => id === '68-26101') !== -1,
			resolvedDate,
			summary,
		};
	} catch (e) {
		const errorDescription = axios.isAxiosError(e) ? e.message : 'unknown error';
		if (errorDescription == 'unknown error') {
			console.log(e);
		}
		return { issueId, branches, errorDescription };
	}
};
