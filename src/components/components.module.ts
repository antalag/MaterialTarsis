import { NgModule } from '@angular/core';
import { ToolbarComponent } from './toolbar/toolbar';
import {FaIconComponent} from './fa-icon/fa-icon';
import {Autosize} from './autosize/autosize';
import {IonicModule} from 'ionic-angular';
@NgModule({
	declarations: [ToolbarComponent,FaIconComponent,Autosize],
	imports: [IonicModule],
//        entryComponents:[
//            ToolbarComponent
//        ],
	exports: [ToolbarComponent,FaIconComponent,Autosize]
})
export class ComponentsModule {}
