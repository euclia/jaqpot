import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatasetService } from '../../jaqpot-client/api/dataset.service';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { UserService } from '../../jaqpot-client/api/user.service';
import { Dataset, Model } from '../../jaqpot-client';
import { ModelService } from '../../jaqpot-client/api/model.service';
import { NotificationService } from '../../jaqpot-client/api/notification.service';
import { NotificationFactoryService } from '../../jaqpot-client/factories/notification-factory.service';
import { Notification } from '../../jaqpot-client/model/notification';
import { OrganizationService } from '../../jaqpot-client/api/organization.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { User } from '@euclia/accounts-client';
import { Organization } from '@euclia/accounts-client';

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.css'],
})
export class ShareDialogComponent implements OnInit {
  _entityType: string;
  _datasetApi: DatasetService;
  _modelApi: ModelService;
  _organizationApi: OrganizationService;
  _notificationApi: NotificationService;
  _notificationFactory: NotificationFactoryService;
  _entityId: string;
  _userApi: UserService;

  _userId: string;

  title: string;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  readCtrl = new FormControl();
  writeCtrl = new FormControl();
  executeCtrl = new FormControl();
  filteredFruits: Observable<string[]>;

  organizations: string[] = [];
  organizationsAll: string[] = [];
  organizationsWillRead: string[] = [];
  organizationsWillWrite: string[] = [];
  organizationsWillExecute: string[] = [];
  organizationsToRead: string[] = [];
  organizationsToWrite: string[] = [];
  organizationsToExecute: string[] = [];
  organizationsToNotify: string[] = [];

  organizationsFull: Organization[] = [];

  // organizations: Organization[] = [];
  // organizationsAll: Organization[] = [];
  // organizationsWillRead: Organization[] = [];
  // organizationsWillWrite: Organization[] = [];
  // organizationsWillExecute: Organization[] = [];
  // organizationsToRead: Organization[] = [];
  // organizationsToWrite: Organization[] = [];
  // organizationsToExecute: Organization[] = [];
  // organizationsToNotify: Organization[] = [];

  share: boolean = true;
  cancell: boolean = true;

  success: boolean = false;

  affiliatedOrgs: string[] = [];

  @ViewChild('readInput') readInput: ElementRef<HTMLInputElement>;
  @ViewChild('writeInput') writeInput: ElementRef<HTMLInputElement>;
  @ViewChild('executeInput') executeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  @ViewChild('readAuto') matReadcomplete: MatAutocomplete;
  @ViewChild('writeAuto') matWritecomplete: MatAutocomplete;
  @ViewChild('executeAuto') matExecutecomplete: MatAutocomplete;

  constructor() {}

  ngOnInit() {
    this._userApi.getUserById(this._userId).then((user: User) => {
      this.organizationsAll = user.organizations.slice();
      this.organizationsAll.forEach((orgid) => {
        this._organizationApi.getOrgById(orgid).then((org: Organization) => {
          this.organizationsFull.push(org);
          this.organizationsToExecute.push(org.title);
          this.organizationsToWrite.push(org.title);
          this.organizationsToRead.push(org.title);
        });
        // this._organizationApi.getOrgById(orgid).then((org:Organization)=>{
        //   if(typeof org. != 'undefined'){
        //     org.affiliations.forEach(orgid =>{
        //       if(!this.affiliatedOrgs.includes(orgid)){
        //         this.affiliatedOrgs.push(orgid)
        //       }
        //     })
        //   }
        // })
      });
      // this.organizationsToExecute = user.organizations.slice()
      // this.organizationsToWrite = user.organizations.slice()
      // this.organizationsToRead = user.organizations.slice()
    });

    if (this._entityType === 'dataset') {
      this._datasetApi
        .getWithIdSecured(this._entityId.split('/')[1])
        .subscribe((data: Dataset) => {
          if (typeof data.meta.read != 'undefined') {
            data.meta.read.forEach((org) => {
              this._organizationApi
                .getOrgById(org)
                .then((o: Organization) => {
                  this.organizationsWillRead.push(o.title);
                  let index1 = this.organizationsToRead.indexOf(o.title);
                  if (index1 >= 0) {
                    this.organizationsToRead.splice(index1, 1);
                  }
                })
                .catch((er) => {
                  this.organizationsWillRead.push(org);
                  let index3 = this.organizationsWillRead.indexOf(org);
                  if (index3 >= 0) {
                    this.organizationsWillRead.splice(index3, 1);
                  }
                });
            });
          }
          if (typeof data.meta.write != 'undefined') {
            data.meta.write.forEach((org) => {
              this._organizationApi
                .getOrgById(org)
                .then((o: Organization) => {
                  this.organizationsWillWrite.push(o.title);
                  let index1 = this.organizationsToWrite.indexOf(o.title);
                  if (index1 >= 0) {
                    this.organizationsToWrite.splice(index1, 1);
                  }
                })
                .catch((er) => {
                  this.organizationsWillWrite.push(org);
                  let index3 = this.organizationsWillWrite.indexOf(org);
                  if (index3 >= 0) {
                    this.organizationsWillWrite.splice(index3, 1);
                  }
                });
            });
          }
          if (typeof data.meta.execute != 'undefined') {
            data.meta.execute.forEach((org) => {
              this._organizationApi
                .getOrgById(org)
                .then((o: Organization) => {
                  this.organizationsWillExecute.push(o.title);
                  let index1 = this.organizationsToExecute.indexOf(o.title);
                  if (index1 >= 0) {
                    this.organizationsToExecute.splice(index1, 1);
                  }
                })
                .catch((er) => {
                  this.organizationsWillExecute.push(org);
                  let index3 = this.organizationsWillExecute.indexOf(org);
                  if (index3 >= 0) {
                    this.organizationsWillExecute.splice(index3, 1);
                  }
                });
            });
          }
        });
    }
    if (this._entityType === 'model') {
      this._modelApi
        .getWithIdSecured(this._entityId.split('/')[1])
        .subscribe((model: Model) => {
          if (typeof model.meta.read != 'undefined') {
            model.meta.read.forEach((org) => {
              this._organizationApi
                .getOrgById(org)
                .then((o: Organization) => {
                  this.organizationsWillRead.push(o.title);
                  let index1 = this.organizationsToRead.indexOf(o.title);
                  if (index1 >= 0) {
                    this.organizationsToRead.splice(index1, 1);
                  }
                })
                .catch((er) => {
                  this.organizationsWillRead.push(org);
                  let index3 = this.organizationsWillRead.indexOf(org);
                  if (index3 >= 0) {
                    this.organizationsWillRead.splice(index3, 1);
                  }
                });
            });
          }
          if (typeof model.meta.write != 'undefined') {
            model.meta.write.forEach((org) => {
              this._organizationApi
                .getOrgById(org)
                .then((o: Organization) => {
                  this.organizationsWillWrite.push(o.title);
                  let index1 = this.organizationsToWrite.indexOf(o.title);
                  if (index1 >= 0) {
                    this.organizationsToRead.splice(index1, 1);
                  }
                })
                .catch((er) => {
                  this.organizationsWillWrite.push(org);
                  let index3 = this.organizationsToWrite.indexOf(org);
                  if (index3 >= 0) {
                    this.organizationsToWrite.splice(index3, 1);
                  }
                });
            });
          }
          if (typeof model.meta.execute != 'undefined') {
            model.meta.execute.forEach((org) => {
              this._organizationApi
                .getOrgById(org)
                .then((o: Organization) => {
                  this.organizationsWillExecute.push(o.title);
                  let index1 = this.organizationsToExecute.indexOf(o.title);
                  if (index1 >= 0) {
                    this.organizationsToExecute.splice(index1, 1);
                  }
                })
                .catch((er) => {
                  this.organizationsWillExecute.push(org);
                  let index3 = this.organizationsToExecute.indexOf(org);
                  if (index3 >= 0) {
                    this.organizationsToExecute.splice(index3, 1);
                  }
                });
            });
          }
        });
    }
    this.title = 'Share ' + this._entityType;
  }

  addReadOrg(event: MatChipInputEvent): void {
    // Add organzation only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matReadcomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add
      if (
        (value || '').trim() &&
        this.organizationsAll.includes(event.value) &&
        !this.organizationsWillRead.includes(event.value) &&
        !this.organizationsToRead.includes(event.value)
      ) {
        this.organizationsWillRead.push(value.trim());
        this.organizationsToNotify.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.readCtrl.setValue(null);
    }
  }

  removeReadOrg(org: string): void {
    if (this.organizationsAll.includes(org)) {
      this.organizationsToRead.push(org);
    }
    const index = this.organizationsWillRead.indexOf(org);
    if (index >= 0) {
      this.organizationsWillRead.splice(index, 1);
    }
    if (
      this.organizationsWillExecute.length +
        this.organizationsWillRead.length +
        this.organizationsWillWrite.length >
      0
    ) {
      this.share = false;
      this.cancell = false;
    } else {
      this.share = true;
      this.cancell = true;
    }
  }

  readSelected(event: MatAutocompleteSelectedEvent): void {
    const index = this.organizationsToRead.indexOf(event.option.viewValue);
    if (index >= 0) {
      this.organizationsToRead.splice(index, 1);
    }
    if (
      this.organizationsAll.includes(event.option.viewValue) &&
      !this.organizationsWillRead.includes(event.option.viewValue) &&
      !this.organizationsToRead.includes(event.option.viewValue)
    ) {
      this.organizationsWillRead.push(event.option.viewValue);
      this.organizationsToNotify.push(event.option.viewValue);
      this.readInput.nativeElement.value = '';
      this.readCtrl.setValue(null);
    }

    if (
      this.organizationsWillExecute.length +
        this.organizationsWillRead.length +
        this.organizationsWillWrite.length >
      0
    ) {
      this.share = false;
      this.cancell = false;
    } else {
      this.share = true;
      this.cancell = true;
    }
  }

  addWriteOrg(event: MatChipInputEvent): void {
    // Add organzation only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matWritecomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add
      if (
        (value || '').trim() &&
        this.organizationsAll.includes(event.value) &&
        !this.organizationsWillWrite.includes(event.value) &&
        !this.organizationsToWrite.includes(event.value)
      ) {
        const index = this.organizationsToWrite.indexOf(value.trim());
        if (index >= 0) {
          this.organizationsAll.splice(index, 1);
        }
        this.organizationsWillWrite.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.writeCtrl.setValue(null);
    }
  }

  removeWriteOrg(org: string): void {
    if (this.organizationsAll.includes(org)) {
      this.organizationsToWrite.push(org);
    }
    const index = this.organizationsWillWrite.indexOf(org);
    if (index >= 0) {
      this.organizationsWillWrite.splice(index, 1);
    }
    if (
      this.organizationsWillExecute.length +
        this.organizationsWillRead.length +
        this.organizationsWillWrite.length >
      0
    ) {
      this.share = false;
      this.cancell = false;
    } else {
      this.share = true;
      this.cancell = true;
    }
  }

  writeSelected(event: MatAutocompleteSelectedEvent): void {
    const index = this.organizationsToWrite.indexOf(event.option.viewValue);
    if (index >= 0) {
      this.organizationsToWrite.splice(index, 1);
    }
    if (!this.organizationsWillRead.includes(event.option.viewValue)) {
      this.organizationsWillRead.push(event.option.viewValue);
      const index = this.organizationsToRead.indexOf(event.option.viewValue);
      if (index >= 0) {
        this.organizationsToRead.splice(index, 1);
      }
    }
    this.organizationsWillWrite.push(event.option.viewValue);
    this.writeInput.nativeElement.value = '';
    this.writeCtrl.setValue(null);
    if (
      this.organizationsWillExecute.length +
        this.organizationsWillRead.length +
        this.organizationsWillWrite.length >
      0
    ) {
      this.share = false;
      this.cancell = false;
    } else {
      this.share = true;
      this.cancell = true;
    }
  }

  addExecuteOrg(event: MatChipInputEvent): void {
    // Add organzation only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matExecutecomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add
      if (
        (value || '').trim() &&
        this.organizationsAll.includes(event.value) &&
        !this.organizationsWillExecute.includes(event.value) &&
        !this.organizationsToExecute.includes(event.value)
      ) {
        const index = this.organizationsToExecute.indexOf(value.trim());
        if (index >= 0) {
          this.organizationsAll.splice(index, 1);
        }
        this.organizationsWillExecute.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.writeCtrl.setValue(null);
    }
  }

  removeExecuteOrg(org: string): void {
    if (this.organizationsAll.includes(org)) {
      this.organizationsToExecute.push(org);
    }
    const index = this.organizationsWillExecute.indexOf(org);
    if (index >= 0) {
      this.organizationsWillExecute.splice(index, 1);
    }
    if (
      this.organizationsWillExecute.length +
        this.organizationsWillRead.length +
        this.organizationsWillWrite.length >
      0
    ) {
      this.share = false;
      this.cancell = false;
    } else {
      this.share = true;
      this.cancell = true;
    }
  }

  executeSelected(event: MatAutocompleteSelectedEvent): void {
    const index = this.organizationsToExecute.indexOf(event.option.viewValue);
    if (index >= 0) {
      this.organizationsToExecute.splice(index, 1);
    }
    if (!this.organizationsWillRead.includes(event.option.viewValue)) {
      this.organizationsWillRead.push(event.option.viewValue);
      const index = this.organizationsToRead.indexOf(event.option.viewValue);
      if (index >= 0) {
        this.organizationsToRead.splice(index, 1);
      }
    }
    this.organizationsWillExecute.push(event.option.viewValue);
    this.organizationsToNotify.push(event.option.viewValue);
    this.executeInput.nativeElement.value = '';
    this.executeCtrl.setValue(null);
    if (
      this.organizationsWillExecute.length +
        this.organizationsWillRead.length +
        this.organizationsWillWrite.length >
      0
    ) {
      this.share = false;
      this.cancell = false;
    } else {
      this.share = true;
      this.cancell = true;
    }
  }

  reset() {
    this.organizationsWillExecute = [];
    this.organizationsWillRead = [];
    this.organizationsWillWrite = [];
    this.organizationsToExecute = this.organizationsAll.slice();
    this.organizationsToRead = this.organizationsAll.slice();
    this.organizationsToWrite = this.organizationsAll.slice();
    this.share = true;
    this.cancell = true;
  }

  startSharing() {
    switch (this._entityType) {
      case 'dataset': {
        this._datasetApi
          .getWithIdSecured(this._entityId.split('/')[1])
          .subscribe((dataset: Dataset) => {
            if (typeof dataset.meta.read === 'undefined') {
              dataset.meta.read = [];
              this.organizationsWillRead.forEach((orgTitle) => {
                this.organizationsFull.forEach((o: Organization) => {
                  if (o.title === orgTitle) {
                    dataset.meta.read.push(o._id);
                  }
                });
              });
              // dataset.meta.read = this.organizationsWillRead.slice()
            } else {
              this.organizationsWillRead.forEach((orgTitle) => {
                this.organizationsFull.forEach((o: Organization) => {
                  if (o.title === orgTitle) {
                    dataset.meta.read.push(o._id);
                  }
                });
              });
              // dataset.meta.read = dataset.meta.read.concat(this.organizationsWillRead)
            }
            if (typeof dataset.meta.write === 'undefined') {
              dataset.meta.write = [];
              this.organizationsWillWrite.forEach((orgTitle) => {
                this.organizationsFull.forEach((o: Organization) => {
                  if (o.title === orgTitle) {
                    dataset.meta.write.push(o._id);
                  }
                });
              });
              // dataset.meta.write = this.organizationsWillWrite.slice()
            } else {
              this.organizationsWillWrite.forEach((orgTitle) => {
                this.organizationsFull.forEach((o: Organization) => {
                  if (o.title === orgTitle) {
                    dataset.meta.write.push(o._id);
                  }
                });
              });
              // dataset.meta.write = dataset.meta.write.concat(this.organizationsWillWrite)
            }
            if (typeof dataset.meta.execute === 'undefined') {
              dataset.meta.execute = [];
              this.organizationsWillExecute.forEach((orgTitle) => {
                this.organizationsFull.forEach((o: Organization) => {
                  if (o.title === orgTitle) {
                    dataset.meta.execute.push(o._id);
                  }
                });
              });
              // dataset.meta.execute = this.organizationsWillExecute.slice()
            } else {
              this.organizationsWillWrite.forEach((orgTitle) => {
                this.organizationsFull.forEach((o: Organization) => {
                  if (o.title === orgTitle) {
                    dataset.meta.execute.push(o._id);
                  }
                });
              });
              // dataset.meta.execute = dataset.meta.write.concat(this.organizationsWillExecute)
            }
            // let uniqueOrgs:string[] = this.organizationsWillRead.slice();
            // let uniqueOrgs:string[] = this.organizationsToNotify.slice();
            let uniqueOrgs: string[] = Array.from(
              new Set(this.organizationsToNotify),
            );
            let jind = uniqueOrgs.indexOf('Jaqpot');
            if (jind >= 0) {
              uniqueOrgs.splice(jind, 1);
            }
            uniqueOrgs.forEach((orgTitle) => {
              var orgIdF = this.organizationsFull.find((obj) => {
                return obj.title === orgTitle;
              });
              this._organizationApi
                .getOrgById(orgIdF._id)
                .then((users: Organization) => {
                  if (typeof users != 'undefined') {
                    users.users.forEach((id) => {
                      let notific: Notification =
                        this._notificationFactory.shareNotification(
                          this._userId,
                          id,
                          orgIdF._id,
                          this._entityId,
                        );
                      this._notificationApi
                        .postEntity(notific)
                        .subscribe((data) => {});
                    });
                  }
                });
            });
            this._datasetApi.putMeta(dataset).subscribe((data) => {
              this.success = true;
            });
          });
        break;
      }
      case 'model': {
        this._modelApi
          .getWithIdSecured(this._entityId.split('/')[1])
          .subscribe((model: Model) => {
            if (typeof model.meta.read === 'undefined') {
              model.meta.read = [];
              this.organizationsWillRead.forEach((orgTitle) => {
                this.organizationsFull.forEach((o: Organization) => {
                  if (o.title === orgTitle) {
                    model.meta.read.push(o._id);
                  }
                });
              });
              // model.meta.read = this.organizationsWillRead.slice()
            } else {
              this.organizationsWillRead.forEach((orgTitle) => {
                this.organizationsFull.forEach((o: Organization) => {
                  if (o.title === orgTitle) {
                    model.meta.read.push(o._id);
                  }
                });
              });
              // model.meta.read = model.meta.read.concat(this.organizationsWillRead)
            }
            if (typeof model.meta.write === 'undefined') {
              model.meta.write = [];
              this.organizationsWillWrite.forEach((orgTitle) => {
                this.organizationsFull.forEach((o: Organization) => {
                  if (o.title === orgTitle) {
                    model.meta.write.push(o._id);
                  }
                });
              });
              // model.meta.write = this.organizationsWillWrite.slice()
            } else {
              this.organizationsWillWrite.forEach((orgTitle) => {
                this.organizationsFull.forEach((o: Organization) => {
                  if (o.title === orgTitle) {
                    model.meta.write.push(o._id);
                  }
                });
              });
              // model.meta.write = model.meta.write.concat(this.organizationsWillWrite)
            }
            if (typeof model.meta.execute === 'undefined') {
              model.meta.execute = [];
              this.organizationsWillExecute.forEach((orgTitle) => {
                this.organizationsFull.forEach((o: Organization) => {
                  if (o.title === orgTitle) {
                    model.meta.execute.push(o._id);
                  }
                });
              });
              // model.meta.execute = this.organizationsWillExecute.slice()
            } else {
              this.organizationsWillExecute.forEach((orgTitle) => {
                this.organizationsFull.forEach((o: Organization) => {
                  if (o.title === orgTitle) {
                    model.meta.execute.push(o._id);
                  }
                });
              });
              // model.meta.execute = model.meta.write.concat(this.organizationsWillExecute)
            }
            // let uniqueOrgs:string[] = this.organizationsWillRead.slice();
            let uniqueOrgs: string[] = Array.from(
              new Set(this.organizationsToNotify),
            );
            let jind = uniqueOrgs.indexOf('Jaqpot');
            if (jind >= 0) {
              uniqueOrgs.splice(jind, 1);
            }
            uniqueOrgs.forEach((orgTitle) => {
              var orgIdF = this.organizationsFull.find((obj) => {
                return obj.title === orgTitle;
              });
              this._organizationApi
                .getOrgById(orgIdF._id)
                .then((users: Organization) => {
                  if (typeof users != 'undefined') {
                    users.users.forEach((id) => {
                      let notific: Notification =
                        this._notificationFactory.shareNotification(
                          this._userId,
                          id,
                          orgIdF._id,
                          this._entityId,
                        );
                      this._notificationApi
                        .postEntity(notific)
                        .subscribe((data) => {});
                    });
                  }
                });
            });
            this._modelApi.putMeta(model).subscribe((data) => {
              this.success = true;
            });
          });
        break;
      }
      default: {
        console.log('default');
      }
    }
  }

  toggleChange(event) {
    if (event.checked === false) {
      // this.organizationsWillExecute = []
      // this.organizationsWillRead = []
      // this.organizationsWillWrite = []
      this.affiliatedOrgs.forEach((o) => {
        this.organizationsToExecute.push(o);
        this.organizationsToRead.push(o);
        this.organizationsToWrite.push(o);
      });
      // this.organizationsToExecute = this.organizationsAll.slice()
      // this.organizationsToRead = this.organizationsAll.slice()
      // this.organizationsToWrite = this.organizationsAll.slice()
      this.share = true;
      this.cancell = true;
    } else {
      // this.organizationsWillExecute = []
      // this.organizationsWillRead = []
      // this.organizationsWillWrite = []
      this.affiliatedOrgs.forEach((o) => {
        this.organizationsToExecute.push(o);
        this.organizationsToRead.push(o);
        this.organizationsToWrite.push(o);
      });
      // this.organizationsToExecute = this.affiliatedOrgs.slice()
      // this.organizationsToRead = this.affiliatedOrgs.slice()
      // this.organizationsToWrite = this.affiliatedOrgs.slice()
      this.share = true;
      this.cancell = true;
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.organizationsAll.filter(
      (fruit) => fruit.toLowerCase().indexOf(filterValue) === 0,
    );
  }
}
