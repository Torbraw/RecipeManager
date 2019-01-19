import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
})
export class ErrorComponent implements OnInit {

  y;
  constructor(public translate: TranslateService) { }

  ngOnInit() {
    let d = new Date();
    this.y = d.getFullYear();
  }

}
