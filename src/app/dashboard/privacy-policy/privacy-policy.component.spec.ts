import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivacyPolicyComponent } from './privacy-policy.component';

describe('PrivacyPolicyComponent', () => {
  let component: PrivacyPolicyComponent;
  let fixture: ComponentFixture<PrivacyPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPolicyComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(PrivacyPolicyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('scrollToSection should call scrollIntoView with smooth behavior when element exists', () => {
    const mockElement = { scrollIntoView: jasmine.createSpy('scrollIntoView') } as any;
    spyOn(document, 'getElementById').and.returnValue(mockElement);
    component.scrollToSection('section-id');
    expect(document.getElementById).toHaveBeenCalledWith('section-id');
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('scrollToSection should not throw when element does not exist', () => {
    spyOn(document, 'getElementById').and.returnValue(null);
    expect(() => component.scrollToSection('missing-id')).not.toThrow();
    expect(document.getElementById).toHaveBeenCalledWith('missing-id');
  });
});
