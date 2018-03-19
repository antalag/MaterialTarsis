import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

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
        private afs: AngularFirestore) {
        this.user = this.afAuth.authState
            .switchMap(user => {
                if (user) {
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
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
                this.updateUserData(credential.user)
            })
    }
    loginWithEmailAndPassword(email: string, password: string) {
        return new Promise((resolve, reject) => {
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then((val: any) => {
                    resolve(val);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }
    private updateUserData(user: User) {
        // Sets user data to firestore on login

        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

        const data: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        }

        return userRef.set(data, {merge: true})

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
