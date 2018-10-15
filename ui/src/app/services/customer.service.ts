import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Customer} from '../model/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private CUSTOMERS: Customer[] = [
    {id: 1, firstName: 'Constantine', lastName: 'Lamed', aliases: new Set(['constantine.2'])},
    {id: 2, firstName: 'Xiu Sha Balnovtsu', lastName: 'Banovski', aliases: new Set(['xiubanovski'])}
  ];
  private customersEndpoint = '/customers';
  private customerEndpoint = id => `${this.customersEndpoint}/${id}`;
  private customerByAliasEndpoint = alias => `${this.customersEndpoint}?alias=${alias}`;

  constructor(private http: HttpClient) {
  }

  getCustomers(): Observable<Customer[]> {
    return of(this.CUSTOMERS);
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.http
      .get<Customer>(this.customerEndpoint(id))
      .pipe(
        map((response: Response) => {
          return response
            .json()
            .then(obj => obj.entry as Customer);
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  getCustomerByAlias(alias: string): Observable<Customer> {
    return this.http
      .get<Customer>(this.customerByAliasEndpoint(alias))
      .pipe(
        map((response: Response) => {
          return response
            .json()
            .then(obj => obj.entry as Customer);
        })
      )
  }

}
