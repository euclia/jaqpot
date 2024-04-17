import { AfterViewInit, Component, Input, OnChanges, ViewChild } from '@angular/core';
import { DataEntry, Dataset, Feature, FeatureInfo, MetaInfo } from '../../jaqpot-client';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, merge, of, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { DatasetService } from '../../jaqpot-client/api/dataset.service';
import { DatasetToViewdataService } from '../../services/dataset-to-viewdata.service';
import { DatasourceToCsvService } from '../../services/table-to-csv.service';

@Component({
  selector: 'app-predicted',
  templateUrl: './predicted.component.html',
  styleUrls: ['./predicted.component.css'],
})
export class PredictedComponent implements OnChanges, AfterViewInit {
  @Input() predictedDataset: Dataset;

  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  subscription: Subscription;
  isLoading: boolean = true;

  viewPredOnly: boolean = true;
  viewAll: boolean = false;

  isLoadingResults: boolean = true;
  dataSource: { [key: string]: any } = {};
  data_available: boolean = false;

  totalRows: number;
  features: Feature[] = [];

  allFeatures: string[] = [];
  predictedFeature: string[] = [];

  datasetForDownload: Dataset;
  datasetDownloaded = new BehaviorSubject<boolean>(false);
  collectedData: Boolean = false;
  gatheringData: Boolean = false;
  yData;

  constructor(
    // private featureApi:FeatureApiService,
    private datasetApi: DatasetService,
    private datasetViewService: DatasetToViewdataService,
    private datasourceToCsvService: DatasourceToCsvService,
  ) {}

  ngOnChanges() {
    this.totalRows = this.predictedDataset.totalRows;
    this.data_available = false;
    this.isLoadingResults = true;
    // console.log(this.predictedDataset)
    this.displayedColumns.push('Id');
    this.predictedDataset.features.forEach((fi) => {
      this.displayedColumns.push(fi.name);
      this.allFeatures.push(fi.name);
      if (fi.category === FeatureInfo.CategoryEnum.PREDICTED) {
        this.predictedFeature.push(fi.name);
      }
    });
    this.predictedDataset.features.forEach((fi: FeatureInfo) => {
      let _uri: string = fi.uri;
      let _stringSplitted = _uri.split('/');
      let featId = _stringSplitted[_stringSplitted.length - 1];
      if (featId != 'doa') {
        let featur = <Feature>{};
        let meta = <MetaInfo>{};
        featur._id = featId;
        meta.titles = [fi.name];
        featur.meta = meta;
        this.features.push(featur);
      }
    });
  }

  ngAfterViewInit() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          this.data_available = false;
          this.isLoading = true;
          let offset = 0;
          let size = 30;
          if (this.paginator['_isInitialized'] === false) {
            offset = 0;
            size = 30;
          } else {
            offset = this.paginator.pageSize * this.paginator.pageIndex;
            size = this.paginator.pageSize;
          }

          return this.datasetApi.getDataEntryPaginated(
            this.predictedDataset._id,
            offset,
            size,
          );
        }),
        map((data) => {
          return data;
        }),
        catchError((err) => {
          return of([]);
        }),
      )
      .subscribe((data: Dataset) => {
        this.dataSource = this.datasetViewService.createViewData(data, 10);
        this.data_available = true;
        this.isLoadingResults = false;
      });
  }

  viewOnlyPred() {
    this.displayedColumns = [];
    this.displayedColumns.push('Id');
    this.predictedFeature.forEach((featname) => {
      this.displayedColumns.push(featname);
    });
    this.viewPredOnly = false;
    this.viewAll = true;
  }

  viewAllB() {
    this.displayedColumns = [];
    this.displayedColumns.push('Id');
    this.allFeatures.forEach((featname) => {
      this.displayedColumns.push(featname);
    });

    this.viewPredOnly = true;
    this.viewAll = false;
  }

  downloadTemplate() {
    var csvData: string = '';

    let i = 0;
    this.allFeatures.forEach((feat: string) => {
      if (i != 0) {
        csvData = csvData.concat(',' + feat);
      } else {
        csvData = csvData.concat(feat);
      }
      i += 1;
    });
    csvData = csvData.concat('\n');
    // this.dataSource

    var blob = new Blob([csvData], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    if ((window.navigator as any).msSaveOrOpenBlob) {
      (window.navigator as any).msSaveBlob(blob, 'dataset.csv');
    } else {
      var a = document.createElement('a');
      a.href = url;
      a.download = 'dataset.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url);
  }

  downloadB() {
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true,
      headers: this.displayedColumns.slice(),
    };
    this.datasourceToCsvService.createAndDownload(
      this.dataSource,
      'predicted_dataset',
      options,
    );
  }

  async gatherDownload() {
    if (!this.collectedData) {
      let dataVals = [];
      for (let key in this.dataSource[0]) {
        dataVals.push(key);
      }

      this.gatheringData = true;
      this.datasetApi
        .getDataEntryPaginated(this.predictedDataset._id, 0, 30)
        .subscribe((d: Dataset) => {
          this.datasetForDownload = d;
          this.getWholeDataset(this.predictedDataset._id, 30, 30);
        });
      this.datasetDownloaded.subscribe((da) => {
        if (da === true) {
          let xKey = '';
          let yKeys = {};
          this.datasetForDownload.features.forEach((f: FeatureInfo) => {
            yKeys[f.name] = f.key;
          });
          let xs = {};
          let xArr = [];
          let ys = {};
          for (let key in yKeys) {
            ys[key] = [];
          }
          this.datasetForDownload.dataEntry.forEach((de: DataEntry) => {
            for (let key in de.values) {
              if (key === String(xKey)) {
                xArr.push(de.values[key]);
              }
              for (let ykey in yKeys) {
                if (yKeys[ykey] === key) {
                  ys[ykey].push(de.values[key]);
                }
              }
            }
          });
          // this.showData = this.getArray(ys)
          this.gatheringData = false;
          // this.datasourceToCsvService.createAndDownload(ys, "predicted_dataset", options);
          this.yData = ys;
          this.datasourceToCsvService.downloadFullDataset(
            this.getArray(this.yData),
            'predictions',
          );
        }
      });
    } else {
      this.datasourceToCsvService.downloadFullDataset(
        this.getArray(this.yData),
        'predictions',
      );
      // this.datasourceToCsvService.createAndDownload(this.yPlot, "predicted_dataset", options);
    }
    this.collectedData = true;
    // })
  }

  private getArray(object) {
    return Object.keys(object).reduce(function (r, k) {
      object[k].forEach(function (a, i) {
        r[i] = r[i] || {};
        r[i][k] = a;
      });
      return r;
    }, []);
  }

  getWholeDataset(datasetId, start, howMany) {
    this.datasetApi
      .getDataEntryPaginated(datasetId, start, howMany)
      .subscribe((data: Dataset) => {
        let totalRows = data.totalRows;
        let nowGot = this.datasetForDownload.dataEntry.length;
        if (nowGot < totalRows) {
          this.datasetApi
            .getDataEntryPaginated(datasetId, nowGot, howMany)
            .subscribe((datanow: Dataset) => {
              datanow.dataEntry.forEach((de) => {
                this.datasetForDownload.dataEntry.push(de);
              });
              nowGot = this.datasetForDownload.dataEntry.length;
              if (nowGot < totalRows) {
                this.getWholeDataset(datasetId, nowGot, 30);
              } else {
                this.datasetDownloaded.next(true);
              }
            });
        } else {
          this.datasetDownloaded.next(true);
        }
      });
  }
}
