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
import { ModelService } from '../../jaqpot-client/api/model.service';

@Component({
  selector: 'app-model-features',
  templateUrl: './model-features.component.html',
  styleUrls: ['./model-features.component.css'],
})
export class ModelFeaturesComponent implements OnInit, OnChanges {
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
    private readonly modelService: ModelService,
  ) {}

  ngOnInit(): void {
    this.modelService.currentModel$.subscribe(({ model }) => {
      this.modelToSee = model;
      this.independentFeatures = [];
      this.dependentFeatures = [];
      if (this.modelToSee.independentFeatures.length < 40) {
        this.modelToSee.independentFeatures.forEach((feat) => {
          if (feat) {
            const featId = feat.split('/')[feat.split('/').length - 1];
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
        const indF: Map<string, string> =
          this.modelToSee.additionalInfo['independentFeatures'];
        for (const [key, value] of Object.entries(indF)) {
          const featId = key.split('/')[key.split('/').length - 1];
          const feature: Feature = {};
          const meta: MetaInfo = {};
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
            const featId = feat.split('/')[feat.split('/').length - 1];
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
    });
  }

  ngOnChanges() {
    if (this.viewOrEdit === 'edit') {
      this.edit = true;
    } else {
      this.edit = false;
    }
  }

  featChanged(feat: Feature) {
    if (this.featsChanged.includes(feat) === false) {
      this.featsChanged.push(feat);
      this.featsChangedArray.next(this.featsChanged);
    }
  }
}
