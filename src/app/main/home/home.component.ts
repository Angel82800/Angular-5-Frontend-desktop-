import { Component, ElementRef, OnInit, AfterViewInit, NgZone } from '@angular/core';
import * as Global from '../../provider/globals';

declare var jQuery: any;
declare var $ : any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
loadAPI: Promise<any>;
constructor(private _elementRef: ElementRef) { }

    ngOnInit() {
        this.loadAPI = new Promise((resolve) => {
            console.log('resolving promise');
/*            Global.loadScript();*/
        });
    }

    // Custom Javascript code
    ngAfterViewInit() {
        let _this = this;
        setTimeout(function() {
            $(window).scroll(function() {
            var scrollTop = $(this).scrollTop();

              $('.banner-overlay').css({
                opacity: function() {
                  var elementHeight = $(this).height() - 130;
                  return 1 - (elementHeight - scrollTop) / elementHeight;
                }
              });
            });

            $('.gal-mesonry .grid').isotope({
              // options
              itemSelector: '.gal-mesonry .grid .grid-item',
              layoutMode: 'masonry'
            });

            if ($(window).width() < 768) {
                _this.HomeInfoSlide();
            }

            _this.ImageFit();

        }, 0);
    }
    // Full responsive thumbnail
    ImageFit()
    {
        $('.imageFit').imgLiquid({
            fill: true,
            horizontalAlign: 'center',
            verticalAlign: 'center'
        });
    }
    // Banner slider animation
    HomeInfoSlide()
    {
        var off = 10,
            l = off,
            $As = $('ul.bnr-info-slide > li'), 
            speed = 2,
            stack = [],
            pause = false;

        $.each($As, function(){
          var W = $(this).css({
            left: l
          }).width()+off;
          l+=W; 
          stack.push($(this));
        });

        let tick = setInterval(function(){
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

        $(document).on('mouseover', 'ul.bnr-info-slide', function(){
          pause = true;
        }).on('mouseout', 'ul.bnr-info-slide',  function(){
          pause = false;
        })
    }
}
