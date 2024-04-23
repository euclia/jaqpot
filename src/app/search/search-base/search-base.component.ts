import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import 'rxjs/add/operator/filter';
import { SearchApiService } from '../../jaqpot-client/api/search.service';
import { FountEntities } from '../../jaqpot-client/model/fountEntities';
import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SearchViewItem } from '../../ui-models/searchViewItem';
import { DatasetService } from '../../jaqpot-client/api/dataset.service';
import { ModelService } from '../../jaqpot-client/api/model.service';
import { Model, Dataset } from '../../jaqpot-client';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-search-base',
  templateUrl: './search-base.component.html',
  styleUrls: ['./search-base.component.css'],
})
export class SearchBaseComponent implements OnInit, OnDestroy {
  _fountEntitties: FountEntities;
  _doneFetching: Array<string> = [];
  observe: Subject<string>;
  _fountAndFecthed: Array<SearchViewItem> = new Array();

  searchTerm: string;
  totalFound: number;
  duration: string;

  sessionId: string;

  loading: boolean = true;

  searchViewItem: SearchViewItem;
  pageEvent: PageEvent;

  constructor(
    private route: ActivatedRoute,
    private searchApi: SearchApiService,
    private datasetApi: DatasetService,
    private modelApi: ModelService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.searchViewItem = null;
      this.totalFound = null;
      this.duration = null;
      let sessionId = params.get('s');
      this.sessionId = params.get('s');
      this.searchTerm = params.get('q');
      this.loading = true;
      this._fountAndFecthed = [];
      this._doneFetching = [];
      this.getFountEntities(sessionId);
      this.observe = new Subject();
      this.observe.subscribe((sessionId: string) => {
        this.getFountEntities(sessionId);
      });
    });
  }

  getFountEntities(sessionId: string) {
    this.searchApi
      .searchSession(sessionId, 0, 19)
      .pipe(delay(800))
      .subscribe((resp) => {
        if (typeof resp != 'undefined') {
          this._fountEntitties = resp;
          if (
            typeof resp.entityId != 'undefined' &&
            resp.entityId.length === 20
          ) {
            this.createSearchViewItems(resp.entityId);
          }
          if (this._fountEntitties.finished != 'true') {
            this.observe.next(sessionId);
          } else if (this._fountEntitties.finished === 'true') {
            if (resp.entityId.length < 20) {
              this.createSearchViewItems(resp.entityId);
            }
            this.totalFound = resp.total;
            this.duration = resp.duration;
            this.loading = false;
            this.observe.unsubscribe();
          }
        }
      });
  }

  async createSearchViewItems(entityIds: Array<string>) {
    this.loading = true;
    this._fountAndFecthed = [];
    entityIds.forEach(
      (entityId) => {
        // if(!this._doneFetching.includes(entityId))
        // {
        //   this._doneFetching.push(entityId)
        let idAll: Array<string> = entityId.split('/');
        let svi = <SearchViewItem>{};
        if (idAll[0] === 'model') {
          this.modelApi.getWithIdSecured(idAll[1]).subscribe((model: Model) => {
            svi.meta = model.meta;
            svi.type = 'model';
            svi._id = model._id;
          });
        }
        if (idAll[0] === 'dataset') {
          this.datasetApi
            .getWithIdSecured(idAll[1])
            .subscribe((dataset: Dataset) => {
              this._doneFetching.push(entityId);
              svi.meta = dataset.meta;
              svi.type = 'dataset';
              svi._id = dataset._id;
            });
        }
        this._fountAndFecthed.push(svi);
      },
      // }
    );
    this.loading = false;
  }

  quickView(fountEntity) {
    // console.log(fountEntity)
    this.searchViewItem = fountEntity;
  }

  goTo(fountEntity: SearchViewItem) {
    // console.log(fountEntity)
    if (fountEntity.type === 'model') {
      this.router.navigate(['/model/' + fountEntity._id]);
    }
    if (fountEntity.type === 'dataset') {
      this.router.navigate(['/dataset/' + fountEntity._id]);
    }
    if (fountEntity.type === 'organization') {
      this.router.navigate(['/organization/' + fountEntity._id]);
    }
    // console.log("Button")
  }

  changedPageEvent(event) {
    let pageEv: PageEvent = event;

    let start = pageEv.pageIndex * 20;
    let to = start + 19;
    this.searchApi
      .searchSession(this.sessionId, start, to)
      .subscribe((resp) => {
        this._fountEntitties = resp;
        this.createSearchViewItems(this._fountEntitties.entityId);
      });
  }

  ngOnDestroy() {
    this.observe.unsubscribe();
  }
}
