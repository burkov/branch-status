import axios from 'axios';

export interface Issue {
	state: string;
	resolved: string;
	summary: string;
}

export const fetchIssue = async (accessToken: string, id: string): Promise<Issue | null> => {
	try {
		const {
			data: { resolved, customFields, summary },
		} = await axios.get(`https://youtrack.jetbrains.com/api/issues/${id}`, {
			timeout: 5000,
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			params: {
				fields: 'summary,resolved,customFields(id,projectCustomField(field(name)),value(name))',
			},
		});
		return {
			state: customFields.find((e: any) => e.id === '123-1006').value.name,
			resolved,
			summary,
		};
	} catch (e) {
		return null;
	}
};
