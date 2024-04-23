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
import { ModelService } from '../../jaqpot-client/api/model.service';
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
import { DoaApiService } from '../../jaqpot-client/api/doa.service';
import { Doa } from '../../jaqpot-client/model/doa';
import { User } from '@euclia/accounts-client';

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
    private _modelApi: ModelService,
    private _userApi: UserService,
    private _doaApi: DoaApiService,
    private _sessionService: SessionService,
    private _featureApi: FeatureApiService,
    private _datasetFactory: DatasetFactoryService,
    private _datasetApi: DatasetService,
    private _taskApi: TaskApiService,
    private _dialogsService: DialogsService,
  ) {
    if (environment.production === true) {
      this._canSeeDetails = false;
    } else {
      this._canSeeDetails = true;
    }
  }

  ngOnInit() {
    this._modelApi.currentModel$.subscribe(({ model, modelId }) => {
      this.model = model;
      this.indepfeatureAndValues = [];
      this.depFeatureAndValues = [];
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
              const featureAndValue: FeatureAndValue = <FeatureAndValue>{};
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
                const featureAndValue: FeatureAndValue = <FeatureAndValue>{};
                featureAndValue.feature = feat;
                this.indepfeatureAndValues.push(featureAndValue);
              });
          }
        });
      } else {
        const indF: Map<string, string> =
          this.model.additionalInfo['independentFeatures'];
        for (const [key, value] of Object.entries(indF)) {
          const featureAndValue: FeatureAndValue = <FeatureAndValue>{};
          const feature: Feature = {};
          const meta: MetaInfo = {};
          meta.titles = [value];
          meta.descriptions = [];
          feature.meta = meta;
          feature._id = key.split('/')[key.split('/').length - 1];
          featureAndValue.feature = feature;
          this.indepfeatureAndValues.push(featureAndValue);
        }
      }

      this._doaApi.checkIfDoaExists(`model/${modelId}`).subscribe(
        (doaFromResp: Response) => {
          this.actualDoa = <Doa>doaFromResp;
          this.doaEnabled = true;
        },
        (_error) => {},
      );
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
      const indFeats: Map<string, string> =
        this.model.additionalInfo['independentFeatures'];
      for (const [key, value] of Object.entries(indFeats)) {
        if (i != 0) {
          csvData = csvData.concat(',' + value);
        } else {
          csvData = csvData.concat(value);
        }
        i += 1;
      }
    }

    const blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv; charset=utf-8',
    });
    const url = window.URL.createObjectURL(blob);
    if ((window.navigator as any).msSaveOrOpenBlob) {
      (window.navigator as any).msSaveBlob(blob, 'dataset.csv');
    } else {
      const a = document.createElement('a');
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
    const dataset: Dataset = this._datasetFactory.createPredictDataset(
      this.indepfeatureAndValues,
    );
    this.taskStarted = true;
    // console.log(dataset)
    this._datasetApi.postEntity(dataset).subscribe((dataset: Dataset) => {
      const datasetUri = environment.jaqpotApi + '/dataset/' + dataset._id;
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
        const datasetUri = environment.jaqpotApi + '/dataset/' + dataset._id;
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
      const reader: FileReader = new FileReader();
      const file: File = files.item(0);
      reader.readAsText(file);
      reader.onload = (e) => {
        let _csv = reader.result;
        _csv = _csv.toString();
        const rows = _csv.split(/\r?\n/);
        const ids = rows[0].split(/,|;/);
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
