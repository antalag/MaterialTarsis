import {Component} from '@angular/core';
import {NavController, NavParams, ActionSheetController} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import {User} from '../../models/user';
import {Camera} from '@ionic-native/camera';
import {AuthProvider} from '../../providers/auth';
import {AngularFireStorage} from 'angularfire2/storage';

/**
 * Generated class for the PerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-perfil',
    templateUrl: 'perfil.html',
})
export class PerfilPage {
    private formPerfil: FormGroup;
    private user: User;
    private base64Image;
    private camera: Camera;
    constructor(public navCtrl: NavController, private actionSheetCtrl: ActionSheetController, public navParams: NavParams, private formBuilder: FormBuilder, private auth: AuthProvider, private storage: AngularFireStorage) {
        this.user = this.navParams.get('user');
        this.camera = new Camera();
        this.formPerfil = this.formBuilder.group({
            displayName: [this.user.displayName, Validators.required],
            email: [this.user.email, Validators.email],
            uid: [this.user.uid],
            cargo: [this.user.cargo ? this.user.cargo : 'scouter'],
            rol: [this.user.rol ? this.user.rol : 3],
            photoURL: [this.user.photoURL],
        });
    }
    sendForm() {
        if (this.base64Image) {
            //           const file = event.target.files[0];
            //           const filePath = this.user.uid+'-prefil.jpg';
            fetch(this.base64Image)
                .then(res => res.blob())
                .then(blob => {
                    const task = this.storage.upload(this.user.uid+'', blob);
                    var foto=task.downloadURL().subscribe(
                    (data)=>{
                        console.log(data);
                        var user = this.formPerfil.value as User;
                        user.photoURL = data;
                        this.auth.updateUserData(user).then(result => {
                            console.log(result);
                        });
                    });
                    console.log(foto);
//                    .catch(error => {
//                        console.log(error);
//                    });
                })

            //           task.downloadURL()
        } else {
            var user = this.formPerfil.value as User;
            this.auth.updateUserData(user).then(result => {
                console.log(result);
            });
        }
        console.log(this.user);
        console.log(this.formPerfil.value as User);
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
