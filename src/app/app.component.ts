import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AuthProvider} from '../providers/auth';


import {LoginPage} from '../pages/login/login';
import { ListPage } from '../pages/list/list';
import {HomePage} from '../pages/home/home';
import {User} from '../models/user';
import {PerfilPage} from '../pages/perfil/perfil';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any, icon: string}>;
  user:User = null;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private auth:AuthProvider) {
    this.initializeApp();
    this.auth.user.subscribe(user=>{
        this.user = user;
    })

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Inicio', component: HomePage, icon: 'home' },
      { title: 'Lista de material', component: ListPage, icon: 'hammer' },
//      { title: 'Logout', component: LoginPage,icon:"log-out" }
    ];

  }
  logOut(){
      this.auth.signOut().then(()=>{
          this.nav.setRoot(LoginPage);
      })
  }
  editPerfil(){
      this.nav.setRoot(PerfilPage, {'user': this.user});
  }
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
