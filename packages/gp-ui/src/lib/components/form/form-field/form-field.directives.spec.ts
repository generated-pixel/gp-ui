import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  GpPrefixDirective,
  GpSuffixDirective,
  GpHelperDirective,
  GpErrorDirective
} from './form-field.directives';

@Component({
  standalone: true,
  imports: [GpPrefixDirective, GpSuffixDirective, GpHelperDirective, GpErrorDirective],
  template: `
    <div>
      <span gpPrefix>Prefix</span>
      <span gpSuffix>Suffix</span>
      <span gpHelper>Helper text</span>
      <span gpError>Error text</span>
    </div>
  `
})
class TestHostComponent {}

describe('FormField Directives', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should instantiate all form field slot directives', () => {
    expect(fixture.nativeElement.textContent).toContain('Prefix');
    expect(fixture.nativeElement.textContent).toContain('Suffix');
    expect(fixture.nativeElement.textContent).toContain('Helper text');
    expect(fixture.nativeElement.textContent).toContain('Error text');
  });
});
