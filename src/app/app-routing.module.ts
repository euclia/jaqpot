import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AlgorithmsComponent } from './algorithms/algorithms-component/algorithms.component';
import { ModelsComponent } from './models/models.component';
import { HomeComponent } from './home/home.component';
import { DatasetDetailComponent } from './dataset/dataset-detail/dataset-detail.component';
import { DatasetListComponent } from './dataset/dataset-list/dataset-list.component';
import { AuthGuardService as AuthGuard } from './session/auth-guard.service';
import { HttkBaseComponent } from './httk/base/httk.base.component';
import { CreatehttkmodelComponent } from './httk/createhttkmodel/createhttkmodel.component';
import { AccountBaseComponent } from './account/account.base/account.base.component';
import { OrganizationBaseComponent } from './organization/organization-base/organization-base.component';
import { FrontComponent } from './front/front.component';
import { ModelIdComponent } from './models/model-id/model-id.component';
import { WorkbenchBaseComponent } from './workbench/workbench-base/workbench-base.component';
import { DatasetIdComponent } from './dataset/dataset-id/dataset-id.component';
import { SearchBaseComponent } from './search/search-base/search-base.component';
import { JaqpotNotificationsComponent } from './jaqpot-notifications/jaqpot-notifications.component';
import { HttkmodelsComponent } from './httk/httkmodels/httkmodels.component';
import { MarkdownComponent } from './base/markdown/markdown.component';
import { ModelFeaturesComponent } from './models/model-features/model-features.component';
import { PredictValidateComponent } from './models/predict-validate/predict-validate.component';
import { CommentsComponent } from './base/comments/comments.component';
import { ModelMetaComponent } from './models/model-meta/model-meta.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'account',
    component: AccountBaseComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'algorithms',
    component: AlgorithmsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'datasets',
    component: DatasetListComponent,
    canActivate: [AuthGuard],
  },
  { path: 'models', component: ModelsComponent, canActivate: [AuthGuard] },
  {
    path: 'dataset/detail',
    component: DatasetDetailComponent,
    data: { dataset: 'some value' },
  },
  { path: 'httk', component: HttkBaseComponent, canActivate: [AuthGuard] },
  {
    path: 'httk/createmodel',
    component: CreatehttkmodelComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'httk/models',
    component: HttkmodelsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'organization/:id',
    component: OrganizationBaseComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'model/:id',
    component: ModelIdComponent, // This component should contain the tab group
    children: [
      { path: 'overview', component: MarkdownComponent },
      { path: 'features', component: ModelFeaturesComponent },
      { path: 'predict-validate', component: PredictValidateComponent },
      { path: 'discussion', component: CommentsComponent },
      { path: 'meta', component: ModelMetaComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' }, // Default redirect to details tab
    ],
  },
  { path: 'dataset/:id', component: DatasetIdComponent },
  {
    path: 'workbench',
    component: WorkbenchBaseComponent,
    canActivate: [AuthGuard],
  },
  { path: 'search', component: SearchBaseComponent, canActivate: [AuthGuard] },
  {
    path: 'notifications',
    component: JaqpotNotificationsComponent,
    canActivate: [AuthGuard],
  },
  { path: '', component: FrontComponent },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  declarations: [],
  exports: [RouterModule],
})
export class AppRoutingModule {}
