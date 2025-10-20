import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guestName: string;
  onConfirm: () => void;
}

/**
 * DeleteConfirmDialog - Diálogo de confirmación para eliminar invitados
 *
 * Implementa los principios UX #1 y #2:
 * - #1: CTAs claros y específicos ("Eliminar Invitado" vs "Mantener")
 * - #2: Validación antes de eliminar (nunca permitir eliminación directa)
 */
export function DeleteConfirmDialog({
  open,
  onOpenChange,
  guestName,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el
            invitado{' '}
            <span className='font-semibold text-foreground'>{guestName}</span>{' '}
            de la base de datos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* UX Principio #1: Evitar copias genéricas como "Sí/No", usar frases que comuniquen claramente la acción */}
          <AlertDialogCancel>Mantener</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            Sí, Eliminar Invitado
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
