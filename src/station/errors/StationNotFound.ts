import {NotFound} from '../../errors/NotFound';

export class StationNotFound extends NotFound {

  public constructor(message = 'Station could not be found.') {
    super(message); // 'Error' breaks prototype chain here
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }

}