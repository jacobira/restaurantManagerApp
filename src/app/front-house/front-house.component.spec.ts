import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontHouseComponent } from './front-house.component';

describe('FrontHouseComponent', () => {
  let component: FrontHouseComponent;
  let fixture: ComponentFixture<FrontHouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontHouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontHouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
