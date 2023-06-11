import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileItrComponent } from './file-itr.component';

describe('FileItrComponent', () => {
  let component: FileItrComponent;
  let fixture: ComponentFixture<FileItrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileItrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileItrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
