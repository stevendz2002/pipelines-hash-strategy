import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <section class="page-heading">
      <p class="eyebrow">Ruta #/about</p>
      <h1>Sobre el proyecto</h1>
      <p>Aplicación construida con Angular, TypeScript, Hash Location Strategy y consumo de una API pública.</p>
    </section>
    <div class="info-panel">
      <h2>Hash Location Strategy</h2>
      <p>Las rutas incluyen el símbolo <code>#</code>, por ejemplo <code>/repo/#/pokemon</code>, para funcionar correctamente en GitHub Pages.</p>
    </div>
  `,
})
export class AboutComponent {}
