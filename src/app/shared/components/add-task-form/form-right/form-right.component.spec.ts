import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRightComponent } from './form-right.component';

describe('FormRightComponent', () => {
  let component: FormRightComponent;
  let fixture: ComponentFixture<FormRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
