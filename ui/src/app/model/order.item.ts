import {Dish} from './dish';

export class OrderItem {
  id: number;
  dish: Dish;
  quantity: number = 0;
  price: number = 0;

  constructor(dish?: Dish, quantity?: number) {
    if (dish) {
      this.quantity = quantity || 1;
      this.dish = dish;
      this.recalcPrice();
    }
  }

  static fromJsonObj(obj): OrderItem {
    const item = Object.assign(new OrderItem(), obj);
    item.dish = Object.assign(Dish.fromJsonObj(obj.dish) || {});
    return item;
  }

  recalcPrice(): OrderItem {
    console.log(`${this.price} = ${this.dish.price} * ${this.quantity}`);
    if (this.dish) this.price = this.dish.price * this.quantity;
    return this;
  }
}
