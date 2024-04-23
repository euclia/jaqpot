import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { LoginDialogComponent } from './login-logout-dialog/login-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Credentials } from '../ui-models/credentials';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { ErrorReport } from '../ui-models/errorReport';
import { OrganizationDialogComponent } from './organization-dialog/organization-dialog.component';
import { OrganizationService } from '../jaqpot-client/api/organization.service';
import { InviteDialogComponent } from './invite-dialog/invite-dialog.component';
import { UserService } from '../jaqpot-client/api/user.service';
import { NotificationFactoryService } from '../jaqpot-client/factories/notification-factory.service';
import { NotificationService } from '../jaqpot-client/api/notification.service';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { InvitationNotifDialogComponent } from './notification-dialogs/invitation-notif-dialog/invitation-notif-dialog.component';
import { Notification } from '../jaqpot-client/model/notification';
import { AddDatasetDialogComponent } from './add-dataset-dialog/add-dataset-dialog.component';
import { UpdatePhotoComponent } from './update-photo/update-photo.component';
import { UserQuickComponent } from './user-quick/user-quick.component';
import { AddImageDatasetDialogComponent } from './add-image-dataset-dialog/add-image-dataset-dialog.component';
import { FeatureFactoryService } from '../jaqpot-client/factories/feature-factory.service';
import { DatasetToViewdataService } from '../services/dataset-to-viewdata.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';
import { DatasetService } from '../jaqpot-client/api/dataset.service';
import { ModelService } from '../jaqpot-client/api/model.service';
import { ShareNotifDialogComponent } from './notification-dialogs/share-notif-dialog/share-notif-dialog.component';
import { AskForIdComponent } from './ask-for-id/ask-for-id.component';
import { AddAdministratorComponent } from './add-administrator/add-administrator.component';
import { AffiliationsDialogComponent } from './affiliations-dialog/affiliations-dialog.component';
import { AffiliationNotifComponent } from './notification-dialogs/affiliation-notif/affiliation-notif.component';
import { FyiNotifComponent } from './notification-dialogs/fyi-notif/fyi-notif.component';
import { BrokenAffilNotifComponent } from './notification-dialogs/broken-affil-notif/broken-affil-notif.component';
import { ChooseXYComponent } from './choose-x-y/choose-x-y.component';
import { User } from '@euclia/accounts-client';
import { ManageAccountsDialogComponent } from './manage-accounts-dialog/manage-accounts-dialog.component';
import { Organization } from '@euclia/accounts-client';

@Injectable()
export class DialogsService {
  private _errorReport: ErrorReport;

  constructor(
    private dialog: MatDialog,
    // public notificationFactory:NotificationFactoryService,
    // public notificationService:NotificationService
  ) {}

  public confirm(): Observable<Credentials> {
    let dialogRef: MatDialogRef<LoginDialogComponent>;
    dialogRef = this.dialog.open(LoginDialogComponent);

    return dialogRef.afterClosed();
  }

  public close() {
    this.dialog.closeAll();
  }

  public updatePhoto(userApi, datasetApi, modelApi) {
    let dialogRef: MatDialogRef<UpdatePhotoComponent>;
    dialogRef = this.dialog.open(UpdatePhotoComponent);
    dialogRef.componentInstance.datasetApi = datasetApi;
    dialogRef.componentInstance.modelApi = modelApi;
    dialogRef.componentInstance.userApi = userApi;
    return dialogRef.afterClosed();
  }

  public quickUser(userApi, user: User) {
    let dialogRef: MatDialogRef<UserQuickComponent>;
    dialogRef = this.dialog.open(UserQuickComponent);
    dialogRef.componentInstance.userApi = userApi;
    dialogRef.componentInstance.user = user;
    return dialogRef.afterClosed();
  }

  public addCsvDataset(csv, filename, datasetFactory, featureApi, datasetApi) {
    let dialogRef: MatDialogRef<AddDatasetDialogComponent>;
    dialogRef = this.dialog.open(AddDatasetDialogComponent);
    dialogRef.componentInstance.csv = csv;
    dialogRef.componentInstance.file_name = filename;
    dialogRef.componentInstance.datasetFactory = datasetFactory;
    dialogRef.componentInstance.featureApi = featureApi;
    dialogRef.componentInstance.datasetApi = datasetApi;
    return dialogRef.afterClosed();
  }

  // public addImageDataset(images:{ [key: string]: string}, datasetFactory, featureApi, datasetApi)
  // {
  //     let dialogRef: MatDialogRef<AddImageDatasetDialogComponent>;
  //     dialogRef = this.dialog.open(AddImageDatasetDialogComponent);
  //     dialogRef.componentInstance.images = images
  //     dialogRef.componentInstance.datasetFactory = datasetFactory
  //     dialogRef.componentInstance.featureApi = featureApi
  //     dialogRef.componentInstance.datasetApi = datasetApi
  //     return dialogRef.afterClosed()
  // }

  public addImageCsvDataset(
    images: string,
    datasetFactory,
    datasetViewService: DatasetToViewdataService,
    featureApi,
    datasetApi,
    featFactory: FeatureFactoryService,
  ) {
    let dialogRef: MatDialogRef<AddImageDatasetDialogComponent>;
    dialogRef = this.dialog.open(AddImageDatasetDialogComponent);
    dialogRef.componentInstance.images = images;
    dialogRef.componentInstance.datasetFactory = datasetFactory;
    dialogRef.componentInstance.featureApi = featureApi;
    dialogRef.componentInstance.datasetApi = datasetApi;
    dialogRef.componentInstance.featFactory = featFactory;
    dialogRef.componentInstance.datasetViewService = datasetViewService;
    return dialogRef.afterClosed();
  }

  public confirmDeletion(confirmationMessage: string, confirmationAction) {
    let dialogRef: MatDialogRef<ConfirmationDialogComponent>;
    dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.componentInstance.confirmationAction = confirmationAction;
    dialogRef.componentInstance.confirmationMessage = confirmationMessage;
    return dialogRef.afterClosed();
  }

  public addAdministrator(
    userIds: string[],
    admins: string[],
    userApi: UserService,
  ) {
    let dialogRef: MatDialogRef<AddAdministratorComponent>;
    dialogRef = this.dialog.open(AddAdministratorComponent);
    dialogRef.componentInstance.userIds = userIds;
    dialogRef.componentInstance.userApi = userApi;
    dialogRef.componentInstance.admins = admins;
    return dialogRef.afterClosed();
  }

  public openActualNotifDialog(
    notification: Notification,
    organizationService: OrganizationService,
    notificationService: NotificationService,
    datasetService: DatasetService,
    modelService: ModelService,
    userService: UserService,
    openedFrom: string,
  ) {
    if (notification.type === 'INVITATION') {
      let dialogRef: MatDialogRef<InvitationNotifDialogComponent>;
      dialogRef = this.dialog.open(InvitationNotifDialogComponent);
      dialogRef.componentInstance.organizationService = organizationService;
      dialogRef.componentInstance.notificationService = notificationService;
      dialogRef.componentInstance.userService = userService;
      dialogRef.componentInstance.notification = notification;
      dialogRef.componentInstance.openedFrom = openedFrom;
      return dialogRef.afterClosed();
    }
    if (notification.type === 'SHARE') {
      let dialogRef: MatDialogRef<ShareNotifDialogComponent>;
      dialogRef = this.dialog.open(ShareNotifDialogComponent);
      dialogRef.componentInstance._organizationApi = organizationService;
      dialogRef.componentInstance._notificationApi = notificationService;
      dialogRef.componentInstance._userApi = userService;
      dialogRef.componentInstance._notification = notification;
      dialogRef.componentInstance._modelApi = modelService;
      dialogRef.componentInstance._datasetApi = datasetService;
      dialogRef.componentInstance.openedFrom = openedFrom;
      return dialogRef.afterClosed();
    }
    if (notification.type === 'AFFILIATION') {
      let dialogRef: MatDialogRef<AffiliationNotifComponent>;
      dialogRef = this.dialog.open(AffiliationNotifComponent);
      dialogRef.componentInstance._organizationApi = organizationService;
      dialogRef.componentInstance._notificationApi = notificationService;
      dialogRef.componentInstance._userApi = userService;
      dialogRef.componentInstance._notification = notification;
      dialogRef.componentInstance._modelApi = modelService;
      dialogRef.componentInstance._datasetApi = datasetService;
      dialogRef.componentInstance.openedFrom = openedFrom;
      return dialogRef.afterClosed();
    }
    if (notification.type === 'FYI') {
      let dialogRef: MatDialogRef<FyiNotifComponent>;
      dialogRef = this.dialog.open(FyiNotifComponent);
      dialogRef.componentInstance._organizationApi = organizationService;
      dialogRef.componentInstance._notificationApi = notificationService;
      dialogRef.componentInstance._userApi = userService;
      dialogRef.componentInstance._notification = notification;
      dialogRef.componentInstance._modelApi = modelService;
      dialogRef.componentInstance._datasetApi = datasetService;
      dialogRef.componentInstance.openedFrom = openedFrom;
      return dialogRef.afterClosed();
    }
    if (notification.type === 'BROKENAFFILIATION') {
      let dialogRef: MatDialogRef<BrokenAffilNotifComponent>;
      dialogRef = this.dialog.open(BrokenAffilNotifComponent);
      dialogRef.componentInstance._organizationApi = organizationService;
      dialogRef.componentInstance._notificationApi = notificationService;
      dialogRef.componentInstance._userApi = userService;
      dialogRef.componentInstance._notification = notification;
      dialogRef.componentInstance._modelApi = modelService;
      dialogRef.componentInstance._datasetApi = datasetService;
      dialogRef.componentInstance.openedFrom = openedFrom;
      return dialogRef.afterClosed();
    }
  }

  public onOrganizationView(
    organization: Organization,
    organizationService: OrganizationService,
    canGo: boolean,
  ) {
    let dialogRef: MatDialogRef<OrganizationDialogComponent>;
    dialogRef = this.dialog.open(OrganizationDialogComponent);
    dialogRef.componentInstance.organization = organization;
    dialogRef.componentInstance.organizationService = organizationService;
    dialogRef.componentInstance.view = canGo;
    return dialogRef.afterClosed();
  }

  public inviteToOrganization(
    userService: UserService,
    notifFactory: NotificationFactoryService,
    organization: Organization,
    notificationService: NotificationService,
  ) {
    let dialogRef: MatDialogRef<InviteDialogComponent>;
    dialogRef = this.dialog.open(InviteDialogComponent);
    dialogRef.componentInstance.userService = userService;
    dialogRef.componentInstance.notifFactory = notifFactory;
    dialogRef.componentInstance.organization = organization;
    dialogRef.componentInstance.notificationService = notificationService;
    return dialogRef.afterClosed();
  }

  public askForId(ids) {
    let dialogRef: MatDialogRef<AskForIdComponent>;
    dialogRef = this.dialog.open(AskForIdComponent);
    dialogRef.componentInstance.ids = ids;
    return dialogRef.afterClosed();
  }

  public chooseXY(data) {
    let dialogRef: MatDialogRef<ChooseXYComponent>;
    dialogRef = this.dialog.open(ChooseXYComponent);
    dialogRef.componentInstance.data = data;
    return dialogRef.afterClosed();
  }

  public openSharingDialog(
    entityType: string,
    entityId: string,
    modelService: ModelService,
    datasetService: DatasetService,
    organizationService: OrganizationService,
    notificationService: NotificationService,
    notificationFactory: NotificationFactoryService,
    userService: UserService,
    userId: string,
  ) {
    let dialogRef: MatDialogRef<ShareDialogComponent>;
    dialogRef = this.dialog.open(ShareDialogComponent);
    dialogRef.componentInstance._entityType = entityType;
    dialogRef.componentInstance._entityId = entityId;
    dialogRef.componentInstance._modelApi = modelService;
    dialogRef.componentInstance._datasetApi = datasetService;
    dialogRef.componentInstance._organizationApi = organizationService;
    dialogRef.componentInstance._notificationApi = notificationService;
    dialogRef.componentInstance._notificationFactory = notificationFactory;
    dialogRef.componentInstance._userApi = userService;
    dialogRef.componentInstance._userId = userId;
    return dialogRef.afterClosed();
  }

  public openAffiliationRequest(
    organizationService: OrganizationService,
    notifApi: NotificationService,
    notificationFactory: NotificationFactoryService,
    fromOrg,
  ) {
    let dialogRef: MatDialogRef<AffiliationsDialogComponent>;
    dialogRef = this.dialog.open(AffiliationsDialogComponent);
    dialogRef.componentInstance.notificationApi = notifApi;
    dialogRef.componentInstance.organizationApi = organizationService;
    dialogRef.componentInstance.notificationFactory = notificationFactory;
    dialogRef.componentInstance.fromOrg = fromOrg;
    return dialogRef.afterClosed();
  }

  public onError(error: HttpErrorResponse) {
    let errorReport = error.error;
    let dialogRef: MatDialogRef<ErrorDialogComponent>;
    dialogRef = this.dialog.open(ErrorDialogComponent);
    // if (error.error instanceof ErrorEvent) {
    //     // A client-side or network error occurred. Handle it accordingly.
    //     console.error('An error occurred:', error.error.message);
    //   } else {
    //     // The backend returned an unsuccessful response code.
    //     // The response body may contain clues as to what went wrong,
    //     console.error(
    //       `Backend returned code ${error.status}, ` +
    //       `body was: ${error.error}`);
    //   }
    dialogRef.componentInstance.httpStatus = errorReport.httpStatus;
    dialogRef.componentInstance.details = errorReport.details;
    dialogRef.componentInstance.message = errorReport.message;
    return dialogRef.afterClosed();
  }

  public manageAccounts() {
    let dialogRef: MatDialogRef<ManageAccountsDialogComponent>;
    dialogRef = this.dialog.open(ManageAccountsDialogComponent);
    return dialogRef.afterClosed();
  }
}
