import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DataEntry, Dataset, Feature, FeatureInfo } from '../../jaqpot-client';
import { DatasetFactoryService } from '../../jaqpot-client/factories/dataset-factory.service';
import { DatasetToViewdataService } from '../../services/dataset-to-viewdata.service';
import { FeatureFactoryService } from '../../jaqpot-client/factories/feature-factory.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FeatureApiService } from '../../jaqpot-client/api/feature.service';
import { DatasetService } from '../../jaqpot-client/api/dataset.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-dataset-dialog',
  templateUrl: './add-dataset-dialog.component.html',
  styleUrls: ['./add-dataset-dialog.component.css'],
})
export class AddDatasetDialogComponent implements OnInit, OnDestroy {
  csv: string;
  file_name: string;
  dataset_id = '';
  possible_ids: string[] = [];
  selected = '';
  selectedId: Subject<string> = new Subject();
  data_available = false;
  features_available = false;
  dataset: Dataset;
  datasetFactory: DatasetFactoryService;
  dataset_to_check: Dataset;

  featureApi: FeatureApiService;
  datasetApi: DatasetService;

  displayedColumns: string[] = [];
  dataSource: { [key: string]: any } = {};

  features_to_edit: Feature[] = [];

  imageChangedEvent: any = '';
  croppedImage: any = '';
  loadImageFailed: any = '';
  cropperReady = false;
  datasetTitle: FormControl;
  datasetDiscription: FormControl;

  content = true;
  dataset_uploaded = false;
  submit = true;

  datasetUploaded: Dataset;

  datasetMetaForm = new FormGroup({
    datasetTitle: new FormControl('', Validators.required),
    datasetDiscription: new FormControl('', Validators.required),
  });

  constructor(
    private datasetViewService: DatasetToViewdataService,
    private featFactory: FeatureFactoryService,
  ) {
    // this.datasetApiFacade._featureApi = this.featureApi
  }

  ngOnInit() {
    this.datasetMetaForm = new FormGroup({
      datasetTitle: new FormControl('', Validators.required),
      datasetDiscription: new FormControl('', Validators.required),
    });
    const rows = this.csv.split(/\r?\n/);
    const ids = rows[0].split(/,|;/);
    this.possible_ids.push('None');
    ids.forEach((id) => {
      this.possible_ids.push(id);
    });
    rows[0].length;
    const rows_number = rows.length;
    this.selectedId.subscribe();
  }

  idChanged($event) {
    this.data_available = false;
    this.features_available = false;
    const dataset_id = this.selected;
    this.dataset_to_check = {};
    this.displayedColumns = [];
    this.dataSource = [];
    this.features_to_edit = [];
    this.dataset_to_check = this.datasetFactory.createDummyFromCsv(
      this.csv,
      dataset_id,
    );
    this.dataSource = this.datasetViewService.createViewData(
      this.dataset_to_check,
      10,
    );
    this.dataset_to_check.features.forEach((fi) => {
      this.features_to_edit.push(this.featFactory.featFromFeatInfo(fi));
    });
    for (const key in this.dataSource[0]) {
      this.displayedColumns.push(key);
    }
    this.data_available = true;
    this.features_available = true;
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCroppedBase64(image: string) {
    this.dataset_to_check.meta.picture = image;
    this.croppedImage = image;
  }

  imageLoaded() {
    this.cropperReady = true;
  }

  imageLoadFailed() {
    console.log('Load failed');
  }

  uploadDataset() {
    const _temp_actual_ids: { [key: string]: any } = {};
    const feat_length = this.features_to_edit.length;
    // console.log(feat_length)
    let i = 0;
    this.content = false;
    this.submit = false;
    this.features_to_edit.forEach((feat) => {
      this.featureApi.postEntity(feat).subscribe((feature: Feature) => {
        _temp_actual_ids[feature.meta.titles[0]] = feature._id;
        i += 1;
        if (i === feat_length) {
          for (const key in _temp_actual_ids) {
            const data_entry: DataEntry[] = this.dataset_to_check.dataEntry;
            data_entry.forEach((de) => {
              // let values: { [key: string]: any; } = {}
              for (const de_key in de.values) {
                const key_name = de_key.split('/');
                if (key_name[1] === key) {
                  const data_entry_new_key =
                    environment.jaqpotApi + '/feature/' + _temp_actual_ids[key];
                  de.values[data_entry_new_key] = de.values[de_key];
                  delete de.values[de_key];
                  // values[data_entry_new_key] = de.values[de_key]
                  // console.log(values)
                }
              }
            });
            // console.log(this.dataset_to_check)
          }
          const featurInf: FeatureInfo[] = this.dataset_to_check.features;
          featurInf.forEach((fi) => {
            fi.uri =
              environment.jaqpotApi + '/feature/' + _temp_actual_ids[fi.name];
          });
          this.datasetApi
            .uploadNewDataset(this.dataset_to_check)
            .subscribe((dataset_posted) => {
              this.datasetUploaded = dataset_posted;
              this.dataset_uploaded = true;
            });
        }
      });
    });
  }

  ngOnDestroy() {
    this.selectedId.unsubscribe();
    this.csv = '';
    this.dataset_to_check = {};
  }
}
