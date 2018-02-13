import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../../../provider/service/file-upload.service';
import { ToastrService } from 'ngx-toastr';

import * as Global from '../../../provider/globals';

declare var jquery:any;
declare var $:any;

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  loadAPI: Promise<any>;
  password: any;
  confirm: any;
  user: any = [];
  constructor(private fileService: FileUploadService, private toastrService: ToastrService) {
    this.user = Global.getUser();
  }

  ngOnInit() {
      this.loadAPI = new Promise((resolve) => {
          console.log('resolving promise');
          Global.loadScript();
      });
  }

  updatePassword() {
    let _this = this;
    // current Password
    let pass = (<HTMLInputElement>document.querySelector(".change-pass .password")).value;
    // newly set Password
    let npass = (<HTMLInputElement>document.querySelector(".change-pass .new-password")).value;
    Global.setLoading();
    // check if current Password is true  
    this.fileService.setPassword(_this.user.id, pass, npass).subscribe(
        response => {
          Global.outLoading();
          var temp = response.json();
          if(temp.result == "error")
            _this.toastrService.error('Password is not correct');
          else {
            _this.toastrService.success('Success');
            _this.user = temp.result;
            //change the Global user variable for synchronization
            localStorage.setItem("currentUser", JSON.stringify(temp.result));
          }
        },
        error => {
            Global.outLoading();
            _this.toastrService.error('Sorry. There is error during process of your request');
        }
    );
  }
}
