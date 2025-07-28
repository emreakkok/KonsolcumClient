import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeMenu } from './authorize-menu';

describe('AuthorizeMenu', () => {
  let component: AuthorizeMenu;
  let fixture: ComponentFixture<AuthorizeMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorizeMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
