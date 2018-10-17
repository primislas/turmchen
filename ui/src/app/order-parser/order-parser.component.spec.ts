import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderParserComponent } from './order-parser.component';

describe('OrderParserComponent', () => {
  let component: OrderParserComponent;
  let fixture: ComponentFixture<OrderParserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderParserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
