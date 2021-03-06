import {getAllStations, updateStation} from '../station/station.service';
import * as logger from 'node-logger';
import {StationApp, Timeseries} from '../station/station-app';
import * as Promise from 'bluebird';
import {getTimeseries, TimeseriesReading} from './sos.service';
import {sub, add} from 'date-fns';
import {cloneDeep, isEqual, round} from 'lodash';
import * as event from 'event-stream';
import {ObservationClient} from './observation-client.class';
import * as check from 'check-types';


export async function ingest(): Promise<void> {

  const stations = await getAllStations();

  logger.debug(`${stations.length} stations retrieved from database.`, stations);

  await Promise.mapSeries(stations, processStation);

  logger.info(`${stations.length} stations have been processed.`);

  return;

}


async function processStation(station: StationApp): Promise<void> {

  logger.debug(`Processing station ${station.id} (prefix: ${station.prefix})`);

  const updatedTimeseriesArray = await Promise.mapSeries(station.timeseries, async (ts) => {
    const updatedSingleTimeseries = await processSingleTimeseries(ts, station.prefix);
    return updatedSingleTimeseries;
  }); 

  if (!isEqual(station.timeseries, updatedTimeseriesArray)) {
    const updatedStation = await updateStation(station.id, {timeseries: updatedTimeseriesArray});
    logger.debug(`Station document (id: ${station.id}, prefix: ${station.prefix}) was updated`, updatedStation);
  } else {
    logger.debug(`Station document (id: ${station.id}, prefix: ${station.prefix}) did not require updating`);
  }

  return;

}


async function processSingleTimeseries(timeseries: Timeseries, stationPrefix: string): Promise<Timeseries> {

  const startDate = timeseries.lastTime ? addAMinute(timeseries.lastTime) : aWeekAgo();
  const endDate = new Date(); // now

  const updatedTimeseries: Timeseries = cloneDeep(timeseries);

  const timeseriesReadings = await getTimeseries(timeseries.id, startDate, endDate);

  logger.debug(`Got ${timeseriesReadings.length} new readings for Timeseries ${timeseries.id} (key: ${timeseries.key}, station prefix: ${stationPrefix}) between ${startDate.toISOString()} and ${endDate.toISOString()}`);

  // Use the time of the last reading to update the lastTime of the timeseries
  if (timeseriesReadings.length) {
    
    updatedTimeseries.lastTime = new Date(timeseriesReadings[timeseriesReadings.length - 1].timestamp);
    
    await Promise.mapSeries(timeseriesReadings, async (reading) => {
      await processReading(reading, stationPrefix, timeseries.key);
    });
    
  }

  return updatedTimeseries;

}


async function processReading(reading: TimeseriesReading, prefix: string, key: string): Promise<void> {

  // Build the UO-formatted observation
  const observation = buildObservation(reading, prefix, key);

  // Publish to the event stream.
  await event.publish('observation.incoming', observation);

  return;

}


function buildObservation(reading: TimeseriesReading, prefix: string, key: string) {

  const info = getUrbanObsInfoForVariable(key);

  const observation: ObservationClient = {
    resultTime: reading.timestamp.toISOString(),
    hasResult: {
      value: round(reading.value, 2), // many raw values have 3 decimal places, which feels like to much.
      unit: info.unit
    },
    observedProperty: info.observedProperty,
    aggregation: info.aggregation,
    madeBySensor: `${prefix}-${info.sensorSuffix}`
  };

  if (reading.value === -99) {
    observation.hasResult.flags = ['error']; // generic error
  }

  if (check.nonEmptyArray(info.usedProcedures)) {
    observation.usedProcedures = info.usedProcedures;
  }

  if (info.aggregation && info.aggregation !== 'instant') {
    observation.phenomenonTime = {
      // All the readings appear to be a mean over the last hour.
      hasBeginning: sub(reading.timestamp, {hours: 1}).toISOString(),
      hasEnd: reading.timestamp.toISOString()
    };
  }

  return observation;

}


function getUrbanObsInfoForVariable(key: string) {

  const info = {
    'pm2.5': {
      observedProperty: 'pm2p5-mass-concentration',
      unit: 'microgram-per-cubic-metre',
      aggregation: 'average',
      sensorSuffix: 'pm-sensor',
      usedProcedures: ['aurn-pm2p5-method']
      // https://uk-air.defra.gov.uk/networks/monitoring-methods?view=eu-standards
    },
    pm10: {
      observedProperty: 'pm10-mass-concentration',
      unit: 'microgram-per-cubic-metre',
      aggregation: 'average',
      sensorSuffix: 'pm-sensor',
      usedProcedures: ['aurn-pm10-method']
    },
    so2: {
      observedProperty: 'sulphur-dioxide-mass-concentration',
      unit: 'microgram-per-cubic-metre',
      aggregation: 'average',
      sensorSuffix: 'so2-sensor',
      usedProcedures: ['aurn-so2-method']
    }, 
    no2: {
      observedProperty: 'nitrogen-dioxide-mass-concentration',
      unit: 'microgram-per-cubic-metre',
      aggregation: 'average',
      sensorSuffix: 'chemilumi-sensor',
      usedProcedures: ['aurn-no2-method']
    }, 
    nox: {
      observedProperty: 'nitrogen-oxides-mass-concentration',
      unit: 'microgram-per-cubic-metre',
      aggregation: 'average',
      sensorSuffix: 'chemilumi-sensor',
      usedProcedures: ['aurn-nox-method']
    },
    no: {
      observedProperty: 'nitrogen-monoxide-mass-concentration',
      unit: 'microgram-per-cubic-metre',
      aggregation: 'average',
      sensorSuffix: 'chemilumi-sensor',
      usedProcedures: ['aurn-no-method']
    },
    o3: {
      observedProperty: 'ozone-mass-concentration',
      unit: 'microgram-per-cubic-metre',
      aggregation: 'average',
      sensorSuffix: 'ozone-sensor',
      usedProcedures: ['aurn-ozone-method']
    }
  };

  const correspondingInfo = info[key];
  
  if (correspondingInfo) {
    return correspondingInfo;
  } else {
    throw new Error(`No corresponding info for key ${key}`);
  }

}



function addAMinute(time: Date): Date {
  return add(time, {minutes: 1});
}


function aWeekAgo() {
  return sub(new Date, {weeks: 1});
}