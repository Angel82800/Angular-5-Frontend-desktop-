import { ElementRef, Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from '../../provider/service/file-upload.service';
import * as Global from '../../provider/globals';

declare var jquery:any;
declare var $:any;
declare var Dropzone:any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, AfterViewInit {
  loadAPI: Promise<any>;
  s3Url = Global.s3Url_wallpaper;
  user: any = [];
  tempavatars3_id: string = '';
  tempbanners3_id: string = '';
  dropZoneF: any = [0,0];
  tDl: any = [];

  constructor(private _elementRef: ElementRef, private fileService: FileUploadService, private _zone: NgZone) { 
     this.user = Global.getUser();
  }

  ngOnInit() {
  }

  // after View is initialized
  ngAfterViewInit() {
    this.imageFit();
  }

  // image autoFit
  imageFit()
  {
    $('.imageFit').imgLiquid({
      fill: true,
      horizontalAlign: 'center',
      verticalAlign: 'center'
    });
  }

  // upload Avatar
  uploadAvatar() {
    // Bootstrap modal
    $('#A_UploadPic').modal('show');
    // call dropZone function for photo Upload
    this.uploadPicZone(0);
  }

  // upload Banner
  uploadBanner() {
    // Bootstrap modal
    $('#B_UploadPic').modal('show');
    // call dropZone function for photo Upload
    this.uploadPicZone(1);
  }

  // upload Avatar || Banner
  uploadPicZone(flag) {
    let _this = this;
    let id = ['#A_uploadZone','#B_uploadZone'];
    // check if dropZone is already set
    if(this.dropZoneF[flag]!=0) return;
    else this.dropZoneF[flag] = 1;

    if(_this.tDl[1-flag]) _this.tDl[1-flag].destroy();
    Dropzone.autoDiscover = false;
    // create new Dropzone object
    this.tDl[flag]=new Dropzone(id[flag], {
      url: Global.API_URL+'user/avatar/upload',
      paramName: 'photo',
      maxFilesize: 50,
      clickable: '.fileinput-button',
      thumbnailWidth: 700,
      thumbnailHeight: null,
      uploadMultiple: false, 
      maxFiles: 1,
      addRemoveLinks: false,
      acceptedFiles: '.png,.jpg',
      init: function() {
        this.on("sending", function(file, xhr, formData) {
          formData.append("step", "upload");
          var storageuser = JSON.parse(localStorage.getItem('currentUser'));
          var uid =  storageuser.id;
          var type = flag;
          formData.append("uid", uid);
          formData.append("type", flag);
        });
        this.on('success', function(file, responseText) {
          setTimeout(function(){
            // hide the Dropzone
            $(".modal").modal('hide');
            _this.dropZoneF[flag] = 0;
            _this.tDl[flag].destroy();
            console.log(responseText);
            let currentUser = responseText.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            _this.user = currentUser;
            console.log("BG should be",_this.s3Url + _this.user.cover_img);
            if(flag == 0) 
              $('.cus_img').css('background-image', 'url(' + _this.s3Url + _this.user.avatar + ')');
            else
              $('.banner_img').css('background-image', 'url(' + _this.s3Url + _this.user.cover_img + ')');
          },0);
        });
      }
    });
  }

  /* onSave change the Avatar */
  onAvatar() {
    let _this = this;
    this.fileService.avatar_change(this.tempavatars3_id, this.user.id).subscribe(
      response => {
        let currentUser = response.json().result;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        _this._zone.run(()=>{
          _this.user = currentUser;
          $('.cus_img').css('background-image', 'url(' + _this.s3Url + _this.user.avatar + ')');
        });
      },
      error => {
        console.log(error);
      }
    );
  }

  /* onSave change the Banner */
  onBanner() {
    let _this = this;
    this.fileService.banner_change(this.tempbanners3_id, this.user.id).subscribe(
      response => {
        console.log(response);
        let currentUser = response.json().result;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        _this._zone.run(()=>{
          _this.user = currentUser;
          $('.banner_img').css('background-image', 'url(' + _this.s3Url + _this.user.cover_img + ')');
        });
      },
      error => {
        console.log(error);
      }
    );
  }

}
