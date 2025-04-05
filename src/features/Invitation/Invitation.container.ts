import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/user.store';
import { getInvitationLink, getInvitedUsers } from '@/processes/invitation';
import { useQuery } from '@tanstack/react-query';

export default function InvitationContainer() {
  const { userInfo } = useUserStore();
  const [invitationLink, setInvitationLink] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Get invitation link on component mount
  useEffect(() => {
    const fetchInvitationLink = async () => {
      try {
        setLoading(true);
        const response = await getInvitationLink();
        setInvitationLink(response.token ? `${window.location.origin}/register?token=${response.token}` : response.link);
      } catch (error) {
        toast.error('Erro ao buscar link de convite');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitationLink();
  }, []);

  // Fetch paginated invited users
  const { data: invitedUsersData, isLoading: isUsersLoading } = useQuery({
    queryKey: ['invitedUsers'],
    queryFn: () => getInvitedUsers(),
  });

  // Handle copy link to clipboard
  const handleCopyLink = useCallback(() => {
    if (!invitationLink) return;
    
    try {
      const textArea = document.createElement('textarea');
      textArea.value = invitationLink;
      textArea.style.position = 'fixed';  // Prevent scrolling to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        toast.success('Link copiado para a área de transferência!');
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } else {
        toast.error('Erro ao copiar link');
      }
    } catch (error) {
      toast.error('Erro ao copiar link');
      console.error(error);
    }
  }, [invitationLink]);

  return {
    invitationLink,
    loading: loading || isUsersLoading,
    copied,
    handleCopyLink,
    userInfo,
    invitedUsers: invitedUsersData?.items || [],
  };
} 