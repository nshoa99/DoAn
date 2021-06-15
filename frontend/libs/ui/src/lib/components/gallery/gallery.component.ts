/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ui-gallery',
  templateUrl: './gallery.component.html',
  styles: [
  ]
})
export class GalleryComponent implements OnInit {
  selectedImageUrl: string | undefined;
  @Input() images: any;
  constructor() { }

  ngOnInit(): void {
    if(this.hasImages){
      this.selectedImageUrl = this.images[0];
    }

  }
  changeSelectedImage(imageUrl: string){
    this.selectedImageUrl = imageUrl
  }

  get hasImages(){
    return this.images?.length > 0;
  }

}
