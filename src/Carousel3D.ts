
import anime from 'animejs';
import CarouselItem from './CarouselItem';

/**
 * @author  raizensoft.com
 */
const ROTATE_SPEED = 0.05;

/**
 * Carousel3D
 * @class Carousel3D
 */
export default class Carousel3D {

  size:number;
  el:HTMLDivElement;
  imgEl:HTMLImageElement;
  canvasEl:HTMLCanvasElement;
  rid:number;
  xAngle:number;
  yAngle:number;
  scale:number;
  total:number;
  radius:number;
  citems:CarouselItem[];
  tiltAngle:number;
  drag: boolean = false;
  startingX: number | undefined;
  startingY: number | undefined;
  lastMouseX: number | undefined;


  constructor(size:number = 400, total:number = 15, radius:number = 1000) {

    // Item size and default total items
    this.size = size;
    this.total = total;
    this.radius = radius;
    this.tiltAngle = 0;
    this.init();
  }

  /**
   * Init class components
   * @method init
   */
  private init() {

    try{

      const el = this.el = document.querySelector('.carousel-3d')
      if(!this.el) return;
      // Image and canvas element

      // Original angle and scale
      this.xAngle = this.yAngle = 0;
      this.scale = 1;

      // Generate carousel items
      this.citems = document.querySelectorAll('.scene .carousel-item') as any;

      if(!this.citems.length) return;
      this.total = this.citems.length;

      const angleSegment = 360 / this.total;
      for (let i = 0; i < this.total; i++) {
        new CarouselItem(this.citems[i], this).setPosition(angleSegment * i);
        let player = new Vimeo.player(this.citems[i]);
        player.on('play', () => {

        });
        player.on('stop', () => {

        });
      }

      // Track mouse position
      document.body.addEventListener('pointermove', (e:PointerEvent) => {

        const height = document.body.offsetHeight;
        //console.log((e.clientY - height) / height);
        this.tiltAngle = (height - e.clientY) / height - 0.5;
        // console.log((height - e.clientY) / height - 0.5);
      });

      // Get the Slider Container

      let sliderContainer = document.querySelector('.scene') as HTMLDivElement;

      if(sliderContainer) {
        sliderContainer.addEventListener('touchstart', this.downListener)
        sliderContainer.addEventListener('mousedown', this.downListener)
        sliderContainer.addEventListener('touchmove', this.moveListener)
        sliderContainer.addEventListener('mousemove', this.moveListener)
        sliderContainer.addEventListener('mouseup', this.upListener)
        sliderContainer.addEventListener('touchend', this.upListener)
        sliderContainer.addEventListener('mouseout', this.mouseoutListener)
      }

    }
    catch (e) {
      console.error(e)
    }
  }

  loadImageSet(imgSet:any[]) {

    // Assign image to each cube face
    for (let i = 0; i < this.el.children.length; i++) {

      const item = this.el.children[i] as HTMLDivElement;
      item.style.backgroundImage = `url(${imgSet[i]})`;
      item.style.backgroundColor = 'transparent';
    }

  }

  /**
   * Start animation using requestAnimationFrame
   */
  startAnimate = () => {

    const doAnimate = () => {
      this.rid = requestAnimationFrame(doAnimate);
      this.yAngle += ROTATE_SPEED;
      this.xAngle += (-this.tiltAngle * 20 - this.xAngle) * 1;
      this.el.style.transform = `scale(${this.scale}) translateZ(-1100px) rotateX(${this.xAngle}deg) rotateY(${this.yAngle}deg)`;

    };
    doAnimate();
  }

  stopAnimate = () => {
    cancelAnimationFrame(this.rid);
  }

  resetPosition = () => {
    this.startingX = undefined
    this.startingY = undefined
    this.drag = false
    this.startAnimate()
  }

  mouseoutListener = (e) => {
    if(this.drag && (!e.relatedTarget || e.relatedTarget.nodeName == 'HTML')) {
      this.resetPosition()
    }
  }

  moveListener = (e) => {
    const moveX = Math.abs(e.pageX - this.startingX)
    const moveY = Math.abs(e.pageY - this.startingY)
    if (moveX >= 5 || moveY >= 5) {
      if(!isNaN(e.pageX - this.lastMouseX)){
        this.drag = true
        this.yAngle += ROTATE_SPEED * (e.pageX - this.lastMouseX);
        this.xAngle += (-this.tiltAngle * 20 - this.xAngle) * 0.01;
        this.el.style.transform = `scale(${this.scale}) translateZ(-1100px) rotateX(${this.xAngle}deg) rotateY(${this.yAngle}deg)`;
      }
    }
    this.lastMouseX = e.pageX
  }

  downListener = (event) => {
    this.drag = false
    this.startingX = event.pageX
    this.startingY = event.pageY
    this.stopAnimate()
  }

  upListener = () => {
    this.resetPosition()
  }
}
