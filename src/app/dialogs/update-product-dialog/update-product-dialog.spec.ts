import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProductDialog } from './update-product-dialog';

describe('UpdateProductDialog', () => {
  let component: UpdateProductDialog;
  let fixture: ComponentFixture<UpdateProductDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateProductDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateProductDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
