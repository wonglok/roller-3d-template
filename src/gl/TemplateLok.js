export class Lok extends HTMLElement {
  /*
  <lok-lok-element active>
    <h1 slot="heading">Hello, World!</h1>
    <p slot="description">Lorem ipsum dolor sit amet</p>
  </lok-lok-element>
  */
  /**
   * Your custom element's HTML template.
   * @return {HTMLTemplateElement}
   */
  static template () {
    const element = document.createElement('template');

    element.innerHTML = `
      <style>
        :host {
          display: inline-block;
          background-color: #f2f3f4;
          padding: 1rem;s
        }
      </style>
      <slot name="heading"></slot>
      <canvas id="canvas"></canvas>
      <slot name="description"></slot>
    `;

    return element;
  }

  /**
   * A list of attributes you want to listen to (triggers event on change).
   */
  static get observedAttributes() {
    return ['active'];
  }


  constructor() {
    super();

    /** @type {?ShadowRoot} */
    this._shadowRoot = null;

    /** @type {?HTMLCanvasElement} */
    this._canvas = null;
    /** @type {?CanvasRenderingContext2D} */
    this._context = null;
  }

  _setup() {
    /** @type {DocumentFragment} */
    const content = Lok.template().content;

    this._shadowRoot = this.attachShadow({mode: 'open'});
    this._shadowRoot.appendChild(content);

    this._canvas = this._shadowRoot.querySelector('#canvas');
    this._context = this._canvas.getContext('2d');

    this._setCanvasColour();
  }

  _setCanvasColour() {
    const hasActiveAttribute = this.hasAttribute('active');
    let colour = 'red';

    // If the "active" attribute is present.
    if (hasActiveAttribute) {
      colour = 'blue';
    }

    this._context.fillStyle = colour;
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
  }


  // Life cycle methods.

  // Component added to DOM event.
  connectedCallback() {
    if (this.isConnected) {
      this._setup();
      console.log('Element added to the DOM!');
    }
  }

  // Component removed from DOM event.
  disconnectedCallback() {
    if (!this.isConnected) {
      console.log('Element removed from the DOM!');
    }
  }

  /**
   * Triggers every time one of the listed attributes has changed.
   */
  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Attribute Changed!');
    console.log(`${name} changed from ${oldValue} to ${newValue}`);

    const activeAttributeChanged = name === 'active';

    if (activeAttributeChanged && this._canvas) {
      this._setCanvasColour();
    }
  }
}

window.customElements.define('lok-lok', Lok);
