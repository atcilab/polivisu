import { Directive, Input, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "img[imgFallback]",
})
export class ImgFallbackDirective {
  @Input() imgFallback: string;
  constructor(private _elRef: ElementRef) {}

  @HostListener("error")
  loadFallbackOnError() {
    const el: HTMLImageElement = this._elRef.nativeElement;
    el.src = this.imgFallback || "assets/images/no_image.svg";
  }
}
