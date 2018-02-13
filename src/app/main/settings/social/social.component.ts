import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../../../provider/service/file-upload.service';
import { ToastrService } from 'ngx-toastr';

import * as Global from '../../../provider/globals';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css']
})
export class SocialComponent implements OnInit {
  loadAPI: Promise<any>;
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

  // save Social Account Information
  saveSocial() {
    let _this = this;
    let facebook = (<HTMLInputElement>document.getElementsByClassName("fb-input")[0]).value;
    let twitter = (<HTMLInputElement>document.getElementsByClassName("twitter-input")[0]).value;
    let google = (<HTMLInputElement>document.getElementsByClassName("google-input")[0]).value;
    
    this.fileService.setSocialInfo(_this.user.id, facebook, twitter, google).subscribe(
          response => {
            var temp = response.json();
            _this.toastrService.success('Success');
            _this.user = temp.result;
            // change the Global user variable for synchronization
            localStorage.setItem("currentUser", JSON.stringify(temp.result));
            // change the username
            var user_temp = document.getElementsByClassName("adn")[0];
            user_temp.innerHTML = temp.result.firstname + " " + temp.result.lastname;
          },
          error => {
              _this.toastrService.error('Sorry. There is error during process of your request');
          }
      );
  }
}
