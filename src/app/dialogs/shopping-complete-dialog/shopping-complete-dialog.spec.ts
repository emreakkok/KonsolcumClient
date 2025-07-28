import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCompleteDialog } from './shopping-complete-dialog';

describe('ShoppingCompleteDialog', () => {
  let component: ShoppingCompleteDialog;
  let fixture: ComponentFixture<ShoppingCompleteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShoppingCompleteDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingCompleteDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
