import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Material} from '../models/material';
import {Categoria} from '../models/categoria';
import {User} from '../models/user';
import {Salida} from '../models/salida';
import * as moment from 'moment';
import {DocumentReference} from '@firebase/firestore-types';
import * as firebase from 'firebase/app';
import {firebaseConfig} from '../app/app.module';
/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class DatabaseProvider {
    private fb2: firebase.app.App;
    constructor(private afs: AngularFirestore) {
        this.fb2 = firebase.initializeApp(firebaseConfig,"secondary");
    }
    getUser(uid) {
        return this.afs.doc<User>(`users/${uid}`).snapshotChanges()
        //            .map(user=>{
        //                const data = user.payload.data() as User;
        //                const id = user.payload.id;
        //                return {id, ...data};
        //        });
    }
    getSalidasMaterial(material) {
        return this.afs.collection('salidas', ref => ref.where("material", "==", material)
            .orderBy("fechaSalida", "desc"))
            .snapshotChanges()
            .map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as Salida;
                    data.user = this.getUser(data.user).map(
                        user => {
                            const id = user.payload.id;
                            let userObj = user.payload.data() as User
                            userObj.id = id;
                            return userObj
                        }
                    )
                    const id = a.payload.doc.id;
                    return {id, ...data};
                })
            })
    }
    public updateUserData(user: User) {
        // Sets user data to firestore on login

        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

        const data: User = {
            id: user.id,
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            cargo: user.cargo,
            rol: user.rol,
            token: user.token
        }

        return userRef.set(data, {merge: true})

    }
    public creteUserIfNotExists(user: User) {
        const userDocRef: DocumentReference = this.afs.firestore.doc(`users/${user.uid}`);
        return userDocRef.get().then(docSnap => {
            if (!docSnap.exists) {
                const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
                const data = {
                    id: user.uid,
                    uid: user.uid,
                    email: user.email,
                    displayName: user.email,
                    photoURL: "",
                    cargo: "scouter",
                    rol: 3
                };
                userRef.set(data, {merge: true});
            }
        })

    }
    public updateMaterialData(material: Material) {
        // Sets user data to firestore on login
        const data = {
            imagen: material.imagen,
            cantidad: material.cantidad,
            nombre: material.nombre,
            ubicacion: material.ubicacion,
            comentarios: material.comentarios,
            categoria: material.categoria
        }
        const materialRef: AngularFirestoreDocument<any> = this.afs.doc(`material/${material.id}`);
        return materialRef.set(data, {merge: true})
    }
    insertMaterial(material: Material) {
        const data = {
            imagen: material.imagen,
            cantidad: material.cantidad,
            nombre: material.nombre,
            ubicacion: material.ubicacion,
            comentarios: material.comentarios,
            categoria: material.categoria
        }
        const materialcollection = this.afs.collection<any>('material');
        return materialcollection.add(data);
    }
    deleteMaterial(material: Material) {
        const materialRef: AngularFirestoreDocument<any> = this.afs.doc(`material/${material.id}`);
        console.log(material.id);
        let batch = this.afs.firestore.batch();
        batch.delete(materialRef.ref);
        return this.afs.collection('salidas').ref.where("material", "==", material.id).get().then(result => {
            result.forEach(doc => {
                console.log(doc);
                batch.delete(doc.ref);
            })
            return batch.commit();
        })
        //        return materialRef.delete();
    }
    public updateCategoriaData(categoria: Categoria) {
        // Sets user data to firestore on login
        const data = {
            image: categoria.image,
            nombre: categoria.nombre,
        }
        const categoRef: AngularFirestoreDocument<any> = this.afs.doc(`categorias/${categoria.id}`);
        return categoRef.set(data, {merge: true})
    }
    insertCategoria(categoria: Categoria) {
        const data = {
            image: categoria.image,
            nombre: categoria.nombre,
        }
        const materialcollection = this.afs.collection<any>('categorias');
        return materialcollection.add(data);
    }
    deleteCategoria(categoria: Categoria) {
        const categoRef: AngularFirestoreDocument<any> = this.afs.doc(`categorias/${categoria.id}`);
        return categoRef.delete();
    }
    getSalidasUser(userId) {
        return this.afs.collection('salidas',
            ref => ref.where('user', '==', userId)).snapshotChanges().map(actions => {
                return actions.map(a => {
                    const data = a.payload.doc.data() as Material;
                    const id = a.payload.doc.id;
                    return {id, ...data};
                });
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
    getMaterial(id) {
        return this.afs.doc<Material>('material/' + id);
    }
    insertSalidaMaterial(material, user, comentarios) {
        return this.afs.collection('salidas').add({
            material: material,
            user: user,
            comentarios: comentarios,
            fechaSalida: moment().toDate()
        })
    }
    insertEntradaMaterial(idSalida, comentarios) {
        return this.afs.doc<Salida>('salidas/' + idSalida).update({
            comentarios: comentarios,
            fechaEntrada: moment().toDate()
        })
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
    getUsers() {
        return this.afs.collection('users').snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as User;
                const id = a.payload.doc.id;
                return {id, ...data};
            });
        });
    }
    deleteUser(user: User) {
        const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.id}`);
        let batch = this.afs.firestore.batch();
        batch.delete(userRef.ref);
        return this.afs.collection('salidas').ref.where("user", "==", user.id).get().then(result => {
            result.forEach(doc => {
                batch.update(doc.ref, {user: user.email});
            })
            return batch.commit();
        })
    }
    insertUser(usuario: {
        id: string,
        uid: string,
        email: string,
        displayName: string,
        photoURL: string,
        cargo: string,
        rol: string,
        token: string,
        password: string
    }) {
        return this.fb2.auth().createUserWithEmailAndPassword(usuario.email, usuario.password).then(
            (result:{uid: string}) => {
                const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${result.uid}`);
                const data = {
                    id: result.uid,
                    uid: result.uid,
                    email: usuario.email,
                    displayName: usuario.displayName,
                    photoURL: "",
                    cargo: usuario.cargo,
                    rol: usuario.rol
                }
                return userRef.set(data, {merge: true})
            }
        ).catch(error=>{
            throw error;
        })
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
