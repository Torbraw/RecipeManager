import {Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Ingredient} from '../models/ingredient';
import {DynamicComponent} from '../dynamic/dynamic.component';
import {EditdialogComponent} from '../editdialog/editdialog.component';
import {MatDialog} from '@angular/material';
import swal from "sweetalert2";
import {AuthService} from '../services/auth.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {

  @ViewChild("errIng",{read: ElementRef}) elem: ElementRef;
  @ViewChild("txt",{read: ViewContainerRef}) txt: ViewContainerRef;
  nameRecette = "";
  qte = "";
  type = "";
  types = [];
  ingredient = "";
  preparation = "";
  nbstar = 0;
  list_ingredient = new Map();
  baserecettename = "";
  uid;
  publique;

  constructor(private service: FirebaseService,private route: ActivatedRoute,private factoryResolver: ComponentFactoryResolver,
              public dialog: MatDialog, private router: Router, private auth : AuthService, public translate: TranslateService ) { }

  ngOnInit() {
    this.baserecettename = this.route.snapshot.paramMap.get('recette');
    let obv = this.auth.getUser().subscribe(user => {
      this.uid = user.uid;
      obv.unsubscribe();
      let $observ = this.service.getRecette(this.baserecettename,this.uid).subscribe(data => {
        if (data.length == 0){
          this.router.navigate(['/error'])
        }
        this.publique = data[0].publique;
        this.nameRecette = data[0].name;
        this.clickStar(data[0].nbStar);
        this.preparation = data[0].preparation;
        let tab = data[0].ingredients.split(',');
        for (let i = 0; i < tab.length;i++) {
          let tab1 = tab[i].split(" ");
          this.list_ingredient.set(tab1[2], new Ingredient(tab1[0], tab1[1], tab1[2]));
        }
        this.populatetext();
        $observ.unsubscribe();
      });
      let obv1 = this.service.getTypes().subscribe(data => {
          this.types = data;
          obv1.unsubscribe();
      });
    });
  }

  addingredient(){
    if (this.ingredient == "" || this.qte == "") {
      if (this.translate.getDefaultLang() == 'fr'){
        this.elem.nativeElement.innerText = "Renseigner les champs requis.";
      } else {
        this.elem.nativeElement.innerText = "Fill the required fields.";
      }
    } else {
      if (this.qte == "" || !this.qte.match(/^[0-9 ]*[,/.]{0,1}[0-9]{1,}$/)){
        if (this.translate.getDefaultLang() == 'fr'){
          this.elem.nativeElement.innerText = "Entrer une quantité valide.";
        } else {
          this.elem.nativeElement.innerText = "Enter a valid quantity.";
        }
      } else {
        if (this.list_ingredient.has(this.ingredient)) {
          if (this.translate.getDefaultLang() == 'fr') {
            this.elem.nativeElement.innerText = "Cet ingrédient à déjà été ajouté.";
          } else {
            this.elem.nativeElement.innerText = "This ingredient had already been added.";
          }
        } else {
          this.elem.nativeElement.innerText = "";
          this.list_ingredient.set(this.ingredient.trim(), new Ingredient(this.qte.trim(), this.type, this.ingredient.trim()));
          this.populatetext();
          this.qte = "";
          this.ingredient = "";
          this.type = "";
        }
      }
    }
  }

  populatetext(){
    this.txt.clear();
    for (let entry of this.list_ingredient.values()){
      let factory = this.factoryResolver.resolveComponentFactory(DynamicComponent);
      let component = this.txt.createComponent(factory);
      component.instance.event.subscribe(data => this.deleteingredient(data));
      component.instance.edit.subscribe(data => this.editingredient(data));
      component.instance.ingredient = entry;
    }
  }

  deleteingredient(nom){
    this.list_ingredient.delete(nom);
    this.populatetext();
  }

  editingredient(nom){
    let ing: Ingredient = this.list_ingredient.get(nom);

    let dialogRef = this.dialog.open(EditdialogComponent, {
      data: {
        nom: ing.nom,
        type: ing.type,
        qte: ing.qte,
        types: this.types
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data.nom == "" || data.qte == "") {
        if (this.translate.getDefaultLang() == 'fr'){
          this.elem.nativeElement.innerText = "Impossible de modifier l'ingrédient, possède des champs vides.";
        } else {
          this.elem.nativeElement.innerText = "Cannot modify the ingridient, got empty fields.";
        }
      } else {
        if (data.qte == "" || !data.qte.match(/^[0-9 ]*[,/.]{0,1}[0-9]{1,}$/)) {
          if (this.translate.getDefaultLang() == 'fr') {
            this.elem.nativeElement.innerText = "Impossible de modifier l'ingrédient, quantité invalide.";
          } else {
            this.elem.nativeElement.innerText = "Cannot modify the ingridient, invalid quantity.";
          }
        } else {
          if (this.list_ingredient.has(data.nom) && data.nom != nom) {
            if (this.translate.getDefaultLang() == 'fr') {
              this.elem.nativeElement.innerText = "Un ingrédient possède déjà ce nom, impossible de le modifier.";
            } else {
              this.elem.nativeElement.innerText = "An ingredient already has that name, cannot modify it.";
            }
          } else {
            this.elem.nativeElement.innerText = "";
            if (data.nom != nom) {
              this.list_ingredient.delete(nom);
            }
            let ingredient: Ingredient = new Ingredient(data.qte.trim(), data.type, data.nom.trim());
            this.list_ingredient.set(data.nom, ingredient);
            this.populatetext();
          }
        }
      }
    })
  }

  clickStar(pos: number) {
    if (pos == this.nbstar) {
      this.nbstar = 0;
      for (let i = 1; i <= 5; i++) {
        let elementid = "star" + i;
        let elem = document.getElementById(elementid);
        if (elem.classList.contains("fas")) {
          elem.classList.remove("fas");
          elem.classList.add("far")
        }
      }
    } else {
      this.nbstar = pos;

      if (document.getElementById("star"+pos).classList.contains("fas")) {
        for (let i = pos+1; i <= 5; i++) {
          let elementid = "star" + i;
          let elem = document.getElementById(elementid);
          if (elem.classList.contains("fas")) {
            elem.classList.remove("fas");
            elem.classList.add("far")
          }
        }
      } else {
        for (let i = 1; i <= this.nbstar; i++) {
          let elementid = "star" + i;
          let elem = document.getElementById(elementid);
          if (elem.classList.contains("far")) {
            elem.classList.remove("far");
            elem.classList.add("fas")
          }
        }
      }
    }
  }

  editRecette(){
    if (this.nameRecette == "" || this.preparation == "" || this.list_ingredient.size == 0) {
      if (this.translate.getDefaultLang() == 'fr') {
        swal({
          type: 'error',
          title: 'Impossible de modifier la recette.',
          text: 'Veuillez renseigner tous les champs.',
          confirmButtonClass: 'w3-button w3-pink w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
        });
      } else {
        swal({
          type: 'error',
          title: 'Cannot modify the recipe.',
          text: 'Please fill all the required fields.',
          confirmButtonClass: 'w3-button w3-pink w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
        });
      }
    } else {
      let $observ = this.service.getRecette(this.nameRecette,this.uid).subscribe(data => {
         if (data.length != 0 && data[0].name != this.baserecettename) {
           if (this.translate.getDefaultLang() == 'fr') {
             swal({
               type: 'error',
               title: 'Impossible de modifier la recette',
               text: 'Une autre recette porte déjà ce nom.',
               confirmButtonClass: 'w3-button w3-pink w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
             });
           } else {
             swal({
               type: 'error',
               title: 'Cannot modify the recipe.',
               text: 'Another recipe already has that name.',
               confirmButtonClass: 'w3-button w3-pink w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
             });
           }
        } else {
          this.service.editRecetteBd(this.baserecettename,this.nameRecette.trim(),this.nbstar,this.preparation.trim(),this.list_ingredient,this.uid,this.publique);
           if (this.translate.getDefaultLang() == 'fr') {
             swal({
               title: 'La recette à bien été modifié',
               type: 'info',
               width: 600,
               focusCancel: true,
               confirmButtonClass: 'w3-button w3-pink w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
               confirmButtonText: 'Ok',
               showCancelButton: false,
             }).then((result) => {
               if (result.value) {
                 this.router.navigate(['/index']);
               }
             });
           } else {
             swal({
               title: 'The recipe have been modified.',
               type: 'info',
               width: 600,
               focusCancel: true,
               confirmButtonClass: 'w3-button w3-pink w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
               confirmButtonText: 'Ok',
               showCancelButton: false,
             }).then((result) => {
               if (result.value) {
                 this.router.navigate(['/index']);
               }
             });
           }
          $observ.unsubscribe();
         }
      });
    }
  }
}
