import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactButtonComponent } from './contact-button.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ContactButtonComponent', () => {
  let component: ContactButtonComponent;
  let fixture: ComponentFixture<ContactButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactButtonComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi())
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ContactButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
