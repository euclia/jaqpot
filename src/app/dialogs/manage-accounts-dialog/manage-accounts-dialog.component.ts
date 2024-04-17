import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SessionService } from '../../session/session.service';

@Component({
  selector: 'app-manage-accounts-dialog',
  templateUrl: './manage-accounts-dialog.component.html',
  styleUrls: ['./manage-accounts-dialog.component.css'],
})
export class ManageAccountsDialogComponent implements OnInit {
  private setting = {
    element: {
      dynamicDownload: null as HTMLElement,
    },
  };

  constructor(
    private dialog: MatDialogRef<ManageAccountsDialogComponent>,
    private sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    this.changePosition();
  }

  changePosition() {
    this.dialog.updatePosition({ top: '60px', right: '10px' });
  }

  logout() {
    this.dialog.close('LOGOUT');
  }

  manageAccounts() {
    window.open('https://accounts.jaqpot.org/home');
  }

  downloadApiKey() {
    const fileName = 'jaqpot_api_key.txt';

    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType =
      fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    const text = this.sessionService.getToken();
    element.setAttribute(
      'href',
      `data:${fileType};charset=utf-8,${encodeURIComponent(text)}`,
    );
    element.setAttribute('download', fileName);

    const event = new MouseEvent('click');
    element.dispatchEvent(event);
  }
}
