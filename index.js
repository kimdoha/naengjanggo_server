const express = require('./config/express');
const {logger} = require('./config/winston');
require('dotenv').config();
const rp = require("request-promise");

const port = process.env.NODE_ENV === "production" ? 3000:3001;   // 3000 Prod, 3002 Dev

express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
