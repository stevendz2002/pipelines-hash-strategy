import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { AnimeResponse } from '../models/anime.model';
import { AnimeService } from '../services/anime.service';

interface AnimeViewState {
  loading: boolean;
  data: AnimeResponse | null;
  error: string;
}

@Component({
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf],
  template: `
    <section class="page-heading">
      <p class="eyebrow">Ruta #/anime</p>
      <h1>Catálogo de Anime</h1>
      <p>Lista de anime consultada directamente desde Kitsu API.</p>
    </section>

    <ng-container *ngIf="anime$ | async as state">
      <p class="status" *ngIf="state.loading">Cargando anime...</p>
      <p class="error" *ngIf="state.error">{{ state.error }}</p>

      <div class="pokemon-grid" *ngIf="state.data">
        <article class="pokemon-card anime-card" *ngFor="let anime of state.data.data">
          <img
            [src]="anime.attributes.posterImage?.medium || anime.attributes.posterImage?.small || 'assets/placeholder.png'"
            [alt]="anime.attributes.canonicalTitle"
            loading="lazy"
          />
          <h2>{{ anime.attributes.canonicalTitle }}</h2>
          <a
            [href]="'https://kitsu.app/anime/' + (anime.attributes.slug || anime.id)"
            target="_blank"
            rel="noreferrer"
          >
            Ver en Kitsu ↗
          </a>
        </article>
      </div>
    </ng-container>
  `,
  styles: [`
    .anime-card img {
      width: 100%;
      max-width: 160px;
      height: 230px;
      object-fit: cover;
      border-radius: 0.5rem;
      image-rendering: auto;
      margin: 0 auto;
      display: block;
    }
    .anime-card h2 {
      font-size: 1.05rem;
      margin: 0.75rem 0 0.5rem;
      min-height: 2.8rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class AnimeListComponent {
  private readonly animeService = inject(AnimeService);

  readonly anime$: Observable<AnimeViewState> = this.animeService.getAnime().pipe(
    map((data) => ({ loading: false, data, error: '' })),
    startWith({ loading: true, data: null, error: '' }),
    catchError(() => of({ loading: false, data: null, error: 'No se pudo cargar la lista de anime.' })),
  );
}
