import { Component } from '@angular/core';
import { ProgressHttp } from "angular-progress-http";
import * as NProgress from 'nprogress';
import * as global from './provider/globals';

declare var jquery:any;
declare var $:any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
   constructor(private http: ProgressHttp) {
		/*const form = new FormData();
		form.append("data", "someValue or file");
		// set Progress
		global.setApp();
		global.setLoading();
        NProgress.start();
        alert("end");
		this.http
		.withUploadProgressListener(progress => { 
			// Buffering time
			setTimeout(
			  function() 
			  {
			    //do something special
			    NProgress.done();
			    $("app-root").show();
				$(".loading").hide();
				// log the debugs
			    console.log(`Uploading ${progress.percentage}%`);
			  }, 500);
		})
		.withDownloadProgressListener(progress => { console.log(`Downloading ${progress.percentage}%`); })
		.post("/", form)
		.subscribe((response) => {
		    console.log(response)
		})*/
    }
}
