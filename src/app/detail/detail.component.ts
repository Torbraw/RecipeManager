import {Component, OnInit} from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import swal from "sweetalert2";
import {AuthService} from '../services/auth.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit {
  nameRecette = "";
  preparation = "";
  nbstar = 0;
  list_ingredient = [];
  uid;

  constructor(private service: FirebaseService,private route: ActivatedRoute, private dialog: MatDialog,public router: Router, private auth: AuthService, public translate: TranslateService) { }

  ngOnInit() {
    const recettename = this.route.snapshot.paramMap.get('recette');
    let obv = this.auth.getUser().subscribe(user => {
      this.uid = user.uid;
      obv.unsubscribe();
      let $observ = this.service.getRecette(recettename,this.uid).subscribe(data => {
        if (data.length == 0){
          this.router.navigate(['/error'])
        }
        this.nameRecette = data[0].name;
        this.nbstar = data[0].nbStar;
        this.preparation = data[0].preparation;
        let tab = data[0].ingredients.split(',');
        for (let i = 0; i < tab.length;i++) {
          this.list_ingredient[i] = tab[i];
        }
        $observ.unsubscribe();
      });
    });
  }

  supp() {
    if (this.translate.getDefaultLang() == "fr") {
      swal({
        title: 'Attention',
        text: "Êtes-vous sûr de vouloir supprimer la recette " + this.nameRecette + " ?",
        type: 'warning',
        width: 800,
        focusCancel: true,
        showCancelButton: true,
        confirmButtonClass: 'w3-button w3-red w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
        cancelButtonClass: 'w3-button w3-green w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
        confirmButtonText: 'Supprimer la recette',
        cancelButtonText: 'Ne pas supprimer la recette'
      }).then((result) => {
        if (result.value) {
          this.service.suppRecette(this.nameRecette,this.uid);
          this.router.navigate(['/index']);
        }
      })
    } else {
      swal({
        title: 'Warning',
        text: "Do you realy want to delete the recipe " + this.nameRecette + " ?",
        type: 'warning',
        width: 800,
        focusCancel: true,
        showCancelButton: true,
        confirmButtonClass: 'w3-button w3-red w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
        cancelButtonClass: 'w3-button w3-green w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
        confirmButtonText: 'Delete the recipe',
        cancelButtonText: 'Don\'t delete the recipe'
      }).then((result) => {
        if (result.value) {
          this.service.suppRecette(this.nameRecette,this.uid);
          this.router.navigate(['/index']);
        }
      })
    }

  }
}
