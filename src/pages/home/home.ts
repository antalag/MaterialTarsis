import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DatabaseProvider} from '../../providers/database';
import {Categoria} from '../../models/categoria';
import {Observable} from 'rxjs/Observable';
import {ListPage} from '../list/list';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    selectedItem: Categoria;
    items: Observable<Categoria[]>;
    constructor(public navCtrl: NavController, private db: DatabaseProvider) {
        this.items = this.db.getCategories();
        console.log(this.items);
    }
    goToCategorie(cat: Categoria){
        this.navCtrl.push(ListPage, {category: cat.nombre})
    }

}
