import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AngularFirestoreDocument} from 'angularfire2/firestore';
import {Material} from '../../models/material'
import {Observable} from 'rxjs/Observable';
import {operators} from 'rxjs';
import {Salida} from '../../models/salida';
import {DatabaseProvider} from '../../providers/database';
import {AuthProvider} from '../../providers/auth';
import {User} from '../../models/user';

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
    constructor(public navCtrl: NavController, public navParams: NavParams, private db: DatabaseProvider, private auth: AuthProvider) {
        this.materialDoc = this.db.getMaterial(this.navParams.get("item").id);
        this.material = this.materialDoc.valueChanges();
//        this.materialDoc.collection<Salida>('salidas').valueChanges();
        this.salidas = this.db.getSalidasMaterial(this.navParams.get("item").id);
    }

    sacarMaterial() {
        this.auth.user.map(user => {
//            const data = user.payload.data() as User;
            const id = user.payload.id;
            return id;
        }).subscribe(user => {
            this.db.insertSalidaMaterial(this.navParams.get("item").id, user).then(result=>{
                console.log(result);
            }).catch(error=>{
                console.log(error);
            })

        })
        //      Observable.concat(this.auth.user.map(user => {
        //      return user
        //      }), this.material.map(mat => {
        //      return mat
        //      })).subscribe(result=>{
        //          console.log(result);
        //      })
        //      let usr = this.auth.user
        //    .flatMap(result => this.material.map(result))
        //    .subscribe(result2 => { // do stuff });
        //      var usr =this.auth.user.flatMap(data=>{
        //        return data as User;
        //      }).subscribe({
        //          
        //      }).unsubscribe();
        //          var mat=this.material.map(data=>{
        //              return data as Material;
        //        }).subscribe(()=>{
        //        console.log(mat);
        //        console.log(usr);
        //        });
    }

}
