import { APP_INITIALIZER, NgModule } from '@angular/core';
import {
  AuthModule,
  LogLevel,
  OidcConfigService,
} from 'angular-auth-oidc-client';
import { environment } from '../../environments/environment';

export function configureAuth(
  oidcConfigService: OidcConfigService,
): () => Promise<any> {
  return () =>
    oidcConfigService.withConfig({
      stsServer: environment.stsServer,
      redirectUrl: environment.redirect_url,
      clientId: environment.client_id,
      responseType: environment.response_type,
      scope: environment.scope,
      // postLogoutRedirectUri: customConfig.baseurl,
      // startCheckSession: customConfig.start_checksession,
      // silentRenew: customConfig.silent_renew,
      silentRenewUrl: environment.silent_redirect_url,
      postLogoutRedirectUri: window.location.origin,
      // postLoginRoute: customConfig.baseurl,
      // forbiddenRoute: customConfig.baseurl,
      // unauthorizedRoute: customConfig.baseurl,
      logLevel: LogLevel.Error, // LogLevel.Debug,
      maxIdTokenIatOffsetAllowedInSeconds: 120,
      historyCleanupOff: true,
      autoUserinfo: true,
      storage: localStorage,
    });
}

@NgModule({
  imports: [AuthModule.forRoot()],
  exports: [AuthModule],
  providers: [
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configureAuth,
      deps: [OidcConfigService],
      multi: true,
    },
  ],
})
export class AuthConfigModule {}
