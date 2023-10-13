import {MatSnackBar} from "@angular/material/snack-bar";

export function showSuccessSnackbar(message: string, snackBar: MatSnackBar) {
  snackBar.open(message, 'OK', {
    duration: 2000,
    panelClass: ['success-snackbar']
  });
}
