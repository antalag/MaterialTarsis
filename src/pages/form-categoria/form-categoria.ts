import {Component} from '@angular/core';
import {NavController, NavParams, ActionSheetController, ViewController} from 'ionic-angular';
import {Camera} from '@ionic-native/camera';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatabaseProvider} from '../../providers/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {UtilsProvider} from '../../providers/utils';
import {Categoria} from '../../models/categoria';

/**
 * Generated class for the FormCategoriaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-form-categoria',
    templateUrl: 'form-categoria.html',
})
export class FormCategoriaPage {
    private base64Image;
    private formCatego: FormGroup;
    private camera: Camera;
    private catego: Categoria;
    private title: string;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private actionSheetCtrl: ActionSheetController,
        private formBuilder: FormBuilder,
        private db: DatabaseProvider,
        private storage: AngularFireStorage,
        public viewCtrl: ViewController,
        private utils: UtilsProvider
    ) {
        this.camera = new Camera();
        if (this.navParams.get('catego')) {
            this.catego = this.navParams.get('catego');
            this.title = "Editar categoria";
        } else {
            const data: Categoria = {
                id: null,
                image: null,
                nombre: null
            }
            this.catego = data;
            this.title = "Añadir categoria";
        }
        if (this.catego.image) {
            this.base64Image = this.catego.image
        }
        this.formCatego = this.formBuilder.group({
            nombre: [this.catego.nombre, Validators.required],
            id: [this.catego.id],
            image: [this.catego.image],
        });
    }
    sendForm() {
        if (this.base64Image && this.base64Image !== this.catego.image) {
            fetch(this.base64Image)
                .then(res => res.blob())
                .then(blob => {
                    const task = this.storage.upload(this.catego.id + '', blob);
                    task.downloadURL().subscribe(
                        (data) => {
                            var cat = this.formCatego.value as Categoria;
                            cat.image = data;
                            if (cat.id) {
                                this.db.updateCategoriaData(cat).then(result => {
                                    this.utils.showToast("Categoria guardado");
                                    this.navCtrl.pop();
                                })
                            } else {
                                this.db.insertCategoria(cat).then(result => {
                                    this.utils.showToast("Material guardado");
                                    this.navCtrl.pop();
                                })
                            }
                        });
                })

        } else {
            var cat = this.formCatego.value as Categoria;
            console.log(cat);
            if (cat.id) {
                this.db.updateCategoriaData(cat).then(result => {
                    this.utils.showToast("Material guardado");
                    this.navCtrl.pop();
                }).catch(error => {
                    console.log(error);
                })
            } else {
                this.db.insertCategoria(cat).then(result => {
                    this.utils.showToast("Material guardado");
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
    dismiss() {
        this.viewCtrl.dismiss();
    }

}
