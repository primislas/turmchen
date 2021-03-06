import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {OrdersComponent} from './orders/orders.component';
import {MenuComponent} from './menu/menu.component';
import {CustomersComponent} from './customers/customers.component';
import {AppRoutingModule} from './app-routing.module';
import {DataTableModule} from 'angular-6-datatable';
import {Ng2SmartTableModule} from 'ng2-smart-table';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { OrderComponent } from './order/order.component';
import { OrderParserComponent } from './order-parser/order-parser.component';

@NgModule({
  declarations: [
    AppComponent,
    OrdersComponent,
    MenuComponent,
    CustomersComponent,
    OrderComponent,
    OrderParserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    DataTableModule,
    Ng2SmartTableModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
