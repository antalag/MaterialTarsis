import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {DatabaseProvider} from './database';
import {UtilsProvider} from './utils';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import {User} from '../models/user';

/*
  Generated class for the CoreAuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
    user: Observable<User>;
    constructor(private afAuth: AngularFireAuth,
        private db:DatabaseProvider,
        private utils:UtilsProvider) {
        this.afAuth.auth.getRedirectResult().then(result=> {
            if (result.credential) {
                if(!this.db.getUser(result.user.uid)){
                    this.db.updateUserData(result.user)
                }
            }
        }).catch(error=> {
            this.utils.showToast("Ha ocurrido un error, comprueba los campos e intentalo de nuevo más tarde");
        });
        this.user = this.afAuth.authState
            .switchMap(user => {
                if (user) {
                    return this.db.getUser(user.uid);
                } else {
                    return Observable.of(null)
                }
            })
    }
    googleLogin() {
        const provider = new firebase.auth.GoogleAuthProvider()
        return this.oAuthLogin(provider);
    }
    private oAuthLogin(provider) {
        return this.afAuth.auth.signInWithRedirect(provider)
            .then((credential) => {
                this.db.updateUserData(credential.user)
            })
    }
    loginWithEmailAndPassword(email: string, password: string) {
        return new Promise((resolve, reject) => {
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then((val: User) => {
//                    this.updateUserData(val);
                    if(!this.db.getUser(val.uid)){
                        this.db.updateUserData(val)
                    }
                    resolve(val);
                })
                .catch((error: any) => {
                    this.utils.showToast("Ha ocurrido un error, comprueba los campos e intentalo de nuevo más tarde");
                    reject(error);
                });
        });
    }
    


    signOut() {
        return new Promise((resolve, reject) => {
            this.afAuth.auth.signOut().then(() => {
                resolve(true);
            }).catch((error: any) => {
                reject(error);
            });
        })

    }
}
