import { Search, Plus, Edit, Trash2, Loader2 } from 'lucide-react';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

import RequestsContainer from './Requests.container';
import { RequestForm } from '@/components/request';

export default function Requests() {
	const {
		requests,
		loading,
		searchTerm,
		setSearchTerm,
		handleEditRequest,
		handleDeleteRequest,
		handleSaveRequest,
		handleCancelForm,
		editingRequest,
		showForm,
		setShowForm,
		canCreateRequest,
		canUpdateRequest,
		canDeleteRequest
	} = RequestsContainer();

	const getRequestFormData = () => {
		if (!editingRequest) return null;

		return {
			id: editingRequest.id,
			cpf_cnpj: editingRequest.cpf_cnpj,
			name: editingRequest.name,
			phone: editingRequest.phone,
			status: editingRequest.status,
			serasa: editingRequest.serasa,
			boa_vista: editingRequest.boa_vista,
			cenprot: editingRequest.cenprot,
			spc: editingRequest.spc
		};
	};

	// Função para renderizar a badge do status apropriado
	const getStatusBadge = (status: string) => {
		switch (status.toLowerCase()) {
			case 'pendente':
				return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pendente</Badge>;
			case 'pago':
				return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Pago</Badge>;
			case 'enviado':
				return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Enviado</Badge>;
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	// Função para renderizar badge do status de bureau
	const getBureauStatusBadge = (status: 'limpo' | 'andamento' | 'negado' | 'reenviado') => {
		switch (status) {
			case 'limpo':
				return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Limpo</Badge>;
			case 'andamento':
				return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Em Andamento</Badge>;
			case 'negado':
				return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Negado</Badge>;
			case 'reenviado':
				return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Reenviado</Badge>;
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-apollo-gray-dark">
					Sistema Limpa Nome
				</h2>
				{canCreateRequest && (
					<Button 
						className="flex items-center"
						disabled={loading}
						onClick={() => setShowForm(true)}
					>
						{loading ? (
							<Loader2 className="h-5 w-5 mr-2 animate-spin" />
						) : (
							<Plus className="h-5 w-5 mr-2" />
						)}
						Nova Solicitação
					</Button>
				)}
			</div>

			<div className="mb-6">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-apollo-gray" />
					<Input
						type="text"
						placeholder="Pesquisar por nome, CPF/CNPJ, telefone ou status..."
						className="w-full pl-10 pr-4 py-2"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<div className="rounded-md border overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>CPF/CNPJ</TableHead>
							<TableHead>Nome</TableHead>
							<TableHead>Telefone</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>SERASA</TableHead>
							<TableHead>BOA VISTA</TableHead>
							<TableHead>CENPROT</TableHead>
							<TableHead>SPC</TableHead>
							<TableHead>Data</TableHead>
							{(canUpdateRequest || canDeleteRequest) && (
								<TableHead className="text-center">Ações</TableHead>
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell
									colSpan={(canUpdateRequest || canDeleteRequest) ? 10 : 9}
									className="text-center py-10"
								>
									<div className="flex justify-center items-center">
										<Loader2 className="h-8 w-8 animate-spin text-apollo-yellow" />
										<span className="ml-2">Carregando...</span>
									</div>
								</TableCell>
							</TableRow>
						) : requests.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={(canUpdateRequest || canDeleteRequest) ? 10 : 9}
									className="text-center py-4"
								>
									Nenhuma solicitação encontrada
								</TableCell>
							</TableRow>
						) : (
							requests.map((request) => (
								<TableRow key={request.id}>
									<TableCell>{request.cpf_cnpj}</TableCell>
									<TableCell>{request.name}</TableCell>
									<TableCell>{request.phone || '-'}</TableCell>
									<TableCell>{getStatusBadge(request.status)}</TableCell>
									<TableCell>{getBureauStatusBadge(request.serasa)}</TableCell>
									<TableCell>{getBureauStatusBadge(request.boa_vista)}</TableCell>
									<TableCell>{getBureauStatusBadge(request.cenprot)}</TableCell>
									<TableCell>{getBureauStatusBadge(request.spc)}</TableCell>
									<TableCell>{new Date(request.createdAt).toLocaleDateString('pt-BR')}</TableCell>
									{(canUpdateRequest || canDeleteRequest) && (
										<TableCell>
											<div className="flex justify-center space-x-2">
												{canUpdateRequest && (
													<Button
														onClick={() => handleEditRequest(request)}
														variant="ghost"
														size="icon"
														className="h-8 w-8 p-0"
														disabled={loading}
													>
														<Edit className="h-4 w-4 text-apollo-yellow" />
													</Button>
												)}
												{canDeleteRequest && (
													<Button
														onClick={() => handleDeleteRequest(request.id)}
														variant="ghost"
														size="icon"
														className="h-8 w-8 p-0"
														disabled={loading}
													>
														<Trash2 className="h-4 w-4 text-red-500" />
													</Button>
												)}
											</div>
										</TableCell>
									)}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
			
			<Dialog open={showForm} onOpenChange={setShowForm}>
				<DialogContent className="max-w-4xl">
					<RequestForm
						request={getRequestFormData()}
						onSave={handleSaveRequest}
						onCancel={handleCancelForm}
						isSubmitting={loading}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
} 