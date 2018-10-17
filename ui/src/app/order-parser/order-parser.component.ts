import {Component, OnInit, ViewChild} from '@angular/core';
import {Order} from '../model/order';
import {OrderService} from '../services/order.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-parser',
  templateUrl: './order-parser.component.html',
  styleUrls: ['./order-parser.component.scss']
})
export class OrderParserComponent implements OnInit {

  skypeOrder: string = "";
  parsedOrder: Order;
  editCustomer: boolean = true;
  @ViewChild('modalImport') modalImport;

  constructor(private orderService: OrderService, private modalService: NgbModal) { }

  ngOnInit() {
  }

  parse() {
    this.orderService
      .parseOrder(this.skypeOrder)
      .subscribe(order => {
        const o = new Order();
        o.customerAlias = order.customerAlias;
        o.timestamp = order.timestamp;
        o.addOrder(order);
        this.parsedOrder = o;
      });
  }

  open(): Promise<any> {
    return this.modalService.open(this.modalImport).result;
  }

  cleanup() {
    this.skypeOrder = "";
    this.parsedOrder = undefined;
  }

}
