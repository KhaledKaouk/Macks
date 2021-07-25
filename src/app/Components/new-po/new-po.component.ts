import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgProgress, NgProgressRef } from 'ngx-progressbar';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';
import { CheckToken } from 'src/app/Utilities/CheckAuth';
import {Auth_error_handling} from 'src/app/Utilities/Errorhadling'
@Component({
  selector: 'app-new-po',
  templateUrl: './new-po.component.html',
  styleUrls: ['./new-po.component.sass']
})
export class NewPoComponent implements OnInit {


  Loading: boolean = false;

  NewPo: POs = new POs();

  CreatePo = new FormGroup({
    DealerName: new FormControl('', Validators.required),
    DealerPo: new FormControl('', Validators.required),
    CorinthainPo: new FormControl('', Validators.required),
    ProductionRequestDate: new FormControl('', Validators.required),
    Comments: new FormControl('')
  })

  SeletedFile: any;
  progressRef: any;

  constructor(private Pos: POsService,
    private Notification: NotificationserService,
    private progress:NgProgress,
    private router: Router) { }

  ngOnInit(): void {
    CheckToken(this.router);
    this.progressRef = this.progress.ref('myProgress');
  }


  UploadPo(event: any) {
    this.SeletedFile = event.target.files[0];

  }

  Submit() {
    this.DisableSubmitButton();
    this.progressRef.start();
    this.AssignFormValuesToObject();
    
    let fd = new FormData();
    if (this.SeletedFile) {
      let extenstion: string = this.SeletedFile.name;
      extenstion = extenstion.substring(extenstion.lastIndexOf('.'));

      this.NewPo.corinthianPOAttach = "NP_" + this.NewPo.dealerPONumber + "_" + this.NewPo.corinthianPO + extenstion;
      
      fd.append('PO', this.SeletedFile, this.NewPo.corinthianPOAttach);

      let ReDirecting: boolean[] = [false, false]

      this.Pos.Uploadfile(fd, this.NewPo.corinthianPOAttach).toPromise().then((res: any) => {
        if (res == true) {
          ReDirecting[0] = true;
          this.Pos.CreatePo(this.NewPo).toPromise().then((res: any) => {
            if (res == true) {
              ReDirecting[1] = true;
              this.Notification.OnSuccess("You Updated the Po successfully")
              this.progressRef.complete()
              this.router.navigateByUrl('/MyPos')
            } else {
              this.progressRef.complete()
              this.Notification.OnError("Some Thing Went Wrong Please Try Again Later")
              this.EnableSubmitButton();
            }
          },(err:any) => {
            Auth_error_handling(err,this.progressRef,this.Notification,this.router)
            this.EnableSubmitButton();
          })
        } else {
          this.progressRef.complete()
          this.Notification.OnError("The File Was Not Uploaded Please Try Again Later")
          this.EnableSubmitButton();
        }
      },(err:any) => {
        Auth_error_handling(err,this.progressRef,this.Notification,this.router)
        this.EnableSubmitButton();
      });
      if (ReDirecting[0] == true && ReDirecting[1] == true) {
        this.router.navigateByUrl('/MyPos')
      }
    }
     else {
       this.progressRef.complete();
       this.EnableSubmitButton();
       this.Notification.OnError('Please Select A Po To Upload')
    }
  }
DisableSubmitButton(){this.Loading = true}
EnableSubmitButton(){this.Loading = false}
AssignFormValuesToObject(){
  this.NewPo.dealerName = this.CreatePo.get("DealerName")?.value;
  this.NewPo.dealerPONumber = this.CreatePo.get("DealerPo")?.value;
  this.NewPo.corinthianPO = this.CreatePo.get("CorinthainPo")?.value;
  this.NewPo.productionRequestDate = this.CreatePo.get("ProductionRequestDate")?.value;
  this.NewPo.comments = this.CreatePo.get("Comments")?.value;
  this.NewPo.corinthianPOAttach = this.NewPo.dealerName + this.NewPo.corinthianPO;

}
}
