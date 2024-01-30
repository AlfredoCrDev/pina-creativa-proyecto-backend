const express = require('express');
const router = express.Router();

// APIs
router.get("/loggerTest", (req,res) =>{
  req.logger.error("Mensaje de error");
  req.logger.warn("Mensaje de warn");
  req.logger.info("Mensaje de info");
  req.logger.http("Mensaje de http");
  req.logger.verbose("Mensaje de verbose");
  req.logger.debug("Mensaje de debug");
  req.logger.silly("Mensaje de silly");
  res.send("Logs realizados");
})

module.exports = router;