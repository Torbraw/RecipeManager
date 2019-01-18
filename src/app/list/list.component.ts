import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {Recetteindex} from '../models/recetteindex';
import {AuthService} from '../services/auth.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
})
export class ListComponent implements OnInit {

  recettes: Recetteindex[] = [];
  recettesAff: Recetteindex[] = [];
  uid;
  p: number = 1;
  recherche;

  constructor(private service: FirebaseService, private auth: AuthService, public translate: TranslateService) { }

  ngOnInit() {
    let obv = this.auth.getUser().subscribe(user => {
      this.uid = user.uid;
      this.populatelist("name","asc");
      obv.unsubscribe();
    });
  }

  hover(s: string){
    let id = "";

    if (s == "name") {
      id = "nameFilter";
    } else {
      id = "starFilter";
    }

    let elem = document.getElementById(id);

    if (!elem.classList.contains("w3-text-pink")) {
      elem.classList.remove("filter");
      elem.classList.add("w3-hover-text-pink")
    } else {
      elem.classList.add("filter")
    }
  }

  filterStar() {
    let dir;

    let elem = document.getElementById("starFilter");
    let elemelse = document.getElementById("nameFilter");

    if (!elem.classList.contains("w3-text-pink")) {
      elemelse.classList.remove("w3-text-pink");
      elem.classList.add("w3-text-pink");
      if (elem.classList.contains("fa-sort-amount-up")) {
        dir = "asc";
      } else {
        dir = "desc";
      }
    } else {
      if (elem.classList.contains("fa-sort-amount-up")) {
        elem.classList.remove("fa-sort-amount-up");
        elem.classList.add("fa-sort-amount-down");
        dir = "desc";
      } else {
        elem.classList.remove("fa-sort-amount-down");
        elem.classList.add("fa-sort-amount-up");
        dir = "asc";
      }
    }
    this.populatelist("nbStar",dir);
  }

  filterName() {
    let dir;

    let elem = document.getElementById("nameFilter");
    let elemelse = document.getElementById("starFilter");

    if (!elem.classList.contains("w3-text-pink")) {
      elemelse.classList.remove("w3-text-pink");
      elem.classList.add("w3-text-pink");
      if (elem.classList.contains("fa-sort-alpha-down")) {
        dir = "asc";
      } else {
        dir = "desc";
      }
    } else {
      if (elem.classList.contains("fa-sort-alpha-up")) {
        elem.classList.remove("fa-sort-alpha-up");
        elem.classList.add("fa-sort-alpha-down");
        dir = "asc";
      } else {
        elem.classList.remove("fa-sort-alpha-down");
        elem.classList.add("fa-sort-alpha-up");
        dir = "desc";
      }
    }
    this.populatelist("name",dir);
  }

  populatelist(field: string, dir: string) {
    let obv = this.service.getRecettes(field, this.uid).subscribe(data => {
      for (let i = 0; i<data.length;i++) {
        this.recettes[i] = new Recetteindex(data[i].name,data[i].nbStar);
      }
      if (field == "name") {
        this.recettes.sort(function (a, b) {
          return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });
        if (!(dir == "asc")) {
          this.recettes.reverse();
        }
      } else if (dir == "desc") {
        this.recettes.reverse();
      }
      this.recettesAff = this.recettes;
      obv.unsubscribe();
    });
  }

  rechercher(){
    this.recettesAff = [];
    let index = 0;
    for (let i = 0; i < this.recettes.length; i ++){
      if (this.recettes[i].name.toLowerCase().indexOf(this.recherche.toLowerCase()) != -1){
        this.recettesAff[index] = this.recettes[i];
        index++;
      }
    }
  }
}
