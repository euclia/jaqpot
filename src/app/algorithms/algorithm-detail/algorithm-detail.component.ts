import { Component, Input } from '@angular/core';
import { Algorithm } from '../../jaqpot-client/model/algorithm';
import { Subscription } from 'rxjs';
import { SessionService } from '../../session/session.service';

@Component({
  selector: 'app-algorithm-detail',
  templateUrl: './algorithm-detail.component.html',
  styleUrls: ['./algorithm-detail.component.css'],
})
export class AlgorithmDetailComponent {
  panelOpenState: boolean = false;
  @Input() algorithm: Algorithm;
  subscription: Subscription;
  algoForModel: Algorithm;
  checkAlgoModel: boolean = false;

  constructor(private sessionService: SessionService) {}

  clearCard() {
    // this.sessionService.clearAlgorithm();
  }

  useForModeling() {
    // this.sessionService.setModelingAlgorithm(this.algorithm);
  }

  clearFromModeling() {
    // this.sessionService.clearModelingAlgorithm();
  }
}
