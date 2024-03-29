const adminRouter = require("./admin/admin.routes");
const userRouter = require("./user/user.routes");
const emailRouter = require("./email/email.routes");
const mlsRouter = require("./mls/mls.routes");
const viewRouter = require("./view/view.routes");
const { errorHandler } = require("./auth/auth.controller");
const logger = require("../utils/logger").logger;

exports.registerApiRoutes = (app, prefix) => {
  logger.info("Registering API routes");
  app.use("", viewRouter);
  app.use(`${prefix}/admin`, adminRouter);
  app.use(`${prefix}/user`, userRouter);
  app.use(`${prefix}/email`, emailRouter);
  app.use(`${prefix}/mls`, mlsRouter);
  app.use(errorHandler);
};
