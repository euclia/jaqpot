import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-model-meta',
  templateUrl: './model-meta.component.html',
  styleUrls: ['./model-meta.component.css'],
})
export class ModelMetaComponent {
  @Input() trainedMeta: Object;

  constructor() {}
}
