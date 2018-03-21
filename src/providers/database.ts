import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {Material} from '../models/material';
import {Categoria} from '../models/categoria';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
    constructor(private afs: AngularFirestore) {
    }
    getMateriales() {
        return this.afs.collection('material').snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as Material;
                const id = a.payload.doc.id;
                return {id, ...data};
            });
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
    getMaterialesFromCategory(category) {
        var categoria= this.afs.doc<Categoria>('categorias/'+category);
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
