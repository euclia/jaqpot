import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../jaqpot-client';

@Component({
  selector: 'app-quota',
  templateUrl: './quota.component.html',
  styleUrls: ['./quota.component.css'],
})
export class QuotaComponent implements OnInit {
  @Input() user: User;

  constructor() {}

  ngOnInit() {}
}
