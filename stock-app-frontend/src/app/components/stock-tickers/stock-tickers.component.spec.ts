import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTickersComponent } from './stock-tickers.component';

describe('StockPricesComponent', () => {
  let component: StockTickersComponent;
  let fixture: ComponentFixture<StockTickersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockTickersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockTickersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
