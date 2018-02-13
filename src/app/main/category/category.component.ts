import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from '../../provider/service/file-upload.service';
import * as Global from '../../provider/globals';

declare var jQuery: any;
declare var $ : any;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, AfterViewInit {
	loadAPI: Promise<any>;
	gallery: any = [];
	groups: any = [];
	images: any = [];
    s3Url = Global.s3Url;
	constructor(private router: Router, private route: ActivatedRoute, private fileService: FileUploadService, private _elementRef: ElementRef) { }

	ngOnInit() {
		this.loadAPI = new Promise((resolve) => {
			console.log('resolving promise');
			Global.loadScript();
		});
		this.route.params.forEach(params => {
			let category = params['category'];
			this.fileService.onCategory(category).subscribe(
				res => {
				    var temp = res.json();
				    this.gallery = temp.gallery;
				    this.groups = temp.groups;
				    this.images = temp.images;

				    setTimeout(function(){
				    	$('.gal-banner').css('background-image', 'url(assets' + temp.gallery.header_image_url + ')');	//back img
						$('.imageFit').imgLiquid({
					        fill: true,
					        horizontalAlign: 'center',
					        verticalAlign: 'center'
					    });
						$('.gal-thumb > a').popover({
					        content: function () {
					            return $(this).closest('li').find('.gal-thumb-details').html();
					        },
					        //container: 'body',
					        html: true,
					        trigger: 'click hover',
					        placement: 'top', 
					        delay: {
					            show: 100, 
					            hide: 100
					        },
					    });
				       $('.pagination').rPage();
				    },0);
				}, 
				err => {
				  console.log(err);
				}
			);
		});
	}

	ngAfterViewInit() {
		
    }

    onWallPaper(img_id: string) {
    	this.router.navigate(['/wallpaper/'+img_id]);
    }

    onGroup(group_name: string) {
    	if(group_name == '0')
    		this.ngOnInit();
    	else{
    		this.fileService.onGroup(group_name).subscribe(
    			res => {
				    var temp = res.json();
				    this.images = temp.result;
    			},
    			err => {
    				console.log(err);
    			}
    		);
    	}
    }
}
