import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AnimeResponse } from '../models/anime.model';

@Injectable({ providedIn: 'root' })
export class AnimeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://kitsu.app/api/edge/anime?page[limit]=20';

  getAnime(): Observable<AnimeResponse> {
    return this.http.get<AnimeResponse>(this.apiUrl);
  }
}
