import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { Feature, MetaInfo, Model } from '../../jaqpot-client';
import { FeatureApiService } from '../../jaqpot-client/api/feature.service';
import { ModelApiService } from '../../jaqpot-client/api/model.service';

@Component({
  selector: 'app-model-features',
  templateUrl: './model-features.component.html',
  styleUrls: ['./model-features.component.css'],
})
export class ModelFeaturesComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() viewOrEdit: string;

  @Output() modelChanged = new EventEmitter<any>();

  @Output() featsChangedArray = new EventEmitter<any>();

  edit: boolean = false;
  dependentFeatures: Feature[] = [];
  independentFeatures: Feature[] = [];
  featsChanged: Feature[] = [];

  private modelToSee: Model;

  constructor(
    private readonly featureApi: FeatureApiService,
    private readonly modelService: ModelApiService,
  ) {}

  ngOnInit(): void {
    this.modelService.currentModel$.subscribe((model) => {
      this.modelToSee = model;
    });
  }

  ngOnChanges() {
    if (this.viewOrEdit === 'edit') {
      this.edit = true;
    } else {
      this.edit = false;
    }
  }

  ngAfterViewInit() {
    if (this.modelToSee.independentFeatures.length < 40) {
      this.modelToSee.independentFeatures.forEach((feat) => {
        if (feat) {
          let featId = feat.split('/')[feat.split('/').length - 1];
          this.featureApi
            .getWithIdSecured(featId)
            .subscribe((featGot: Feature) => {
              if (typeof featGot.ontologicalClasses == 'undefined') {
                featGot.ontologicalClasses = [];
              }
              if (typeof featGot.meta.descriptions == 'undefined') {
                featGot.meta.descriptions = [];
              }
              this.independentFeatures.push(featGot);
            });
        }
      });
    } else {
      let indF: Map<string, string> =
        this.modelToSee.additionalInfo['independentFeatures'];
      for (let [key, value] of Object.entries(indF)) {
        let featId = key.split('/')[key.split('/').length - 1];
        let feature: Feature = {};
        let meta: MetaInfo = {};
        feature._id = featId;
        meta.titles = [value];
        meta.descriptions = [];
        feature.ontologicalClasses = [];
        feature.meta = meta;
        this.independentFeatures.push(feature);
      }
    }

    this.modelToSee.predictedFeatures.forEach((feat) => {
      if (feat) {
        if (!this.modelToSee.dependentFeatures.includes(feat)) {
          let featId = feat.split('/')[feat.split('/').length - 1];
          this.featureApi
            .getWithIdSecured(featId)
            .subscribe((featGot: Feature) => {
              if (typeof featGot.ontologicalClasses == 'undefined') {
                featGot.ontologicalClasses = [];
              }
              if (typeof featGot.meta.descriptions == 'undefined') {
                featGot.meta.descriptions = [];
              }
              this.dependentFeatures.push(featGot);
            });
        }
      }
    });
  }

  featureStream() {
    let len = this.modelToSee.independentFeatures.length;
    var temparray = this.modelToSee.independentFeatures.slice(0, len);
    console.log(temparray.length);
    console.log(len);
    while (temparray.length > 0) {
      var feat = temparray.pop();
      let featId = feat.split('/')[feat.split('/').length - 1];
      this.featureApi.getWithIdSecured(featId).subscribe((featGot: Feature) => {
        if (typeof featGot.ontologicalClasses == 'undefined') {
          featGot.ontologicalClasses = [];
        }
        if (typeof featGot.meta.descriptions == 'undefined') {
          featGot.meta.descriptions = [];
        }
        this.independentFeatures.push(featGot);
      });
    }

    // var i,j,temparray,chunk = 10;
    // for (i=0,j=this.modelToSee.independentFeatures.length; i<j; i+=chunk) {
    //     temparray = this.modelToSee.independentFeatures.slice(i,i+chunk);
    //     temparray.forEach(feat => {
    //       if(feat){
    //         let featId = feat.split("/")[feat.split("/").length - 1]
    //         this.featureApi.getWithIdSecured(featId).subscribe((featGot:Feature)=>{
    //           if(typeof featGot.ontologicalClasses == 'undefined'){
    //             featGot.ontologicalClasses = []
    //           }
    //           if(typeof featGot.meta.descriptions == 'undefined'){
    //             featGot.meta.descriptions = []
    //           }
    //           this.independentFeatures.push(featGot)
    //         })
    //       }
    //     })
    // }
  }

  featChanged(feat: Feature) {
    if (this.featsChanged.includes(feat) === false) {
      this.featsChanged.push(feat);
      this.featsChangedArray.next(this.featsChanged);
    }
  }
}
