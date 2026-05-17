import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { RoleDefinition } from '../models';

@Injectable({ providedIn: 'root' })
export class RoleService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  list(): Observable<RoleDefinition[]> {
    return this.http.get<RoleDefinition[]>(`${this.api}/roles`);
  }

  create(data: { name: string; level: number }): Observable<RoleDefinition> {
    return this.http.post<RoleDefinition>(`${this.api}/roles`, data);
  }

  delete(key: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/roles/${key}`);
  }
}
