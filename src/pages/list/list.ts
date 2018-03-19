import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import {Material} from '../../models/material';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  selectedItem: any;
  icons: string[];
  itemsCollection: AngularFirestoreCollection<{}>;
  items: Observable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,private afs: AngularFirestore) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.itemsCollection = this.afs.collection('material');
    this.items = this.itemsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Material;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
    console.log(this.items);
    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
      'american-football', 'boat', 'bluetooth', 'build'];

//    this.reloadItems()
  }
  reloadItems() {
//    this.items = this.afDatabase.list('/songs').valueChanges();
//    for (let i = 1; i < 11; i++) {
//      this.items.push({
//        title: 'Item ' + i,
//        note: 'This is item #' + i,
//        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
//      });
//    }
  }
  getItems(ev: { target: { value: string } }) {
    // set val to the value of the searchbar
    let val = ev.target.value;
    console.log(val);

    // if the value is an empty string don't filter the items
//    if (val && val.trim() != '') {
//    this.items = this.items.filter(val)
//    }
  }
  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ListPage, {
      item: item
    });
  }
}
