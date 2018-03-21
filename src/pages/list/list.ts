import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import {Material} from '../../models/material';
import {Categoria} from '../../models/categoria';
import {DatabaseProvider} from '../../providers/database';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: Material;
  selectedCategory: Categoria;
  items: Observable<Material[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,private db:DatabaseProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.selectedCategory = navParams.get('category');
    if (this.selectedCategory){
        this.items = this.db.getMaterialesFromCategory(this.selectedCategory);
    }else{
        this.items = this.db.getMateriales();
    }

  }
  getItems(ev: { target: { value: string } }) {
    // set val to the value of the searchbar
    let val = ev.target.value;
    var filter = this.items.filter((item:any) => {
        alert("peo");
        console.log(item);
//        return true;
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.ubicacion.toLowerCase().indexOf(val.toLowerCase()) > -1)
    }).subscribe(items=> this.items=items);
//        console.log(items);
    console.log(val);
  }
  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });
  }
}
