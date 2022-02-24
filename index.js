const RestRequest = require('@gabrielgrijalva/rest-request');
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
    email: (params) => {
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
            type: "text/html",
            value: params.html
          }],
          from: {
            email: params.from,
          },
        }),
      });
    },
  };
  return cryptoReporter;
}
module.exports = CryptoReporters;
