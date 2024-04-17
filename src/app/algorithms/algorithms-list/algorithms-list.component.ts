import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlgorithmService } from '../../jaqpot-client/api/algorithm.service';
import { Algorithm } from '../../jaqpot-client';
import { map, startWith, switchMap } from 'rxjs/operators';
import { SessionService } from '../../session/session.service';
import { MatPaginator } from '@angular/material/paginator';
import { merge } from 'rxjs';

@Component({
  selector: 'app-algorithms-list',
  templateUrl: './algorithms-list.component.html',
  styleUrls: ['./algorithms-list.component.css'],
})
export class AlgorithmsListComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  public _algorithms: Algorithm[];
  public _count: string;
  // private subscription:Subscription;

  displayedColumns = ['Id', 'Descriptions', 'Titles', 'Subjects'];
  // dataSource = new MatTableDataSource<Algorithm>(this._algorithms);

  resultsLength = 0;
  isLoadingResults = false;
  isRateLimitReached = false;

  selectedAlgo: Algorithm;

  // sessionService:SessionService;

  constructor(
    private _algoService: AlgorithmService,
    public sessionService: SessionService,
  ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;

  /**
   * Set the paginator after the view init since this component will
   * be able to query its view for the initialized paginator.
   */
  ngOnInit() {
    this.getCount();
    this.resultsLength = Number(this._count);
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;

    merge(this.paginator.page);
    startWith(null);
    switchMap(() => {
      this.isLoadingResults = true;
      return this._algoService.getAlgorithms(
        null,
        this.paginator.pageIndex * this.paginator.pageSize,
        this.paginator.pageSize,
      );
    }),
      map((data) => {
        this.isLoadingResults = false;
        this.isRateLimitReached = false;
        this.resultsLength = Number(this._count);
        return data;
      });
    // ,catchError(err => {
    //   this.isLoadingResults = false;
    //   this.isRateLimitReached = true;
    //   // return Observable.of([]);
    // })
    // subscribe(data => this.dataSource.data = data);
  }

  ngOnDestroy() {
    this.clearMem();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    // this.dataSource.filter = filterValue;
  }

  private clearMem() {
    this._algorithms = null;
  }

  private getAlgos() {
    this._algoService
      .getAlgorithms(null, this.paginator.pageIndex, this.paginator.pageSize)
      .subscribe((algos) => {
        this._algorithms = algos;
      });
  }

  private onSelect(algorithm: Algorithm) {
    // this.sessionService.setAlgorithm(algorithm);
  }

  private getCount() {
    this._algoService.getAlgorithmsCount().subscribe((res) => {
      this._count = res.headers.get('total');
    });
  }
}
