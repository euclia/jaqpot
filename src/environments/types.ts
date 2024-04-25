export interface Env {
  baseurl: string;
  logLevel: string;
  production: boolean;
  jaqpotApi: string;
  accountsApi: string;
  notificationPolling: boolean;
  google_analytics_tag: string;
  oidc: {
    stsServer: string;
    redirectUrl: string;
    clientId: string;
    responseType: string;
    scope: string;
    silentRedirectUrl: string;
  };
}
