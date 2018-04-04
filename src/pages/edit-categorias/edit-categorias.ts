import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, ModalController} from 'ionic-angular';
import {DatabaseProvider} from '../../providers/database';
import {Categoria} from '../../models/categoria';
import {Observable} from 'rxjs/Observable';
import {FormCategoriaPage} from '../form-categoria/form-categoria';
import {UtilsProvider} from '../../providers/utils';

/**
 * Generated class for the EditCategoriasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-edit-categorias',
    templateUrl: 'edit-categorias.html',
})
export class EditCategoriasPage {
    items: Observable<Categoria[]>;
    constructor(public navCtrl: NavController,
        private alrt: AlertController,
        public navParams: NavParams,
        private db: DatabaseProvider,
        private utils: UtilsProvider,
        public modalCtrl: ModalController) {
        this.items = this.db.getCategories();
    }

    deleteCat(cat) {
        let alert = this.alrt.create({
            title: "Confirmar borrado",
            message: "Estas seguro que deseas borrar esta categoría",
            buttons: [
                {
                    text: "cancelar"
                },
                {
                    text: "confirmar",
                    handler: () => {
                        this.db.deleteCategoria(cat).then(result => {
                            this.utils.showToast("categoría eliminada");
                        })
                    }
                }
            ]
        });
        alert.present();
    }
    editCategoria(cat) {
        let modal = this.modalCtrl.create(FormCategoriaPage, {catego: cat});
        modal.present();
    }
    insertCategoria() {
        let modal = this.modalCtrl.create(FormCategoriaPage);
        modal.present();
    }

}
