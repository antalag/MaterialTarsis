import {Component} from '@angular/core';
import {NavController, NavParams, ActionSheetController} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {AngularFireStorage} from 'angularfire2/storage';
import {DatabaseProvider} from '../../providers/database';
import {Material} from '../../models/material';
import {Camera} from '@ionic-native/camera';
import {Observable} from 'rxjs/Observable';
import {Categoria} from '../../models/categoria';

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
    private categorias:Observable<Categoria[]>;
    constructor(public navCtrl: NavController, private actionSheetCtrl: ActionSheetController, public navParams: NavParams, private formBuilder: FormBuilder, private db: DatabaseProvider, private storage: AngularFireStorage) {
        this.material = this.navParams.get('material');
        if (this.material.imagen){
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

    ionViewDidLoad() {
        console.log('ionViewDidLoad EditMaterialPage');
    }

}
