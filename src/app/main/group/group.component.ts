import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Global from '../../provider/globals';
import { FileUploadService } from '../../provider/service/file-upload.service';

declare var jQuery: any;
declare var $ : any;

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
	galleries: any = [];
	group: any = [];
	images: any = [];
	followers: any = [];
	s3Url = Global.s3Url;
	tags: any = [];
	user: any = [];
	constructor(private router: Router, private route: ActivatedRoute, private fileService: FileUploadService) { }

	ngOnInit() {
		this.user = Global.getUser();
		this.route.params.forEach(params => {
			let name = params['name'];
			this.fileService.onGroup(name).subscribe(
				res => {
					var temp = res.json();
					this.galleries = temp.galleries;
					this.group = temp.group;
					this.images = temp.images;
					this.followers = temp.followers;

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

	onFollow(group_id: number) {
		this.fileService.groupfollow(group_id, this.user.id).subscribe(
			res => {
				var temp = res.json()
				if(temp.result == false)
					alert("You are already");
				else
					alert("Successful");
			},
			err => {
				console.log(err);
			}
		);
	}

}
