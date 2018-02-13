import { Component, OnInit } from '@angular/core';
import { Form } from '@angular/forms';
import { Router } from '@angular/router';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as Global from '../../provider/globals';

import 'rxjs/add/operator/map';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  loadAPI: Promise<any>;
  constructor(private http: Http) { }

  ngOnInit() {
    this.loadAPI = new Promise((resolve) => {
        console.log('resolving promise');
        Global.loadScript();
    });
  }

  fileUpload(event) {
    let filelist: FileList = event.target.files;
    if(filelist.length >0 ){
      let file: File = filelist[0];
      let formData: FormData = new FormData();
      formData.append('photo', file, file.name);
      this.http.post('/upload', formData)
        .map(res => res.json())
        .subscribe(
          data => console.log(data),
          error => console.log(error)
        )
    }
  }
}
