import anime from 'animejs';
import Player from '@vimeo/player';
import CarouselItem from './CarouselItem';


/**
 * @author  raizensoft.com
 */
const ROTATE_SPEED = 0.08;

/**
 * Carousel3D
 * @class Carousel3D
 */
export default class Carousel3D {

    size: number;
    el: HTMLDivElement;
    imgEl: HTMLImageElement;
    canvasEl: HTMLCanvasElement;
    rid: number;
    xAngle: number;
    yAngle: number;
    scale: number;
    total: number;
    radius: number;
    citems: NodeListOf<HTMLDivElement>;
    tiltAngle: number;
    drag: boolean = false;
    startingX: number | undefined;
    startingY: number | undefined;
    lastMouseX: number | undefined;


    constructor(size: number = 400, total: number = 15, radius: number = 1000) {

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

        try {

            const el = this.el = document.querySelector('.carousel-3d') || document.createElement('div');
            if (!this.el) return;
            // Image and canvas element

            // Original angle and scale
            this.xAngle = this.yAngle = 0;
            this.scale = 1;

            // Generate carousel items
            this.citems = document.querySelectorAll('.scene .carousel-item')
            this.citems.length && (() => {
                this.total = this.citems.length;

                const angleSegment = 360 / this.total;
                for (let i = 0; i < this.total; i++) {

                    new CarouselItem(this.citems[i], this).setPosition(angleSegment * i);
                    const childComment = this.citems[i].querySelector('.carousel-item-comment') as HTMLDivElement;

                    let player = new Player(this.citems[i]);
                    player.on('play', () => {
                        childComment && childComment.style && (childComment.style.transform = 'rotateY(360deg)')
                        this.stopAnimate();
                    });
                    player.on('pause', () => {
                        this.startAnimate();
                        childComment && childComment.style && (childComment.style.transform = 'rotateY(0deg)')
                    });
                }

                // Get the Slider Container
                let sliderContainer = document.querySelector('.scene') as HTMLDivElement;
                if (sliderContainer) {
                    sliderContainer.addEventListener('touchstart', this.downListener)
                    sliderContainer.addEventListener('mousedown', this.downListener)
                    sliderContainer.addEventListener('touchmove', this.moveListener)
                    sliderContainer.addEventListener('mousemove', this.moveListener)
                    sliderContainer.addEventListener('mouseup', this.upListener)
                    sliderContainer.addEventListener('touchend', this.upListener)
                    sliderContainer.addEventListener('mouseout', this.mouseoutListener)
                }
            })();
            // Track mouse position
            document.body.addEventListener('pointermove', (e: PointerEvent) => {

                const height = document.body.offsetHeight;
                //console.log((e.clientY - height) / height);
                this.tiltAngle = (height - e.clientY) / height - 0.5;
            });

            if (!this.citems.length) return;

        } catch (e) {
            console.error(e)
        }
    }

    loadImageSet(imgSet: any[]) {

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
            if (this.rid) cancelAnimationFrame(this.rid);
            this.rid = requestAnimationFrame(doAnimate);
            this.yAngle += ROTATE_SPEED;
            this.xAngle += (-this.tiltAngle * 20 - this.xAngle) * 0.05;
            this.el.style.transform = `scale(${this.scale}) translateZ(-1200px) rotateX(${this.xAngle}deg) rotateY(${this.yAngle}deg)`;

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

    mouseoutListener = (e: any) => {
        if (this.drag && (!e.relatedTarget || e.relatedTarget.nodeName == 'HTML')) {
            this.resetPosition()
        }
    }

    moveListener = (e: any) => {
        const moveX = this.startingX ? Math.abs(e.pageX - this.startingX) : 0
        const moveY = this.startingY ? Math.abs(e.pageY - this.startingY) : 0
        if (moveX >= 5 || moveY >= 5) {
            if (this.lastMouseX && !isNaN(e.pageX - this.lastMouseX)) {
                this.drag = true
                this.yAngle += ROTATE_SPEED * (e.pageX - this.lastMouseX);
                this.xAngle += (-this.tiltAngle * 20 - this.xAngle) * 0.05;
                this.el.style.transform = `scale(${this.scale}) translateZ(-1300px) rotateX(${this.xAngle}deg) rotateY(${this.yAngle}deg)`;
            }
        }
        this.lastMouseX = e.pageX
    }

    downListener = (e: any) => {
        this.drag = false
        this.startingX = e.pageX
        this.startingY = e.pageY
        this.stopAnimate()
    }

    upListener = () => {
        this.resetPosition()
    }
}
