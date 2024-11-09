import { Component } from '@angular/core';
import { StockPricesService } from '../../service/stock-prices.service';
import { StockDataModel } from '../../model/StockData.model';
import { Observable } from 'rxjs';
import { StockPricesItemComponent } from '../stock-prices-item/stock-prices-item.component';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-tickers',
  standalone: true,
  imports: [StockPricesItemComponent, AsyncPipe, CommonModule],
  templateUrl: './stock-tickers.component.html',
  styleUrl: './stock-tickers.component.scss'
})
export class StockTickersComponent {
  stockNames: string[] = ['AAPL', 'GOOG', 'MSFT', 'TSLA'];
  stockData$!: Observable<Record<string, StockDataModel>>;

  constructor(
    private stockPricesService: StockPricesService
  ) { }

  ngOnInit(): void {
    this.stockPricesService.init(this.stockNames);
    this.stockData$ = this.stockPricesService.stockData$;
  }

  get isMarketOpen(): boolean {
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const hour = now.getUTCHours();

    // Market open hours in UTC: 2:30 PM - 9:00 PM UTC for NYSE (9:30 AM - 4:00 PM ET)
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const isMarketHours = hour >= 14 && hour < 21;

    return isWeekday && isMarketHours;
}

  ngOnDestroy(): void {
    this.stockPricesService.destroy();
  }
}
