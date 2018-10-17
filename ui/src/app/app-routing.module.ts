import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {CustomersComponent} from './customers/customers.component';
import {MenuComponent} from './menu/menu.component';
import {OrdersComponent} from './orders/orders.component';

const routes: Routes = [
  {path: '', redirectTo: '/orders', pathMatch: 'full'},
  {path: 'orders', component: OrdersComponent},
  {path: 'menu', component: MenuComponent},
  {path: 'customers', component: CustomersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

