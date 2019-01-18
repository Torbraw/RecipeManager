import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-editdialog',
  templateUrl: './editdialog.component.html',
})
export class EditdialogComponent implements OnInit {

  nom;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.nom = data.nom;
  }

  ngOnInit() {
  }

}
