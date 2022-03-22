import { requestReturnParams } from '@gabrielgrijalva/rest-request/typings/declarations';
/**
 * 
 * 
 * 
 * CALL PARAMS
 * 
 * 
 * 
 */
export type callParams = {
  number: string;
}
/**
 * 
 * 
 * 
 * EMAIL PARAMS
 * 
 * 
 * 
 */
export type emailParams = {
  to: string;
  html?: string;
  text?: string;
  from: string;
  subject: string;
}
/**
 * 
 * 
 * 
 * CRYPTO REPORTERS SETTINGS
 * 
 * 
 * 
 */
export type cryptoReportersSettings = {
  PLIVO_API_KEY: string,
  PLIVO_API_SECRET: string,
  SENDGRID_API_KEY: string,
}
/**
 * 
 * 
 * 
 * CRYPTO REPORTER INTERFACE
 * 
 * 
 * 
 */
interface CryptoReporter {
  call(params: callParams): Promise<requestReturnParams>;
  email(params: emailParams): Promise<requestReturnParams>;
}