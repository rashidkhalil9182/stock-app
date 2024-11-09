import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockPricesItemComponent } from './stock-prices-item.component';

describe('StockPricesItemComponent', () => {
  let component: StockPricesItemComponent;
  let fixture: ComponentFixture<StockPricesItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockPricesItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockPricesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
