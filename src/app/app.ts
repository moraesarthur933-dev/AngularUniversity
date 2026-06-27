import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'AngularUniversity';
  isDarkMode = false;

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('app_theme');
    // Default to light mode if not set, or read from saved
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-theme');
      document.body.setAttribute('data-bs-theme', 'dark');
    } else {
      this.isDarkMode = false;
      document.body.classList.remove('dark-theme');
      document.body.setAttribute('data-bs-theme', 'light');
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('app_theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('app_theme', 'light');
    }
    
    // Dispatch a custom event to notify components (like Chart.js) to redraw with new theme colors
    setTimeout(() => {
      window.dispatchEvent(new Event('themeChanged'));
    }, 150);
  }

  get favoritesCount(): number {
    const favoritesJson = localStorage.getItem('angular_university_favorites');
    if (!favoritesJson) return 0;
    try {
      return JSON.parse(favoritesJson).length;
    } catch {
      return 0;
    }
  }
}


