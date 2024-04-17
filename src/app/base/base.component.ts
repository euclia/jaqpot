import { Component, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Algorithm, Dataset } from '../jaqpot-client';
import { SessionService } from '../session/session.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
})
export class BaseComponent {
  active = 'home';

  subscription: Subscription;
  algoForModel: Algorithm;
  datasetForModel: Dataset;
  algoIsNotChosen: boolean = true;
  datasetIsNotChosen: boolean = true;
  notReady: boolean = true;

  constructor(private _sessionService: SessionService) {}

  changeActive(string) {
    this.active = string;
  }
}
