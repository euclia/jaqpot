import { Component, ViewChild } from '@angular/core';
import { Dataset } from '../../jaqpot-client/model/dataset';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dataset-list',
  templateUrl: './dataset-list.component.html',
  styleUrls: ['./dataset-list.component.css'],
})
export class DatasetListComponent {
  private _dataset: Dataset;

  public visible: boolean = true;
  private _datasets: Dataset[];
  private _count: string;
  subscription: Subscription;

  public data_in: string;
  private data_to_fetch = new BehaviorSubject(0);

  displayedColumns = ['Titles', 'Descriptions', 'Subjects'];
  // dataSource = new MatTableDataSource<Dataset>(this._datasets);

  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;

  constructor(private _router: Router) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
  }

  changeDatasets(value) {
    this.data_in = value;
    this.data_to_fetch.next(0);
  }

  onSelect(dataset: Dataset) {
    // this._sessionService.setDataset(dataset);
    this.navigate();
  }

  navigate() {
    this._router.navigate(['/dataset/detail']);
  }
}
