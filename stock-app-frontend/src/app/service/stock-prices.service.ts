import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PricingData } from './proto/pricingData_pb';
import { StockDataModel } from '../model/StockData.model';
import { HttpClient } from '@angular/common/http';
import { PriceUpdate } from '../model/priceUpdate.model';

@Injectable({
    providedIn: 'root'
})
export class StockPricesService {
    apibackendUrl = 'https://stock-app-api-olive.vercel.app';

    private socket!: WebSocket;
    private stockDataSubject = new BehaviorSubject<Record<string, StockDataModel>>({});
    public stockData$: Observable<Record<string, StockDataModel>> = this.stockDataSubject.asObservable();

    constructor(private httpClient: HttpClient) { 
    }

    // Initialize stock data and WebSocket connection
    public init(stockSymbols: string[]): void {
        this.initializeStockData(stockSymbols);
        this.setupWebSocket(stockSymbols);
    }

    // Initialize stock data structure for the provided symbols
    private initializeStockData(stockSymbols: string[]): void {
        const initialData: Record<string, any> = stockSymbols.reduce((acc: Record<string, StockDataModel | {}>, symbol: string) => {
            acc[symbol] = {};  // Initialize empty data for each stock
            return acc;
        }, {});

        this.stockDataSubject.next(initialData); // Emit initial stock data
    }

    // Setup WebSocket connection
    private setupWebSocket(stockSymbols: string[]): void {
        this.socket = new WebSocket('wss://streamer.finance.yahoo.com/');
        this.socket.onopen = () => this.subscribeToSymbols(stockSymbols);
        this.socket.onmessage = (event) => this.handleSocketMessage(event);
        this.socket.onerror = (error) => console.error('WebSocket error:', error);
    }

    // Subscribe to the specified stock symbols
    private subscribeToSymbols(stockSymbols: string[]): void {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ subscribe: stockSymbols }));
        }
    }

    // Handle incoming WebSocket messages and update stock data
    private async handleSocketMessage(event: MessageEvent): Promise<void> {
        const pricingData = this.parsePricingData(event.data);
        if (!pricingData) return;

        const stockId = pricingData.id;
        const priceUpdate = await this.getPriceUpdateFromAPI(stockId);

        const updatedStock = this.mergePricingData(stockId, pricingData, priceUpdate);
        this.updateStockData(stockId, updatedStock);
    }

    // Parse binary data from WebSocket message into a PricingData object
    private parsePricingData(data: any): PricingData.AsObject | null {
        try {
            return PricingData.deserializeBinary(data).toObject();
        } catch (error) {
            console.error('Failed to parse pricing data:', error);
            return null;
        }
    }

    // Merge incoming pricing data with existing and API data
    private mergePricingData(stockId: string, pricingData: PricingData.AsObject, priceUpdate?: PriceUpdate): StockDataModel {
        const currentData = this.stockDataSubject.getValue()[stockId] || {};

        return {
            ...currentData,
            ...pricingData,
            dayhigh: priceUpdate?.regularMarketDayRange?.high ?? 0,
            daylow: priceUpdate?.regularMarketDayRange?.low ?? 0,
            fiftyTwoWeekHigh: priceUpdate?.fiftyTwoWeekHigh ?? 0,
            fiftyTwoWeekLow: priceUpdate?.fiftyTwoWeekLow ?? 0,
        };
    }

    // Update the stock data and emit the new value
    private updateStockData(stockId: string, updatedStock: StockDataModel): void {
        const currentData = this.stockDataSubject.getValue();
        this.stockDataSubject.next({
            ...currentData,
            [stockId]: updatedStock
        });
    }

    // HTTP call to get additional price update data
    private async getPriceUpdateFromAPI(symbol: string): Promise<PriceUpdate | undefined> {
        try {
            return await this.httpClient.get<PriceUpdate>(`${this.apibackendUrl}/priceUpdates/${symbol}`).toPromise();
        } catch (error) {
            console.error(`Error fetching price updates for ${symbol}:`, error);
            return undefined;
        }
    }

    // Subscribe to individual stock updates
    public subscribeToPriceUpdates(stockSymbol: string): void {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ subscribe: [stockSymbol] }));
        }
    }

    // Unsubscribe from individual stock updates
    public unsubscribeFromPriceUpdates(stockSymbol: string): void {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ unsubscribe: [stockSymbol] }));
        }
    }

    // Close WebSocket connection
    public destroy(): void {
        if (this.socket) this.socket.close();
    }
}
