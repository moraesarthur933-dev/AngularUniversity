import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UniversityService } from '../../services/university.service';
import { University } from '../../models/university.model';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  standalone: false
})
export class ResultsComponent implements OnInit {
  country: string = '';
  universities: University[] = [];
  filteredUniversities: University[] = [];
  paginatedUniversities: University[] = [];
  
  loading: boolean = true;
  error: string | null = null;
  
  // Filters & Sorting
  filterText: string = '';
  sortBy: string = 'asc'; // 'asc' = A-Z, 'desc' = Z-A
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  pageSizeOptions: number[] = [10, 20, 50, 100];

  // Dashboard Stats
  totalReturned: number = 0;
  uniqueDomainsCount: number = 0;
  totalFavorites: number = 0;

  constructor(
    private route: ActivatedRoute,
    private universityService: UniversityService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const countryParam = params.get('country');
      if (countryParam) {
        this.country = countryParam;
        this.fetchUniversities();
      }
    });
    this.updateFavoritesCount();
  }

  fetchUniversities(): void {
    this.loading = true;
    this.error = null;
    this.universityService.getUniversities(this.country).subscribe({
      next: (data) => {
        this.universities = data;
        this.totalReturned = data.length;
        this.calculateUniqueDomains(data);
        this.applyFilterAndSort();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Ocorreu um erro ao buscar as universidades. Verifique sua conexão e tente novamente.';
        this.loading = false;
      }
    });
  }

  calculateUniqueDomains(data: University[]): void {
    const domainsSet = new Set<string>();
    data.forEach(u => {
      if (u.domains && Array.isArray(u.domains)) {
        u.domains.forEach(d => domainsSet.add(d.trim().toLowerCase()));
      }
    });
    this.uniqueDomainsCount = domainsSet.size;
  }

  updateFavoritesCount(): void {
    this.totalFavorites = this.universityService.getFavorites().length;
  }

  applyFilterAndSort(): void {
    // 1. Filter
    let temp = [...this.universities];
    if (this.filterText.trim()) {
      const query = this.filterText.toLowerCase().trim();
      temp = temp.filter(u => u.name.toLowerCase().includes(query));
    }

    // 2. Sort
    temp.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (this.sortBy === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

    this.filteredUniversities = temp;
    this.currentPage = 1; // Reset to page 1 on filter/sort change
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUniversities.length / this.pageSize);
    if (this.totalPages === 0) this.totalPages = 1;
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUniversities = this.filteredUniversities.slice(startIndex, endIndex);
  }

  // Pagination Actions
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onPageSizeChange(event: any): void {
    this.pageSize = parseInt(event.target.value, 10);
    this.applyFilterAndSort();
  }

  // Favorite Actions
  isFavorite(university: University): boolean {
    return this.universityService.isFavorite(university);
  }

  toggleFavorite(university: University): void {
    this.universityService.toggleFavorite(university);
    this.updateFavoritesCount();
  }

  openWebsite(url: string): void {
    if (url) {
      // Ensure the URL has a protocol
      let targetUrl = url;
      if (!/^https?:\/\//i.test(url)) {
        targetUrl = 'http://' + url;
      }
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  }
}
