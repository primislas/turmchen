import {Component, OnInit} from '@angular/core';
import {Order} from '../model/order';
import {MenuService} from '../services/menu.service';
import {OrderService} from '../services/order.service';
import {TimeService} from '../services/time.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Dish} from '../model/dish';
import {OrderItem} from '../model/order.item';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  date: any = {};
  orders: Order[] = [];
  parsedOrder: Order;
  skypeOrder: string = '';
  groupedOrders: Order[] = [];
  ordersByDish: Map<Dish, number> = new Map();

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

  dishByCustomer() {
    const itemsByCustomer: Map<String, Map<number, OrderItem>> = new Map();
    this.orders.forEach(order => {
      const alias = order.customerAlias;
      if (alias) {
        const itemById = itemsByCustomer.get(alias) || new Map();
        (order.items || []).forEach(item => {
          const dish = itemById.get(item.dish.id);
          if (dish) dish.quantity += item.quantity;
          else itemById.set(item.dish.id, item);
        });
        itemsByCustomer.set(alias, itemById);
      }
    });
    this.groupedOrders = Object
      .entries(itemsByCustomer)
      .map(([custId, itemByDishId]) => {
        const order = new Order();
        order.customerAlias = custId;
        order.items = Object.values(itemByDishId);
        return order;
      })
  }

  importFromSkype(importModal) {
    this.modalService
      .open(importModal)
      .result
      .then(
        order => {
          this.orderService
            .createOrder(order)
            .subscribe(o => {
              this.orders.push(o);
              this.parsedOrder = undefined;
              this.skypeOrder = "";
            });
        },
        () => {
          this.parsedOrder = undefined;
        });
  }

  parse() {
    this.orderService
      .parseOrder(this.skypeOrder)
      .subscribe(order => {
        this.parsedOrder = order;
      });
  }

}
