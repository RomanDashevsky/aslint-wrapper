!function () {
  'use strict'

  class t {
    constructor () {}

    static mixin (t) {
      const e = [].slice.call(arguments, 1)
      let n = {}
      t && (n = t)
      return e.forEach(t => {t && Object.keys(t).forEach((function (e) {n[e] = t[e]}))}), n
    }

    static defaults (t, e) {
      let n = {}
      if (t && (n = t), e) {
        const t = t => {void 0 === n[t] && (n[t] = e[t])}
        Object.keys(e).forEach(t)
      }
      return n
    }

    static namespace (t, e) {
      const n = t.split('.'), r = n.length
      let s = e || global
      for (let t = 0; t < r; t += 1) void 0 === s[n[t]] && (s[n[t]] = {}), s = s[n[t]]
      return s
    }
  }

  class e {
    constructor () {}

    static getTypeOf (t) {return 1 !== arguments.length ? 'unknown' : this._toString.call(t).slice(8, -1).toLowerCase()}

    static isTypeOf (t, e) {
      let n
      if (arguments.length < 2) throw new TypeError('[ObjectUtility.isTypeOf] requires two arguments')
      return n = e.toLowerCase(), this.getTypeOf(t) === n
    }

    static isHostMethod (t, e) {
      if (!t) return !1
      const n = typeof t[e]
      return this.reUnknown.test(n) || this.reMethod.test(n) && t || !1
    }

    static isHostObjectProperty (t, e) {
      const n = typeof t[e]
      return Boolean(this.reMethod.test(n) && t[e])
    }

    static isRealObjectProperty (t, e) {return Boolean('object' == typeof t[e] && t[e])}

    static extend (t, e) {
      let n, r
      const s = t => Object.assign({}, t)
      for (n in e) Object.prototype.hasOwnProperty.call(e, n) && (r = e[n], this.isTypeOf(r, 'object') ? (t[n] = t[n] || {}, this.extend(t[n], r)) : Array.isArray(r) ? t[n] = r.map(s) : 'date' === this.getTypeOf(r) ? t[n] = new Date(r.valueOf()) : 'regexp' === this.getTypeOf(r) ? t[n] = new RegExp(r) : t[n] = e[n])
      return t
    }

    static clone (t) {
      const n = '__getDeepCircularCopy__'
      let r, s, o
      if (t !== Object(t)) return t
      if (r = n in t, s = t[n], r && 'function' == typeof s) return s()
      if (t[n] = function () {return o}, Array.isArray(t)) {
        const e = t => 'object' == typeof t ? null === t ? t : Object.assign({}, t) : t
        o = t.map(e)
      } else {
        if ('date' === Object.getPrototypeOf(t).constructor.name.toLowerCase()) return new Date(t.valueOf())
        if ('regexp' === Object.getPrototypeOf(t).constructor.name.toLowerCase()) return new RegExp(t)
        o = {}
        for (const i in t) i !== n ? o[i] = e.clone(t[i]) : r && (o[i] = e.clone(s))
      }
      return r ? t[n] = s : delete t[n], o
    }

    static deleteProperties (t) {
      let e
      for (e in t) Object.prototype.hasOwnProperty.call(t, e) && delete t[e]
      return t
    }

    static clearArray (t) {return t.length = 0, t}

    static isNativeMethod (t) {
      const e = typeof t
      let n
      return !!new RegExp('^(function|object)$', 'i').test(e) && (n = String(t), -1 !== n.indexOf('[native code]'))
    }

    static getProperty (t, e) {
      const n = e.split('.'), r = n.length
      let s = t
      for (let t = 0; t < r; t += 1) {
        if (!s || !s.hasOwnProperty(n[t])) return
        s = s[n[t]]
      }
      return s
    }

    static setProperty (e, n, r) {
      let s, o, i = e
      if (!1 === this.isTypeOf(e, 'object') || !1 === this.isTypeOf(e, 'array') && !1 === this.isTypeOf(n, 'string')) return null
      for (s = n.split('.'), o = s.pop(), void 0 === this.getProperty(e, n) && t.namespace(n, e); s.length && i;) i = i[s.shift()]
      return i[o] = r, i[o]
    }
  }

  e.reMethod = /^(function|object)$/, e.reUnknown = /^unknown$/, e._toString = {}.toString

  class n {
    constructor () {}

    static get context () {return new Function('return this;')()}
  }

  const r = Object.freeze({
    application: { dispose: null, run: null },
    busyIndicator: { on: null, off: null },
    http: { onBefore: null, onComplete: null, onError: null },
    modalWindow: { beforeOpen: null, afterClose: null },
    mutationObserver: { change: null },
    notification: { error: null, log: null, info: null, warning: null, success: null },
    problem: { export: { publish: null, register: null, unregister: null } },
    render: { ui: { complete: null } },
    validator: { complete: null, report: null, reset: null, started: null }
  })

  class s {
    constructor () {}

    static isEventExists (t, e) {
      const n = e.split('.'), r = n.length
      let s = t
      for (let t = 0; t < r; t += 1) {
        if (null === s || !Object.prototype.hasOwnProperty.call(s, n[t])) return !1
        s = s[n[t]]
      }
      return !0
    }

    static subscribe (t, n) {!1 !== e.isTypeOf(n, 'function') ? (s.listeners[t] || (s.listeners[t] = []), s.listeners[t].push(n)) : console.warn('[Bus.subscribe] trying to subscribe invalid type of listener: ', e.getTypeOf(n))}

    static unsubscribe (t, e) {
      if (void 0 === t) throw new Error('[Bus.unsubscribe] missing event name')
      const n = s.listeners[t] ? s.listeners[t].length : 0
      if (e) for (let r = n - 1; r >= 0; r -= 1) s.listeners[t][r] === e && s.listeners[t].splice(r, 1);
      (!e || s.listeners[t] && 0 === s.listeners[t].length) && delete s.listeners[t]
    }

    static subscribeOnce (t, e) {s.subscribe(t, (function n () {e.apply(this, arguments), s.unsubscribe(t, n)}))}

    static publish (t, ...e) {
      let n
      const o = []
      if (Array.prototype.push.apply(o, arguments), o.shift(), !s.isEventExists(r, t)) throw new Error('[Bus.publish] Trying to publish non exists event: ' + t)
      n = s.listeners[t] ? s.listeners[t].length : 0
      for (let e = n - 1; e >= 0; e -= 1) s.listeners[t] && s.listeners[t][e].apply(this, o)
    }

    static unsubscribeAll () {s.listeners = {}}
  }

  /*! *****************************************************************************
      Copyright (c) Microsoft Corporation.

      Permission to use, copy, modify, and/or distribute this software for any
      purpose with or without fee is hereby granted.

      THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
      REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
      AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
      INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
      LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
      OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
      PERFORMANCE OF THIS SOFTWARE.
      ***************************************************************************** */
  function o (t, e, n, r) {
    return new (n || (n = Promise))((function (s, o) {
      function i (t) {try {a(r.next(t))} catch (t) {o(t)}}

      function c (t) {try {a(r.throw(t))} catch (t) {o(t)}}

      function a (t) {
        var e
        t.done ? s(t.value) : (e = t.value, e instanceof n ? e : new n((function (t) {t(e)}))).then(i, c)
      }

      a((r = r.apply(t, e || [])).next())
    }))
  }

  s.listeners = {}

  class i {
    constructor () {}

    static removeProtocolFromUrl (t) {return t.trim().toLowerCase().replace(/(^[^:/]*:\/\/)/, '')}

    static encodeURIParam (t) {return encodeURIComponent(t).replace(/[!'()*~]/g, t => '%' + t.charCodeAt(0).toString(16))}

    static getNormalizedUrl (t) {
      let e = t
      return !1 === t.startsWith('https://') && !1 === t.startsWith('http://') && (e = 'http://' + i.removeProtocolFromUrl(e)), e
    }

    static getDomainPatternFromUrl (t) {
      const e = new URL(t).host.match(/^(?:[^.]+\.)*([^.]+\.[^./?#&]+)/)
      return e ? [e[1], '*.' + e[1]] : []
    }

    static urlPatternToRegexp (t) {
      let e = '^' + i.removeProtocolFromUrl(t)
      return e = e.replace(/\*/g, '[^/.]*'), e = e.replace(/\./g, '\\.'), new RegExp(e, 'i')
    }

    static hasKey (t, e) {
      const n = Array.isArray(e) ? e : e.split('.'), r = n.length
      let s = t, o = !0
      if (null === s) return o = !1, o
      for (let t = 0; t < r; t += 1) {
        if ('object' != typeof s || null === s || !1 === Object.prototype.hasOwnProperty.call(s, n[t])) {
          o = !1
          break
        }
        s = s[n[t]]
      }
      return o
    }

    static setKey (t, e, n) {
      const r = e.split('.'), s = r.pop()
      return r.reduce((t, e) => (void 0 === t[e] && (t[e] = {}), t[e]), t)[s] = n, t
    }

    static withLeadingZeros (t, e) {
      let n = String(t)
      for (; n.length < e;) n = '0' + n
      return n
    }

    static randomRange (t = 0, e = 1e6) {
      const n = Math.ceil(t)
      return Math.floor(Math.random() * (Math.floor(e) - n)) + n
    }

    static timeout (t, e = 0) {return o(this, void 0, void 0, (function * () {return new Promise((n, r) => {setTimeout(() => o(this, void 0, void 0, (function * () {try {n(yield t())} catch (t) {r(t)}})), e)})}))}

    static isDateValid (t) {return t instanceof Date && !1 === isNaN(t.getTime())}

    static pick (t, ...e) {
      const n = {}
      for (const r of e) if (r in t) n[r] = t[r] else {
        const e = r
        if (i.hasKey(t, e)) {
          const r = e.split('.').reduce((t, e) => t[e], t)
          i.setKey(n, e, r)
        }
      }
      return n
    }

    static pickArray (t, ...e) {return t.map(t => this.pick(t, ...e))}
  }

  var c, a, l, p, u
  !function (t) {t.aslint = 'aslint', t.config = 'config', t.context = 'context'}(c || (c = {})), function (t) {t.asyncRunner = 'asyncRunner', t.context = 'context', t.direction = 'direction', t.description = 'description', t.reportFormat = 'reportFormat', t.ractiveDebug = 'ractiveDebug', t.resultsCallback = 'resultsCallback', t.visibleUI = 'visibleUI'}(a || (a = {})), function (t) {t.applicationId = 'applicationId', t.baseUrl = 'baseUrl', t.containerId = 'containerId', t.copyrightYear = 'copyrightYear', t.cssTitle = 'cssTitle', t.cssUrl = 'cssUrl', t.jsUrl = 'jsUrl', t.lastUpdate = 'lastUpdate', t.loaderUrl = 'loaderUrl', t.namespace = 'namespace', t.productDescription = 'productDescription', t.productName = 'productName', t.ractiveDebug = 'ractiveDebug', t.rulesUrl = 'rulesUrl', t.testUrl = 'testUrl', t.version = 'version'}(l || (l = {})), function (t) {t.ltr = 'ltr', t.rtl = 'rtl'}(p || (p = {})), function (t) {t.json = 'json'}(u || (u = {}))
  var d = {
    asyncRunner: !0,
    context: '',
    direction: 'ltr',
    description: '',
    reportFormat: { json: !0 },
    ractiveDebug: !1,
    resultsCallback: null,
    visibleUI: !0
  }, g = {
    applicationId: 'ASLintApplication',
    baseUrl: '//www.aslint.org',
    containerId: 'aslintBox',
    copyrightYear: '2020',
    cssTitle: 'aslint',
    cssUrl: '//www.aslint.org/api/aslint/1.0.1083/css/aslint.css',
    fontsUrl: 'https://fonts.googleapis.com/css?family=Open+Sans',
    jsUrl: '//www.aslint.org/api/aslint/1.0.1083/js/aslint.bundle.js',
    lastUpdate: '27.05.2020',
    loaderUrl: '//www.aslint.org/api/aslint/loader/loader.js',
    namespace: 'aslint',
    productDescription: 'Accessibility Validation Tool',
    productName: 'ASLint',
    ractiveDebug: !1,
    rulesUrl: '//www.aslint.org/api/aslint/js/config/aslint.json',
    testUrl: '//www.aslint.org/test',
    version: '1.0.1083'
  }
  const f = {
    [l.applicationId]: g[l.applicationId],
    [l.baseUrl]: g[l.baseUrl],
    [l.containerId]: g[l.containerId],
    [l.copyrightYear]: g[l.copyrightYear],
    [l.cssTitle]: g[l.cssTitle],
    [l.cssUrl]: g[l.cssUrl],
    [l.jsUrl]: g[l.jsUrl],
    [l.lastUpdate]: g[l.lastUpdate],
    [l.loaderUrl]: g[l.loaderUrl],
    [l.namespace]: g[l.namespace],
    [l.productDescription]: g[l.productDescription],
    [l.productName]: g[l.productName],
    [l.ractiveDebug]: g[l.ractiveDebug],
    [l.rulesUrl]: g[l.rulesUrl],
    [l.testUrl]: g[l.testUrl],
    [l.version]: g[l.version]
  }

  class h {
    constructor () {this.references = {}}

    mixCustomWithDefaultSettings () {
      let r = {
        [a.asyncRunner]: d[a.asyncRunner],
        [a.context]: d[a.context],
        [a.direction]: d[a.direction],
        [a.description]: d[a.description],
        [a.reportFormat]: d[a.reportFormat],
        [a.ractiveDebug]: d[a.ractiveDebug],
        [a.resultsCallback]: d[a.resultsCallback],
        [a.visibleUI]: d[a.visibleUI]
      }
      void 0 === n.context[f.namespace] ? n.context[f.namespace] = {} : 'object' == typeof n.context[f.namespace].config && (r = t.defaults(n.context[f.namespace].config, d)), n.context[f.namespace].config = t.defaults(e.clone(f), r), 'string' == typeof n.context[f.namespace].config[a.context] && (n.context[f.namespace].config[a.context] = n.context[f.namespace].config[a.context].trim())
    }

    dispose () {console.log('%c[Config.dispose]', 'color: blue'), s.unsubscribe('application.dispose', this.references.dispose), delete n.context[f.namespace]}

    initEvents () {this.references.dispose = this.dispose.bind(this), s.subscribe('application.dispose', this.references.dispose)}

    set (t, e) {!1 !== i.hasKey(window, `${f.namespace}.${c.config}`) ? i.setKey(window[f.namespace][c.config], t, e) : console.warn('[Config.set] Trying to set an unknown config property', t, e)}

    get (t) {
      const e = n.context[f.namespace]
      return 'string' == typeof t && void 0 === e || void 0 === e.config[t] ? null : e.config[t]
    }

    getAllSettings () {return n.context[f.namespace].config}

    setRunnerSettings (t, n) {e.isTypeOf(t, 'function') ? this.set('resultsCallback', t) : console.warn('[Config.setRunnerSettings] Callback for ASLint must be a function. Passed type is ' + e.getTypeOf(t)), void 0 !== n && (e.isTypeOf(n.asyncRunner, 'boolean') && this.set('asyncRunner', n.asyncRunner), e.isTypeOf(n.direction, 'string') && this.set('direction', n.direction), e.isTypeOf(n.reportFormat, 'object') && this.set('reportFormat', n.reportFormat), e.isTypeOf(n.visibleUI, 'boolean') && this.set('visibleUI', n.visibleUI))}

    init () {this.mixCustomWithDefaultSettings(), this.initEvents()}
  }

  (new class {
    constructor () {this.config = new h}

    createLoadingMessage () {
      const t = document.createElement('div'), e = document.createDocumentFragment()
      for (t.innerHTML = '<div id="aslintLoadingMessage" style="padding: 0; font-size: 1em; left: 0; position: fixed; top: 0; text-align: center; width: 100%; z-index: 999999">\n    <p style="background: black; border-radius: 3px; color: white; margin: 0.25em auto 0; padding: 0.25em 0.75em; display: inline-block;">Loading ASLint</p>\n</div>'; t.firstChild;) e.appendChild(t.firstChild)
      document.body.appendChild(e.querySelector('#aslintLoadingMessage'))
    }

    removeLoadingMessage () {
      const t = document.getElementById('aslintLoadingMessage')
      return t.parentNode.removeChild(t)
    }

    loadApp () {
      const t = document.getElementById(this.config.get('containerId'))
      t && t.parentNode.removeChild(t), this.createLoadingMessage(), class {
        constructor () {}

        static getCSS (t, n) {
          const r = document.createElement('link'), s = document.head.getElementsByTagName('script')[0]
          if (!t) return console.warn('[getCSS] missing url parameter'), !1
          r.type = 'text/css', r.rel = 'stylesheet', r.media = n || 'screen,projection,print', r.href = t
          const o = () => {s ? s.parentNode.insertBefore(r, s) : document.head.appendChild(r)}
          return e.isNativeMethod(window.requestAnimationFrame) ? window.requestAnimationFrame(o) : o(), r
        }

        static getScript (t, e, n, r) {
          const s = document.createElement('script'), o = document.head
          if (!t) throw new Error('[getScript] missing url parameter')
          return s.src = t, s.type = 'text/javascript', s.defer = !0, r && (s.id = r), e && (s.onload = e), n && (s.onerror = n), o.insertBefore(s, o.firstChild), s
        }
      }.getScript(class {
        constructor () {}

        static getDefaultProtocol () {
          const t = { 'http:': 'http:', 'https:': 'https:' }
          return t[document.location.protocol] ? document.location.protocol : t['https:']
        }

        static getCurrentProtocol () {return document.location.protocol}

        static encodeParam (t) {return encodeURIComponent(t).replace(/[!'()*]/g, t => '%' + t.charCodeAt(0).toString(16))}

        static getCurrentAddress () {return document.location.href}

        static saveFile (t, e, r) {
          // const s = new Blob([t], { type: r || 'application/json' })
          // let o, i
          // n.context.navigator && n.context.navigator.msSaveOrOpenBlob ? n.context.navigator.msSaveOrOpenBlob(s, e) : (o = n.context.URL.createObjectURL(s), i = document.createElement('a'), i.download = e, i.href = o, document.body.appendChild(i), i.click(), n.context.URL.revokeObjectURL(o), i.remove())
        }
      })
    }

    init () {this.config.init(), this.loadApp()}
  }).init()
}()