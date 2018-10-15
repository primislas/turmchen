import {OrderItem} from './order.item';
import {Customer} from './customer';
import {Dish} from './dish';

export class Order {
  id: number;
  title: string;
  price: number = 0;
  customerAlias: string;
  customer: Customer;
  timestamp: number;
  items: OrderItem[] = [];

  static fromJsonObj(obj): Order {
    const order = obj ? Object.assign(new Order(), obj) : {};
    order.items = (obj.items || []).map(OrderItem.fromJsonObj);
    return order;
  }

  add(dish: Dish): Order {
    const oItem = this.items.find(i => i.dish.id === dish.id);
    if (oItem) {
      oItem.quantity += 1;
      oItem.recalcPrice();
    } else {
      const newItem = new OrderItem(dish, 1);
      this.items.push(newItem);
    }
    this.recalcPrice();
    console.log(`Updated order with ${dish.name}, new price = ${this.price}`);
    return this;
  }

  removeDish(index: number) {
    this.items.splice(index, 1);
    this.recalcPrice();
  }

  recalcPrice(item?: OrderItem): Order {
    if (item) item.recalcPrice();
    this.price = this.items.map(i => i.price).reduce((a,b) => a + b, 0);
    return this;
  }

}
