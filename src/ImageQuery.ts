
import axios from 'axios';

/**
 * @author  raizensoft.com
 */

/**
 * ImageQuery
 * @class ImageQuery
 */
export default class ImageQuery {

  private apikey:string;

  constructor(apikey:string) {
    this.apikey = apikey;
  }

  /**
   * Query term and return image results
   */
  async query(term:string, callback:(data:any) => void) {

    const string = `https://pixabay.com/api/?key=${this.apikey}&q=${encodeURIComponent(term)}&image_type=photo&per_page=100`;
    const result = await axios.get(string);
    callback.call(this, result.data);
  }
}
