import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {Ingredient} from '../models/ingredient';
import {FirebaseService} from '../services/firebase.service';
import {DynamicComponent} from '../dynamic/dynamic.component';
import {NavigationEnd, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {EditdialogComponent} from '../editdialog/editdialog.component';
import swal from "sweetalert2";
import {AuthService} from '../services/auth.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  outputs: ['event'],
})

export class CreateComponent implements OnInit, AfterViewInit, OnDestroy  {

  navigationSubscription;
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
  uid;

  constructor(private service: FirebaseService,private factoryResolver: ComponentFactoryResolver,private router: Router, public dialog: MatDialog,
              private auth: AuthService, public translate: TranslateService) {
    let obv = this.auth.getUser().subscribe(user => {
      this.uid = user.uid;
      obv.unsubscribe();
    });
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  initialiseInvites() {
    this.txt.clear();
    this.nameRecette = "";
    this.preparation = "";
    this.clickStar(this.nbstar);
    this.nbstar = 0;
    this.list_ingredient.clear();
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.service.getTypes().subscribe(data => {
      this.types = data;
    });
  }

  ngAfterViewInit(): void {
  }

  addRecette() {
    if (this.nameRecette == "" || this.preparation == "" || this.list_ingredient.size == 0) {
      if (this.translate.getDefaultLang() == 'fr') {
        swal({
          type: 'error',
          title: 'Impossible d\'ajouter la recette.',
          text: 'Veuillez renseigner tous les champs.',
          confirmButtonClass: 'w3-button w3-pink w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
        });
      } else {
        swal({
          type: 'error',
          title: 'Cannot add the recipe.',
          text: 'Please fill all the required fields.',
          confirmButtonClass: 'w3-button w3-pink w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
        });
      }
    } else {
      let $observ = this.service.getRecette(this.nameRecette,this.uid).subscribe(data => {
        if (data.length != 0) {
          if (this.translate.getDefaultLang() == 'fr') {
            swal({
              type: 'error',
              title: 'Impossible d\'ajouter la recette',
              text: 'Une autre recette porte déjà ce nom.',
              confirmButtonClass: 'w3-button w3-pink w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
            });
          } else {
            swal({
              type: 'error',
              title: 'Cannot add the recipe.',
              text: 'Another recipe already has that name.',
              confirmButtonClass: 'w3-button w3-pink w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
            });
          }
        } else {
          this.service.addRecetteBd(this.nameRecette.trim(),this.nbstar,this.preparation.trim(),this.list_ingredient,this.uid);
          if (this.translate.getDefaultLang() == 'fr') {
            swal({
              title: 'La recette à bien été ajouté',
              text: "Souhaitez-vous ajouté une autre recette ou revenir à la liste des recettes?",
              type: 'info',
              width: 800,
              focusCancel: true,
              showCancelButton: true,
              confirmButtonClass: 'w3-button w3-pink w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
              cancelButtonClass: 'w3-button w3-pink w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
              confirmButtonText: 'Ajouter une autre recette',
              cancelButtonText: 'Revenir à la liste des recettes'
            }).then((result) => {
              if (result.value) {
                this.router.navigate(['/create']);
              } else if (result.dismiss === swal.DismissReason.cancel) {
                this.router.navigate(['/index']);
              }
            });
          } else {
            swal({
              title: 'The recipe have been added.',
              text: "Do you want to add anoter recipe or go back to the recipe list?",
              type: 'info',
              width: 800,
              focusCancel: true,
              showCancelButton: true,
              confirmButtonClass: 'w3-button w3-pink w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
              cancelButtonClass: 'w3-button w3-pink w3-hover-text-pink w3-hover-white w3-border w3-margin l6',
              confirmButtonText: 'Add another recipe',
              cancelButtonText: 'Go back to the recipe list'
            }).then((result) => {
              if (result.value) {
                this.router.navigate(['/create']);
              } else if (result.dismiss === swal.DismissReason.cancel) {
                this.router.navigate(['/index']);
              }
            });
          }
          $observ.unsubscribe();
        }
      });
    }
  }

  addingredient(){
    if (this.ingredient == "" || this.qte == "") {
      if (this.translate.getDefaultLang() == 'fr'){
        this.elem.nativeElement.innerText = "Renseigner les champs requis.";
      } else {
        this.elem.nativeElement.innerText = "Fill the required fields.";
      }
    } else {
      if (this.qte == "" || !this.qte.match(/^[0-9]*[,/.]{0,1}[0-9]{1,}$/)){
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
          this.list_ingredient.set(this.ingredient.trim(), new Ingredient(this.qte, this.type, this.ingredient.trim()));
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
        if (data.qte == "" || !data.qte.match(/^[0-9]*[,/.]{0,1}[0-9]{1,}$/)) {
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
            let ingredient: Ingredient = new Ingredient(data.qte, data.type, data.nom.trim());
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
}
