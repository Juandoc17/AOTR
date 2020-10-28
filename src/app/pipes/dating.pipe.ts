import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dating'
})
export class DatingPipe implements PipeTransform {

  transform(name: string): any {
    console.log(name);
    return name.split('T')[0];
    }

}
