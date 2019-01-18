import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Ingredient} from '../models/ingredient';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
})
export class DynamicComponent implements OnInit {

  @Input() ingredient: Ingredient;
  @Output() event = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit() {
  }

  send(nom: string){
    this.event.emit(nom);
  }
  sendedit(nom: string) {
    this.edit.emit(nom);
  }
}
