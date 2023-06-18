const { createClient } = require("redis");
const AppError = require("./appError");

const client = createClient();
const DEFAULT_EXPIRATION = 60 * 60 * 2; // 2 Hours

async function getResultFromRedisClient(key, callback) {
  await client.connect();
  client.get(key, (err, result) => {
    if (err) new AppError("Unable to connect to Redis Client", 500);
    if (result != null) {
      callback(null, result);
    }
  });
  await client.disconnect();
}

async function setResultInRedisClient(key, value, callback) {
  await client.connect();
  console.log("Value set successfully:", result);
  client.setEx(key, DEFAULT_EXPIRATION, value);
  callback(null, { status: "successful" });
  await client.disconnect();
}

module.exports = {
  getResultFromRedisClient,
  setResultInRedisClient,
};
