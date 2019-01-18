import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  constructor(public auth: AuthService, public translate: TranslateService, private router: Router) { }

  ngOnInit() {
    let obv = this.auth.user$.subscribe(user => {
      if (user != null){
        this.router.navigate(['/index'])
      }
      obv.unsubscribe();
    });
  }

}
