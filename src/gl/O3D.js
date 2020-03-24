import { Object3D } from 'three'
// import compose from "lodash/fp/compose"
export const castDownEvent = (vm, ev, data) => {
  if (vm && vm.o3d.children.length > 0) {
    vm.$emit(ev, data)
    vm.o3d.children.forEach((kid) => {
      castDownEvent(kid, ev, data)
    })
  }
}

let parent = (vm) => vm.parentElement || vm.getRootNode().host

// let getVal = (n, key) => n && n[key]

let lookup = (vm, key) => {
  if (parent(vm) && parent(vm)[key]) {
    return parent(vm)[key]
  } else {
    vm = parent(vm)
    if (!vm) {
      return false
    }
    return lookup(vm, key)
  }
}

export class O3D extends HTMLElement {
  static get observedAttributes() {
    return ['layout']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.$refs = new Proxy(this, {
      get (obj, key) {
        return obj.shadowRoot.querySelector('#' + key)
      }
    })
    this._ready = false
    this._eventCleaners = []
    this._name = this.constructor.name

    // Public APIs
    this.props = {}
    this.o3d = new Object3D()
  }

  get $parent () {
    return this.parentElement || this.getRootNode().host
  }

  $emit (ev, data) {
    this.dispatchEvent(new CustomEvent(ev, { detail: data }))
  }

  $on (ev, handler) {
    this.addEventListener(ev, handler)
    this._eventCleaners.push(() => {
      this.removeEventListener(ev, handler)
    })
  }

  lookup (key) {
    if (!key) {
      throw new Error('must have key')
    }
    return lookup(this, key)
  }

  attr (key) {
    return this.getAttribute(key)
  }

  connectedCallback() {
    if (this.isConnected) {
      if (this.setup) {
        console.log(this._name, 'setup')
        this.setup()
      }

      if (this.add) {
        console.log(this._name, 'add to myself')
        this.add()
      }

      let parentO3D = this.lookup('o3d')
      if (parentO3D) {
        console.log(this._name, 'add to parent', this.$parent._name)
        parentO3D.add(this.o3d)
      }

      if (this.base) {
        console.log(this._name, 'loop init')
        this.base.onInit()
      }

      if (this.onRefreshProps) {
        this.onRefreshProps()
        this._ready = true
      }
    }
  }

  disconnectedCallback() {
    if (!this.isConnected) {
      if (this.remove) {
        console.log(this._name, 'remove')
        this.remove()
      }

      let parentO3D = this.lookup('o3d')
      if (parentO3D) {
        console.log(this._name, 'add to parent', this.$parent._name)
        parentO3D.remove(this.o3d)
      }

      if (this.base) {
        console.log(this._name, 'loop teardown')
        this.base.onTearDown()
      }

      if (this._eventCleaners) {
        this._eventCleaners.forEach(c => c())
      }
    }
  }

  onRefreshProps () {
  }

  attributeChangedCallback (name, oldValue, newValue) {
    this.props[name] = newValue
    if (this._ready) {
      this.onRefreshProps()
    }
    // this.props[name] = newValue
    // console.log(name, 'change attr', oldValue, newValue)
  }
}

// const Root = {}
// const MixedO3D = compose(MXO3D)(Root)
// export const O3D = MixedO3D;

window.customElements.define('gl-o3d', O3D);
