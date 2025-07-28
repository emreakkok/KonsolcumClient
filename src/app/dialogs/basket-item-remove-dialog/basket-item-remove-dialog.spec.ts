import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasketItemRemoveDialog } from './basket-item-remove-dialog';

describe('BasketItemRemoveDialog', () => {
  let component: BasketItemRemoveDialog;
  let fixture: ComponentFixture<BasketItemRemoveDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BasketItemRemoveDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasketItemRemoveDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
