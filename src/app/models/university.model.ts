export interface University {
  name: string;
  country: string;
  alpha_two_code: string;
  domains: string[];
  web_pages: string[];
  'state-province'?: string | null;
}

export interface SearchHistory {
  country: string;
  date: string; // Date of search in ISO or locale format
  count: number; // Number of universities returned
}
