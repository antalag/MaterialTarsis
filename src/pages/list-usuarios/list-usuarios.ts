import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import {User} from '../../models/user';
import {Observable} from 'rxjs/Observable';
import {DatabaseProvider} from '../../providers/database';
import {UtilsProvider} from '../../providers/utils';
import {FormUsuariosPage} from '../form-usuarios/form-usuarios';

/**
 * Generated class for the ListUsuariosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-list-usuarios',
  templateUrl: 'list-usuarios.html',
})
export class ListUsuariosPage {

  items: Observable<User[]>;
    constructor(public navCtrl: NavController,
        private alrt: AlertController,
        public navParams: NavParams,
        private db: DatabaseProvider,
        private utils: UtilsProvider,
        public modalCtrl: ModalController) {
        this.items = this.db.getUsers();
    }

    deleteUser(user) {
        let alert = this.alrt.create({
            title: "Confirmar borrado",
            message: "¿Estas seguro que deseas borrar este usuario?",
            buttons: [
                {
                    text: "cancelar"
                },
                {
                    text: "confirmar",
                    handler: () => {
                        this.db.deleteUser(user).then(result => {
                            this.utils.showToast("usuario eliminado");
                        })
                    }
                }
            ]
        });
        alert.present();
    }
    editUsuario(user) {
        let modal = this.modalCtrl.create(FormUsuariosPage, {user: user});
        modal.present();
    }
    insertUsuario() {
        let modal = this.modalCtrl.create(FormUsuariosPage);
        modal.present();
    }

}
