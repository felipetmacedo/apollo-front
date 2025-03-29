import React, { useCallback } from 'react';

// Shadcn UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Form utilities
import { 
  createRequiredStringField, 
  createEmailField,
  createPhoneField,
  createNumericField,
  createOptionalStringField 
} from '@/utils/form-utils';

export type TeamStatus = 'active' | 'inactive';

interface TeamFormProps {
  team?: TeamFormData | null;
  onSave: (team: TeamFormData) => void;
  onCancel: () => void;
}

export interface TeamFormData {
  name: string;
  description: string;
  status: TeamStatus;
  membersLimit: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  department: string;
  location: string;
  startDate: string;
  tags: string;
}

// Create a zod schema that matches TeamFormData using utility functions
const teamFormSchema = z.object({
  name: createRequiredStringField('Nome da associação'),
  description: createRequiredStringField('Descrição'),
  status: z.enum(['active', 'inactive']),
  membersLimit: createNumericField('Limite de membros'),
  leadName: createRequiredStringField('Nome do responsável'),
  leadEmail: createEmailField(),
  leadPhone: createPhoneField(),
  department: createRequiredStringField('Departamento'),
  location: createRequiredStringField('Localização'),
  startDate: createOptionalStringField(),
  tags: createOptionalStringField(),
});

// Form schema type that matches TeamFormData
type TeamFormSchema = z.infer<typeof teamFormSchema>;

const TeamForm: React.FC<TeamFormProps> = ({ team, onSave, onCancel }) => {
  // Initialize form with Zod schema
  const form = useForm<TeamFormSchema>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      membersLimit: '',
      leadName: '',
      leadEmail: '',
      leadPhone: '',
      department: '',
      location: '',
      startDate: '',
      tags: '',
    }
  });


  // Handle form submission using useCallback
  const handleSubmit = useCallback((data: TeamFormSchema) => {
    onSave(data as TeamFormData);
  }, [onSave]);

  // Cancel form with useCallback
  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <div className="p-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Associação</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome da associação" {...field} />
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
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite a descrição da associação"
                      className="resize-none min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departamento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Marketing, TI, Vendas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="membersLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Limite de Membros</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leadName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Responsável</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome completo do responsável" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leadEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail do Responsável</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="leadPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone do Responsável</FormLabel>
                  <FormControl>
                    <Input placeholder="(99) 99999-9999" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: São Paulo, Home Office" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Início</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags/Categorias</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: projeto, cliente, estratégico" {...field} />
                  </FormControl>
                  <p className="text-xs text-gray-500 mt-1">Separe as tags por vírgulas</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-apollo-yellow text-apollo-gray-dark hover:bg-apollo-yellow/90"
            >
              {team ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TeamForm; 