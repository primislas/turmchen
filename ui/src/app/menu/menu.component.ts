import {Component, OnInit} from '@angular/core';
import {Customer} from '../model/customer';
import {Dish} from '../model/dish';
import {MenuService} from '../services/menu.service';
import {Order} from '../model/order';
import {OrderService} from '../services/order.service';
import {CustomerService} from '../services/customer.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TimeService} from '../services/time.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  customers: Customer[] = [];
  dishes: Dish[] = [];
  dishIds: Set<number> = new Set<number>();
  filters: DishFilter[] = [];
  categories: Set<string> = new Set<string>();
  days: Set<string> = new Set<string>(['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ']);
  filteredDishes: Dish[];
  order: Order = new Order();

  constructor(
    private dishService: MenuService,
    private orderService: OrderService,
    private customerService: CustomerService,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this.filters = [
      new DishFilter(0, (dishes, val) => {
        if (val.length > 0) return dishes.filter(d => d.name.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) >= 0);
        else return dishes;
      }),
      new DishFilter(1, (dishes, val) => {
        if (val.length > 0) return dishes.filter(d => d.name.toLowerCase().indexOf(val.toLowerCase()) >= 0);
        else return dishes;
      }),
      new DishFilter(2, undefined),
      new DishFilter(3, undefined),
      new DishFilter(
        4,
        (dishes, val) => {
          if (val.length > 0) return dishes.filter(d => d.categorySet.has(val));
          else return dishes;
        },
        []),
      new DishFilter(
        5,
        (dishes, val) => {
          this.order.items = this.order.items.filter(i => i.dish.daySet.has(val));
          this.order.recalcPrice();

          if (val.length > 0) return dishes.filter(d => d.daySet.has(val));
          else return dishes;
        },
        ['', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'])
    ];
    this.loadDishes();
  }

  search(filter: DishFilter) {
    filter.apply(this.dishes);
    const filteredIds = this.filters
      .filter(f => f.value.length > 0)
      .map(f => f.dishIds)
      .reduce(this.numberIntersection, this.dishIds);
    this.filteredDishes = this.dishes.filter(d => filteredIds.has(d.id));
  }

  orderDish(dish) {
    this.order.add(dish);
  }

  confirmOrder(dialogue) {
    const millis = TimeService.millisecondsOfDay(this.filters[5].value);
    console.log(`Making an order with timestamp of ${millis}`);
    this.order.timestamp = millis;
    this.modalService
      .open(dialogue)
      .result
      .then(customer => {
        this.order.customerAlias = customer;
        this.orderService
          .createOrder(this.order)
          .subscribe(() => this.order.items = []);
      });
  }

  numberIntersection(setA, setB): Set<number> {
    let _intersection = new Set();
    setB.forEach(elem => {
      if (setA.has(elem)) _intersection.add(elem);
    });
    return _intersection;
  }

  stringUnion(setA, setB): Set<string> {
    setB.forEach(elem => setA.add(elem));
    return setA;
  }

  loadDishes(): void {
    this.dishService.getDishes()
      .subscribe(dishes => {
        this.dishes = dishes;
        this.filteredDishes = dishes;
        this.dishIds = new Set<number>(dishes.map(d => d.id));
        const categories = this.dishes
          .map(d => d.categorySet)
          .reduce(this.stringUnion, new Set<string>());
        this.filters[4].select = [''].concat(Array.from(categories));
        this.filters[5].value = TimeService.nextDayName();
        this.search(this.filters[5]);
      });
  }

}

class DishFilter {
  id: number;
  value: string = '';
  select: string[] = [];
  filter: (dishes: Dish[], value: string) => Dish[];
  dishIds: Set<number> = new Set<number>();

  apply(dishes: Dish[]) {
    if (this.value.length < 1) return dishes;
    const filtered = this.filter(dishes, this.value);
    this.dishIds = new Set(filtered.map(d => d.id));
    return filtered;
  }

  constructor(id: number, filter: (dishes: Dish[], value: string) => Dish[], values?: string[]) {
    this.id = id;
    this.filter = filter;
    this.select = values || [];
  }
}
