import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserPlus, Users } from 'lucide-react';

interface EmptyStateProps {
  onAddGuest: () => void;
  onUseTemplate?: (templateName: string) => void;
}

/**
 * EmptyState - Muestra ayuda cuando no hay invitados
 *
 * Implementa UX Principio #3: Empty State con Templates
 * En lugar de solo un botón "Crear", ofrece plantillas y opciones rápidas
 * para que los usuarios experimenten el valor del producto más rápido
 */
export function EmptyState({ onAddGuest, onUseTemplate }: EmptyStateProps) {
  const templates = [
    {
      name: 'Pastor Juan García',
      church: 'Iglesia Central',
      city: 'Ciudad Principal',
    },
    {
      name: 'Pastor María López',
      church: 'Iglesia Nueva Vida',
      city: 'Ciudad Satélite',
    },
    {
      name: 'Pastor Carlos Mendez',
      church: 'Iglesia del Valle',
      city: 'Ciudad Norte',
    },
  ];

  return (
    <div className='flex flex-col items-center justify-center py-16 px-4'>
      <div className='text-center mb-8'>
        <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4'>
          <Users className='w-8 h-8 text-muted-foreground' />
        </div>
        <h3 className='text-2xl font-semibold mb-2'>No hay invitados aún</h3>
        <p className='text-muted-foreground max-w-md'>
          Empieza agregando tus primeros invitados para gestionar la lista de
          asistentes al evento
        </p>
      </div>

      <div className='flex flex-col gap-4 w-full max-w-2xl'>
        {/* Botón principal para crear desde cero */}
        <Button
          onClick={onAddGuest}
          size='lg'
          className='w-full sm:w-auto mx-auto'
        >
          <UserPlus className='w-5 h-5 mr-2' />
          Añadir Primer Invitado
        </Button>

        {/* UX Principio #3: Plantillas rápidas para empezar */}
        {onUseTemplate && (
          <div className='mt-4'>
            <p className='text-sm text-muted-foreground text-center mb-3'>
              O comienza con una plantilla de ejemplo:
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
              {templates.map((template, index) => (
                <Card
                  key={index}
                  className='cursor-pointer hover:border-primary transition-colors'
                  onClick={() => onUseTemplate(template.name)}
                >
                  <CardContent className='p-4'>
                    <div className='flex items-start gap-3'>
                      <div className='flex-shrink-0'>
                        <div className='w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center'>
                          <Users className='w-5 h-5 text-primary' />
                        </div>
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-sm truncate'>
                          {template.name}
                        </p>
                        <p className='text-xs text-muted-foreground truncate'>
                          {template.church}
                        </p>
                        <p className='text-xs text-muted-foreground truncate'>
                          {template.city}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className='text-xs text-muted-foreground text-center mt-3'>
              Click en una plantilla para agregarla rápidamente
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
