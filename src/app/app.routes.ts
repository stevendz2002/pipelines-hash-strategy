import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { PokemonListComponent } from './pages/pokemon-list.component';
import { AboutComponent } from './pages/about.component';
import { PokemonFilterComponent } from './pages/pokemon-filter.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Inicio | Pokédex' },
  { path: 'pokemon', component: PokemonListComponent, title: 'Pokémon | Pokédex' },
  { path: 'type', component: PokemonFilterComponent, title: 'Tipo | Pokédex' }, // <-- Nueva ruta
  { path: 'about', component: AboutComponent, title: 'Proyecto | Pokédex' },
  { path: '**', redirectTo: '' },
];