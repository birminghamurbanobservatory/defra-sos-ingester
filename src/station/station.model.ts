import * as mongoose from 'mongoose';


const timeseriesSchema = new mongoose.Schema({
  id: { 
    type: Number,  // the same ID that defra uses
    required: true
  }, 
  key: {
    type: String,
    enum: ['pm2.5', 'pm10', 'so2', 'no2', 'nox', 'no', 'o3'], // what the timeseries measures
  },
  lastTime: {
    type: Date, // i.e. the time the of the last reading that was processed
    required: false
  }
}, 
{ 
  _id : false // Stop these sub-documents from having a _id added
});


const schema = new mongoose.Schema({
  prefix: {
    type: String, // I.e. the string to add onto the start of sensor IDs, e.g. aurn-ladywood
    required: true
  }, 
  timeseries: [timeseriesSchema]
});



//-------------------------------------------------
// Create Model (and expose it to our app)
//-------------------------------------------------
export default mongoose.model('Station', schema);