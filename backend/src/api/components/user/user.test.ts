import { connect, disconnect } from "../../../database";
import { logger } from "../../../config/logger";

(async () => {
  const db = connect();

  // test static methods
  logger.info('Checking for user')
  const email = await db.UserModel.findUser('devdoesit17@gmail.com');

  const newUser = await db.UserModel.createUser({
    userName:'MikeS',
    firstName:'Mike',
    lastName:'Smith',
    email:'mikes@gmail.com',
    password:'sample_password'});
  const numOfUsers = (await db.UserModel.findUser('mikes@gmail.com'));
  logger.info({ email, newUser, numOfUsers });

  disconnect();
})();