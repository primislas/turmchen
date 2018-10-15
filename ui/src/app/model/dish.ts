export class Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  aliases: string[] = [];
  aliasSet: Set<string>;
  categories: string[] = [];
  categorySet: Set<string>;
  schedule: string[];
  days: string[] = [];
  daySet: Set<string>;
  displaySchedule: string;
  weight: number;

  static fromJsonObj(obj) {
    return Object.assign(new Dish(), obj);
  }
}
