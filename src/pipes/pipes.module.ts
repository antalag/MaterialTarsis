import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './safe-html/safe-html';
import { ThumbPipe } from './thumb/thumb';
@NgModule({
	declarations: [SafeHtmlPipe,
    ThumbPipe],
	imports: [],
	exports: [SafeHtmlPipe,
    ThumbPipe]
})
export class PipesModule {}
