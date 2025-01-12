import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLeftComponent } from './form-left.component';

describe('FormLeftComponent', () => {
  let component: FormLeftComponent;
  let fixture: ComponentFixture<FormLeftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLeftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
