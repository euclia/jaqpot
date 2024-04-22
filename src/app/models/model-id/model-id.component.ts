import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  UrlSerializer,
} from '@angular/router';
import { SessionService } from '../../session/session.service';
import { ModelApiService } from '../../jaqpot-client/api/model.service';
import { Model, MetaInfo, Feature } from '../../jaqpot-client';
import { DialogsService } from '../../dialogs/dialogs.service';
import { UserService } from '../../jaqpot-client/api/user.service';
import { RightsService } from '../../services/rights.service';
import { DatasetService } from '../../jaqpot-client/api/dataset.service';
import { OrganizationService } from '../../jaqpot-client/api/organization.service';
import { NotificationService } from '../../jaqpot-client/api/notification.service';
import { NotificationFactoryService } from '../../jaqpot-client/factories/notification-factory.service';
import { FeatureApiService } from '../../jaqpot-client/api/feature.service';
import { User } from '@euclia/accounts-client/dist/models/user';
import {
  OidcClientNotification,
  OidcSecurityService,
  UserDataResult,
} from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { MatTabLink } from '@angular/material/tabs/tab-nav-bar/tab-nav-bar';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-model-id',
  templateUrl: './model-id.component.html',
  styleUrls: ['./model-id.component.css'],
})
export class ModelIdComponent implements OnInit {
  id: string;
  entityId: string;
  modelId: string;

  user: User;
  modelToSee: Model;
  modelOwner: User;

  canUpdatePhoto: boolean = false;

  edit: boolean = false;
  canEdit: boolean = false;
  edit_descr: boolean = false;
  save: boolean = false;
  viewOrEdit: string = 'view';

  entityMeta: MetaInfo;

  featsUpdatedArray: Feature[];

  newTag: string;
  addTagB: boolean = false;

  trainedMeta: Object;
  private userData$: Observable<UserDataResult>;
  links = ['Overview', 'Features', 'Predict-Validate', 'Discussion', 'Meta'];
  activeTab: string;

  constructor(
    private rightsService: RightsService,
    private router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private modelApi: ModelApiService,
    private featureApi: FeatureApiService,
    private dialogsService: DialogsService,
    private userApi: UserService,
    private datasetApi: DatasetService,
    private organizationApi: OrganizationService,
    private notificationService: NotificationService,
    private notificationFactory: NotificationFactoryService,
    private oidcSecurityService: OidcSecurityService,
  ) {}

  ngOnInit() {
    this.userData$ = this.oidcSecurityService.userData$;

    this.id = this.route.snapshot.params.id;
    this.activeTab = this.getCurrentTabFromRoute();
    this.modelId = this.id;
    this.modelApi.getWithIdSecured(this.id).subscribe((model: Model) => {
      this.modelToSee = model;
      this.entityMeta = model.meta;

      try {
        this.trainedMeta = model.additionalInfo.fromUser?.meta;
      } catch (e) {
        console.error(e);
      }

      this.userApi
        .getUserById(this.sessionService.getUserId())
        .then((user: User) => {
          this.user = user;
          this.edit = this.rightsService.canEdit(model.meta, user);
          this.canEdit = this.rightsService.canEdit(model.meta, user);
          this.canUpdatePhoto = this.edit;
          this.userApi
            .getUserById(this.modelToSee.meta.creators[0])
            .then((owner: User) => {
              this.modelOwner = owner;
            });
        });
    });

    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        if (isAuthenticated === false) {
          if (this.router.url.includes('model')) {
            localStorage.setItem('goToModel', this.router.url.split('/')[2]);
          }
          this.oidcSecurityService.authorize();
        } else {
          this.userData$.subscribe((d) => {
            if (d) {
              this.sessionService.setUserData(d);
            }
          });
          localStorage.removeItem('goToModel');
        }
      },
    );
  }

  private getCurrentTabFromRoute() {
    return this.route.snapshot.firstChild.url[0].path;
  }

  updatePhoto() {
    this.dialogsService
      .updatePhoto(this.modelApi, this.modelApi, this.userApi)
      .subscribe((result) => {
        if (result != undefined) {
          this.modelToSee.meta.picture = result;
          this.modelApi.putMeta(this.modelToSee).subscribe((res: MetaInfo) => {
            this.modelToSee.meta = res;
          });
        }
        this.fetchModel();
      });
  }

  fetchModel() {
    this.modelApi.getWithIdSecured(this.id).subscribe((model: Model) => {
      this.modelToSee = model;
      if (
        model.meta.creators.includes(this.sessionService.getUserId()) ||
        (typeof model.meta.write != 'undefined' &&
          this.user.organizations.forEach((org) => {
            model.meta.write.includes(org);
          }))
      ) {
        this.edit = true;
        this.canUpdatePhoto = true;
      }
    });
  }

  quickView() {
    if (this.viewOrEdit === 'edit') {
      this.viewOrEdit = 'view';
    } else {
      this.viewOrEdit = 'edit';
    }
  }

  openUser() {
    this.dialogsService.quickUser(this.userApi, this.modelOwner);
  }

  share() {
    this.dialogsService
      .openSharingDialog(
        'model',
        this.entityId,
        this.modelApi,
        this.datasetApi,
        this.organizationApi,
        this.notificationService,
        this.notificationFactory,
        this.userApi,
        this.sessionService.getUserId(),
      )
      .subscribe((resp) => {
        this.modelApi.getWithIdSecured(this.id).subscribe((model: Model) => {
          this.modelToSee = model;
        });
      });
  }

  editAll() {
    this.edit_descr = true;
    this.edit = false;
    this.save = true;
    this.viewOrEdit = 'edit';
  }

  markdownChanged(meta) {
    this.modelToSee.meta = meta;
  }

  datasetChanged(dataset) {
    this.modelToSee = dataset;
  }

  featsUpdated(feats: Feature[]) {
    this.featsUpdatedArray = feats;
  }

  saveAll() {
    this.edit_descr = false;
    this.save = false;
    this.edit = true;
    this.viewOrEdit = 'view';
    if (typeof this.featsUpdatedArray != 'undefined') {
      this.featsUpdatedArray.forEach((feat: Feature) => {
        this.featureApi
          .putWithIdSecured(feat._id.toString(), feat)
          .subscribe((feat: Feature) => {});
      });
    }
    this.modelApi.putMeta(this.modelToSee).subscribe((res: MetaInfo) => {
      this.modelToSee.meta = res;
    });
  }

  modelChanged($event) {}

  addTag() {
    this.addTagB = true;
  }

  addTagToModel() {
    if (typeof this.modelToSee.meta.tags === 'undefined') {
      this.modelToSee.meta.tags = [];
      this.modelToSee.meta.tags.push(this.newTag);
      this.newTag = '';
      this.addTagB = true;
    }
    this.modelToSee.meta.tags.push(this.newTag);
    this.newTag = '';
    this.addTagB = true;
  }

  deleteTag(tag) {
    const index = this.modelToSee.meta.tags.indexOf(tag);
    this.modelToSee.meta.tags.splice(index, 1);
  }
}
