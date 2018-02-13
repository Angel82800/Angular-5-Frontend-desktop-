import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../../../provider/service/file-upload.service';
import { ToastrService } from 'ngx-toastr';

import * as Global from '../../../provider/globals';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  loadAPI: Promise<any>;
  user: any = [];
  email: any = [];
  constructor(private fileService: FileUploadService, private toastrService: ToastrService) {
    this.user = Global.getUser();
  }

  ngOnInit() {
    
  }
}
