export interface PriceUpdate {
    symbol: string
    displayName: string
    fiftyTwoWeekLow: number
    fiftyTwoWeekHigh: number
    regularMarketDayRange: RegularMarketDayRange
  }
  
  export interface RegularMarketDayRange {
    low: number
    high: number
  }