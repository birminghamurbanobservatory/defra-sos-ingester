import axios from 'axios';


export interface TimeseriesReading {
  timestamp: Date;
  value: number;
}



export async function getTimeseries(timeseriesId: number, startDate: Date, endDate: Date): Promise<TimeseriesReading[]> {

  let response;

  const startIso = startDate.toISOString();
  const endIso = endDate.toISOString();
  const limit = 1000; // worth setting this because if you don't the server will try to get you everything which can take a very long time, so it's best to limit it. If it failed to get everything the first ime then the next time the CronJob runs it can just pick up where it left off.
  
  try {
    
    // Need to use querystring.stringify as Netatmo expects body to be x-www-form-urlencoded formatted
    response = await axios.get(
      `https://uk-air.defra.gov.uk/sos-ukair/api/v1/timeseries/${timeseriesId}/getData?timespan=${startIso}/${endIso}&limit=${limit}`
    );

  } catch (err) {
    throw new Error(`Failed to get timeseries ${timeseriesId}. Reason: ${err.message}`);
  }

  const readings = response.data.values.map((reading) => {
    return {
      timestamp: new Date(reading.timestamp),
      value: reading.value
    };
  });

  return readings;

}