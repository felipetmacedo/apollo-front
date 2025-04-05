import api from '@/api';

export interface InvitationLinkResponse {
	link: string;
	token: string;
}

export const getInvitationLink = async (): Promise<InvitationLinkResponse> => {
	const { data } = await api.get<InvitationLinkResponse>('/invitation');
	return data;
};

export interface InvitedUsersResponse {
	items: Array<{ id: string; user: { name: string; email: string; created_at: string } }>;
}

export const getInvitedUsers = async (): Promise<InvitedUsersResponse> => {
	const { data } = await api.get<InvitedUsersResponse>('/user/invited');
	return data;
};
