import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {LoginPage} from '../pages/login/login';
import {DetalleMaterialPage} from '../pages/detalle-material/detalle-material';
//import {ToolbarComponent} from '../components/toolbar/toolbar';

import {ComponentsModule} from '../components/components.module'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
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

export const firebaseConfig = {
    apiKey: "AIzaSyDWGDn_ODyuAfdExBcnN775O5XKOVmpR_U",
    authDomain: "materialtarsis.firebaseapp.com",
    databaseURL: "https://materialtarsis.firebaseio.com",
    projectId: "materialtarsis",
    storageBucket: "materialtarsis.appspot.com",
    messagingSenderId: "514247118675"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ListPage,
    PerfilPage,
    DetalleMaterialPage
  ],
  imports: [
    BrowserModule,
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
    DetalleMaterialPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFirestoreModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    Camera,
    DatabaseProvider,
    UtilsProvider
  ]
})
export class AppModule {}
