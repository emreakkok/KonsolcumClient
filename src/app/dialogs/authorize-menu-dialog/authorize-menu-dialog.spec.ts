import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeMenuDialog } from './authorize-menu-dialog';

describe('AuthorizeMenuDialog', () => {
  let component: AuthorizeMenuDialog;
  let fixture: ComponentFixture<AuthorizeMenuDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthorizeMenuDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeMenuDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
