import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestoreDocument } from 'angularfire2/firestore';
import { Material } from '../../models/material'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/reduce';
import { AlertController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database';
import { AuthProvider } from '../../providers/auth';
import { User } from '../../models/user';
import { EditMaterialPage } from '../edit-material/edit-material';
import { Salida } from '../../models/salida';
import {UtilsProvider} from '../../providers/utils';

/**
 * Generated class for the DetalleMaterialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-detalle-material',
    templateUrl: 'detalle-material.html',
})
export class DetalleMaterialPage {
    private materialDoc: AngularFirestoreDocument<Material>;
    private material: Observable<Material>;
    private salidas: Observable<Salida[]>;
    private salidaADevolver: Salida;
    private esDevolvible: Observable<Observable<boolean>> = Observable.of(Observable.of(false));
    private esSacable: Observable<boolean> = Observable.of(false);
    private esEditable: Observable<boolean> = Observable.of(false);
    constructor(public navCtrl: NavController, 
        public navParams: NavParams, 
        private db: DatabaseProvider, 
        private auth: AuthProvider, 
        private utils:UtilsProvider,
        private alert: AlertController) {
    }
    ionViewWillEnter() {
        this.materialDoc = this.db.getMaterial(this.navParams.get("item").id);
        this.material = this.materialDoc.snapshotChanges().map(a => {
            const data = a.payload.data() as Material;
            const id = a.payload.id;
            return { id, ...data };
        });
        //        this.materialDoc.collection<Salida>('salidas').valueChanges();
        this.salidas = this.db.getSalidasMaterial(this.navParams.get("item").id);
        this.getActions();
    }
    getActions(){
        this.getDevolvible();
        this.getSacable();
        this.getEditable();
    }
    getEditable() {
        this.esEditable = this.auth.user.map(user => {
            let data = user.payload.data() as User;
            if (data.rol <= 3) {
                return true;
            } else {
                return false;
            }
        })
    }
    editarMaterial(material) {
        this.navCtrl.push(EditMaterialPage, { material: material as Material })
    }
    borrarMaterial(mat:Material) { 
        let alert = this.alert.create({
            title: "Confirmar borrado",
            message: "¿Estas seguro que deseas borrar este material?",
            buttons: [
                {
                    text: "cancelar"
                },
                {
                    text: "confirmar",
                    handler: () => {
                        this.db.deleteMaterial(mat).then(result => {
                            this.utils.showToast("Material borrado");
                            this.navCtrl.pop();
                        })
                    }
                }
            ]
        });
        alert.present();
    }
    sacarMaterial() {
        let alert = this.alert.create({
            title: 'Sacar Material',
            message: "Añade comentarios: motivo, plazo de devolución...",
            inputs: [
                {
                    name: 'comentarios',
                    placeholder: 'Comentarios'
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                },
                {
                    text: 'Sacar',
                    handler: data => {
                        this.auth.user.map(user => {
                            const id = user.payload.id;
                            return id;
                        }).subscribe(user => {
                            this.db.insertSalidaMaterial(this.navParams.get("item").id, user, data.comentarios).then(result => {
//                                this.getActions();
                                this.utils.showToast("Insertada salida de material");
                            }).catch(error => {
                                this.utils.showToast("Error:" + error);
                            })

                        })
                    }
                }
            ]
        });
        alert.present();

    }
    devolverMaterial() {
        this.salidaADevolver;
        let alert = this.alert.create({
            title: 'Sacar Material',
            message: "Añade comentarios: estado del material...",
            inputs: [
                {
                    name: 'comentarios',
                    placeholder: 'Comentarios',
                    value: this.salidaADevolver.comentarios
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                },
                {
                    text: 'Devolver',
                    handler: data => {
                        this.db.insertEntradaMaterial(this.salidaADevolver.id, data.comentarios).then(result => {
                            this.utils.showToast("Insertada devolución de material");
//                            this.getActions();
                        }).catch(error => {
                            this.utils.showToast("Error: "+error);
                        })
                    }
                }
            ]
        });
        alert.present();
    }
    getSacable() {
        this.esSacable = this.salidas.map(salidas => {
            let retorno = true;
            salidas.forEach(salida => {
                if (!salida.fechaEntrada) {
                    retorno = false;
                }
            });
            return retorno;
        })
    }
    getDevolvible() {
        this.esDevolvible = this.salidas.map((salidas) => {
            return salidas.reduce((result: Observable<boolean>, salida: Salida) => {
                if (salida.fechaEntrada) {
                    return result;
                }
                let obsrUser: Observable<string> = this.auth.user.map(user => {
                    const id = user.payload.id;
                    return id
                })
                let obsrUserSal: Observable<string> = salida.user.map(user => {
                    return user.id;
                })
                let obserComb: Observable<boolean> = obsrUserSal.combineLatest(obsrUser, (a, b) => {
                    if(a==b){
                        this.salidaADevolver = salida;
                    }
                    return a==b
                })
                return obserComb;
            }, Observable.of(false))
        })
        // this.esDevolvible = this.salidas.map(salidas => {
        //     salidas.forEach(salida => {
        //         if (!salida.fechaEntrada) {
        //             let obsrUser: Observable<string> = this.auth.user.map(user => {
        //                 const id = user.payload.id;
        //                 return id
        //             })
        //             let obsrUserSal: Observable<string> = salida.user.map(user => {
        //                 return user.id;
        //             })
        //             return obsrUserSal.combineLatest(obsrUser, (a, b) => {
        //                 if (a == b) {
        //                     this.salidaADevolver = salida;
        //                 }
        //                 return a == b;
        //             }).map(result => {
        //                 return result;
        //             });
        //         }
        //     })
        // })
    }

}
