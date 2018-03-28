import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AngularFirestoreDocument} from 'angularfire2/firestore';
import {Material} from '../../models/material'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';
import {AlertController} from 'ionic-angular';
import {Salida} from '../../models/salida';
import {DatabaseProvider} from '../../providers/database';
import {AuthProvider} from '../../providers/auth';
import {User} from '../../models/user';
import {EditMaterialPage} from '../edit-material/edit-material';

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
    private esDevolvible:any;
    private esSacable: Observable<boolean> = Observable.of(false);
    private esEditable: Observable<boolean> = Observable.of(false);
    constructor(public navCtrl: NavController, public navParams: NavParams, private db: DatabaseProvider, private auth: AuthProvider, private alert: AlertController) {
    }
    ionViewWillEnter() {
        this.materialDoc = this.db.getMaterial(this.navParams.get("item").id);
        this.material = this.materialDoc.valueChanges();
        //        this.materialDoc.collection<Salida>('salidas').valueChanges();
        this.salidas = this.db.getSalidasMaterial(this.navParams.get("item").id);
        this.getDevolvible();
        this.getSacable();
        this.getEditable();
    }
    getEditable(){
        this.esEditable = this.auth.user.map(user=>{
            let data = user.payload.data() as User;
            if (data.rol <=3){
                return true;
            }else{
                return false;
            }
        })
    }
    editarMaterial(material){
           this.navCtrl.push(EditMaterialPage, {material:material as Material})
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
                                console.log(result);
                                this.getSacable();
                                this.getDevolvible();
                            }).catch(error => {
                                console.log(error);
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
                            console.log(result);
                        }).catch(error => {
                            console.log(error);
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
        this.esDevolvible = this.salidas.map(salidas => {
            salidas.forEach(salida => {
                if (!salida.fechaEntrada) {
                    let obsrUser: Observable<string> = this.auth.user.map(user => {
                        const id = user.payload.id;
                        return id
                    })
                    let obsrUserSal: Observable<string> = salida.user.map(user => {
                        return user.id;
                    })
                    return obsrUserSal.combineLatest(obsrUser, (a, b) => {
                        if (a == b) {
                            this.salidaADevolver = salida;
                        }
                        return a == b;
                    }).map(result => {
                        return result;
                    });
                }
            })
        })
    }

}
