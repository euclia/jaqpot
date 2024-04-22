import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  AfterContentInit,
  AfterContentChecked,
} from '@angular/core';
import { ModelApiService } from '../../jaqpot-client/api/model.service';
import { Model, Feature, Dataset, Task, MetaInfo } from '../../jaqpot-client';
import { UserService } from '../../jaqpot-client/api/user.service';
import { SessionService } from '../../session/session.service';
import { FeatureApiService } from '../../jaqpot-client/api/feature.service';
import { FeatureAndValue } from '../../ui-models/featureAndValue';
import { DatasetFactoryService } from '../../jaqpot-client/factories/dataset-factory.service';
import { DatasetService } from '../../jaqpot-client/api/dataset.service';
import { TaskApiService } from '../../jaqpot-client/api/task.service';
import { Subject, throwError } from 'rxjs';
import { tap, delay, catchError } from 'rxjs/operators';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { DatasetToViewdataService } from '../../services/dataset-to-viewdata.service';
import { FeatureFactoryService } from '../../jaqpot-client/factories/feature-factory.service';
import { DoaApiService } from '../../jaqpot-client/api/doa.service';
import { Doa } from '../../jaqpot-client/model/doa';
import { User } from '@euclia/accounts-client/dist/models/user';

@Component({
  selector: 'app-predict-validate',
  templateUrl: './predict-validate.component.html',
  styleUrls: ['./predict-validate.component.css'],
})
export class PredictValidateComponent implements OnInit {
  @ViewChild('dataInput')
  dataInput: ElementRef;

  viewError: boolean = false;
  taskStarted: boolean = false;
  ready: boolean = false;

  datasetForPrediction: Dataset;
  datasetFormated: boolean = false;

  taskFinished: boolean = true;
  taskCompletedSuccesfully: boolean = false;
  viewPrediction: boolean = false;
  actualPredicted: Dataset;
  predictedDataset: string = '';
  taskGot: Task;
  taskHasError: boolean = false;
  value: string;
  selected: string = 'Predict';

  progressValue: number = 0;
  @Input() entityId: string;

  indepFeatures: Feature[] = [];
  depFeatures: Feature[] = [];

  featureAndValue: FeatureAndValue;
  indepfeatureAndValues: FeatureAndValue[] = [];
  depFeatureAndValues: FeatureAndValue[] = [];

  inputVals: FeatureAndValue[] = [];

  canExecute: boolean = false;
  model: Model;
  simplepred: boolean = true;
  userNow: User;
  observe: Subject<Task> = new Subject();

  _canSeeDetails: boolean = false;

  canValidate: boolean = true;

  addDoa: string = 'false';
  doaEnabled: boolean = false;
  actualDoa: Doa;

  constructor(
    private _modelApi: ModelApiService,
    private _userApi: UserService,
    private _doaApi: DoaApiService,
    private _sessionService: SessionService,
    private _featureApi: FeatureApiService,
    private _datasetFactory: DatasetFactoryService,
    private _datasetToViewService: DatasetToViewdataService,
    private _datasetApi: DatasetService,
    private _taskApi: TaskApiService,
    private _dialogsService: DialogsService,
    // private _ngxPicaService:NgxPicaService,
    private _featFactory: FeatureFactoryService,
  ) {
    if (environment.production === true) {
      this._canSeeDetails = false;
    } else {
      this._canSeeDetails = true;
    }
  }

  ngOnInit() {
    this._modelApi.currentModel$.subscribe((model: Model) => {
      this.model = model;
      if (this.model.algorithm.ontologicalClasses.includes('ot:PBPK')) {
        this.simplepred = false;
      }
      if (
        typeof this.model.algorithm != 'undefined' &&
        typeof this.model.algorithm.ontologicalClasses != 'undefined' &&
        this.model.algorithm.ontologicalClasses.includes('ot:PBPK')
      ) {
        this.canValidate = false;
      }
      if (
        typeof model.meta.execute != 'undefined' &&
        model.meta.execute.includes('Jaqpot')
      ) {
        this.canExecute = true;
      }
      if (model.meta.creators.includes(this._sessionService.getUserId())) {
        this.canExecute = true;
      }
      this._userApi
        .getUserById(this._sessionService.getUserId())
        .then((user: User) => {
          this.userNow = user;
          if (user.organizations) {
            user.organizations.forEach((org) => {
              if (
                typeof model.meta.execute != 'undefined' &&
                model.meta.execute.includes(org)
              ) {
                this.canExecute = true;
              }
            });
          }
        });

      model.dependentFeatures.forEach((feat) => {
        if (feat) {
          this._featureApi
            .getWithIdSecured(feat.split('/')[feat.split('/').length - 1])
            .subscribe((feat: Feature) => {
              let featureAndValue: FeatureAndValue = <FeatureAndValue>{};
              featureAndValue.feature = feat;
              this.depFeatureAndValues.push(featureAndValue);
            });
        }
      });

      if (this.model.independentFeatures.length < 40) {
        this.model.independentFeatures.forEach((feat) => {
          if (feat) {
            this._featureApi
              .getWithIdSecured(feat.split('/')[feat.split('/').length - 1])
              .subscribe((feat: Feature) => {
                let featureAndValue: FeatureAndValue = <FeatureAndValue>{};
                featureAndValue.feature = feat;
                this.indepfeatureAndValues.push(featureAndValue);
              });
          }
        });
      } else {
        let indF: Map<string, string> =
          this.model.additionalInfo['independentFeatures'];
        for (let [key, value] of Object.entries(indF)) {
          let featureAndValue: FeatureAndValue = <FeatureAndValue>{};
          let feature: Feature = {};
          let meta: MetaInfo = {};
          meta.titles = [value];
          meta.descriptions = [];
          feature.meta = meta;
          feature._id = key.split('/')[key.split('/').length - 1];
          featureAndValue.feature = feature;
          this.indepfeatureAndValues.push(featureAndValue);
        }
      }

      this._doaApi
        .checkIfDoaExists(`model/${this.model.id}`)
        .subscribe((doaFromResp: Response) => {
          this.actualDoa = <Doa>doaFromResp;
          this.doaEnabled = true;
        });
    });

    this.observe.subscribe((task: Task) => {
      this.getTask(task._id);
    });
  }

  methodSelected() {
    this.taskStarted = false;
  }

  inputChanged(feat: FeatureAndValue) {
    if (!this.inputVals.includes(feat) && feat.value.length > 0) {
      this.inputVals.push(feat);
    }
    if (this.inputVals.length === this.indepfeatureAndValues.length) {
      this.ready = true;
    }
  }

  downloadTemplate() {
    var csvData: string = '';
    if (this.selected === 'Predict') {
      let i = 0;
      let indFeats: Map<string, string> =
        this.model.additionalInfo['independentFeatures'];
      for (let [key, value] of Object.entries(indFeats)) {
        if (i != 0) {
          csvData = csvData.concat(',' + value);
        } else {
          csvData = csvData.concat(value);
        }
        i += 1;
      }

      //   this.indepfeatureAndValues.forEach((feat:FeatureAndValue)=>{
      //   if(i != 0){
      //     csvData = csvData.concat("," + feat.feature.meta.titles[0].toString())
      //   }
      //   else{
      //     csvData = csvData.concat(feat.feature.meta.titles[0].toString())
      //   }
      //  i += 1;
      // })
    }

    var blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv; charset=utf-8',
    });
    // var blob = new Blob([csvData], { type: 'text/csv' });
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

  viewTheError() {
    this.viewError = true;
  }

  viewTheResult() {
    this.viewPrediction = true;
    this._datasetApi
      .getDataEntryPaginated(this.predictedDataset.split('/')[1], 0, 40)
      .subscribe((dataset: Dataset) => {
        this.actualPredicted = dataset;
      });
  }

  startInputPrediction() {
    let dataset: Dataset = this._datasetFactory.createPredictDataset(
      this.indepfeatureAndValues,
    );
    this.taskStarted = true;
    // console.log(dataset)
    this._datasetApi.postEntity(dataset).subscribe((dataset: Dataset) => {
      let datasetUri = environment.jaqpotApi + '/dataset/' + dataset._id;
      this._modelApi
        .predict(this.model._id, datasetUri, 'true', this.addDoa === 'true')
        .subscribe((task: Task) => {
          this.progressValue = 5;
          this.getTask(task._id);
        });
    });
  }

  startDatasetPrediction() {
    this.taskStarted = true;
    // console.log(this.datasetForPrediction)
    this._datasetApi
      .uploadNewDatasetForPrediction(this.datasetForPrediction)
      .subscribe((dataset: Dataset) => {
        let datasetUri = environment.jaqpotApi + '/dataset/' + dataset._id;
        this._modelApi
          .predict(this.model._id, datasetUri, 'true', this.addDoa === 'true')
          .subscribe((task: Task) => {
            this.progressValue = 5;
            this.getTask(task._id);
          });
      });
  }

  getTask(taskId) {
    this._taskApi
      .getTask(taskId)
      .pipe(delay(800))
      .subscribe(
        (taskGot: Task) => {
          this.taskGot = taskGot;
          if (typeof taskGot != 'undefined') {
            if (
              taskGot.status.toString() === 'QUEUED' ||
              (taskGot.status.toString() === 'RUNNING' &&
                taskGot.percentageCompleted < 100)
            ) {
              if (typeof taskGot.percentageCompleted != 'undefined') {
                this.progressValue = taskGot.percentageCompleted + 5;
              }
              this.observe.next(taskGot);
            } else {
              if (typeof taskGot.percentageCompleted != 'undefined') {
                this.progressValue = taskGot.percentageCompleted + 5;
                if (taskGot.percentageCompleted === 100) {
                  this.taskCompletedSuccesfully = true;
                  this.predictedDataset = taskGot.result;
                }
              }
              this.taskCompletedSuccesfully = true;
              this.taskGot = taskGot;
              this.observe.unsubscribe();
            }
          }
        },
        (error) => this.handleTaskError(error, taskId),
      );
  }

  private handleTaskError(error: HttpErrorResponse, taskId) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      this.observe.unsubscribe();
      this.taskGot = error.error;
      this.taskHasError = true;
      if (typeof this.taskGot.percentageCompleted != 'undefined') {
        this.progressValue = this.taskGot.percentageCompleted + 5;
      }
      console.error(error.error);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  changeListener(files: FileList) {
    if (
      files &&
      files.length === 1 &&
      files.item(0).name.split('.')[1] === 'csv'
    ) {
      let reader: FileReader = new FileReader();
      let file: File = files.item(0);
      reader.readAsText(file);
      reader.onload = (e) => {
        var _csv = reader.result;
        _csv = _csv.toString();
        const rows = _csv.split(/\r?\n/);
        let ids = rows[0].split(/,|;/);
        this._dialogsService.askForId(ids).subscribe((result) => {
          reader.abort();
          if (typeof result != 'undefined') {
            this.datasetForPrediction =
              this._datasetFactory.matchPredictDataset(
                this.indepfeatureAndValues,
                _csv,
                result,
              );
            this.datasetFormated = true;
          }
        });
      };
    } else {
      let i = 0;
      let images_csv: string;
      images_csv = 'id' + ',' + 'image' + '\n';
      let images: { [key: string]: string } = {};
      let images_num = files.length;
      let files2: File[] = [];
      Array.from(files).forEach((file: File) => {
        files2.push(file);
      });
      // var options:NgxPicaResizeOptionsInterface = <NgxPicaResizeOptionsInterface>{};
      // let aspectRatio:AspectRatioOptions = <AspectRatioOptions>{};
      // options.aspectRatio = aspectRatio
      // options.aspectRatio.keepAspectRatio = true;
      // this._ngxPicaService.resizeImages(files2, 512, 512, options).subscribe((imageResized: File) => {
      //   let reader: FileReader = new FileReader();
      //   reader.readAsDataURL(imageResized);
      //   reader.onload = (e) =>{
      //     let image_to_csv = imageResized.name.toString() + "," + reader.result.toString() + "\n";
      //     images_csv += image_to_csv
      //     images[imageResized.name] = reader.result.toString();
      //     i += 1;
      //     if(images_num === i){
      //       this.datasetForPrediction = this._datasetFactory.matchPredictDataset(this.indepfeatureAndValues, images_csv, "None")
      //       this.datasetFormated = true
      //     }
      //   }, (err: NgxPicaErrorInterface) => {
      //     throw err.err;
      // }})
    }
    this.dataInput.nativeElement.value = '';
  }

  onDoaChange(value) {
    this.addDoa = value;
  }

  eraseDataset() {
    delete this.datasetForPrediction;
    this.datasetFormated = false;
  }

  handleErrorIn(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`,
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }

  sortFeatures() {
    this.indepfeatureAndValues.sort((a, b) =>
      a.feature.meta.titles[0] > b.feature.meta.titles[0] ? 1 : -1,
    );
  }
}
