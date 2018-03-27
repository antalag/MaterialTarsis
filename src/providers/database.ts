import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Material} from '../models/material';
import {Categoria} from '../models/categoria';
import {User} from '../models/user';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
    constructor(private afs: AngularFirestore) {
    }
    getUser(uid){
        return this.afs.doc<User>(`users/${uid}`).valueChanges()
//            .map(user=>{
//                const data = user.payload.data() as User;
//                const id = user.payload.id;
//                return {id, ...data};
//        });
    }
    public updateUserData(user: User) {
        // Sets user data to firestore on login

        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

        const data: User = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            cargo: user.cargo,
            rol: user.rol
        }

        return userRef.set(data, {merge: true})

    }
    getMateriales(filter?: string) {
        if (filter) {
            return this.afs.collection('material').snapshotChanges().map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as Material;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                }).filter(item => {
                    if ((item.nombre.toLowerCase().indexOf(filter.toLowerCase()) > -1 || item.ubicacion.toLowerCase().indexOf(filter.toLowerCase()) > -1)) {
                        return true;
                    }
                });
            });
        } else {
            return this.afs.collection('material').snapshotChanges().map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as Material;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                });
            });
        }
    }
    getMaterial(id){
        return this.afs.doc<Material>('material/'+id);
    }
    insertSalidaMaterial(id,user:User){
        return this.afs.doc<Material>('material/' + id).collection('salidas').add({
            usuario: user.uid,
            fechaSalida:new Date()
        });
    }
    getCategories() {
        return this.afs.collection('categorias').snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as Categoria;
                const id = a.payload.doc.id;
                return {id, ...data};
            });
        });
    }
    getMaterialesFromCategory(category, filter?: string) {
        if (filter) {
            return this.afs.collection('material', ref => ref.where("categoria", "==", category))
                .snapshotChanges().map(actions => {
                    return actions.map(a => {
                        const data = a.payload.doc.data() as Material;
                        const id = a.payload.doc.id;
                        return {id, ...data};
                    }).filter(item => {
                        if ((item.nombre.toLowerCase().indexOf(filter.toLowerCase()) > -1 || item.ubicacion.toLowerCase().indexOf(filter.toLowerCase()) > -1)) {
                            return true;
                        }
                    });
                });
        } else {
            return this.afs.collection('material', ref => ref.where("categoria", "==", category))
                .snapshotChanges().map(actions => {
                    return actions.map(a => {
                        const data = a.payload.doc.data() as Material;
                        const id = a.payload.doc.id;
                        return {id, ...data};
                    });
                });
        }
    }

}
