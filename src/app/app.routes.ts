import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { PokemonListComponent } from './pages/pokemon-list.component';
import { AboutComponent } from './pages/about.component';
import { PokemonFilterComponent } from './pages/pokemon-filter.component';
import { AnimeListComponent } from './pages/anime-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Inicio | Pokédex' },
  { path: 'pokemon', component: PokemonListComponent, title: 'Pokémon | Pokédex' },
  { path: 'type', component: PokemonFilterComponent, title: 'Tipo | Pokédex' },
  { path: 'anime', component: AnimeListComponent, title: 'Anime | Catálogo' },
  { path: 'about', component: AboutComponent, title: 'Proyecto | Pokédex' },
  { path: '**', redirectTo: '' },
];
