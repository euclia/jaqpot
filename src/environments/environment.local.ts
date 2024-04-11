import { Env } from './types';

export const environment: Env = {
  production: false,
  jaqpotApi: 'http://localhost:8080/jaqpot/services',
  accountsApi: 'https://accountsapi.jaqpot.org',
  stsServer: 'https://login.jaqpot.org/auth/realms/jaqpot',
  redirect_url: 'http://localhost:4200/home',
  client_id: 'jaqpot-ui-code',
  response_type: 'code',
  scope: 'openid email profile',
  silent_redirect_url: 'https://app.jaqpot.org/assets/silent-renew.html',
  baseurl: 'http://localhost:4200',
  logLevel: 'debug',
  notificationPolling: false,
};
