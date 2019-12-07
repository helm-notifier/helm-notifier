const config = require('../config');
const mailjet = require('node-mailjet')
  .connect(config.mailjet.publicKey, config.mailjet.privateKey);

function sendMail(mail) {
  if (config.mailjet.sandbox === true)
    return false;
  if (mail.includes('@prezero.com'))
    return false;
  return true;
}

module.exports = async job => {
  const mail = await mailjet
    .post("send", {'version': 'v3.1'})
    .request({
      Messages: [
        {
          To: [
            {
              Email: job.data.message.to,
              Name: job.data.message.name
            }
          ],
          TemplateID: job.data.template,
          TemplateLanguage: true,
          Variables: job.data.variables,
        }
      ],
      SandboxMode: sendMail(job.data.message.to),
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
  console.log(mail);
};
