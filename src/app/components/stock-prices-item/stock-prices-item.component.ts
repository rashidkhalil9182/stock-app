import { Component, HostBinding, Input } from '@angular/core';
import { StockDataModel } from '../../model/StockData.model';
import { Observable } from 'rxjs';
import { StockPricesService } from '../../service/stock-prices.service';
import { CommonModule } from '@angular/common';
import { PricePipe } from '../../pipe/price.pipe';
import { ToggleSwitchComponent } from '../toggle-switch/toggle-switch.component';

@Component({
  selector: 'app-stock-prices-item',
  standalone: true,
  imports: [CommonModule,PricePipe, ToggleSwitchComponent],
  templateUrl: './stock-prices-item.component.html',
  styleUrl: './stock-prices-item.component.scss'
})
export class StockPricesItemComponent {
  @Input() name!: string;
  @Input() set data(val: StockDataModel | undefined) {
    if (val) {
      this.stocksData = val;
      this.negativeGrowth = val.changepercent < 0;
    } else {
      // Provide a default value or handle undefined case
      this.stocksData = {} as StockDataModel;  // or handle the empty state as needed
      this.negativeGrowth = false;
    }
  }

  @HostBinding('class.stockPricesItem--unsubscribed')
  public unsubscribed = false;

  @HostBinding('class.stockPricesItem--negativeGrowth')
  public negativeGrowth = false;

  stocksData!: StockDataModel;
  stocksData$!: Observable<StockDataModel>;

  constructor(
    private service: StockPricesService,
  ) { }

  toggle(val: boolean): void {
    this.unsubscribed = !val;
    if (val) {
      this.service.subscribeToPriceUpdates(this.name);
    } else {
      this.service.unsubscribeFromPriceUpdates(this.name);
    }
  }
}
