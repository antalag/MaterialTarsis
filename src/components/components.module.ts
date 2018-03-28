import { NgModule } from '@angular/core';
import { ToolbarComponent } from './toolbar/toolbar';
import {FaIconComponent} from './fa-icon/fa-icon';
import {IonicModule} from 'ionic-angular';
@NgModule({
	declarations: [ToolbarComponent,FaIconComponent],
	imports: [IonicModule],
//        entryComponents:[
//            ToolbarComponent
//        ],
	exports: [ToolbarComponent,FaIconComponent]
})
export class ComponentsModule {}
