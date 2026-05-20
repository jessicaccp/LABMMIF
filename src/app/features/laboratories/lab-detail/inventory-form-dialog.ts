import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

import { InventoryItem, ItemCondition, ITEM_CONDITION_LABELS } from '../../../core/models';
import { InventoryService, CreateInventoryItemPayload } from '../../../core/services/inventory.service';

export interface InventoryFormData {
  labId: number;
  item?: InventoryItem;
}

@Component({
  selector: 'app-inventory-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatFormField,
    MatLabel,
    MatError,
    MatHint,
    MatInput,
    MatOption,
    MatSelect,
  ],
  templateUrl: './inventory-form-dialog.html',
})
export class InventoryFormDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<InventoryFormDialog>);
  readonly data = inject<InventoryFormData>(MAT_DIALOG_DATA);
  private readonly inventoryService = inject(InventoryService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly conditions = Object.values(ItemCondition);
  protected readonly conditionLabels = ITEM_CONDITION_LABELS;
  protected readonly isEdit = !!this.data.item;

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    description: [''],
    serial_number: [''],
    quantity: [1, [Validators.required, Validators.min(1)]],
    condition: [ItemCondition.GOOD, Validators.required],
    assigned_to_id: [null as number | null],
  });

  ngOnInit(): void {
    if (this.data.item) {
      const i = this.data.item;
      this.form.patchValue({
        name: i.name,
        category: i.category,
        description: i.description ?? '',
        serial_number: i.serial_number ?? '',
        quantity: i.quantity,
        condition: i.condition,
        assigned_to_id: i.assigned_to_id,
      });
    }
  }

  protected submit(): void {
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const payload: CreateInventoryItemPayload = {
      name: raw.name,
      category: raw.category,
      ...(raw.description && { description: raw.description }),
      ...(raw.serial_number && { serial_number: raw.serial_number }),
      quantity: raw.quantity,
      condition: raw.condition,
      assigned_to_id: raw.assigned_to_id ?? null,
    };

    const call = this.isEdit
      ? this.inventoryService.update(this.data.labId, this.data.item!.id, payload)
      : this.inventoryService.create(this.data.labId, payload);

    call.subscribe({
      next: item => this.dialogRef.close(item),
      error: err =>
        this.snackBar.open(err.error?.message ?? 'Failed to save item', 'Dismiss', {
          duration: 3000,
        }),
    });
  }

  protected cancel(): void {
    this.dialogRef.close();
  }
}
