import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { Article, ARTICLE_STATUS_LABELS } from '../../../core/models';
import { ArticleService } from '../../../core/services/article.service';

@Component({
  selector: 'app-articles-public',
  imports: [
    RouterLink,
    DatePipe,
    MatButton,
    MatIcon,
    MatProgressSpinner,
  ],
  templateUrl: './articles-public.html',
  styleUrl: './articles-public.scss',
})
export class ArticlesPublic implements OnInit {
  protected readonly articles = signal<Article[]>([]);
  protected readonly loading = signal(true);

  private readonly route = inject(ActivatedRoute);
  private readonly articleService = inject(ArticleService);

  protected labId = 0;
  protected readonly statusLabels = ARTICLE_STATUS_LABELS;

  ngOnInit(): void {
    this.labId = Number(this.route.snapshot.paramMap.get('labId'));
    this.articleService.getPublished(this.labId).subscribe({
      next: articles => {
        this.articles.set(articles);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
