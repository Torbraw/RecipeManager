import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-detailpublique',
  templateUrl: './detailpublique.component.html',
})
export class DetailpubliqueComponent implements OnInit {

  nameRecette = "";
  preparation = "";
  nbstar = 0;
  list_ingredient = [];
  list_qte = [];
  uid;

  constructor(private service: FirebaseService,private route: ActivatedRoute, private dialog: MatDialog, private data: DataService,
              public router: Router, public translate: TranslateService) { }

  ngOnInit() {
    const recettename = this.route.snapshot.paramMap.get('recette');
    this.data.currentMessage.subscribe(user => {
      this.uid = user;
      let obv = this.service.getRecette(recettename,this.uid).subscribe(data => {
        if (data.length == 0){
          this.router.navigate(['/error'])
        }
        this.nameRecette = data[0].name;
        this.nbstar = data[0].nbStar;
        this.preparation = data[0].preparation;
        let tab = data[0].ingredients.split(',');
        for (let i = 0; i < tab.length;i++) {
          let tab1 = tab[i].split(" ");
          if (tab1.length > 3){
            this.list_qte[i] = tab1[0] + " " + tab1[1] + " " + tab1[2] + " " + tab1[3] + " " + tab1[4];
            this.list_ingredient[i] = tab1[5];
          } else if(tab1.length < 3){

          } else {
            this.list_qte[i] = tab1[0] + tab1[1];
            this.list_ingredient[i] = tab1[2];
          }
        }
        obv.unsubscribe();
      });
    });
  }

}
