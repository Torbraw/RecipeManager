import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {AuthService} from '../services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {DataService} from '../services/data.service';
import {Recetteindexpublique} from '../models/recetteindexpublique';

@Component({
  selector: 'app-listpublique',
  templateUrl: './listpublique.component.html',
})
export class ListpubliqueComponent implements OnInit {

  recettes: Recetteindexpublique[] = [];
  recettesAff: Recetteindexpublique[] = [];
  p = 1;
  recherche;

  constructor(private service: FirebaseService, private auth: AuthService, public translate: TranslateService,
              private router: Router, private data: DataService) { }

  ngOnInit() {
    const obv = this.auth.getUser().subscribe(user => {
      this.populatelist('nbStar');
      obv.unsubscribe();
    });
  }

  detail(name: string, uid: string) {
    this.data.changeMessage(uid);
    this.router.navigate(['detailpublic', name]);
  }

  populatelist(field: string, ) {
    const obv = this.service.getAllUsers().subscribe(data => {
      for (let ii = 0; ii < data.length; ii++) {
        const obvv = this.service.getRecettes(field, data[ii].uid).subscribe(r => {
          for (let i = 0; i < r.length; i++) {
            if (r[i].publique === true) {
              this.recettes[this.recettes.length] = new Recetteindexpublique(r[i].name, r[i].nbStar, data[ii].uid);
            }
          }
          this.recettesAff = this.recettes;
          obvv.unsubscribe();
        });
      }
      obv.unsubscribe();
    });
  }

  rechercher() {
    this.recettesAff = [];
    let index = 0;
    for (let i = 0; i < this.recettes.length; i ++) {
      if (this.recettes[i].name.toLowerCase().indexOf(this.recherche.toLowerCase()) !== -1) {
        this.recettesAff[index] = this.recettes[i];
        index++;
      }
    }
  }
}
