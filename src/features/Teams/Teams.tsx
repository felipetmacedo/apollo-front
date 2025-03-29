import { Search, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
import { Badge } from '@/components/ui/badge';
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog";

// Import TeamForm component
import TeamForm from '@/components/team-form'

// Container
import useTeamsContainer from './Teams.container';

export default function Teams() {
	const {
		teams,
		searchTerm,
		setSearchTerm,
		handleEditTeam,
		handleDeleteTeam,
		handleSaveTeam,
		handleCancelForm,
		editingTeam,
		showForm,
		setShowForm,
		canCreateTeam,
		canUpdateTeam,
		canDeleteTeam
	} = useTeamsContainer();

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-apollo-gray-dark">
					Associações
				</h2>
				{canCreateTeam && (
					<Dialog open={showForm} onOpenChange={setShowForm}>
						<DialogTrigger asChild>
							<Button 
								className="flex items-center bg-apollo-yellow text-apollo-gray-dark hover:bg-apollo-yellow/90"
							>
								<Plus className="h-5 w-5 mr-2" />
								Nova Associação
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-4xl">
							<TeamForm
								team={editingTeam}
								onSave={handleSaveTeam}
								onCancel={handleCancelForm}
							/>
						</DialogContent>
					</Dialog>
				)}
			</div>

			<div className="mb-6">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-apollo-gray" />
					<Input
						type="text"
						placeholder="Pesquisar por nome, descrição, departamento ou responsável..."
						className="w-full pl-10 pr-4 py-2"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>Nome</TableHead>
							<TableHead>Descrição</TableHead>
							<TableHead>Departamento</TableHead>
							<TableHead>Data de Criação</TableHead>
							<TableHead>Membros</TableHead>
							<TableHead>Status</TableHead>
							{(canUpdateTeam || canDeleteTeam) && (
								<TableHead className="text-center">Ações</TableHead>
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						{teams.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={(canUpdateTeam || canDeleteTeam) ? 8 : 7}
									className="text-center py-4"
								>
									Nenhuma associação encontrada
								</TableCell>
							</TableRow>
						) : (
							teams.map((team) => (
								<TableRow key={team.id}>
									<TableCell className="font-medium">
										{team.id}
									</TableCell>
									<TableCell>{team.name}</TableCell>
									<TableCell>{team.description}</TableCell>
									<TableCell>{team.department}</TableCell>
									<TableCell>
										{format(
											new Date(team.createdAt),
											'dd/MM/yyyy',
											{
												locale: ptBR,
											}
										)}
									</TableCell>
									<TableCell>{team.members}/{team.membersLimit}</TableCell>
									<TableCell>
										<Badge
											variant={
												team.status === 'active'
													? 'default'
													: 'outline'
											}
											className={
												team.status === 'active'
													? 'bg-green-100 text-green-800 hover:bg-green-100'
													: 'bg-red-100 text-red-800 hover:bg-red-100'
											}
										>
											{team.status === 'active' ? (
												<CheckCircle className="h-3.5 w-3.5 mr-1" />
											) : (
												<XCircle className="h-3.5 w-3.5 mr-1" />
											)}
											{team.status === 'active'
												? 'Ativo'
												: 'Inativo'}
										</Badge>
									</TableCell>
									{(canUpdateTeam || canDeleteTeam) && (
										<TableCell>
											<div className="flex justify-center space-x-2">
												{canUpdateTeam && (
													<Button
														onClick={() => handleEditTeam(team)}
														variant="ghost"
														size="icon"
														className="h-8 w-8 p-0"
													>
														<Edit className="h-4 w-4 text-apollo-yellow" />
													</Button>
												)}
												{canDeleteTeam && (
													<Button
														onClick={() => handleDeleteTeam(team.id)}
														variant="ghost"
														size="icon"
														className="h-8 w-8 p-0"
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
		</div>
	);
}
