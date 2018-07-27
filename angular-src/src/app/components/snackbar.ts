import { MatSnackBar } from '@angular/material';

export function openSnackbar(snackBar: MatSnackBar, msg: string){
    snackBar.open(msg, null, {
        duration: 4000
    });
}