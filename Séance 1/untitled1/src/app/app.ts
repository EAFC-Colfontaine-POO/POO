import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatCard, MatCardContent} from '@angular/material/card';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatCardContent, MatCard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Kikou');
}
