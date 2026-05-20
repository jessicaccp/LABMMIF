import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Article, ArticleStatus } from '../models';

export interface CreateArticlePayload {
  title: string;
  abstract?: string;
  conference?: string;
  doi?: string;
  status?: ArticleStatus;
  submission_deadline?: string;
  published_at?: string;
  authors?: string[];
  in_charge?: string[];
}

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  getAll(labId: number): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.api}/labs/${labId}/articles`);
  }

  getPublished(labId: number): Observable<Article[]> {
    return this.http.get<Article[]>(
      `${this.api}/labs/${labId}/articles?published_only=true`,
    );
  }

  getById(labId: number, articleId: number): Observable<Article> {
    return this.http.get<Article>(
      `${this.api}/labs/${labId}/articles/${articleId}`,
    );
  }

  create(labId: number, data: CreateArticlePayload): Observable<Article> {
    return this.http.post<Article>(`${this.api}/labs/${labId}/articles`, data);
  }

  update(
    labId: number,
    articleId: number,
    data: Partial<CreateArticlePayload>,
  ): Observable<Article> {
    return this.http.put<Article>(
      `${this.api}/labs/${labId}/articles/${articleId}`,
      data,
    );
  }

  delete(labId: number, articleId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.api}/labs/${labId}/articles/${articleId}`,
    );
  }

  deactivate(labId: number, articleId: number): Observable<Article> {
    return this.http.post<Article>(
      `${this.api}/labs/${labId}/articles/${articleId}/deactivate`, {},
    );
  }

  activate(labId: number, articleId: number): Observable<Article> {
    return this.http.post<Article>(
      `${this.api}/labs/${labId}/articles/${articleId}/activate`, {},
    );
  }
}
