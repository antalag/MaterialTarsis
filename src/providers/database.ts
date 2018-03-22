import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
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
        return this.afs.doc<User>(`users/${uid}`).snapshotChanges().map(user=>{
                const data = user.payload.data() as User;
                const id = user.payload.id;
                return {id, ...data};
        });
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
