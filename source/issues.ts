import axios from 'axios';

export enum State {
	PENDING = '__pending',
	FAILED = '__failed',
}

export interface PendingIssue {
	id: string;
	state: State.PENDING;
}

export interface FailedIssue {
	id: string;
	state: State.FAILED;
	description: string;
}

export interface ResolvedIssue {
	id: string;
	state: string;
	testedBy?: string;
	branch?: string;
	resolved?: string;
	summary: string;
	onBoard: boolean;
	duty: boolean;
}

export function isResolvedIssue(a: any): a is ResolvedIssue {
	return 'state' in a && 'resolved' in a;
}

export function isFailedIssue(a: any): a is FailedIssue {
	return 'state' in a && a.state === State.FAILED;
}

export function isPendingIssue(a: any): a is PendingIssue {
	return 'state' in a && a.state === State.PENDING;
}

export type Issue = FailedIssue | ResolvedIssue;

// export const sleep = (ms: number) => new Promise((resolve) => setTimeout(() => resolve(undefined), ms));

const httpGet = (accessToken: string, url: string, params?: any) => {
	return axios.get(url, {
		timeout: 5000,
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		params,
	});
};

export const fetchIssue = async (accessToken: string, id: string): Promise<Issue> => {
	try {
		const {
			data: { resolved, customFields, summary, tags },
		} = await httpGet(accessToken, `https://youtrack.jetbrains.com/api/issues/${id}`, {
			fields: 'summary,resolved,tags(name,id),customFields(id,projectCustomField(field(name)),value(name))',
		});
		return {
			id,
			state: customFields.find((e: any) => e.id === '123-1006').value.name,
			testedBy: customFields.find((e: any) => e.id === '133-531').value?.name,
			branch: customFields.find((e: any) => e.id === '113-1375').value,
			onBoard: tags?.findIndex(({ id }: any) => id === '68-150282') !== -1,
			duty: tags?.findIndex(({ id }: any) => id === '68-26101') !== -1,
			resolved,
			summary,
		};
	} catch (e) {
		const description = axios.isAxiosError(e) ? e.message : 'unknown error';
		return { id, state: State.FAILED, description };
	}
};
