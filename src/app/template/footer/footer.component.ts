import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute }  from '@angular/router';

declare var jquery:any;
declare var $:any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private router: Router, 
    private route: ActivatedRoute) { }

  ngOnInit() {
  }

      // navigate page
    navigate(url) {
        $("#SignupBox").modal('hide');
        this.router.navigate(['/'+url]);
    }

}
