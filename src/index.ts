//-------------------------------------------------
// Dependencies
//-------------------------------------------------
import {config} from './config';
import * as logger from 'node-logger';
import {getCorrelationId} from './utils/correlator';
import {initialiseEvents} from './events/initialise-events';
import {ingest} from './ingest/ingest';
import {connectDb} from './db/mongodb-service';
const appName = require('../package.json').name; // Annoyingly if i use import here, the built app doesn't update.


//-------------------------------------------------
// Logging
//-------------------------------------------------
logger.configure(Object.assign({}, config.logger, {getCorrelationId}));

logger.info(`Running ${appName} now (${new Date().toISOString()})`);


(async (): Promise<void> => {

  //-------------------------------------------------
  // Database
  //-------------------------------------------------
  try {
    await connectDb(config.mongo.uri);
    logger.info('Initial connection to MongoDB database was successful');
  } catch (err) {
    logger.error(`Initial MongoDB database connection failed: ${err.message}`);
    // No point in continuing if we can't connect to the datebase
    exit();
  }


  //-------------------------------------------------
  // Events
  //-------------------------------------------------
  try {
    await initialiseEvents({
      url: config.events.url,
      appName,
      logLevel: config.events.logLevel
    });
  } catch (err) {
    logger.error(`There was an issue whilst initialising event stream. Reason: ${err.message}`);
    exit();
  }

  
  //-------------------------------------------------
  // Ingest
  //-------------------------------------------------
  try {
    await ingest();
    logger.info('Ingestion finished');
  } catch (err) {
    logger.error(`Failed to ingest. (${err.message}).`, err);
    // TODO: Is there benefit in exiting with process.exit(1) when it fails? I.e. does this mean kubernetes will mark it as a failure.
  }


  // Exit
  exit();


})();


function exit() {
  logger.debug('Exiting now');
  process.exit();
}