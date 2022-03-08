import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { Dataset, Feature, FeatureInfo, MetaInfo } from '../../jaqpot-client';
import { FeatureApiService } from '../../jaqpot-client/api/feature.service';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription, merge, of } from 'rxjs';
import { startWith, switchMap, catchError, map } from 'rxjs/operators';
import { DatasetService } from '../../jaqpot-client/api/dataset.service';
import { DatasetFactoryService } from '../../jaqpot-client/factories/dataset-factory.service';
import { DatasetToViewdataService } from '../../services/dataset-to-viewdata.service';
import { truncateSync } from 'fs';
import { DatasourceToCsvService } from '../../services/table-to-csv.service';

@Component({
  selector: 'app-predicted',
  templateUrl: './predicted.component.html',
  styleUrls: ['./predicted.component.css']
})
export class PredictedComponent implements OnChanges {

  @Input() predictedDataset: Dataset;

  displayedColumns:string[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  subscription:Subscription;
  isLoading:boolean = true;

  viewPredOnly:boolean = true;
  viewAll:boolean = false;

  isLoadingResults:boolean = true;
  dataSource:{ [key: string]: any; } = {};
  data_available:boolean = false;


  totalRows:number;
  features:Feature[] = [];

  allFeatures:string[] = [];
  predictedFeature:string[] = [];

  constructor(
    // private featureApi:FeatureApiService,
    private datasetApi:DatasetService,
    private datasetViewService:DatasetToViewdataService,
    private datasourceToCsvService:DatasourceToCsvService
  ) { }

  ngOnChanges() {
    this.totalRows = this.predictedDataset.totalRows;
    this.data_available = false;
    this.isLoadingResults = true;
    // console.log(this.predictedDataset)
    this.displayedColumns.push('Id')
    this.predictedDataset.features.forEach(fi => {
      this.displayedColumns.push(fi.name)
      this.allFeatures.push(fi.name)
      if(fi.category === FeatureInfo.CategoryEnum.PREDICTED){
        this.predictedFeature.push(fi.name)
      }
    })
    this.predictedDataset.features.forEach((fi:FeatureInfo)=>{
      let _uri:string = fi.uri
      let _stringSplitted = _uri.split("/")
      let featId = _stringSplitted[_stringSplitted.length - 1]
      if(featId != 'doa'){
        let featur = <Feature>{}
        let meta = <MetaInfo>{}
        featur._id = featId
        meta.titles = [fi.name]
        featur.meta = meta
        this.features.push(featur)
      }
    })

  }

  ngAfterViewInit(){
    merge(this.paginator.page)
    .pipe(
      startWith({}),
      switchMap(() =>{
        this.isLoadingResults = true;
        this.data_available = false;
        this.isLoading = true;
        let offset = 0
        let size = 30
        if(this.paginator['_isInitialized'] === false){
          offset = 0
          size = 30
        }else{
          offset = this.paginator.pageSize * this.paginator.pageIndex
          size = this.paginator.pageSize
        }
        
        return this.datasetApi.getDataEntryPaginated(this.predictedDataset._id, offset, size);
      } ),
      map(data =>{
        return data
      }),
      catchError(err =>{
        return of([])
      })
    ).subscribe((data:Dataset) => {
      this.dataSource = this.datasetViewService.createViewData(data , 10);
      this.data_available = true;
      this.isLoadingResults = false;
      
    })
  }

  viewOnlyPred(){
    this.displayedColumns = []
    this.displayedColumns.push('Id')
    this.predictedFeature.forEach(featname =>{
      this.displayedColumns.push(featname)
    })
    this.viewPredOnly = false;
    this.viewAll = true;
  }

  viewAllB(){
    this.displayedColumns = []
    this.displayedColumns.push('Id')
    this.allFeatures.forEach(featname =>{
      this.displayedColumns.push(featname)
    })

    this.viewPredOnly = true;
    this.viewAll = false;
  }

  downloadTemplate(){
    var csvData:string = "";

      let i = 0;
      this.allFeatures.forEach((feat:string)=>{
        if(i != 0){
          csvData = csvData.concat("," + feat)
        }
        else{
          csvData = csvData.concat(feat)
        }
       i += 1;
      })
      csvData = csvData.concat("\n")
      // this.dataSource

    var blob = new Blob([csvData], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    if((window.navigator as any).msSaveOrOpenBlob) {
      (window.navigator as any).msSaveBlob(blob, "dataset.csv");
    } else {
      var a = document.createElement("a");
      a.href = url;
      a.download = 'dataset.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url);
  }

  downloadB(){

    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      useBom: true,
      headers: this.displayedColumns.slice()
    };
    this.datasourceToCsvService.createAndDownload(this.dataSource, "predicted_dataset", options);
  }


}
