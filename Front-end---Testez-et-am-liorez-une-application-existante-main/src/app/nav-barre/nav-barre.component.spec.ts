import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NavBarreComponent } from './nav-barre.component';
import { AuthService } from '../core/service/auth.service';

describe('NavBarreComponent', () => {
  let component: NavBarreComponent;
  let fixture: ComponentFixture<NavBarreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarreComponent, HttpClientTestingModule], 
      providers: [AuthService], 
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
