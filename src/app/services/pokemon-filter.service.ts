import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface TypeSummary {
  name: string;
  url: string;
}

export interface FilteredPokemon {
  name: string;
  url: string;
  artworkUrl: string;
}

@Injectable({ providedIn: 'root' })
export class PokemonFilterService {
  private readonly http = inject(HttpClient);
  private readonly artworkBaseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork';

  // 1. Obtiene los 18 tipos principales
  getTypes(): Observable<TypeSummary[]> {
    return this.http.get<{ results: TypeSummary[] }>('https://pokeapi.co/api/v2/type?limit=18').pipe(
      map(res => res.results)
    );
  }

  // 2. Obtiene todos los Pokémon de un tipo específico
  getPokemonByType(typeName: string): Observable<FilteredPokemon[]> {
    return this.http.get<any>(`https://pokeapi.co/api/v2/type/${typeName}`).pipe(
      map(res => {
        // La API devuelve un arreglo llamado "pokemon" con la estructura: { pokemon: { name, url }, slot }
        return res.pokemon.map((p: any) => {
          const pokemon = p.pokemon;
          
          // Extraemos el ID para la imagen
          const parts = pokemon.url.split('/').filter(Boolean);
          const id = parts[parts.length - 1];
          
          return {
            name: pokemon.name,
            url: pokemon.url,
            artworkUrl: `${this.artworkBaseUrl}/${id}.png`
          };
        });
      })
    );
  }
}