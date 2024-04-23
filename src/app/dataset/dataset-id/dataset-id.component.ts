import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { SessionService } from '../../session/session.service';
import { DatasetService } from '../../jaqpot-client/api/dataset.service';
import { Dataset, MetaInfo, Feature } from '../../jaqpot-client';
import { UserService } from '../../jaqpot-client/api/user.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { ModelService } from '../../jaqpot-client/api/model.service';
import { FeatureApiService } from '../../jaqpot-client/api/feature.service';
import { NotificationService } from '../../jaqpot-client/api/notification.service';
import { NotificationFactoryService } from '../../jaqpot-client/factories/notification-factory.service';
import { OrganizationService } from '../../jaqpot-client/api/organization.service';
import { User } from '@euclia/accounts-client';

@Component({
  selector: 'app-dataset-id',
  templateUrl: './dataset-id.component.html',
  styleUrls: ['./dataset-id.component.css'],
})
export class DatasetIdComponent implements OnInit, OnDestroy {
  datasetToSee: Dataset;

  datasetOwner: User = {};

  canUpdatePhoto: boolean = true;

  canEdit: boolean = false;
  edit: boolean = false;
  save: boolean = false;
  id: string;

  viewOrEdit: string = 'view';
  saveEmit: string = 'false';
  entityMeta: MetaInfo;

  entityId: string;

  featsUpdatedArray: Feature[] = [];

  navigationSubscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private datasetApi: DatasetService,
    public userApi: UserService,
    public modelApi: ModelService,
    public dialogsService: DialogsService,
    public featureApi: FeatureApiService,
    public notificationService: NotificationService,
    public notificationFactory: NotificationFactoryService,
    public organizationApi: OrganizationService,
  ) {
    this.navigationSubscription = this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.entityId = 'dataset/' + this.id;
    this.datasetApi.getWithIdSecured(this.id).subscribe((dataset: Dataset) => {
      this.datasetToSee = dataset;
      if (typeof this.datasetToSee.meta.descriptions === 'undefined') {
        this.datasetToSee.meta.descriptions = [];
      }

      this.entityMeta = dataset.meta;
      this.userApi.getUserById(dataset.meta.creators[0]).then((owned) => {
        this.datasetOwner = owned;
      });
      this.userApi
        .getUserById(this.sessionService.getUserId())
        .then((user: User) => {
          if (dataset.meta.creators.includes(this.sessionService.getUserId())) {
            this.canEdit = true;
            this.edit = true;
            this.canUpdatePhoto = true;
          }
          user.organizations.forEach((org) => {
            if (
              typeof dataset.meta.write != 'undefined' &&
              dataset.meta.write.includes(org)
            ) {
              this.canEdit = true;
              this.edit = true;
              this.canUpdatePhoto = true;
            }
          });
        });
    });
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  updatePhoto() {
    this.dialogsService
      .updatePhoto(this.datasetApi, this.modelApi, this.userApi)
      .subscribe((result) => {
        if (result != undefined) {
          this.datasetToSee.meta.picture = result;
          this.datasetApi
            .putMeta(this.datasetToSee)
            .subscribe((res: MetaInfo) => {
              this.datasetToSee.meta = res;
            });
        }
        this.fetchDatasetAndUser();
      });
  }

  fetchDatasetAndUser() {
    this.datasetApi
      .getPropertyWithIdSecured(this.id, 'meta')
      .subscribe((dataset: Dataset) => {
        this.datasetToSee = dataset;
        if (dataset.meta.creators.includes(this.sessionService.getUserId())) {
          this.edit = true;
          this.canUpdatePhoto = true;
        }
        this.userApi.getUserById(dataset.meta.creators[0]).then((owned) => {
          this.datasetOwner = owned;
        });
      });
  }

  openUser() {
    this.dialogsService.quickUser(this.userApi, this.datasetOwner);
  }

  editAll() {
    this.edit = false;
    this.save = true;
    this.viewOrEdit = 'edit';
  }

  quickView() {
    if (this.viewOrEdit === 'edit') {
      this.viewOrEdit = 'view';
    } else {
      this.viewOrEdit = 'edit';
    }
  }

  saveAll() {
    this.save = false;
    this.edit = true;
    this.viewOrEdit = 'view';
    this.featsUpdatedArray.forEach((feat: Feature) => {
      this.featureApi
        .putWithIdSecured(feat._id.toString(), feat)
        .subscribe((feat: Feature) => {});
    });
    this.datasetApi.putMeta(this.datasetToSee).subscribe((res: MetaInfo) => {
      this.datasetToSee.meta = res;
    });
  }

  share() {
    this.dialogsService
      .openSharingDialog(
        'dataset',
        this.entityId,
        this.modelApi,
        this.datasetApi,
        this.organizationApi,
        this.notificationService,
        this.notificationFactory,
        this.userApi,
        this.sessionService.getUserId(),
      )
      .subscribe((res) => {
        this.datasetApi
          .getWithIdSecured(this.id)
          .subscribe((dataset: Dataset) => {
            this.datasetToSee = dataset;
          });
      });
  }

  markdownChanged(meta) {
    this.datasetToSee.meta = meta;
  }

  datasetChanged(dataset) {
    this.datasetToSee = dataset;
  }

  featsUpdated(feats: Feature[]) {
    this.featsUpdatedArray = feats;
  }
}
