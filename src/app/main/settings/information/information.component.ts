import { Component, OnInit, AfterViewInit, Input, Output, NgZone, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadService } from '../../../provider/service/file-upload.service';
import { ToastrService } from 'ngx-toastr';

import * as Global from '../../../provider/globals';

declare var jquery:any;
declare var $:any;

@Component({
  selector: 'app-info',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})

export class Information implements OnInit, AfterViewInit {
  loadAPI: Promise<any>;
  user: any = [];
  email: any = [];
  constructor(private fileService: FileUploadService, private toastrService: ToastrService, private router: Router, private _zone: NgZone) {
    this.user = Global.getUser();
  }

  ngOnInit() {
    let user_id = this.user.id;
    // send API request
    this.fileService.getEmailInfo(user_id).subscribe(
      response => {
        let temp = response.json();
        this.email = temp.result;

        // newly directed
        if (temp.flag==1)
        {
          this.toastrService.success("Successfully verified new email");
        }

        console.log(this.email);
      },
      error => {
        console.log(error);
      });
  }

  ngAfterViewInit()
  {
    var checkExist = setInterval(function() {
       if ($('[data-toggle="tooltip"]').length) {
          $('[data-toggle="tooltip"]').tooltip(); 
          clearInterval(checkExist);
       }
    }, 100);
  }

  //reg to check if email is valid
  validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  }

  addEmail(value: any) {
     let temp_json = {
       "email": "",
       "primary": 0,
       "verified_at": 0
     };
     
     if(!this.validateEmail(value))
     {
       this.toastrService.warning("E-mail is not valid type");
       return false;
     }
     
     Global.setLoading();
     // send API request
     this.fileService.addEmail(this.user.id, value).subscribe(
        response => {
          Global.outLoading();
          let temp = response.json();
           if(temp.result == 0)          
           {
             this.toastrService.error("Sorry! Email has already been used. Please try other email");
           }
           else {
             temp_json['email'] = value;
             this.email.push(temp_json);
             this.toastrService.success("Successfully added new Email. Please verify it to activate");
           }
        },
        error => {
         console.log(error);
        });
  }

  resendEmail(value: any) {
     Global.setLoading();
     // send API request
     this.fileService.resendEmail(this.user.id, value).subscribe(
        response => {
          Global.outLoading();
          let temp = response.json();
           if(temp.result == 0)          
           {
             this.toastrService.error("Sorry! Email cannot be sent.");
           }
           else {
             this.toastrService.success("Successfully sent mail to "+ value);
           }
        },
        error => {
         console.log(error);
        });
  }

  setPrimary(value: any)
  {
      Global.setLoading();
      // send API request
      this.fileService.setPrimary(this.user.id, value).subscribe(
       response => {
           Global.outLoading();
           let temp = response.json();
           if(temp.result != 0)
           {
               this.email = temp.result;
           }
       },
       error => {
         console.log(error);
      }); 
  }

  isPrimary(value: any)
  {
    if(value.verified_at == 1)
    {
      if(value.primary == 0) return 1;
    }
    return 0;
  }
  // this is called when trash is clicked
  removeClick(value: any)
  {
    let _component = this;
    //inst.delete_node(inst.get_selected());
    $('#ConfirmDelete').addClass('visible-elem');
    //alert(node.text);
    $('#conf_txt').html('Are you sure want to delete <strong>' + value +'</strong>?');
    // catch the event
    $(document).off("click",".del-item").on("click", ".del-item",  function() {
      $("#ConfirmDelete").removeClass("visible-elem");
      _component.removeEmail(value);
    }).off("click",".cancel-del-item").on("click", ".cancel-del-item" , function() {
      $("#ConfirmDelete").removeClass("visible-elem");
    });

  }

  // this is for processing remove emails
  removeEmail(value: any)
  {
      Global.setLoading();
      //send API request to remove
      this.fileService.removeEmail(this.user.id, value).subscribe(
        response => {
          let temp = response.json();
          if(temp.result != 0) 
          {
            this._zone.run(()=>{
              this.email = temp.result;
              Global.outLoading();
            });
          }
        },
        error => {
         console.log(error);
      });
  }

  saveInfo() {
    let _this = this;
    let firstname = (<HTMLInputElement>document.getElementsByClassName("firstname")[0]).value;
    let lastname = (<HTMLInputElement>document.getElementsByClassName("lastname")[0]).value;
    let email = (<HTMLInputElement>document.getElementsByClassName("email")[0]).value;

    this.fileService.setUserInformation(_this.user.id, firstname, lastname, email).subscribe(
          response => {
            var temp = response.json();
            _this.toastrService.success('Success');
            _this.user = temp.result;
            // change the Global user variable for synchronization
            localStorage.setItem("currentUser", JSON.stringify(temp.result));
            // change the username
            var user_temp = document.getElementsByClassName("adn")[0];
            user_temp.innerHTML = temp.result.firstname + " " + temp.result.lastname;
          },
          error => {
              _this.toastrService.error('Sorry. There is error during process of your request');
          }
      );
  }
}
