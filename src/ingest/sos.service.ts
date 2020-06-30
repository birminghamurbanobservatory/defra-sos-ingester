import axios from 'axios';


export interface TimeseriesReading {
  timestamp: Date;
  value: number;
}



export async function getTimeseries(timeseriesId: number, startDate: Date, endDate: Date): Promise<TimeseriesReading[]> {

  let response;

  const startIso = startDate.toISOString();
  const endIso = endDate.toISOString();
  
  try {
    
    // Need to use querystring.stringify as Netatmo expects body to be x-www-form-urlencoded formatted
    response = await axios.get(
      `https://uk-air.defra.gov.uk/sos-ukair/api/v1/timeseries/${timeseriesId}/getData?timespan=${startIso}/${endIso}`,
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