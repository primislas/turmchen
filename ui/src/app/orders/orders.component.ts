import {Component, OnInit, ViewChild} from '@angular/core';
import {Order} from '../model/order';
import {MenuService} from '../services/menu.service';
import {OrderService} from '../services/order.service';
import {TimeService} from '../services/time.service';
import {Dish} from '../model/dish';
import {OrderParserComponent} from '../order-parser/order-parser.component';
import {OrderItem} from '../model/order.item';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  date: any = {};
  selectedDate: number;
  orders: Order[] = [];
  ordersByDish: DishOrders[] = [];
  @ViewChild('importModal') importModal: OrderParserComponent;

  constructor(
    private dishService: MenuService,
    private orderService: OrderService) {
  }

  ngOnInit() {
    const d = TimeService.nextWorkDate();
    this.date.day = d.getDate();
    this.date.month = d.getMonth() + 1;
    this.date.year = d.getUTCFullYear();
    this.selectedDate = TimeService.millisecondsOfDate(d);
    console.log(`Date: ${d}; set date: ${JSON.stringify(this.date)}`);

    this.loadOrders(d);
  }

  loadOrders(date?: Date) {
    let requestDate;
    if (!date) {
        requestDate = new Date();
        requestDate.setDate(this.date.day);
        requestDate.setMonth(this.date.month - 1);
        requestDate.setFullYear(this.date.year);
    }
    else requestDate = date;
    console.log(`Loading orders for ${requestDate}`);
    this.selectedDate = TimeService.millisecondsOfDate(requestDate);
    this.orderService
        .getOrders(requestDate)
        .subscribe(orders => {
          this.orders = orders;
        });
  }

  groupByDish(): DishOrders[] {
    console.log("Grouping by dish...");
    const map = this.orders
      .map(o => o.splitByItems())
      .reduce((acc,a) => acc.concat(a), [])
      .reduce((acc: object, o: Order) => {
        const id = o.items[0].dish.id;
        const orders = (acc[id] || []);
        orders.push(o);
        acc[id] = orders;
        return acc;
      }, {});
    return Object.keys(map).map(id => {
      const orders = map[id];
      const dOrders = new DishOrders();
      dOrders.dish = orders[0].items[0].dish;
      dOrders.orders = orders;
      dOrders.qty = orders
        .map(o => o.items[0].quantity)
        .reduce((a, b) => a + b, 0);
      return dOrders;
    });
  }

  printOrders(): string {
    return this.orders
      .map(o => `<b>${o.customerAlias}</b> (${o.price}₴): ${this.printOrderItems(o.items)}.<br>`)
      .join("\n");
  }

  private printOrderItems(items: OrderItem[]): string {
    return items.map(this.printOrderItem).join(", ");
  }

  private printOrderItem(item: OrderItem): string {
    return (item.quantity === 1)
      ? `${item.dish.name}`
      : `${item.dish.name} (${item.quantity}шт.)`;
  }

  importFromSkype() {
    this.importModal.editCustomer = true;
    this.importModal
      .open()
      .then(order => {
        order.timestamp = this.selectedDate;
        this.orderService
          .createOrder(order)
          .subscribe(o => {
            this.orders.push(o);
          });
      })
      .catch(() => {})
      .then(() => this.importModal.cleanup());
  }

  print(): void {
    const
      printContents = this.printOrders(),
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Заказы</title>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  removeOrder(i) {
    this.orderService
      .removeOrder(this.orders[i])
      .subscribe(() => this.orders.splice(i, 1));
  }

  updateOrder(i) {
    const order = this.orders[i];
    this.orderService
      .updateOrder(order)
      .subscribe(o => {
        if (order) {
          order.id = o.id;
          order.items = o.items;
        }
      });
  }

  addOrderItems(order: Order) {
    this.importModal.editCustomer = false;
    this.importModal
      .open()
      .then((o: Order) => {
        (o.items || []).forEach(item => order.addItem(item));
      })
      .catch(() => {})
      .then(() => this.importModal.cleanup());
  }

  recalcByDish() {
    this.ordersByDish = this.groupByDish();
  }

}

class DishOrders {
  dish: Dish;
  qty: number;
  orders: Order[] = [];

  users(): string {
    return this
      .orders
      .map(o => `${o.customerAlias} (x${o.items[0].quantity})`)
      .join(", ");
  }

}
