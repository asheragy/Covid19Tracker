import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Covid19Tracker';

  listItems = [
    { key: 'us', value: 'United States' },
    { key: 'or', value: 'Oregon' },
  ];

  selectedItem = this.listItems[0];
}
