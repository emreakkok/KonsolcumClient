import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectProductImageDialog } from './select-product-image-dialog';

describe('SelectProductImageDialog', () => {
  let component: SelectProductImageDialog;
  let fixture: ComponentFixture<SelectProductImageDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectProductImageDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectProductImageDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
