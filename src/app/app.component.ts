import { Component, Input, SimpleChanges, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from './data.service';
import { Series } from './common/series';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.update();
  }

  @Input() series = new Series();

  title = 'Covid19Tracker';

  listItems = [
    { key: 'us', value: 'United States' },
    { key: 'ca', value: 'California' },
    { key: 'ny', value: 'New York' },
    { key: 'or', value: 'Oregon' },
    { key: 'tx', value: 'Texas' },
    { key: 'wa', value: 'Washington' },
  ];

  private _selectedItem = this.listItems[0];

  set selectedItem(val: { key: string; value: string }) {
    this._selectedItem = val;
    this.update();
  }

  get selectedItem(): { key: string; value: string } {
    return this._selectedItem;
  }

  async update() {
    this.series = await this.dataService.getSeries(this.selectedItem.key);
  }
}
