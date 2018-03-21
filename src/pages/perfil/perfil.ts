import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {User} from '../../models/user';
import {AuthProvider} from '../../providers/auth';

/**
 * Generated class for the PerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-perfil',
    templateUrl: 'perfil.html',
})
export class PerfilPage {
    private formPerfil: FormGroup;
    private user: User;
    constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private auth: AuthProvider) {
        this.user = this.navParams.get('user');
            this.formPerfil = this.formBuilder.group({
                displayName: [this.user.displayName, Validators.required],
                email: [this.user.email, Validators.email],
                uid:[this.user.uid],
                cargo: [this.user.cargo],
                rol: [this.user.rol],
                photoURL: [this.user.photoURL],
            });
    }
    logForm(){
        console.log(this.user);
    console.log(this.formPerfil.value)
  }
}
