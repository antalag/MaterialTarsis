import {Component} from '@angular/core';
import {NavController, NavParams, ActionSheetController} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {AngularFireStorage} from 'angularfire2/storage';
import {DatabaseProvider} from '../../providers/database';
import {Material} from '../../models/material';
import {Camera} from '@ionic-native/camera';
import {Observable} from 'rxjs/Observable';
import {Categoria} from '../../models/categoria';
import {UtilsProvider} from '../../providers/utils';

/**
 * Generated class for the EditMaterialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-edit-material',
    templateUrl: 'edit-material.html',
})
export class EditMaterialPage {
    private formMaterial: FormGroup;
    private material: Material;
    private base64Image;
    private camera: Camera;
    private title:string;
    private categorias: Observable<Categoria[]>;
    constructor(public navCtrl: NavController,private utils:UtilsProvider, private actionSheetCtrl: ActionSheetController, public navParams: NavParams, private formBuilder: FormBuilder, private db: DatabaseProvider, private storage: AngularFireStorage) {
        if (this.navParams.get('material')) {
            this.material = this.navParams.get('material');
            this.title = "Editar material";
        } else {
            const data: Material = {
                id: null,
                imagen: null,
                cantidad: null,
                nombre: null,
                ubicacion: null,
                comentarios: null,
                categoria: null
            }
            this.material = data;
            this.title = "Añadir material";
        }
        if (this.material.imagen) {
            this.base64Image = this.material.imagen
        }
        this.camera = new Camera();
        this.categorias = this.db.getCategories();
        this.formMaterial = this.formBuilder.group({
            nombre: [this.material.nombre, Validators.required],
            cantidad: [this.material.cantidad],
            ubicacion: [this.material.ubicacion],
            categoria: [this.material.categoria],
            id: [this.material.id],
            comentarios: [this.material.comentarios],
            imagen: [this.material.imagen],
        });
    }
    sendForm() {
        if (this.base64Image && this.base64Image !== this.material.imagen) {
            fetch(this.base64Image)
                .then(res => res.blob())
                .then(blob => {
                    const task = this.storage.upload(this.material.id + '', blob);
                    task.downloadURL().subscribe(
                        (data) => {
                            var material = this.formMaterial.value as Material;
                            material.imagen = data;
                            if (material.id) {
                                this.db.updateMaterialData(material).then(result => {
                                    this.utils.showToast("Material guardado");
                                    this.navCtrl.pop();
                                })
                            } else {
                                this.db.insertMaterial(material).then(result => {
                                    this.utils.showToast("Material creado");
                                    this.navCtrl.pop();
                                })
                            }
                        });
                })

        } else {
            var material = this.formMaterial.value as Material;
            if (material.id) {
                this.db.updateMaterialData(material).then(result => {
                   this.utils.showToast("Material guardado");
                   this.navCtrl.pop();
                }).catch(error=>{
                    console.log(error);
                })
            } else {
                this.db.insertMaterial(material).then(result => {
                    this.utils.showToast("Material creado");
                    this.navCtrl.pop();
                })
            }
        }
    }

    presentPictureActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Seleccionar fuente de la imagen',
            buttons: [
                {
                    text: 'Cargar de galería',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                    }
                },
                {
                    text: 'Usar cámara',
                    handler: () => {
                        this.takePicture(this.camera.PictureSourceType.CAMERA);
                    }
                },
                {
                    text: 'Cancelar',
                    role: 'cancel'
                }
            ]
        });
        actionSheet.present();
    }

    takePicture(picSourceType: number) {

        this.camera.getPicture({
            allowEdit: true,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: picSourceType,
            targetHeight: 480,
            targetWidth: 480
        }).then((imageData) => {
            this.base64Image = "data:image/jpeg;base64," + imageData;
        }, (err) => {
            console.log(err);
        });
    }

}
