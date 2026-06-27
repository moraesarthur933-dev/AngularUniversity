import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UniversityService } from '../../services/university.service';
import { SearchHistory } from '../../models/university.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  searchQuery: string = '';
  history: SearchHistory[] = [];
  chart: any = null;
  quickCountries: string[] = ['Brazil', 'Canada', 'Australia', 'Germany', 'Japan'];
  private themeChangeHandler!: () => void;

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private universityService: UniversityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHistory();
    this.themeChangeHandler = () => this.renderChart();
    window.addEventListener('themeChanged', this.themeChangeHandler);
  }

  ngOnDestroy(): void {
    if (this.themeChangeHandler) {
      window.removeEventListener('themeChanged', this.themeChangeHandler);
    }
  }

  ngAfterViewInit(): void {
    // Small delay to ensure the canvas is ready and any animation frame is updated
    setTimeout(() => {
      this.renderChart();
    }, 100);
  }

  loadHistory(): void {
    this.history = this.universityService.getSearchHistory();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/results', this.searchQuery.trim()]);
    }
  }

  searchQuickCountry(country: string): void {
    this.router.navigate(['/results', country]);
  }

  clearHistory(): void {
    this.universityService.clearSearchHistory();
    this.history = [];
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  renderChart(): void {
    if (this.history.length === 0 || !this.chartCanvas) {
      return;
    }

    // Process and aggregate search data for the chart (unique country -> latest count)
    const countryData: { [key: string]: number } = {};
    // Iterate from oldest to newest to ensure latest search count overwrites older ones
    [...this.history].reverse().forEach(item => {
      countryData[item.country] = item.count;
    });

    const labels = Object.keys(countryData);
    const data = Object.values(countryData);

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

    // Determine chart theme colors based on current app dark mode
    const isDark = document.body.classList.contains('dark-theme');
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const textColor = isDark ? '#f8f9fa' : '#212529';

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Universidades Encontradas',
          data: data,
          backgroundColor: 'rgba(13, 110, 253, 0.75)',
          borderColor: 'rgba(13, 110, 253, 1)',
          borderWidth: 2,
          borderRadius: 6,
          barPercentage: 0.6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: isDark ? '#2b3035' : '#ffffff',
            titleColor: isDark ? '#ffffff' : '#212529',
            bodyColor: isDark ? '#ffffff' : '#212529',
            borderColor: 'rgba(13, 110, 253, 0.3)',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: gridColor
            },
            ticks: {
              color: textColor,
              precision: 0
            }
          }
        }
      }
    });
  }
}
