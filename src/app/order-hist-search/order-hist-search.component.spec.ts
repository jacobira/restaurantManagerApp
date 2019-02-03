import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistSearchComponent } from './order-hist-search.component';

describe('OrderHistSearchComponent', () => {
  let component: OrderHistSearchComponent;
  let fixture: ComponentFixture<OrderHistSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderHistSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
