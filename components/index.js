const emailRouter = require("./email/email.routes");
const mlsRouter = require("./mls/mls.routes");

exports.registerApiRoutes = (router, prefix) => {
  router.use(`${prefix}/email`, emailRouter);
  router.use(`${prefix}/mls`, mlsRouter);
};
