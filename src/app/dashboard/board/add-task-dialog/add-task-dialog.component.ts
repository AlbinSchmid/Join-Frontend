import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AddTaskFormComponent } from '../../../shared/components/add-task-form/add-task-form.component';

@Component({
  selector: 'app-add-task-dialog',
  imports: [
    AddTaskFormComponent
  ],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss',
  standalone: true
})
export class AddTaskDialogComponent {
  dialogRef = inject(MatDialogRef<AddTaskDialogComponent>);


  /**
   * Closes the dialog.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
