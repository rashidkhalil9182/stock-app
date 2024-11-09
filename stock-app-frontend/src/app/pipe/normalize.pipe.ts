import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'normalize',
  standalone: true,
})
export class NormalizePipe implements PipeTransform {

  transform(value: number): string {
    if (!value) return '--';

    return (Math.round(value * 100) / 100).toString();
  }

}
