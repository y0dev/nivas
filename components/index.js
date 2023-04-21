const userRouter = require("./user/user.routes");
const emailRouter = require("./email/email.routes");
const mlsRouter = require("./mls/mls.routes");
const viewRouter = require("./view/view.routes");

exports.registerApiRoutes = (app, prefix) => {
  app.use("", viewRouter);
  app.use(`${prefix}/user`, userRouter);
  app.use(`${prefix}/email`, emailRouter);
  app.use(`${prefix}/mls`, mlsRouter);
};
