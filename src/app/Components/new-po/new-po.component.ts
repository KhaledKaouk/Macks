import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgProgress, NgProgressRef } from 'ngx-progressbar';
import { POs } from 'src/app/Models/Po-model';
import { NotificationserService } from 'src/app/Services/notificationser.service';
import { POsService } from 'src/app/Services/pos.service';

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
    if (!localStorage.getItem('token')) {
      this.router.navigateByUrl('/LogIn')
    }
    this.progressRef = this.progress.ref('myProgress');
  }


  UploadPo(event: any) {
    this.SeletedFile = event.target.files[0];

  }

  Submit() {
    this.Loading = true;
    this.progressRef.start();
    this.NewPo.dealerName = this.CreatePo.get("DealerName")?.value;
    this.NewPo.dealerPONumber = this.CreatePo.get("DealerPo")?.value;
    this.NewPo.corinthianPO = this.CreatePo.get("CorinthainPo")?.value;
    this.NewPo.productionRequestDate = this.CreatePo.get("ProductionRequestDate")?.value;
    this.NewPo.comments = this.CreatePo.get("Comments")?.value;
    this.NewPo.corinthianPOAttach = this.NewPo.dealerName + this.NewPo.corinthianPO;

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
              this.Loading = false;
            }
          },(err:any) => {
            if (err.error.message == "Authorization has been denied for this request."){
              this.progressRef.complete()
              localStorage.clear();
              this.router.navigateByUrl('/LogIn')
            }else{
              this.progressRef.complete()
              this.Loading = false;
              this.Notification.OnError('try again later or login again')
            }
          })
        } else {
          this.progressRef.complete()
          this.Notification.OnError("The File Was Not Uploaded Please Try Again Later")
          this.Loading = false;
        }
      },(err:any) => {
        if (err.error.message == "Authorization has been denied for this request."){
          this.progressRef.complete()
          localStorage.clear();
          this.router.navigateByUrl('/LogIn')
        }else{
          this.progressRef.complete()
          this.Loading = false;
          this.Notification.OnError('try again later or login again')
        }
      });
      if (ReDirecting[0] == true && ReDirecting[1] == true) {
        this.router.navigateByUrl('/MyPos')
      }
    }
     else {
       this.progressRef.complete();
      this.Loading = false;
      this.Notification.OnError('Please Select A Po To Upload')
    }
  }
}
