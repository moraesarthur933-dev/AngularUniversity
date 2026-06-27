import { Component, OnInit } from '@angular/core';
import { UniversityService } from '../../services/university.service';
import { University } from '../../models/university.model';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  standalone: false
})
export class FavoritesComponent implements OnInit {
  favorites: University[] = [];
  filteredFavorites: University[] = [];
  filterText: string = '';

  constructor(private universityService: UniversityService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.favorites = this.universityService.getFavorites();
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.filterText.trim()) {
      const query = this.filterText.toLowerCase().trim();
      this.filteredFavorites = this.favorites.filter(u => 
        u.name.toLowerCase().includes(query) || 
        u.country.toLowerCase().includes(query)
      );
    } else {
      this.filteredFavorites = [...this.favorites];
    }
  }

  removeFavorite(university: University): void {
    this.universityService.toggleFavorite(university);
    this.loadFavorites(); // Reload and refresh view
  }

  openWebsite(url: string): void {
    if (url) {
      let targetUrl = url;
      if (!/^https?:\/\//i.test(url)) {
        targetUrl = 'http://' + url;
      }
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  }
}
