import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {Dish} from '../model/dish';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private dishesEndpoint = "/turmchen/dishes";
  private dishEndpoint = id => `${this.dishesEndpoint}/${id}`;

  constructor(private http: HttpClient) { }

  getDishes(): Observable<Dish[]> {
    return this.http
      .get<Dish[]>(this.dishesEndpoint)
      .pipe(
        map(dishes => dishes.map(MenuService.prepDish)),
        catchError(error => {
          console.log(`Error while fetching dishes: ${JSON.stringify(error)}`);
          return throwError(error);
        })
      );
  }

  static prepDish(d): Dish {
    const ruSchedule = (d.schedule || []).map(MenuService.dayToRu);
    d.daySet = new Set<string>(ruSchedule);
    d.displaySchedule = (d.daySet.size === 5) ? "Все дни" : ruSchedule.join(", ");
    d.categorySet = new Set<string>(d.categories);
    d.aliasSet = new Set<string>(d.aliases);
    return d;
  }

  static dayToRu(d): string {
    if (d === "MONDAY") return "ПН";
    else if (d === "TUESDAY") return "ВТ";
    else if (d === "WEDNESDAY") return "СР";
    else if (d === "THURSDAY") return "ЧТ";
    else if (d === "FRIDAY") return "ПТ";
  }

  getDish(id): Observable<Dish> {
    return this.http
      .get<Dish>(this.dishEndpoint(id))
      .pipe(
        tap(dish => console.log(`Received a dish: ${dish}`)),
        catchError(e => {
          console.log(`Error while fetching dishes: ${e}`);
          return throwError(e);
        })
      )
  }
}
