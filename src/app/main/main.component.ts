import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { AuthService } from '../provider/service/auth.service';
import { FileUploadService } from '../provider/service/file-upload.service';
import { ToastrService } from 'ngx-toastr';

import { MainHeaderComponent } from './header/header.component';
import { MainFooterComponent } from './footer/footer.component';

import * as Global from '../provider/globals';

declare var jQuery: any;
declare var $ : any;
declare var Dropzone:any;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit, AfterViewInit {
  loadAPI: Promise<any>;
  s3Url = Global.s3Url;
  user: any = [];
  dropZone: any = 0;
  image: any = 0;
  online_users: number = 0;
  galleries: any = [];
  groups: any = [];
  constructor(private fileService: FileUploadService, private router: Router, private http: Http, private authService: AuthService, private toastrService: ToastrService) {

    // get Global User
    this.user = Global.getUser();
  }
  
  name: string = "Wallpapers";
  names: string[] = ["Members", "Groups", "Wallpapers"];

  ngOnInit() {
    this.loadAPI = new Promise((resolve) => {
    });

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
            /*Global.loadScript();*/
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

  uploadwPic() {
    let _this=this;
    // Dropzone Auto Discover: false
    Dropzone.autoDiscover = false;
    var tDl=new Dropzone('#W_uploadZone', {
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
                tDl.removeAllFiles();
                tDl.destroy();
                $('#W_UploadPic').modal('hide');
                return false;
              }
              else if(responseText.code == -1 )
              {
                _this.toastrService.warning('Image should not be sexually appeal');
                tDl.removeAllFiles();
                tDl.destroy();
                $('#W_UploadPic').modal('hide');
                return false; 
              }
              $('#W_UploadPic').modal('hide');
              tDl.destroy();
              this.dropZone = 0;
              location.assign(Global.wallpaper + responseText.img_id);
            },2000);
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
            tDl.addFile(item.getAsFile());
          }
        }
      });
  }
}
