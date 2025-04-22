import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastContainerComponent } from './shared/component/toast/toast-container.component';
import { LoaderOverlayComponent } from './shared/component/loader-overlay/loader-overlay.component';

@Component({
  imports: [LoaderOverlayComponent, RouterModule, ToastContainerComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'pulse-probe-ui';
}
