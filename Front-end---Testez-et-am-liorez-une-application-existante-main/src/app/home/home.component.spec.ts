import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, BehaviorSubject } from 'rxjs';
import { AuthService } from '../core/service/auth.service';
import { UserService } from '../core/service/user.service';

// ------- MOCKS -------
class MockAuthService {
  private state = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.state.asObservable();
  setLoginState(v: boolean) {
    this.state.next(v);
  }
}

class MockUserService {
  getAllUsers() {
    return of([]);
  }
  deleteUser(id: number) {
    return of(null);
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: UserService, useClass: MockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
