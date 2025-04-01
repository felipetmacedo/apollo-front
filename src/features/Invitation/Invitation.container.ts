import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useUserStore } from '@/stores/user.store';
import { getInvitationLink } from '@/processes/invitation';

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
        setInvitationLink(response.link);
      } catch (error) {
        toast.error('Erro ao buscar link de convite');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvitationLink();
  }, []);

  // Handle copy link to clipboard
  const handleCopyLink = useCallback(() => {
    if (!invitationLink) return;
    
    navigator.clipboard.writeText(invitationLink)
      .then(() => {
        setCopied(true);
        toast.success('Link copiado para a área de transferência!');
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((error) => {
        toast.error('Erro ao copiar link');
        console.error(error);
      });
  }, [invitationLink]);

  return {
    invitationLink,
    loading,
    copied,
    handleCopyLink,
    userInfo
  };
} 