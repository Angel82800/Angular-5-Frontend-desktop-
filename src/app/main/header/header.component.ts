import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Http, Response } from '@angular/http';
import { AuthService } from '../../provider/service/auth.service';
import { FileUploadService } from '../../provider/service/file-upload.service';
import { ToastrService } from 'ngx-toastr';

import * as Global from '../../provider/globals';

declare var jQuery: any;
declare var $ : any;
declare var Dropzone:any;

@Component({
  selector: 'app-main-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class MainHeaderComponent implements OnInit, AfterViewInit {
  user: any = [];
  dropZone: any = 0;
  a_dropZone: any = 0;
  image: any = 0;
  s3Url = Global.s3Url_wallpaper;
  online_users: number = 0;
  galleries: any = [];
  groups: any = [];
  name: string = "Wallpapers";
  names: string[] = ["Members", "Groups", "Wallpapers"];
  d_upload : any = [];
  d_avatar : any = [];

  constructor(private fileService: FileUploadService, private router: Router, private http: Http, private authService: AuthService, private toastrService: ToastrService) { }

  ngOnInit() {

      // get User Information from Local Storage
      this.user = Global.getUser();
      // API transport
      this.fileService.getImageCount().subscribe(
          response => {
              let temp = response.json();
              this.image = temp.result;
              this.online_users = temp.onlineUsers;
          },
          error => {
              console.log(error);
          }
      );
      this.fileService.onGallery().subscribe(
        res => {
            var temp = res.json();
            this.galleries = temp.galleries;
        }, 
        err => {
          console.log(err);
        }
      );
      this.fileService.onGroups().subscribe(
        res=> {
          var temp = res.json();
          this.groups = temp.groups;
        },
        err => {
          console.log(err);
        }
      );
  }

   ngAfterViewInit() {
     if(this.user)
        setTimeout(function() {
      let width = $(window).width();
      let left = $(".exp-drop").offset().left;
      if(width< 768)
      {
        $(".exp-drop div.dropdown-menu").css("min-width",width).css("width", width).css("margin-left",-left);
      }
      if ($(window).width() > 767) {
        $('.header-bottom .nav > li.dropdown').hover(function() {
          $('.dropdown-menu', this).stop( true, true ).fadeIn('fast');
          $(this).toggleClass('open');
          $('i', this).removeClass('fa-angle-down').toggleClass('fa-angle-up');
        },
        function() {
          $('.dropdown-menu', this).stop( true, true ).fadeOut('fast');
          $(this).toggleClass('open');
          $('i', this).addClass('fa-angle-down').toggleClass('fa-angle-up');
        });
      }
        }, 0);
  }

  clicked(value: string): void {
    switch(value){
      case 'Members': {
        this.router.navigate(['search-member']);
        break;
      }
      case 'Wallpapers': {
        this.router.navigate(['search-wallpaper']);
        break;
      }
      default :{
        break;
      }
    }
  }

  uploadWallpaper() {
    $('#W_UploadPic').modal('show');
    this.uploadwPic();
  }

  uploadAWallpaper() {
    // Bootstrap modal
    $('#AW_UploadPic').modal('show');
    // call dropZone function for photo Upload
    this.uploadPicZone();
  }

  // upload Avatar || Banner
  uploadPicZone() {
    let _this = this;
    let id = ['#A_uploadZone','#B_uploadZone'];
    // check if dropZone is already set
    if(this.a_dropZone!=0) return;
    else this.a_dropZone = 1;

    Dropzone.autoDiscover = false;
    // create new Dropzone object
    this.d_avatar=new Dropzone("#AW_uploadZone", {
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
          formData.append("uid", uid);
          formData.append("type", 0);
        });
        this.on('success', function(file, responseText) {
          setTimeout(function(){
            // hide the Dropzone
            $(".modal").modal('hide');
            _this.a_dropZone = 0;
            _this.d_avatar.removeAllFiles();
            _this.d_avatar.destroy();
            console.log(responseText);
            let currentUser = responseText.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            _this.user = currentUser;
            $('.mydn-wrap .md-thumb img').attr("src", _this.s3Url + _this.user.avatar);
          },0);
        }).on('error', function(file, errorText) {
            $(".modal").modal('hide');
            _this.a_dropZone = 0;
            _this.d_avatar.removeAllFiles();
            _this.d_avatar.destroy();
            _this.router.navigate(['/500'], { skipLocationChange: true });
        });
      }
    });
  }
  uploadwPic() {
    let _this=this;
    // Dropzone Auto Discover: false
    Dropzone.autoDiscover = false;
    this.d_upload = new Dropzone('#W_uploadZone', {
        url: Global.API_URL+"upload",
        paramName: 'photo',
        maxFilesize: 50,
        clickable: '.fileinput-button.wallpaper',
        thumbnailWidth: 700,
        thumbnailHeight: null,
        uploadMultiple: false, 
        maxFiles: 1,
        addRemoveLinks: true,
        acceptedFiles: '.png,.jpg',
        init: function() {
          this.removeAllFiles(true); 
          this.on("sending", function(file, xhr, formData) {
            formData.append("step", "upload");
            var storageUser = localStorage.getItem('currentUser');
            var storageuser = JSON.parse(storageUser);
            var uid =  storageuser.id;
            formData.append("uid", uid);
          });
          this.on('success', function(file, responseText) {
            setTimeout(function(){
              // if size is smaller than limit
              if (responseText.code == 0)
              {
                _this.toastrService.warning('Image should be larger than 1024 * 768px');
                _this.d_upload.removeAllFiles();
                _this.d_upload.destroy();
                $('#W_UploadPic').modal('hide');
                return false;
              }
              else if(responseText.code == -1 )
              {
                _this.toastrService.warning('Image should not be sexually appeal');
                _this.d_upload.removeAllFiles();
                _this.d_upload.destroy();
                $('#W_UploadPic').modal('hide');
                return false; 
              }
              $('#W_UploadPic').modal('hide');
              _this.d_upload.destroy();
              _this.dropZone = 0;
              localStorage.setItem('uFlag', '1');
              location.assign(Global.wallpaper + responseText.img_id);
            },2000);
          }).on('error', function(file, errorText) {
            $(".modal").modal('hide');
            _this.a_dropZone = 0;
            _this.d_upload.removeAllFiles();
            _this.d_upload.destroy();
            _this.router.navigate(['/500'], { skipLocationChange: true });
          });
        }
      });
      this.dropZone = 1;

      $(document).on('paste',function(event) {
        var items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (var index in items) {
          var item = items[index];
          if (item.kind === 'file') {
            // adds the file to your dropzone instance
            this.d_upload.addFile(item.getAsFile());
          }
        }
      });
  }

}
