import { Env } from './types';

export const environment: Env = {
  production: true,
  baseurl: 'https://app.jaqpot.org',
  jaqpotApi: 'https://api.jaqpot.org/jaqpot/services',
  accountsApi: 'https://accountsapi.jaqpot.org',
  logLevel: 'debug',
  notificationPolling: true,
  google_analytics_tag: 'G-VW0RC3JS55',
  oidc: {
    stsServer: 'https://login.jaqpot.org/auth/realms/jaqpot',
    redirectUrl: 'https://app.jaqpot.org/home',
    clientId: 'jaqpot-ui-code',
    responseType: 'code',
    scope: 'openid email profile',
    silentRedirectUrl: 'https://app.jaqpot.org/assets/silent-renew.html',
  },
};
