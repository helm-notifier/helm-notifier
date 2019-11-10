const Koa = require('koa');
const render = require('koa-ejs');
const path = require('path');
const koaLogger = require('koa-pino-logger');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const passport = require('koa-passport');
const cors = require('@koa/cors');
const knex = require('./db');
const appRouter = require('./routes/app.routes');
const authRouter = require('./routes/auth.routes');
const subscriptionRouter = require('./routes/subscriptions.routes');
const cronjobs = require('./utils/cronjobs');
require('./utils/auth/passport');

const port = process.env.HTTP_PORT || 5000;
const app = new Koa();

// Todo: generate Secret Keys
app.keys = ['secret'];
app.use(session({}, app));
app.use(koaLogger());
app.use(cors());
// Todo: Google, twitter and Github Auth Providers implementation: https://github.com/rkusa/koa-passport-example
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser());

render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'test',
  viewExt: 'ejs',
});

app.use(appRouter.routes());
app.use(authRouter.routes());
app.use(subscriptionRouter.routes());
let server;

function startServer() {
  return knex.migrate.latest()
    .then(() => {
      server = app.listen(port);
      console.log(`SERVER IS RUNNING on http://localhost:${port}`);
    });
}

function stopServer() {
  server.close();
}

if (!module.parent) {
  startServer()
    .then(() => cronjobs.updateRepos())
    .then(() => {
      console.log('cronjob update Repos done');
      return cronjobs.updateRepo();
    })
    .then(() => console.log('cronjob update repo done'));
}


module.exports = {
  startServer,
  stopServer,
};
