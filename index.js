const google = require('googleapis').google;
const RestRequest = require('@gabrielgrijalva/rest-request');
/**
 * 
 * GET GMAIL EMAIL FUNCTION
 * 
 * @param {import('./typings/declarations').cryptoReportersSettings} settings 
 */
function getGmailEmailFunction(settings) {
  const auth = new google.auth.JWT({
    subject: settings.GOOGLE_CLOUD_USER,
    keyFile: settings.GOOGLE_CLOUD_KEYS_FILE,
    scopes: ['https://www.googleapis.com/auth/gmail.send'],
  });
  const gmail = google.gmail({ version: 'v1', auth });
  /**
   * @param {import('./typings/declarations').emailParams} params 
   */
  function gmailEmailFunction(params) {
    const message = [
      `To: ${params.to}`,
      `From: ${params.from}`,
      `Subject: ${params.subject}`,
      `Content-Type: ${params.html ? 'text/html' : 'text/plain'}`,
      '', params.html || params.text,
    ].join('\n');
    return gmail.users.messages.send({
      userId: settings.GOOGLE_CLOUD_USER,
      requestBody: {
        raw: Buffer.from(message)
          .toString('base64')
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, ''),
      }
    });
  };
  return gmailEmailFunction;
};
/**
 * 
 * GET SENDGRID EMAIL FUNCTION
 * 
 * @param {import('./typings/declarations').cryptoReportersSettings} settings 
 */
function getSendgridEmailFunction(settings) {
  /**
   * @param {import('./typings/declarations').emailParams} params 
   */
  function sendgridEmailFunction(params) {
    return RestRequest.send({
      url: 'https://api.sendgrid.com/v3/mail/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.SENDGRID_API_KEY}`,
      },
      data: JSON.stringify({
        personalizations: [{
          to: [{ email: params.to }],
          subject: params.subject,
        }],
        content: [{
          type: params.html ? 'text/html' : 'text/plain',
          value: params.html || params.text,
        }],
        from: {
          email: params.from,
        },
      }),
    });
  };
  return sendgridEmailFunction;
};
/**
 * 
 * GET SENDGRID EMAIL FUNCTION
 * 
 * @param {import('./typings/declarations').cryptoReportersSettings} settings 
 */
function getEmailFunction(settings) {
  if (settings.SENDGRID_API_KEY) {
    return getSendgridEmailFunction(settings);
  }
  if (settings.GOOGLE_CLOUD_USER && settings.GOOGLE_CLOUD_KEYS_FILE) {
    return getGmailEmailFunction(settings);
  }
};
/**
 * 
 * @param {import('./typings/declarations').cryptoReportersSettings} settings 
 * @return {import('./typings/declarations').CryptoReporter}
 */
function CryptoReporters(settings) {
  /**
   * @type {import('./typings/declarations').CryptoReporter}
   */
  const cryptoReporter = {
    call: (params) => {
      const digest = Buffer.from(`${settings.PLIVO_API_KEY}:${settings.PLIVO_API_SECRET}`).toString('base64');
      return RestRequest.send({
        url: `https://api.plivo.com/v1/Account/${settings.PLIVO_API_KEY}/Call`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${digest}`,
        },
        data: JSON.stringify({
          to: params.number,
          from: '526141000000',
          answer_url: 'http://sinstec.com/answer_url.xml',
        }),
      });
    },
    email: getEmailFunction(settings),
  };
  return cryptoReporter;
}
module.exports = CryptoReporters;
