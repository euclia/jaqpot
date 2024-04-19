import { Env } from './types';

export const environment: Env = {
  production: true,
  jaqpotApi: 'https://api.jaqpot.org/jaqpot/services',
  accountsApi: 'https://accountsapi.jaqpot.org',
  stsServer: 'https://login.jaqpot.org/auth/realms/jaqpot',
  redirect_url: 'https://app.jaqpot.org/home',
  client_id: 'jaqpot-ui-code',
  response_type: 'code',
  scope: 'openid email profile',
  silent_redirect_url: 'https://app.jaqpot.org/assets/silent-renew.html',
  baseurl: 'https://app.jaqpot.org',
  logLevel: 'debug',
  notificationPolling: true,
  google_analytics_tag: 'G-VW0RC3JS55',
};
