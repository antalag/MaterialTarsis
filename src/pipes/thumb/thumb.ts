import { Pipe, PipeTransform } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';

/**
 * Generated class for the ThumbPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'thumb',
})
export class ThumbPipe implements PipeTransform {
  constructor(private storage: AngularFireStorage) {
  }
  transform(value: string, ...args) {
    let url=new URL(value).pathname.split('/');
    let token = url[url.length-1];
    const ref = this.storage.ref('thumbs/'+token+'_'+args[0]+'_thumb.png');
    return ref.getDownloadURL();
  }
}
