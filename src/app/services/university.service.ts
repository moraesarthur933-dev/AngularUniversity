import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { University, SearchHistory } from '../models/university.model';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private apiUrl = 'https://universities.hipolabs.com/search';
  private historyKey = 'angular_university_history';
  private favoritesKey = 'angular_university_favorites';

  constructor(private http: HttpClient) {}

  // Fetch universities from the API
  getUniversities(country: string): Observable<University[]> {
    return this.http.get<University[]>(`${this.apiUrl}?country=${encodeURIComponent(country)}`).pipe(
      tap((results) => {
        this.addSearchToHistory(country, results.length);
      })
    );
  }

  // SEARCH HISTORY
  getSearchHistory(): SearchHistory[] {
    const historyJson = localStorage.getItem(this.historyKey);
    if (!historyJson) return [];
    try {
      return JSON.parse(historyJson) as SearchHistory[];
    } catch {
      return [];
    }
  }

  private addSearchToHistory(country: string, count: number): void {
    let history = this.getSearchHistory();
    // Normalize country name (capitalize first letter)
    const normalizedCountry = country.trim().charAt(0).toUpperCase() + country.trim().slice(1).toLowerCase();

    // Check if country already exists in history, remove it to bring to top
    history = history.filter(h => h.country.toLowerCase() !== normalizedCountry.toLowerCase());

    const newRecord: SearchHistory = {
      country: normalizedCountry,
      date: new Date().toLocaleString(),
      count: count
    };

    history.unshift(newRecord); // Add to beginning of history
    // Limit history to 10 items
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    localStorage.setItem(this.historyKey, JSON.stringify(history));
  }

  clearSearchHistory(): void {
    localStorage.removeItem(this.historyKey);
  }

  // FAVORITES
  getFavorites(): University[] {
    const favoritesJson = localStorage.getItem(this.favoritesKey);
    if (!favoritesJson) return [];
    try {
      return JSON.parse(favoritesJson) as University[];
    } catch {
      return [];
    }
  }

  isFavorite(university: University): boolean {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.name.toLowerCase() === university.name.toLowerCase());
  }

  toggleFavorite(university: University): boolean {
    let favorites = this.getFavorites();
    const isFav = this.isFavorite(university);

    if (isFav) {
      // Remove from favorites
      favorites = favorites.filter(fav => fav.name.toLowerCase() !== university.name.toLowerCase());
    } else {
      // Add to favorites
      favorites.push(university);
    }

    localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
    return !isFav; // Return new state
  }

  removeFavorite(universityName: string): void {
    let favorites = this.getFavorites();
    favorites = favorites.filter(fav => fav.name.toLowerCase() !== universityName.toLowerCase());
    localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
  }
}
