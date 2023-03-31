import { Component} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.css']
})
export class ErrorDialogComponent{

  public _env:boolean;


    public httpStatus:number;
    public message:string;
    public details:string;
    // public trace:string;
    public id:string;

    constructor(public dialogRef: MatDialogRef<ErrorDialogComponent>){
       if(environment.production === true){
         this._env = false;
       }else{
         this._env = true;
       }
    }

    onClose(){
      this.dialogRef.close(true);
    }

}
