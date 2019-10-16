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
  href = 'https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=fr';

  constructor(public auth: AuthService, public translate: TranslateService, private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('cookie') != null) {
      this.cookie = false;
    }
    const obv = this.auth.user$.subscribe(user => {
      if (user != null) {
        this.router.navigate(['/index']);
      }
      obv.unsubscribe();
    });
  }
  closeCookie() {
    this.v = true;
    localStorage.setItem('cookie', 'true');
  }
  lang() {
    if (this.translate.getDefaultLang() === 'fr') {
      this.href = 'https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=en';
      this.translate.setDefaultLang('en');
    } else {
      this.href = 'https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=fr';
      this.translate.setDefaultLang('fr');
    }
  }

}
