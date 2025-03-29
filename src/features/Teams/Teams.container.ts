import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useUserStore } from "@/stores/user.store";
import { TeamFormData } from "@/components/team/TeamForm";

// Define the Team interface
export interface Team {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  members: number;
  status: "active" | "inactive";
  membersLimit: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  department: string;
  location: string;
  startDate: string;
  tags: string;
}

export default function TeamsContainer() {
  const { userInfo } = useUserStore();
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "T001",
      name: "Equipe de Desenvolvimento",
      description: "Responsável pelo desenvolvimento de produtos",
      createdAt: new Date(2023, 5, 15).toISOString(),
      members: 8,
      status: "active",
      membersLimit: "10",
      leadName: "João Silva",
      leadEmail: "joao@example.com",
      leadPhone: "(11) 98765-4321",
      department: "Tecnologia",
      location: "São Paulo",
      startDate: "2023-05-15",
      tags: "desenvolvimento, tecnologia"
    },
    {
      id: "T002",
      name: "Equipe de Suporte",
      description: "Responsável pelo suporte ao cliente",
      createdAt: new Date(2023, 8, 22).toISOString(),
      members: 5,
      status: "active",
      membersLimit: "8",
      leadName: "Maria Oliveira",
      leadEmail: "maria@example.com",
      leadPhone: "(11) 91234-5678",
      department: "Atendimento",
      location: "Rio de Janeiro",
      startDate: "2023-08-22",
      tags: "suporte, atendimento"
    },
    {
      id: "T003",
      name: "Equipe de Marketing",
      description: "Responsável pelas estratégias de marketing",
      createdAt: new Date(2023, 10, 5).toISOString(),
      members: 3,
      status: "inactive",
      membersLimit: "5",
      leadName: "Carlos Mendes",
      leadEmail: "carlos@example.com",
      leadPhone: "(11) 97777-8888",
      department: "Marketing",
      location: "Home Office",
      startDate: "2023-10-05",
      tags: "marketing, digital"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Check if user has specific permission
  const hasPermission = useCallback((permissionName: string, module: string) => {
    if (!userInfo?.permissions) return false;
    
    return userInfo.permissions.some(
      perm => perm.name === permissionName && perm.module === module
    );
  }, [userInfo]);

  // Memoized permission checks
  const canCreateTeam = useMemo(() => hasPermission("CREATE", "TEAMS"), [hasPermission]);
  const canUpdateTeam = useMemo(() => hasPermission("UPDATE", "TEAMS"), [hasPermission]);
  const canDeleteTeam = useMemo(() => hasPermission("DELETE", "TEAMS"), [hasPermission]);

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
  const handleEditTeam = useCallback((team: Team) => {
    if (!canUpdateTeam) {
      toast.error("Você não tem permissão para editar associações.");
      return;
    }
    
    setEditingTeam(team);
    setShowForm(true);
  }, [canUpdateTeam]);

  // Delete team handler
  const handleDeleteTeam = useCallback((id: string) => {
    if (!canDeleteTeam) {
      toast.error("Você não tem permissão para excluir associações.");
      return;
    }
    
    // In a real app, you would call an API to delete the team
    setTeams(prevTeams => prevTeams.filter(team => team.id !== id));
    toast.success("Associação excluída com sucesso!");
  }, [canDeleteTeam]);

  // Form submission handler
  const handleSaveTeam = useCallback((data: TeamFormData) => {
    // Check permissions based on whether editing or creating
    if (editingTeam && !canUpdateTeam) {
      toast.error("Você não tem permissão para editar associações.");
      return;
    } else if (!editingTeam && !canCreateTeam) {
      toast.error("Você não tem permissão para criar associações.");
      return;
    }
    
    // In a real app, you would call an API to create/update the team
    if (editingTeam) {
      setTeams(prevTeams => 
        prevTeams.map(team => 
          team.id === editingTeam.id ? { 
            ...team, 
            ...data
          } : team
        )
      );
      toast.success("Associação atualizada com sucesso!");
    } else {
      const newTeam: Team = {
        id: `T${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        createdAt: new Date().toISOString(),
        members: 0,
        ...data
      };
      setTeams(prevTeams => [...prevTeams, newTeam]);
      toast.success("Associação criada com sucesso!");
    }
    setShowForm(false);
    setEditingTeam(null);
  }, [editingTeam, canCreateTeam, canUpdateTeam]);

  // Cancel form handler
  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setEditingTeam(null);
  }, []);

  // Memoize the filtered teams to avoid recalculation on every render
  const filteredTeams = useMemo(() => 
    teams.filter(team => 
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.tags.toLowerCase().includes(searchTerm.toLowerCase())
    ), 
    [teams, searchTerm]
  );

  return {
    teams: filteredTeams,
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
    canDeleteTeam
  };
} 