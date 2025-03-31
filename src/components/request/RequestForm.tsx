import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useCallback } from 'react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form utilities
import {
  createRequiredStringField,
  createOptionalStringField,
} from '@/utils/form-utils';

// Form validation schema
const formSchema = z.object({
  id: z.string().optional(),
  cpf_cnpj: createRequiredStringField('CPF/CNPJ'),
  name: createRequiredStringField('Nome'),
  phone: createOptionalStringField(),
  status: z.string(),
  serasa: z.enum(['limpo', 'andamento', 'negado', 'reenviado']),
  boa_vista: z.enum(['limpo', 'andamento', 'negado', 'reenviado']),
  cenprot: z.enum(['limpo', 'andamento', 'negado', 'reenviado']),
  spc: z.enum(['limpo', 'andamento', 'negado', 'reenviado']),
});

// Define the form data type from the schema
type FormData = z.infer<typeof formSchema>;

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

interface RequestFormProps {
  request: RequestFormData | null;
  onSave: (data: RequestFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const RequestForm: React.FC<RequestFormProps> = ({ request, onSave, onCancel, isSubmitting }) => {
  const isEditing = !!request?.id;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: request?.id,
      cpf_cnpj: request?.cpf_cnpj || '',
      name: request?.name || '',
      phone: request?.phone || '',
      status: request?.status || 'Pendente',
      serasa: request?.serasa || 'andamento',
      boa_vista: request?.boa_vista || 'andamento',
      cenprot: request?.cenprot || 'andamento',
      spc: request?.spc || 'andamento',
    },
  });

  const handleSubmit = useCallback(
    (data: FormData) => {
      onSave(data as RequestFormData);
    },
    [onSave]
  );

  const statusOptions = [
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Pago', label: 'Pago' },
    { value: 'Enviado', label: 'Enviado' }
  ];

  const bureauStatusOptions = [
    { value: 'limpo', label: 'Limpo' },
    { value: 'andamento', label: 'Em Andamento' },
    { value: 'negado', label: 'Negado' },
    { value: 'reenviado', label: 'Reenviado' }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <h2 className="text-xl font-bold">
          {isEditing ? 'Editar Solicitação' : 'Nova Solicitação'}
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="cpf_cnpj"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF/CNPJ</FormLabel>
                <FormControl>
                  <Input placeholder="000.000.000-00 ou 00.000.000/0000-00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serasa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SERASA</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bureauStatusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="boa_vista"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BOA VISTA</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bureauStatusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cenprot"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CENPROT</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bureauStatusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="spc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SPC</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bureauStatusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Salvando...' : 'Criando...'}
              </>
            ) : (
              isEditing ? 'Salvar' : 'Criar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RequestForm; 