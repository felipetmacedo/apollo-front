import { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/user.store';
import { TeamFormData } from '@/components/team/TeamForm';
import {
	createTeam,
	getTeams,
	deleteTeam,
	updateTeam,
	TeamResponse,
} from '@/processes/team';

// Define the Team interface to match our UI needs and API response
export interface Team {
	id: string;
	cnpj: string;
	name: string;
	email: string;
	address: {
		number: string;
		complement?: string;
		neighborhood: string;
		city: string;
		state: string;
		cep: string;
		address?: string;
	};
	created_at: string;
	updated_at: string;
}

// Utility function to convert TeamResponse to Team interface
const teamResponseToTeam = (teamResponse: TeamResponse): Team => {
	// Ensure valid date conversion
	const safeDate = (dateStr: string | undefined): string => {
		if (!dateStr) return new Date().toISOString();

		// No need for try/catch, just check if the date is valid
		const date = new Date(dateStr);
		// Check if date is valid
		if (!isNaN(date.getTime())) {
			return date.toISOString();
		}
		return new Date().toISOString();
	};

	return {
		id: teamResponse.id,
		cnpj: teamResponse.cnpj,
		name: teamResponse.name,
		email: teamResponse.email,
		address: {
			number: teamResponse.address.number || '',
			complement: teamResponse.address.complement || '',
			neighborhood: teamResponse.address.neighborhood || '',
			city: teamResponse.address.city || '',
			state: teamResponse.address.state || '',
			cep: teamResponse.address.cep || '',
			address: teamResponse.address.address || ''
		},
		created_at: safeDate(teamResponse.createdAt),
		updated_at: safeDate(teamResponse.updatedAt),
	};
};

export default function TeamsContainer() {
	const { userInfo } = useUserStore();
	const [teams, setTeams] = useState<Team[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [editingTeam, setEditingTeam] = useState<Team | null>(null);
	const [showForm, setShowForm] = useState(false);

	// Function to fetch teams from API
	const fetchTeams = useCallback(async () => {
		try {
			setLoading(true);
			const teamsData = await getTeams();
			// Convert TeamResponse[] to Team[] using the utility function
			const mappedTeams = teamsData.map(teamResponseToTeam);
			setTeams(mappedTeams);
		} catch (error) {
			toast.error('Erro ao buscar associações');
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchTeams();
	}, [fetchTeams]);

	// Check if user has specific permission
	const hasPermission = useCallback(
		(permissionName: string, module: string) => {
			if (!userInfo?.permissions) return false;

			return userInfo.permissions.some(
				(perm) => perm.name === permissionName && perm.module === module
			);
		},
		[userInfo]
	);

	// Memoized permission checks
	const canCreateTeam = useMemo(
		() => hasPermission('CREATE', 'TEAMS'),
		[hasPermission]
	);
	const canUpdateTeam = useMemo(
		() => hasPermission('UPDATE', 'TEAMS'),
		[hasPermission]
	);
	const canDeleteTeam = useMemo(
		() => hasPermission('DELETE', 'TEAMS'),
		[hasPermission]
	);

	// Set search term with useCallback
	const handleSetSearchTerm = useCallback((value: string) => {
		setSearchTerm(value);
	}, []);

	// Show/hide form with useCallback
	const handleShowForm = useCallback((value: boolean) => {
		setShowForm(value);
		if (!value) {
			setEditingTeam(null);
		}
	}, []);

	// Edit team handler
	const handleEditTeam = useCallback(
		(team: Team) => {
			if (!canUpdateTeam) {
				toast.error('Você não tem permissão para editar associações.');
				return;
			}

			setEditingTeam(team);
			setShowForm(true);
		},
		[canUpdateTeam]
	);

	// Delete team handler
	const handleDeleteTeam = useCallback(
		async (id: string) => {
			if (!canDeleteTeam) {
				toast.error('Você não tem permissão para excluir associações.');
				return;
			}

			try {
				setLoading(true);
				await deleteTeam(id);
				setTeams((prevTeams) =>
					prevTeams.filter((team) => team.id !== id)
				);
				toast.success('Associação excluída com sucesso!');
			} catch (error) {
				toast.error('Erro ao excluir associação');
				console.error(error);
			} finally {
				setLoading(false);
			}
		},
		[canDeleteTeam]
	);

	// Form submission handler
	const handleSaveTeam = useCallback(
		async (data: TeamFormData) => {
			// Check permissions based on whether editing or creating
			if (editingTeam && !canUpdateTeam) {
				toast.error('Você não tem permissão para editar associações.');
				return;
			} else if (!editingTeam && !canCreateTeam) {
				toast.error('Você não tem permissão para criar associações.');
				return;
			}

			try {
				setLoading(true);

				if (editingTeam) {
					// Update existing team
					const updatedTeamResponse = await updateTeam({
						id: editingTeam.id,
						...data,
					});

					// Convert TeamResponse to Team
					const updatedTeam = teamResponseToTeam(updatedTeamResponse);

					setTeams((prevTeams) =>
						prevTeams.map((team) =>
							team.id === editingTeam.id ? updatedTeam : team
						)
					);
					toast.success('Associação atualizada com sucesso!');
				} else {
					// Create new team
					const newTeamResponse = await createTeam(data);

					// Convert TeamResponse to Team
					const newTeam = teamResponseToTeam(newTeamResponse);

					setTeams((prevTeams) => [...prevTeams, newTeam]);
					toast.success('Associação criada com sucesso!');
				}

				setShowForm(false);
				setEditingTeam(null);
			} catch (error) {
				toast.error(
					editingTeam
						? 'Erro ao atualizar associação'
						: 'Erro ao criar associação'
				);
				console.error(error);
			} finally {
				setLoading(false);
			}
		},
		[editingTeam, canCreateTeam, canUpdateTeam]
	);

	// Cancel form handler
	const handleCancelForm = useCallback(() => {
		setShowForm(false);
		setEditingTeam(null);
	}, []);

	// Memoize the filtered teams to avoid recalculation on every render
	const filteredTeams = useMemo(
		() =>
			teams.filter(
				(team) =>
					team.name
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					team.cnpj
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					team.email
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					(team.address.city + ' ' + team.address.state)
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
			),
		[teams, searchTerm]
	);

	return {
		teams: filteredTeams,
		loading,
		searchTerm,
		setSearchTerm: handleSetSearchTerm,
		handleEditTeam,
		handleDeleteTeam,
		handleSaveTeam,
		handleCancelForm,
		editingTeam,
		showForm,
		setShowForm: handleShowForm,
		canCreateTeam,
		canUpdateTeam,
		canDeleteTeam,
		refreshTeams: fetchTeams,
	};
}
