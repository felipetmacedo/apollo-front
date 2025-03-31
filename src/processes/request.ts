import api from '@/api'

export interface Request {
  id: string;
  cpf_cnpj: string;
  name: string;
  phone?: string;
  status?: string;
  serasa?: 'limpo' | 'andamento' | 'negado' | 'reenviado';
  boa_vista?: 'limpo' | 'andamento' | 'negado' | 'reenviado';
  cenprot?: 'limpo' | 'andamento' | 'negado' | 'reenviado';
  spc?: 'limpo' | 'andamento' | 'negado' | 'reenviado';
  createdAt?: string;
}

export interface UpdateRequestPayload {
  cpf_cnpj?: string;
  name?: string;
  phone?: string;
  status?: string;
  serasa?: 'limpo' | 'andamento' | 'negado' | 'reenviado';
  boa_vista?: 'limpo' | 'andamento' | 'negado' | 'reenviado';
  cenprot?: 'limpo' | 'andamento' | 'negado' | 'reenviado';
  spc?: 'limpo' | 'andamento' | 'negado' | 'reenviado';
}

export interface CreateRequestPayload {
  cpf_cnpj: string;
  name: string;
  phone?: string;
  status?: string;
  serasa?: 'limpo' | 'andamento' | 'negado' | 'reenviado';
  boa_vista?: 'limpo' | 'andamento' | 'negado' | 'reenviado';
  cenprot?: 'limpo' | 'andamento' | 'negado' | 'reenviado';
  spc?: 'limpo' | 'andamento' | 'negado' | 'reenviado';
}

export const getRequests = async (): Promise<Request[]> => {
  const { data } = await api.get<Request[]>('/request');
  return data;
}

export const createRequest = async (payload: CreateRequestPayload): Promise<Request> => {
  const { data } = await api.post<Request>('/request', payload);
  return data;
}

export const updateRequest = async (requestId: string, payload: UpdateRequestPayload): Promise<Request> => {
  const { data } = await api.put<Request>(`/request/${requestId}`, payload);
  return data;
}

export const deleteRequest = async (requestId: string): Promise<boolean> => {
  await api.delete(`/request/${requestId}`);
  return true;
}

export const getRequestById = async (requestId: string): Promise<Request> => {
  const { data } = await api.get<Request>(`/request/${requestId}`);
  return data;
} 