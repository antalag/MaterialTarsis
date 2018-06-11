import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AuthProvider} from '../providers/auth';
import {DatabaseProvider} from '../providers/database';
import {Observable} from 'rxjs/Observable';
import {Firebase} from '@ionic-native/firebase';

import {LoginPage} from '../pages/login/login';
import {ListPage} from '../pages/list/list';
import {HomePage} from '../pages/home/home';
import {User} from '../models/user';
import {PerfilPage} from '../pages/perfil/perfil';
import {EditMaterialPage} from '../pages/edit-material/edit-material';
import {EditCategoriasPage} from '../pages/edit-categorias/edit-categorias';
import {ListUsuariosPage} from '../pages/list-usuarios/list-usuarios';

let cordova:any;

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = LoginPage;

    pages: Array<{title: string, component: any, icon: string}>;
    user: Observable<User> = null;

    constructor(public platform: Platform, private db: DatabaseProvider, private firebase: Firebase, public statusBar: StatusBar, public splashScreen: SplashScreen, private auth: AuthProvider) {
        this.user = this.auth.getUser().map(user => {
            
            if (user && user.payload) {
                const data = user.payload.data() as User;
                data.id = user.payload.id;
                if(cordova){
                this.firebase.getToken()
                    .then(token => {
                        data.token = token;
                        this.db.updateUserData(data);
                    }) // save the token server-side and use it to push notifications to this device
                    .catch(error => console.error('Error getting token', error));
                this.firebase.onTokenRefresh()
                    .subscribe((token: string) => {
                        data.token = token;
                        this.db.updateUserData(data);
                    });
                }
                return data;
            } else {
                return null;
            }
        });
        this.initializeApp();
        this.pages = [
            {title: 'Inicio', component: HomePage, icon: 'home'},
            {title: 'Lista de material', component: ListPage, icon: 'hammer'},
        ];

    }
    logOut() {
        this.auth.signOut().then(() => {
            this.nav.setRoot(LoginPage);
        })
    }
    addMaterial() {
        this.nav.push(EditMaterialPage);
    }
    editCategories() {
        this.nav.push(EditCategoriasPage);
    }
    editUsers() {
        this.nav.push(ListUsuariosPage);
    }
    editPerfil() {
        this.user.map(user => {
            this.nav.push(PerfilPage, {'user': user});
        }).subscribe()
    }
    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    openPage(page: {title: string, component: Component, icon: string}) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}
