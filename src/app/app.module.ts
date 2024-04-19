import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { ObserversModule } from '@angular/cdk/observers';
import { OverlayContainer, OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { AppComponent } from './app.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { SessionService } from './session/session.service';
import { Subscription } from 'rxjs';
import { BaseComponent } from './base/base.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AlgorithmsComponent } from './algorithms/algorithms-component/algorithms.component';
import { ModelsComponent } from './models/models.component';
import { DatasetComponent } from './dataset/dataset-component/dataset.component';
import { HomeComponent } from './home/home.component';
import { AlgorithmsListComponent } from './algorithms/algorithms-list/algorithms-list.component';
import { DatasetListComponent } from './dataset/dataset-list/dataset-list.component';
import { AlgorithmDetailComponent } from './algorithms/algorithm-detail/algorithm-detail.component';
import { DatasetDetailComponent } from './dataset/dataset-detail/dataset-detail.component';
import {
  AbstractSecurityStorage,
  AuthModule,
  LogLevel,
  OidcConfigService,
  OidcSecurityService,
} from 'angular-auth-oidc-client';
import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { HttkBaseComponent } from './httk/base/httk.base.component';
import { CreatehttkmodelComponent } from './httk/createhttkmodel/createhttkmodel.component';
import { ParameterlistComponent } from './base/components/parameterlist/parameterlist.component';
import { ParameterstepsComponent } from './base/components/parametersteps/parametersteps.component';
import { AccountBaseComponent } from './account/account.base/account.base.component';
import { SocialBaseComponent } from './account/social.base/social.base.component';
import { QuotaComponent } from './account/quota/quota.component';
import { OrganizationsComponent } from './account/organizations/organizations.component';
import { OrganizationBaseComponent } from './organization/organization-base/organization-base.component';
import { OrganizationDetailsComponent } from './organization/organization-details/organization-details.component';
import { OrganizationUsersComponent } from './organization/organization-users/organization-users.component';
import { NotificationComponent } from './bar-components/notification/notification.component';
import { FrontComponent } from './front/front.component';
import { DialogsModule } from './dialogs/dialogs.module';
import { DataModelViewComponent } from './home/data-model-view/data-model-view.component';
import { ModelIdComponent } from './models/model-id/model-id.component';
import { WorkbenchBaseComponent } from './workbench/workbench-base/workbench-base.component';
import { DatasetIdComponent } from './dataset/dataset-id/dataset-id.component';
import { MarkdownComponent } from './base/markdown/markdown.component';
import { CommentsComponent } from './base/comments/comments.component';
import { QuickViewComponent } from './home/quick-view/quick-view.component';
import { ModelFeaturesComponent } from './models/model-features/model-features.component';
import { PredictValidateComponent } from './models/predict-validate/predict-validate.component';
import { PredictedComponent } from './base/predicted/predicted.component';
import { SimpleDatasetComponent } from './base/simple-dataset/simple-dataset.component';
import { ValidateComponent } from './models/validate/validate.component';
import { ValidationReportComponent } from './base/validation-report/validation-report.component';
import { SearchAllComponentComponent } from './bar-components/search-all-component/search-all-component.component';
import { SearchBaseComponent } from './search/search-base/search-base.component';
import { SearchQuickViewComponent } from './search/search-quick-view/search-quick-view.component';
import { PredArchiveComponent } from './models/pred-archive/pred-archive.component';
import { JaqpotNotificationsComponent } from './jaqpot-notifications/jaqpot-notifications.component';
import { ViewNotifsComponent } from './jaqpot-notifications/view-notifs/view-notifs.component';
import { HttkmodelsComponent } from './httk/httkmodels/httkmodels.component';
import { PbpkPredictedComponent } from './base/pbpk-predicted/pbpk-predicted.component';
import { MultiLineComponent } from './d3/multi-line/multi-line.component';
import {
  MatPseudoCheckboxModule,
  MatRippleModule,
} from '@angular/material/core';
import { ModelMetaComponent } from './models/model-meta/model-meta.component';

import { ChartComponentComponent } from './base/components/chart-component/chart-component.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { environment } from '../environments/environment';
import { AuthLocalStorage } from './session/security.storage';
import {
  NgxGoogleAnalyticsModule,
  NgxGoogleAnalyticsRouterModule,
} from 'ngx-google-analytics';

@NgModule({
  exports: [
    // CDK
    A11yModule,
    BidiModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    CdkStepperModule,
    CdkTableModule,
    ScrollingModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatCardModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatInputModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatPseudoCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatGridListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatTableModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  declarations: [],

  providers: [],

  imports: [],
})
export class MaterialModule {}

@NgModule({
  imports: [
    BrowserModule,
    NgApexchartsModule,
    MatCheckboxModule,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DialogsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FlexLayoutModule,
    MarkdownModule.forRoot(),
    NgxGoogleAnalyticsModule.forRoot(environment.google_analytics_tag),
    NgxGoogleAnalyticsRouterModule,
    AuthModule.forRoot({
      config: {
        authority: environment.stsServer,
        redirectUrl: environment.redirect_url,
        clientId: environment.client_id,
        responseType: environment.response_type,
        scope: environment.scope,
        silentRenewUrl: environment.silent_redirect_url,
        postLogoutRedirectUri: window.location.origin,
        logLevel: LogLevel.Error, // LogLevel.Debug,
        maxIdTokenIatOffsetAllowedInSeconds: 120,
        historyCleanupOff: true,
      },
    }),
    CommonModule,
  ],
  exports: [
    DialogsModule,
    MaterialModule,
    AppRoutingModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [
    AppComponent,
    ModelMetaComponent,
    BaseComponent,
    ModelMetaComponent,
    AlgorithmsComponent,
    AlgorithmsListComponent,
    AlgorithmDetailComponent,
    DatasetComponent,
    DatasetListComponent,
    DatasetDetailComponent,
    ModelsComponent,
    ModelFeaturesComponent,
    PredictValidateComponent,
    HomeComponent,
    HttkBaseComponent,
    HttkmodelsComponent,
    CreatehttkmodelComponent,
    ParameterlistComponent,
    ParameterstepsComponent,
    AccountBaseComponent,
    SocialBaseComponent,
    ChartComponentComponent,
    QuotaComponent,
    OrganizationsComponent,
    OrganizationBaseComponent,
    OrganizationDetailsComponent,
    OrganizationUsersComponent,
    NotificationComponent,
    FrontComponent,
    DataModelViewComponent,
    ModelIdComponent,
    DatasetIdComponent,
    WorkbenchBaseComponent,
    CommentsComponent,
    QuickViewComponent,
    MarkdownComponent,
    PredictedComponent,
    SimpleDatasetComponent,
    ValidateComponent,
    ValidationReportComponent,
    SearchAllComponentComponent,
    SearchBaseComponent,
    SearchQuickViewComponent,
    PredArchiveComponent,
    JaqpotNotificationsComponent,
    ViewNotifsComponent,
    PbpkPredictedComponent,
    MultiLineComponent,
  ],
  bootstrap: [AppComponent],
  providers: [
    SessionService,
    OidcConfigService,
    { provide: AbstractSecurityStorage, useClass: AuthLocalStorage },
  ],
})
export class AppModule {
  subscription: Subscription;
  theme: string;
  constructor(
    private overlayContainer: OverlayContainer,
    private sessionService: SessionService,
    public oidcSecurityService: OidcSecurityService,
  ) {
    const _theme = sessionService.get('theme');
    if (_theme === 'dark-theme') {
      this.overlayContainer
        .getContainerElement()
        .classList.remove('default-theme');
      this.overlayContainer.getContainerElement().classList.add('dark-theme');
    } else {
      this.overlayContainer
        .getContainerElement()
        .classList.remove('dark-theme');
      this.overlayContainer
        .getContainerElement()
        .classList.add('default-theme');
    }

    this.subscription = this.sessionService.getTheme().subscribe((theme) => {
      const the = Object.values(theme);
      if (the[0] === 'dark-theme') {
        this.theme = 'dark-theme';
        this.overlayContainer
          .getContainerElement()
          .classList.remove('default-theme');
        this.overlayContainer.getContainerElement().classList.add('dark-theme');
      } else {
        this.theme = 'default-theme';
        this.overlayContainer
          .getContainerElement()
          .classList.remove('dark-theme');
        this.overlayContainer
          .getContainerElement()
          .classList.add('default-theme');
      }
    });
  }

  changeTheme(theme: string) {
    this.overlayContainer.getContainerElement().classList.add(theme);
  }
}
