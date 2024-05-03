import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  NgZone,
  OnDestroy, OnInit,
  Output,
} from '@angular/core';
import { NAVIGATOR, NAVIGATOR_PROVIDER } from '../services/navigator.service';

@Directive({
  selector: '[snakeCameraFeed]',
  standalone: true,
  providers: [NAVIGATOR_PROVIDER],
})
export class CameraFeedDirective implements OnInit, OnDestroy {
  @Output() cameraFeedCreated = new EventEmitter<void>();

  @HostBinding('attr.autoplay') autoplay = true;
  @HostBinding('attr.muted') muted = true;
  @HostBinding('attr.playsinline') playsinline = true;

  constructor(
    private readonly _elementRef: ElementRef<HTMLVideoElement>,
    @Inject(NAVIGATOR) private readonly _navigator: Navigator,
    private readonly _zone: NgZone,
  ) {
    if (typeof this._elementRef.nativeElement.play !== 'function') {
      throw new Error(
        'Oops! Looks like you added the CameraFeedDirective to the wrong element. It only works on <video> elements.',
      );
    }
  }

  ngOnInit() {
    this._zone.runOutsideAngular(() => {
      this._navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: 'user',
          },
          audio: false,
        })
        .then((localMediaStream) => {
          const nativeElement = this._elementRef.nativeElement;
          nativeElement.srcObject = localMediaStream;
          nativeElement.play();
          this.cameraFeedCreated.emit();
        })
        .catch((err) => {
          console.error(`Oops. Could not initialize camera stream!`, err);
        });
    });
  }

  ngOnDestroy(): void {
    if (this._elementRef.nativeElement.srcObject) {
      (this._elementRef.nativeElement.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      this._elementRef.nativeElement.srcObject = null;
    }
  }
}
