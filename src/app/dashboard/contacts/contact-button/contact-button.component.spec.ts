import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactButtonComponent } from './contact-button.component';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { ApiService } from '../../../shared/services/api.service';
import { CommonModule } from '@angular/common';
import { ContactInterface } from '../../../shared/interfaces/contact-interface';

describe('ContactButtonComponent', () => {
  let component: ContactButtonComponent;
  let fixture: ComponentFixture<ContactButtonComponent>;
  let dashboardService: DashboardService;
  let apiServiceStub: ApiService;

  const sampleContact: ContactInterface = {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    phone: '123',
    color: '#FFF'
  };

  beforeEach(async () => {
    apiServiceStub = {} as ApiService;

    await TestBed.configureTestingModule({
      imports: [CommonModule, ContactButtonComponent],
      providers: [
        DashboardService,
        { provide: ApiService, useValue: apiServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactButtonComponent);
    component = fixture.componentInstance;
    dashboardService = TestBed.inject(DashboardService);
    component.contact = sampleContact;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit adds category letter if not present', () => {
    dashboardService.contactCategoryLetters = [];
    component.showCaterogyLetter = false;
    component.categoryLetter = '';

    component.ngOnInit();

    expect(component.showCaterogyLetter).toBeTrue();
    expect(component.categoryLetter).toBe('A');
    expect(dashboardService.contactCategoryLetters).toContain('A');
  });

  it('ngOnInit does not add category letter if already present', () => {
    dashboardService.contactCategoryLetters = ['A'];
    component.showCaterogyLetter = false;
    component.categoryLetter = '';

    component.ngOnInit();

    expect(component.showCaterogyLetter).toBeFalse();
    expect(component.categoryLetter).toBe('');
    expect(dashboardService.contactCategoryLetters.filter(l => l === 'A').length).toBe(1);
  });

  it('openContactDetailView sets dashboardService flags and contact', () => {
    dashboardService.contactDetailView = false;
    dashboardService.currentContact = { id: 0, name: '', email: '', phone: '', color: '' } as any;

    component.openContactDetailView();

    expect(dashboardService.contactDetailView).toBeTrue();
    expect(dashboardService.currentContact).toEqual(sampleContact);
  });
});
