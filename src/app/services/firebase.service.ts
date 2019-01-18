import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Ingredient} from '../models/ingredient';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  db: AngularFirestore;

  constructor(db: AngularFirestore, private translate: TranslateService) {
    this.db = db;
  }

  getTypes(): Observable<any> {
    let types: Observable<any>;
    if (this.translate.getDefaultLang() == "fr") {
      types = this.db.collection("Type", ref => {
        return ref.orderBy('name')
      }).valueChanges();
    } else {
      types = this.db.collection("TypeEng", ref => {
        return ref.orderBy('name')
      }).valueChanges();
    }
    return types;
  }

  addRecetteBd(name: string, nbStar: number, prep: string, map: Map<string,Ingredient>, uid: string) {
    let ing = "";

    for (let entry of map.values()){
      if (ing == "") {
        ing += entry.qte + " " + entry.type + " " + entry.nom
      } else {
        ing += "," + entry.qte + " " + entry.type + " " + entry.nom
      }
    }

    this.db.doc(`User/${uid}`).collection("Recette").doc(name).set({
      name: name,
      nbStar: nbStar,
      preparation: prep,
      ingredients: ing,
    });
  }

  editRecetteBd(basename: string,name: string, nbStar: number, prep: string, map: Map<string,Ingredient>, uid: string){
    this.db.doc(`User/${uid}`).collection("Recette").doc(basename).delete();
    let ing = "";

    for (let entry of map.values()){
      if (ing == "") {
        ing += entry.qte + " " + entry.type + " " + entry.nom
      } else {
        ing += "," + entry.qte + " " + entry.type + " " + entry.nom
      }
    }

    this.db.doc(`User/${uid}`).collection("Recette").doc(name).set({
      name: name,
      nbStar: nbStar,
      preparation: prep,
      ingredients: ing,
    });
  }

  getRecettes(field: any, uid: string): Observable<any> {
    let types: Observable<any>;
    types = this.db.doc(`User/${uid}`).collection("Recette", ref => {
      return ref.orderBy(field)
    }).valueChanges();
    return types;
  }

  getRecette(name: string, uid: string): Observable<any> {
    return this.db.doc(`User/${uid}`).collection("Recette",ref => {
      return ref.where('name', '==',name)
    }).valueChanges();
  }

  suppRecette(name: string, uid: string){
    this.db.doc(`User/${uid}`).collection("Recette").doc(name).delete();
  }
}
