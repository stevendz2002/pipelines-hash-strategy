import { AsyncPipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith, switchMap } from 'rxjs';
import { PokemonFilterService, FilteredPokemon } from '../services/pokemon-filter.service';

interface FilterViewState {
  loading: boolean;
  data: FilteredPokemon[] | null;
  error: string;
}

@Component({
  selector: 'app-pokemon-filter',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, TitleCasePipe],
  template: `
    <section class="page-heading">
      <p class="eyebrow">Ruta #/filter</p>
      <h1>Filtro por Tipo</h1>
      <p>Selecciona un tipo elemental para descubrir qué Pokémon pertenecen a él.</p>
    </section>

    <!-- Lista de Filtros (Tipos) -->
    <div class="filters" *ngIf="types$ | async as types" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 2rem; justify-content: center;">
      <button 
        *ngFor="let type of types"
        (click)="selectType(type.name)"
        [class.active]="selectedType === type.name"
        style="padding: 8px 16px; border-radius: 20px; border: 1px solid #ccc; cursor: pointer; font-weight: bold; background: white; transition: all 0.2s;"
      >
        {{ type.name | titlecase }}
      </button>
    </div>

    <!-- Resultados (Grilla de Pokémon) -->
    <ng-container *ngIf="pokemonState$ | async as state">
      <p class="status" *ngIf="state.loading" style="text-align: center;">Cargando Pokémon del tipo {{ selectedType }}...</p>
      <p class="error" *ngIf="state.error">{{ state.error }}</p>
      
      <div class="pokemon-grid" *ngIf="state.data && !state.loading">
        <article class="pokemon-card" *ngFor="let pokemon of state.data">
          <img 
            [src]="pokemon.artworkUrl" 
            [alt]="pokemon.name" 
            style="width: 100%; height: auto; max-width: 150px; display: block; margin: 0 auto;"
            loading="lazy"
          />
          <h2>{{ pokemon.name | titlecase }}</h2>
          <a [href]="pokemon.url" target="_blank" rel="noreferrer">Ver detalle ↗</a>
        </article>
      </div>
    </ng-container>
  `
})
export class PokemonFilterComponent {
  private readonly filterService = inject(PokemonFilterService);
  
  // Empezamos con un tipo por defecto para que la pantalla no aparezca vacía
  selectedType = 'electric';
  private readonly typeSubject = new BehaviorSubject<string>(this.selectedType);

  // 1. Observable que carga los botones de los tipos
  readonly types$ = this.filterService.getTypes();

  // 2. Observable reactivo: Cada vez que 'typeSubject' emite un nuevo valor (se hace clic), 
  // cancela la petición anterior y hace una nueva con el tipo seleccionado (switchMap).
  readonly pokemonState$: Observable<FilterViewState> = this.typeSubject.pipe(
    switchMap(type => this.filterService.getPokemonByType(type).pipe(
      map(data => ({ loading: false, data, error: '' })),
      startWith({ loading: true, data: null, error: '' }),
      catchError(() => of({ loading: false, data: null, error: 'No se pudo cargar la lista.' }))
    ))
  );

  // Método que se llama al hacer clic en un botón de tipo
  selectType(typeName: string) {
    this.selectedType = typeName;
    this.typeSubject.next(typeName); // Dispara la recarga
  }
}