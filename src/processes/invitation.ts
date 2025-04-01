import api from '@/api';

export interface InvitationLinkResponse {
	link: string;
}

export const getInvitationLink = async (): Promise<InvitationLinkResponse> => {
	const { data } = await api.get<InvitationLinkResponse>('/invitation');
	return data;
};
