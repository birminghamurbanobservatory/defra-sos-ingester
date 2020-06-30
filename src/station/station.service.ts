import Station from './station.model';
import {StationApp} from './station-app';
import {GetAllStationsFail} from './errors/GetAllStationsFail';
import {UpdateStationFail} from './errors/UpdateStationFail';
import {StationNotFound} from './errors/StationNotFound';



export async function getAllStations(): Promise<StationApp[]> {

  let stations;
  try {
    stations = await Station.find({}).exec();
  } catch (err) {
    throw new GetAllStationsFail(undefined, err.message);
  }

  return stations.map(stationDbToApp);

}



export async function updateStation(id: string, updates: {timeseries: any[]}): Promise<StationApp> {

  let updated;

  try {
    updated = await Station.findByIdAndUpdate(id, updates, {new: true, runValidators: true}).exec();
  } catch (err) {
    throw new UpdateStationFail(`Failed to update station with mongo id ${id}.`, err.message);
  }

  if (!updated) {
    throw new StationNotFound(`A station with id '${id}' could not be found`);
  }

  return stationDbToApp(updated);

}



export function stationDbToApp(stationDb: any): StationApp {

  const stationApp = stationDb.toObject();
  stationApp.id = stationApp._id.toString();
  delete stationApp._id;
  delete stationApp.__v;
  return stationApp;

}


