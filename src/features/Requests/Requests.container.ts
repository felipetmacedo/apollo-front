import { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/user.store';

import { getRequests, createRequest, updateRequest, deleteRequest, Request, CreateRequestPayload, UpdateRequestPayload } from '@/processes/request';

// Interface para nosso componente
export interface RequestRow {
	id: string;
	cpf_cnpj: string;
	name: string;
	phone: string;
	status: string;
	serasa: 'limpo' | 'andamento' | 'negado' | 'reenviado';
	boa_vista: 'limpo' | 'andamento' | 'negado' | 'reenviado';
	cenprot: 'limpo' | 'andamento' | 'negado' | 'reenviado';
	spc: 'limpo' | 'andamento' | 'negado' | 'reenviado';
	createdAt: string;
}

// Dados do formulário para criação/edição de solicitações
export interface RequestFormData {
	id?: string;
	cpf_cnpj: string;
	name: string;
	phone: string;
	status: string;
	serasa: 'limpo' | 'andamento' | 'negado' | 'reenviado';
	boa_vista: 'limpo' | 'andamento' | 'negado' | 'reenviado';
	cenprot: 'limpo' | 'andamento' | 'negado' | 'reenviado';
	spc: 'limpo' | 'andamento' | 'negado' | 'reenviado';
}

// Converter resposta da API para o formato do nosso componente
const requestToRequestRow = (request: Request): RequestRow => {
	return {
		id: request.id,
		cpf_cnpj: request.cpf_cnpj,
		name: request.name,
		phone: request.phone || '',
		status: request.status || 'Pendente',
		serasa: request.serasa || 'andamento',
		boa_vista: request.boa_vista || 'andamento',
		cenprot: request.cenprot || 'andamento',
		spc: request.spc || 'andamento',
		createdAt: request.createdAt || new Date().toISOString(),
	};
};

export default function RequestsContainer() {
	const { userInfo } = useUserStore();
	const [requests, setRequests] = useState<RequestRow[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [editingRequest, setEditingRequest] = useState<RequestRow | null>(null);
	const [showForm, setShowForm] = useState(false);

	// Função para buscar solicitações da API
	const fetchRequests = useCallback(async () => {
		try {
			setLoading(true);
			const requestsData = await getRequests();
			const mappedRequests = requestsData.map(requestToRequestRow);
			setRequests(mappedRequests);
		} catch (error) {
			toast.error('Erro ao buscar solicitações');
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, []);

	// useEffect(() => {
	// 	fetchRequests();
	// }, [fetchRequests]);

	// Verificar se o usuário tem permissão específica
	const hasPermission = useCallback(
		(permissionName: string, module: string) => {
			if (!userInfo?.permissions) return false;

			return userInfo.permissions.some(
				(perm) => perm.name === permissionName && perm.module === module
			);
		},
		[userInfo]
	);

	// Permissões memorizadas
	const canCreateRequest = useMemo(
		() => hasPermission('CREATE', 'REQUESTS'),
		[hasPermission]
	);
	
	const canUpdateRequest = useMemo(
		() => hasPermission('UPDATE', 'REQUESTS'),
		[hasPermission]
	);
	
	const canDeleteRequest = useMemo(
		() => hasPermission('DELETE', 'REQUESTS'),
		[hasPermission]
	);

	// Definir termo de pesquisa com useCallback
	const handleSetSearchTerm = useCallback((value: string) => {
		setSearchTerm(value);
	}, []);

	// Mostrar/esconder formulário com useCallback
	const handleShowForm = useCallback((value: boolean) => {
		setShowForm(value);
		if (!value) {
			setEditingRequest(null);
		}
	}, []);

	// Handler de edição de solicitação
	const handleEditRequest = useCallback(
		(request: RequestRow) => {
			if (!canUpdateRequest) {
				toast.error('Você não tem permissão para editar solicitações.');
				return;
			}

			setEditingRequest(request);
			setShowForm(true);
		},
		[canUpdateRequest]
	);

	// Handler de exclusão de solicitação
	const handleDeleteRequest = useCallback(
		async (id: string) => {
			if (!canDeleteRequest) {
				toast.error('Você não tem permissão para excluir solicitações.');
				return;
			}

			try {
				setLoading(true);
				await deleteRequest(id);
				setRequests((prevRequests) =>
					prevRequests.filter((request) => request.id !== id)
				);
				toast.success('Solicitação excluída com sucesso!');
			} catch (error) {
				toast.error('Erro ao excluir solicitação');
				console.error(error);
			} finally {
				setLoading(false);
			}
		},
		[canDeleteRequest]
	);

	// Handler de envio do formulário
	const handleSaveRequest = useCallback(
		async (data: RequestFormData) => {
			// Verificar permissões com base em se está editando ou criando
			if (editingRequest && !canUpdateRequest) {
				toast.error('Você não tem permissão para editar solicitações.');
				return;
			} else if (!editingRequest && !canCreateRequest) {
				toast.error('Você não tem permissão para criar solicitações.');
				return;
			}

			try {
				setLoading(true);

				if (editingRequest) {
					// Atualizar solicitação existente
					const updatePayload: UpdateRequestPayload = {
						cpf_cnpj: data.cpf_cnpj,
						name: data.name,
						phone: data.phone,
						status: data.status,
						serasa: data.serasa,
						boa_vista: data.boa_vista,
						cenprot: data.cenprot,
						spc: data.spc
					};

					const updatedRequest = await updateRequest(editingRequest.id, updatePayload);
					
					// Converter resposta da API para RequestRow
					const updatedRequestRow = requestToRequestRow(updatedRequest);

					setRequests((prevRequests) =>
						prevRequests.map((request) =>
							request.id === editingRequest.id ? updatedRequestRow : request
						)
					);
					toast.success('Solicitação atualizada com sucesso!');
				} else {
					// Criar nova solicitação
					const createPayload: CreateRequestPayload = {
						cpf_cnpj: data.cpf_cnpj,
						name: data.name,
						phone: data.phone,
						status: data.status,
						serasa: data.serasa,
						boa_vista: data.boa_vista,
						cenprot: data.cenprot,
						spc: data.spc
					};

					const newRequest = await createRequest(createPayload);
					
					// Converter resposta da API para RequestRow
					const newRequestRow = requestToRequestRow(newRequest);

					setRequests((prevRequests) => [...prevRequests, newRequestRow]);
					toast.success('Solicitação criada com sucesso!');
				}

				setShowForm(false);
				setEditingRequest(null);
			} catch (error) {
				toast.error(
					editingRequest
						? 'Erro ao atualizar solicitação'
						: 'Erro ao criar solicitação'
				);
				console.error(error);
			} finally {
				setLoading(false);
			}
		},
		[editingRequest, canCreateRequest, canUpdateRequest]
	);

	// Handler de cancelamento do formulário
	const handleCancelForm = useCallback(() => {
		setShowForm(false);
		setEditingRequest(null);
	}, []);

	// Memorizar as solicitações filtradas para evitar recálculo em cada renderização
	const filteredRequests = useMemo(
		() =>
			requests.filter(
				(request) =>
					request.name
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					request.cpf_cnpj
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					request.phone
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					request.status
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
			),
		[requests, searchTerm]
	);

	return {
		requests: filteredRequests,
		loading,
		searchTerm,
		setSearchTerm: handleSetSearchTerm,
		handleEditRequest,
		handleDeleteRequest,
		handleSaveRequest,
		handleCancelForm,
		editingRequest,
		showForm,
		setShowForm: handleShowForm,
		canCreateRequest,
		canUpdateRequest,
		canDeleteRequest,
		refreshRequests: fetchRequests,
	};
} 