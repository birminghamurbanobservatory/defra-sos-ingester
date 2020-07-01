export class ObservationClient {
  public madeBySensor?: string;
  public hasResult?: Result;
  public resultTime?: string;
  public location?: Location;
  public observedProperty?: string;
  public aggregation?: string;
  public usedProcedures?: string[];
  public phenomenonTime?: PhenomenonTime;
}

class Result {
  value?: any;
  unit?: string;
  flags?: string[];
}

class PhenomenonTime {
  hasBeginning: string;
  hasEnd: string;
}