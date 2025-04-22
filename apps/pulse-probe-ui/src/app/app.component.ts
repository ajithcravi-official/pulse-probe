import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastContainerComponent } from './shared/component/toast/toast-container.component';

@Component({
  imports: [RouterModule, ToastContainerComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'pulse-probe-ui';
}
