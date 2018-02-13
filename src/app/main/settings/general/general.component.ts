import { Component, OnInit } from '@angular/core';

import { FileUploadService } from '../../../provider/service/file-upload.service';
import * as Global from '../../../provider/globals';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  loadAPI: Promise<any>;
  user: any;
  constructor(private fileService: FileUploadService, private toastrService: ToastrService) { }

  ngOnInit() {
      this.loadAPI = new Promise((resolve) => {
          this.user = Global.getUser();
          /*console.log('resolving promise');
          //Global.loadScript();*/
      });
  }

  // set User Blacklist
  setBlacklist(blacklist: any) {
    let _toast = this.toastrService;
    // check if username is same as me
    if (this.user.username == blacklist)
    {
      _toast.warning("Do not blacklist myself!");
      return false;
    }
    // block user by username
    this.fileService.setBlacklist(this.user.id, blacklist).subscribe(
      response => {
        let temp = response.json().result;
        if (temp == 1) _toast.success('Successfully banned the user!');
        // localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
      },
      error => {
        _toast.error('Error! Please try again.');
      }
    );
  }
}
