import { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/user.store';
import {
	getUsers,
	createUser,
	updateUser,
	deleteUser,
	User,
	CreateUserPayload,
	UpdateUserPayload
} from '@/processes/user';

// Interface for our component
export interface UserRow {
	id: string;
	name: string;
	email: string;
	phone_number: string;
	document: string;
	address: string;
	number: string;
	complement: string;
	neighborhood: string;
	city: string;
	state: string;
	cep: string;
	createdAt: string;
}

// Form data for user creation/editing
export interface UserFormData {
	id?: string;
	name: string;
	email: string;
	phone_number?: string;
	document: string;
	cep: string;
	address: string;
	number: string;
	complement?: string;
	neighborhood: string;
	city: string;
	state: string;
}

// Convert API response to our component format
const userToUserRow = (user: User): UserRow => {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		phone_number: user.phone_number || '',
		document: user.document || '',
		address: user.address || '',
		number: user.number || '',
		complement: user.complement || '',
		neighborhood: user.neighborhood || '',
		city: user.city || '',
		state: user.state || '',
		cep: user.cep || '',
		createdAt: new Date().toISOString(), // We don't have createdAt from API, this is a placeholder
	};
};

export default function UsersContainer() {
	const { userInfo } = useUserStore();
	const [users, setUsers] = useState<UserRow[]>([]);
	const [loading, setLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [editingUser, setEditingUser] = useState<UserRow | null>(null);
	const [showForm, setShowForm] = useState(false);

	// Function to fetch users from API
	const fetchUsers = useCallback(async () => {
		try {
			setLoading(true);
			const usersData = await getUsers();
			const mappedUsers = usersData.map(userToUserRow);
			setUsers(mappedUsers);
		} catch (error) {
			toast.error('Erro ao buscar usuários');
			console.error(error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

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
	const canCreateUser = useMemo(
		() => hasPermission('CREATE', 'USERS'),
		[hasPermission]
	);
	
	const canUpdateUser = useMemo(
		() => hasPermission('UPDATE', 'USERS'),
		[hasPermission]
	);
	
	const canDeleteUser = useMemo(
		() => hasPermission('DELETE', 'USERS'),
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
			setEditingUser(null);
		}
	}, []);

	// Edit user handler
	const handleEditUser = useCallback(
		(user: UserRow) => {
			if (!canUpdateUser) {
				toast.error('Você não tem permissão para editar usuários.');
				return;
			}

			setEditingUser(user);
			setShowForm(true);
		},
		[canUpdateUser]
	);

	// Delete user handler
	const handleDeleteUser = useCallback(
		async (id: string) => {
			if (!canDeleteUser) {
				toast.error('Você não tem permissão para excluir usuários.');
				return;
			}

			try {
				setLoading(true);
				await deleteUser(id);
				setUsers((prevUsers) =>
					prevUsers.filter((user) => user.id !== id)
				);
				toast.success('Usuário excluído com sucesso!');
			} catch (error) {
				toast.error('Erro ao excluir usuário');
				console.error(error);
			} finally {
				setLoading(false);
			}
		},
		[canDeleteUser]
	);

	// Form submission handler
	const handleSaveUser = useCallback(
		async (data: UserFormData) => {
			// Check permissions based on whether editing or creating
			if (editingUser && !canUpdateUser) {
				toast.error('Você não tem permissão para editar usuários.');
				return;
			} else if (!editingUser && !canCreateUser) {
				toast.error('Você não tem permissão para criar usuários.');
				return;
			}

			try {
				setLoading(true);

				if (editingUser) {
					// Update existing user
					const updatePayload: UpdateUserPayload = {
						name: data.name,
						email: data.email,
						phone_number: data.phone_number,
						document: data.document,
						cep: data.cep,
						address: data.address,
						number: data.number,
						complement: data.complement,
						neighborhood: data.neighborhood,
						city: data.city,
						state: data.state
					};

					const updatedUser = await updateUser(editingUser.id, updatePayload);
					
					// Convert API response to UserRow
					const updatedUserRow = userToUserRow(updatedUser);

					setUsers((prevUsers) =>
						prevUsers.map((user) =>
							user.id === editingUser.id ? updatedUserRow : user
						)
					);
					toast.success('Usuário atualizado com sucesso!');
				} else {
					// Create new user
					const createPayload: CreateUserPayload = {
						name: data.name,
						email: data.email,
						phone_number: data.phone_number,
						document: data.document,
						cep: data.cep,
						address: data.address,
						number: data.number,
						complement: data.complement,
						neighborhood: data.neighborhood,
						city: data.city,
						state: data.state
					};

					const newUser = await createUser(createPayload);
					
					// Convert API response to UserRow
					const newUserRow = userToUserRow(newUser);

					setUsers((prevUsers) => [...prevUsers, {
						...newUserRow,
						createdAt: new Date().toISOString()
					}]);
					toast.success('Usuário criado com sucesso!');
				}

				setShowForm(false);
				setEditingUser(null);
			} catch (error) {
				toast.error(
					editingUser
						? 'Erro ao atualizar usuário'
						: 'Erro ao criar usuário'
				);
				console.error(error);
			} finally {
				setLoading(false);
			}
		},
		[editingUser, canCreateUser, canUpdateUser]
	);

	// Cancel form handler
	const handleCancelForm = useCallback(() => {
		setShowForm(false);
		setEditingUser(null);
	}, []);

	// Memoize the filtered users to avoid recalculation on every render
	const filteredUsers = useMemo(
		() =>
			users.filter(
				(user) =>
					user.name
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					user.email
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					user.phone_number
						?.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					user.document
						?.toLowerCase()
						.includes(searchTerm.toLowerCase())
			),
		[users, searchTerm]
	);

	return {
		users: filteredUsers,
		loading,
		searchTerm,
		setSearchTerm: handleSetSearchTerm,
		handleEditUser,
		handleDeleteUser,
		handleSaveUser,
		handleCancelForm,
		editingUser,
		showForm,
		setShowForm: handleShowForm,
		canCreateUser,
		canUpdateUser,
		canDeleteUser,
		refreshUsers: fetchUsers,
	};
} 