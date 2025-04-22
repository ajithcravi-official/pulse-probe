import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { LoaderService } from '../../../service/loader/loader.service';

@Component({
  selector: 'app-loader-overlay',
  imports: [CommonModule, NgIf],
  templateUrl: './loader-overlay.component.html',
  styleUrl: './loader-overlay.component.scss',
})
export class LoaderOverlayComponent {
  constructor(public loaderService: LoaderService) {}
}
