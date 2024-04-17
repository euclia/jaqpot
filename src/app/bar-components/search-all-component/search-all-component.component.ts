import { Component } from '@angular/core';
import { SearchApiService } from '../../jaqpot-client/api/search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-all-component',
  templateUrl: './search-all-component.component.html',
  styleUrls: ['./search-all-component.component.css'],
})
export class SearchAllComponentComponent {
  searchTerm: string;

  constructor(
    private router: Router,
    private searchApi: SearchApiService,
  ) {}

  search($event) {
    this.searchApi.startSearch(this.searchTerm).subscribe((resp) => {
      let seacrhSession = resp.seacrhSession;
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchTerm, s: seacrhSession },
      });
      this.searchTerm = '';
    });
  }
}
