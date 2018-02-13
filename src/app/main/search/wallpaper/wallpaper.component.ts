import { ElementRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from '../../../provider/service/file-upload.service';

import * as Global from '../../../provider/globals';

declare var jQuery: any;
declare var $ : any;

// Component management
@Component({
  selector: 'app-wallpaper',
  templateUrl: './wallpaper.component.html',
  styleUrls: ['./wallpaper.component.css']
})
export class WallpaperComponent implements OnInit, AfterViewInit {
  loadAPI: Promise<any>;
  images: any = [];
  title: string = '';
  s3Url = Global.s3Url;
  tags: any = [];
  constructor(private _elementRef: ElementRef, private router: Router, private route: ActivatedRoute, private fileService: FileUploadService) { }
  ngOnInit() {
      this.loadAPI = new Promise((resolve) => {
          console.log('resolving promise');
          Global.loadScript();
      });
    this.route.params.forEach(params => {
      this.title = params['tag'];

      this.fileService.onSearchTag(this.title).subscribe(
        res => {
            var temp = res.json();
            this.images = temp.result;
        }, 
        err => {
          console.log(err);
        }
      );

      this.fileService.onGallery().subscribe(
        res => {
          var temp = res.json();
          this.tags = temp.tags;
        },
        err => {
          console.log(err);
        }
      );
    });
  }
  // Custom Javascript Snippet
  ngAfterViewInit() {
    var s = document.createElement("script");
    s.text = `    
      $(function(){
          CateroryToggle();
          $('.pagination').rPage();
          var SearchInput = $('.site-header .search-form input.form-control');
          SearchInput.val(SearchInput.val());
          var strLength= SearchInput.val().length;
          SearchInput.focus();
          SearchInput[0].setSelectionRange(strLength, strLength);
          $(window).on('load', function(){
              setTimeout(function(){
                  $('.scroll-down').fadeOut();
              }, 6000);
          });
      });
    `;
    this._elementRef.nativeElement.appendChild(s);
  }

}
