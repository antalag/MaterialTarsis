import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {User} from '../../models/user';
import {DatabaseProvider} from '../../providers/database';
import {UtilsProvider} from '../../providers/utils';

/**
 * Generated class for the FormUsuariosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-form-usuarios',
  templateUrl: 'form-usuarios.html',
})
export class FormUsuariosPage {

    private formUser: FormGroup;
    private user: any;
    private title: string;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private formBuilder: FormBuilder,
        private db: DatabaseProvider,
        public viewCtrl: ViewController,
        private utils: UtilsProvider
    ) {
        if (this.navParams.get('user')) {
            this.user = this.navParams.get('user');
            this.title = "Editar usuario";
        } else {
            const data = {
                id: null,
                uid: null,
                email: null,
                displayName: null,
                photoURL: null,
                cargo:null,
                rol:null,
                token:null,
                password:null
            }
            this.user = data;
            this.title = "Añadir usuario";
        }
        let group:any={
            displayName: [this.user.displayName, Validators.required],
            email: [this.user.email, Validators.email],
            id: [this.user.id],
            uid: [this.user.uid],
            cargo: [this.user.cargo ? this.user.cargo : 'scouter'],
            rol: [this.user.rol ? this.user.rol : 3],
            token: [this.user.token],
            photoURL: [this.user.photoURL],
        };
        if (!this.navParams.get('user')) {
            group.password = [this.user.password, [Validators.required, , Validators.minLength(6)]]
        }
        this.formUser = this.formBuilder.group(group);
    }
    sendForm() {
            if (this.user.id) {
            var user = this.formUser.value as User;
                this.db.updateUserData(user).then(result => {
                    this.utils.showToast("Usuario guardado");
                    this.viewCtrl.dismiss();
                }).catch(error => {
                    this.utils.showToast("Ha ocurrido un error, compruebe los campos e intentelo de nuevo");
                })
            } else {
                var data = this.formUser.value;
                this.db.insertUser(data).then(() => {
                    this.utils.showToast("Usuario insertado");
                    this.viewCtrl.dismiss();
                }).catch(error=>{
                    this.utils.showToast("Error: "+error.message);
                })
            }
        }
    dismiss() {
        this.viewCtrl.dismiss();
    }

}
