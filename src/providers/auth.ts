import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {DatabaseProvider} from './database';
import {UtilsProvider} from './utils';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import {User} from '../models/user';
import {Action} from 'angularfire2/firestore';
import {DocumentSnapshot} from '@firebase/firestore-types';

/*
  Generated class for the CoreAuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
    user: Observable<Action<DocumentSnapshot>>;
    constructor(private afAuth: AngularFireAuth,
        private db: DatabaseProvider,
        private utils: UtilsProvider) {
        this.afAuth.auth.getRedirectResult().then(result => {
            if (result.credential) {
                this.db.creteUserIfNotExists(result.user)
                this.user = this.db.getUser(result.user.uid);
            }
        }).catch(error => {
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
            .then((S) => {
                this.afAuth.auth.getRedirectResult().then(result => {
                    if (result.credential) {
                        this.db.creteUserIfNotExists(result.user).then(
                            () => {
                                this.user = this.afAuth.authState
                                    .switchMap(user => {
                                        console.log(user);
                                        if (user) {
                                            return this.db.getUser(user.uid);
                                        } else {
                                            return Observable.of(null)
                                        }
                                    })
                            }
                        )
                    }
                })
            }).catch(function (error) {
                console.log(error);
                // Handle Errors here.
                //                var errorCode = error.code;
                //                var errorMessage = error.message;
            });

    }
    loginWithEmailAndPassword(email: string, password: string) {
        return new Promise((resolve, reject) => {
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then((val: User) => {
                    //                    this.updateUserData(val);
                    this.db.creteUserIfNotExists(val)
                    this.user = this.db.getUser(val.uid);
                    resolve(val);
                })
                .catch((error: any) => {
                    this.utils.showToast("Ha ocurrido un error, comprueba los campos e intentalo de nuevo más tarde");
                    reject(error);
                });
        });
    }

    getUser() {
        return this.afAuth.authState
            .switchMap(user => {
                if (user) {
                    return this.db.getUser(user.uid);
                } else {
                    return Observable.of(null)
                }
            })
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
