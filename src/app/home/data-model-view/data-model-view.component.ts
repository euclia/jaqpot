import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Dataset, Model, MetaInfo } from '../../jaqpot-client';
import { Router } from '@angular/router';
import { DialogsService } from '../../dialogs/dialogs.service';
import { ModelApiService } from '../../jaqpot-client/api/model.service';
import { DatasetService } from '../../jaqpot-client/api/dataset.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-data-model-view',
  templateUrl: './data-model-view.component.html',
  styleUrls: ['./data-model-view.component.css'],
})
export class DataModelViewComponent implements OnChanges {
  @Input() datasets_to_view: Dataset[];
  @Input() models_to_view: Model[];
  @Input() view_type: string;
  @Input() onTrash: boolean;

  @Output() itemClicked = new EventEmitter<ViewItem>();
  grid_view: boolean = true;

  view_items: ViewItem[] = [];

  constructor(
    public snackBar: MatSnackBar,
    private router: Router,
    private dialogsService: DialogsService,
    private modelApi: ModelApiService,
    private datasetApi: DatasetService,
  ) {}

  ngOnChanges() {
    this.view_items = [];
    this.grid_view = this.view_type === 'grid';
    this.datasets_to_view.forEach((dataset) => {
      let _view_item: ViewItem = {};
      _view_item.type = 'Dataset';
      _view_item.color = 'lightblue';
      _view_item.meta = dataset.meta;
      _view_item._id = dataset._id;
      _view_item.cols = 1;
      _view_item.rows = 1;
      this.view_items.push(_view_item);
    });
    this.models_to_view.forEach((model) => {
      let _view_item: ViewItem = {};
      _view_item.type = 'Model';
      _view_item.color = 'lightred';
      _view_item.meta = model.meta;
      _view_item._id = model._id;
      _view_item.cols = 1;
      _view_item.rows = 1;
      this.view_items.push(_view_item);
    });
    this.view_items.sort((a, b) => {
      if (a.meta.date > b.meta.date) return -1;
      if (a.meta.date < b.meta.date) return 1;
      return 0;
    });
    // console.log(this.view_items)
  }

  // handleFavorites(event){
  //   console.log(event)
  // }

  goToView(item: ViewItem) {
    switch (item.type) {
      case 'Dataset': {
        let route = '/dataset/' + item._id;
        this.router.navigate([route]);
        break;
      }
      case 'Model': {
        let route = '/model/' + item._id;
        this.router.navigate([route]);
        break;
      }
    }
  }

  moveToTrash(item: ViewItem) {
    this.dialogsService
      .confirmDeletion('Item will be moved to trash', 'Move')
      .subscribe((result) => {
        if (result === true) {
          if (item.type === 'Model') {
            let modelToUpdate = <Model>{};
            modelToUpdate.onTrash = true;
            modelToUpdate.meta = item.meta;
            this.modelApi
              .updateOnTrash(item._id, modelToUpdate)
              .subscribe((resp) => {
                if (typeof resp != 'undefined') {
                  let ind = this.view_items.indexOf(item);
                  this.view_items.splice(ind, 1);
                  this.openSnackBar('Model moved to trash', 'Ok');
                }
              });
          }
          if (item.type === 'Dataset') {
            let datasetToUpdate = <Dataset>{};
            datasetToUpdate.onTrash = true;
            datasetToUpdate.meta = item.meta;
            this.datasetApi
              .updateOnTrash(item._id, datasetToUpdate)
              .subscribe((resp) => {
                if (typeof resp != 'undefined') {
                  let ind = this.view_items.indexOf(item);
                  this.view_items.splice(ind, 1);
                  this.openSnackBar('Model moved to trash', 'Ok');
                }
              });
          }
        }
      });
  }

  deleteForever(item: ViewItem) {
    this.dialogsService
      .confirmDeletion('Item will be deleted forever', 'Ok')
      .subscribe((result) => {
        if (result === true) {
          if (item.type === 'Dataset') {
            this.datasetApi.deleteEntityWithID(item._id).subscribe((resp) => {
              if (typeof resp != 'undefined') {
                let ind = this.view_items.indexOf(item);
                this.view_items.splice(ind, 1);
                this.openSnackBar('Item deleted', 'Ok');
              }
            });
          }
          if (item.type === 'Model') {
            this.modelApi.deleteEntityWithID(item._id).subscribe((resp) => {
              if (typeof resp != 'undefined') {
                let ind = this.view_items.indexOf(item);
                this.view_items.splice(ind, 1);
                this.openSnackBar('Item deleted', 'Ok');
              }
            });
          }
        }
      });
  }

  restoreFromTrash(item: ViewItem) {
    this.dialogsService
      .confirmDeletion('Are you sure you want to restore this item?', 'Ok')
      .subscribe((result) => {
        if (result === true) {
          if (item.type === 'Dataset') {
            let dataset = <Dataset>{};
            dataset.onTrash = false;
            this.datasetApi
              .updateOnTrash(item._id, dataset)
              .subscribe((resp) => {
                if (typeof resp != 'undefined') {
                  this.openSnackBar('Dataset restored', '');
                  let ind = this.view_items.indexOf(item);
                  this.view_items.splice(ind, 1);
                }
              });
          }
          if (item.type === 'Model') {
            let model = <Model>{};
            model.onTrash = false;
            this.modelApi.updateOnTrash(item._id, model).subscribe((resp) => {
              if (typeof resp != 'undefined') {
                this.openSnackBar('Model restored', '');
                let ind = this.view_items.indexOf(item);
                this.view_items.splice(ind, 1);
              }
            });
          }
        }
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3200,
    });
  }
}

export interface ViewItem {
  type?: string;
  color?: string;
  meta?: MetaInfo;
  _id?: string;
  cols?: number;
  rows?: number;
}
