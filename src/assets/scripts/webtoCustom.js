(function(win, doc) {
    if (win.$wt) {
      $wt.duplicate = !0;
      console.log("WTINFO: Duplicate 'load.js' found in the page.");
      return
    }
    win.$wt = function(selector) {
      return document.querySelectorAll(selector)
    }
    ;
    $wt.extend = function(obj) {
      for (var i in obj) {
        this[i] = obj[i]
      }
    }
    ;
    $wt.extend({
      root: "https://webtools.europa.eu",
      token: "1726474686",
      env: "eks",
      isMobile: ('ontouchstart'in window),
      isSafari: function() {
        return navigator.userAgent.toLowerCase().indexOf('safari') > -1
      },
      isIOS: function() {
        return /iPad|iPhone|iPod|MacIntel/.test(navigator.platform) && $wt.isMobile
      },
      inProgress: !1,
      components: {},
      skipComponents: ["smk"],
      css: {},
      alias: {
        "chart": "charts",
        "share": "sbkm",
        "maps": "map",
        "piwik": "analytics",
        "alert": "announcement",
        "estatcharts": "charts"
      },
      exists: function(name) {
        return Object.keys($wt.components).join('|').indexOf(name + '_') > -1
      },
      force: function(params) {
        return (params.render || ["laco", "cck", "globan", "announcement", "etrans", "sbkm", "share"].indexOf(params.service) !== -1)
      },
      mergeParams: function(defaultJSON, customJSON, fnc) {
        var deep = 0;
        (function recursive(from, to) {
          for (var name in to) {
            if (to.hasOwnProperty(name)) {
              if (typeof to[name] === "object" && !Array.isArray(to[name]) && typeof from[name] === "object" && !Array.isArray(from[name])) {
                deep++;
                recursive(from[name], to[name])
              } else {
                from[name] = to[name];
                if (fnc) {
                  from[name] = fnc(name, to[name], deep)
                }
              }
            }
          }
        }(defaultJSON, customJSON));
        return defaultJSON
      },
      next: function(elm) {
        if (elm && elm.params) {
          let eventName = elm.params.service || elm.params.utility || "";
          let upperCaseFirstLetter = eventName.charAt(0).toUpperCase() + eventName.slice(1);
          $wt.noconflict(elm);
          $wt.trigger(window, "wt" + upperCaseFirstLetter + "Ready", elm);
          $wt.trigger(window, "wtNext", elm)
        }
        if (elm && elm.className) {
          elm.className = elm.className.replace(/ ?wtWaiting/ig, '')
        }
        try {
          let ready = (elm.snippet || elm).params.events.onready;
          if (typeof ready === "string") {
            ready = ready.split(".").reduce((prev,curr)=>{
                return prev && prev[curr]
              }
              , window)
          }
          (window[ready] || ready)(elm)
        } catch (e) {}
        setTimeout(()=>{
            $wt.inProgress = !1;
            $wt.collect()
          }
          , 10);
        $wt.collect()
      },
      setTheme: (defaultTheme)=>{
        let host = location.hostname;
        let theme = "ec";
        if (['ec', 'eu'].indexOf(defaultTheme) > -1) {
          theme = defaultTheme
        } else if (host.indexOf("ec.europa.eu") > -1 || host.indexOf("commission.europa.eu") > -1) {
          theme = "ec"
        } else if (host.indexOf("europa.eu") > -1) {
          theme = "eu"
        }
        return theme
      }
      ,
      waitUntil: (conditions,options={})=>{
        let count = 0;
        let params = $wt.mergeParams({
          interval: 250,
          max: 12,
          error: "Race condition failed."
        }, options)
        return new Promise((resolve,reject)=>{
            const check = ()=>{
              if (count > params.max) {
                return reject(params.error)
              }
              count++;
              let result = conditions();
              if (result) {
                return resolve(result)
              } else {
                setTimeout(check, params.interval)
              }
            }
            check()
          }
        )
      }
      ,
      regenerate: function(params={}) {
        [...doc.querySelectorAll("script[type='application/json']")].map(elm=>{
            if (elm.reset && elm?.params?.service !== 'etrans') {
              elm.reset();
              if (params && !elm.params && !elm.params?.utility) {
                elm.innerHTML = JSON.stringify($wt.mergeParams(JSON.parse(elm.innerHTML), params))
              }
            }
          }
        );
        for (var url in $wt.isLoad) {
          if (!(url.indexOf("/webtools.") > -1) && !(url.indexOf("/libs/") > -1)) {
            delete $wt.isLoad[url]
          }
        }
        $wt.components = [];
        $wt.trigger(window, "wtRegenerate", params);
        $wt.defer($wt.collect, 100)
      },
      refresh: (x=0)=>{
        document.lang = $wt.lang(!0) || 'en';
        let comp = Object.keys($wt.components)[x];
        let uec = $wt.components[comp];
        let exists = [...document.querySelectorAll("script[type='application/json']")].filter(elm=>{
            return elm.getAttribute('data-process')
          }
        ).map(elm=>elm.reference);
        if (comp && !exists.includes(comp) && comp !== "globan") {
          delete $wt.components[comp];
          setTimeout(()=>$wt.refresh(x), 25)
        } else if (uec) {
          let realName = comp.split('_')[0];
          let isProcess = uec.getAttribute('data-process');
          if (isProcess) {
            if ($wt[realName] && $wt[realName].regenerate) {
              $wt[realName].regenerate({
                lang: document.lang
              })
            } else if (uec.regenerate) {
              uec.regenerate()
            } else {
              $wt.remove(uec.container);
              $wt.process(uec)
            }
          }
          x++;
          setTimeout(()=>$wt.refresh(x), 25)
        }
      }
      ,
      collect: function() {
        let analytics = []
          , utility = []
          , render = []
          , service = [];
        let excludeFromSearch = ["sbkm", "cck", "globan", "share", "search", "laco"];
        [...doc.querySelectorAll("script[type='application/json']")].forEach(uec=>{
            let isProcess = uec.getAttribute("data-process");
            if (!isProcess) {
              if (!uec.params) {
                try {
                  uec.params = JSON.parse($wt.filterXss(uec.innerHTML))
                } catch (e) {
                  uec.setAttribute("data-process", !0);
                  return
                }
                if (!uec.params.service && !uec.params.utility) {
                  return
                }
                $wt.uniqueID(uec);
                uec.params.render = $wt.force(uec.params)
              }
              if (!uec.container) {
                let slc = uec.params.renderTo;
                let dom = document.querySelector(slc + ", [id='" + slc + "']");
                if (dom) {
                  uec.container = dom;
                  uec.renderTo = dom;
                  delete uec.params.renderTo
                } else {
                  uec.container = document.createElement("div");
                  $wt.before(uec.container, uec)
                }
                uec.container.innerHTML = '';
                if (!uec.params.contact && uec.params.service) {
                  uec.container.className = "wtWidgets wtWaiting " + uec.params.service;
                  if (uec.params.type) {
                    uec.container.className += " " + uec.params.service + "-" + uec.params.type
                  }
                }
              }
              if (uec.params.service === "search" && !uec.params.form) {
                uec.container.style.height = "52px"
              }
              if (uec.params.service === "dff") {
                if (uec.params?.id && uec.params.id.includes('_dff_v2')) {
                  uec.params.version = "2.0"
                } else {
                  delete uec.params.version
                }
              }
              let dropFromSearchEngine = excludeFromSearch.filter(name=>{
                  return name.indexOf(uec.params.service || uec.params.utility) > -1
                }
              );
              if (dropFromSearchEngine.length) {
                uec.container.setAttribute("data-nosnippet", "true")
              }
              if (uec.params && /analytics|piwik/i.test(uec.params.utility)) {
                analytics.push(uec)
              } else if (uec.params && uec.params.utility) {
                utility.push(uec)
              } else if (uec.params && uec.params.render) {
                render.push(uec)
              } else if ($wt.visible(uec.container)) {
                service.push(uec)
              }
            }
          }
        );
        let dom = analytics[0] || utility[0] || render[0] || service[0];
        if (dom && !$wt.inProgress) {
          $wt.inProgress = !0;
          $wt.theme = $wt.theme || $wt.setTheme();
          let themeFile = `${$wt.root}/css/webtools.theme-${$wt.theme}.css?t=${$wt.token}`;
          $wt.include(themeFile, ()=>$wt.process(dom))
        }
      },
      process: function(elm, params) {
        elm.setAttribute("data-process", !0);
        params = elm.params || params || {};
        var self = this;
        var comp = params.service || params.utility || !1;
        comp = $wt.alias[comp] || comp;
        if (!comp || $wt.skipComponents.includes(comp)) {
          $wt.next(elm);
          return
        }
        if (!elm.container) {
          let slc = params.renderTo;
          let dom = document.querySelector(slc + ", [id='" + slc + "']");
          if (dom) {
            elm.container = dom
          } else {
            elm.container = document.createElement("div");
            $wt.before(elm.container, elm)
          }
        }
        elm.reset = function() {
          if (elm.params && !elm.params.utility) {
            var API = $wt[elm.params.service];
            if (API && API.onRemove) {
              [].forEach.call(API.onRemove(), function(e) {
                $wt.remove(e)
              })
            }
          }
          elm.remove();
          elm.isProcess = !1;
          elm.removeAttribute("data-process")
        }
        ;
        elm.remove = function() {
          if (elm.renderTo) {
            elm.renderTo.innerHTML = ''
          } else {
            $wt.remove(elm.container)
          }
          elm.container = !1
        }
        ;
        elm.regenerate = function() {
          elm.reset();
          if (elm.params?.custom) {
            for (var url in $wt.isLoad) {
              if (!(url.indexOf("/webtools.") > -1) && !(url.indexOf("/libs/") > -1)) {
                delete $wt.isLoad[url]
              }
            }
          }
          let freshParams = JSON.parse(elm.innerHTML);
          if (freshParams.custom) {
            elm.params = freshParams
          } else {
            delete elm.params
          }
          $wt.process(elm, freshParams)
        }
        ;
        if (elm.container) {
          elm.container.params = params;
          elm.container.className = comp + " wt wt-" + comp + " " + (params["class"] || "");
          if (!elm.container.params.contact && elm.container.params.service) {
            elm.container.className += " wtWaiting";
            if (elm.container.params.type) {
              elm.container.className += " " + elm.container.params.service + "-" + elm.container.params.type
            }
          }
          if (params.css) {
            if (params.css.wrapper) {
              elm.container.classList.add(params.css.wrapper)
            }
          }
        }
        elm.container.snippet = elm;
        var extra = [];
        if (comp === "charts") {
          params.version = "2.0"
        }
        ((params.version) ? extra.push("version=" + params.version) : "");
        if (comp !== 'globan') {
          params.theme = $wt.theme
        }
        if (!params.utility && !self.css["__" + comp]) {
          var GETCSS = $wt.root + "/webtools." + comp + ".css";
          if (params.version) {
            GETCSS += "?version=" + params.version;
            GETCSS += "&t=" + $wt.token
          } else {
            GETCSS += "?t=" + $wt.token
          }
          self.css["__" + comp] = !0;
          let toStaticCSS = $wt.getStaticCSSPath(comp, params);
          $wt.include(toStaticCSS || GETCSS)
        }
        if ($wt.runComponent(comp, elm, params)) {
          return
        }
        extra.push("t=" + $wt.token);
        let extraParams = extra.join("&");
        var GETJS = $wt.root + "/webtools." + comp + ".js";
        GETJS += (extraParams) ? "?" + extraParams : '';
        let toStaticJS = $wt.getStaticJSPath(comp, params);
        $wt.include(toStaticJS || GETJS, (msg)=>{
            if (msg === "error") {
              console.log("WTERROR: '" + comp + "' doesn't exist.");
              $wt.remove(elm.container);
              $wt.remove(elm);
              self.next()
            } else {
              let translations = params.translations || params?.options?.translations;
              if (translations) {
                return $wt.loadTranslations(translations, ()=>{
                    $wt.runComponent(comp, elm, params)
                  }
                  , comp)
              }
              $wt.runComponent(comp, elm, params)
            }
          }
          , "js")
      },
      runComponent: function(comp, scrpt, params) {
        if ($wt[comp] && $wt[comp].run) {
          if (params?.wcloud?.url) {
            scrpt.container.addEventListener("click", ()=>{
                let urlWtStat = params.wcloud.url + "?wtstat=1";
                $wt.getFile({
                  url: urlWtStat,
                  method: "HEAD",
                  success: ()=>{}
                  ,
                  error: ()=>console.log("WSTAT: Couldn't query %s", urlWtStat)
                })
              }
              , {
                once: !0
              })
          }
          $wt[comp].run(scrpt.container, params);
          return !0
        }
        return !1
      },
      render: function(elm, params) {
        var createSnippet = function(json) {
          var s = document.createElement("script");
          s.type = "application/json";
          s.params = json;
          s.innerHTML = JSON.stringify(json);
          return s
        };
        var container = !1;
        if ($wt.components[elm]) {
          container = $wt.components[elm]
        } else if (typeof elm === "string") {
          container = document.querySelectorAll("#" + elm + ", ." + elm);
          container = container[0] || !1
        } else if (typeof elm === "object") {
          container = elm
        }
        if (!container) {
          console.log("WTINFO: container doesn't exist.");
          return
        }
        var uec = $wt.mergeParams((container.params || {}), (params || {}));
        uec.render = !0;
        if (uec.service && uec.utility) {
          delete uec.utility
        }
        if (!container.container) {
          var S = createSnippet(uec);
          container.innerHTML = "";
          container.appendChild(S);
          $wt.uniqueID(S)
        } else if (container.container && params) {
          container.reset();
          container.params = uec;
          container.innerHTML = JSON.stringify(uec);
          container.isProcess = !1;
          $wt.uniqueID(container)
        } else if (container.isProcess && !params) {
          container.container.innerHTML = "";
          $wt[container.params.service].run(container)
        }
        $wt.collect()
      },
      queue: {
        working: !1,
        list: [],
        currentContainer: !1,
        push: function(container, callback) {
          container.runQueue = callback;
          this.list.push(container);
          if (this.working === !1) {
            this.finish()
          }
        },
        process: function(callback) {
          if (this.working) {
            return
          }
          this.working = !0;
          this.container = this.list.shift();
          if (this.container) {
            this.currentContainer = this.container;
            this.container.runQueue(this.container)
          } else {
            this.empty(this.currentContainer, callback)
          }
        },
        empty: function(container, callback) {
          this.working = !1;
          $wt.next(container);
          if (callback) {
            callback()
          }
        },
        finish: function(callback) {
          $wt.defer(function() {
            $wt.queue.working = !1;
            $wt.queue.process(callback)
          }, 50)
        }
      }
    });
    $wt.extend({
      _queue: $wt.next
    })
  }
)(window, document);
$wt.extend({
  url: {
    params: {
      add: function(key, value, url) {
        key = encodeURIComponent(key);
        value = encodeURIComponent(value);
        var params = this.all(url);
        if (params[key] && Array.isArray(params[key])) {
          params[key].push(value)
        } else {
          delete params[key];
          params[key] = value
        }
        var components = $wt.url.info(url);
        return $wt.url.build({
          protocol: components.protocol,
          host: components.host,
          pathname: components.pathname,
          hash: components.hash,
          search: params
        })
      },
      all: function(url) {
        let params = {};
        let info = $wt.url.info(url);
        let search = (info.search !== '') ? info.search : !1;
        let hash = (info.hash !== '') ? info.hash : '';
        (search || hash).replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {
          try {
            value = $wt.filterHtml(decodeURIComponent(value))
          } catch (e) {
            console.log(e)
          }
          if (key.indexOf("[") !== -1) {
            var k = key.replace("[]", "");
            if (!params[k]) {
              params[k] = []
            }
            params[k].push(value)
          } else {
            params[key] = value
          }
        });
        return params
      },
      get: function(key, url) {
        return this.all(url)[key]
      },
      exists: function(key, url) {
        return !(this.get(key, url) === undefined)
      },
      remove: function(key, url) {
        var params = this.all(url);
        delete params[key];
        var components = $wt.url.info(url);
        return $wt.url.build({
          protocol: components.protocol,
          host: components.host,
          pathname: components.pathname,
          hash: components.hash,
          search: params
        })
      }
    },
    build: function(config) {
      var url = config.protocol + '//' + config.host + config.pathname;
      if (typeof config.search === 'object') {
        var search = Object.keys(config.search).map(function(item) {
          var val = config.search[item];
          if (Array.isArray(val)) {
            return val.map(function(arr) {
              return item + "[]=" + arr
            }).join("&")
          }
          return item + "=" + config.search[item]
        });
        if (search.length) {
          url += '?' + search.join("&")
        }
      } else if (config.search) {
        url += config.search
      }
      if (config.hash) {
        url += config.hash
      }
      return url
    },
    info: function(url) {
      var a = {};
      if (url) {
        a = document.createElement("a");
        a.className = "wt-link";
        a.href = url
      }
      return {
        protocol: a.protocol || window.location.protocol,
        host: a.host || window.location.host,
        port: a.port || window.location.port,
        pathname: a.pathname || window.location.pathname,
        hostname: a.hostname || window.location.hostname,
        hash: a.hash || window.location.hash,
        search: a.search || window.location.search
      }
    }
  }
});
$wt.extend({
  id: ()=>Math.random().toString(36).substr(2, 16),
  uniqueID: (scrp)=>{
    let params = scrp.params;
    if (params) {
      let name = params.name || ((params.service || params.utility) + "_" + $wt.id());
      $wt.components[name] = scrp;
      scrp.reference = name
    }
  }
  ,
  getUrlParams: function(s) {
    return $wt.url.params.all(s)
  },
  ext: function(s) {
    s = ((s || "").toLowerCase()).split("#")[0].split("?")[0];
    return ((/[.]/.exec(s)) ? (/[^.]+$/.exec(s)) : undefined) + ""
  },
  arrayToUrl: function(a) {
    var n = "";
    for (var key in a) {
      n += "&" + key + "=" + a[key]
    }
    return n
  },
  absolute: function(s, o) {
    var a = document.createElement("a");
    a.href = s;
    return (o) ? a : a.href
  },
  template: function(str, placeholders, options) {
    if (typeof str !== 'string') {
      return ''
    }
    var opt = $wt.mergeParams({
      preserve: !1,
      transform: function(res) {
        if (typeof res === 'object') {
          return JSON.stringify(res)
        }
        return res
      },
      methods: {
        uppercase: function(res) {
          return res.toUpperCase()
        },
        lowercase: function(res) {
          return res.toLowerCase()
        },
        ceil: function(res) {
          return Math.ceil(res)
        },
        round: function(res) {
          return Math.round(res)
        },
        floor: function(res) {
          return Math.floor(res)
        },
        decimal: function(res, args) {
          return Number(res).toFixed(args[0] || 2)
        },
        tostring: function(res) {
          return JSON.stringify(res)
        }
      }
    }, options || {});
    return str.replace(/{([\w_\-\:\.\(\)]+)}/g, function(key, name) {
      var useMethod = key.replace(/{|}/g, '').split(':');
      var useArguments = useMethod[0].split('(');
      var action = useArguments[0];
      var args = (useArguments[1] || '').split(')')[0].split(',');
      var label = useMethod[1] || useMethod[0];
      var labelValue = placeholders[label];
      var placeholder = labelValue;
      if (label.split('.').length > 1) {
        placeholder = label.split(".").reduce(function(prev, curr) {
          return prev && prev[curr]
        }, placeholders)
      }
      if (opt.preserve && !placeholder) {
        return "{" + name + "}"
      }
      if (["undefined", "null"].indexOf(String(placeholder)) > -1) {
        return ""
      } else if (!String(placeholder)) {
        return ""
      } else if (opt.methods[action] && useMethod.length > 1) {
        return opt.methods[action](placeholder, args)
      } else {
        return opt.transform(placeholder)
      }
    })
  },
  alphaOrder: function(dataSrc, options) {
    if (!Array.isArray(dataSrc)) {
      console.log("WTERROR: alphaOrder need a real ARRAY in first argument!");
      return
    }
    var orderConf = {
      "default": "aAªáÁàÀăĂâÂåÅǻǺäÄǟǞãÃǡǠąĄāĀæÆǽǼǣǢbBḃḂcCćĆĉĈčČċĊçÇ℅dDďĎḋḊđĐðÐeEéÉèÈĕĔêÊěĚëËęĘēĒėĖəƏfFḟḞƒﬁﬂgGğĞĝĜǧǦġĠģĢǥǤhHĥĤȟȞħĦiIíÍìÌĭĬîÎïÏĩĨİįĮīĪıĳĲjJĵĴkKǩǨķĶĸlLĺĹľĽļĻłŁŀĿmMṁṀnⁿNńŃňŇñÑņŅŋŊŉ№oOºóÓòÒŏŎôÔöÖőŐõÕǫǪǭǬōŌøØǿǾœŒpPṗṖqQrRŕŔřŘŗŖɼsSśŚŝŜšŠṡṠşŞșȘſẛßtTťŤṫṪţŢțȚŧŦ™uUúÚùÙŭŬûÛůŮüÜűŰũŨųŲūŪvVwWẃẂẁẀŵŴẅẄxXyYýÝỳỲŷŶÿŸzZźŹžŽżŻʒƷǯǮ",
      "greek": "αΑἀἈἄἌἂἊἆἎἁἉἅἍἃἋἇἏάΆὰᾺᾶάΆᾳᾼᾀᾈᾄᾌᾂᾊᾆᾎᾁᾉᾅᾍᾃᾋᾇᾏᾴᾲᾷᾰᾸᾱᾹβϐΒγΓδΔεΕἐἘἔἜἒἚἑἙἕἝἓἛέΈὲῈέΈϝϜϛϚζΖηΗἠἨἤἬἢἪἡἩἥἭἣἫἧἯήΉὴῊῆἦἮήΉῃῌᾐᾘᾔᾜᾒᾚᾖᾞᾑᾙᾕᾝᾓᾛᾗᾟῄῂῇθϑΘιιΙἰἸἴἼἲἺἶἾἱἹἵἽἳἻἷἿίΊὶῚῖίΊῐῘϊΪΐῒῗΐῑῙκϰΚϗλΛμµΜνΝξΞοΟὀὈὄὌὂὊὁὉὅὍὃὋόΌὸῸόΌπϖΠϟϞρϱΡῤῥῬσςΣτΤυΥὐὔὒὖὑὙὕὝὓὛὗὟύΎὺῪῦύΎῠῨϋΫΰῢῧΰῡῩφϕΦχΧψΨωΩΩὠὨὤὬὢὪὦὮὡὩὥὭὣὫὧὯώΏὼῺῶώΏῳῼᾠᾨᾤᾬᾢᾪᾦᾮᾡᾩᾥᾭᾣᾫᾧᾯῴῲῷϡϠ",
      "cyrillic": "аАӑӐӓӒәӘӛӚӕӔбБвВгГґҐғҒҕҔдДђЂѓЃҙҘеЕѐЀёЁӗӖєЄжЖӂӁӝӜҗҖзЗӟӞѕЅӡӠиИѝЍӣӢӥӤіІїЇйЙјЈкКқҚӄӃҡҠҟҞҝҜлЛљЉмМнНңҢӈӇҥҤњЊоОӧӦөӨӫӪпПҧҦрРсСҫҪтТҭҬћЋќЌуУӯӮўЎӱӰӳӲүҮұҰфФхХҳҲһҺцЦҵҴчЧӵӴҷҶӌӋҹҸҽҼҿҾџЏшШщЩъЪыЫӹӸьЬэЭюЮяЯҩҨӀ"
    }
      , options = options || {
      lang: document.lang || "default"
    }
      , langGroup = {
      "el": "greek",
      "bg": "cyrillic",
      "uk": "cyrillic",
      "mk": "cyrillic",
      "sr": "cyrillic"
    }
      , orderLang = {
      "default": ["default", "greek", "cyrillic"],
      "greek": ["greek", "default", "cyrillic"],
      "cyrillic": ["cyrillic", "default", "greek"]
    };
    dataSrc.sort();
    var lang = langGroup[options.lang] || "default";
    var p = orderLang[lang];
    var o = '';
    var word = '';
    var order = [];
    var tmp = [];
    var index = '';
    for (var val in p) {
      o = orderConf[p[val]].split("");
      for (var k in o) {
        for (var kk in dataSrc) {
          word = dataSrc[kk];
          if (word.charCodeAt(0) === o[k].charCodeAt(0)) {
            order.push(dataSrc[kk]);
            tmp.push(dataSrc[kk])
          }
        }
      }
      for (var k in tmp) {
        index = dataSrc.indexOf(tmp[k]);
        dataSrc.splice(index, 1)
      }
      tmp = []
    }
    return order.concat(dataSrc)
  },
  filterXss: function(content) {
    return content.replace(/(\b)(on\S+)(\s*)=|javascript:|(<\s*)(\/*)script/ig, '')
  },
  filterHtml: function(html, allowed_tags) {
    allowed_tags = (allowed_tags || "").trim();
    if (allowed_tags) {
      allowed_tags = allowed_tags.split(/\s+/).map(function(tag) {
        return "/?" + tag
      });
      allowed_tags = "(?!" + allowed_tags.join("|") + ")"
    }
    return html.replace(new RegExp("(<" + allowed_tags + ".*?>)","gi"), "")
  },
  cleanHTML: function(html, params) {
    if (!html) {
      return ''
    }
    var config = $wt.mergeParams({
      xss: !0,
      valid_elements: !1
    }, params || {});
    if (config.valid_elements) {
      html = this.filterHtml(html, config.valid_elements)
    }
    return html
  },
  parse: {
    csv: function(data, cfg) {
      if (data.split('.').pop() === "csv") {
        console.log('WTERROR: In order to parse the csv you will need to provide the content of the file, not the url.');
        return !1
      }
      var lineDelimiter = /\r\n|\n/;
      var itemDelimiter;
      cfg = $wt.mergeParams({
        decimal: {
          point: 'auto'
        }
      }, cfg || {});
      switch (cfg.decimal.point) {
        case '.':
          itemDelimiter = /\,|\;/;
          break;
        case ',':
          itemDelimiter = /\;/;
          break;
        default:
          var hasSemicolon = data.indexOf(';') !== -1;
          itemDelimiter = hasSemicolon ? /\;/ : /\,|\;/;
          break
      }
      var tab = data.split(lineDelimiter);
      var values = [];
      for (var i = 0; i < tab.length; i++) {
        if (!tab[i]) {
          continue
        }
        var subtab = tab[i].split(itemDelimiter);
        var row = [];
        for (var j = 0; j < subtab.length; j++) {
          var col = subtab[j];
          if (['auto', ','].indexOf(cfg.decimal.point) !== -1 || isNaN(parseFloat(subtab[j]))) {
            col = col.replace(/,/g, '.')
          }
          col = col.replace(/"/g, '');
          row.push(col)
        }
        values.push(row)
      }
      return values
    }
  },
  formatNumber: function(value, format) {
    var func = window[format] || format;
    if (typeof func === 'function') {
      return func(value)
    }
    var defaultFormat = Number(value).toLocaleString("fr-FR", {
      currency: "EUR",
      maximumFractionDigits: format.decimals,
      minimumFractionDigits: format.decimals
    });
    if (typeof format.separator === 'object') {
      var decimals = format.separator.decimals;
      var thousands = format.separator.thousands;
      if (decimals) {
        defaultFormat = defaultFormat.replace(/(,)/g, decimals)
      }
      if (thousands) {
        defaultFormat = defaultFormat.replace(/(\s)/g, thousands)
      }
    } else if (typeof format.separator === 'string') {
      defaultFormat = defaultFormat.replace(/(,)/g, format.separator)
    }
    return defaultFormat + (format.unit || '')
  },
  escapeHtml: function(unsafe) {
    return unsafe.replace(/\&/g, "&amp;").replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\"/g, "&quot;").replace(/\'/g, "&#39;")
  },
  unescapeHtml: function(unsafe) {
    return unsafe.replace(/\&amp;/g, "&").replace(/\&lt;/g, "<").replace(/\&gt;/g, ">").replace(/\&quot;/g, "\"").replace(/\&\#39;/g, "'")
  },
  serialize: (form)=>{
    return Array.from(new FormData(form)).reduce((fields,[key,val])=>{
        return Object.assign({}, fields, {
          [key]: fields[key] ? (Array.isArray(fields[key]) ? fields[key] : [fields[key]]).concat(val) : val
        })
      }
      , {})
  }
});
$wt.extend({
  visible: function(e) {
    if (!e) {
      return !1
    }
    var c = e.getBoundingClientRect();
    return (c.top >= -200 && c.top <= (window.innerHeight || document.documentElement.clientHeight) + 200)
  },
  insertBefore: function(from, to) {
    from.insertBefore(to, from.firstChild)
  },
  before: function(n, t) {
    (t.parentNode) ? t.parentNode.insertBefore(n, t) : ""
  },
  after: function(n, t) {
    var p = t.parentNode;
    if (p) {
      (p.lastchild === t) ? p.appendChild(n) : p.insertBefore(n, t.nextSibling)
    }
  },
  remove: function(e) {
    (e && e.parentNode) ? e.parentNode.removeChild(e) : ""
  },
  zindex: function(max) {
    var index = 0
      , elms = document.getElementsByTagName("*");
    for (var i = 0, l = elms.length; i < l; i++) {
      var zindex = Number(document.defaultView.getComputedStyle(elms[i], null).getPropertyValue("z-index"));
      if (zindex > index) {
        index = zindex
      }
    }
    return max ? index : index + 1
  },
  noconflict: (container)=>{
    if (container?.querySelectorAll) {
      [...container.querySelectorAll('*:not([class*="wt"])')].map((elm)=>elm.classList.add("wt-noconflict"))
    }
  }
});
$wt.extend({
  timer: $wt.timer || [],
  defer: function(fnc, delay=25) {
    clearTimeout(this.timer[fnc]);
    this.timer[fnc] = setTimeout(fnc, delay)
  },
  domqueue: $wt.domqueue || [],
  domchange: (fnc)=>{
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    let queue = (mutations,i)=>{
        let runner = $wt.domqueue[i];
        if (runner) {
          if (!$wt.inProgress) {
            runner(mutations);
            i++;
            queue(mutations, i)
          }
        }
      }
    ;
    if ($wt.domqueue.length === 0 && MutationObserver) {
      let register = new MutationObserver((mutations)=>{
          if (!$wt.inProgress) {
            queue(mutations, 0)
          }
        }
      );
      register.observe(document, {
        childList: !0,
        subtree: !0,
        attributes: !0
      })
    }
    $wt.domqueue.push(fnc)
  }
  ,
  ready: function(f) {
    /^(in|com)/.test(document.readyState) ? f() : setTimeout($wt.ready, 0, f)
  },
  on: function(o, e, f) {
    (e === "load" && document.readyState === "complete") ? f() : (o.addEventListener) ? o.addEventListener(e, f, !1) : ""
  },
  trigger: function(dom, name, args) {
    var e, v = document.createEvent;
    if (v) {
      e = document.createEvent("HTMLEvents");
      e.initEvent(name, !0, !0)
    } else {
      e = document.createEventObject();
      e.eventType = name
    }
    e.eventName = name;
    e.parameters = args || !1;
    e.sourceTarget = dom;
    if (v) {
      dom.dispatchEvent(e)
    } else {
      dom.fireEvent("on" + e.eventType, e)
    }
  }
});
$wt.extend({
  addEvent: $wt.on
});
$wt.extend({
  dictionary: {},
  isRtl: function(direction, lang) {
    direction = direction || document.dir || "ltr";
    lang = lang || document.lang;
    return (direction === "rtl" || /(ar|arc|dv|fa|ha|he|khw|ks|ku|ps|ur|yi)/i.test(lang))
  },
  label: function(set, label, lang, placeholder, range) {
    var dico = $wt.dictionary[set];
    var translate = !1;
    lang = lang || document.lang;
    placeholder = placeholder || [];
    range = range || 0;
    if (dico) {
      var lng = dico[lang];
      if (lng) {
        var strg = lng[label];
        if (strg) {
          translate = (typeof strg === "string") ? strg : strg[range];
          if (typeof strg === "object") {
            return strg
          } else if (translate === "string") {
            translate = translate.replace(/{(\d+)}/g, function(match, key) {
              return (typeof placeholder[key - 1] !== "undefined") ? placeholder[key - 1] : ""
            })
          }
        }
      }
      if (translate === "" || !translate) {
        if (dico.en) {
          if (dico.en[label]) {
            translate = dico.en[label]
          }
        }
      }
    }
    return translate || "UNKNOWN LABEL"
  },
  addTranslation: function(json) {
    let dico = $wt.dictionary;
    for (let i in json) {
      if (typeof dico[i] !== "object") {
        dico[i] = {}
      }
      dico[i] = $wt.mergeParams(dico[i], json[i])
    }
    $wt.dictionary = dico
  },
  loadTranslations: function(translations, callback, comp) {
    if (typeof callback !== 'function') {
      return console.log("WTERROR: callback parameter is mandatory")
    }
    const add = (response)=>{
        let data = {};
        if (comp && !response[comp]) {
          data[comp] = response;
          response = data
        }
        $wt.addTranslation(response)
      }
    ;
    if (typeof translations === "string") {
      if (!$wt.isLoad[translations]) {
        $wt.isLoad[translations] = translations;
        $wt.getFile({
          url: translations,
          type: 'json',
          success: (json)=>{
            let error = !1;
            try {
              let labels = (typeof json === "string") ? JSON.parse(json) : json;
              add(labels)
            } catch (e) {
              console.log("WTERROR: Couldn't load custom dictionary'", translations, "'");
              error = !0
            }
            callback(!error)
          }
          ,
          error: ()=>{
            console.log("WTERROR: Couldn't load custom dictionary'", translations, "'");
            callback(!1)
          }
        })
      } else {
        callback(!0)
      }
    } else if (typeof translations === "object") {
      add(translations);
      callback(!0)
    } else {
      callback(!0)
    }
  }
});
$wt.extend({
  isLoad: [],
  handleCrossorigin: function(url, tag) {
    let source = $wt.absolute(url, !0);
    let isDyna = url.includes("?");
    let isToke = url.includes('?t=') || url.includes('&t=');
    url = source.href;
    if (source.hostname !== location.hostname && source.hostname.indexOf("europa.eu") > -1 && url.indexOf("webtools/webtools.") > -1) {
      if (!!(window.MSInputMethodContext && document.documentMode)) {
        url += (isDyna ? "&" : "?") + "ref=" + btoa(window.location.origin)
      } else if (tag) {
        tag.setAttribute("crossorigin", "anonymous")
      }
    }
    if (!isToke) {
      url += (isDyna ? "&" : "?") + "t=" + $wt.token
    }
    return url
  },
  include: function(srcFile, callback, ext, forceReload) {
    var tag;
    var target;
    var isLoad = !!($wt.isLoad[srcFile]);
    if (isLoad === !1 || forceReload) {
      ext = (ext) ? ext : $wt.ext(srcFile);
      if (ext === "css") {
        tag = document.createElement("link");
        tag.setAttribute("type", "text/css");
        tag.setAttribute("rel", "stylesheet");
        tag.setAttribute("media", "all");
        target = document.getElementsByTagName("head")[0]
      } else {
        tag = document.createElement("script");
        tag.setAttribute("type", "text/javascript");
        target = document.getElementsByTagName("body")[0]
      }
      $wt.isLoad[srcFile] = tag;
      if (typeof callback === "function") {
        tag.onload = function() {
          callback(tag)
        }
        ;
        tag.onerror = function() {
          callback("error")
        }
      }
      srcFile = $wt.handleCrossorigin(srcFile, tag);
      tag.setAttribute((ext === "css") ? "href" : "src", srcFile);
      target.appendChild(tag)
    } else if (typeof callback === "function") {
      callback()
    }
    return tag
  },
  load: function(files, callback) {
    var toLoad = (typeof files === "string") ? [files] : files;
    $wt.include(toLoad[0], function(e) {
      toLoad.shift();
      if (toLoad.length === 0) {
        if (typeof callback === "function") {
          callback(e)
        }
        return
      }
      $wt.load(toLoad, callback)
    }, $wt.ext(toLoad[0]), !1)
  },
  jsonp: (url,callback)=>$wt.getFile({
    url: $wt.absolute(url).replace("?&", "?"),
    type: "json",
    error: ()=>callback({}, "error"),
    success: callback
  }),
  jsonstat: function(params) {
    const bePatient = (what)=>{
        $wt.waitUntil(()=>{
            return window.JSONstat
          }
        ).then(()=>{
            window.waitJSONSTAT = !1;
            $wt.jsonstat(what)
          }
        ).catch(()=>{
            console.log("WTERROR: jsonstat - 'libs' was not loaded correctly.")
          }
        )
      }
    ;
    if (!window.JSONstat && !window.waitJSONSTAT) {
      window.waitJSONSTAT = !0;
      $wt.load([$wt.root + '/libs/json-stat/json-stat.js', $wt.root + '/libs/json-stat/utils/json-stat.utils.js'], ()=>bePatient(params));
      return
    } else if (window.waitJSONSTAT) {
      bePatient(params);
      return
    }
    let opt = $wt.mergeParams({
      from: !1,
      ready: !1,
      to: !1,
      categories: !1,
      sheets: !1,
      series: !1
    }, params);
    let from = opt.from;
    let to = opt.to;
    let fnc = opt.ready;
    if (!from) {
      console.log("WTERROR: jsonstat - 'from' parameter is missing.");
      return
    } else if (typeof fnc !== "function") {
      console.log("WTERROR: jsonstat - 'ready' parameter is missing.");
      return
    }
    if (typeof from === "string") {
      from = from.replace(/&?precision=[0-9]+/gi, '')
    }
    const sanitizeLabels = jsonstat=>{
        let labels = jsonstat?.dimension?.geo?.category?.label || {};
        if (labels.DE) {
          jsonstat.dimension.geo.category.label.DE = labels.DE.split('(')[0]
        }
        return jsonstat
      }
    ;
    const convert = data=>{
        data = sanitizeLabels(data);
        let jsonStat = JSONstat(data);
        if (to === "html") {
          jsonStat = JSONstatUtils.datalist(jsonStat)
        } else if (to === "csv") {
          jsonStat = JSONstatUtils.toCSV(jsonStat)
        } else if (to === "lasko") {
          jsonStat = $wt.toLasko({
            from: "jsonstat",
            data: jsonStat,
            options: opt
          })
        }
        fnc(jsonStat, opt)
      }
    ;
    (typeof from === "object") ? convert(from) : $wt.jsonp(from, (json,error)=>{
        (!error) ? convert(json) : console.log("WTERROR: jsonstat - request failed on url: \n", from)
      }
    )
  },
  toLasko: (config)=>{
    const buildSeries = data=>data.map(row=>{
        return {
          label: row.label,
          data: []
        }
      }
    )
    let catDim = [];
    let categories = [];
    let dataSeries = [];
    let catSheets = [];
    let dataSeriesDim = [];
    let from = config.from;
    let sheets = config.options.sheets;
    let cat = config.options.categories;
    let series = config.options.series;
    let output = {
      label: config.data.label,
      length: from === 'lasko' ? 0 : config.data.length,
      id: from === 'lasko' ? 0 : config.data.id,
      size: from === 'lasko' ? 0 : config.data.size,
      categories: [],
      sheets: [],
      series: [],
    };
    if (cat) {
      if (from === 'lasko') {
        categories = config.data.categories
      } else {
        try {
          catDim = config.data.Dimension(cat);
          categories = catDim.Category()
        } catch (err) {
          console.log("WTERROR: undefined categories " + cat + " in your dataset")
        }
      }
      output.categories = categories.map((row,index)=>{
          return {
            label: row.label,
            id: (catDim.id) ? catDim.id[index] : row.label
          }
        }
      )
    }
    if (series) {
      if (from === 'lasko') {
        catSheets = config.data.sheets;
        dataSeries = config.data.sheets[0].series.map((row,index)=>{
            return {
              label: row.label,
              index: index
            }
          }
        )
      } else {
        try {
          dataSeriesDim = config.data.Dimension(series);
          dataSeries = dataSeriesDim.Category();
          catSheets = sheets ? config.data.Dimension(sheets).Category() : []
        } catch (err) {
          console.log("WTERROR: undefined series " + series + " or sheets " + sheets + " in your dataset")
        }
      }
      output.series = dataSeries.map((row,index)=>{
          return {
            label: row.label,
            id: dataSeriesDim.id ? dataSeriesDim.id[index] : String(row.label).replace(/[^a-z0-9 ]/gi, '')
          }
        }
      );
      if (sheets) {
        output.sheets = catSheets.map(row=>{
            return {
              label: row.label,
              series: buildSeries(dataSeries)
            }
          }
        )
      } else {
        output.sheets[0] = {
          label: null,
          series: buildSeries(dataSeries)
        }
      }
    }
    if (cat && series) {
      if (from === 'lasko') {
        catSheets = config.data.sheets;
        output.sheets = catSheets;
        return output
      }
      output.sheets.map((_null,h)=>{
          categories.map((_null,i)=>{
              dataSeries.map((_null,j)=>{
                  let matrix = config.data.id.map(id=>{
                      if (id === cat) {
                        return i
                      } else if (id === series) {
                        return j
                      } else if (id === sheets) {
                        return h
                      }
                      return 0
                    }
                  );
                  output.sheets[h].series[j].data[i] = {
                    value: config.data.Data(matrix).value,
                    id: catDim.id[i]
                  }
                }
              )
            }
          )
        }
      )
    }
    return output
  }
  ,
  ajax: function(config) {
    var url = config.url;
    var error = config.error;
    var success = config.success;
    var data = config.data;
    var dataType = config.dataType;
    var binary = config.binary;
    var credential = config.withCredentials || !1;
    var method = config.method ?? ((data) ? "POST" : "GET");
    if (url !== "" && typeof url === "string") {
      if (!dataType) {
        dataType = "application/x-www-form-urlencoded"
      }
      var request = (function() {
          if (window.XMLHttpRequest) {
            return new XMLHttpRequest()
          } else if (window.ActiveXObject) {
            return new ActiveXObject("Microsoft.XMLHTTP")
          }
          return !1
        }
      )();
      if (!request) {
        return
      }
      url = url.replace(/&amp;/ig, "&");
      request.onreadystatechange = function() {
        if (request.readyState === 4) {
          if (request.status !== 200 && request.status !== 206 && request.status !== 304) {
            if (typeof error === "function") {
              error(config, request)
            }
          } else {
            if (typeof success === "function") {
              (binary) ? success(request) : success(request.responseText, request.responseXML, config)
            } else {
              return {
                txt: request.responseText,
                xml: request.responseXML
              }
            }
          }
        }
      }
      ;
      request.open(method, url, !0);
      if (binary) {
        request.responseType = "arraybuffer"
      }
      if (credential) {
        request.withCredentials = !0
      }
      request.setRequestHeader("Cache-Control", 'max-age=2678400');
      if (method === 'POST') {
        request.setRequestHeader("Content-Type", dataType);
        url = '';
        for (var prop in data) {
          url += encodeURIComponent(prop) + '=' + encodeURIComponent(data[prop]) + '&'
        }
        data = url.substring(0, url.length - 1);
        request.send(data)
      } else {
        request.send(null)
      }
    }
  },
  post: function(url, params) {
    if (!params.target || params.target === "iframe") {
      var ifrm = document.createElement("iframe");
      ifrm.name = "phiflochri";
      ifrm.style.display = "none";
      $wt.after(ifrm, document.body)
    }
    var form = document.createElement("form");
    form.method = "post";
    form.style.display = "none";
    form.action = url;
    form.target = params.target || "phiflochri";
    function populateInput(n, v) {
      if (Array.isArray(v)) {
        for (var i = 0, l = v.length; i < l; i++) {
          populateInput(n + "[" + i + "]", v[i])
        }
      } else if (v) {
        var inp = document.createElement("INPUT");
        inp.type = "hidden";
        inp.name = n;
        try {
          inp.value = decodeURIComponent(v)
        } catch (e) {
          inp.value = v
        }
        form.appendChild(inp)
      }
    }
    for (var name in params) {
      populateInput(name, params[name])
    }
    $wt.after(form, document.body);
    form.submit()
  },
  getFile: async(params={})=>{
    params = $wt.mergeParams({
      url: !1,
      type: !1,
      method: null,
      options: {
        to: "jsonstat",
        categories: !1,
        series: !1,
        sheets: !1,
        coordinates: !1,
        assoc: 0,
        header: 0,
        row: 0,
        styles: 1,
        empty: 0,
        ecl: 0,
        proxy: ($wt.urlParams.wtproxy === 'false') ? !1 : !0
      },
      success: ()=>{}
      ,
      error: (error)=>{
        console.warn(error)
      }
    }, params);
    if (!params.url) {
      params.error("No url provided for getFile.");
      return
    }
    let process;
    let urlInfo = $wt.absolute(params.url, !0);
    let referer = btoa(location.protocol + '//' + location.hostname);
    params.url = urlInfo.href;
    const reqSameDomain = (callback)=>{
        if (urlInfo.hostname === location.hostname) {
          $wt.ajax({
            url: params.url,
            success: callback,
            method: params.method,
            error: ajaxError
          });
          return !0
        }
        return !1
      }
    ;
    const ajaxError = (response,xhr)=>{
        try {
          response = JSON.parse(xhr.response);
          params.error("WTINFO: " + (response?.message || response.wtstatus?.status))
        } catch (e) {
          params.error("Ajax request failed on url: \n" + params.url)
        }
      }
    ;
    const xlsBufferToJson = (content)=>{
        let assoc = params.options.assoc;
        let geojson = {
          "type": "FeatureCollection",
          "features": []
        };
        let asGeojson = (params.options.to === "geojson");
        let geoParams = params.options.coordinates || params.options.geocode;
        let geoSheet = !1;
        let geoReference = {};
        if (asGeojson) {
          if (!geoParams) {
            console.log("WTINFO: 'coordinates' or 'geocode' must be present when geojson is requested");
            return geojson
          }
          geoSheet = Number((geoParams.lat || geoParams).split(";")[0].split("sheet:")[1]) - 1;
          geoReference = {
            lat: (geoParams.lat + "").split('column:')[1],
            lon: (geoParams.lon + "").split('column:')[1],
            geo: (geoParams + "").split('column:')[1]
          }
        }
        let pivot = {};
        let workbook = XLSX.read(content, {
          type: "buffer"
        });
        workbook.SheetNames.map((sheetName,index)=>{
            let sheetRef = workbook.Sheets[sheetName];
            Object.keys(sheetRef).forEach(cell=>{
                if (sheetRef[cell].l && sheetRef[cell].l.Target) {
                  sheetRef[cell].v = sheetRef[cell].l.Target
                }
              }
            );
            let keyName = assoc ? sheetName : (index + 1);
            let startFrom = Number(params.options.row);
            let startFromRow = (!isNaN(startFrom)) ? (startFrom - 1) : 0;
            let colsName = {};
            let header = Number(params.options.header) || 0;
            pivot[keyName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
              defval: '',
              header: 'A',
              raw: !0
            }).filter((row,i)=>{
                if (i === 0 || i === (header - 2)) {
                  colsName = JSON.parse(JSON.stringify(row))
                }
                return i >= startFromRow
              }
            ).map(row=>{
                let feature = {
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": []
                  },
                  "properties": {}
                };
                Object.keys(colsName).map(k=>{
                    let rowValue = row[k];
                    let newKeyName = assoc ? colsName[k] : k;
                    if (asGeojson) {
                      feature.properties[newKeyName] = rowValue;
                      if (geoReference.lat) {
                        feature.geometry.coordinates = [row[geoReference.lat], row[geoReference.lon]]
                      } else if (geoReference.geo) {
                        feature.geometry.search = geoReference.geo.split(',').map(kk=>{
                            return row[kk] || ""
                          }
                        ).filter(kk=>{
                            return (kk + "").trim()
                          }
                        ).join(', ')
                      }
                    }
                    row[newKeyName] = rowValue;
                    if (assoc && !asGeojson) {
                      delete row[k]
                    }
                  }
                );
                if (asGeojson && geoSheet === index) {
                  geojson.features.push(feature)
                }
                return row
              }
            )
          }
        );
        return asGeojson ? geojson : pivot
      }
    ;
    const batchGeocodingService = (geojson,key)=>{
        if (geojson.features.length > 5000) {
          return params.error("The geocoding service is limited to 5000 requests.")
        }
        let copy = geojson.features.slice(0);
        let nbr = 1;
        let cache = {};
        (queue = async()=>{
            let index = nbr - 1;
            let feature = copy[0];
            if (!feature) {
              params.success(geojson, key);
              $wt.file.save(key, geojson);
              return
            }
            copy.shift();
            let term = feature.geometry.search;
            let fromCache = !1;
            let result = [];
            if (cache[term]) {
              fromCache = !0;
              geojson.features[index].geometry.coordinates = cache[term];
              result[0] = {
                lat: cache[term][1],
                lon: cache[term][0]
              }
            } else {
              result = await fetch("https://gisco-services.ec.europa.eu/nominatim/search.php?limit=1&format=json&q=" + term).then(res=>res.json());
              if (!result[0]) {
                cache[term] = [0, 0];
                console.warn("WTINFO: The geocoding service returns an empty response based on your search criteria:", feature.geometry.search)
              } else {
                geojson.features[index].geometry.coordinates = cache[term] = [Number(result[0].lon), Number(result[0].lat)]
              }
            }
            let info = {
              id: nbr++,
              success: !!result[0],
              cache: fromCache,
              term: term,
              coordinates: {
                lat: Number(result[0]?.lat || 0),
                lon: Number(result[0]?.lon || 0)
              },
              order: index + 1,
              total: geojson.features.length
            };
            $wt.trigger(window, "wtGeocodingResponse", info);
            if (typeof params.progress === "function") {
              params.progress(info)
            }
            delete geojson.features[index].geometry.search;
            queue()
          }
        )()
      }
    ;
    if (/(xlsx?|ods)/i.test(params.type)) {
      let url = encodeURIComponent(params.url);
      let isGeojson = params.options.to === "geojson";
      let isGeocode = params.options.geocode && !params.options.coordinates;
      let checkURL = ["https://www.acceptance.europa.eu/assets/wcloud/widgets", "/wcloud/preview/"];
      if (checkURL.some(str=>url.includes(encodeURIComponent(str)))) {
        url += '&v=' + (Math.random() + '').slice(2, 8)
      }
      if (!params.options.proxy && (isGeojson || params.options.to === "json")) {
        let info = {};
        if (isGeojson && isGeocode) {
          info = await $wt.file.info(url, params.options.geocode);
          if (info.cache) {
            return params.success(info.cache)
          }
          let start = {};
          $wt.trigger(window, "wtGeocodingResponse", start);
          if (typeof params.progress === "function") {
            params.progress(start)
          }
        }
        $wt.include($wt.root + "/libs/sheetjs/xlsx.full.min.js", ()=>{
            let proxyURL = $wt.root + "/rest/requests/file/stream?url=" + url;
            if (urlInfo.hostname === location.hostname) {
              proxyURL = decodeURIComponent(url)
            }
            fetch(proxyURL).then(res=>res.arrayBuffer()).then(content=>{
                let data = xlsBufferToJson(content);
                if (isGeojson && isGeocode) {
                  batchGeocodingService(data, info.key)
                } else {
                  params.success(data)
                }
              }
            ).catch((err)=>console.log(err))
          }
        )
      } else if (isGeojson || params.options.to === "json" || params.options.to === "tables") {
        let request = [];
        let endpoint = "geocode";
        request.push("url=" + url);
        request.push("ref=" + referer);
        if (params.options.to) {
          request.push("to=" + params.options.to);
          if (params.options.to === "tables") {
            endpoint = "tables"
          }
        }
        if (params.options.row) {
          request.push("row=" + params.options.row)
        }
        if (params.options.assoc) {
          request.push("assoc=" + params.options.assoc)
        }
        if (params.options.styles) {
          request.push("styles=" + params.options.styles)
        }
        if (params.options.header) {
          request.push("header=" + params.options.header)
        }
        if (params.options.empty) {
          request.push("empty=" + params.options.empty)
        }
        if (params.options.ecl) {
          request.push("ecl=" + params.options.ecl)
        }
        if (params.options.coordinates) {
          request.push("coordinates=" + encodeURIComponent(JSON.stringify(params.options.coordinates)))
        } else if (params.options.geocode) {
          request.push("geocode=" + params.options.geocode)
        }
        $wt.ajax({
          url: $wt.root + `/rest/spreadsheets/${endpoint}?` + request.join('&'),
          error: ajaxError,
          success: (json)=>{
            try {
              json = (typeof json === 'string') ? JSON.parse(json) : json;
              if (!json.wtstatus.success) {
                return ajaxError()
              }
              params.success(json.data, json.info || null)
            } catch (e) {
              params.error("The service seems down.\n", e)
            }
          }
        })
      } else {
        $wt.ajax({
          url: $wt.root + "/rest/spreadsheets/?url=" + url + "&ref=" + referer,
          error: ajaxError,
          success: (json)=>{
            try {
              json = (typeof json === 'string') ? JSON.parse(json) : json;
              if (!json.wtstatus.success) {
                return ajaxError()
              }
              delete json.wtstatus;
              params.success(json)
            } catch (e) {
              params.error("The service seems down.\n", e)
            }
          }
        })
      }
    } else if (params.type === "csv") {
      if (reqSameDomain(params.success)) {
        return
      }
      $wt.ajax({
        url: $wt.root + "/rest/requests/files?type=csv&urlToRequest=" + encodeURIComponent(params.url) + "&ref=" + referer,
        error: ajaxError,
        success: (json)=>{
          try {
            json = (typeof json === 'string') ? JSON.parse(json) : json;
            if (!json.wtstatus.success) {
              params.error("The request failed on url: \n" + params.url);
              return
            }
            params.success(json.data)
          } catch (e) {
            params.error("The service seems down.\n", e)
          }
        }
      })
    } else if (params.type === "xml" || params.type === "html") {
      $wt.ajax({
        url: $wt.root + "/rest/requests/files?type=xml&urlToRequest=" + encodeURIComponent(params.url) + "&ref=" + referer,
        error: ajaxError,
        success: function(json) {
          try {
            json = (typeof json === 'string') ? JSON.parse(json) : json;
            if (!json.wtstatus.success) {
              params.error("The request failed on url: \n" + params.url);
              return
            }
            params.success(json.data)
          } catch (e) {
            params.error("The service seems down.\n", e)
          }
        }
      })
    } else if (params.type === "json" || params.type === "lasko") {
      process = (json)=>{
        try {
          json = (typeof json === "string") ? JSON.parse(json) : json;
          params.success(json)
        } catch (e) {
          params.error("The content of the file is not a valid JSON.\n", e)
        }
      }
      ;
      if (reqSameDomain(process)) {
        return
      }
      $wt.ajax({
        url: $wt.root + "/rest/requests/files?type=json&urlToRequest=" + encodeURIComponent(params.url) + "&ref=" + referer,
        error: ajaxError,
        success: (json)=>{
          try {
            json = (typeof json === "string") ? JSON.parse(json) : json;
            if (!json.wtstatus.success) {
              params.error("The request failed on url: \n" + params.url);
              return
            }
            process(json.data)
          } catch (e) {
            params.error("The service seems down.\n", e)
          }
        }
      })
    } else if (params.type === "jsonstat") {
      process = (jsondata)=>{
        var from = jsondata ? JSON.parse(jsondata) : params.url;
        $wt.jsonstat($wt.mergeParams($wt.mergeParams(params, params.options), {
          from: from,
          ready: params.success
        }))
      }
      ;
      if (reqSameDomain(process)) {
        return
      }
      process()
    } else if (params.method.toLowerCase() === "head") {
      if (reqSameDomain(params.success)) {
        return
      }
      $wt.ajax({
        url: $wt.root + "/rest/requests/files?url=" + encodeURIComponent(params.url) + "&ref=" + referer,
        method: params.method,
        error: params.error,
        success: params.success
      })
    } else {
      return params.error("WTINFO: Unknown type for getting the file: \n" + params.url)
    }
  }
  ,
  file: {
    info: (url,extra='webtools')=>{
      let path = $wt.root + "/rest/requests/file/info";
      path += '?url=' + url;
      path += '&key=' + btoa(extra);
      return fetch(path, {
        mode: 'no-cors',
        cache: 'no-store'
      }).then(res=>res.json()).then(res=>{
          return {
            name: decodeURIComponent(url).split('/').pop().split('?')[0].split('#')[0],
            key: res.key,
            cache: res.cache
          }
        }
      ).catch(res=>{
          console.log("WTINFO: File seems not reachable.", res);
          return !1
        }
      )
    }
    ,
    save: (key,value)=>{
      return fetch($wt.root + "/rest/requests/file/save", {
        method: 'POST',
        mode: 'cors',
        cache: 'no-store',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: new URLSearchParams({
          key: key,
          value: JSON.stringify(value)
        })
      }).then(res=>{
          return res
        }
      ).catch(()=>!1)
    }
  }
});
$wt.extend({
  isDNTOn: function() {
    var doNotTrackOption = (window.doNotTrack || window.navigator.doNotTrack || window.navigator.msDoNotTrack || '');
    return (doNotTrackOption.charAt(0) === '1' || doNotTrackOption === 'yes')
  },
  cookie: {
    set: function(params) {
      params = $wt.mergeParams({
        name: "",
        value: !1,
        days: !1,
        path: "/",
        domain: this.getDomain(!0),
        date: new Date(),
        secure: location.protocol === "https:",
        httponly: !1,
        samesite: "Lax",
        expires: ""
      }, params);
      if (params.days) {
        params.date.setTime(params.date.getTime() + (params.days * 24 * 60 * 60 * 1000));
        params.expires = `; expires=${params.date.toUTCString()}`
      }
      var toEncode = params.value;
      if (typeof toEncode === 'object') {
        toEncode = JSON.stringify(toEncode)
      }
      try {
        toEncode = decodeURIComponent(toEncode)
      } catch (e) {}
      try {
        toEncode = encodeURIComponent(toEncode)
      } catch (e) {}
      document.cookie = `${params.name}=${toEncode}` + params.expires + `; path=${params.path}` + `; domain=${params.domain}` + `; samesite=${params.samesite}` + (params.secure ? "; secure" : "") + (params.httponly ? "; httponly" : "")
    },
    exists: function(name) {
      return this.get(name) !== !1
    },
    get: function(name) {
      var nameEQ = name + "="
        , ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var cook = ca[i];
        while (cook.charAt(0) === ' ') {
          cook = cook.substring(1, cook.length)
        }
        if (cook.indexOf(nameEQ) === 0) {
          var response = cook.substring(nameEQ.length, cook.length);
          try {
            return decodeURIComponent(response)
          } catch (e) {
            return response
          }
        }
      }
      return !1
    },
    remove: (name)=>{
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      $wt.cookie.set({
        name: name,
        days: -1
      })
    }
    ,
    getDomain: function(includeDot) {
      var processedDomain = includeDot ? '.' : '';
      var host = this.getHost();
      var domain = host.split('.');
      if (/^([0-9\.]{7,}|\[[0-9a-f:]{10,}\]|[^\.]+)$/i.test(host)) {
        return host
      }
      if (domain.length > 2) {
        processedDomain += domain.slice(-3).join('.')
      } else {
        processedDomain = ''
      }
      return processedDomain
    },
    getHost: function() {
      return location.hostname
    },
    consent: {
      closedBanner: function() {
        var original = $wt.cookie.consent.get(2);
        if (original.cm) {
          original.closed = !0
        }
        $wt.cookie.consent.set(original)
      },
      accept: {
        all: function() {
          $wt.cookie.consent.set({
            cm: !0,
            all1st: !0,
            closed: !1
          });
          $wt.include($wt.root + "/services/cck/?cookie-consent=all");
          $wt.trigger(window, 'cck_all_accepted')
        },
        onlyTechnical: function() {
          $wt.cookie.consent.set({
            cm: !0,
            all1st: !1,
            closed: !1
          });
          $wt.include($wt.root + "/services/cck/?cookie-consent=technical");
          $wt.trigger(window, 'cck_technical_accepted')
        }
      },
      is: {
        allAccepted: function() {
          return window.euCookieConsent ? (this.choiceMade() && !$wt.cookie.exists('eu_optout')) : (this.choiceMade() && $wt.cookie.consent.get(2).all1st === !0)
        },
        technicalAccepted: function() {
          return window.euCookieConsent ? !$wt.cookie.exists('eu_optout') : $wt.cookie.consent.get(2).cm === !0
        },
        choiceMade: function() {
          return window.euCookieConsent ? $wt.cookie.exists('eu_cookie_consent') : $wt.cookie.consent.get(2).cm === !0
        },
        bannerClosed: function() {
          return $wt.cookie.consent.get(2).closed === !0
        }
      },
      set: function(json) {
        if (json.hasOwnProperty('cm')) {
          $wt.cookie.set({
            name: 'cck1',
            value: JSON.stringify(json),
            days: 6 * 30
          })
        } else {
          var host = (window.location.host.indexOf("europa.eu") >= 0) ? ".europa.eu" : !1;
          document.cookie = "eu_cookie_consent=" + escape(json) + "; path=/" + ((!host) ? "" : "; domain=" + host)
        }
      },
      get: function(version) {
        if (version === 2) {
          if ($wt.cookie.exists('cck1')) {
            var originalValue = JSON.parse($wt.cookie.get('cck1'));
            this.set(originalValue)
          }
          return JSON.parse($wt.cookie.get('cck1')) || {
            cm: !1,
            all1st: !1,
            closed: !1
          }
        }
        var cck = unescape($wt.cookie.get("eu_cookie_consent"));
        return (cck !== "false") ? JSON.parse(cck) : {
          a: {},
          r: {}
        }
      },
      status: function() {
        var cck = this.get();
        var get = function(a) {
          for (var x in a) {
            if (a[x].indexOf("europa-analytics") >= 0) {
              return !0
            }
          }
          return !1
        };
        if (get(cck.a)) {
          return "accepted"
        }
        if (get(cck.r)) {
          return "refused"
        }
        return !1
      },
      update: function(stat) {
        var cck = this.get();
        for (var x in cck) {
          for (var y in cck[x]) {
            if (Array.isArray(cck[x][y])) {
              var tmp = cck[x][y].filter(function(elm) {
                return elm !== "europa-analytics"
              });
              cck[x][y] = tmp
            }
          }
        }
        stat = (stat) ? "a" : "r";
        cck[stat].europa = cck[stat].europa || [];
        cck[stat].europa.push("europa-analytics");
        this.set(JSON.stringify(cck))
      }
    }
  }
});
((frame)=>{
    if (top.window === window) {
      window.addEventListener('message', (evt)=>{
          if (evt.data.service === 'ping') {
            [...document.querySelectorAll('iframe')].map(frame=>{
                if (frame.contentWindow === evt.source) {
                  frame.contentWindow.postMessage({
                    service: 'pong',
                    name: window.name,
                    title: document.title,
                    location: location.href
                  }, "*")
                }
              }
            )
          }
        }
      )
    }
    if (top.window !== window) {
      $wt.on(window, "keydown", (evt)=>{
          window.parent.postMessage({
            service: 'wtFrameEvents',
            name: window.name,
            title: document.title,
            type: evt.type,
            key: evt.keyCode,
            shift: evt.shiftKey,
            code: evt.code,
            tag: evt.target.tagName
          }, "*")
        }
      )
    }
    $wt.frame = {
      ping: (callback,options={})=>{
        if (top.window !== window) {
          window.parent.postMessage({
            ...{
              service: 'ping',
              name: window.name,
              title: document.title
            },
            ...options
          }, "*");
          window.addEventListener('message', (evt)=>{
              if (evt.data.service === 'pong') {
                if (typeof callback === 'function') {
                  callback(evt.data)
                }
              }
            }
          )
        }
      }
      ,
      init: ()=>{
        if (top.window !== window) {
          if (window.name.indexOf("WT_FRAME_") !== -1) {
            if (!!window.InternalError) {
              document.querySelectorAll('a[href^="#"]').forEach(a=>{
                  a.addEventListener('click', (e)=>{
                      let target = document.querySelector(a.getAttribute('href'));
                      if (target) {
                        e.preventDefault();
                        target.scrollIntoView()
                      }
                    }
                  )
                }
              )
            }
            $wt.on(window, "load", ()=>{
                $wt.frame.resize();
                $wt.on(window, "resize", $wt.frame.resize);
                $wt.on(window, "orientationchange", $wt.frame.resize);
                if ("MutationObserver"in window) {
                  (new MutationObserver($wt.frame.resize)).observe(document.body, {
                    childList: !0,
                    subtree: !0
                  })
                }
              }
            );
            $wt.on(document.getElementById('nexteuropasearch__search-results') || window, 'click', function(evt) {
              var evt = evt || window.event;
              var targ = evt.target || evt.srcElement;
              while (targ && !targ.href) {
                targ = targ.parentNode
              }
              if (targ && targ.href && !targ.getAttribute("aria-controls") && !targ.isTracked && (!targ.getAttribute("href").match(/^(javascript|mailto|#|sms)/i) || ($wt.urlParams.render === "iframe" && targ.href.indexOf('europa.eu/search') < 0))) {
                evt.preventDefault();
                evt.stopPropagation();
                window.parent.postMessage({
                  service: 'frame-analytics',
                  link: targ.href
                }, '*');
                setTimeout(function() {
                  targ.isTracked = !0;
                  targ.click()
                }, 350)
              }
            });
            var isSearchPage = document.getElementById('internal-search');
            if (isSearchPage) {
              var countElement = document.querySelector("meta[property='nexteuropasearch:count']");
              var count = countElement && +countElement.getAttribute("content") || 0;
              parent.postMessage({
                service: "frame-search-track",
                keyword: isSearchPage.value,
                count: count,
                location: location.href
              }, "*")
            }
          }
        }
      }
      ,
      resize: ()=>{
        if (top.window === window && !parent.postMessage) {
          return
        }
        let height = Math.round(document.body.scrollHeight);
        let bodyInfo = window.getComputedStyle(document.body);
        let properties = ['margin-top', 'margin-bottom', 'padding-top', 'padding-bottom'];
        let extraHeight = properties.reduce((re,val)=>{
            let num = bodyInfo.getPropertyValue(val) || 0;
            return re + Number(num.replace(/\D/g, ''))
          }
          , 0);
        parent.postMessage({
          service: "frame",
          name: window.name,
          height: height + extraHeight + 20
        }, "*")
      }
      ,
      parent: function(e) {
        var data = e.data || {};
        if (data.service === 'cck-check-network') {
          let iframes = document.querySelectorAll("iframe[src*='/crs/iframe']");
          [...iframes].forEach((iframe,index)=>{
              if (iframe && iframe.contentWindow) {
                setTimeout(()=>{
                    iframe.contentWindow.postMessage({
                      ...{
                        service: 'cck-check-network',
                      },
                      ...data
                    }, "*")
                  }
                  , 250 * (index + 1))
              }
            }
          )
        } else if (data.service === 'request-parent-info') {
          let iframe = document.querySelector('iframe[name="' + data.name + '"]');
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
              service: "receive-parent-info",
              locationHref: window.location.href,
              documentTitle: document.title
            })
          }
        } else if (data.service === 'frame-search-track') {
          if ($wt.analytics.parameters) {
            $wt.analytics.parameters.search = {
              keyword: data.keyword,
              category: "Europa Search",
              count: data.count
            };
            $wt.trackPageView($wt.analytics.parameters);
            window.name = data.location
          }
        } else if (data.service === 'frame-analytics') {
          $wt.trackLinks(data.link)
        } else if (data.service === "frame") {
          var frame = document.querySelectorAll("iframe[name='" + data.name + "']");
          if (!frame || !frame.length) {
            return
          }
          var height = data.height;
          var frm = frame[0];
          frm.setAttribute("frameBorder", 0);
          var width = frm.offsetWidth;
          var prev = frm.previousWidth;
          if (width === prev && frm.offsetHeight === height) {
            frm.previousHeight = height;
            frm.previousWidth = width
          } else {
            if (width > prev && frm.previousHeight) {
              height = (frm.previousHeight) - Math.round((width - prev) * (height / width))
            }
            frm.previousHeight = height;
            frm.previousWidth = frm.offsetWidth;
            frm.height = height;
            frm.style.setProperty("margin", 0);
            frm.style.setProperty("border", 0);
            frm.style.setProperty("padding", 0);
            frm.style.setProperty("outline", 0);
            frm.style.setProperty("height", height + "px", "important")
          }
        } else if (data.service === "laco-open-modal") {
          if ($wt.laco) {
            $wt.laco.openModal(data)
          } else {
            let isDyn = ($wt.env === 'local');
            $wt.load([$wt.root + ((isDyn) ? '' : '/css') + "/webtools.laco.css?t=1726474686", $wt.root + ((isDyn) ? '' : '/js') + "/webtools.laco.js?t=1726474686"], ()=>{
                $wt.laco.openModal(data)
              }
            )
          }
        } else if (data.service === "etrans-translation") {
          let action = data.action;
          if (!$wt.etrans) {
            let container = document.createElement("div");
            container.style.display = "none";
            document.body.appendChild(container);
            $wt.render(container, {
              service: "etrans",
              dynamic: !0,
              hidden: !0
            });
            $wt.waitUntil(()=>$wt.etrans).then(()=>$wt.etrans.translate("body", data.to))
          } else if (action === 'cancel') {
            $wt.etrans.cancelTranslation()
          } else if (action === 'abort') {
            $wt.etrans.abortTranslation()
          } else if (action === 'translate') {
            $wt.etrans.translate("body", data.to)
          }
        }
      }
    };
    $wt.on(window, "wtReady", $wt.frame.init);
    $wt.on(window, "message", $wt.frame.parent)
  }
)();
$wt.extend({
  dialog: (config={})=>{
    let params = {
      ...{
        mode: "modal",
        container: document.body,
        class: "wt-modal",
        title: !1,
        content: !1,
        footer: !1
      },
      ...config
    };
    if (!params.title || !params.content) {
      return
    }
    let id = "m_" + $wt.id();
    let dialog = document.createElement('dialog');
    let form = document.createElement('form');
    let currentFocusableElement = document.activeElement || !1;
    dialog.appendChild(form);
    dialog.setAttribute('aria-modal', !0);
    dialog.setAttribute('aria-labelledby', 'title_' + id);
    dialog.className = params.class + " wt-modal-" + params.mode;
    form.innerHTML = `
      <header class="wt-modal--header">
        <h2 class="wt-modal--header-title" id="title_${id}" autofocus tabindex="-1">
          ${$wt.filterXss(params.title)}
        </h2>
        <button type="submit" class="wt-modal--header-close" value="close">
          <span class="wt-offscreen">Close</span>
          <span class="wt-icon-close wt-ecl-icon--l"></span>
        </button>
      </header>
      <div class="wt-modal--content">
        ${$wt.filterXss(params.content)}
      </div>
    `;
    if (params.footer) {
      form.innerHTML += `<footer class="wt-modal--footer">${$wt.filterXss(params.footer)}</footer>`
    }
    [...dialog.querySelectorAll('header button, footer button')].map(elm=>{
        elm.addEventListener('click', (e)=>{
            e.preventDefault();
            let data = $wt.serialize(form);
            let ref = e.target;
            if (ref.name && ref.value) {
              data[ref.name] = ref.value
            }
            $wt.trigger(dialog, "close", data);
            dialog.remove();
            if (params.mode !== "modal" && params.mode !== "screen" && currentFocusableElement) {
              currentFocusableElement.focus()
            }
          }
        )
      }
    );
    params.container.appendChild(dialog);
    if (params.mode === "modal" || params.mode === "screen") {
      dialog.showModal()
    } else {
      dialog.show()
    }
    if (params.mode === "confirm") {
      dialog.querySelector('button').remove()
    }
    return dialog
  }
  ,
  pop: function(c={}) {
    var currentFocusableElement = document.activeElement || !1;
    $wt.pop.close = function() {
      $wt.pop.wtOverlayer.classList.remove('wtOverLayerBlock');
      $wt.remove($wt.pop.wtPopup);
      if (currentFocusableElement) {
        currentFocusableElement.focus()
      }
      if (typeof $wt.pop.wtPopup.onClose === "function") {
        $wt.pop.wtPopup.onClose()
      }
    }
    ;
    if (!$wt.pop.wtOverlayer) {
      $wt.pop.wtOverlayer = document.createElement("div");
      $wt.pop.wtOverlayer.className = "wtOverlayer";
      $wt.after($wt.pop.wtOverlayer, document.body);
      $wt.on(document, "keydown", function(evt) {
        evt = evt || window.event;
        if (evt.keyCode === 27) {
          $wt.pop.close()
        }
      });
      $wt.on($wt.pop.wtOverlayer, "click", $wt.pop.close)
    }
    $wt.pop.wtOverlayer.classList.add("wtOverLayerBlock");
    $wt.pop.wtPopup = document.createElement("div");
    $wt.pop.wtPopup.className = "wtPopup " + ((c.fullscreen) ? "wtPopupFullscreen " : "") + c["class"];
    $wt.after($wt.pop.wtPopup, $wt.pop.wtOverlayer);
    $wt.pop.wtPopup.setAttribute("tabindex", "0");
    $wt.pop.wtPopup.setAttribute("role", "dialog");
    $wt.pop.wtPopup.setAttribute("aria-describedby", "modalDescription");
    $wt.pop.wtPopup.dialogDesc = document.createElement("div");
    $wt.pop.wtPopup.dialogDesc.id = "modalDescription";
    $wt.pop.wtPopup.dialogDesc.className = "wtOffscreen";
    $wt.pop.wtPopup.appendChild($wt.pop.wtPopup.dialogDesc);
    $wt.pop.wtPopup.dialogDesc.innerHTML = "Escape will cancel and close the window";
    var hh = c.head || c.title;
    hh = (hh) ? "<h1 class='wt-head'><span>" + hh + "</span></h1>" : "<h1 class='wt-head' aria-hidden='true'>&nbsp;</h1>";
    $wt.pop.wtPopup.head = document.createElement("div");
    $wt.pop.wtPopup.head.className = "wtPopupHead";
    $wt.pop.wtPopup.head.innerHTML = hh;
    $wt.pop.wtPopup.appendChild($wt.pop.wtPopup.head);
    $wt.pop.wtPopup.content = document.createElement("div");
    $wt.pop.wtPopup.content.className = "wtPopupContent";
    $wt.pop.wtPopup.content.innerHTML = (c.content) ? c.content : "";
    $wt.pop.wtPopup.appendChild($wt.pop.wtPopup.content);
    $wt.pop.wtPopup.footer = document.createElement("div");
    $wt.pop.wtPopup.footer.className = "wtPopupFooter";
    $wt.pop.wtPopup.footer.innerHTML = (c.footer) ? c.footer : "";
    $wt.pop.wtPopup.appendChild($wt.pop.wtPopup.footer);
    var x = "Close";
    var k = document.createElement("a");
    k.className = "wt-link wtPopupCloseBtn";
    k.href = "#close";
    k.innerHTML = x + '<b aria-hidden="true"><span>&times;</span></b>';
    k.setAttribute("role", "button");
    $wt.pop.wtPopup.appendChild(k);
    $wt.pop.wtPopup.querySelector('.wtPopupCloseBtn').onclick = function(e) {
      e.preventDefault();
      $wt.pop.close();
      return !1
    }
    ;
    $wt.aria.trap($wt.pop.wtPopup);
    $wt.pop.wtPopup.focus();
    if (typeof c.callback === "function") {
      c.callback($wt.pop.wtPopup)
    }
    return $wt.pop.wtPopup
  }
});
$wt.extend({
  shadeColor: function(color, percent) {
    var bit = parseInt(color.slice(1), 16);
    bin = percent < (0) ? 0 : 255,
      pourcent = percent < (0) ? percent * -1 : percent,
      red = bit >> 16,
      green = bit >> 8 & 0x00FF,
      blue = bit & 0x0000FF;
    return '#' + (0x1000000 + (Math.round((bin - red) * pourcent) + red) * 0x10000 + (Math.round((bin - green) * pourcent) + green) * 0x100 + (Math.round((bin - blue) * pourcent) + blue)).toString(16).slice(1)
  },
  color: function(color, percent) {
    if (!!window.CanvasRenderingContext2D === !1) {
      return color
    }
    if (!$wt.wtColor) {
      $wt.wtColor = document.createElement('canvas').getContext('2d')
    }
    var canvas = $wt.wtColor;
    canvas.fillStyle = color;
    canvas.fillRect(0, 0, 1, 1);
    var get = function(val) {
      if (val > 255) {
        val = 255
      } else if (val < 0) {
        val = 0
      }
      return val
    };
    var col = canvas.getImageData(0, 0, 1, 1)
      , perc = Math.floor(percent / 100 * 255)
      , red = get(col.data[0] + perc)
      , green = get(col.data[1] + perc)
      , blue = get(col.data[2] + perc);
    return '#' + ((red << 16) | (green << 8) | blue).toString(16)
  }
});
$wt.extend({
  languages: {
    "official": {
      "bg": "български",
      "es": "español",
      "cs": "čeština",
      "da": "dansk",
      "de": "Deutsch",
      "et": "eesti",
      "el": "ελληνικά",
      "en": "English",
      "fr": "français",
      "ga": "Gaeilge",
      "hr": "hrvatski",
      "it": "italiano",
      "lv": "latviešu",
      "lt": "lietuvių",
      "hu": "magyar",
      "mt": "Malti",
      "nl": "Nederlands",
      "pl": "polski",
      "pt": "português",
      "ro": "română",
      "sk": "slovenčina",
      "sl": "slovenščina",
      "fi": "suomi",
      "sv": "svenska"
    },
    "non-official": {
      "ca": "català",
      "sq": "shqiptar",
      "ar": "عربى",
      "hy": "հայերեն",
      "be": "беларускі",
      "he": "עִברִית",
      "hi": "हिंदी",
      "is": "íslenska",
      "ja": "日本の",
      "no": "norsk",
      "mk": "Македонски",
      "ru": "русский",
      "tr": "Türk",
      "ur": "اردو",
      "vi": "Tiếng Việt",
      "zh": "中文",
      "uk": 'Українська',
    },
    "regexpURL": /(https?:)?\/\/[^\/]+\/?(.*)(_|-|::|=|\/)([a-z]{2})(\.|&|#|$|\?|\/)(.*)/ig,
    list: function() {
      return Object.keys(this["official"]).concat(Object.keys(this["non-official"]))
    },
    fromURL: function(url) {
      let webtools = $wt.url.params.get("lang", url);
      let lang = webtools ? webtools : (url + "").replace(this.regexpURL, "$4").toLowerCase();
      let list = this.list();
      return ((lang.length === 2 && list.includes(lang)) ? lang.toLowerCase() : null)
    },
    survey: ()=>{
      const check = ()=>{
          $wt.urlParams = $wt.getUrlParams();
          let currentLang = $wt.lang(!0) || 'en';
          if (currentLang !== document.lang && !$wt.inProgress && !$wt.urlParams.etrans) {
            document.lang = currentLang;
            $wt.refresh();
            $wt.trigger(window, "wtLanguageChange")
          }
        }
      ;
      $wt.domchange((mutations)=>{
          let htmlChange = mutations.filter(mut=>mut.attributeName === "lang" && mut.target.tagName.toLowerCase() === "html");
          if (htmlChange.length) {
            check()
          }
        }
      );
      ["pushState", "replaceState"].forEach(evt=>{
          let old = history[evt];
          history[evt] = function() {
            let ret = old.apply(this, arguments);
            check();
            return ret
          }
        }
      );
      window.addEventListener('popstate', check)
    }
  },
  lang: function(def) {
    let etrans = $wt.urlParams.etrans;
    let etransnolive = $wt.urlParams.etransnolive;
    if (!def && !etrans && document.lang) {
      return document.lang
    }
    let list = this.languages.list();
    let browserLang = window?.navigator?.language ? navigator.language.split('-')[0] : !1;
    let browserLangSupport = (browserLang && list.includes(browserLang)) ? browserLang : !1;
    let lang = def || browserLangSupport || "en";
    let html = document.querySelector("html");
    let meta = document.querySelectorAll("meta[http-equiv='Content-Language']");
    let url = this.languages.fromURL(window.location);
    if (html && html.lang) {
      lang = (html.lang).split("_")[0].split("-")[0]
    } else if (meta[0]) {
      lang = meta[0].content
    } else if (url && (!etrans || etransnolive)) {
      lang = url
    }
    if (def) {
      return (lang === !0) ? '' : lang
    }
    document.masterLang = lang;
    if (etrans && !etransnolive) {
      let checkLang = ((/^(\w{2})$/.test(etrans)) && list.includes(etrans)) ? etrans : lang;
      lang = $wt.urlParams.etrans = checkLang
    }
    document.lang = lang;
    return lang
  }
});
$wt.extend({
  ecas: function(config) {
    var params = $wt.mergeParams({
      redirect: location.href,
      success: function() {},
      error: !1
    }, config);
    var cookie = $wt.cookie.get('wtecas');
    var ticket = $wt.urlParams.ticket;
    var url = 'https://ecas.ec.europa.eu/cas/login?userDetails=true&groups="*"&service=' + encodeURIComponent(params.redirect);
    var getUserInfoURL = $wt.template(['https://ecas.ec.europa.eu/cas/serviceValidate?userDetails=true&groups="*"', '&ticket={ticket}&getinfo=true&service={redirect}', ].join(''), {
      ticket: ticket,
      redirect: encodeURIComponent($wt.url.params.remove('ticket', params.redirect))
    });
    if (cookie) {
      params.success(JSON.parse(atob(cookie)))
    } else if (ticket) {
      $wt.getFile({
        type: "xml",
        url: getUserInfoURL,
        success: function(response) {
          var xml = response.replace(/cas:/g, '');
          var temp = document.createElement("div");
          temp.innerHTML = xml;
          var tags = ["assuranceLevel", "email", "user", "firstname", "lastname", "telephoneNumber"];
          var final = {};
          [].forEach.call(temp.querySelectorAll(tags.join(',')), function(node) {
            var nodeValue = node.innerText;
            var nodeName = node.tagName.toLowerCase();
            final[nodeName] = (!isNaN(nodeValue)) ? Number(nodeValue) : nodeValue
          });
          if (final['assuranceLevel'] < 30) {
            alert('Only inter-institutional account are allowed');
            return
          }
          $wt.cookie.set({
            name: "wtecas",
            value: btoa(JSON.stringify(final))
          });
          params.success(final)
        },
        error: function() {
          if (typeof params.error === 'function') {
            params.error()
          } else {
            console.log('ECAS service is not accessible for the moment. Please try later.')
          }
        }
      })
    } else {
      location.href = url
    }
  }
});
window._paq = window._paq || [];
$wt.extend({
  getSupercookieName: function(cookName) {
    return location.host === 'europa.eu' ? 'main_' + cookName : cookName
  },
  trackLinks: function(str, callback) {
    if (!window._paq || !window.Piwik || !$wt.analytics.isTrackable() || !$wt.analytics.isActive) {
      return !1
    }
    if (typeof str === "string") {
      var isExternal = $wt.isExternal(str);
      var isDocument = $wt.isDocument(str);
      var isLink = (!str.match(/^(javascript|mailto|#|sms)/i));
      var isNotSame = (str !== window.location.href);
      if ((isExternal || isDocument) && isLink && isNotSame) {
        _paq.push(['trackLink', str, isDocument ? 'download' : 'link', null, callback])
      }
    } else if (Piwik.getAsyncTracker && !$wt.analytics.parameters.mobile) {
      var t = Piwik.getAsyncTracker();
      [].forEach.call(document.body.querySelectorAll('a[href]'), function(a) {
        if (!a.analyticsWasHere && !a.piwikTrackers && a.href && a.href.match && !a.href.match(/^(javascript|mailto|#|sms)/i) && !a.getAttribute("aria-controls") && !/ea_ignore|piwik_ignore/.test(a.className)) {
          t.addListener(a);
          a.analyticsWasHere = !0
        }
      })
    }
  },
  isDocument: function(s) {
    if (typeof s !== "string") {
      if (s.className && (s.className + "").indexOf("piwik_download") !== -1) {
        return !0
      }
      s = s.href || ""
    }
    var d = ['7z', 'aac', 'apk', 'arc', 'arj', 'asf', 'asx', 'avi', 'azw3', 'bin', 'csv', 'deb', 'dmg', 'doc', 'docx', 'epub', 'exe', 'flv', 'gif', 'gz', 'gzip', 'hqx', 'ibooks', 'jar', 'jpg', 'jpeg', 'js', 'mobi', 'mp2', 'mp3', 'mp4', 'mpg', 'mpeg', 'mov', 'movie', 'msi', 'msp', 'odb', 'odf', 'odg', 'ods', 'odt', 'ogg', 'ogv', 'pdf', 'phps', 'png', 'ppt', 'pptx', 'qt', 'qtm', 'ra', 'ram', 'rar', 'rpm', 'sea', 'sit', 'tar', 'tbz', 'tbz2', 'bz', 'bz2', 'tgz', 'torrent', 'txt', 'wav', 'wma', 'wmv', 'wpd', 'xls', 'xlsx', 'xml', 'z', 'zip'];
    var p = new RegExp('\\.(' + d.join('|') + ')([?&#]|$)','i');
    return p.test(s)
  },
  isExternal: function(str) {
    var params = $wt.analytics.sitePaths;
    str = $wt.absolute(str);
    str = str.replace(/#.*$/, '').replace(/\?.*$/, '');
    var isExternal = !0;
    for (var x in params) {
      if (String(str).indexOf(params[x]) !== -1) {
        isExternal = !1
      }
    }
    return isExternal
  },
  trackPageView: function(params, can) {
    params = $wt.mergeParams($wt.analytics.parameters, params);
    var cfg = $wt.analytics.config();
    var inst = params.instance || 'ec.europa.eu';
    var tmpp = params.sitePath;
    var path = (typeof tmpp === "string") ? [tmpp] : tmpp;
    var status = params.isActive || cfg[inst].status;
    var url = params.trackerURL || cfg[inst].url;
    if (!params.siteID) {
      console.log("WTERROR: Europa Analytics, missing 'siteID' parameter")
    } else if (!path) {
      console.log("WTERROR: Europa Analytics, missing 'sitePath' parameter")
    } else if (!status) {
      console.log('WTERROR: The Europa Analytics instance, [' + inst + '] is down, please try again later')
    } else {
      var currentUrl = $wt.analytics.cleanURL(location.href);
      if ((params.mode === "auto" || params.mode === "manual") && (params.currentTitle !== document.title || params.currentUrl !== currentUrl)) {
        if (document.referrer) {
          _paq.push(['setReferrerUrl', params.currentUrl])
        }
        _paq.push(['setCustomUrl', currentUrl]);
        _paq.push(['setGenerationTimeMs', 0]);
        params.currentUrl = currentUrl
      }
      _paq.push(['setSiteId', params.rsiteID || params.siteID]);
      _paq.push(["setDomains", $wt.analytics.sitePaths]);
      if ($wt.analytics.parameters.cookiePath) {
        _paq.push(['setCookiePath', $wt.analytics.parameters.cookiePath]);
        can = !0
      }
      var backwardCompatibility = params.rsiteID ? 'setCustomDimensionValue' : 'setCustomDimension';
      if (params.lang) {
        _paq.push([backwardCompatibility, 1, params.lang])
      } else if ($wt.lang(!0) !== !1) {
        _paq.push([backwardCompatibility, 1, $wt.lang(!0)])
      } else {
        _paq.push([backwardCompatibility, 1, "unknown"])
      }
      if (params.siteSection) {
        _paq.push([backwardCompatibility, 2, params.siteSection])
      }
      (function(strSize, maxSize, arr, meta) {
          if (meta) {
            (((meta.getAttribute('content') || "").split(",")).sort()).forEach(function(e) {
              var k = e.replace(/^\s+|\s+$/gm, '');
              strSize += k.length + 1;
              if (strSize < maxSize) {
                arr.push(k)
              }
            });
            _paq.push([backwardCompatibility, 3, '.' + (arr.join('.')).toUpperCase() + '.'])
          }
        }
      )(0, 253, [], document.querySelector("meta[name='ec_departments']"));
      if (Array.isArray(params.dimensions)) {
        params.dimensions.map((dim,index)=>{
            _paq.push([backwardCompatibility, Number(dim.id) || (index + 4), dim.value || ""])
          }
        )
      }
      if (params.is404) {
        _paq.push(['setDocumentTitle', '404/URL=' + (document.location.pathname + document.location.search) + '/From=' + (document.referrer)])
      } else if (params.is403) {
        _paq.push(['setDocumentTitle', '403/URL=' + (document.location.pathname + document.location.search) + '/From=' + (document.referrer)])
      } else if (params.is500) {
        _paq.push(['setDocumentTitle', '500/URL=' + (document.location.pathname + document.location.search) + '/From=' + (document.referrer)])
      } else {
        _paq.push(['setDocumentTitle', document.title])
      }
      var eaVersion = params.rsiteID ? "ppms" : "piwik";
      _paq.push(['setTrackerUrl', url + '/' + eaVersion + '.php']);
      if (params.search) {
        _paq.push(['trackSiteSearch', params.search.keyword || "", params.search.category || !1, params.search.count || 0])
      }
      if (params.before) {
        if (typeof window[params.before] === "function") {
          _paq = window[params.before](_paq)
        }
      }
      if (!params.search && params.mode !== "notnow") {
        _paq.push(['trackPageView'])
      }
      if (params.mode === "notnow") {
        params.mode = "manual"
      }
      if (!params.mobile) {
        _paq.push(['enableLinkTracking'])
      }
      _paq.push(['setDoNotTrack', !0])
    }
    if (params.after) {
      if (typeof window[params.after] === "function") {
        window[params.after]()
      }
    }
    $wt.analytics.parameters = params;
    return {
      "process": !!can,
      "instance": status,
      "url": url,
      "params": params
    }
  },
  analytics: {
    cleanURL: function(str) {
      var url = str.split('#');
      if (str.indexOf('/#/') > -1) {
        return url.slice(0, 2).join('#')
      }
      return url[0]
    },
    init: function() {
      if (Element.prototype._addEventListener) {
        return
      }
      Element.prototype._addEventListener = Element.prototype.addEventListener;
      Element.prototype.addEventListener = function(type, listener, useCapture) {
        if (/ea_ignore|piwik_ignore/.test(this.className) && (listener).toString().indexOf("function(cZ){cZ=cZ||R.event;") > -1) {
          return
        }
        if (useCapture) {
          this._addEventListener(type, listener, useCapture)
        } else {
          this._addEventListener(type, listener)
        }
        if (!this.eventsList) {
          this.eventsList = {}
        }
        if (!this.eventsList[type]) {
          this.eventsList[type] = []
        }
        this.eventsList[type].push({
          type: type,
          listener: listener,
          useCapture: !!useCapture
        })
      }
      ;
      Element.prototype.getEventListeners = function(type) {
        if (!this.eventsList) {
          this.eventsList = {}
        }
        return (!type) ? this.eventsList : this.eventsList[type]
      }
      ;
      _paq._push = _paq.push;
      $wt.on(window, "cck_refused", function() {
        setTimeout($wt.analytics.disable, 250)
      })
    },
    disable: function() {
      $wt.analytics.deletePiwikCookies();
      this.isActive = !1;
      [].forEach.call(document.querySelectorAll("a"), function(elm) {
        for (var x in elm) {
          if (x === "piwikTrackers" || x === "analyticsWasHere") {
            var events = elm.getEventListeners();
            for (var y in events) {
              [].forEach.call(events[y], function(evt) {
                if ((evt.listener).toString().indexOf("function(cZ){cZ=cZ||R.event;") > -1) {
                  elm.removeEventListener(y, evt.listener);
                  delete elm.analyticsWasHere;
                  delete elm.piwikTrackers
                }
              })
            }
          }
        }
      });
      if (window._paq) {
        _paq._push = _paq.push;
        _paq.push = function() {
          console.log("WTINFO - This method is disabled (GDPO).")
        }
      }
    },
    enable: function() {
      if (window.Piwik) {
        this.isActive = !0;
        $wt.trackLinks();
        if (_paq._push) {
          _paq.push = _paq._push
        }
      } else if ($wt.exists('analytics')) {
        $wt.analytics.run($wt.analytics.container, $wt.analytics.parameters)
      }
    },
    isActive: !1,
    config: function() {
      return {
        "root": {
          "ec.europa.eu": ["ec.europa.eu\/index*", "ec.europa.eu\/about_*", "ec.europa.eu\/represent_*", "ec.europa.eu\/info", "ec.europa.eu\/priorities", "ec.europa.eu\/commission", "ec.europa.eu\/about", "ec.europa.eu\/atwork", "ec.europa.eu\/policies", "ec.europa.eu\/contracts_grants", "ec.europa.eu\/news", "ec.europa.eu\/legislation", "ec.europa.eu\/geninfo\/europa_analytics_*", "ec.europa.eu\/geninfo\/legal_notices_*", "ec.europa.eu\/green-papers", "ec.europa.eu\/white-papers", "ec.europa.eu\/cookies", "ec.europa.eu\/contact", "ec.europa.eu\/services", "ec.europa.eu\/your-rights", "ec.europa.eu\/visits", "ec.europa.eu\/sitemap"],
          "europa.eu": ["europa.eu\/index*", "europa.eu\/european-union"],
          "allowedIframeHosts": ["europa.eu", "ec.europa.eu"]
        },
        "ec.europa.eu": {
          "url": "https:\/\/webanalytics.ec.europa.eu\/",
          "status": true
        },
        "europa.eu": {
          "url": "https:\/\/webanalytics.europa.eu\/",
          "status": true
        },
        "testing": {
          "url": "https:\/\/webanalytics.acc.fpfis.tech.ec.europa.eu\/",
          "status": true
        },
        "awstesting": {
          "url": "https:\/\/webanalytics.acc.fpfis.tech.ec.europa.eu\/",
          "status": true
        },
        "optin": ["ema.europa.eu"]
      }
    },
    parameters: !1,
    mobile: function(event) {
      var params = $wt.analytics.parameters;
      if (!params.mobile || !$wt.analytics.isActive) {
        return !0
      }
      var el = event.srcElement || event.target;
      while (el && !el.href) {
        el = el.parentNode
      }
      if (el && el.href && !el.href.match(/^(javascript|mailto|#|sms)/i) && !el.piwikTrackers && el.href !== "" && el.href !== (location.href).split("#")[0] && ($wt.isExternal(el.href) || $wt.isDocument(el)) && !el.realClick && !/ea_ignore|piwik_ignore/.test(el.className)) {
        event.preventDefault();
        event.stopPropagation();
        if (el.isTrigger) {
          return
        }
        el.isTrigger = !0;
        var callback = (params.mobile || {}).callback;
        var validate = (typeof window[callback] === "function") ? window[callback](el) : !0;
        var process = function() {
          clearTimeout($wt.analytics.timer);
          if (validate) {
            el.realClick = !0;
            el.click()
          }
        };
        $wt.trackLinks(el.href, process);
        $wt.analytics.timer = setTimeout(process, ((params.mobile || {}).delay || 1000))
      }
    },
    track: function() {
      clearTimeout(window.analyticsTimer);
      window.analyticsTimer = setTimeout(function() {
        $wt.trackLinks()
      }, 100)
    },
    getCookiePath: function() {
      var params = $wt.analytics.parameters;
      var tmpp = params.sitePath;
      var path = (typeof tmpp === "string") ? [tmpp] : tmpp;
      if (!params) {
        return "/"
      }
      path.sort(function(a, b) {
        return a.length > b.length
      });
      var setCookiePath = (function(ref) {
          for (var i = 0, l = path.length; i < l; i++) {
            if (ref.indexOf(path[i]) !== -1 && ref.indexOf(path[i]) < 9) {
              return "/" + ((path[i].replace(/.*?:?\/\//g, "").replace(/^\/+|\/+$/g, ''))).split("/").slice(1).join("/")
            }
          }
          return !1
        }
      )(location.href);
      return $wt.analytics.parameters.cookiePath = setCookiePath
    },
    deletePiwikCookies: function() {
      var cookieNames = document.cookie.split(";");
      for (var i = 0; i < cookieNames.length; i++) {
        var cookName = (cookieNames[i].split("=")[0]).trim();
        if (/_pk_(ses|id|ref)[\.a-z0-9]*/.test(cookName)) {
          $wt.cookie.remove(cookName);
          $wt.cookie.set({
            name: cookName,
            value: '',
            days: -1,
            path: $wt.analytics.getCookiePath()
          });
          document.cookie = cookName + '=; Path=' + $wt.analytics.getCookiePath() + '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        }
      }
    },
    isOptInModeEnable: function() {
      var cfg = $wt.analytics.config();
      var pathsOptin = cfg.optin || [];
      var domain = location.host.split('.').length > 3 ? location.host.split('.').slice(-3).join('.') : location.host;
      return pathsOptin.indexOf(domain) !== -1
    },
    isOptedIn: function() {
      return $wt.cookie.get($wt.getSupercookieName('eu_optin')) === "true"
    },
    isOptedOut: function() {
      return $wt.cookie.get($wt.getSupercookieName('eu_optout')) === "true"
    },
    optOut: function() {
      $wt.analytics.isOptInModeEnable() ? $wt.cookie.remove($wt.getSupercookieName('eu_optin')) : $wt.cookie.set({
        name: $wt.getSupercookieName('eu_optout'),
        value: !0,
        days: 365
      });
      $wt.analytics.deletePiwikCookies();
      $wt.cookie.consent.update(!1)
    },
    optIn: function() {
      $wt.analytics.isOptInModeEnable() ? $wt.cookie.set({
        name: $wt.getSupercookieName('eu_optin'),
        value: !0,
        days: 365
      }) : $wt.cookie.remove($wt.getSupercookieName('eu_optout'));
      $wt.cookie.consent.update(!0)
    },
    isTrackable: function() {
      if ($wt.analytics.isOptedOut() || $wt.cookie.consent.status() === "refused" || $wt.isDNTOn()) {
        $wt.analytics.deletePiwikCookies();
        return !1
      }
      if ($wt.analytics.isOptInModeEnable()) {
        return $wt.analytics.isOptedIn()
      }
      return !0
    },
    pushstate: function() {
      var p = $wt.analytics.parameters;
      if (p.mode !== "auto" || !this.isActive) {
        return
      }
      clearTimeout(window.analyticsTimer);
      window.analyticsTimer = setTimeout(function() {
        $wt.trackPageView(p)
      }, 10)
    },
    popstate: function(e) {
      var p = $wt.analytics.parameters;
      if (p.mode !== "auto" || !this.isActive) {
        return
      }
      clearTimeout(window.analyticsTimer);
      window.analyticsTimer = setTimeout(function() {
        var curURL = $wt.analytics.cleanURL(location.href);
        if (curURL !== p.currentUrl) {
          $wt.analytics.parameters.currentUrl = curURL;
          $wt.trackPageView($wt.analytics.parameters)
        }
      }, 50)
    },
    shouldNotTrack: function(params) {
      if ($wt.isDNTOn()) {
        if (/_pk_(ses|id|ref)[\.a-z0-9]*/.test(document.cookie)) {
          $wt.analytics.deletePiwikCookies()
        }
        return !0
      } else if ($wt.cookie.exists('cck1') && !window.euCookieConsent) {
        var cck1 = JSON.parse($wt.cookie.get("cck1"));
        if ($wt.cookie.consent.is.choiceMade()) {
          return !(cck1.cm && cck1.all1st)
        }
        return !!params.explicit
      } else if ($wt.exists('cck')) {
        return params.explicit
      } else if ($wt.cookie.exists('eu_cookie_consent')) {
        var euCook = JSON.parse(decodeURIComponent($wt.cookie.get('eu_cookie_consent')));
        return JSON.stringify(euCook.r).indexOf('europa-analytics') > -1
      }
      return !!params.explicit
    },
    cckEventsListener: function() {
      $wt.on(window, "cck_all_accepted", function() {
        setTimeout($wt.analytics.enable, 250)
      });
      $wt.on(window, "cck_technical_accepted", function() {
        setTimeout($wt.analytics.disable, 250)
      });
      $wt.on(window, "cck_accepted", function() {
        $wt.cookie.consent.accept.all();
        setTimeout($wt.analytics.enable, 250)
      });
      $wt.on(window, "cck_refused", function() {
        $wt.cookie.consent.accept.onlyTechnical();
        setTimeout($wt.analytics.disable, 250)
      })
    },
    run: function(obj, params) {
      var self = this;
      if (!$wt.analytics.container) {
        this.cckEventsListener()
      }
      $wt.analytics.container = obj;
      params.currentUrl = $wt.analytics.cleanURL(document.referrer);
      params.currentTitle = document.title;
      if (params.mobile || 'ontouchstart'in window) {
        params.mobile = params.mobile || !0
      }
      params.mode = params.mode || "default";
      params.mode = (params.mode === "manual") ? "notnow" : params.mode;
      params.explicit = !!params.explicit;
      var rules = function() {
        $wt.analytics.parameters = params;
        if (self.shouldNotTrack(params)) {
          return
        }
        $wt.analytics.getCookiePath();
        var cfg = $wt.analytics.config();
        var temp = [];
        for (var x = 0, l = params.sitePath.length; x < l; x++) {
          var path = params.sitePath[x];
          var alias = cfg.root[path];
          if (alias) {
            for (var z in alias) {
              temp.push(alias[z])
            }
          } else {
            temp.push(path)
          }
        }
        $wt.analytics.sitePaths = temp;
        self.parameters = params;
        var tracker = $wt.trackPageView(params);
        if (tracker.process && tracker.instance) {
          self.isActive = !0;
          self.init();
          var eaVersion = params.rsiteID ? "ppms" : "piwik";
          $wt.include(tracker.url + '/' + eaVersion + '.js', function() {
            if (params.mobile) {
              $wt.on(document, "click", $wt.analytics.mobile)
            } else {
              $wt.domchange($wt.analytics.track)
            }
            if (params.mode === "auto") {
              $wt.on(window, 'popstate', $wt.analytics.popstate);
              $wt.on(window, 'pushstate', $wt.analytics.pushstate);
              history.pushState = function() {
                $wt.trigger(window, "pushstate", arguments);
                History.prototype.pushState.apply(history, arguments)
              }
            }
            $wt.trigger(window, "wtAnalyticsActivated")
          }, "js", !1, params.async)
        }
      };
      $wt.getFile({
        type: "json",
        url: "https://eams.fpfis.tech.ec.europa.eu/config?siteID=" + params.siteID + "&instance=" + params.instance,
        success: function(response) {
          params = $wt.mergeParams(params, response);
          if (Object.keys(response).length) {
            rules()
          } else {
            console.log('WTINFO: No tracked website.')
          }
        },
        error: function() {
          console.error("WTINFO: Europa Analytics failed loading.")
        }
      });
      $wt.next(obj)
    }
  }
});
(function(win, doc, previous) {
    var prev = function(elm, slc) {
      var temp = {};
      for (; elm && elm !== document; elm = elm.parentNode) {
        var childs = elm.querySelectorAll(slc);
        if (childs.length >= 2) {
          temp.children = childs;
          temp.parent = elm;
          break
        }
      }
      return temp
    };
    const trap = (cnt,key)=>{
        let focusable = cnt.querySelectorAll("a[href]:not([tabindex='-1']), input, select, textarea, button, [role='menuitem'], [role='button']");
        let isMenu = (cnt.get && cnt.get("role") === "menu");
        let firstChars = [];
        if (cnt.get && cnt.get("tabindex")) {
          focusable = Array.prototype.slice.call(focusable);
          focusable.unshift(cnt)
        }
        if (isMenu) {
          [].forEach.call(focusable, (btn)=>{
              btn.setAttribute('tabIndex', -1);
              let txt = btn.value || btn.textContent || "";
              firstChars.push(txt.trim()[0].toLowerCase())
            }
          )
        }
        let first = focusable[0];
        let last = focusable[focusable.length - 1];
        let index = 0;
        if (key && first) {
          first.focus()
        }
        const jumpTo = (nbr)=>{
            if (nbr < 0) {
              nbr = focusable.length - 1
            } else if (nbr > focusable.length - 1) {
              nbr = 0
            }
            index = nbr;
            focusable[nbr].focus()
          }
        ;
        cnt.onkeydown = e=>{
          if (e.keyCode === 36) {
            jumpTo(0)
          } else if (e.keyCode === 35) {
            jumpTo(focusable.length - 1)
          } else if (e.keyCode === 13) {
            index = 0
          } else if (e.keyCode === 27 && cnt.set) {
            cnt.set("hidden", !0);
            index = 0;
            if (win.lastFocus) {
              win.lastFocus.focus()
            }
          } else if (e.keyCode === 40 && isMenu) {
            index++;
            jumpTo(index);
            e.preventDefault()
          } else if (e.keyCode === 38 && isMenu) {
            index--;
            jumpTo(index);
            e.preventDefault()
          } else if (e.keyCode === 9) {
            if (isMenu) {
              return cnt.set("hidden", !0)
            }
            if (e.shiftKey) {
              if (doc.activeElement === first) {
                last.focus();
                e.preventDefault()
              }
            } else {
              if (doc.activeElement === last) {
                first.focus();
                e.preventDefault()
              }
            }
          } else if (isMenu) {
            let start = index + 1;
            let char = e.key.toLowerCase();
            if (char.length > 1) {
              return
            }
            if (start >= (focusable.length - 1)) {
              start = 0
            }
            let current = firstChars.indexOf(char, start);
            if (current === -1) {
              current = firstChars.indexOf(char, 0)
            }
            if (current > -1) {
              index = current;
              jumpTo(index)
            }
          }
        }
        ;
        return cnt
      }
    ;
    var reset = function(e) {
      var current = e.target || !1;
      if (previous && current && previous !== current) {
        [].forEach.call(previous.from, function(brother) {
          if (brother.get("aria-expanded") === "true") {
            brother.set("aria-expanded", !1)
          }
        });
        [].forEach.call(previous.to, function(targ) {
          if (!targ.has("hidden")) {
            targ.set("hidden", "")
          }
        });
        $wt.trigger(window, "aria-dropdown-previous-close", previous);
        previous = !1
      }
    };
    var menu = function(from) {
      if (!this.has("hidden")) {
        previous = from;
        if (from.key) {
          if (!from.keyboardInit) {
            from.keyboardInit = !0;
            trap(this, from.key)
          }
          let first = this.querySelector('a[href], button, [role="menuitem"]');
          if (first) {
            first.focus()
          }
          from.key = !1
        }
      }
    };
    var dialog = function(elm, escKey) {
      if (!escKey && !this.has("hidden")) {
        win.lastFocus = elm;
        win.lastDialog = this;
        trap(this, !0)
      } else {
        if (win.lastFocus) {
          if (win.lastFocus.get("aria-expanded") === "true") {
            win.lastFocus.set("aria-expanded", !1)
          }
          win.lastFocus.focus();
          win.lastFocus = !1
        }
        if (win.lastDialog) {
          win.lastDialog.set("hidden", "");
          win.lastDialog = !1
        }
      }
    };
    var tab = function(elm, init, focus) {
      var tabs = prev(elm, '[role="tab"]');
      [].forEach.call(tabs.children || [], function(btn, index) {
        if (init) {
          btn.setAttribute("tabindex", (btn.getAttribute("aria-selected") === "true") ? 0 : -1);
          btn.index = index;
          btn.onkeydown = function(e) {
            var e = e || win.event;
            var current = !1;
            if (e.keyCode === 39) {
              current = tabs.children[btn.index + 1] || tabs.children[0]
            } else if (e.keyCode === 37) {
              current = tabs.children[btn.index - 1] || tabs.children[tabs.children.length - 1]
            } else if (e.keyCode === 36) {
              current = tabs.children[0]
            } else if (e.keyCode === 35) {
              current = tabs.children[tabs.children.length - 1]
            }
            if (/35|36|37|39/.test(e.keyCode) && current) {
              if (current !== this) {
                current.click();
                current.focus()
              }
              e.preventDefault()
            }
          }
        } else {
          btn.set("aria-selected", "false");
          btn.set("tabindex", -1);
          var cntrl = btn.get("aria-controls");
          [].forEach.call(doc.querySelectorAll("." + cntrl + ", #" + cntrl), function(item) {
            item.setAttribute("hidden", "")
          })
        }
      });
      if (!init) {
        elm.set("aria-selected", "true");
        elm.set("tabindex", 0);
        if (focus) {
          elm.focus()
        }
      }
    };
    var heading = function(elm) {
      var heads = prev(elm, '[role="heading"] [aria-controls]');
      [].forEach.call(heads.children || [], function(head, index) {
        if (!head.index) {
          head.index = index;
          head.onkeydown = function(e) {
            var e = e || win.event;
            var current = !1;
            if (e.keyCode === 40) {
              current = heads.children[head.index + 1] || heads.children[0]
            } else if (e.keyCode === 38) {
              current = heads.children[head.index - 1] || heads.children[heads.children.length - 1]
            } else if (e.keyCode === 36) {
              current = heads.children[0]
            } else if (e.keyCode === 35) {
              current = heads.children[heads.children.length - 1]
            }
            if (/35|36|38|40/.test(e.keyCode) && current) {
              if (current !== this) {
                current.focus()
              }
              e.preventDefault()
            }
          }
        }
      })
    };
    var bind = function(elm) {
      elm.has = elm.hasAttribute;
      elm.get = elm.getAttribute;
      elm.set = elm.setAttribute;
      elm.del = elm.removeAttribute;
      elm.menu = menu;
      elm.dialog = dialog;
      elm.tab = tab;
      elm.heading = heading;
      return elm
    };
    var aria = function(container) {
      let childs = container.querySelectorAll('[aria-controls]');
      let isSelf = (container.getAttribute) ? container.getAttribute('aria-controls') : !1;
      let dom = childs.length ? childs : (isSelf) ? [container] : container;
      [].forEach.call(dom, function(elm) {
        let ECL = (elm.className.startsWith("ecl-") && window.ECL);
        if (!ECL && !elm.get) {
          bind(elm);
          let role = elm.get("role") || bind(elm.parentNode).get("role");
          if (role && elm[role]) {
            elm[role](elm, !0)
          }
          var controls = function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (elm.isAnimate) {
              return
            }
            var cntrl = this.get("aria-controls");
            var isSelected = this.get("aria-selected");
            var isPressed = this.get("aria-pressed");
            var role = this.get("role");
            if (cntrl === '') {
              console.log("WTINFO: Empty controlers ", this);
              return
            }
            $wt.trigger(elm, cntrl);
            $wt.trigger(window, "aria-controls", this);
            if (isPressed) {
              this.set("aria-pressed", (isPressed === "false"))
            }
            if (isSelected && role === "checkbox") {
              this.set("aria-selected", (isSelected === "false"))
            } else if (isSelected && isSelected === "true") {
              return
            }
            reset(e);
            var brothers = doc.querySelectorAll('[aria-controls="' + cntrl + '"]');
            elm.FROM = brothers;
            [].forEach.call(brothers, function(brother) {
              if (!brother.get) {
                return
              }
              var expanded = brother.get("aria-expanded");
              var role = brother.get("role");
              if (expanded) {
                brother.set("aria-expanded", (expanded === "false"))
              }
              if (role && brother[role]) {
                brother[role](elm)
              }
            });
            var children = doc.querySelectorAll("." + cntrl + ", #" + cntrl);
            elm.TO = children;
            [].forEach.call(children, function(child) {
              bind(child);
              var hide = child.has("hidden");
              var role = child.get("role");
              if (child.tagName === "LINK" && cntrl === child.id) {
                (child.has("disabled")) ? child.del("disabled") : child.set("disabled", "")
              } else {
                var animated = (function() {
                    if ((child.className || "").indexOf("animated [") !== -1) {
                      elm.animated = child.className.replace(/(.*)animated\ \[(.*)\](.*)/ig, "$2").split(",");
                      [].forEach.call(elm.animated, function(e) {
                        child.className = child.className.replace(" " + e, "")
                      });
                      return elm.animated
                    }
                    return !1
                  }
                )();
                if (animated) {
                  if (!child.animationsEvents) {
                    child.addEventListener("animationstart", function() {
                      elm.isAnimate = !0
                    });
                    child.addEventListener("animationend", function() {
                      if (child.className.indexOf(" " + animated[1]) !== -1) {
                        setTimeout(function() {
                          child.set("hidden", "");
                          elm.del("hidden");
                          if (child.get("role") === "dialog") {
                            dialog(!1, !0)
                          }
                        }, 10)
                      }
                      elm.isAnimate = !1
                    });
                    child.animationsEvents = !0
                  }
                  elm.direction = (hide) ? 0 : 1;
                  child.className += " " + animated[elm.direction];
                  if (elm.direction === 0) {
                    child.del("hidden")
                  }
                } else if (hide) {
                  child.del("hidden")
                } else if (!animated) {
                  child.set("hidden", "")
                }
                if (role && child[role]) {
                  elm.from = brothers;
                  elm.to = children;
                  child[role](elm)
                }
                if (child.has("aria-controls")) {
                  child.focus()
                }
              }
            });
            if (typeof window[cntrl] === "function") {
              window[cntrl](elm)
            }
          };
          $wt.on(elm, "keydown", (e)=>{
              elm.key = e.keyCode
            }
          );
          $wt.on(elm, "click", controls)
        }
      })
    };
    aria.run = (obj)=>{
      let container = (obj.params.include) ? document.querySelector(obj.params.include) : document;
      if (obj.params.custom) {
        $wt.load(obj.params.custom, ()=>aria.init(container))
      } else {
        aria.init(container)
      }
    }
    ;
    aria.on = (controler,callback)=>{
      window[controler] = callback
    }
    ;
    $wt.on(win, "wtReady", ()=>{
        $wt.on(doc.body, "click", reset);
        $wt.on(doc.body, "keydown", (e)=>{
            if (e.keyCode === 27) {
              dialog(!1, !0)
            }
          }
        )
      }
    );
    aria.init = (container)=>{
      aria(container);
      let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
      if (MutationObserver) {
        const register = new MutationObserver(()=>{
            $wt.defer(()=>aria(container), 250)
          }
        );
        register.observe(container, {
          childList: !0,
          subtree: !0
        })
      }
    }
    ;
    aria.trap = trap;
    $wt.aria = aria;
    $wt.aria.menu = (controller,callback=()=>{}
    )=>{
      let menuNode = document.querySelector('[id="' + controller.getAttribute('aria-controls') + '"]');
      if (!menuNode) {
        return
      }
      let menuItems = [];
      let firstItem = !1;
      let lastItem = !1;
      let chars = [];
      let hover = !1;
      const focusOn = (elm)=>{
          menuItems.map(item=>{
              if (item === elm) {
                item.tabIndex = 0;
                elm.focus()
              } else {
                item.tabIndex = -1
              }
            }
          )
        }
      ;
      const focusPrev = (elm)=>{
          let index = menuItems.indexOf(elm);
          let item = (elm === firstItem) ? lastItem : menuItems[index - 1];
          focusOn(item)
        }
      ;
      const focusNext = (elm)=>{
          let index = menuItems.indexOf(elm);
          let item = (elm === lastItem) ? firstItem : menuItems[index + 1];
          focusOn(item)
        }
      ;
      const focusByChars = (elm,char)=>{
          let start, index;
          if (char.length > 1) {
            return
          }
          char = char.toLowerCase();
          start = menuItems.indexOf(elm) + 1;
          if (start >= menuItems.length) {
            start = 0
          }
          index = chars.indexOf(char, start);
          if (index === -1) {
            index = chars.indexOf(char, 0)
          }
          if (index > -1) {
            focusOn(menuItems[index])
          }
        }
      ;
      const openPopup = ()=>{
          menuNode.removeAttribute('hidden');
          controller.setAttribute('aria-expanded', 'true')
        }
      ;
      const closePopup = ()=>{
          if (isOpen()) {
            controller.removeAttribute('aria-expanded');
            menuNode.setAttribute('hidden', !0)
          }
        }
      ;
      const isOpen = ()=>{
          return controller.getAttribute('aria-expanded') === 'true'
        }
      ;
      const controlKeyDown = (event)=>{
          let key = event.key
            , flag = !1;
          switch (key) {
            case ' ':
            case 'Enter':
            case 'ArrowDown':
            case 'Down':
              openPopup();
              focusOn(firstItem);
              flag = !0;
              break;
            case 'Esc':
            case 'Escape':
              closePopup();
              flag = !0;
              break;
            case 'Up':
            case 'ArrowUp':
              openPopup();
              focusOn(lastItem);
              flag = !0;
              break;
            default:
              break
          }
          if (flag) {
            event.stopPropagation();
            event.preventDefault()
          }
        }
      ;
      const controlClick = (event)=>{
          if (isOpen()) {
            closePopup();
            controller.focus()
          } else {
            openPopup();
            focusOn(firstItem)
          }
          event.stopPropagation();
          event.preventDefault()
        }
      ;
      const isValidChars = str=>str.length === 1 && str.match(/\S/);
      const itemKeyDown = (event)=>{
          let tgt = event.currentTarget
            , key = event.key
            , flag = !1;
          if (event.ctrlKey || event.altKey || event.metaKey) {
            return
          }
          if (event.shiftKey) {
            if (isValidChars(key)) {
              focusByChars(tgt, key);
              flag = !0
            }
            if (event.key === 'Tab') {
              controller.focus();
              closePopup()
            }
          } else {
            switch (key) {
              case ' ':
              case 'Enter':
                closePopup();
                callback(event);
                controller.focus();
                flag = !0;
                break;
              case 'Esc':
              case 'Escape':
                closePopup();
                controller.focus();
                flag = !0;
                break;
              case 'Up':
              case 'ArrowUp':
                focusPrev(tgt);
                flag = !0;
                break;
              case 'ArrowDown':
              case 'Down':
                focusNext(tgt);
                flag = !0;
                break;
              case 'Home':
              case 'PageUp':
                focusOn(firstItem);
                flag = !0;
                break;
              case 'End':
              case 'PageDown':
                focusOn(lastItem);
                flag = !0;
                break;
              case 'Tab':
                closePopup();
                break;
              default:
                if (isValidChars(key)) {
                  focusByChars(tgt, key);
                  flag = !0
                }
                break
            }
          }
          if (flag) {
            event.stopPropagation();
            event.preventDefault()
          }
        }
      ;
      const itemClick = (event)=>{
          callback(event);
          event.preventDefault();
          closePopup();
          controller.focus()
        }
      ;
      const closeMe = ()=>{
          if (isOpen() && !hover) {
            closePopup();
            controller.focus()
          }
        }
      ;
      controller.addEventListener('keydown', controlKeyDown);
      controller.addEventListener('click', controlClick);
      [...menuNode.querySelectorAll('[role="menuitem"]')].map(menuitem=>{
          menuItems.push(menuitem);
          menuitem.tabIndex = -1;
          chars.push(menuitem.textContent.trim()[0].toLowerCase());
          menuitem.addEventListener('keydown', itemKeyDown);
          menuitem.addEventListener('click', itemClick);
          if (!firstItem) {
            firstItem = menuitem
          }
          lastItem = menuitem
        }
      );
      window.addEventListener('mousedown', closeMe, !0);
      menuNode.addEventListener('mouseover', ()=>hover = !0);
      menuNode.addEventListener('mouseout', ()=>hover = !1)
    }
    ;
    $wt.aria.autocomplete = (field)=>{
      let timer;
      let currentSearch = field.value;
      let id = $wt.id();
      let targetID = field.getAttribute('aria-owns') || 'wt-autocomplete--target-' + id;
      let spinner = `<svg focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 24 24" width="24" height="24" class="wt-spinner wt-ecl-icon wt-ecl-icon--fluid">
    <path d="M12 17c.6 0 1 .5 1 1v3c0 .5-.4 1-1 1s-1-.5-1-1v-3c0-.5.4-1 1-1zm2.6-.5c.5-.3 1.1-.1 1.4.4l1.5 2.6c.3.5.1 1.1-.4 1.4-.5.3-1.1.1-1.4-.4l-1.5-2.6c-.2-.5 0-1.1.4-1.4zm-6.6.4c.3-.5.9-.6 1.4-.4.5.3.6.9.4 1.4l-1.5 2.6c-.3.5-.9.6-1.4.4s-.6-.9-.4-1.4L8 16.9zm8.5-2.3c.3-.5.9-.6 1.4-.4l2.6 1.5c.5.3.6.9.4 1.4-.3.5-.9.6-1.4.4L16.9 16c-.5-.3-.7-.9-.4-1.4zm-10.4-.3c.5-.3 1.1-.1 1.4.4.3.5.1 1.1-.4 1.4l-2.6 1.5c-.5.3-1.1.1-1.4-.4-.3-.5-.1-1.1.4-1.4l2.6-1.5zM21 11c.5 0 1 .4 1 1s-.5 1-1 1h-3c-.5 0-1-.4-1-1s.5-1 1-1h3zM6 11c.6 0 1 .4 1 1s-.4 1-1 1H3c-.5 0-1-.4-1-1s.5-1 1-1h3zM3.2 6.9c.3-.5.9-.6 1.4-.4L7.1 8c.5.3.6.9.4 1.4-.3.4-.9.6-1.4.3L3.5 8.2c-.4-.2-.6-.9-.3-1.3zm16.3-.4c.5-.3 1.1-.1 1.4.4s.1 1.1-.4 1.4l-2.6 1.5c-.5.3-1.1.1-1.4-.4-.3-.5-.1-1.1.4-1.4l2.6-1.5zM6.9 3.2c.4-.3 1.1-.1 1.3.3l1.5 2.6c.3.5.1 1.1-.3 1.4-.5.3-1.1.1-1.4-.4L6.5 4.5c-.3-.4-.1-1.1.4-1.3zm8.9.3c.3-.5.9-.6 1.4-.4.5.3.6.9.4 1.4L16 7.1c-.3.5-.9.6-1.4.4-.5-.3-.6-.9-.4-1.4l1.6-2.6zM12 2c.6 0 1 .5 1 1v3c0 .6-.4 1-1 1s-1-.4-1-1V3c0-.5.4-1 1-1z"></path></svg>`;
      let menuItems = [];
      let firstItem = !1;
      let lastItem = !1;
      let hover = !1;
      let result = [];
      let wrapper = document.createElement("span");
      wrapper.setAttribute('style', 'position: relative;');
      wrapper.classList.add('wt-autocomplete--wrapper');
      $wt.before(wrapper, field);
      wrapper.appendChild(field);
      let statement = document.createElement('div');
      statement.id = `wt-autocomplete--tips-${id}`;
      statement.setAttribute('role', 'status');
      statement.setAttribute('aria-atomic', 'true');
      statement.setAttribute('aria-live', 'polite');
      statement.setAttribute('style', `border:0;clip:rect(0 0 0 0);height:1px;margin:-1px 0 0 -1px;overflow: hidden;padding:0;position:absolute;width:1px`);
      document.body.appendChild(statement);
      field.setAttribute('type', `text`);
      field.setAttribute('role', `combobox`);
      field.setAttribute('aria-expanded', 'false');
      field.setAttribute('aria-owns', targetID);
      field.setAttribute('aria-autocomplete', `list`);
      field.setAttribute('autocomplete', 'off');
      field.setAttribute('id', field.id || `wt-autocomplete--${id}`);
      field.classList.add('wt-autocomplete');
      let menu = document.querySelector('#' + targetID);
      if (!menu) {
        menu = document.createElement('ul');
        menu.setAttribute('id', targetID);
        $wt.after(menu, field)
      }
      menu.setAttribute('aria-busy', 'false');
      menu.setAttribute('role', 'listbox');
      menu.setAttribute('hidden', 'true');
      menu.setAttribute('aria-describedby', `wt-autocomplete--tips-${id}`);
      let menuDesc = document.createElement('div');
      menuDesc.id = `wt-autocomplete--tips-${id}`;
      menuDesc.style.display = "none";
      menuDesc.innerHTML = 'When autocomplete results are available use up and down arrows to review and enter to select.';
      document.body.appendChild(menuDesc);
      let searchDefault = !1;
      this.search = (fnc)=>{
        searchDefault = fnc;
        return this
      }
      ;
      let listDefault = (row,index)=>`${row.name || index}`;
      this.list = (fnc)=>{
        listDefault = fnc;
        return this
      }
      ;
      let selectDefault = row=>field.value = row.name || '';
      this.select = (fnc)=>{
        selectDefault = fnc;
        return this
      }
      ;
      const closeMe = ()=>{
          if (!hover && !!!menu.getAttribute('hidden')) {
            closePopup();
            field.focus()
          }
        }
      ;
      const closePopup = ()=>{
          menuItems = [];
          field.setAttribute('aria-expanded', !1);
          menu.setAttribute('hidden', !0)
        }
      ;
      const focusOn = (elm)=>{
          [...menu.querySelectorAll('[role="option"]')].map(item=>{
              item.setAttribute('aria-selected', !1);
              if (item === elm) {
                item.tabIndex = 0;
                item.setAttribute('aria-selected', !0);
                item.focus()
              } else {
                item.tabIndex = -1
              }
            }
          )
        }
      ;
      const focusPrev = (elm)=>{
          let index = menuItems.indexOf(elm);
          if (index === 0) {
            return closeMe()
          }
          let item = menuItems[index - 1];
          focusOn(item)
        }
      ;
      const focusNext = (elm)=>{
          let index = menuItems.indexOf(elm);
          let item = (elm === lastItem) ? lastItem : menuItems[index + 1];
          focusOn(item)
        }
      ;
      const itemKeyDown = (event)=>{
          let tgt = event.currentTarget;
          let key = event.key;
          let flag = !1;
          if (event.ctrlKey || event.altKey || event.metaKey) {
            return
          }
          if (event.shiftKey) {
            if (event.key === 'Tab') {
              field.focus();
              closePopup()
            }
          } else if (field.value.trim() === '') {
            closePopup();
            currentSearch = ''
          } else {
            switch (key) {
              case 'Enter':
                itemClick(event);
                flag = !0;
                break;
              case 'Esc':
              case 'Escape':
                closePopup();
                field.focus();
                flag = !0;
                break;
              case 'Up':
              case 'ArrowUp':
                focusPrev(tgt);
                flag = !0;
                break;
              case 'ArrowDown':
              case 'Down':
                focusNext(tgt);
                flag = !0;
                break;
              case 'Home':
              case 'PageUp':
                focusOn(firstItem);
                flag = !0;
                break;
              case 'End':
              case 'PageDown':
                focusOn(lastItem);
                flag = !0;
                break;
              case 'Tab':
                closePopup();
                break;
              default:
                clearInterval(timer);
                timer = setTimeout(searchAndResult, 500);
                break
            }
          }
          if (flag) {
            event.stopPropagation();
            event.preventDefault();
            return !1
          }
        }
      ;
      const itemClick = (event)=>{
          let tgt = event.currentTarget;
          let index = Number(tgt.getAttribute('aria-posinset')) - 1;
          tgt.tagName === 'LI' ? selectDefault(result[index]) : '';
          currentSearch = field.value;
          field.focus();
          closePopup()
        }
      ;
      const searchAndResult = async()=>{
          let term = field.value.trim();
          if (term === currentSearch) {
            return
          }
          if (term.length > 2) {
            menuItems = [];
            menu.setAttribute('aria-busy', !0);
            menu.removeAttribute('hidden');
            menu.innerHTML = spinner;
            wrapper.style.zIndex = $wt.zindex();
            statement.innerHTML = 'Search in progress.';
            currentSearch = term;
            result = await searchDefault(term);
            menu.setAttribute('aria-busy', !1);
            field.setAttribute('aria-expanded', !0);
            if (result.length === 0) {
              menu.innerHTML = `<li aria-hidden="true">No results found</li>`;
              statement.innerHTML = "No results found";
              return
            } else if (result.length === 1) {
              statement.innerHTML = "1 result is available."
            } else {
              statement.innerHTML = result.length + " results are available."
            }
            menu.innerHTML = result.map((row,index)=>{
                let content = listDefault(row, index);
                return `<li aria-selected="false" role="option" tabindex="-1"
            aria-posinset="${index + 1}"
            aria-setsize="${result.length}"
          >${content}</li>`
              }
            ).join('');
            [...menu.querySelectorAll('[role="option"]')].map(elm=>{
                menuItems.push(elm);
                elm.addEventListener('keydown', itemKeyDown);
                elm.addEventListener('click', itemClick);
                if (!firstItem) {
                  firstItem = elm
                }
                lastItem = elm
              }
            )
          }
        }
      ;
      ['change', 'input', 'keydown'].map(evt=>field.addEventListener(evt, itemKeyDown, !1));
      window.addEventListener('mousedown', closeMe, !0);
      menu.addEventListener('mouseover', ()=>hover = !0);
      menu.addEventListener('mouseout', ()=>hover = !1);
      return this
    }
  }
)(window, document, !1);
$wt.forms = function(target, options) {
  return new $wt.forms._run(target,options)
}
;
$wt.forms.extend = function(obj) {
  for (var i in obj) {
    this[i] = obj[i]
  }
}
;
$wt.forms.extend({
  _counter: 0,
  _run: function(target, options) {
    if (typeof target === 'string') {
      target = document.querySelector(target)
    }
    if (!(target instanceof Element)) {
      console.log("WTINFO: form - 'target' parameter should be a dom object!");
      return
    }
    options = target.params = $wt.mergeParams({
      callback: !1,
      class: "wt-form " + Object.values(target?.classList || []).join(' '),
      groups: !1
    }, options || {});
    if (!Array.isArray(options.groups)) {
      console.log("WTINFO: form - 'groups' parameter should be an array!");
      return
    }
    var needCSS = options.class.indexOf('wt-form') > -1;
    this.ready = function(fnc) {
      options.callback = fnc
    }
    ;
    var process = function() {
      $wt.forms._builder(target, options);
      target.className = options.class;
      if (needCSS) {
        $wt.forms._resize(target);
        $wt.trigger(window, "resize")
      }
      $wt.trigger(window, "form.created");
      setTimeout(function() {
        if (typeof options.callback === 'function') {
          options.callback()
        }
      }, 0)
    };
    (needCSS) ? $wt.include($wt.root + "/webtools.forms.css", process) : process();
    return this
  },
  _resize: function(container) {
    window.addEventListener("resize", function() {
      var action = (container.offsetWidth < 620) ? 'add' : 'remove';
      container.classList[action]('wt-form-responsive')
    }, {
      passive: !0
    })
  },
  _range: function(elm, params) {
    var sliderRanger = document.createElement("div");
    sliderRanger.className = "wt-field-range wt-unselected";
    (elm.parentNode) ? elm.parentNode.insertBefore(sliderRanger, elm) : "";
    sliderRanger.appendChild(elm);
    if (Array.isArray(params.data)) {
      elm.setAttribute("min", 0);
      elm.setAttribute("max", params.data.length - 1);
      elm.data = params.data
    }
    var tracker = document.createElement("div");
    tracker.className = "wt-field-range-track wt-unselected";
    sliderRanger.appendChild(tracker);
    elm.tracker = tracker;
    var thumb = document.createElement("div");
    thumb.className = "wt-field-range-thumb wt-unselected";
    thumb.style.left = 0;
    thumb.setAttribute("aria-hidden", !0);
    tracker.appendChild(thumb);
    var max = Math.floor(elm.getAttribute("max"));
    var check = function() {
      var originalValue = elm.value, left, right;
      elm.value = 0;
      update();
      left = Math.max(35, ((thumb.offsetWidth + 2) / 2));
      elm.value = max;
      update();
      right = Math.max(35, ((thumb.offsetWidth + 2) / 2));
      tracker.setAttribute("style", "margin-left:" + left + "px; margin-right:" + right + "px;");
      elm.value = originalValue;
      update()
    };
    var update = function() {
      var left = ((tracker.offsetWidth - thumb.offsetWidth) / max) * elm.value;
      var realWidth = (tracker.offsetWidth - thumb.offsetWidth);
      var realLeft = (left / (realWidth / 100));
      realLeft = (realLeft <= 0 || elm.value === elm.min) ? 0 : realLeft;
      realLeft = (realLeft > 100) ? 100 : realLeft;
      thumb.style.left = realLeft + '%';
      var text = (elm.data) ? elm.data[elm.value] : elm.value;
      if (text) {
        thumb.innerHTML = '<span>' + text + '</span>';
        thumb.style.marginLeft = (0 - thumb.offsetWidth / 2) + 'px'
      }
      if (!elm.check) {
        elm.check = !0;
        check()
      }
    };
    setTimeout(()=>{
        update();
        elm.addEventListener("change", update);
        elm.addEventListener("input", update);
        elm.addEventListener("keyup", update)
      }
      , 250)
  },
  _builder: function(container, config) {
    $wt.forms._counter++;
    var markerIcon = "background-image:url(\"data:image/svg+xml,%3Csvg fill='{color}' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z'/%3E%3C/svg%3E\");";
    [].forEach.call(config.groups, function(node, index) {
      var size = (node.fields || []).length;
      var groupID = "wt-form-group-" + $wt.forms._counter + "_" + index;
      var main = document.createElement('div');
      var title = document.createElement('div');
      var description = document.createElement('div');
      var content = document.createElement('div');
      var grp = node.group || {};
      var asGroup = (grp.title || grp.description || grp.class);
      var fullGroup = (grp.title && grp.description);
      var targetFieldContent = (asGroup) ? main : content;
      if (asGroup) {
        main.setAttribute("role", "group");
        if (asGroup) {
          main.setAttribute("aria-labelledby", groupID)
        }
        main.className = 'wt-form-group';
        if (grp.class) {
          main.className += ' ' + grp.class
        }
        if (grp.title) {
          title.innerHTML = grp.title;
          title.id = groupID;
          title.className = 'wt-form-title';
          main.appendChild(title)
        }
        if (grp.description) {
          description.innerHTML = grp.description;
          description.className = 'wt-form-description';
          if (!grp.title) {
            description.id = groupID
          }
          main.appendChild(description)
        }
        if (!fullGroup) {
          main.classList.add('wt-form-adapt')
        }
        main.appendChild(content)
      } else {
        container.appendChild(content)
      }
      content.className = 'wt-form-fields';
      if (Array.isArray(node.fields)) {
        [].forEach.call(node.fields, function(item) {
          var options = item.options || {};
          var id = $wt.id();
          var label = !1;
          if (['input', 'textarea', 'select', 'div', 'p', 'ul', 'button', 'pre'].indexOf(item.tag) > -1) {
            var attributes = item.attributes || {};
            var tag = document.createElement(item.tag);
            attributes.id = attributes.id || '_' + id;
            for (var attr in attributes) {
              if (attr === 'value') {
                tag.value = attributes[attr]
              } else if (attr === 'checked') {
                if (attributes[attr] === !0) {
                  tag.setAttribute('checked', 'checked')
                }
              } else {
                tag.setAttribute(attr, (attributes[attr]).toString())
              }
            }
            if (options.label) {
              label = document.createElement("label");
              label.className = "wt-label";
              label.setAttribute("for", attributes.id);
              label.innerHTML = '<span>' + options.label + '</span>';
              content.appendChild(label)
            }
            if (options.legend && label) {
              var legend = document.createElement('i');
              legend.className = "wt-label-legend";
              if (typeof options.legend === 'string') {
                legend.setAttribute("style", $wt.template('background-color: {color}', {
                  color: options.legend
                }))
              } else if (typeof options.legend === 'object') {
                legend.setAttribute("style", $wt.template(markerIcon, {
                  color: options.legend.color.replace("#", "%23")
                }));
                legend.className += "-icon-" + options.legend.icon
              }
              legend.setAttribute("aria-hidden", !0);
              $wt.insertBefore(label, legend)
            }
            var div = document.createElement("div");
            if (size > 1) {
              content.appendChild(div);
              if (label) {
                div.appendChild(label)
              }
              div.appendChild(tag);
              div.classList.add('wt-form-field');
              if (options.class) {
                div.className += ' ' + options.class
              }
            } else {
              content.appendChild(tag);
              if (options.class) {
                content.className += ' ' + options.class
              }
            }
            if (tag.type === 'radio' || tag.type === 'checkbox') {
              $wt.after(label, tag);
              tag.classList.add("wt-offscreen")
            } else if (item.tag === 'select') {
              tag.innerHTML = (function() {
                  var options = '';
                  [].forEach.call(item.data, function(itm) {
                    options += $wt.template('<option value="{value}" {selected}>{text}</option>', {
                      text: itm.text,
                      value: itm.value,
                      selected: itm.selected ? 'selected="selected"' : ''
                    })
                  });
                  return options
                }
              )();
              tag.data = item.data
            } else if (tag.type === 'range' && config.class.indexOf("wt-form") > -1) {
              $wt.forms._range(tag, {
                data: item.data
              })
            } else if (['div', 'p', 'ul', 'button', 'pre'].indexOf(item.tag) > -1 && item.data) {
              tag.innerHTML = item.data;
              $wt.before(tag, div);
              $wt.remove(div)
            }
            $wt.aria.init(targetFieldContent);
            for (var evt in item.events) {
              tag.addEventListener(evt, item.events[evt])
            }
            if (item.events && item.events.init) {
              $wt.trigger(tag, "init")
            }
          }
        });
        container.appendChild(targetFieldContent)
      }
    })
  }
});
(()=>{
    const _replaceGlobalWidgetPath = (str,root)=>{
      let rootReview = root;
      if (root.includes('/wcloud/preview/')) {
        rootReview = root.split('/').slice(0, -1).join('/')
      } else if (root.includes('/wcloud/widgets/')) {
        rootReview = root.split('/').slice(0, -2).join('/')
      }
      let placeholders = /{widget_path(:(\d{6})\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}))?}/gm;
      const matches = str.matchAll(placeholders);
      for (const match of matches) {
        if (match[0] === '{widget_path}') {
          str = str.replace('{widget_path}', root);
          continue
        }
        if (root.includes('/wcloud/preview/')) {
          str = str.replace(`{widget_path:${match[2]}/${match[3]}}`, rootReview + '/' + match[3])
        } else {
          str = str.replace(`{widget_path:${match[2]}/${match[3]}}`, rootReview + '/' + match[2] + '/' + match[3])
        }
      }
      return str
    }
    const _process = (ref)=>{
        let root = $wt.absolute(ref.params.url).split("/").slice(0, -1).join('/');
        let copyUEC = JSON.parse(JSON.stringify(ref.params));
        copyUEC.root = root + '/';
        delete copyUEC.utility;
        ref.response.wcloud = copyUEC;
        uecStr = _replaceGlobalWidgetPath(JSON.stringify(ref.response), root);
        let script = document.createElement("script");
        script.type = "application/json";
        script.innerHTML = uecStr;
        $wt.before(script, ref.obj);
        $wt.collect();
        $wt.trigger(window, "wtUECEmbeded", {
          UEC: script.params
        })
      }
    ;
    const run = (obj)=>{
        if (!obj.params.url) {
          console.error("WTINFO: Url parameter is missing.");
          return $wt.next(obj)
        }
        $wt.getFile({
          type: "json",
          url: obj.params.url,
          error: (error)=>console.error("WTINFO: File was not found, check your url.\n", error),
          success: (response)=>_process({
            params: obj.params,
            obj: obj,
            response: response
          })
        });
        $wt.next(obj)
      }
    ;
    $wt.wcloud = {
      run: run
    }
  }
)();
$wt.on(window, "wtBeforeCollect", ()=>{
    const messageCSP = `Content Security Policy enabled. This may degrade Webtools features or components. More information: https://webgate.ec.europa.eu/fpfis/wikis/display/webtools/Important+guidelines+for+developers+and+implementers`;
    $wt.isCSP = (function() {
        try {
          if (!!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            throw new Error()
          }
          new Function('');
          return !1
        } catch (e) {
          console.warn(messageCSP);
          return !0
        }
      }
    )();
    document.addEventListener("securitypolicyviolation", function(e) {
      console.warn(messageCSP);
      $wt.trigger(window, "wtCSPError", e)
    }, {
      once: !0
    })
  }
);
$wt.on(window, "wtBeforeCollect", ()=>{
    let inLoading = !1;
    const iconsRefresh = ()=>{
        let icons = document.querySelectorAll('[class*=wt-icon-]');
        const replaceIcons = ()=>{
            [...icons].forEach((elm)=>{
                let classReference = elm.className.split('wt-icon-');
                if (!classReference[1]) {
                  return
                }
                let iconName = classReference[1].split('"')[0].split(' ')[0];
                let sprite = $wt.icons.querySelector("#" + iconName);
                elm.classList.replace("wt-icon-" + iconName, "wt-ecl-icon");
                if (sprite) {
                  let haveDefinition = elm.className.indexOf("wt-ecl-icon--") > -1;
                  let theClass = (haveDefinition) ? elm.className : elm.className + " wt-ecl-icon--fluid";
                  elm.innerHTML = $wt.template(`<svg focusable="false" aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="{viewport}" class="{classname}">{paths}</svg>`, {
                    paths: $wt.icons.querySelector("#" + iconName).innerHTML,
                    classname: "wt-" + iconName + " " + theClass,
                    viewport: sprite.getAttribute("viewBox") || "0 0 24 24"
                  });
                  let svg = elm.querySelector('*');
                  $wt.after(svg, elm);
                  $wt.remove(elm)
                }
              }
            );
            inLoading = !1
          }
        ;
        $wt.defer(()=>{
            if (!icons.length || inLoading) {
              return
            }
            if ($wt.icons) {
              replaceIcons()
            } else {
              inLoading = !0;
              $wt.getFile({
                type: "xml",
                url: $wt.root + "/images/webtools.icons-" + $wt.theme + ".svg?t=" + $wt.token,
                error: console.error,
                success: (res)=>{
                  res = res.replace(/<\?xml[^>]+>/i, "");
                  $wt.icons = document.createElement("div");
                  $wt.icons.style.display = "none";
                  $wt.icons.innerHTML = res;
                  document.body.appendChild($wt.icons);
                  replaceIcons()
                }
              })
            }
          }
          , 25)
      }
    ;
    $wt.domchange(iconsRefresh);
    $wt.on(window, "wtNext", iconsRefresh)
  }
);
$wt.on(window, "wtBeforeCollect", ()=>{
    let token = $wt.token;
    let root = $wt.root;
    let standard = ["cck", "dff", "cdown", "captcha", "globan", "eaoptout", "etrans", "frame", "laco", "opwidget", "panel", "qlik", "search", "wcloud", "wtag"];
    const useStaticFile = ()=>{
        return $wt.env !== "local"
      }
    ;
    $wt.getStaticCSSPath = (comp,params)=>{
      if (!useStaticFile()) {
        return !1
      }
      let vers = params?.version || null;
      if (standard.indexOf(comp) > -1 && vers) {
        return `${root}/css/webtools.${comp}.${vers}.css?t=${token}`
      } else if (standard.indexOf(comp) > -1) {
        return `${root}/css/webtools.${comp}.css?t=${token}`
      } else if (["sbkm", "share"].indexOf(comp) > -1) {
        if (vers) {
          return `${root}/css/webtools.sbkm.${vers}.css?t=${token}`
        }
        return `${root}/css/webtools.sbkm.css?t=${token}`
      } else if (comp === "map" && vers === "3.0") {
        return `${root}/css/webtools.${comp}.${vers}.css?t=${token}`
      }
      return !1
    }
    ;
    $wt.getStaticJSPath = (comp,params)=>{
      if (!useStaticFile()) {
        return !1
      }
      let vers = params.version;
      if (standard.indexOf(comp) > -1 && vers) {
        return `${root}/js/webtools.${comp}.${vers}.js?t=${token}`
      } else if (standard.indexOf(comp) > -1) {
        return `${root}/js/webtools.${comp}.js?t=${token}`
      } else if (["sbkm", "share"].indexOf(comp) > -1) {
        if (vers) {
          return `${root}/js/webtools.sbkm.${vers}.js?t=${token}`
        }
        return `${root}/js/webtools.sbkm.js?t=${token}`
      } else if (comp === "map" && vers === "3.0") {
        let path = root + "/js/webtools." + comp + "." + vers;
        if (!!params.plugins) {
          path += ".plugins"
        }
        path += ".js?t=" + token;
        return path
      }
      return !1
    }
  }
);
$wt.on(window, "wtReady", ()=>{
    let loc = window.location;
    if ((loc.protocol !== "https:" && loc.protocol !== "http:") || (loc.href).indexOf("/wcloud/") > -1 || (loc.href).indexOf("/tests/cypress") > -1 || ["localhost", "127.0.0.1"].indexOf(loc.hostname) >= 0) {
      return
    }
    clearTimeout(window.wtInventoryTimer);
    window.wtInventoryTimer = setTimeout(()=>{
        let inventory = Object.keys($wt.components).filter((comp)=>{
            return ['piwik', 'analytics', 'search', 'eaoptout', 'cck', 'globan', 'share', 'sbkm'].indexOf(comp.split('_')[0]) < 0
          }
        ).map((comp)=>{
            let params = $wt.components[comp].params;
            let service = params.name || params.utility || params.service;
            let mapType = null;
            if (!!params.contact) {
              mapType = 'contact'
            } else if (!!params.story) {
              mapType = 'storymap'
            } else if (!!params?.layers?.chorojson) {
              mapType = 'chorojson'
            } else if (!!params?.layers?.bubblegrid) {
              mapType = 'bubblegrid'
            } else if (!params?.custom && service === 'map') {
              mapType = 'basic'
            } else if (params?.custom && service === 'map') {
              mapType = 'business'
            }
            return {
              service: service,
              version: params.version || null,
              provider: params.provider || null,
              id: params._id || null,
              url: params.url || null,
              maptype: mapType
            }
          }
        );
        if (inventory.length) {
          $wt.ajax({
            url: $wt.root + '/rest/service-inventory',
            data: {
              url: loc.protocol + "//" + loc.hostname + loc.pathname,
              lang: document.lang,
              components: JSON.stringify(inventory)
            }
          })
        }
      }
      , 500)
  }
);
$wt.on(window, "wtReady", function() {
  if ($wt.urlParams.wtpanel === "open" && !$wt.panelDebug) {
    $wt.defer(function() {
      $wt.panelDebug = document.createElement("div");
      $wt.after($wt.panelDebug, document.body);
      $wt.render($wt.panelDebug, {
        "service": "panel"
      })
    }, 500)
  }
});
$wt.ready(function() {
  if ($wt.duplicate) {
    return
  }
  $wt.urlParams = $wt.getUrlParams();
  $wt.root = (function() {
      let R = document.querySelector('script[src*="/load.js"]');
      let theme = $wt.url.params.get("theme", R.src) || null;
      $wt.theme = $wt.setTheme(theme);
      $wt.spa = !!$wt.url.params.get("spa", R.src) || !1;
      let url = R.src.split("/load.js")[0];
      return (url.startsWith('https://europa.eu/webtools')) ? "https://webtools.europa.eu" : url
    }
  )();
  $wt.lang();
  $wt.trigger(window, "wtBeforeCollect");
  $wt.defer($wt.collect, 10);
  const checkScroll = ()=>{
      if (window.$wt && !$wt.inProgress) {
        $wt.defer($wt.collect, 100)
      }
    }
  ;
  $wt.on(window, "scroll", checkScroll);
  [...document.querySelectorAll('div')].forEach(elm=>{
      $wt.on(elm, "scroll", checkScroll)
    }
  );
  $wt.defer(()=>{
      $wt.trigger(window, "wtReady");
      if ($wt.spa) {
        $wt.languages.survey();
        let count = Object.keys($wt.components).length;
        $wt.domchange(()=>{
            $wt.defer(()=>{
                let verify = Object.keys($wt.components).length;
                let UEC = [...document.querySelectorAll("script[type='application/json']")];
                UECNew = UEC.slice().filter(elm=>{
                    return !elm.getAttribute('data-process')
                  }
                );
                if (UECNew.length) {
                  $wt.collect()
                } else if (verify !== count) {
                  UECExist = UEC.slice().filter(elm=>elm.getAttribute('data-process')).map(elm=>elm.reference);
                  Object.keys($wt.components).slice().forEach(x=>{
                      if (!UECExist.includes(x) && x !== "globan") {
                        delete $wt.components[x]
                      }
                    }
                  );
                  count = Object.keys($wt.components).length
                }
              }
              , 250)
          }
        )
      }
    }
    , 25)
})
