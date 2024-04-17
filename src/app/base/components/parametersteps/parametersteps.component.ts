import { Component, Input } from '@angular/core';
import { Parameter } from '../../../jaqpot-client';

@Component({
  selector: 'app-parametersteps',
  templateUrl: './parametersteps.component.html',
  styleUrls: ['./parametersteps.component.css'],
})
export class ParameterstepsComponent {
  @Input() parameters: Array<Parameter>;

  constructor() {}
}
