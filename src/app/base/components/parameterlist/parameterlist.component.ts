import { Component, Input } from '@angular/core';
import { Parameter } from '../../../jaqpot-client';

@Component({
  selector: 'app-parameterlist',
  templateUrl: './parameterlist.component.html',
  styleUrls: ['./parameterlist.component.css'],
})
export class ParameterlistComponent {
  @Input() parameters: Array<Parameter>;

  constructor() {}
}
