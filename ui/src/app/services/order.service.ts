import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Order} from '../model/order';
import {TimeService} from './time.service';
import {MenuService} from './menu.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private dailyOrdersEndpoint = day => `${this.ordersEndpoint}?day=${day}`;
  private ordersEndpoint = '/turmchen/orders';
  private orderEndpoint = id => `${this.ordersEndpoint}/${id}`;
  private parserEndpoint = `${this.ordersEndpoint}/parser`;

  constructor(private http: HttpClient, dishService: MenuService) {
  }

  createOrder(order: Order): Observable<Order> {
    console.log(`Creating an order with timestamp: ${order.timestamp}`);
    return this.http
      .post<Order>(this.ordersEndpoint, order)
      .pipe(
        map(OrderService.prepOrder),
        catchError(OrderService.handleError)
      )
  }

  getOrders(date: Date): Observable<Order[]> {
    console.log(`Fetching orders of date=${TimeService.millisecondsOfDate(date)}`);
    return this.http
      .get<Order[]>(this.dailyOrdersEndpoint(TimeService.millisecondsOfDate(date)))
      .pipe(
        map(orders => orders.map(OrderService.prepOrder)),
        catchError(OrderService.handleError)
      );
  }

  updateOrder(order: Order): Observable<Order> {
    return this.http
      .put<Order>(this.orderEndpoint(order.id), order)
      .pipe(
        map(OrderService.prepOrder),
        catchError(OrderService.handleError)
      )
  }

  removeOrder(order: Order): Observable<Order> {
    return this.http
      .delete<Order>(this.orderEndpoint(order.id))
      .pipe(
        map(() => order),
        catchError(OrderService.handleError)
      )
  }

  parseOrder(order: string): Observable<Order> {
    return this.http
      .post(this.parserEndpoint, order, {headers: new HttpHeaders({'Content-Type':'text/plain;charset=utf-8'})})
      .pipe(
        map(OrderService.prepOrder),
        catchError(OrderService.handleError)
      )
  }

  static prepOrder(obj: Order): Order {
    const order = Order.fromJsonObj(obj);
    console.log(`Received an order, type=${order.constructor.name}: ${JSON.stringify(order)}`);
    order.items.forEach(i => {
      // i.recalcPrice();
      i.dish = MenuService.prepDish(i.dish);
    });
    order.recalcPrice();
    order.title = `${order.customerAlias}, ${order.price}₴`;
    return order;
  }

  static handleError(error): Observable<never> {
    // console.log(`Order error: ${JSON.stringify(error)}`);
    return throwError(error);
  }

}
