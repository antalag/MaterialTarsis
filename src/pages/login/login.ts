import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AuthProvider} from '../../providers/auth';
import {HomePage} from '../home/home';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    public form: FormGroup;
    constructor(public navCtrl: NavController,
        private _FB: FormBuilder,
        private _AUTH: AuthProvider) {
        this.form = this._FB.group({
            'email': ['', Validators.required],
            'password': ['', Validators.required]
        });
    }

    logInUserPass(): void {
        let email: any = this.form.controls['email'].value,
            password: any = this.form.controls['password'].value;

        this._AUTH.loginWithEmailAndPassword(email, password)
            .then((auth: any) => {
                this.navCtrl.setRoot(HomePage);
            })
            .catch((error: any) => {
                console.log(error.message);
            });
    }
    loginGoogle(): void {
        this._AUTH.googleLogin()
            .then((auth: any) => {
                this.navCtrl.setRoot(HomePage);
            })
            .catch((error: any) => {
                console.log(error.message);
            });
    }

}
