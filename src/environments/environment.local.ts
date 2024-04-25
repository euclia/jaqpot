import { Env } from './types';

export const environment: Env = {
  production: false,
  baseurl: 'http://localhost:4200',
  jaqpotApi: 'http://localhost:8080/jaqpot/services',
  accountsApi: 'https://accountsapi.jaqpot.org',
  logLevel: 'debug',
  notificationPolling: false,
  google_analytics_tag: 'G-VW0RC3JS55',
  oidc: {
    stsServer: 'http://localhost:8070/realms/jaqpot',
    redirectUrl: 'http://localhost:4200/home',
    clientId: 'jaqpot-ui-code',
    responseType: 'code',
    scope: 'openid email profile',
    silentRedirectUrl: 'https://app.jaqpot.org/assets/silent-renew.html',
  },
};
