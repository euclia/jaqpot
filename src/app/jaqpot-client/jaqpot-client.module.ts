import { NgModule } from '@angular/core';
// import { ConfigService } from '../app.';
import { SessionService } from '../session/session.service';
import { SessionModule } from '../session/session.module';
import { AlgorithmService } from './api/algorithm.service';
// import { AlgorithmService } from './api/algorithm.service';
// import { BibtexService } from './api/bibtex.service';
import { DatasetService } from './api/dataset.service';
// import { DoseresponseService } from './api/doseresponse.service';
// import { EnmService } from './api/enm.service';
// import { FeatureService } from './api/feature.service';
// import { InterlabService } from './api/interlab.service';
import { ModelService } from './api/model.service';
// import { OpenrisknetService } from './api/openrisknet.service';
// import { PmmlService } from './api/pmml.service';
// import { ReadacrossService } from './api/readacross.service';
// import { TaskService } from './api/task.service';
import { UserService } from './api/user.service';
import { OrganizationService } from './api/organization.service';
import { NotificationFactoryService } from './factories/notification-factory.service';
import { NotificationBuilderService } from './builders/notification-builder.service';
import { NotificationService } from './api/notification.service';
import { DatasetBuilderService } from './builders/dataset-builder.service';
import { DatasetFactoryService } from './factories/dataset-factory.service';
import { FeatureFactoryService } from './factories/feature-factory.service';
import { FeatureApiService } from './api/feature.service';
import { DiscussionService } from './api/discussion.service';
import { TaskApiService } from './api/task.service';
import { ValidationApiService } from './api/validation.service';
import { ReportApiService } from './api/report.service';
import { SearchApiService } from './api/search.service';
import { DoaApiService } from './api/doa.service';
import { HttkApiService } from './api/httk.service';

@NgModule({
  imports: [SessionModule],
  declarations: [],
  exports: [],
  providers: [
    SessionService,
    AlgorithmService,
    FeatureApiService,
    DatasetService,
    ModelService,
    UserService,
    OrganizationService,
    NotificationService,
    NotificationFactoryService,
    NotificationBuilderService,
    DatasetBuilderService,
    DatasetFactoryService,
    FeatureFactoryService,
    DiscussionService,
    TaskApiService,
    ValidationApiService,
    ReportApiService,
    SearchApiService,
    DoaApiService,
    HttkApiService,
  ],
})
export class JaqpotClientModule {}
