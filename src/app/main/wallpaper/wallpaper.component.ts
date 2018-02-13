    import { Injectable } from '@angular/core';
    import { ElementRef, Component, OnInit, NgZone, AfterViewInit, ViewChild } from '@angular/core';
    import { ActivatedRoute, Params, Router } from '@angular/router';
    import { NgForm } from '@angular/forms';
    import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
    import { Ng2ImgToolsService } from 'ng2-img-tools';

    import { FileUploadService } from '../../provider/service/file-upload.service';
    import { AuthService } from '../../provider/service/auth.service';
    import { ShareButtonsService } from 'ngx-sharebuttons';
    import { ToastrService } from 'ngx-toastr';

    import * as Global from '../../provider/globals';

    declare var jQuery: any;
    declare var $ : any;
    // Component management

    @Component({
        selector: 'app-main-wallpaper',
        templateUrl: './wallpaper.component.html',
        styleUrls: ['./wallpaper.component.css']
    })

    @Injectable()
    export class MainWallpaperComponent implements OnInit, AfterViewInit{
        @ViewChild('wallpaper') selectRef: ElementRef;
        resizedImage: SafeUrl = null;
        loadAPI: Promise<any>;
        s3Url = Global.s3Url;
        s3Url_wallpaper = Global.s3Url_wallpaper;
        user: any = [];
        image: any = [];
        image_id : any;
        preview_image: any = [];
        tags: any = [];
        temptags: any = [];
        uploader: any = [];
        recent_group :any = [];
        ip_address: any = "";
        // comment
        newcmt: string = '';
        cmtauthor: any = [];
        cmtlists: any = [];
        cmtData: any = [];
        counter: number;
        parent_cmt_id: number = 0;
        totalShare: number = 0;
        getColor: string = "";
        _data: any = [];
        activeNode: any = [];    // favTree Active node
        favTreeNode: any = [];    // favTree Overall structure
        selectedValue: any = [{},{}];
        likeflag: number = 0;
        currentImageGroups: any = [];
        nonImageGroups: any = [{}, {},  {}, {}, {}];
        imageGroups: any = [];
        is_check: any = [0,0];
        is_ban: any = "";
        // saved width / height
        width: number = 0;
        height: number = 0;
        valid: boolean = false;
        error: boolean = false;
        // group selected index
        g_index: any = -1;

        constructor(private sanitizer: DomSanitizer, private ng2ImgToolsService: Ng2ImgToolsService, private _elementRef: ElementRef, private router: Router, private route: ActivatedRoute, private fileService: FileUploadService, private authService: AuthService, private toastrService: ToastrService,  private _zone: NgZone) {
            this.user = Global.getUser();
        }
        
        toLower(value: string)
        {
            return value.toLowerCase();
        }

        isNumeric(value: string) {
            return /^\d+$/.test(value);
        }

        timeDifference(previous: any) {
            console.log(previous +":" + new Date());
            let current = Date.now();
            let msPerMinute = 60 * 1000;
            let msPerHour = msPerMinute * 60;
            let msPerDay = msPerHour * 24;
            let msPerMonth = msPerDay * 30;
            let msPerYear = msPerDay * 365;
            previous = new Date(previous).getTime();
            let elapsed = current - previous;

            console.log(previous +":" + current +":"+ elapsed);
            console.log(new Date(previous).getDay() +":" +new Date(previous).getMonth());
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

        ngOnInit() {
            let _component = this;
            // initialize
            this.valid = false;
            this.error = false;
            this.g_index = 0;
            this.image ={
                "likes": 0,
                "favorites": 0,
                "shares": 0,
                "file_size": 0,
                "orig_width": 0,
                "orig_height": 0
            }
            this.currentImageGroups = [];
            this.nonImageGroups = [{}, {},  {}, {}, {}];

            // get IP address
            $.getJSON('//api.ipify.org?format=jsonp&callback=?', function(data) {
                _component.ip_address = data.ip;
            });
            // getting params
            this.route.params.forEach(params => {
                // get id param
                let img_id = params['img_id'];
                if(!this.isNumeric(img_id))
                {
                    this.router.navigate(['/404'], { skipLocationChange: true });
                    return false;
                }
                // Get Comments
                this.fileService.isAvail(img_id).subscribe(
                    response => {
                        var temp = response.json();
                        if(temp.code == -1)
                        {
                            this.router.navigate(['/404'], { skipLocationChange: true });
                            return false;
                        }
                        else{
                            this.image_id = img_id;
                            // get Image Group & Information
                            this.width = screen.width;
                            this.height = screen.height;
                            // refresh the Tags
                            this.temptags = [];

                            // send API request
                            this.fileService.index(img_id, screen.width, screen.height).subscribe(
                                response => {
                                    let temp = response.json();
                                    _component.image = temp.image;
                                    _component.preview_image = _component.image.caches3;
                                    _component.currentImageGroups = temp.cgroup;
                                    _component.nonImageGroups = _component.nonImageGroups.slice(0,5-parseInt(temp.cgroup.length));
                                    _component.recent_group = temp.recent;

                                    // Get Group Info
                                    this.fileService.getGroup(this.image.upload_by).subscribe(
                                        response => {
                                            let temp = response.json();
                                            _component.imageGroups = temp.group;
                                        },
                                        error => {

                                        }
                                        );
                                    // Get User Info
                                    this.authService.getUser(this.image.upload_by).subscribe(
                                        response => {
                                            let temp = response.json();
                                            this.uploader = temp.user;
                                            this._zone.onMicrotaskEmpty.first().subscribe(() => {
                                                this.ImageFit();
                                                if(localStorage.getItem('uFlag'))
                                                {
                                                    $(".edit-pic a").click();
                                                    localStorage.removeItem('uFlag');
                                                }
                                            });
                                        },
                                        error => console.log(error)
                                        );
                                    /* Tag display*/
                                    this.tags = temp.tags;
                                    // display view
                                    for(var v in this.tags) {
                                        this.temptags.push(this.tags[v].name);
                                    }
                                    this.tagname.nativeElement.value = this.temptags;
                                },
                                error => {
                                    console.log(error);
                                }
                                );

                            // Get Comments
                            this.fileService.getComment(img_id).subscribe(
                                response => {
                                    var temp = response.json();
                                    this.cmtData = temp.comments;
                                    this.cmtlists = this.cmtData;
                                    console.log(temp.comments);
                                    this.counter = 0;
                                    // this.getCmtData();
                                },
                                error => console.log(error)
                                );

                            // Get Favorite Info
                            this.fileService.getFavInfo(img_id, this.user.id).subscribe(
                                response => {
                                    var temp = response.json();
                                    // set Like On
                                    if(temp.like)
                                    {
                                        this.likeflag = 1;
                                        $(".fb-like .icobutton").addClass("active");
                                        $(".fb-like .icobutton").css("color","#1f55a7");
                                    }

                                    // set Fav On
                                    if(temp.fav)
                                    {
                                        this.getColor = "red";
                                        this.activeNode = {"id": temp.active};
                                        $(".fav-share .icobutton").addClass("active");
                                        $(".fav-share .icobutton").css("color","#e2264d");
                                    }

                                    this._data = temp.folders;
                                },
                                error => console.log('favInfoError-', error)
                                )

                             // check whether User is banned
                            this.fileService.isBannedByImageID(this.user.id, img_id).subscribe(
                                response => {
                                    let temp = response.json();
                                    _component.is_ban = temp.result;
                                },
                                error => {
                                    console.log(error);
                                }
                            )
                        }
                    },
                    error => {
                        if(error.status == 500){
                            this.router.navigate(['/500'], { skipLocationChange: true });
                        }
                    } 
                );
            });

            
            $.getScript("../../../assets/js/wallpaper.js", function() {
            });    
            
            // initialization
            this.init();     
        }

        @ViewChild('tagname') tagname: ElementRef;
        @ViewChild('stclear') stclear: ElementRef;
        // Custom Javascript Snippet
        ngAfterViewInit() {
            $(".selectpicker option").waitUntilExists(function() {
                    $(".selectpicker.group-select").selectpicker('refresh');
            });
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
        // resize Image & Download
        imageResize(width: number, height: number) {
            // store the data binding variable
            this.width = width;
            this.height = height;
            Global.setLoading();
            // sending API request
            this.fileService.resize(this.image_id, width, height).subscribe(
                response => {
                    // download Box
                    var temp = response.json();
                    this.preview_image = temp.result;
                    Global.outLoading();
                },
                error => {
                    console.log(error);
                }
                );
        }

        // externally download
        downloadImage() {
            let _component = this;
            // send API request
            this.fileService.downloadImage(this.ip_address, this.user.id, this.image.id).subscribe(
                response => {
                    var temp = response.json();
                    if(temp.result == 0)
                    {                            
                    }
                    else{
                        // update the Download counter
                        this._zone.run(()=>{
                            this.toastrService.success("Successfully downloads");
                            this.image.downloads = parseInt(this.image.downloads + 1);
                        });
                    }
                },
                error => {
                    console.log(error);
                }
            );

            var link = document.createElement("a");
            link.download = 'true';
            link.href = this.preview_image;
            link.click();
        }

        // set Background Image of Edit click Event
        setBackImg() {
            //$('.cus_img').css('background-image', 'url(' + this.s3Url + this.image.s3_id + ')');//back img
            for(var i = 0; i < this.temptags.length; i++) {
                $("#edit-tags").tagsinput('add',this.temptags[i]);
            }
        }

        // initialization
        init()
        {
            // Note - Fav Modal dynamically rendered so No way but to detect inside TypeScript via jQuery as Angular is predefined before Object is rendered
            // detect On
            let _this=this;

            // keyboard event
            $(document).live("keypress", "#cmt-field", function(e){
                alert("cmt-field");
                if ((e.keyCode == 10 || e.keyCode == 13) && e.ctrlKey) {
                    // Ctrl-Enter pressed
                    var stick = $(".st-img")[0];
                    var content = $("#cmt-field")[0].value;
                    _this.cmtpost(stick, content);
                }
            });

            // social share Counter
            $(document).on("click", ".social-share button", function() {
                _this.sumCounts(1);
            }).on("click", ".social-share-btn", function() {
                _this.sumCounts(1);
            });
            // Cmt-link
            $(document).on("click" , ".cmt-link", function() {
                var atr = $(this).parents("li").attr("id");
                $(".cmtLink").val(Global.wallpaper+_this.image.id+"#"+atr);
            });

            // favorite button catch
            $(document).off("click",".save_fav").on("click",".save_fav",function(event) {
                // change the favorite folder
                _this.addFavorite();
            }).on("click",".remove-fav",function(event) {
                // remove the favorite
                $('.trigger-tree').popover('hide');
                $('.fav-backdrop').remove();
                _this.removeFavorite();
            });

            // Group Select
            $(document).on('click', '.browse-group-link', function(e){
              e.preventDefault();
              _this.g_index = -1;
              $('.modal-select-group').addClass('visible-elem');
            }).on('click', '.group-thumb', function(e){
              e.preventDefault();
              _this.g_index = $(".group-thumb").index(this);
              $('.modal-select-group').addClass('visible-elem');
            });

            // popup Favorite Tree with proper file Structure
            $('.trigger-tree').popover({
                content: function () {
                    return $('#tree-popover-content').html();
                },
                html: true,
                trigger: 'click',
                delay: {
                    show: 100, 
                    hide: 100
                },
            }).on('show.bs.popover', function() {
                setTimeout(function(){
                    $('.tr-pop').closest('.popover').addClass('pop-pos');
                    _this.makeFavorite();
                },100);
            }).on('shown.bs.popover', function(){
                $('body').prepend('<div class="fav-backdrop"><div>');
                setTimeout(function(){ 
                    $('.fav-backdrop').addClass('filing');
                }, 300);
            }).on('hidden.bs.popover', function () {
                $('.favtree').jstree('destroy');
            });

            // Popup box & Image responsive event
            $(document).on('shown.bs.modal','#TipBox', function() {
                // resize the Image to fit
                $(".imageFit").each(function(){
                    var attr = $(this).find("img").attr("src");
                    $(this).css("background-image", "url("+ attr +")");
                });
            });

            var carousel = $('.popu-list-1');
            if(carousel.length != 0)
                carousel.itemslide({
                    left_sided: true
                });

            var carousel2 = $('.popu-list-2');
            if(carousel2.length != 0)
                carousel2.itemslide({
                    left_sided: true
                });

            $('#edit-tags').tagsinput({
                tagClass: 'label label-primary'
            });
        }

        //  Update Image info.
        changeInfo(name: any, title: string) {
            $('#EditPic').modal('hide');
            let changetag= name.split(",");
            if(name.length != 0) this.temptags = changetag;
            else this.temptags = [];
            this.image.title = title;
            this.fileService.imageEdit(this.image, this.temptags, this.currentImageGroups).subscribe(
                response => {
                    //console.log(response);
                },
                error => {
                    console.log(error);
                }
                );
        }

        saveGroup(group: any) {
            // find the location of group array
            var temp = this.imageGroups.findIndex(x => x.name == group);
            // to check if current group has same value
            var temp1 = this.currentImageGroups.findIndex(x => x.name == group);

            if(temp1>-1)
            {
                this.toastrService.warning("Wallpaper already has such group.");
                return false;
            }
            if(this.currentImageGroups.length < 5){
                if(this.g_index == -1)
                {
                    this.currentImageGroups.push(this.imageGroups[temp]);
                    this.nonImageGroups.pop();    
                }
                else
                {
                    this.currentImageGroups[this.g_index] = this.imageGroups[temp];
                }
            }

        }

        removeGroup(group: any) {
            group = this.currentImageGroups[this.g_index].name;
            console.log(this.currentImageGroups);
            var temp = this.currentImageGroups.findIndex(x => x.name == group);
            this.currentImageGroups.splice(temp, 1);
            this.nonImageGroups.push({});
            $('.modal-select-group').removeClass('visible-elem');
        }

        // like event
        onlike(img_id: number) {
            this.fileService.like(img_id, this.user.id).subscribe(
                response => {
                    var temp = response.json();
                    this.image.likes = temp.result;
                    if(temp.msg == 1)
                        this.likeflag = 1;
                    else 
                        this.likeflag = 0;
                    // change the Color
                    if (this.image.likes) $(".fb-like .icobutton").css("color","#1f55a7");
                    else $(".fb-like .icobutton").css("color","#aab8c2");
                },
                error => {
                    console.log(error);
                }
            );
        }

        // new comment
        cmtpost(stick: any, newcontent: string) {
            var temp = stick.innerHTML;
            var sticker = '';
            if (temp) {
                var strstr = '<img src="http://site.org/one.jpg" />';
                var str = temp;
                var rex = /<img[^>]+src="?([^"\s]+)"?\s*\>/g;
                var m = rex.exec(str);
                sticker = m[1];
            }
            if(!localStorage.getItem('reply'))
                this.parent_cmt_id = 0;
            this.fileService.newComment(sticker, newcontent, this.image.id, this.user.id, this.parent_cmt_id).subscribe(
                response => {
                    $('.msg-bd-close').click();
                    var temp = response.json();
                    this.cmtlists.unshift(temp.newcomment);
                    // until Comment is rendered
                    $("#cList_"+temp.newcomment.id).waitUntilExists(function(){
                        var pos = $("#cList_"+temp.newcomment.id).offset().top;
                        // animated top scrolling
                        $('body, html').animate({scrollTop: pos - 50});    
                    });
                        
                },
                error => {
                    console.log(error);
                }
                );
            this.newcmt = '';
            this.stclear.nativeElement.click();
        }

        // reply comment
        replycmt(parent_cmt_id: number) {
            this.parent_cmt_id = parent_cmt_id;
            localStorage.setItem('reply', 'true');
        }

        // Image Delete
        imageDelete(id) {
            Global.setLoading();
            this.fileService.imageDelete(id).subscribe(
                response => {
                    Global.outLoading();
                    $('#EditPic').modal('hide');
                    this.router.navigate(['']);
                },
                error => {
                    Global.outLoading();
                    console.log("Image Delete Error", error);
                }
                );
        }

        getCmtData() {

            for(let i = this.counter + 1; i < this.cmtData.length; i++)
            {
                this.cmtlists.push(this.cmtData[i]);
                if(i%5==0) break;
            }
            this.counter+=5;
        }

        sumCounts(count) {
            if (count > 0)
            {
                // send API request
                this.fileService.socialUpdate(this.ip_address, this.user.id, this.image.id).subscribe(
                    response => {
                        var temp = response.json();
                        if(temp.result == 0)
                        {                            
                        }
                        else{
                            // update the Download counter
                            this._zone.run(()=>{
                                //this.toastrService.success("Successfully shares the image");
                                this.image.shares = parseInt(this.image.shares + 1);
                            });
                        }
                    },
                    error => {
                        console.log(error);
                    }
                    );
            }
        }

        onSocialInvite(form: NgForm) {
            var str = form.value.content;
            var temp = str.split(",");
            var email = temp[0];
            var content = temp[1];
            Global.setLoading();
            this.fileService.socialInvite(form.value.fullname, email, content).subscribe(
                response => {
                    Global.outLoading();
                    this.toastrService.success('Success');
                },
                error => {
                    Global.outLoading();
                    console.log(error);
                }
                );

            // close the Modal box
            $("#shareDesktopNexus").modal('hide');
        }

        onFollow(follower_id, user_id) {
            Global.setLoading();
            this.fileService.follow(follower_id, user_id).subscribe(
                response => {
                    Global.outLoading();
                    this.toastrService.success("Success");
                },
                error => {
                    Global.outLoading();
                    console.log(error);
                }
                );
        }

        // add selected Favorite
        addFavorite() {
            console.log("Color",this.getColor);
            // if unFav to Fav
            if(this.getColor == "")
            {
                this.fileService.favoriteImage(this.activeNode.id, this.favTreeNode, this.image.id, this.user.id).subscribe(
                response => {
                    var temp = response.json();
                    // Global.outLoading();
                    this._zone.run(()=>{
                        this.image.favorites = temp.result;
                        this.getColor = "red";
                        $(".trigger-tree").css("color", "#e2264d");
                    });
                },
                error => {
                    // Global.outLoading();
                    console.log(error);
                }
                );

                return false;
            }
            // change Favorite route
            Global.setLoading();
            this.fileService.favoriteImage(this.activeNode.id, this.favTreeNode, this.image.id, this.user.id).subscribe(
                response => {
                    var temp = response.json();
                    // Global.outLoading();
                    this._zone.run(()=>{
                        this.toastrService.success("Success");
                        this.image.favorites = temp.result;
                        this.getColor = "red";
                        $(".trigger-tree").css("color", "#e2264d");
                        Global.outLoading();
                    });
                },
                error => {
                    Global.outLoading();
                    console.log(error);
                }
                );
            
            // set Favoritate status On
            $('.trigger-tree').popover('hide');
            $('.fav-backdrop').remove();
        }

        // remove selected Favorite
        removeFavorite()
        {
            Global.setLoading();
            this.fileService.favDelete(this.image.id, this.user.id).subscribe(
                response => {
                    var temp = response.json();
                    this._zone.run(()=>{
                        this.image.favorites = temp.result;
                        this.getColor = ''; 
                        $(".trigger-tree").css("color", "#aab8c2");
                        Global.outLoading();
                    });
                },
                error => console.log(error)
                );
        }

        makeFavorite() {
            // buffer variables inside jQuery function
            let _component = this;
            let _tree = this.favTreeNode;
            let _tdata = this._data; 
            var folder = [
            { "id": "ajson1", "parent": "#", "text": "My Favorites", "state": {"opened": true, "delete" : false, "selected": true}, "li_attr" : { "class" : "my-fav" }, "data" : { "file" : false } }
            ];

            // initially set root to active Node

            if(this.getColor == ""){
                _component.activeNode = folder[0];                
                this.addFavorite();
            }

            // func
            if(this._data)
                folder = folder.concat(this._data);

            $('.favtree').jstree({
                core: {
                    check_callback: true,
                    data: folder
                },
                plugins : ["contextmenu","contextmenubtn"],
                "contextmenu" : {
                    "items" : _component.customMenu(folder, _component)
                },
                "ui" : {
                    "initially_select" : [ "root" ]
                }
            }).on('changed.jstree', function (e, data) {
                if(data.node == undefined) return;
                _component.activeNode = data.node;
            }).on('rename_node.jstree', function (e, data) {

                // save to the Change Fav Tree
                let index = _tree.find((o, i) => {
                    if (o.id === data.node.id) {
                        _tree[i].text = data.text;
                        return true; // stop searching
                    }
                });
            }).on("delete_node.jstree", function (e, data) { // listen for the event
                // remove all the node and subnodes to the change tree
                var children = data.node.children_d;
                children.push(data.node.id);
                for(var idx=0;idx<children.length; idx++)
                {
                    let index = _tree.find((o, i) => {
                        if (o.id === children[idx]) {
                            _tree.splice(i, 1);
                            return true; // stop searching
                        }
                    });
                    _tdata.find((o, i) => {
                        if (o.id === children[idx]) {
                            _tree.push({"id": o.id, "text": "", "parent": "", "type": 1});
                            return true; // stop searching
                        }
                    });
                }
            }).on('loaded.jstree', function() {
                // select active node
                $('.favtree').jstree("deselect_all").jstree('select_node', _component.activeNode.id);
            });;
        }
        customMenu(node, parent) {
            // The default set of all items
            var items = {
                createItem: { // The "create" menu item
                label: "Add Folder",
                action: function (data) {
                    var inst = $.jstree.reference(data.reference),
                    obj = inst.get_node(data.reference);

                    var temp = {"id":"", "text": "", "parent": "", "type": 0};
                    inst.create_node(obj, {}, "last", function (new_node) {
                        new_node.data = {file: true};
                        new_node.text = "New Folder";
                        temp.id = new_node.id;
                        temp.text = new_node.text;
                        setTimeout(function () { inst.edit(new_node); },0);
                    });
                    temp.parent = obj.id;
                    // save to the Change Fav Tree
                    parent.favTreeNode.push(temp);
                }
            },
            renameItem: { // The "rename" menu item
                label: "Rename",
                // _disabled: false,
                action: function (data) {
                    var inst = $.jstree.reference(data.reference),
                    obj = inst.get_node(data.reference);
                    inst.edit(obj);
                }
            },
            deleteItem: { // The "delete" menu item
            label: "Delete",
            action: function (data) {

                var inst = $.jstree.reference(data.reference),
                obj = inst.get_node(data.reference);
                if(inst.is_selected(obj)) {
                    //inst.delete_node(inst.get_selected());
                    $('#ConfirmDelete').addClass('visible-elem');
                    $('#conf_txt').html('Are you sure want to delete <strong>' + node.text +'</strong>?');
                }
                else {
                    //inst.delete_node(obj);
                }

                // when Press "YES" to delete node
                $(document).on('click', '.del-item', function(){
                    inst.delete_node(obj);
                    $('#ConfirmDelete').removeClass('visible-elem');
                });
                $(document).on('click', '.cancel-del-tree', function(){
                    $('#ConfirmDelete').removeClass('visible-elem');
                });
            }
        }
    };
    return items;
    }

    reportImage(img_id: number, category: number, tag: string = "") {

        // category type variable        
        let category_type = "";
        let category_content = "";
        switch(category)
        {
            case 0:
            // Miscategoriezed
            category_type = "Incorrect Gallery/Category";
            category_content = "Right now it is under "+$(".m_gallery").text()+"/"+$(".m_category").text()+". It should be "+$(".c_gallery option:selected").text()+"/"+$(".c_category option:selected").text();
            break;
            case 1:
            // Inaccurated Tag
            category_type = "Inaccurate or Misleading Tag";
            category_content = "Current tag: <"+tag+">"+" is inaccurate.";
            break;
            case 2:
            category_type = "Adult Content";
            category_content = "This is Nudity Content";
            break;
            case 3:
            category_type = "Offensive Theme";
            category_content = "This is Offensive Content to me";
            break;
            case 4:
            category_type = "Duplicate of Existing Wallpaper";
            category_content = "This is duplicated wallpaper";
            break;
            case 5:
            category_type = "DMCA Copyright Violation";
            category_content = "This is Violated against DMCA";
            break;
            case 6:
            category_type = "";
            category_content = "";
            break;
            default:
            break;
        }
        this.fileService.report(img_id, category_type, category_content).subscribe(
            response => {
                var temp = response.json();
                var result = temp.result;
                if(result==1) this.toastrService.success('Thank you for your reports! We will get back to you once complaint is confirmed');
            },
            error => {
                console.log(error);
            }
            );          
    }

    update_checkBox(flag) {
        var classes=['.nudity','.offensive'];
        this.is_check[flag] = 1 - this.is_check[flag];
        if(!this.is_check[flag])
        {
            $(classes[flag]).removeClass("bootstrap-checkbox");
        }
        else{
            $(classes[flag]).addClass("bootstrap-checkbox");
        }
    }

    sendDiamond(user_id: number, uploader_id: number) {
        //check if uploader is ME!
        if(user_id == uploader_id)
        {
            this.toastrService.warning('Sorry! You are the same user.');
            return false;
        }

        // check if Other is set
        let diamond = (<HTMLInputElement>document.querySelector(".tipamount-other")).value;
        let o_diamond = (<HTMLInputElement>document.querySelector('input[name="tipamount"]:checked')).value;
        diamond = (diamond=="")?o_diamond:diamond;

        // send API
        this.fileService.sendDiamond(user_id, uploader_id, diamond).subscribe(
            response => {
                var temp = response.json();
                var result = temp.result;
                if(result==1)
                {
                    this.toastrService.success('Transfer success! Thank you for showing your gratitude.');
                    // update the localStorage value
                    localStorage.setItem("currentUser", JSON.stringify(temp.sender));
                    this.user = temp.sender;
                    this.uploader = temp.receiver;
                }

            },
            error => {
                console.log(error);
            }
            ); 
    }

    isMore(obj: any)
    {
        if(obj.length > 5)
            return 1;
        else return 0;
    }
}
