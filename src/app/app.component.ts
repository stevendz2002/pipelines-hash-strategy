import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="shell">
      <header class="topbar">
        <a class="brand" routerLink="/">Hash<span>Map</span></a>
      </header>
      <main class="main-content"><router-outlet /></main>
      <footer>Aplicación Angular con rutas hash</footer>
    </div>
  `,
})
export class AppComponent {}
