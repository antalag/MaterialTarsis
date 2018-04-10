import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule,LOCALE_ID } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { MomentModule } from 'angular2-moment';
import * as moment from  'moment-timezone';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {LoginPage} from '../pages/login/login';
import {DetalleMaterialPage} from '../pages/detalle-material/detalle-material';
import {EditMaterialPage} from '../pages/edit-material/edit-material';
import {EditCategoriasPage} from '../pages/edit-categorias/edit-categorias';
import {ListUsuariosPage} from '../pages/list-usuarios/list-usuarios';
import {FormUsuariosPage} from '../pages/form-usuarios/form-usuarios';
import * as firebase from 'firebase';
//import {ToolbarComponent} from '../components/toolbar/toolbar';

import {ComponentsModule} from '../components/components.module'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Firebase } from '@ionic-native/firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AuthProvider } from '../providers/auth';
import { DatabaseProvider } from '../providers/database';
import {PipesModule} from '../pipes/pipes.module';
import {PerfilPage} from '../pages/perfil/perfil';
import { Camera } from '@ionic-native/camera';
import { UtilsProvider } from '../providers/utils';
import {FormCategoriaPage} from '../pages/form-categoria/form-categoria';

export const firebaseConfig = {
    apiKey: "AIzaSyDWGDn_ODyuAfdExBcnN775O5XKOVmpR_U",
    authDomain: "materialtarsis.firebaseapp.com",
    databaseURL: "https://materialtarsis.firebaseio.com",
    projectId: "materialtarsis",
    storageBucket: "materialtarsis.appspot.com",
    messagingSenderId: "514247118675"
};
registerLocaleData(localeEs, 'es');
moment.locale('es');
moment.tz.setDefault(moment.tz.guess());
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ListPage,
    PerfilPage,
    DetalleMaterialPage,
    EditMaterialPage,
    EditCategoriasPage,
    FormCategoriaPage,
    ListUsuariosPage,
    FormUsuariosPage
  ],
  imports: [
    BrowserModule,
    MomentModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ListPage,
    PerfilPage,
    DetalleMaterialPage,
    EditMaterialPage,
    EditCategoriasPage,
    FormCategoriaPage,
    ListUsuariosPage,
    FormUsuariosPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    AngularFirestoreModule,
    { provide: LOCALE_ID, useValue: 'es' } ,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    Camera,
    DatabaseProvider,
    UtilsProvider
  ]
})
export class AppModule {}
