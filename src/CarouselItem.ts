
/**
 * @author  raizensoft.com
 */

import Carousel3D from "./Carousel3D";

/**
 * CarouselItem
 * @class CarouselItem
 */
export default class CarouselItem {

  c3d:Carousel3D;
  el:HTMLDivElement;
  angle:number;

  constructor(children?:HTMLDivElement, c3d?:Carousel3D) {

    this.c3d = c3d || new Carousel3D();
    this.angle = 0;
    this.init(children);
  }

  /**
   * Init class components
   * @method init
   */
  private init(children?:HTMLDivElement){

    const el = this.el = children || document.createElement('div');
    el.style.width = `${this.c3d.size/2}px`;
    el.style.height = `${this.c3d.size}px`;
  }

  /**
   * Set carousel position based on angle
   */
  setPosition(angle:number) {

    this.angle = angle;
    const xpos = Math.cos(angle * Math.PI / 180) * this.c3d.radius;
    const zpos = Math.sin(angle * Math.PI / 180) * this.c3d.radius;
    this.el.style.transform = `translateX(${xpos}px) translateZ(${zpos}px) rotateY(${90 - angle}deg) `;
  }
  
  setBackground(url:string) {
    this.el.style.background = `url${url}`;
  }
}
