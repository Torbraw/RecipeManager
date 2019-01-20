import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  v = false;
  cookie = true;

  constructor(public auth: AuthService, public translate: TranslateService, private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("cookie") != null){
      this.cookie = false;
    }
    let obv = this.auth.user$.subscribe(user => {
      if (user != null){
        this.router.navigate(['/index'])
      }
      obv.unsubscribe();
    });
  }
  closeCookie(){
    this.v = true;
    localStorage.setItem("cookie","true");
  }

}
