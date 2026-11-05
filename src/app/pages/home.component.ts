import { Component } from '@angular/core';
@Component({
  standalone: true,
  template: `
    <section class="hero">
      <p class="eyebrow">Angular + HashLocationStrategy</p>
      <h1>Bienvenido a nuestra aplicación.</h1>
      <p>Una aplicación TypeScript con Angular y un provider de rutas basado en hash.</p>
    </section>
    <section class="feature-grid">
      <article><span>01</span><h2>Angular</h2><p>Proyecto construido con TypeScript y componentes independientes.</p></article>
      <article><span>02</span><h2>Hash routing</h2><p>La navegación utiliza rutas como <code>#/</code>.</p></article>
    </section>
  `,
})
export class HomeComponent {}
