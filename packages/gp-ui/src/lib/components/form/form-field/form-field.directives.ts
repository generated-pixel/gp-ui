import { Directive } from '@angular/core';

@Directive({
  selector: '[gpPrefix]',
  standalone: true
})
export class GpPrefixDirective {}

@Directive({
  selector: '[gpSuffix]',
  standalone: true
})
export class GpSuffixDirective {}

@Directive({
  selector: '[gpHelper]',
  standalone: true
})
export class GpHelperDirective {}

@Directive({
  selector: '[gpError]',
  standalone: true
})
export class GpErrorDirective {}
