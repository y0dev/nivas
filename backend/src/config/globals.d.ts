// require('dotenv').config()

// const PORT = process.env.PORT
// const MONGODB_URI = process.env.MONGODB_URI

// module.exports = {
//   MONGODB_URI,
//   PORT
// }

declare global {
    interface ProcessEnv {
      GITHUB_AUTH_TOKEN: string;
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      PWD: string;
   }
 }
 
 // If this file has no import/export statements (i.e. is a script)
 // convert it into a module by adding an empty export statement.
 export {}

//  process.env.GITHUB_AUTH_TOKEN; // $ExpectType string
