import {Directive, ElementRef, Input} from '@angular/core';
import {animate, spring, stagger} from "motion";

@Directive({
  selector: "[fadeInAnim]"
})
export class FadeInDirective {

  @Input() fadeInAnimDelay: number | 0;
  @Input() fadeInElementClass: string;

  constructor(private element: ElementRef) {
  }

  ngOnInit() {
    this.animateProfileBoxes();
  }

  animateProfileBoxes() {
    animate(
      this.element.nativeElement.querySelectorAll(`.${this.fadeInElementClass}`),
      {transform: ["translateY(10%)", "translateY(0)"], opacity: [0, 1]},
      {offset: [0, 1], duration: 4, easing: spring(), delay: stagger(this.fadeInAnimDelay)},
    ).finished.then(() => {
    });
  }

}

