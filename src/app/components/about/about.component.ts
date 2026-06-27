import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  standalone: false
})
export class AboutComponent {
  developerName: string = 'Arthur Moraes De Souza';
  projectName: string = 'Angular University - Catálogo Mundial de Universidades';
  academicTerm: string = 'programação web de alta performance';
  
  technologies = [
    { name: 'Angular (Framework)', icon: 'bi-box-seam', description: 'Estruturação da aplicação modular baseada em componentes.' },
    { name: 'TypeScript', icon: 'bi-filetype-ts', description: 'Tipagem forte, interfaces estruturadas e programação orientada a objetos.' },
    { name: 'HttpClient', icon: 'bi-globe2', description: 'Consumo assíncrono de APIs REST externas com Observables.' },
    { name: 'Routing', icon: 'bi-signpost-split', description: 'Navegação por rotas separadas com controle de parâmetros.' },
    { name: 'Local Storage', icon: 'bi-database-fill', description: 'Armazenamento de favoritos e histórico de buscas no navegador.' },
    { name: 'Bootstrap 5', icon: 'bi-bootstrap-fill', description: 'Estilização premium, responsividade cross-device e componentes visuais ricos.' },
    { name: 'Chart.js', icon: 'bi-bar-chart-line-fill', description: 'Visualização estatística em gráfico de barras para o histórico de pesquisas.' }
  ];
}
