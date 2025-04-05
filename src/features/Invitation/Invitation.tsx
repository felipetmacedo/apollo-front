import { Gift, Link, Loader2, CalendarIcon } from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import InvitationContainer from './Invitation.container';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Tooltip } from '@/components/ui/tooltip';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback  } from '@/components/ui/avatar';
import { Mail } from 'lucide-react';

export default function Invitation() {
  const {
    invitationLink,
    loading,
    copied,
    handleCopyLink,
    invitedUsers,
  } = InvitationContainer();

  return (
    <div className="p-2 flex flex-col items-center justify-center">
      <div className="w-full mb-6">
        <Card className="shadow-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
              <Gift className="h-6 w-6" />
              Programa de Indicação
            </CardTitle>
            <CardDescription>
              Para cada novo membro que se juntar usando seu link de convite, você receberá uma comissão.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex items-center justify-between space-x-4">            
            <div className="flex flex-col space-y-2 flex-1">
              <label htmlFor="invitation-link" className="text-sm font-medium">
                Seu Link de Convite
              </label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="invitation-link"
                    type="text"
                    value={loading ? "Carregando link..." : invitationLink}
                    className="pl-10 pr-4 py-2"
                    readOnly
                  />
                </div>
                <Button 
                  onClick={handleCopyLink}
                  disabled={loading}
                  className={copied ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            Ajude a crescer nossa comunidade e ganhe recompensas!
          </CardFooter>
        </Card>
      </div>

      <div className="w-full space-y-4 max-h-[600px] overflow-y-auto pr-2 pb-2">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-apollo-yellow" />
            <span className="ml-2">Carregando...</span>
          </div>
        ) : invitedUsers.length === 0 ? (
          <div className="text-center py-4">
            Nenhum usuário encontrado
          </div>
        ) : (
          invitedUsers.map((member) => (
            <Card
            key={member.id}
            className="w-full overflow-hidden transition-all duration-200 hover:shadow-lg border-l-4 border-l-yellow-400 border-t border-r border-b border-yellow-200"
          >
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-yellow-200 bg-yellow-50">
                    <AvatarFallback className="bg-yellow-100 text-yellow-800">
                      {member.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{member.user.name}</h3>
                    </div>
  
                    <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{member.user.email}</span>
                    </div>
                  </div>
                </div>
  
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 ml-0 sm:ml-auto">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-yellow-50 px-3 py-1.5 rounded-full">
                          <CalendarIcon className="h-3.5 w-3.5 text-yellow-600" />
                          <span>{new Date(member.user.created_at).toLocaleDateString()}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Join date</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  );
} 