import { Gift, Link, Copy, Check, Loader2 } from 'lucide-react';

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
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

import InvitationContainer from './Invitation.container';

export default function Invitation() {
  const {
    invitationLink,
    loading,
    copied,
    handleCopyLink
  } = InvitationContainer();

  return (
    <div className="p-6 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <Gift className="h-6 w-6" />
            Programa de Indicação
          </CardTitle>
          <CardDescription>
            Compartilhe o link de convite e ganhe pontos para cada novo membro
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert>
            <AlertTitle className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Programa de Recompensas
            </AlertTitle>
            <AlertDescription>
              Para cada novo membro que se juntar usando seu link de convite, você receberá uma comissão.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col space-y-2">
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
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : copied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
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
  );
} 