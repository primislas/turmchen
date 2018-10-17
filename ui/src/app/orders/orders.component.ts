import {Component, OnInit, ViewChild} from '@angular/core';
import {Order} from '../model/order';
import {MenuService} from '../services/menu.service';
import {OrderService} from '../services/order.service';
import {TimeService} from '../services/time.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Dish} from '../model/dish';
import {OrderParserComponent} from '../order-parser/order-parser.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  date: any = {};
  orders: Order[] = [];
  groupedOrders: Order[] = [];
  ordersByDish: DishOrders[] = [];
  @ViewChild('importModal') importModal: OrderParserComponent;

  constructor(
    private dishService: MenuService,
    private orderService: OrderService,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    const d = TimeService.nextWorkDate();
    this.date.day = d.getDate();
    this.date.month = d.getMonth() + 1;
    this.date.year = d.getUTCFullYear();
    console.log(`Date: ${d}; set date: ${JSON.stringify(this.date)}`);

    this.orderService
      .getOrders(d)
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

  // dishByCustomer() {
  //   const itemsByCustomer: Map<String, Map<number, OrderItem>> = new Map();
  //   this.orders.forEach(order => {
  //     const alias = order.customerAlias;
  //     if (alias) {
  //       const itemById = itemsByCustomer.get(alias) || new Map();
  //       (order.items || []).forEach(item => {
  //         const dish = itemById.get(item.dish.id);
  //         if (dish) dish.quantity += item.quantity;
  //         else itemById.set(item.dish.id, item);
  //       });
  //       itemsByCustomer.set(alias, itemById);
  //     }
  //   });
  //   this.groupedOrders = Object
  //     .entries(itemsByCustomer)
  //     .map(([custId, itemByDishId]) => {
  //       const order = new Order();
  //       order.customerAlias = custId;
  //       order.items = Object.values(itemByDishId);
  //       return order;
  //     })
  // }

  importFromSkype() {
    this.importModal.editCustomer = true;
    this.importModal
      .open()
      .then(order => {
        this.orderService
          .createOrder(order)
          .subscribe(o => {
            this.orders.push(o);
          });
      })
      .catch(() => {})
      .then(() => this.importModal.cleanup());
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
