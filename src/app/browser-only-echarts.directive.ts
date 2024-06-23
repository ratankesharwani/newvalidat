import { Directive, Inject, PLATFORM_ID, ElementRef, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgxEchartsDirective, NGX_ECHARTS_CONFIG } from 'ngx-echarts';

@Directive({
  selector: '[appBrowserOnlyEcharts]',
  standalone:true
})
export class BrowserOnlyEchartsDirective extends NgxEchartsDirective  implements AfterViewInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    el: ElementRef,
    ngZone: NgZone,
    @Inject(NGX_ECHARTS_CONFIG) config: any
  ) {
    super(config, el, ngZone);
  }

  override ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      super.ngOnInit();
    }
  }
  override ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      super.ngAfterViewInit();
    }
  }
  override ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      super.ngOnDestroy();
    }
  }
}
