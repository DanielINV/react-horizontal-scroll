import { EventEmitter } from 'events';
import VirtualScroll from 'virtual-scroll';
import raf from 'raf';
import transform from 'prefix';

export default class HorizontalScroll extends EventEmitter {

	constructor(opts) {
		super();

		this._bind();

		// Set default options
		this.options = Object.assign({
			container: opts.container,
			blocks: opts.blocks,
			isAnimated: opts.isAnimated || false,
			spring: opts.spring  || 0.1,
			skewReducer: opts.skewReducer || 20,
			skewLimit: opts.skewLimit || 30,
		}, opts);

		this.vars = {
			scrollValue: 0,
			oldScrollValue: 0,
			scrollTarget: 0,
			scrollLeft: 0,
			scrollRight: 0,
			spring: this.options.spring,
			direction: 0,
			speed: 0,
			speedTarget: 0,
			dragStart: 0,
		};

		//this.wrapper = document.createElement('div');
		//this.wrapper.setAttribute('class', 'horizontal-scroll');

		this.wrapper = document.querySelector('.horizontal-scroll');
		document.querySelector('.hs-overlay').setAttribute('draggable', true);

		this.vs = new VirtualScroll();
		this.transform = transform('transform');

		this.raf = raf;

		this._setUI();
		this._addEvents();
		this.onResize();

	}

	// PRIVATE

	/**
	 * Biding methods
	 *
	 */
	_bind() {
		this._update = this._update.bind(this);
		this.onResize = this.onResize.bind(this);
		this._onDrag = this._onDrag.bind(this);
		this._onDragStart = this._onDragStart.bind(this);
	}

	/**
	 * Add all events
	 *
	 */
	_addEvents() {
		this.vs.on(this._onScroll, this);
		this.raf(this._update);
		window.addEventListener('resize', this.onResize);
		document.querySelector('.hs-overlay').addEventListener('drag', this._onDrag);
		document.querySelector('.hs-overlay').addEventListener('dragstart', this._onDragStart);
	}

	/**
	 * Remove all events
	 *
	 */
	_removeEvents() {
		this.raf.cancel(this._update);
		this.raf(this._update);
		window.removeEventListener('resize', this.onResize);
	}

	/**
	 * Set the UI
	 *
	 */
	_setUI() {
/*
		Object.assign(this.wrapper.style ,{
			position: 'absolute',
			top: '0',
			left: '0',
			'backface-visibility': 'hidden',
			'will-change': 'transform'
		});

		Object.assign(this.options.container[0].style ,{
			'white-space': 'nowrap',
			'position': 'relative',
		});
*/
/*
		Array.prototype.forEach.call(this.options.blocks, block => {
			block.style.display = 'inline-block';
			this.options.container[0].replaceChild(this.wrapper, block);
			this.wrapper.appendChild(block);
		});

		//this.options.container[0].appendChild(this.wrapper);
*/
	}

	/**
	 * Trigger when user scroll
	 *
	 */
     _onScroll(e) {

		if (e.deltaX > 0) {
			this.vars.direction = 1;
		} else {
			this.vars.direction = -1;
		}

		this.vars.scrollTarget += e.deltaX * -1;
		this.vars.scrollTarget = Math.round(Math.max(this.vars.scrollLeft, Math.min(this.vars.scrollTarget, this.vars.scrollRight)));

	}

	/**
	 * RAF
	 *
	 */
	_update() {

		// SCROLL VALUE
		this.vars.scrollValue += (this.vars.scrollTarget - this.vars.scrollValue) * this.vars.spring;

		// DELTA
		let delta = this.vars.scrollTarget - this.vars.scrollValue;
		let skew = delta / this.options.skewReducer;
		this.vars.speed = this._clamp(-skew, -this.options.skewLimit, this.options.skewLimit);

		// TRANSFORM
		if (this.options.isAnimated) {
			this.wrapper.style[this.transform] = `translate3d(-${this.vars.scrollValue}px, 0 ,0) skewX(${this.vars.speed}deg)`;
		} else {
			this.wrapper.style[this.transform] = `translate3d(-${this.vars.scrollValue}px, 0 ,0)`;
		}

		this.vars.oldScrollValue = this.vars.scrollValue;
		this.raf(this._update);
	}

	/**
	 * CLAMP
	 *
	 */
	_clamp(num, min, max) {
		return Math.min(Math.max(num, min), max);
	}

	// PUBLIC

	/**
	 * Destroy variables and bind events
	 *
	 */

     _onDrag(e){
		//Calculate Delta
		let delta = this.vars.dragStart - e.screenX;
		console.log(e);
		if(e.clientX!=0){
			if (delta > 0) {
				this.vars.direction = 1;
			} else {
				this.vars.direction = -1;
			}
	
			this.vars.scrollTarget += delta * -1;
			this.vars.scrollTarget = Math.round(Math.max(this.vars.scrollLeft, Math.min(this.vars.scrollTarget, this.vars.scrollRight)));
			this.vars.dragStart = this.vars.dragStart - delta;
		}
		
	}

	_onDragStart(e){
		//Calculate Delta
		this.vars.dragStart = e.screenX;
		console.log('dragStart', this.vars.dragStart);


/*
		if (e.deltaY > 0) {
			this.vars.direction = 1;
		} else {
			this.vars.direction = -1;
		}

		this.vars.scrollTarget += e.deltaY * -1;
		this.vars.scrollTarget = Math.round(Math.max(this.vars.scrollLeft, Math.min(this.vars.scrollTarget, this.vars.scrollRight)));
*/
	}

	onResize() {
		this.vars.scrollLeft = 0;
		this.vars.scrollRight = this.wrapper.getBoundingClientRect().width - window.innerWidth;
	}

	destroy() {
		this._removeEvents();
	}

}
