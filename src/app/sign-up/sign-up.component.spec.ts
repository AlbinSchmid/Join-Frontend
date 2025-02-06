import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { SignUpComponent } from './sign-up.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpComponent],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
      ]
    })
      .compileComponents();
      
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
