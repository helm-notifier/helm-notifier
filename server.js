const Koa = require('koa');
const render = require('koa-ejs');
const path = require('path');
const koaLogger = require('koa-pino-logger');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const passport = require('koa-passport');
const knex = require('./db');
const appRouter = require('./routes/app.routes');
const authRouter = require('./routes/auth.routes');
require('./utils/auth/passport');

const port = process.env.HTTP_PORT || 5000;

const app = new Koa();

// Todo: generate Secret Keys
app.keys = ['secret'];
app.use(session({}, app));
app.use(koaLogger());

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

function startServer() {
  return knex.migrate.latest().then(() => {
    app.listen(port);
    console.log(`SERVER IS RUNNING on http://localhost:${port}`);
  });
}

if (!module.parent) {
  startServer();
}


module.exports = startServer;
