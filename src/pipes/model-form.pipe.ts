import { Pipe, PipeTransform } from '@angular/core';

import { CadrartApiEntity } from '../models/api.model';
import { CadrartForm } from '../components/form/form';

@Pipe({
  name: 'cadrartModelFormPipe',
  standalone: true
})
export class CadrartModelFormPipe implements PipeTransform {
  transform(model: CadrartApiEntity<any>): CadrartForm {
    return model.getForm();
  }
}
