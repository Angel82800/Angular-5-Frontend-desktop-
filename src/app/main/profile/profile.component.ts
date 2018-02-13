import { ElementRef, Component,  OnInit, NgZone , ViewChild} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FileUploadService } from '../../provider/service/file-upload.service';
import { AuthService } from '../../provider/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/add/operator/first';
import * as Global from '../../provider/globals';

declare var jQuery: any;
declare var $ : any;

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    @ViewChild('reports') selectRef: ElementRef;
    loadAPI: Promise<any>;
    s3Url = Global.s3Url_wallpaper;
    user: any = [];
    report: any = [];
    author: any = [];
    follow: any = [];
    tick: any = -1;
    isBan: any = 0;

    constructor(private _elementRef: ElementRef, private router: Router, private route: ActivatedRoute, private fileService: FileUploadService, private authService: AuthService, private ngZone: NgZone, private toastrService: ToastrService) { 
        this.author = Global.getUser();
    }

    // convert string into readable time difference
    timeDifference(previous) {
        let current = Date.now();
        let msPerMinute = 60 * 1000;
        let msPerHour = msPerMinute * 60;
        let msPerDay = msPerHour * 24;
        let msPerMonth = msPerDay * 30;
        let msPerYear = msPerDay * 365;
        
        previous = new Date(previous);
        let elapsed = current - previous;
        
        if(elapsed <0 )
        {
            return 'Just a sec ago';
        }
        else if (elapsed < msPerMinute) {
            return Math.round(elapsed/1000) + ' seconds ago';   
        }
        
        else if (elapsed < msPerHour) {
            return Math.round(elapsed/msPerMinute) + ' minutes ago';   
        }
        
        else if (elapsed < msPerDay ) {
            return Math.round(elapsed/msPerHour ) + ' hours ago';   
        }

        else if (elapsed < msPerMonth) {
            return 'approximately ' + Math.round(elapsed/msPerDay) + ' days ago';   
        }
        
        else if (elapsed < msPerYear) {
            return 'approximately ' + Math.round(elapsed/msPerMonth) + ' months ago';   
        }
        
        else if(elapsed>0) {
            return 'approximately ' + Math.round(elapsed/msPerYear ) + ' years ago';   
        }

    }

    // split them into array
    cuttle(data: any)
    {
        if(data==null) return null;
        return data.split(",");
    }

    // initialize function
    ngOnInit() {
        let _author = this.author.id;
        let _component = this;
        this.route.params.forEach(params => {
            let user_id = params['username'];
            // send API request
            this.fileService.getUserIndex(user_id).subscribe(
                response => {
                    let temp = response.json();
                    this.user = temp.user;
                    this.report = temp.report;
                    this.follow = temp.follow;
                    this.ngZone.onMicrotaskEmpty.first().subscribe(() => {
                        this.initial();
                    });
                },
                error => {
                    console.log(error);
                }
            );

            // check whether User is banned
            this.fileService.isBanned(_author, user_id).subscribe(
                response => {
                    let temp = response.json();
                    _component.isBan = temp.result;
                },
                error => {
                    console.log(error);
                }
            );
        });
    }
    initial() {
        // temporary variable declre
        let _this = this;
        if ($(window).width() < 1900) {
            _this.BadgeSlider();
        }

        // window resize event
        $(window).resize(function () {
            _this.BadgeSlider();
        });

        if ($(window).width() < 481) {
            window.addEventListener('orientationchange', function() {
                _this.InfoSlide();
            }, false);
            setTimeout(_this.InfoSlide(),100);
        }

        // event profile/upload
        _this.EditProfile();
        _this.imageFit();

        var $container = $('.dashboard-grids .grid'),
        filters = {};

        $(".grid img").load(function(){
            $container.isotope({
                itemSelector : '.dashboard-grids .grid .grid-item',
                layoutMode: 'masonry',
                masonry: {
                    columnWidth: '.grid-sizer'
                }
            });
        });
    }

    imageFit()
    {
        $('.imageFit').imgLiquid({
            fill: true,
            horizontalAlign: 'center',
            verticalAlign: 'center'
        });
    }
    InfoSlide() {
        if (this.tick != -1)
            clearInterval(this.tick);
        var off = 10,
        l = off,
        $As = $('ul.pf-info-slide > li'), 
        speed = 2,
        stack = [],
        pause = false;

        console.log($As.length);
        $.each($As, function(){
            var W = $(this).css({
                left: l
            }).width()+off;
            l+=W; 
            stack.push($(this));
        });

        this.tick = setInterval(function(){
            if(!pause){
                $.each($As, function(){
                    var ml = parseFloat($(this).css('left'))-speed;
                    $(this).css({
                        left: ml
                    });
                    if((ml+$(this).width()) < 0){
                        var $first = stack.shift(),
                        $last = stack[stack.length-1];
                        $(this).css({
                            left: (parseFloat($last.css('left'))+parseFloat($last.width()))+off
                        });
                        stack.push($first);
                    }
                });
            }
        }, 1000/25);

        $('ul.pf-info-slide').on('mouseover', function(){
            pause = true;
        }).on('mouseout', function(){
            pause = false;
        })
    }

    BadgeSlider() {
        let carousel = $('.fav-sticker');
        carousel.itemslide({
            left_sided: true
        });
        
        let carousel2 = $('.achieve-badges');
        carousel2.itemslide({
            left_sided: true
        });


        $(window).resize(function () {
            carousel.reload();
            carousel2.reload();
        });
    }

    EditProfile() {
        $('.pf-about-box .edit').on('click', function(e){
            e.preventDefault();
            $(this).hide();
            $('.about-txt').each(function(){
                var content = $(this).html();
                $(this).html('<textarea>' + content + '</textarea>');
            });
            $('.pf-about-box .save-pro').show();
        });

        $('.pf-about-box .save-pro').on('click', function(e){
            e.preventDefault();
            $(this).hide();
            $('.pf-about-box textarea').each(function(){
                var content = $(this).val(); //.replace(/\n/g,"<br>");
                $(this).html(content);
                $(this).contents().unwrap();    
            }); 
            $('.pf-about-box .edit').show(); 
        });
    }

    saveAbout()
    {
        let _this = this;
        // current Password
        let about = (<HTMLInputElement>document.querySelector(".about-txt textarea")).value;
        // set About
        this.fileService.setAbout(_this.user.id, about).subscribe(
            response => {
                var temp = response.json();
                _this.toastrService.success('Success');
                _this.user = temp.result;
            },
            error => {
                _this.toastrService.error('Sorry. There is error during process of your request');
            }
            );
    }

    uploadPost()
    {
        let _this = this;
        let about = (<HTMLInputElement>document.querySelector(".bd_post")).value;
        // set Post

        this.fileService.setPost(_this.user.id, _this.author.id, about).subscribe(
            response => {
                var temp = response.json();
                _this.toastrService.success('Successly left comment on '+_this.user.username);
                (<HTMLInputElement>document.querySelector(".bd_post")).value = "";

                /*  control the hide box */
                $('.msg-bd-close').remove();
                $('.msg-backdrop').removeClass('bg-dark');
                $('.bd_parent').removeClass('visible-top');
                $('.attached-cmt').removeClass('at-top');
                $('.msg-backdrop').remove();
            },
            error => {
                _this.toastrService.error('Sorry. There is error during process of your request');
            }
            );
    }
}
