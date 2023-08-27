const express = require("express");
const app = express();
const {PORT} = require("./config/server-config")
const apiRoutes = require("./routes")
const db =require("./models/index")

const startAndSetupServer = () => {

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', apiRoutes)



  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
    if(process.env.DB_SYNC){
      db.sequelize.sync({alert:true})
    }
  });
};

startAndSetupServer();
