import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItrTableComponent } from './itr-table.component';

describe('ItrTableComponent', () => {
  let component: ItrTableComponent;
  let fixture: ComponentFixture<ItrTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItrTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItrTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
