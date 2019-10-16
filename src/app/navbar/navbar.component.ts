import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {

  constructor(public auth: AuthService, public translate: TranslateService) { }

  ngOnInit() {
  }

  show() {
    const x = document.getElementById('smallNav');
    if (x.className.indexOf('w3-show') === -1) {
      x.className += 'w3-show';
    } else {
      x.className = x.className.replace(' w3-show', '');
    }
  }
}
