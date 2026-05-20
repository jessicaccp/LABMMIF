import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { InventoryItem, ItemCondition } from '../models';

export interface CreateInventoryItemPayload {
  name: string;
  category: string;
  description?: string;
  serial_number?: string;
  quantity?: number;
  condition?: ItemCondition;
  assigned_to_id?: number | null;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  getAll(labId: number): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.api}/labs/${labId}/inventory`);
  }

  getById(labId: number, itemId: number): Observable<InventoryItem> {
    return this.http.get<InventoryItem>(
      `${this.api}/labs/${labId}/inventory/${itemId}`,
    );
  }

  create(labId: number, data: CreateInventoryItemPayload): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(
      `${this.api}/labs/${labId}/inventory`,
      data,
    );
  }

  update(
    labId: number,
    itemId: number,
    data: Partial<CreateInventoryItemPayload>,
  ): Observable<InventoryItem> {
    return this.http.put<InventoryItem>(
      `${this.api}/labs/${labId}/inventory/${itemId}`,
      data,
    );
  }

  delete(labId: number, itemId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.api}/labs/${labId}/inventory/${itemId}`,
    );
  }
}
