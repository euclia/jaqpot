import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FeatureAndValue } from '../../ui-models/featureAndValue';
import { DialogsService } from '../../dialogs/dialogs.service';
import { DatasetFactoryService } from '../../jaqpot-client/factories/dataset-factory.service';
import { Dataset, Model, Report, Task } from '../../jaqpot-client';
import { DatasetService } from '../../jaqpot-client/api/dataset.service';
import { Subject, throwError } from 'rxjs';
import { TaskApiService } from '../../jaqpot-client/api/task.service';
import { delay } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationApiService } from '../../jaqpot-client/api/validation.service';
import { ReportApiService } from '../../jaqpot-client/api/report.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.css'],
})
export class ValidateComponent implements OnInit {
  @ViewChild('dataInput')
  dataInput: ElementRef;

  @Input() indepFeats: FeatureAndValue[];
  @Input() depFeats: FeatureAndValue[];
  @Input() model: Model;

  datasetForValidation: Dataset;
  datasetFormated: boolean = false;

  taskStarted: boolean = false;

  taskGot: Task;
  taskHasError: boolean = false;
  taskCompletedSuccesfully: boolean = false;
  viewError: boolean = false;

  progressValue: Number = 0;

  observe: Subject<Task> = new Subject();
  disabled: boolean = true;
  validationType: string;

  report: Report;
  viewReport: boolean = false;

  constructor(
    private _dialogsService: DialogsService,
    private _datasetFactory: DatasetFactoryService,
    // private _ngxPicaService:NgxPicaService,
    private _datasetApi: DatasetService,
    private _taskApi: TaskApiService,
    private _validateApi: ValidationApiService,
    private _reportApi: ReportApiService,
  ) {}

  ngOnInit() {
    this.observe.subscribe((task: Task) => {
      this.getTask(task._id);
    });
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
      reader.onload = () => {
        var _csv = reader.result;
        _csv = _csv.toString();
        const rows = _csv.split(/\r?\n/);
        let ids = rows[0].split(/,|;/);
        this._dialogsService.askForId(ids).subscribe((result) => {
          reader.abort();
          if (typeof result != 'undefined') {
            this.datasetForValidation =
              this._datasetFactory.matchValidateDataset(
                this.indepFeats,
                this.depFeats,
                _csv,
                result,
              );
            this.datasetFormated = true;
          }
        });
      };
    } else {
      let files2: File[] = [];
      Array.from(files).forEach((file: File) => {
        files2.push(file);
      });
    }
    this.dataInput.nativeElement.value = '';
  }

  eraseDataset() {
    delete this.datasetForValidation;
    this.datasetFormated = false;
  }

  startValidation() {
    this.taskStarted = true;
    this._datasetApi
      .postEntity(this.datasetForValidation)
      .subscribe((dataset: Dataset) => {
        let datasetUri = environment.jaqpotApi + '/dataset/' + dataset._id;
        let modelUri = environment.jaqpotApi + '/model/' + this.model._id;
        this._validateApi
          .externalValidation(modelUri, datasetUri, this.validationType)
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
                  // this.predictedDataset= taskGot.result;
                }
              }
              this.taskCompletedSuccesfully = true;
              this.taskGot = taskGot;
              this.observe.unsubscribe();
            }
          }
        },
        (error) => this.handleTaskError(error),
      );
  }

  downloadTemplate() {
    var csvData: string = '';
    let i = 0;
    this.indepFeats.forEach((feat: FeatureAndValue) => {
      if (i != 0) {
        csvData = csvData.concat(',' + feat.feature.meta.titles[0].toString());
      } else {
        csvData = csvData.concat(feat.feature.meta.titles[0].toString());
      }
      i += 1;
    });
    this.depFeats.forEach((feat: FeatureAndValue) => {
      if (i != 0) {
        csvData = csvData.concat(',' + feat.feature.meta.titles[0].toString());
      } else {
        csvData = csvData.concat(feat.feature.meta.titles[0].toString());
      }
      i += 1;
    });
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dataset.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  viewTheError() {
    this.viewError = true;
  }

  public onValChange(val: string) {
    this.validationType = val;
    this.disabled = false;
  }

  viewTheReport() {
    this._reportApi
      .getWithIdSecured(this.taskGot.result.split('/')[1])
      .subscribe((report: Report) => {
        this.report = report;
        this.viewReport = true;
      });
  }

  private handleTaskError(error: HttpErrorResponse) {
    console.log(error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(error.error);
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
}
