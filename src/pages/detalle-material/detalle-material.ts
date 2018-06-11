import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AngularFirestoreDocument} from 'angularfire2/firestore';
import {Material} from '../../models/material'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/reduce';
import {AlertController} from 'ionic-angular';
import {DatabaseProvider} from '../../providers/database';
import {AuthProvider} from '../../providers/auth';
import {User} from '../../models/user';
import {EditMaterialPage} from '../edit-material/edit-material';
import {Salida} from '../../models/salida';
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
    private esEditable: boolean = false;
    private currentUser;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private db: DatabaseProvider,
        private auth: AuthProvider,
        private utils: UtilsProvider,
        private alert: AlertController) {
    }
    ionViewWillEnter() {
        this.materialDoc = this.db.getMaterial(this.navParams.get("item").id);
        this.material = this.materialDoc.snapshotChanges().map(a => {
            const data = a.payload.data() as Material;
            const id = a.payload.id;
            return {id, ...data};
        });
        //        this.materialDoc.collection<Salida>('salidas').valueChanges();
        this.salidas = this.db.getSalidasMaterial(this.navParams.get("item").id);
        this.auth.user.map(user => {
            const id = user.payload.id;
            let data = user.payload.data() as User;
            return {id, ...data};
        }).subscribe((user: User) => {
            this.currentUser = user.id;
            this.esEditable = (user.rol <= 3)
        })
    }
    editarMaterial(material) {
        this.navCtrl.push(EditMaterialPage, {material: material as Material})
    }
    borrarMaterial(mat: Material) {
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
    sacarMaterial(mat: Material) {

        let alert = this.alert.create({
            title: 'Sacar Material',
            message: "Añade comentarios: motivo, plazo de devolución...",
            inputs: [
                {
                    name: 'comentarios',
                    placeholder: 'Comentarios'
                },
                {
                    name: 'cantidad',
                    placeholder: 'cantidad',
                    value: "1",
                    max: mat.cantidad,
                    min: 1,
                    type: 'number'
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                },
                {
                    text: 'Sacar',
                    handler: (data: {comentarios: string, cantidad: string}) => {
                        let restante: number = parseInt(mat.cantidad) - parseInt(data.cantidad);
                        this.auth.user.map(user => {
                            const id = user.payload.id;
                            return id;
                        }).subscribe(user => {
                            this.db.insertSalidaMaterial(this.navParams.get("item").id, user, data.comentarios, parseInt(data.cantidad), restante).then(result => {
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
    devolverMaterial(salida: Salida, mat: Material) {
        this.salidaADevolver;
        let alert = this.alert.create({
            title: 'Devolver Material',
            message: "Añade comentarios: estado del material...",
            inputs: [
                {
                    name: 'comentarios',
                    placeholder: 'Comentarios',
                    value: salida.comentarios
                },
                {
                    name: 'cantidad',
                    placeholder: 'cantidad',
                    value: "1",
                    max: (salida.cantidaddevuelta) ? salida.cantidad - salida.cantidaddevuelta : salida.cantidad,
                    min: 1,
                    type: 'number'
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                },
                {
                    text: 'Devolver',
                    handler: (data: {comentarios: string, cantidad: string}) => {
                        let restante: number = parseInt(mat.cantidad) + parseInt(data.cantidad);
                        let cantidad:number =(salida.cantidaddevuelta)?parseInt(data.cantidad)+parseInt(salida.cantidaddevuelta.toString()):parseInt(data.cantidad)
                        this.db.insertEntradaMaterial(salida.id, data.comentarios, cantidad, restante, mat.id).then(result => {
                            this.utils.showToast("Insertada devolución de material");
                        }).catch(error => {
                            this.utils.showToast("Error: " + error);
                        })
                    }
                }
            ]
        });
        alert.present();
    }
}
