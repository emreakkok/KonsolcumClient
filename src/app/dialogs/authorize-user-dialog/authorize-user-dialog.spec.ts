import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeUserDialog } from './authorize-user-dialog';

describe('AuthorizeUserDialog', () => {
  let component: AuthorizeUserDialog;
  let fixture: ComponentFixture<AuthorizeUserDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorizeUserDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeUserDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
