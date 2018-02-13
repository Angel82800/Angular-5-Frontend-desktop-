import { ElementRef, Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, Routes, Params }  from '@angular/router';
import * as Global from '../../provider/globals';
import { FileUploadService } from '../../provider/service/file-upload.service';


declare var jQuery: any;
declare var $ : any;

// Component management
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, AfterViewInit {
  loadAPI: Promise<any>;
  galleries: any = [];
  groups: any = [];
  tags: any = [];
  constructor(private _elementRef: ElementRef, private router: Router, private fileService: FileUploadService) { }

  ngOnInit() {
      this.loadAPI = new Promise((resolve) => {
          console.log('resolving promise');
      });
      this.fileService.onGallery().subscribe(
        res => {
            var temp = res.json();
            this.galleries = temp.galleries;
            this.groups = temp.groups;
            this.tags = temp.tags;

            Global.loadScript();
        }, 
        err => {
          console.log(err);
        }
      );
  }
  ngAfterViewInit() {
    setTimeout(function(){
       $('.gallery-grids .grid').isotope({
        // options
        itemSelector: '.gallery-grids .grid .grid-item',
        layoutMode: 'masonry'
      });
    },500);
  }

  onNavigate(category: string) {
    this.router.navigate(['/gallery/' + category.toLowerCase()]);
  }

  convertInt(num: any) {
    return Math.min(parseInt(num),8);
  }
}
