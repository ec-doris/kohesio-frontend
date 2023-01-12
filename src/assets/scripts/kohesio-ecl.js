/* @ecl/preset-ec - 3.2.2 Built on 2022-01-27T12:07:43.079Z */
var ECL = (function (e, t) {
  "use strict";
  function i(e) {
    return e && "object" == typeof e && "default" in e
      ? e
      : {
        default: e,
      };
  }
  var n = i(t);
  Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector),
  Element.prototype.closest ||
  (Element.prototype.closest = function (e) {
    for (var t = this; t; ) {
      if (t.matches(e)) return t;
      t = t.parentElement;
    }
    return null;
  });
  function o(e, t) {
    return void 0 === t && (t = document), [].slice.call(t.querySelectorAll(e));
  }
  function r(e, t) {
    return (t = void 0 === t ? document : t).querySelector(e);
  }
  var a = ["root"],
    s = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.toggleSelector,
          s = void 0 === n ? "[data-ecl-accordion-toggle]" : n,
          l = i.iconSelector,
          t = void 0 === l ? "[data-ecl-accordion-icon]" : l,
          n = i.labelExpanded,
          l = void 0 === n ? "data-ecl-label-expanded" : n,
          n = i.labelCollapsed,
          n = void 0 === n ? "data-ecl-label-collapsed" : n,
          i = i.attachClickListener,
          i = void 0 === i || i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.toggleSelector = s),
          (this.iconSelector = t),
          (this.attachClickListener = i),
          (this.labelExpanded = l),
          (this.labelCollapsed = n),
          (this.toggles = null),
          (this.forceClose = !1),
          (this.target = null),
          (this.label = null),
          (this.handleClickOnToggle = this.handleClickOnToggle.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).ACCORDION), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLAccordion = t);
      };
      var e = i.prototype;
      return (
        (e.init = function () {
          var t = this;
          (this.toggles = o(this.toggleSelector, this.element)),
            (this.label = r(this.labelSelector, this.element)),
          this.attachClickListener &&
          this.toggles &&
          this.toggles.forEach(function (e) {
            e.addEventListener("click", t.handleClickOnToggle.bind(t, e));
          });
        }),
          (e.destroy = function () {
            var t = this;
            this.attachClickListener &&
            this.toggles &&
            this.toggles.forEach(function (e) {
              e.removeEventListener("click", t.handleClickOnToggle);
            });
          }),
          (e.handleClickOnToggle = function (e) {
            var t = r("#" + e.getAttribute("aria-controls"), this.element);
            if (!t) throw new TypeError("Target has to be provided for accordion (aria-controls)");
            var i = !0 === this.forceClose || "true" === e.getAttribute("aria-expanded");
            e.setAttribute("aria-expanded", i ? "false" : "true"), (t.hidden = i);
            var n = r(this.iconSelector, e);
            !n || ((t = r("use", n)) && ((n = t.getAttribute("xlink:href")), (s = ""), (s = i ? n.replace("minus", "plus") : n.replace("plus", "minus")), t.setAttribute("xlink:href", s)));
            var s = r(".ecl-accordion__toggle-label", e);
            return s && (s.textContent = i ? e.getAttribute(this.labelCollapsed) : e.getAttribute(this.labelExpanded)), this;
          }),
          i
      );
    })(),
    l = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.toggleSelector,
          s = void 0 === n ? ".ecl-carousel__toggle" : n,
          l = i.prevSelector,
          a = void 0 === l ? ".ecl-carousel__prev" : l,
          o = i.nextSelector,
          r = void 0 === o ? ".ecl-carousel__next" : o,
          h = i.containerClass,
          c = void 0 === h ? ".ecl-carousel__container" : h,
          t = i.slidesClass,
          n = void 0 === t ? ".ecl-carousel__slides" : t,
          l = i.slideClass,
          o = void 0 === l ? ".ecl-carousel__slide" : l,
          h = i.currentSlideClass,
          t = void 0 === h ? ".ecl-carousel__current" : h,
          l = i.navigationItemsClass,
          h = void 0 === l ? ".ecl-carousel__navigation-item" : l,
          l = i.attachClickListener,
          l = void 0 === l || l,
          i = i.attachResizeListener,
          i = void 0 === i || i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.toggleSelector = s),
          (this.prevSelector = a),
          (this.nextSelector = r),
          (this.containerClass = c),
          (this.slidesClass = n),
          (this.slideClass = o),
          (this.currentSlideClass = t),
          (this.navigationItemsClass = h),
          (this.attachClickListener = l),
          (this.attachResizeListener = i),
          (this.toggle = null),
          (this.container = null),
          (this.slides = null),
          (this.btnPrev = null),
          (this.btnNext = null),
          (this.index = 1),
          (this.total = 0),
          (this.allowShift = !0),
          (this.autoPlay = !1),
          (this.autoPlayInterval = null),
          (this.resizeTimer = null),
          (this.posX1 = 0),
          (this.posX2 = 0),
          (this.posInitial = 0),
          (this.posFinal = 0),
          (this.threshold = 80),
          (this.navigationItems = null),
          (this.handleClickOnToggle = this.handleClickOnToggle.bind(this)),
          (this.shiftSlide = this.shiftSlide.bind(this)),
          (this.checkIndex = this.checkIndex.bind(this)),
          (this.moveSlides = this.moveSlides.bind(this)),
          (this.resizeTicker = this.resizeTicker.bind(this)),
          (this.handleResize = this.handleResize.bind(this)),
          (this.dragStart = this.dragStart.bind(this)),
          (this.dragEnd = this.dragEnd.bind(this)),
          (this.dragAction = this.dragAction.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).CAROUSEL), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLCarousel = t);
      };
      var e = i.prototype;
      return (
        (e.init = function () {
          var i = this;
          (this.toggle = r(this.toggleSelector, this.element)),
            (this.btnPrev = r(this.prevSelector, this.element)),
            (this.btnNext = r(this.nextSelector, this.element)),
            (this.slidesContainer = r(this.slidesClass, this.element)),
            (this.container = r(this.containerClass, this.element)),
            (this.navigationItems = o(this.navigationItemsClass, this.element)),
            (this.currentSlide = r(this.currentSlideClass, this.element)),
            (this.slides = o(this.slideClass, this.element)),
            (this.total = this.slides.length);
          var e = this.slides[0],
            t = this.slides[this.slides.length - 1],
            n = e.cloneNode(!0),
            t = t.cloneNode(!0);
          this.slidesContainer.appendChild(n),
            this.slidesContainer.insertBefore(t, e),
            (this.slides = o(this.slideClass, this.element)),
            this.slides.forEach(function (e) {
              e.style.width = 100 / i.slides.length + "%";
            }),
            this.resizeTicker(),
            this.handleClickOnToggle(),
          this.navigationItems &&
          this.navigationItems.forEach(function (e, t) {
            e.addEventListener("click", i.shiftSlide.bind(i, t + 1, !0));
          }),
          this.attachClickListener && this.toggle && this.toggle.addEventListener("click", this.handleClickOnToggle),
          this.attachClickListener && this.btnNext && this.btnNext.addEventListener("click", this.shiftSlide.bind(this, "next", !0)),
          this.attachClickListener && this.btnPrev && this.btnPrev.addEventListener("click", this.shiftSlide.bind(this, "prev", !0)),
          this.slidesContainer &&
          ((this.slidesContainer.onmousedown = this.dragStart),
            this.slidesContainer.addEventListener("touchstart", this.dragStart),
            this.slidesContainer.addEventListener("touchend", this.dragEnd),
            this.slidesContainer.addEventListener("touchmove", this.dragAction),
            this.slidesContainer.addEventListener("transitionend", this.checkIndex)),
          this.attachResizeListener && window.addEventListener("resize", this.handleResize);
        }),
          (e.destroy = function () {
            var t = this;
            this.attachClickListener && this.toggle && this.toggle.removeEventListener("click", this.handleClickOnToggle),
            this.attachClickListener && this.btnNext && this.btnNext.removeEventListener("click", this.shiftSlide),
            this.attachClickListener && this.btnPrev && this.btnPrev.removeEventListener("click", this.shiftSlide),
            this.slidesContainer &&
            (this.slidesContainer.removeEventListener("touchstart", this.dragStart),
              this.slidesContainer.removeEventListener("touchend", this.dragEnd),
              this.slidesContainer.removeEventListener("touchmove", this.dragAction),
              this.slidesContainer.removeEventListener("transitionend", this.checkIndex)),
            this.navigationItems &&
            this.navigationItems.forEach(function (e) {
              e.removeEventListener("click", t.shiftSlide);
            }),
            this.attachResizeListener && window.removeEventListener("resize", this.handleResize);
          }),
          (e.dragStart = function (e) {
            // (e = e || window.event).preventDefault();
            this.posInitial = this.slidesContainer.offsetLeft;
            "touchstart" === e.type ? (this.posX1 = e.touches[0].clientX) : ((this.posX1 = e.clientX), (document.onmouseup = this.dragEnd), (document.onmousemove = this.dragAction));
          }),
          (e.dragAction = function (e) {
            "touchmove" === (e = e || window.event).type ? ((this.posX2 = this.posX1 - e.touches[0].clientX), (this.posX1 = e.touches[0].clientX)) : ((this.posX2 = this.posX1 - e.clientX), (this.posX1 = e.clientX)),
              (this.slidesContainer.style.left = this.slidesContainer.offsetLeft - this.posX2 + "px");
          }),
          (e.dragEnd = function () {
            (this.posFinal = this.slidesContainer.offsetLeft),
              this.posFinal - this.posInitial < -this.threshold
                ? this.shiftSlide("next", !0)
                : this.posFinal - this.posInitial > this.threshold
                  ? this.shiftSlide("prev", !0)
                  : (this.slidesContainer.style.left = this.posInitial + "px"),
              (document.onmouseup = null),
              (document.onmousemove = null);
          }),
          (e.shiftSlide = function (e, t) {
            this.allowShift && ((this.index = "number" == typeof e ? e : "next" === e ? this.index + 1 : this.index - 1), this.moveSlides(!0)), t && this.autoPlay && this.handleClickOnToggle(), (this.allowShift = !1);
          }),
          (e.moveSlides = function (e) {
            var t = this.container.offsetWidth * this.index;
            (this.slidesContainer.style.transitionDuration = e ? "0.4s" : "0s"), (this.slidesContainer.style.left = "-" + t + "px");
          }),
          (e.checkIndex = function () {
            var i = this;
            0 === this.index && (this.index = this.total),
            this.index === this.total + 1 && (this.index = 1),
              this.moveSlides(!1),
            this.currentSlide && (this.currentSlide.textContent = this.index),
            this.slides &&
            this.slides.forEach(function (e, t) {
              i.index === t ? e.removeAttribute("aria-hidden", "true") : e.setAttribute("aria-hidden", "true");
            }),
            this.navigationItems &&
            this.navigationItems.forEach(function (e, t) {
              i.index === t + 1 ? e.setAttribute("aria-current", "true") : e.removeAttribute("aria-current", "true");
            }),
              (this.allowShift = !0);
          }),
          (e.handleClickOnToggle = function () {
            var e = this,
              t = r(this.toggleSelector + " .ecl-icon use", this.element),
              i = t.getAttribute("xlink:href"),
              n = "",
              n = this.autoPlay
                ? (clearInterval(this.autoPlayInterval), (this.autoPlay = !1), i.replace("pause", "play"))
                : ((this.autoPlayInterval = setInterval(function () {
                  e.shiftSlide("next");
                }, 5e3)),
                  (this.autoPlay = !0),
                  i.replace("play", "pause"));
            t.setAttribute("xlink:href", n);
          }),
          (e.resizeTicker = function () {
            var e = this.container.offsetWidth;
            (this.slidesContainer.style.width = e * this.slides.length + "px"),
              this.moveSlides(!1),
              940 <= e && e <= 1220 ? this.container.classList.add("ecl-carousel-container--padded") : this.container.classList.remove("ecl-carousel-container--padded");
          }),
          (e.handleResize = function () {
            return this.resizeTicker(), this.autoPlay && this.handleClickOnToggle(), this;
          }),
          i
      );
    })(),
    h = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
  function c(e, t) {
    return (
      e(
        (t = {
          exports: {},
        }),
        t.exports
      ),
        t.exports
    );
  }
  function d(e) {
    return "INPUT" === e.tagName;
  }
  function u(e) {
    if (!e.name) return 1;
    function t(e) {
      return i.querySelectorAll('input[type="radio"][name="' + e + '"]');
    }
    var i = e.form || e.ownerDocument;
    if ("undefined" != typeof window && void 0 !== window.CSS && "function" == typeof window.CSS.escape) n = t(window.CSS.escape(e.name));
    else
      try {
        n = t(e.name);
      } catch (e) {
        return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", e.message), 0;
      }
    var n = (function (e, t) {
      for (var i = 0; i < e.length; i++) if (e[i].checked && e[i].form === t) return e[i];
    })(n, e.form);
    return !n || n === e;
  }
  function g(e) {
    return d((t = e)) && "radio" === t.type && !u(e);
    var t;
  }
  function E(e, t) {
    if (((t = t || {}), !e)) throw new Error("No node provided");
    return !1 !== x.call(e, L) && I(t, e);
  }
  function k(e, t) {
    if (((t = t || {}), !e)) throw new Error("No node provided");
    return !1 !== x.call(e, D) && A(t, e);
  }
  var v = c(function (e, t) {
      !(function () {
        var moment;
        try {
          moment = n.default;
        } catch (e) {}
        e.exports = (function (moment) {
          var o = typeof moment === "function",
            l = !!window.addEventListener,
            g = window.document,
            c = window.setTimeout,
            a = function e(t, i, n, s) {
              if (l) t.addEventListener(i, n, !!s);
              else t.attachEvent("on" + i, n);
            },
            i = function e(t, i, n, s) {
              if (l) t.removeEventListener(i, n, !!s);
              else t.detachEvent("on" + i, n);
            },
            n = function e(t) {
              return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
            },
            r = function e(t, i) {
              return (" " + t.className + " ").indexOf(" " + i + " ") !== -1;
            },
            v = function e(t, i) {
              if (!r(t, i)) t.className = t.className === "" ? i : t.className + " " + i;
            },
            f = function e(t, i) {
              t.className = n((" " + t.className + " ").replace(" " + i + " ", " "));
            },
            b = function e(t) {
              return /Array/.test(Object.prototype.toString.call(t));
            },
            M = function e(t) {
              return /Date/.test(Object.prototype.toString.call(t)) && !isNaN(t.getTime());
            },
            N = function e(t) {
              var i = t.getDay();
              return i === 0 || i === 6;
            },
            s = function e(t) {
              return (t % 4 === 0 && t % 100 !== 0) || t % 400 === 0;
            },
            B = function e(t, i) {
              return [31, s(t) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][i];
            },
            R = function e(t) {
              if (M(t)) t.setHours(0, 0, 0, 0);
            },
            P = function e(t, i) {
              return t.getTime() === i.getTime();
            },
            h = function e(t, i, n) {
              var s, l;
              for (s in i) {
                l = t[s] !== undefined;
                if (l && typeof i[s] === "object" && i[s] !== null && i[s].nodeName === undefined)
                  if (M(i[s])) {
                    if (n) t[s] = new Date(i[s].getTime());
                  } else if (b(i[s])) {
                    if (n) t[s] = i[s].slice(0);
                  } else t[s] = e({}, i[s], n);
                else if (n || !l) t[s] = i[s];
              }
              return t;
            },
            d = function e(t, i, n) {
              var s;
              if (g.createEvent) {
                s = g.createEvent("HTMLEvents");
                s.initEvent(i, true, false);
                s = h(s, n);
                t.dispatchEvent(s);
              } else if (g.createEventObject) {
                s = g.createEventObject();
                s = h(s, n);
                t.fireEvent("on" + i, s);
              }
            },
            u = function e(t) {
              if (t.month < 0) {
                t.year -= Math.ceil(Math.abs(t.month) / 12);
                t.month += 12;
              }
              if (t.month > 11) {
                t.year += Math.floor(Math.abs(t.month) / 12);
                t.month -= 12;
              }
              return t;
            },
            p = {
              field: null,
              bound: undefined,
              ariaLabel: "Use the arrow keys to pick a date",
              position: "bottom left",
              reposition: true,
              format: "YYYY-MM-DD",
              toString: null,
              parse: null,
              defaultDate: null,
              setDefaultDate: false,
              firstDay: 0,
              firstWeekOfYearMinDays: 4,
              formatStrict: false,
              minDate: null,
              maxDate: null,
              yearRange: 10,
              showWeekNumber: false,
              pickWholeWeek: false,
              minYear: 0,
              maxYear: 9999,
              minMonth: undefined,
              maxMonth: undefined,
              startRange: null,
              endRange: null,
              isRTL: false,
              yearSuffix: "",
              showMonthAfterYear: false,
              showDaysInNextAndPreviousMonths: false,
              enableSelectionDaysInNextAndPreviousMonths: false,
              numberOfMonths: 1,
              mainCalendar: "left",
              container: undefined,
              blurFieldOnSelect: true,
              i18n: {
                previousMonth: "Previous Month",
                nextMonth: "Next Month",
                months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              },
              theme: null,
              events: [],
              onSelect: null,
              onOpen: null,
              onClose: null,
              onDraw: null,
              keyboardInput: true,
            },
            m = function e(t, i, n) {
              i += t.firstDay;
              while (i >= 7) i -= 7;
              return n ? t.i18n.weekdaysShort[i] : t.i18n.weekdays[i];
            },
            F = function e(t) {
              var i = [];
              var n = "false";
              if (t.isEmpty)
                if (t.showDaysInNextAndPreviousMonths) {
                  i.push("is-outside-current-month");
                  if (!t.enableSelectionDaysInNextAndPreviousMonths) i.push("is-selection-disabled");
                } else return '<td class="is-empty"></td>';
              if (t.isDisabled) i.push("is-disabled");
              if (t.isToday) i.push("is-today");
              if (t.isSelected) {
                i.push("is-selected");
                n = "true";
              }
              if (t.hasEvent) i.push("has-event");
              if (t.isInRange) i.push("is-inrange");
              if (t.isStartRange) i.push("is-startrange");
              if (t.isEndRange) i.push("is-endrange");
              return (
                '<td data-day="' +
                t.day +
                '" class="' +
                i.join(" ") +
                '" aria-selected="' +
                n +
                '">' +
                '<button class="pika-button pika-day" type="button" ' +
                'data-pika-year="' +
                t.year +
                '" data-pika-month="' +
                t.month +
                '" data-pika-day="' +
                t.day +
                '">' +
                t.day +
                "</button>" +
                "</td>"
              );
            },
            y = function e(t, i) {
              t.setHours(0, 0, 0, 0);
              var n = t.getDate(),
                s = t.getDay(),
                l = i,
                a = l - 1,
                o = 7,
                r = function e(t) {
                  return (t + o - 1) % o;
                };
              t.setDate(n + a - r(s));
              var h = new Date(t.getFullYear(), 0, l),
                c = 24 * 60 * 60 * 1e3,
                d = (t.getTime() - h.getTime()) / c,
                u = 1 + Math.round((d - a + r(h.getDay())) / o);
              return u;
            },
            z = function e(t, i, n, s) {
              var l = new Date(n, i, t),
                a = o ? moment(l).isoWeek() : y(l, s);
              return '<td class="pika-week">' + a + "</td>";
            },
            H = function e(t, i, n, s) {
              return '<tr class="pika-row' + (n ? " pick-whole-week" : "") + (s ? " is-selected" : "") + '">' + (i ? t.reverse() : t).join("") + "</tr>";
            },
            E = function e(t) {
              return "<tbody>" + t.join("") + "</tbody>";
            },
            k = function e(t) {
              var i,
                n = [];
              if (t.showWeekNumber) n.push("<th></th>");
              for (i = 0; i < 7; i++) n.push('<th scope="col"><abbr title="' + m(t, i) + '">' + m(t, i, true) + "</abbr></th>");
              return "<thead><tr>" + (t.isRTL ? n.reverse() : n).join("") + "</tr></thead>";
            },
            w = function e(t, i, n, s, l, a) {
              var o,
                r,
                h,
                c = t._o,
                d = n === c.minYear,
                u = n === c.maxYear,
                g = '<div id="' + a + '" class="pika-title" role="heading" aria-live="assertive">',
                v,
                f,
                p = true,
                m = true;
              for (h = [], o = 0; o < 12; o++)
                h.push(
                  '<option value="' +
                  (n === l ? o - i : 12 + o - i) +
                  '"' +
                  (o === s ? ' selected="selected"' : "") +
                  ((d && o < c.minMonth) || (u && o > c.maxMonth) ? ' disabled="disabled"' : "") +
                  ">" +
                  c.i18n.months[o] +
                  "</option>"
                );
              v = '<div class="pika-label">' + c.i18n.months[s] + '<select class="pika-select pika-select-month" tabindex="-1">' + h.join("") + "</select></div>";
              if (b(c.yearRange)) {
                o = c.yearRange[0];
                r = c.yearRange[1] + 1;
              } else {
                o = n - c.yearRange;
                r = 1 + n + c.yearRange;
              }
              for (h = []; o < r && o <= c.maxYear; o++) if (o >= c.minYear) h.push('<option value="' + o + '"' + (o === n ? ' selected="selected"' : "") + ">" + o + "</option>");
              f = '<div class="pika-label">' + n + c.yearSuffix + '<select class="pika-select pika-select-year" tabindex="-1">' + h.join("") + "</select></div>";
              if (c.showMonthAfterYear) g += f + v;
              else g += v + f;
              if (d && (s === 0 || c.minMonth >= s)) p = false;
              if (u && (s === 11 || c.maxMonth <= s)) m = false;
              if (i === 0) g += '<button class="pika-prev' + (p ? "" : " is-disabled") + '" type="button">' + c.i18n.previousMonth + "</button>";
              if (i === t._o.numberOfMonths - 1) g += '<button class="pika-next' + (m ? "" : " is-disabled") + '" type="button">' + c.i18n.nextMonth + "</button>";
              return (g += "</div>");
            },
            V = function e(t, i, n) {
              return '<table cellpadding="0" cellspacing="0" class="pika-table" role="grid" aria-labelledby="' + n + '">' + k(t) + E(i) + "</table>";
            },
            e = function e(t) {
              var n = this,
                s = n.config(t);
              n._onMouseDown = function (e) {
                if (!n._v) return;
                e = e || window.event;
                var t = e.target || e.srcElement;
                if (!t) return;
                if (!r(t, "is-disabled"))
                  if (r(t, "pika-button") && !r(t, "is-empty") && !r(t.parentNode, "is-disabled")) {
                    n.setDate(new Date(t.getAttribute("data-pika-year"), t.getAttribute("data-pika-month"), t.getAttribute("data-pika-day")));
                    if (s.bound)
                      c(function () {
                        n.hide();
                        if (s.blurFieldOnSelect && s.field) s.field.blur();
                      }, 100);
                  } else if (r(t, "pika-prev")) n.prevMonth();
                  else if (r(t, "pika-next")) n.nextMonth();
                if (!r(t, "pika-select"))
                  if (e.preventDefault) e.preventDefault();
                  else {
                    e.returnValue = false;
                    return false;
                  }
                else n._c = true;
              };
              n._onChange = function (e) {
                e = e || window.event;
                var t = e.target || e.srcElement;
                if (!t) return;
                if (r(t, "pika-select-month")) n.gotoMonth(t.value);
                else if (r(t, "pika-select-year")) n.gotoYear(t.value);
              };
              n._onKeyChange = function (e) {
                e = e || window.event;
                if (n.isVisible())
                  switch (e.keyCode) {
                    case 13:
                    case 27:
                      if (s.field) s.field.blur();
                      break;
                    case 37:
                      n.adjustDate("subtract", 1);
                      break;
                    case 38:
                      n.adjustDate("subtract", 7);
                      break;
                    case 39:
                      n.adjustDate("add", 1);
                      break;
                    case 40:
                      n.adjustDate("add", 7);
                      break;
                    case 8:
                    case 46:
                      n.setDate(null);
                      break;
                  }
              };
              n._parseFieldValue = function () {
                if (s.parse) return s.parse(s.field.value, s.format);
                else if (o) {
                  var e = moment(s.field.value, s.format, s.formatStrict);
                  return e && e.isValid() ? e.toDate() : null;
                } else return new Date(Date.parse(s.field.value));
              };
              n._onInputChange = function (e) {
                var t;
                if (e.firedBy === n) return;
                t = n._parseFieldValue();
                if (M(t)) n.setDate(t);
                if (!n._v) n.show();
              };
              n._onInputFocus = function () {
                n.show();
              };
              n._onInputClick = function () {
                n.show();
              };
              n._onInputBlur = function () {
                var e = g.activeElement;
                do {
                  if (r(e, "pika-single")) return;
                } while ((e = e.parentNode));
                if (!n._c)
                  n._b = c(function () {
                    n.hide();
                  }, 50);
                n._c = false;
              };
              n._onClick = function (e) {
                e = e || window.event;
                var t = e.target || e.srcElement,
                  i = t;
                if (!t) return;
                if (!l && r(t, "pika-select"))
                  if (!t.onchange) {
                    t.setAttribute("onchange", "return;");
                    a(t, "change", n._onChange);
                  }
                do {
                  if (r(i, "pika-single") || i === s.trigger) return;
                } while ((i = i.parentNode));
                if (n._v && t !== s.trigger && i !== s.trigger) n.hide();
              };
              n.el = g.createElement("div");
              n.el.className = "pika-single" + (s.isRTL ? " is-rtl" : "") + (s.theme ? " " + s.theme : "");
              a(n.el, "mousedown", n._onMouseDown, true);
              a(n.el, "touchend", n._onMouseDown, true);
              a(n.el, "change", n._onChange);
              if (s.keyboardInput) a(g, "keydown", n._onKeyChange);
              if (s.field) {
                if (s.container) s.container.appendChild(n.el);
                else if (s.bound) g.body.appendChild(n.el);
                else s.field.parentNode.insertBefore(n.el, s.field.nextSibling);
                a(s.field, "change", n._onInputChange);
                if (!s.defaultDate) {
                  s.defaultDate = n._parseFieldValue();
                  s.setDefaultDate = true;
                }
              }
              var i = s.defaultDate;
              if (M(i))
                if (s.setDefaultDate) n.setDate(i, true);
                else n.gotoDate(i);
              else n.gotoDate(new Date());
              if (s.bound) {
                this.hide();
                n.el.className += " is-bound";
                a(s.trigger, "click", n._onInputClick);
                a(s.trigger, "focus", n._onInputFocus);
                a(s.trigger, "blur", n._onInputBlur);
              } else this.show();
            };
          return (
            (e.prototype = {
              config: function e(t) {
                if (!this._o) this._o = h({}, p, true);
                var i = h(this._o, t, true);
                i.isRTL = !!i.isRTL;
                i.field = i.field && i.field.nodeName ? i.field : null;
                i.theme = typeof i.theme === "string" && i.theme ? i.theme : null;
                i.bound = !!(i.bound !== undefined ? i.field && i.bound : i.field);
                i.trigger = i.trigger && i.trigger.nodeName ? i.trigger : i.field;
                i.disableWeekends = !!i.disableWeekends;
                i.disableDayFn = typeof i.disableDayFn === "function" ? i.disableDayFn : null;
                var n = parseInt(i.numberOfMonths, 10) || 1;
                i.numberOfMonths = n > 4 ? 4 : n;
                if (!M(i.minDate)) i.minDate = false;
                if (!M(i.maxDate)) i.maxDate = false;
                if (i.minDate && i.maxDate && i.maxDate < i.minDate) i.maxDate = i.minDate = false;
                if (i.minDate) this.setMinDate(i.minDate);
                if (i.maxDate) this.setMaxDate(i.maxDate);
                if (b(i.yearRange)) {
                  var s = new Date().getFullYear() - 10;
                  i.yearRange[0] = parseInt(i.yearRange[0], 10) || s;
                  i.yearRange[1] = parseInt(i.yearRange[1], 10) || s;
                } else {
                  i.yearRange = Math.abs(parseInt(i.yearRange, 10)) || p.yearRange;
                  if (i.yearRange > 100) i.yearRange = 100;
                }
                return i;
              },
              toString: function e(t) {
                t = t || this._o.format;
                if (!M(this._d)) return "";
                if (this._o.toString) return this._o.toString(this._d, t);
                if (o) return moment(this._d).format(t);
                return this._d.toDateString();
              },
              getMoment: function e() {
                return o ? moment(this._d) : null;
              },
              setMoment: function e(t, i) {
                if (o && moment.isMoment(t)) this.setDate(t.toDate(), i);
              },
              getDate: function e() {
                return M(this._d) ? new Date(this._d.getTime()) : null;
              },
              setDate: function e(t, i) {
                if (!t) {
                  this._d = null;
                  if (this._o.field) {
                    this._o.field.value = "";
                    d(this._o.field, "change", {
                      firedBy: this,
                    });
                  }
                  return this.draw();
                }
                if (typeof t === "string") t = new Date(Date.parse(t));
                if (!M(t)) return;
                var n = this._o.minDate,
                  s = this._o.maxDate;
                if (M(n) && t < n) t = n;
                else if (M(s) && t > s) t = s;
                this._d = new Date(t.getTime());
                R(this._d);
                this.gotoDate(this._d);
                if (this._o.field) {
                  this._o.field.value = this.toString();
                  d(this._o.field, "change", {
                    firedBy: this,
                  });
                }
                if (!i && typeof this._o.onSelect === "function") this._o.onSelect.call(this, this.getDate());
              },
              clear: function e() {
                this.setDate(null);
              },
              gotoDate: function e(t) {
                var i = true;
                if (!M(t)) return;
                if (this.calendars) {
                  var n = new Date(this.calendars[0].year, this.calendars[0].month, 1),
                    s = new Date(this.calendars[this.calendars.length - 1].year, this.calendars[this.calendars.length - 1].month, 1),
                    l = t.getTime();
                  s.setMonth(s.getMonth() + 1);
                  s.setDate(s.getDate() - 1);
                  i = l < n.getTime() || s.getTime() < l;
                }
                if (i) {
                  this.calendars = [
                    {
                      month: t.getMonth(),
                      year: t.getFullYear(),
                    },
                  ];
                  if (this._o.mainCalendar === "right") this.calendars[0].month += 1 - this._o.numberOfMonths;
                }
                this.adjustCalendars();
              },
              adjustDate: function e(t, i) {
                var n = this.getDate() || new Date();
                var s = parseInt(i) * 24 * 60 * 60 * 1e3;
                var l;
                if (t === "add") l = new Date(n.valueOf() + s);
                else if (t === "subtract") l = new Date(n.valueOf() - s);
                this.setDate(l);
              },
              adjustCalendars: function e() {
                this.calendars[0] = u(this.calendars[0]);
                for (var t = 1; t < this._o.numberOfMonths; t++)
                  this.calendars[t] = u({
                    month: this.calendars[0].month + t,
                    year: this.calendars[0].year,
                  });
                this.draw();
              },
              gotoToday: function e() {
                this.gotoDate(new Date());
              },
              gotoMonth: function e(t) {
                if (!isNaN(t)) {
                  this.calendars[0].month = parseInt(t, 10);
                  this.adjustCalendars();
                }
              },
              nextMonth: function e() {
                this.calendars[0].month++;
                this.adjustCalendars();
              },
              prevMonth: function e() {
                this.calendars[0].month--;
                this.adjustCalendars();
              },
              gotoYear: function e(t) {
                if (!isNaN(t)) {
                  this.calendars[0].year = parseInt(t, 10);
                  this.adjustCalendars();
                }
              },
              setMinDate: function e(t) {
                if (t instanceof Date) {
                  R(t);
                  this._o.minDate = t;
                  this._o.minYear = t.getFullYear();
                  this._o.minMonth = t.getMonth();
                } else {
                  this._o.minDate = p.minDate;
                  this._o.minYear = p.minYear;
                  this._o.minMonth = p.minMonth;
                  this._o.startRange = p.startRange;
                }
                this.draw();
              },
              setMaxDate: function e(t) {
                if (t instanceof Date) {
                  R(t);
                  this._o.maxDate = t;
                  this._o.maxYear = t.getFullYear();
                  this._o.maxMonth = t.getMonth();
                } else {
                  this._o.maxDate = p.maxDate;
                  this._o.maxYear = p.maxYear;
                  this._o.maxMonth = p.maxMonth;
                  this._o.endRange = p.endRange;
                }
                this.draw();
              },
              setStartRange: function e(t) {
                this._o.startRange = t;
              },
              setEndRange: function e(t) {
                this._o.endRange = t;
              },
              draw: function e(t) {
                if (!this._v && !t) return;
                var i = this._o,
                  n = i.minYear,
                  s = i.maxYear,
                  l = i.minMonth,
                  a = i.maxMonth,
                  o = "",
                  r;
                if (this._y <= n) {
                  this._y = n;
                  if (!isNaN(l) && this._m < l) this._m = l;
                }
                if (this._y >= s) {
                  this._y = s;
                  if (!isNaN(a) && this._m > a) this._m = a;
                }
                for (var h = 0; h < i.numberOfMonths; h++) {
                  r =
                    "pika-title-" +
                    Math.random()
                      .toString(36)
                      .replace(/[^a-z]+/g, "")
                      .substr(0, 2);
                  o += '<div class="pika-lendar">' + w(this, h, this.calendars[h].year, this.calendars[h].month, this.calendars[0].year, r) + this.render(this.calendars[h].year, this.calendars[h].month, r) + "</div>";
                }
                this.el.innerHTML = o;
                if (i.bound)
                  if (i.field.type !== "hidden")
                    c(function () {
                      i.trigger.focus();
                    }, 1);
                if (typeof this._o.onDraw === "function") this._o.onDraw(this);
                if (i.bound) i.field.setAttribute("aria-label", i.ariaLabel);
              },
              adjustPosition: function e() {
                var t, i, n, s, l, a, o, r, h, c, d, u;
                if (this._o.container) return;
                this.el.style.position = "absolute";
                t = this._o.trigger;
                i = t;
                n = this.el.offsetWidth;
                s = this.el.offsetHeight;
                l = window.innerWidth || g.documentElement.clientWidth;
                a = window.innerHeight || g.documentElement.clientHeight;
                o = window.pageYOffset || g.body.scrollTop || g.documentElement.scrollTop;
                d = true;
                u = true;
                if (typeof t.getBoundingClientRect === "function") {
                  c = t.getBoundingClientRect();
                  r = c.left + window.pageXOffset;
                  h = c.bottom + window.pageYOffset;
                } else {
                  r = i.offsetLeft;
                  h = i.offsetTop + i.offsetHeight;
                  while ((i = i.offsetParent)) {
                    r += i.offsetLeft;
                    h += i.offsetTop;
                  }
                }
                if ((this._o.reposition && r + n > l) || (this._o.position.indexOf("right") > -1 && r - n + t.offsetWidth > 0)) {
                  r = r - n + t.offsetWidth;
                  d = false;
                }
                if ((this._o.reposition && h + s > a + o) || (this._o.position.indexOf("top") > -1 && h - s - t.offsetHeight > 0)) {
                  h = h - s - t.offsetHeight;
                  u = false;
                }
                this.el.style.left = r + "px";
                this.el.style.top = h + "px";
                v(this.el, d ? "left-aligned" : "right-aligned");
                v(this.el, u ? "bottom-aligned" : "top-aligned");
                f(this.el, !d ? "left-aligned" : "right-aligned");
                f(this.el, !u ? "bottom-aligned" : "top-aligned");
              },
              render: function e(t, i, n) {
                var s = this._o,
                  l = new Date(),
                  a = B(t, i),
                  o = new Date(t, i, 1).getDay(),
                  r = [],
                  h = [];
                R(l);
                if (s.firstDay > 0) {
                  o -= s.firstDay;
                  if (o < 0) o += 7;
                }
                var c = i === 0 ? 11 : i - 1,
                  d = i === 11 ? 0 : i + 1,
                  u = i === 0 ? t - 1 : t,
                  g = i === 11 ? t + 1 : t,
                  v = B(u, c);
                var f = a + o,
                  p = f;
                while (p > 7) p -= 7;
                f += 7 - p;
                var m = false;
                for (var b = 0, y = 0; b < f; b++) {
                  var E = new Date(t, i, 1 + (b - o)),
                    k = M(this._d) ? P(E, this._d) : false,
                    w = P(E, l),
                    S = s.events.indexOf(E.toDateString()) !== -1 ? true : false,
                    C = b < o || b >= a + o,
                    L = 1 + (b - o),
                    x = i,
                    T = t,
                    O = s.startRange && P(s.startRange, E),
                    _ = s.endRange && P(s.endRange, E),
                    A = s.startRange && s.endRange && s.startRange < E && E < s.endRange,
                    I = (s.minDate && E < s.minDate) || (s.maxDate && E > s.maxDate) || (s.disableWeekends && N(E)) || (s.disableDayFn && s.disableDayFn(E));
                  if (C)
                    if (b < o) {
                      L = v + L;
                      x = c;
                      T = u;
                    } else {
                      L = L - a;
                      x = d;
                      T = g;
                    }
                  var D = {
                    day: L,
                    month: x,
                    year: T,
                    hasEvent: S,
                    isSelected: k,
                    isToday: w,
                    isDisabled: I,
                    isEmpty: C,
                    isStartRange: O,
                    isEndRange: _,
                    isInRange: A,
                    showDaysInNextAndPreviousMonths: s.showDaysInNextAndPreviousMonths,
                    enableSelectionDaysInNextAndPreviousMonths: s.enableSelectionDaysInNextAndPreviousMonths,
                  };
                  if (s.pickWholeWeek && k) m = true;
                  h.push(F(D));
                  if (++y === 7) {
                    if (s.showWeekNumber) h.unshift(z(b - o, i, t, s.firstWeekOfYearMinDays));
                    r.push(H(h, s.isRTL, s.pickWholeWeek, m));
                    h = [];
                    y = 0;
                    m = false;
                  }
                }
                return V(s, r, n);
              },
              isVisible: function e() {
                return this._v;
              },
              show: function e() {
                if (!this.isVisible()) {
                  this._v = true;
                  this.draw();
                  f(this.el, "is-hidden");
                  if (this._o.bound) {
                    a(g, "click", this._onClick);
                    this.adjustPosition();
                  }
                  if (typeof this._o.onOpen === "function") this._o.onOpen.call(this);
                }
              },
              hide: function e() {
                var t = this._v;
                if (t !== false) {
                  if (this._o.bound) i(g, "click", this._onClick);
                  if (!this._o.container) {
                    this.el.style.position = "static";
                    this.el.style.left = "auto";
                    this.el.style.top = "auto";
                  }
                  v(this.el, "is-hidden");
                  this._v = false;
                  if (t !== undefined && typeof this._o.onClose === "function") this._o.onClose.call(this);
                }
              },
              destroy: function e() {
                var t = this._o;
                this.hide();
                i(this.el, "mousedown", this._onMouseDown, true);
                i(this.el, "touchend", this._onMouseDown, true);
                i(this.el, "change", this._onChange);
                if (t.keyboardInput) i(g, "keydown", this._onKeyChange);
                if (t.field) {
                  i(t.field, "change", this._onInputChange);
                  if (t.bound) {
                    i(t.trigger, "click", this._onInputClick);
                    i(t.trigger, "focus", this._onInputFocus);
                    i(t.trigger, "blur", this._onInputBlur);
                  }
                }
                if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
              },
            }),
              e
          );
        })(moment);
      })();
    }),
    f = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.format,
          s = void 0 === n ? "DD-MM-YYYY" : n,
          l = i.theme,
          a = void 0 === l ? "ecl-datepicker-theme" : l,
          t = i.yearRange,
          n = void 0 === t ? 40 : t,
          l = i.reposition,
          t = void 0 !== l && l,
          l = i.showDaysInNextAndPreviousMonths,
          l = void 0 === l || l,
          i = i.enableSelectionDaysInNextAndPreviousMonths,
          i = void 0 === i || i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e), (this.format = s), (this.theme = a), (this.yearRange = n), (this.showDaysInNextAndPreviousMonths = l), (this.enableSelectionDaysInNextAndPreviousMonths = i), (this.reposition = t);
      }
      return (
        (i.autoInit = function (e, t) {
          (t = (void 0 === t ? {} : t).DATEPICKER), (t = new i(e, void 0 === t ? {} : t));
          return t.init(), (e.ECLDatepicker = t);
        }),
          (i.prototype.init = function () {
            return new v({
              field: this.element,
              format: this.format,
              yearRange: this.yearRange,
              firstDay: 1,
              theme: this.theme,
              reposition: this.reposition,
              showDaysInNextAndPreviousMonths: this.showDaysInNextAndPreviousMonths,
              enableSelectionDaysInNextAndPreviousMonths: this.enableSelectionDaysInNextAndPreviousMonths,
              onOpen: function () {
                var e = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
                  t = this.el.getBoundingClientRect();
                t.width >= e && ((this.el.style.width = "auto"), (this.el.style.right = t.left + "px"));
              },
            });
          }),
          i
      );
    })(),
    p = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.ellipsisButtonSelector,
          s = void 0 === n ? "[data-ecl-breadcrumb-core-ellipsis-button]" : n,
          l = i.ellipsisSelector,
          a = void 0 === l ? "[data-ecl-breadcrumb-core-ellipsis]" : l,
          o = i.segmentSelector,
          r = void 0 === o ? "[data-ecl-breadcrumb-core-item]" : o,
          t = i.expandableItemsSelector,
          n = void 0 === t ? '[data-ecl-breadcrumb-core-item="expandable"]' : t,
          l = i.staticItemsSelector,
          o = void 0 === l ? '[data-ecl-breadcrumb-core-item="static"]' : l,
          t = i.onPartialExpand,
          l = void 0 === t ? null : t,
          t = i.onFullExpand,
          t = void 0 === t ? null : t,
          i = i.attachClickListener,
          i = void 0 === i || i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.ellipsisButtonSelector = s),
          (this.ellipsisSelector = a),
          (this.segmentSelector = r),
          (this.expandableItemsSelector = n),
          (this.staticItemsSelector = o),
          (this.onPartialExpand = l),
          (this.onFullExpand = t),
          (this.attachClickListener = i),
          (this.ellipsisButton = null),
          (this.itemsElements = null),
          (this.staticElements = null),
          (this.expandableElements = null),
          (this.handleClickOnEllipsis = this.handleClickOnEllipsis.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).BREADCRUMB_CORE), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLBreadcrumbCore = t);
      };
      var e = i.prototype;
      return (
        (e.init = function () {
          (this.ellipsisButton = r(this.ellipsisButtonSelector, this.element)),
          this.attachClickListener && this.ellipsisButton && this.ellipsisButton.addEventListener("click", this.handleClickOnEllipsis),
            (this.itemsElements = o(this.segmentSelector, this.element)),
            (this.staticElements = o(this.staticItemsSelector, this.element)),
            (this.expandableElements = o(this.expandableItemsSelector, this.element)),
            this.check();
        }),
          (e.destroy = function () {
            this.attachClickListener && this.ellipsisButton && this.ellipsisButton.removeEventListener("click", this.handleClickOnEllipsis);
          }),
          (e.handleClickOnEllipsis = function () {
            return this.handleFullExpand();
          }),
          (e.check = function () {
            var e = this.computeVisibilityMap();
            e && (!0 === e.expanded ? this.handleFullExpand() : this.handlePartialExpand(e));
          }),
          (e.hideEllipsis = function () {
            var e = r(this.ellipsisSelector, this.element);
            e && e.setAttribute("aria-hidden", "true"), this.attachClickListener && this.ellipsisButton && this.ellipsisButton.removeEventListener("click", this.handleClickOnEllipsis);
          }),
          (e.showAllItems = function () {
            this.expandableElements.forEach(function (e) {
              return e.setAttribute("aria-hidden", "false");
            });
          }),
          (e.handlePartialExpand = function (e) {
            var i;
            !e ||
            ((i = e.isItemVisible) &&
              Array.isArray(i) &&
              (this.onPartialExpand
                ? this.onPartialExpand(i)
                : this.expandableElements.forEach(function (e, t) {
                  e.setAttribute("aria-hidden", i[t] ? "false" : "true");
                })));
          }),
          (e.handleFullExpand = function () {
            this.onFullExpand ? this.onFullExpand() : (this.hideEllipsis(), this.showAllItems());
          }),
          (e.computeVisibilityMap = function () {
            if (!this.expandableElements || 0 === this.expandableElements.length)
              return {
                expanded: !0,
              };
            var t = Math.floor(this.element.getBoundingClientRect().width);
            if (
              this.itemsElements
                .map(function (e) {
                  return e.getBoundingClientRect().width;
                })
                .reduce(function (e, t) {
                  return e + t;
                }) <= t
            )
              return {
                expanded: !0,
              };
            var i =
              r(this.ellipsisSelector, this.element).getBoundingClientRect().width +
              this.staticElements.reduce(function (e, t) {
                return e + t.getBoundingClientRect().width;
              }, 0);
            if (t <= i)
              return {
                expanded: !1,
                isItemVisible: [].concat(
                  this.expandableElements.map(function () {
                    return !1;
                  })
                ),
              };
            var n = 0,
              s = !0;
            return {
              expanded: !1,
              isItemVisible: []
                .concat(this.expandableElements)
                .reverse()
                .map(function (e) {
                  if (!s) return !1;
                  e = (n += e.getBoundingClientRect().width) + i <= t;
                  return e || (s = !1), e;
                })
                .reverse(),
            };
          }),
          i
      );
    })(),
    m = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.ellipsisButtonSelector,
          s = void 0 === n ? "[data-ecl-breadcrumb-standardised-ellipsis-button]" : n,
          l = i.ellipsisSelector,
          a = void 0 === l ? "[data-ecl-breadcrumb-standardised-ellipsis]" : l,
          o = i.segmentSelector,
          r = void 0 === o ? "[data-ecl-breadcrumb-standardised-item]" : o,
          t = i.expandableItemsSelector,
          n = void 0 === t ? '[data-ecl-breadcrumb-standardised-item="expandable"]' : t,
          l = i.staticItemsSelector,
          o = void 0 === l ? '[data-ecl-breadcrumb-standardised-item="static"]' : l,
          t = i.onPartialExpand,
          l = void 0 === t ? null : t,
          t = i.onFullExpand,
          t = void 0 === t ? null : t,
          i = i.attachClickListener,
          i = void 0 === i || i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.ellipsisButtonSelector = s),
          (this.ellipsisSelector = a),
          (this.segmentSelector = r),
          (this.expandableItemsSelector = n),
          (this.staticItemsSelector = o),
          (this.onPartialExpand = l),
          (this.onFullExpand = t),
          (this.attachClickListener = i),
          (this.ellipsisButton = null),
          (this.itemsElements = null),
          (this.staticElements = null),
          (this.expandableElements = null),
          (this.handleClickOnEllipsis = this.handleClickOnEllipsis.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).BREADCRUMB_STANDARDISED), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLBreadcrumbStandardised = t);
      };
      var e = i.prototype;
      return (
        (e.init = function () {
          (this.ellipsisButton = r(this.ellipsisButtonSelector, this.element)),
          this.attachClickListener && this.ellipsisButton && this.ellipsisButton.addEventListener("click", this.handleClickOnEllipsis),
            (this.itemsElements = o(this.segmentSelector, this.element)),
            (this.staticElements = o(this.staticItemsSelector, this.element)),
            (this.expandableElements = o(this.expandableItemsSelector, this.element)),
            this.check();
        }),
          (e.destroy = function () {
            this.attachClickListener && this.ellipsisButton && this.ellipsisButton.removeEventListener("click", this.handleClickOnEllipsis);
          }),
          (e.handleClickOnEllipsis = function () {
            return this.handleFullExpand();
          }),
          (e.check = function () {
            var e = this.computeVisibilityMap();
            e && (!0 === e.expanded ? this.handleFullExpand() : this.handlePartialExpand(e));
          }),
          (e.hideEllipsis = function () {
            var e = r(this.ellipsisSelector, this.element);
            e && e.setAttribute("aria-hidden", "true"), this.attachClickListener && this.ellipsisButton && this.ellipsisButton.removeEventListener("click", this.handleClickOnEllipsis);
          }),
          (e.showAllItems = function () {
            this.expandableElements.forEach(function (e) {
              return e.setAttribute("aria-hidden", "false");
            });
          }),
          (e.handlePartialExpand = function (e) {
            var i;
            !e ||
            ((i = e.isItemVisible) &&
              Array.isArray(i) &&
              (this.onPartialExpand
                ? this.onPartialExpand(i)
                : this.expandableElements.forEach(function (e, t) {
                  e.setAttribute("aria-hidden", i[t] ? "false" : "true");
                })));
          }),
          (e.handleFullExpand = function () {
            this.onFullExpand ? this.onFullExpand() : (this.hideEllipsis(), this.showAllItems());
          }),
          (e.computeVisibilityMap = function () {
            if (!this.expandableElements || 0 === this.expandableElements.length)
              return {
                expanded: !0,
              };
            var t = Math.floor(this.element.getBoundingClientRect().width);
            if (
              this.itemsElements
                .map(function (e) {
                  return e.getBoundingClientRect().width;
                })
                .reduce(function (e, t) {
                  return e + t;
                }) <= t
            )
              return {
                expanded: !0,
              };
            var i =
              r(this.ellipsisSelector, this.element).getBoundingClientRect().width +
              this.staticElements.reduce(function (e, t) {
                return e + t.getBoundingClientRect().width;
              }, 0);
            if (t <= i)
              return {
                expanded: !1,
                isItemVisible: [].concat(
                  this.expandableElements.map(function () {
                    return !1;
                  })
                ),
              };
            var n = 0,
              s = !0;
            return {
              expanded: !1,
              isItemVisible: []
                .concat(this.expandableElements)
                .reverse()
                .map(function (e) {
                  if (!s) return !1;
                  e = (n += e.getBoundingClientRect().width) + i <= t;
                  return e || (s = !1), e;
                })
                .reverse(),
            };
          }),
          i
      );
    })(),
    b = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.ellipsisButtonSelector,
          s = void 0 === n ? "[data-ecl-breadcrumb-harmonised-ellipsis-button]" : n,
          l = i.ellipsisSelector,
          a = void 0 === l ? "[data-ecl-breadcrumb-harmonised-ellipsis]" : l,
          o = i.segmentSelector,
          r = void 0 === o ? "[data-ecl-breadcrumb-harmonised-item]" : o,
          t = i.expandableItemsSelector,
          n = void 0 === t ? '[data-ecl-breadcrumb-harmonised-item="expandable"]' : t,
          l = i.staticItemsSelector,
          o = void 0 === l ? '[data-ecl-breadcrumb-harmonised-item="static"]' : l,
          t = i.onPartialExpand,
          l = void 0 === t ? null : t,
          t = i.onFullExpand,
          t = void 0 === t ? null : t,
          i = i.attachClickListener,
          i = void 0 === i || i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.ellipsisButtonSelector = s),
          (this.ellipsisSelector = a),
          (this.segmentSelector = r),
          (this.expandableItemsSelector = n),
          (this.staticItemsSelector = o),
          (this.onPartialExpand = l),
          (this.onFullExpand = t),
          (this.attachClickListener = i),
          (this.ellipsisButton = null),
          (this.itemsElements = null),
          (this.staticElements = null),
          (this.expandableElements = null),
          (this.handleClickOnEllipsis = this.handleClickOnEllipsis.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).BREADCRUMB_HARMONISED), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLBreadcrumbHarmonised = t);
      };
      var e = i.prototype;
      return (
        (e.init = function () {
          (this.ellipsisButton = r(this.ellipsisButtonSelector, this.element)),
          this.attachClickListener && this.ellipsisButton && this.ellipsisButton.addEventListener("click", this.handleClickOnEllipsis),
            (this.itemsElements = o(this.segmentSelector, this.element)),
            (this.staticElements = o(this.staticItemsSelector, this.element)),
            (this.expandableElements = o(this.expandableItemsSelector, this.element)),
            this.check();
        }),
          (e.destroy = function () {
            this.attachClickListener && this.ellipsisButton && this.ellipsisButton.removeEventListener("click", this.handleClickOnEllipsis);
          }),
          (e.handleClickOnEllipsis = function () {
            return this.handleFullExpand();
          }),
          (e.check = function () {
            var e = this.computeVisibilityMap();
            e && (!0 === e.expanded ? this.handleFullExpand() : this.handlePartialExpand(e));
          }),
          (e.hideEllipsis = function () {
            var e = r(this.ellipsisSelector, this.element);
            e && e.setAttribute("aria-hidden", "true"), this.attachClickListener && this.ellipsisButton && this.ellipsisButton.removeEventListener("click", this.handleClickOnEllipsis);
          }),
          (e.showAllItems = function () {
            this.expandableElements.forEach(function (e) {
              return e.setAttribute("aria-hidden", "false");
            });
          }),
          (e.handlePartialExpand = function (e) {
            var i;
            !e ||
            ((i = e.isItemVisible) &&
              Array.isArray(i) &&
              (this.onPartialExpand
                ? this.onPartialExpand(i)
                : this.expandableElements.forEach(function (e, t) {
                  e.setAttribute("aria-hidden", i[t] ? "false" : "true");
                })));
          }),
          (e.handleFullExpand = function () {
            this.onFullExpand ? this.onFullExpand() : (this.hideEllipsis(), this.showAllItems());
          }),
          (e.computeVisibilityMap = function () {
            if (!this.expandableElements || 0 === this.expandableElements.length)
              return {
                expanded: !0,
              };
            var t = Math.floor(this.element.getBoundingClientRect().width);
            if (
              this.itemsElements
                .map(function (e) {
                  return e.getBoundingClientRect().width;
                })
                .reduce(function (e, t) {
                  return e + t;
                }) <= t
            )
              return {
                expanded: !0,
              };
            var i =
              r(this.ellipsisSelector, this.element).getBoundingClientRect().width +
              this.staticElements.reduce(function (e, t) {
                return e + t.getBoundingClientRect().width;
              }, 0);
            if (t <= i)
              return {
                expanded: !1,
                isItemVisible: [].concat(
                  this.expandableElements.map(function () {
                    return !1;
                  })
                ),
              };
            var n = 0,
              s = !0;
            return {
              expanded: !1,
              isItemVisible: []
                .concat(this.expandableElements)
                .reverse()
                .map(function (e) {
                  if (!s) return !1;
                  e = (n += e.getBoundingClientRect().width) + i <= t;
                  return e || (s = !1), e;
                })
                .reverse(),
            };
          }),
          i
      );
    })(),
    y = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.toggleSelector,
          s = void 0 === n ? "[data-ecl-expandable-toggle]" : n,
          l = i.labelSelector,
          t = void 0 === l ? "[data-ecl-label]" : l,
          n = i.labelExpanded,
          l = void 0 === n ? "data-ecl-label-expanded" : n,
          n = i.labelCollapsed,
          n = void 0 === n ? "data-ecl-label-collapsed" : n,
          i = i.attachClickListener,
          i = void 0 === i || i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.toggleSelector = s),
          (this.labelSelector = t),
          (this.labelExpanded = l),
          (this.labelCollapsed = n),
          (this.attachClickListener = i),
          (this.toggle = null),
          (this.forceClose = !1),
          (this.target = null),
          (this.label = null),
          (this.handleClickOnToggle = this.handleClickOnToggle.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).EXPANDABLE), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLExpandable = t);
      };
      var e = i.prototype;
      return (
        (e.init = function () {
          if (((this.toggle = r(this.toggleSelector, this.element)), (this.target = document.querySelector("#" + this.toggle.getAttribute("aria-controls"))), (this.label = r(this.labelSelector, this.element)), !this.target))
            throw new TypeError("Target has to be provided for expandable (aria-controls)");
          this.attachClickListener && this.toggle && this.toggle.addEventListener("click", this.handleClickOnToggle);
        }),
          (e.destroy = function () {
            this.attachClickListener && this.toggle && this.toggle.removeEventListener("click", this.handleClickOnToggle);
          }),
          (e.handleClickOnToggle = function () {
            var e = !0 === this.forceClose || "true" === this.toggle.getAttribute("aria-expanded");
            return (
              this.toggle.setAttribute("aria-expanded", e ? "false" : "true"),
                (this.target.hidden = e),
                this.label && !e && this.toggle.hasAttribute(this.labelExpanded)
                  ? (this.label.innerHTML = this.toggle.getAttribute(this.labelExpanded))
                  : this.label && e && this.toggle.hasAttribute(this.labelCollapsed) && (this.label.innerHTML = this.toggle.getAttribute(this.labelCollapsed)),
                this
            );
          }),
          i
      );
    })(),
    w = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.translationToggleSelector,
          t = void 0 === n ? "[data-ecl-file-translation-toggle]" : n,
          n = i.translationContainerSelector,
          n = void 0 === n ? "[data-ecl-file-translation-container]" : n,
          i = i.attachClickListener,
          i = void 0 === i || i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.translationToggleSelector = t),
          (this.translationContainerSelector = n),
          (this.attachClickListener = i),
          (this.translationToggle = null),
          (this.translationContainer = null),
          (this.handleClickOnToggle = this.handleClickOnToggle.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).FILE_DOWNLOAD), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLFileDownload = t);
      };
      var e = i.prototype;
      return (
        (e.init = function () {
          (this.translationToggle = r(this.translationToggleSelector, this.element)),
            (this.translationContainer = r(this.translationContainerSelector, this.element)),
          this.attachClickListener && this.translationToggle && this.translationToggle.addEventListener("click", this.handleClickOnToggle);
        }),
          (e.destroy = function () {
            this.attachClickListener && this.translationToggle && this.translationToggle.removeEventListener("click", this.handleClickOnToggle);
          }),
          (e.handleClickOnToggle = function (e) {
            return (
              e.preventDefault(),
                "true" === this.translationContainer.getAttribute("aria-expanded") ? this.translationContainer.setAttribute("aria-expanded", "false") : this.translationContainer.setAttribute("aria-expanded", "true"),
                this
            );
          }),
          i
      );
    })(),
    S = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.groupSelector,
          s = void 0 === n ? "[data-ecl-file-upload-group]" : n,
          l = i.buttonSelector,
          a = void 0 === l ? "[data-ecl-file-upload-button]" : l,
          t = i.listSelector,
          n = void 0 === t ? "[data-ecl-file-upload-list]" : t,
          l = i.labelChoose,
          t = void 0 === l ? "data-ecl-file-upload-label-choose" : l,
          l = i.labelReplace,
          l = void 0 === l ? "data-ecl-file-upload-label-replace" : l,
          i = i.attachChangeListener,
          i = void 0 === i || i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.groupSelector = s),
          (this.buttonSelector = a),
          (this.listSelector = n),
          (this.labelChoose = t),
          (this.labelReplace = l),
          (this.attachChangeListener = i),
          (this.fileUploadGroup = null),
          (this.fileUploadInput = null),
          (this.fileUploadButton = null),
          (this.fileUploadList = null),
          (this.handleChange = this.handleChange.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).FILE_UPLOAD), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLFileUpload = t);
      };
      var e = i.prototype;
      return (
        (e.init = function () {
          (this.fileUploadGroup = this.element.closest(this.groupSelector)),
            (this.fileUploadInput = this.element),
            (this.fileUploadButton = r(this.buttonSelector, this.fileUploadGroup)),
            (this.fileUploadList = r(this.listSelector, this.fileUploadGroup)),
          this.attachChangeListener && this.fileUploadInput && this.fileUploadInput.addEventListener("change", this.handleChange);
        }),
          (e.destroy = function () {
            this.attachChangeListener && this.fileUploadInput && this.fileUploadInput.removeEventListener("change", this.handleChange);
          }),
          (e.handleChange = function (e) {
            var n;
            "files" in e.target
              ? ((n = ""),
                Array.prototype.forEach.call(e.target.files, function (e) {
                  var t = (function (e, t) {
                      if (0 === e) return "0 Bytes";
                      var i = (t = void 0 === t ? 2 : t) < 0 ? 0 : t,
                        t = Math.floor(Math.log(e) / Math.log(1024));
                      return parseFloat((e / Math.pow(1024, t)).toFixed(i)) + " " + ["Bytes", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][t];
                    })(e.size, 1),
                    i = e.name.split(".").pop();
                  n += '<li class="ecl-file-upload__item">\n      <span class="ecl-file-upload__item-name">' + e.name + '</span>\n      <span class="ecl-file-upload__item-meta">(' + t + " - " + i + ")</span>\n      </li>";
                }),
                (this.fileUploadList.innerHTML = n),
              this.fileUploadButton.hasAttribute(this.labelReplace) && (this.fileUploadButton.innerHTML = this.fileUploadButton.getAttribute(this.labelReplace)))
              : this.fileUploadButton.hasAttribute(this.labelChoose) && (this.fileUploadButton.innerHTML = this.fileUploadButton.getAttribute(this.labelChoose));
          }),
          i
      );
    })(),
    C = ["input", "select", "textarea", "a[href]", "button", "[tabindex]", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"],
    L = C.join(","),
    x = "undefined" == typeof Element ? function () {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector,
    T = function (e, t, i) {
      var n = Array.prototype.slice.apply(e.querySelectorAll(L));
      return t && x.call(e, L) && n.unshift(e), (n = n.filter(i));
    },
    O = function (e) {
      var t = parseInt(e.getAttribute("tabindex"), 10);
      return isNaN(t) ? ("true" !== e.contentEditable && (("AUDIO" !== e.nodeName && "VIDEO" !== e.nodeName && "DETAILS" !== e.nodeName) || null !== e.getAttribute("tabindex")) ? e.tabIndex : 0) : t;
    },
    _ = function (e, t) {
      return e.tabIndex === t.tabIndex ? e.documentOrder - t.documentOrder : e.tabIndex - t.tabIndex;
    },
    A = function (e, t) {
      return !(
        t.disabled ||
        (d((i = t)) && "hidden" === i.type) ||
        (function (e, t) {
          if ("hidden" === getComputedStyle(e).visibility) return !0;
          var i = x.call(e, "details>summary:first-of-type") ? e.parentElement : e;
          if (x.call(i, "details:not([open]) *")) return !0;
          if (t && "full" !== t) {
            if ("non-zero-area" === t) {
              (i = e.getBoundingClientRect()), (t = i.width), (i = i.height);
              return 0 === t && 0 === i;
            }
          } else
            for (; e; ) {
              if ("none" === getComputedStyle(e).display) return !0;
              e = e.parentElement;
            }
          return !1;
        })(t, e.displayCheck) ||
        ("DETAILS" === (e = t).tagName &&
          Array.prototype.slice.apply(e.children).some(function (e) {
            return "SUMMARY" === e.tagName;
          })) ||
        (function (e) {
          if (d(e) || "SELECT" === e.tagName || "TEXTAREA" === e.tagName || "BUTTON" === e.tagName)
            for (var t = e.parentElement; t; ) {
              if ("FIELDSET" === t.tagName && t.disabled) {
                for (var i = 0; i < t.children.length; i++) {
                  var n = t.children.item(i);
                  if ("LEGEND" === n.tagName) return !n.contains(e);
                }
                return !0;
              }
              t = t.parentElement;
            }
          return !1;
        })(t)
      );
      var i;
    },
    I = function (e, t) {
      return !(!A(e, t) || g(t) || O(t) < 0);
    },
    D = C.concat("iframe").join(",");
  function M(t, e) {
    var i,
      n = Object.keys(t);
    return (
      Object.getOwnPropertySymbols &&
      ((i = Object.getOwnPropertySymbols(t)),
      e &&
      (i = i.filter(function (e) {
        return Object.getOwnPropertyDescriptor(t, e).enumerable;
      })),
        n.push.apply(n, i)),
        n
    );
  }
  function N(n) {
    for (var e = 1; e < arguments.length; e++) {
      var s = null != arguments[e] ? arguments[e] : {};
      e % 2
        ? M(Object(s), !0).forEach(function (e) {
          var t, i;
          (t = n),
            (e = s[(i = e)]),
            i in t
              ? Object.defineProperty(t, i, {
                value: e,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
              : (t[i] = e);
        })
        : Object.getOwnPropertyDescriptors
          ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(s))
          : M(Object(s)).forEach(function (e) {
            Object.defineProperty(n, e, Object.getOwnPropertyDescriptor(s, e));
          });
    }
    return n;
  }
  function B(e) {
    return setTimeout(e, 0);
  }
  function R(e, i) {
    var n = -1;
    return (
      e.every(function (e, t) {
        return !i(e) || ((n = t), !1);
      }),
        n
    );
  }
  function P(e) {
    for (var t = arguments.length, i = new Array(1 < t ? t - 1 : 0), n = 1; n < t; n++) i[n - 1] = arguments[n];
    return "function" == typeof e ? e.apply(void 0, i) : e;
  }
  function F(e) {
    return e.target.shadowRoot && "function" == typeof e.composedPath ? e.composedPath()[0] : e.target;
  }
  function z(e, t) {
    function a(e, t, i) {
      return e && void 0 !== e[t] ? e[t] : u[i || t];
    }
    function o(e) {
      var t = u[e];
      if ("function" == typeof t) {
        for (var i = arguments.length, n = new Array(1 < i ? i - 1 : 0), s = 1; s < i; s++) n[s - 1] = arguments[s];
        t = t.apply(void 0, n);
      }
      if (!t) {
        if (void 0 === t || !1 === t) return t;
        throw new Error("`".concat(e, "` was specified but was not a node, or did not return a node"));
      }
      var l = t;
      if ("string" == typeof t && !(l = d.querySelector(t))) throw new Error("`".concat(e, "` as selector refers to no known node"));
      return l;
    }
    function r() {
      if (
        ((g.tabbableGroups = g.containers
          .map(function (e) {
            var n,
              s,
              t =
                ((n = []),
                  (s = []),
                  T(e, (t = t || {}).includeContainer, I.bind(null, t)).forEach(function (e, t) {
                    var i = O(e);
                    0 === i
                      ? n.push(e)
                      : s.push({
                        documentOrder: t,
                        tabIndex: i,
                        node: e,
                      });
                  }),
                  s
                    .sort(_)
                    .map(function (e) {
                      return e.node;
                    })
                    .concat(n));
            if (0 < t.length)
              return {
                container: e,
                firstTabbableNode: t[0],
                lastTabbableNode: t[t.length - 1],
              };
          })
          .filter(function (e) {
            return !!e;
          })),
        g.tabbableGroups.length <= 0 && !o("fallbackFocus"))
      )
        throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
    }
    function h(e) {
      var t = o("setReturnFocus", e);
      return t || (!1 !== t && e);
    }
    function l() {
      return (
        g.active &&
        (V.activateTrap(y),
          (g.delayInitialFocusTimer = u.delayInitialFocus
            ? B(function () {
              v(s());
            })
            : v(s())),
          d.addEventListener("focusin", f, !0),
          d.addEventListener("mousedown", i, {
            capture: !0,
            passive: !1,
          }),
          d.addEventListener("touchstart", i, {
            capture: !0,
            passive: !1,
          }),
          d.addEventListener("click", b, {
            capture: !0,
            passive: !1,
          }),
          d.addEventListener("keydown", m, {
            capture: !0,
            passive: !1,
          }),
          y)
      );
    }
    function c() {
      return (
        g.active && (d.removeEventListener("focusin", f, !0), d.removeEventListener("mousedown", i, !0), d.removeEventListener("touchstart", i, !0), d.removeEventListener("click", b, !0), d.removeEventListener("keydown", m, !0), y)
      );
    }
    var d = (null == t ? void 0 : t.document) || document,
      u = N(
        {
          returnFocusOnDeactivate: !0,
          escapeDeactivates: !0,
          delayInitialFocus: !0,
        },
        t
      ),
      g = {
        containers: [],
        tabbableGroups: [],
        nodeFocusedBeforeActivation: null,
        mostRecentlyFocusedNode: null,
        active: !1,
        paused: !1,
        delayInitialFocusTimer: void 0,
      },
      n = function (t) {
        return !(
          !t ||
          !g.containers.some(function (e) {
            return e.contains(t);
          })
        );
      },
      s = function () {
        var e,
          t = o("initialFocus");
        if (!1 === t) return !1;
        if (!(t = void 0 === t ? (n(d.activeElement) ? d.activeElement : ((e = g.tabbableGroups[0]) && e.firstTabbableNode) || o("fallbackFocus")) : t))
          throw new Error("Your focus-trap needs to have at least one focusable element");
        return t;
      },
      v = function e(t) {
        var i;
        !1 !== t &&
        t !== d.activeElement &&
        (t && t.focus
          ? (t.focus({
            preventScroll: !!u.preventScroll,
          }),
            (g.mostRecentlyFocusedNode = t),
          (i = t).tagName && "input" === i.tagName.toLowerCase() && "function" == typeof i.select && t.select())
          : e(s()));
      },
      i = function (e) {
        var t = F(e);
        n(t) ||
        (P(u.clickOutsideDeactivates, e)
          ? y.deactivate({
            returnFocus: u.returnFocusOnDeactivate && !k(t),
          })
          : P(u.allowOutsideClick, e) || e.preventDefault());
      },
      f = function (e) {
        var t = F(e),
          i = n(t);
        i || t instanceof Document ? i && (g.mostRecentlyFocusedNode = t) : (e.stopImmediatePropagation(), v(g.mostRecentlyFocusedNode || s()));
      },
      p = function (e) {
        var t = F(e);
        r();
        var i,
          n,
          s,
          l = null;
        0 < g.tabbableGroups.length
          ? (i = R(g.tabbableGroups, function (e) {
            return e.container.contains(t);
          })) < 0
            ? (l = e.shiftKey ? g.tabbableGroups[g.tabbableGroups.length - 1].lastTabbableNode : g.tabbableGroups[0].firstTabbableNode)
            : e.shiftKey
              ? 0 <=
              (n =
                (n = R(g.tabbableGroups, function (e) {
                  e = e.firstTabbableNode;
                  return t === e;
                })) < 0 &&
                (g.tabbableGroups[i].container === t || (k(t) && !E(t)))
                  ? i
                  : n) && ((s = 0 === n ? g.tabbableGroups.length - 1 : n - 1), (l = g.tabbableGroups[s].lastTabbableNode))
              : 0 <=
              (s =
                (s = R(g.tabbableGroups, function (e) {
                  e = e.lastTabbableNode;
                  return t === e;
                })) < 0 &&
                (g.tabbableGroups[i].container === t || (k(t) && !E(t)))
                  ? i
                  : s) && ((s = s === g.tabbableGroups.length - 1 ? 0 : s + 1), (l = g.tabbableGroups[s].firstTabbableNode))
          : (l = o("fallbackFocus")),
        l && (e.preventDefault(), v(l));
      },
      m = function (e) {
        if (("Escape" === (t = e).key || "Esc" === t.key || 27 === t.keyCode) && !1 !== P(u.escapeDeactivates, e)) return e.preventDefault(), void y.deactivate();
        var t;
        ("Tab" !== (t = e).key && 9 !== t.keyCode) || p(e);
      },
      b = function (e) {
        var t;
        P(u.clickOutsideDeactivates, e) || ((t = F(e)), n(t) || P(u.allowOutsideClick, e) || (e.preventDefault(), e.stopImmediatePropagation()));
      },
      y = {
        activate: function (e) {
          if (g.active) return this;
          var t = a(e, "onActivate"),
            i = a(e, "onPostActivate"),
            n = a(e, "checkCanFocusTrap");
          n || r(), (g.active = !0), (g.paused = !1), (g.nodeFocusedBeforeActivation = d.activeElement), t && t();
          function s() {
            n && r(), l(), i && i();
          }
          return n ? n(g.containers.concat()).then(s, s) : s(), this;
        },
        deactivate: function (e) {
          if (!g.active) return this;
          clearTimeout(g.delayInitialFocusTimer), (g.delayInitialFocusTimer = void 0), c(), (g.active = !1), (g.paused = !1), V.deactivateTrap(y);
          var t = a(e, "onDeactivate"),
            i = a(e, "onPostDeactivate"),
            n = a(e, "checkCanReturnFocus");
          t && t();
          function s() {
            B(function () {
              l && v(h(g.nodeFocusedBeforeActivation)), i && i();
            });
          }
          var l = a(e, "returnFocus", "returnFocusOnDeactivate");
          return l && n ? n(h(g.nodeFocusedBeforeActivation)).then(s, s) : s(), this;
        },
        pause: function () {
          return g.paused || !g.active || ((g.paused = !0), c()), this;
        },
        unpause: function () {
          return g.paused && g.active && ((g.paused = !1), r(), l()), this;
        },
        updateContainerElements: function (e) {
          e = [].concat(e).filter(Boolean);
          return (
            (g.containers = e.map(function (e) {
              return "string" == typeof e ? d.querySelector(e) : e;
            })),
            g.active && r(),
              this
          );
        },
      };
    return y.updateContainerElements(e), y;
  }
  var H,
    V =
      ((H = []),
        {
          activateTrap: function (e) {
            0 < H.length && (t = H[H.length - 1]) !== e && t.pause();
            var t = H.indexOf(e);
            -1 === t || H.splice(t, 1), H.push(e);
          },
          deactivateTrap: function (e) {
            e = H.indexOf(e);
            -1 !== e && H.splice(e, 1), 0 < H.length && H[H.length - 1].unpause();
          },
        }),
    W = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.galleryItemSelector,
          s = void 0 === n ? "[data-ecl-gallery-item]" : n,
          l = i.descriptionSelector,
          a = void 0 === l ? "[data-ecl-gallery-description]" : l,
          o = i.metaSelector,
          r = void 0 === o ? "[data-ecl-gallery-meta]" : o,
          h = i.closeButtonSelector,
          c = void 0 === h ? "[data-ecl-gallery-close]" : h,
          d = i.viewAllSelector,
          u = void 0 === d ? "[data-ecl-gallery-all]" : d,
          g = i.countSelector,
          v = void 0 === g ? "[data-ecl-gallery-count]" : g,
          f = i.overlaySelector,
          p = void 0 === f ? "[data-ecl-gallery-overlay]" : f,
          m = i.overlayHeaderSelector,
          b = void 0 === m ? "[data-ecl-gallery-overlay-header]" : m,
          y = i.overlayFooterSelector,
          E = void 0 === y ? "[data-ecl-gallery-overlay-footer]" : y,
          k = i.overlayMediaSelector,
          t = void 0 === k ? "[data-ecl-gallery-overlay-media]" : k,
          n = i.overlayCounterCurrentSelector,
          l = void 0 === n ? "[data-ecl-gallery-overlay-counter-current]" : n,
          o = i.overlayCounterMaxSelector,
          h = void 0 === o ? "[data-ecl-gallery-overlay-counter-max]" : o,
          d = i.overlayDownloadSelector,
          g = void 0 === d ? "[data-ecl-gallery-overlay-download]" : d,
          f = i.overlayShareSelector,
          m = void 0 === f ? "[data-ecl-gallery-overlay-share]" : f,
          y = i.overlayDescriptionSelector,
          k = void 0 === y ? "[data-ecl-gallery-overlay-description]" : y,
          n = i.overlayMetaSelector,
          o = void 0 === n ? "[data-ecl-gallery-overlay-meta]" : n,
          d = i.overlayPreviousSelector,
          f = void 0 === d ? "[data-ecl-gallery-overlay-previous]" : d,
          y = i.overlayNextSelector,
          n = void 0 === y ? "[data-ecl-gallery-overlay-next]" : y,
          d = i.attachClickListener,
          y = void 0 === d || d,
          d = i.attachKeyListener,
          d = void 0 === d || d,
          i = i.attachResizeListener,
          i = void 0 === i || i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.galleryItemSelector = s),
          (this.descriptionSelector = a),
          (this.metaSelector = r),
          (this.closeButtonSelector = c),
          (this.viewAllSelector = u),
          (this.countSelector = v),
          (this.overlaySelector = p),
          (this.overlayHeaderSelector = b),
          (this.overlayFooterSelector = E),
          (this.overlayMediaSelector = t),
          (this.overlayCounterCurrentSelector = l),
          (this.overlayCounterMaxSelector = h),
          (this.overlayDownloadSelector = g),
          (this.overlayShareSelector = m),
          (this.overlayDescriptionSelector = k),
          (this.overlayMetaSelector = o),
          (this.overlayPreviousSelector = f),
          (this.overlayNextSelector = n),
          (this.attachClickListener = y),
          (this.attachKeyListener = d),
          (this.attachResizeListener = i),
          (this.galleryItems = null),
          (this.meta = null),
          (this.closeButton = null),
          (this.viewAll = null),
          (this.count = null),
          (this.overlay = null),
          (this.overlayHeader = null),
          (this.overlayFooter = null),
          (this.overlayMedia = null),
          (this.overlayCounterCurrent = null),
          (this.overlayCounterMax = null),
          (this.overlayDownload = null),
          (this.overlayShare = null),
          (this.overlayDescription = null),
          (this.overlayMeta = null),
          (this.overlayPrevious = null),
          (this.overlayNext = null),
          (this.selectedItem = null),
          (this.focusTrap = null),
          (this.isDesktop = !1),
          (this.resizeTimer = null),
          (this.breakpointMd = 768),
          (this.imageHeight = 185),
          (this.handleClickOnCloseButton = this.handleClickOnCloseButton.bind(this)),
          (this.handleClickOnViewAll = this.handleClickOnViewAll.bind(this)),
          (this.handleClickOnItem = this.handleClickOnItem.bind(this)),
          (this.handleKeyPressOnItem = this.handleKeyPressOnItem.bind(this)),
          (this.handleClickOnPreviousButton = this.handleClickOnPreviousButton.bind(this)),
          (this.handleClickOnNextButton = this.handleClickOnNextButton.bind(this)),
          (this.handleKeyboard = this.handleKeyboard.bind(this)),
          (this.handleResize = this.handleResize.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).GALLERY), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLGallery = t);
      };
      var e = i.prototype;
      return (
        (e.init = function () {
          var t = this;
          (this.galleryItems = o(this.galleryItemSelector, this.element)),
            (this.closeButton = r(this.closeButtonSelector, this.element)),
            (this.viewAll = r(this.viewAllSelector, this.element)),
            (this.count = r(this.countSelector, this.element)),
            (this.overlay = r(this.overlaySelector, this.element)),
            (this.overlayHeader = r(this.overlayHeaderSelector, this.overlay)),
            (this.overlayFooter = r(this.overlayFooterSelector, this.overlay)),
            (this.overlayMedia = r(this.overlayMediaSelector, this.overlay)),
            (this.overlayCounterCurrent = r(this.overlayCounterCurrentSelector, this.overlay)),
            (this.overlayCounterMax = r(this.overlayCounterMaxSelector, this.overlay)),
            (this.overlayDownload = r(this.overlayDownloadSelector, this.overlay)),
            (this.overlayShare = r(this.overlayShareSelector, this.overlay)),
            (this.overlayDescription = r(this.overlayDescriptionSelector, this.overlay)),
            (this.overlayMeta = r(this.overlayMetaSelector, this.overlay)),
            (this.overlayPrevious = r(this.overlayPreviousSelector, this.overlay)),
            (this.overlayNext = r(this.overlayNextSelector, this.overlay)),
            (this.focusTrap = z(this.overlay, {
              escapeDeactivates: !1,
              returnFocusOnDeactivate: !1,
            })),
            (this.isDialogSupported = !0),
          window.HTMLDialogElement || (this.isDialogSupported = !1),
          this.attachClickListener && this.closeButton && this.closeButton.addEventListener("click", this.handleClickOnCloseButton),
          this.attachClickListener && this.viewAll && this.viewAll.addEventListener("click", this.handleClickOnViewAll),
          this.attachClickListener &&
          this.galleryItems &&
          this.galleryItems.forEach(function (e) {
            t.attachClickListener && e.addEventListener("click", t.handleClickOnItem), t.attachKeyListener && e.addEventListener("keyup", t.handleKeyPressOnItem);
          }),
          this.attachClickListener && this.overlayPrevious && this.overlayPrevious.addEventListener("click", this.handleClickOnPreviousButton),
          this.attachClickListener && this.overlayNext && this.overlayNext.addEventListener("click", this.handleClickOnNextButton),
          !this.isDialogSupported && this.attachKeyListener && this.overlay && this.overlay.addEventListener("keyup", this.handleKeyboard),
          this.isDialogSupported && this.overlay && this.overlay.addEventListener("close", this.handleClickOnCloseButton),
          this.attachResizeListener && window.addEventListener("resize", this.handleResize),
            this.checkScreen(),
            this.hideItems(),
            this.galleryItems.forEach(function (e, t) {
              e.setAttribute("data-ecl-gallery-item-id", t);
            }),
          this.count && (this.count.innerHTML = this.galleryItems.length);
        }),
          (e.destroy = function () {
            var t = this;
            this.attachClickListener && this.closeButton && this.closeButton.removeEventListener("click", this.handleClickOnCloseButton),
            this.attachClickListener && this.viewAll && this.viewAll.removeEventListener("click", this.handleClickOnViewAll),
            this.attachClickListener &&
            this.galleryItems &&
            this.galleryItems.forEach(function (e) {
              e.removeEventListener("click", t.handleClickOnItem);
            }),
            this.attachClickListener && this.overlayPrevious && this.overlayPrevious.removeEventListener("click", this.handleClickOnPreviousButton),
            this.attachClickListener && this.overlayNext && this.overlayNext.removeEventListener("click", this.handleClickOnNextButton),
            !this.isDialogSupported && this.attachKeyListener && this.overlay && this.overlay.removeEventListener("keyup", this.handleKeyboard),
            this.isDialogSupported && this.overlay && this.overlay.removeEventListener("close", this.handleClickOnCloseButton),
            this.attachResizeListener && window.removeEventListener("resize", this.handleResize);
          }),
          (e.checkScreen = function () {
            window.innerWidth > this.breakpointMd ? (this.isDesktop = !0) : (this.isDesktop = !1);
          }),
          (e.hideItems = function () {
            var i = this;
            if (this.viewAll) {
              if (this.isDesktop) {
                var n = this.element.getBoundingClientRect().top,
                  s = [];
                return (
                  this.galleryItems.forEach(function (e, t) {
                    e.parentNode.classList.remove("ecl-gallery__item--hidden"), e.getBoundingClientRect().top - n > 2 * i.imageHeight && (s = [].concat(s, [t]));
                  }),
                    void s.forEach(function (e) {
                      i.galleryItems[e].parentNode.classList.add("ecl-gallery__item--hidden");
                    })
                );
              }
              this.galleryItems.forEach(function (e, t) {
                2 < t ? e.parentNode.classList.add("ecl-gallery__item--hidden") : e.parentNode.classList.remove("ecl-gallery__item--hidden");
              });
            }
          }),
          (e.handleResize = function () {
            var e = this;
            clearTimeout(this.resizeTimer),
              (this.resizeTimer = setTimeout(function () {
                e.checkScreen(), e.hideItems();
              }, 200));
          }),
          (e.updateOverlay = function (e) {
            var t,
              i = (this.selectedItem = e).getAttribute("data-ecl-gallery-item-embed-src"),
              n = r("video", e),
              s = null;
            null != i
              ? ((s = document.createElement("div")).classList.add("ecl-gallery__slider-embed"),
                (t = document.createElement("iframe")).setAttribute("src", i),
                t.setAttribute("frameBorder", "0"),
              this.overlayMedia && (s.appendChild(t), (this.overlayMedia.innerHTML = ""), this.overlayMedia.appendChild(s)))
              : null != n
                ? ((s = document.createElement("video")).setAttribute("poster", n.poster),
                  s.setAttribute("controls", "controls"),
                  s.classList.add("ecl-gallery__slider-video"),
                this.overlayMedia && ((this.overlayMedia.innerHTML = ""), this.overlayMedia.appendChild(s)),
                  o("source", n).forEach(function (e) {
                    var t = document.createElement("source");
                    t.setAttribute("src", e.getAttribute("src")), t.setAttribute("type", e.getAttribute("type")), s.appendChild(t);
                  }),
                  o("track", n).forEach(function (e) {
                    var t = document.createElement("track");
                    t.setAttribute("src", e.getAttribute("src")),
                      t.setAttribute("kind", e.getAttribute("kind")),
                      t.setAttribute("srclang", e.getAttribute("srcLang")),
                      t.setAttribute("label", e.getAttribute("label")),
                      s.appendChild(t);
                  }),
                  s.load())
                : ((l = r("img", e)),
                  (s = document.createElement("img")).setAttribute("src", l.getAttribute("src")),
                  s.setAttribute("alt", l.getAttribute("alt")),
                  s.classList.add("ecl-gallery__slider-image"),
                this.overlayMedia && ((this.overlayMedia.innerHTML = ""), this.overlayMedia.appendChild(s))),
              (this.overlayCounterCurrent.innerHTML = +e.getAttribute("data-ecl-gallery-item-id") + 1),
              (this.overlayCounterMax.innerHTML = this.galleryItems.length);
            var l = this.selectedItem.getAttribute("data-ecl-gallery-item-share");
            null != l ? ((this.overlayShare.href = l), (this.overlayShare.hidden = !1)) : (this.overlayShare.hidden = !0),
              null != i ? (this.overlayDownload.hidden = !0) : ((this.overlayDownload.href = this.selectedItem.href), (this.overlayDownload.hidden = !1));
            i = r(this.metaSelector, e);
            this.overlayMeta.innerHTML = i.innerHTML;
            e = r(this.descriptionSelector, e);
            this.overlayDescription.innerHTML = e.innerHTML;
            e = this.overlay.clientHeight - this.overlayHeader.clientHeight - this.overlayFooter.clientHeight;
            this.overlayMedia &&
            Object.assign(s.style, {
              maxHeight: e + "px",
            });
          }),
          (e.handleKeyboard = function (e) {
            ("Escape" !== e.key && "Esc" !== e.key) || this.handleClickOnCloseButton();
          }),
          (e.handleClickOnCloseButton = function () {
            this.isDialogSupported ? this.overlay.close() : this.overlay.removeAttribute("open");
            var e = r("iframe", this.overlayMedia);
            e && e.remove();
            e = r("video", this.overlayMedia);
            e && e.pause(), this.focusTrap.deactivate(), this.selectedItem.focus(), document.body.classList.remove("ecl-u-disablescroll");
          }),
          (e.handleKeyPressOnItem = function (e) {
            32 === e.keyCode && this.handleClickOnItem(e);
          }),
          (e.handleClickOnViewAll = function (e) {
            e.preventDefault(),
              document.body.classList.add("ecl-u-disablescroll"),
              this.isDialogSupported ? this.overlay.showModal() : this.overlay.setAttribute("open", ""),
              this.updateOverlay(this.galleryItems[0]),
              this.focusTrap.activate();
          }),
          (e.handleClickOnItem = function (e) {
            e.preventDefault(),
              document.body.classList.add("ecl-u-disablescroll"),
              this.isDialogSupported ? this.overlay.showModal() : this.overlay.setAttribute("open", ""),
              this.updateOverlay(e.currentTarget),
              this.focusTrap.activate();
          }),
          (e.handleClickOnPreviousButton = function () {
            var e = +this.selectedItem.getAttribute("data-ecl-gallery-item-id") - 1;
            e < 0 && (e = this.galleryItems.length - 1);
            var t = r("video", this.selectedItem);
            return t && t.pause(), this.updateOverlay(this.galleryItems[e]), (this.selectedItem = this.galleryItems[e]), this;
          }),
          (e.handleClickOnNextButton = function () {
            var e = +this.selectedItem.getAttribute("data-ecl-gallery-item-id") + 1;
            e >= this.galleryItems.length && (e = 0);
            var t = r("video", this.selectedItem);
            return t && t.pause(), this.updateOverlay(this.galleryItems[e]), (this.selectedItem = this.galleryItems[e]), this;
          }),
          i
      );
    })(),
    j = c(function (b) {
      !(function (r, h) {
        var e = function (e, t, i) {
          return t && n(e.prototype, t), i && n(e, i), e;
        };
        function n(e, t) {
          for (var i = 0; i < t.length; i++) {
            var n = t[i];
            (n.enumerable = n.enumerable || !1), (n.configurable = !0), "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
          }
        }
        var t,
          c = !1,
          i = void 0 !== r;
        i && r.getComputedStyle
          ? ((t = h.createElement("div")),
          ["", "-webkit-", "-moz-", "-ms-"].some(function (e) {
            try {
              t.style.position = e + "sticky";
            } catch (e) {}
            return "" != t.style.position;
          }) && (c = !0))
          : (c = !0);
        var l = !1,
          d = "undefined" != typeof ShadowRoot,
          a = {
            top: null,
            left: null,
          },
          o = [];
        function u(e, t) {
          for (var i in t) t.hasOwnProperty(i) && (e[i] = t[i]);
        }
        function g(e) {
          return parseFloat(e) || 0;
        }
        function v(e) {
          for (var t = 0; e; ) (t += e.offsetTop), (e = e.offsetParent);
          return t;
        }
        var s =
          (e(f, [
            {
              key: "refresh",
              value: function () {
                var e, t, i, n, s, l, a, o;
                c ||
                this._removed ||
                (this._active && this._deactivate(),
                  (e = this._node),
                  (t = {
                    position: (a = getComputedStyle(e)).position,
                    top: a.top,
                    display: a.display,
                    marginTop: a.marginTop,
                    marginBottom: a.marginBottom,
                    marginLeft: a.marginLeft,
                    marginRight: a.marginRight,
                    cssFloat: a.cssFloat,
                  }),
                isNaN(parseFloat(t.top)) ||
                "table-cell" == t.display ||
                "none" == t.display ||
                ((this._active = !0),
                  (l = e.style.position),
                ("sticky" != a.position && "-webkit-sticky" != a.position) || (e.style.position = "static"),
                  (i = e.parentNode),
                  (o = d && i instanceof ShadowRoot ? i.host : i),
                  (n = e.getBoundingClientRect()),
                  (s = o.getBoundingClientRect()),
                  (a = getComputedStyle(o)),
                  (this._parent = {
                    node: o,
                    styles: {
                      position: o.style.position,
                    },
                    offsetHeight: o.offsetHeight,
                  }),
                  (this._offsetToWindow = {
                    left: n.left,
                    right: h.documentElement.clientWidth - n.right,
                  }),
                  (this._offsetToParent = {
                    top: n.top - s.top - g(a.borderTopWidth),
                    left: n.left - s.left - g(a.borderLeftWidth),
                    right: -n.right + s.right - g(a.borderRightWidth),
                  }),
                  (this._styles = {
                    position: l,
                    top: e.style.top,
                    bottom: e.style.bottom,
                    left: e.style.left,
                    right: e.style.right,
                    width: e.style.width,
                    marginTop: e.style.marginTop,
                    marginLeft: e.style.marginLeft,
                    marginRight: e.style.marginRight,
                  }),
                  (l = g(t.top)),
                  (this._limits = {
                    start: n.top + r.pageYOffset - l,
                    end: s.top + r.pageYOffset + o.offsetHeight - g(a.borderBottomWidth) - e.offsetHeight - l - g(t.marginBottom),
                  }),
                "absolute" != (a = a.position) && "relative" != a && (o.style.position = "relative"),
                  this._recalcPosition(),
                  ((o = this._clone = {}).node = h.createElement("div")),
                  u(o.node.style, {
                    width: n.right - n.left + "px",
                    height: n.bottom - n.top + "px",
                    marginTop: t.marginTop,
                    marginBottom: t.marginBottom,
                    marginLeft: t.marginLeft,
                    marginRight: t.marginRight,
                    cssFloat: t.cssFloat,
                    padding: 0,
                    border: 0,
                    borderSpacing: 0,
                    fontSize: "1em",
                    position: "static",
                  }),
                  i.insertBefore(o.node, e),
                  (o.docOffsetTop = v(o.node))));
              },
            },
            {
              key: "_recalcPosition",
              value: function () {
                if (this._active && !this._removed) {
                  var e = a.top <= this._limits.start ? "start" : a.top >= this._limits.end ? "end" : "middle";
                  if (this._stickyMode != e) {
                    switch (e) {
                      case "start":
                        u(this._node.style, {
                          position: "absolute",
                          left: this._offsetToParent.left + "px",
                          right: this._offsetToParent.right + "px",
                          top: this._offsetToParent.top + "px",
                          bottom: "auto",
                          width: "auto",
                          marginLeft: 0,
                          marginRight: 0,
                          marginTop: 0,
                        });
                        break;
                      case "middle":
                        u(this._node.style, {
                          position: "fixed",
                          left: this._offsetToWindow.left + "px",
                          right: this._offsetToWindow.right + "px",
                          top: this._styles.top,
                          bottom: "auto",
                          width: "auto",
                          marginLeft: 0,
                          marginRight: 0,
                          marginTop: 0,
                        });
                        break;
                      case "end":
                        u(this._node.style, {
                          position: "absolute",
                          left: this._offsetToParent.left + "px",
                          right: this._offsetToParent.right + "px",
                          top: "auto",
                          bottom: 0,
                          width: "auto",
                          marginLeft: 0,
                          marginRight: 0,
                        });
                    }
                    this._stickyMode = e;
                  }
                }
              },
            },
            {
              key: "_fastCheck",
              value: function () {
                this._active && !this._removed && (1 < Math.abs(v(this._clone.node) - this._clone.docOffsetTop) || 1 < Math.abs(this._parent.node.offsetHeight - this._parent.offsetHeight)) && this.refresh();
              },
            },
            {
              key: "_deactivate",
              value: function () {
                var t = this;
                this._active &&
                !this._removed &&
                (this._clone.node.parentNode.removeChild(this._clone.node),
                  delete this._clone,
                  u(this._node.style, this._styles),
                  delete this._styles,
                o.some(function (e) {
                  return e !== t && e._parent && e._parent.node === t._parent.node;
                }) || u(this._parent.node.style, this._parent.styles),
                  delete this._parent,
                  (this._stickyMode = null),
                  (this._active = !1),
                  delete this._offsetToWindow,
                  delete this._offsetToParent,
                  delete this._limits);
              },
            },
            {
              key: "remove",
              value: function () {
                var i = this;
                this._deactivate(),
                  o.some(function (e, t) {
                    if (e._node === i._node) return o.splice(t, 1), !0;
                  }),
                  (this._removed = !0);
              },
            },
          ]),
            f);
        function f(t) {
          if (
            (!(function (e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            })(this, f),
              !(t instanceof HTMLElement))
          )
            throw new Error("First argument must be HTMLElement");
          if (
            o.some(function (e) {
              return e._node === t;
            })
          )
            throw new Error("Stickyfill is already applied to this node");
          (this._node = t), (this._stickyMode = null), (this._active = !1), o.push(this), this.refresh();
        }
        var p = {
          stickies: o,
          Sticky: s,
          forceSticky: function () {
            (c = !1), m(), this.refreshAll();
          },
          addOne: function (e) {
            if (!(e instanceof HTMLElement)) {
              if (!e.length || !e[0]) return;
              e = e[0];
            }
            for (var t = 0; t < o.length; t++) if (o[t]._node === e) return o[t];
            return new s(e);
          },
          add: function (i) {
            if ((i = i instanceof HTMLElement ? [i] : i).length) {
              for (var n = [], e = 0; e < i.length; e++)
                (function (e) {
                  var t = i[e];
                  t instanceof HTMLElement
                    ? o.some(function (e) {
                    if (e._node === t) return n.push(e), !0;
                  }) || n.push(new s(t))
                    : n.push(void 0);
                })(e);
              return n;
            }
          },
          refreshAll: function () {
            o.forEach(function (e) {
              return e.refresh();
            });
          },
          removeOne: function (t) {
            if (!(t instanceof HTMLElement)) {
              if (!t.length || !t[0]) return;
              t = t[0];
            }
            o.some(function (e) {
              if (e._node === t) return e.remove(), !0;
            });
          },
          remove: function (i) {
            if ((i = i instanceof HTMLElement ? [i] : i).length)
              for (var e = 0; e < i.length; e++)
                !(function (e) {
                  var t = i[e];
                  o.some(function (e) {
                    if (e._node === t) return e.remove(), !0;
                  });
                })(e);
          },
          removeAll: function () {
            for (; o.length; ) o[0].remove();
          },
        };
        function m() {
          var e, t, i;
          function n() {
            r.pageXOffset != a.left
              ? ((a.top = r.pageYOffset), (a.left = r.pageXOffset), p.refreshAll())
              : r.pageYOffset != a.top &&
              ((a.top = r.pageYOffset),
                (a.left = r.pageXOffset),
                o.forEach(function (e) {
                  return e._recalcPosition();
                }));
          }
          function s() {
            e = setInterval(function () {
              o.forEach(function (e) {
                return e._fastCheck();
              });
            }, 500);
          }
          l ||
          ((l = !0),
            n(),
            r.addEventListener("scroll", n),
            r.addEventListener("resize", p.refreshAll),
            r.addEventListener("orientationchange", p.refreshAll),
            (i = t = e = void 0),
            "hidden" in h ? ((t = "hidden"), (i = "visibilitychange")) : "webkitHidden" in h && ((t = "webkitHidden"), (i = "webkitvisibilitychange")),
            i
              ? (h[t] || s(),
                h.addEventListener(i, function () {
                  h[t] ? clearInterval(e) : s();
                }))
              : s());
        }
        c || m(), b.exports ? (b.exports = p) : i && (r.Stickyfill = p);
      })(window, document);
    }),
    Y = c(function (e, t) {
      function i(e, t) {
        t = t || {
          bubbles: !1,
          cancelable: !1,
          detail: void 0,
        };
        var i = document.createEvent("CustomEvent");
        return i.initCustomEvent(e, t.bubbles, t.cancelable, t.detail), i;
      }
      var n, c, d, u, s, g, v, l, f, a, p, m;
      Element.prototype.closest ||
      (Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector),
        (Element.prototype.closest = function (e) {
          var t = this;
          if (!document.documentElement.contains(this)) return null;
          do {
            if (t.matches(e)) return t;
          } while (null !== (t = t.parentElement));
          return null;
        })),
      "function" != typeof window.CustomEvent && ((i.prototype = window.Event.prototype), (window.CustomEvent = i)),
        (n = 0 ? window : h),
        (e.exports =
          ((c = n),
            (d = {
              navClass: "active",
              contentClass: "active",
              nested: !1,
              nestedClass: "active",
              offset: 0,
              reflow: !1,
              events: !0,
            }),
            (u = function (e, t, i) {
              i.settings.events &&
              ((i = new CustomEvent(e, {
                bubbles: !0,
                cancelable: !0,
                detail: i,
              })),
                t.dispatchEvent(i));
            }),
            (s = function (e) {
              var t = 0;
              if (e.offsetParent) for (; e; ) (t += e.offsetTop), (e = e.offsetParent);
              return 0 <= t ? t : 0;
            }),
            (g = function (e) {
              e &&
              e.sort(function (e, t) {
                return s(e.content) < s(t.content) ? -1 : 1;
              });
            }),
            (v = function (e, t, i) {
              (e = e.getBoundingClientRect()), (t = "function" == typeof (t = t).offset ? parseFloat(t.offset()) : parseFloat(t.offset));
              return i ? parseInt(e.bottom, 10) < (c.innerHeight || document.documentElement.clientHeight) : parseInt(e.top, 10) <= t;
            }),
            (l = function () {
              return (
                c.innerHeight + c.pageYOffset >=
                Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight)
              );
            }),
            (f = function (e, t) {
              return !(!l() || !v(e.content, t, !0));
            }),
            (a = function e(t, i) {
              i.nested && t.parentNode && (t = t.parentNode.closest("li")) && (t.classList.remove(i.nestedClass), e(t, i));
            }),
            (p = function (e, t) {
              var i;
              !e ||
              ((i = e.nav.closest("li")) &&
                (i.classList.remove(t.navClass),
                  e.content.classList.remove(t.contentClass),
                  a(i, t),
                  u("gumshoeDeactivate", i, {
                    link: e.nav,
                    content: e.content,
                    settings: t,
                  })));
            }),
            (m = function e(t, i) {
              !i.nested || ((t = t.parentNode.closest("li")) && (t.classList.add(i.nestedClass), e(t, i)));
            }),
            function (e, t) {
              var i,
                s,
                l,
                n,
                a,
                o = {
                  setup: function () {
                    (i = document.querySelectorAll(e)),
                      (s = []),
                      Array.prototype.forEach.call(i, function (e) {
                        var t = document.getElementById(decodeURIComponent(e.hash.substr(1)));
                        t &&
                        s.push({
                          nav: e,
                          content: t,
                        });
                      }),
                      g(s);
                  },
                };
              o.detect = function () {
                var e,
                  t,
                  i,
                  n = (function (e, t) {
                    var i = e[e.length - 1];
                    if (f(i, t)) return i;
                    for (var n = e.length - 1; 0 <= n; n--) if (v(e[n].content, t)) return e[n];
                  })(s, a);
                n
                  ? (l && n.content === l.content) ||
                  (p(l, a),
                    (t = a),
                  !(e = n) ||
                  ((i = e.nav.closest("li")) &&
                    (i.classList.add(t.navClass),
                      e.content.classList.add(t.contentClass),
                      m(i, t),
                      u("gumshoeActivate", i, {
                        link: e.nav,
                        content: e.content,
                        settings: t,
                      }))),
                    (l = n))
                  : l && (p(l, a), (l = null));
              };
              function r(e) {
                n && c.cancelAnimationFrame(n), (n = c.requestAnimationFrame(o.detect));
              }
              function h(e) {
                n && c.cancelAnimationFrame(n),
                  (n = c.requestAnimationFrame(function () {
                    g(s), o.detect();
                  }));
              }
              o.destroy = function () {
                l && p(l, a), c.removeEventListener("scroll", r, !1), a.reflow && c.removeEventListener("resize", h, !1), (a = n = l = i = s = null);
              };
              return (
                (a = (function () {
                  var i = {};
                  return (
                    Array.prototype.forEach.call(arguments, function (e) {
                      for (var t in e) {
                        if (!e.hasOwnProperty(t)) return;
                        i[t] = e[t];
                      }
                    }),
                      i
                  );
                })(d, t || {})),
                  o.setup(),
                  o.detect(),
                  c.addEventListener("scroll", r, !1),
                a.reflow && c.addEventListener("resize", h, !1),
                  o
              );
            }));
    }),
    U = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.stickySelector,
          s = void 0 === n ? "[data-ecl-inpage-navigation]" : n,
          l = i.containerSelector,
          a = void 0 === l ? "[data-ecl-inpage-navigation-container]" : l,
          o = i.inPageList,
          r = void 0 === o ? "[data-ecl-inpage-navigation-list]" : o,
          h = i.spySelector,
          c = void 0 === h ? "[data-ecl-inpage-navigation-link]" : h,
          d = i.toggleSelector,
          u = void 0 === d ? "[data-ecl-inpage-navigation-trigger]" : d,
          t = i.linksSelector,
          n = void 0 === t ? "[data-ecl-inpage-navigation-link]" : t,
          l = i.spyActiveContainer,
          o = void 0 === l ? "ecl-inpage-navigation--visible" : l,
          h = i.spyOffset,
          d = void 0 === h ? 20 : h,
          t = i.spyClass,
          l = void 0 === t ? "ecl-inpage-navigation__item--active" : t,
          h = i.spyTrigger,
          t = void 0 === h ? "[data-ecl-inpage-navigation-trigger-current]" : h,
          h = i.attachClickListener,
          h = void 0 === h || h,
          i = i.contentClass,
          i = void 0 === i ? "ecl-inpage-navigation__heading--active" : i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.attachClickListener = h),
          (this.stickySelector = s),
          (this.containerSelector = a),
          (this.toggleSelector = u),
          (this.linksSelector = n),
          (this.inPageList = r),
          (this.spyActiveContainer = o),
          (this.spySelector = c),
          (this.spyOffset = d),
          (this.spyClass = l),
          (this.spyTrigger = t),
          (this.contentClass = i),
          (this.gumshoe = null),
          (this.observer = null),
          (this.stickyObserver = null),
          (this.handleClickOnToggler = this.handleClickOnToggler.bind(this)),
          (this.handleClickOnLink = this.handleClickOnLink.bind(this)),
          (this.initScrollSpy = this.initScrollSpy.bind(this)),
          (this.initObserver = this.initObserver.bind(this)),
          (this.activateScrollSpy = this.activateScrollSpy.bind(this)),
          (this.deactivateScrollSpy = this.deactivateScrollSpy.bind(this)),
          (this.destroySticky = this.destroySticky.bind(this)),
          (this.destroyScrollSpy = this.destroyScrollSpy.bind(this)),
          (this.destroyObserver = this.destroyObserver.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).INPAGE_NAVIGATION), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLInpageNavigation = t);
      };
      var e = i.prototype;
      return (
        (e.initSticky = function () {
          this.stickyInstance = new j.Sticky(this.element);
        }),
          (e.destroySticky = function () {
            this.stickyInstance && this.stickyInstance.remove();
          }),
          (e.initScrollSpy = function () {
            var e,
              n,
              s,
              l,
              a = this;
            (this.gumshoe = new Y(this.spySelector, {
              navClass: this.spyClass,
              contentClass: this.contentClass,
              offset: this.spyOffset,
              reflow: !0,
            })),
              document.addEventListener("gumshoeActivate", this.activateScrollSpy, !1),
              document.addEventListener("gumshoeDeactivate", this.deactivateScrollSpy, !1),
            "IntersectionObserver" in window &&
            (e = r(this.containerSelector)) &&
            ((s = n = 0),
              (l = !1),
              (this.stickyObserver = new IntersectionObserver(
                function (e) {
                  if (e && e[0]) {
                    var t = e[0],
                      i = t.boundingClientRect.y,
                      e = t.intersectionRatio,
                      t = t.isIntersecting;
                    if (!l) return (l = !0), (n = i), void (s = e);
                    i < n ? (s < e && t) || a.element.classList.remove(a.spyActiveContainer) : n < i && t && s < e && a.element.classList.add(a.spyActiveContainer), (n = i), (s = e);
                  }
                },
                {
                  root: null,
                }
              )),
              this.stickyObserver.observe(e));
          }),
          (e.activateScrollSpy = function (e) {
            var t = r(this.spyTrigger);
            this.element.classList.add(this.spyActiveContainer), (t.textContent = e.detail.content.textContent);
          }),
          (e.deactivateScrollSpy = function () {
            var e = r(this.spyTrigger);
            this.element.classList.remove(this.spyActiveContainer), (e.innerHTML = "");
          }),
          (e.destroyScrollSpy = function () {
            this.stickyObserver && this.stickyObserver.disconnect(),
              document.removeEventListener("gumshoeActivate", this.activateScrollSpy, !1),
              document.removeEventListener("gumshoeDeactivate", this.deactivateScrollSpy, !1),
              this.gumshoe.destroy();
          }),
          (e.initObserver = function () {
            var t;
            "MutationObserver" in window &&
            (((t = this).observer = new MutationObserver(function (e) {
              var n = r(".ecl-col-l-9"),
                s = r("[data-ecl-inpage-navigation-list]");
              e.forEach(function (e) {
                e &&
                e.target &&
                e.target.classList &&
                !e.target.classList.contains("ecl-inpage-navigation__trigger-current") &&
                (0 < e.addedNodes.length &&
                [].slice.call(e.addedNodes).forEach(function (t) {
                  var e, i;
                  "H2" === t.tagName &&
                  t.id &&
                  ((e = o("h2[id]", n).findIndex(function (e) {
                    return e.id === t.id;
                  })),
                    ((i = s.childNodes[e - 1].cloneNode(!0)).childNodes[0].textContent = t.textContent),
                    (i.childNodes[0].href = "#" + t.id),
                    s.childNodes[e - 1].after(i));
                }),
                0 < e.removedNodes.length &&
                [].slice.call(e.removedNodes).forEach(function (t) {
                  "H2" === t.tagName &&
                  t.id &&
                  s.childNodes.forEach(function (e) {
                    -1 !== e.childNodes[0].href.indexOf(t.id) && e.remove();
                  });
                }),
                  t.update());
              });
            })),
              this.observer.observe(document, {
                subtree: !0,
                childList: !0,
              }));
          }),
          (e.destroyObserver = function () {
            this.observer && this.observer.disconnect();
          }),
          (e.init = function () {
            var t = this,
              e = r(this.toggleSelector, this.element),
              i = o(this.linksSelector, this.element);
            this.initSticky(this.element),
              this.initScrollSpy(),
              this.initObserver(),
            this.attachClickListener && e && e.addEventListener("click", this.handleClickOnToggler),
            this.attachClickListener &&
            i &&
            (i.forEach(function (e) {
              return e.addEventListener("click", t.handleClickOnLink);
            }),
              e.addEventListener("click", this.handleClickOnToggler));
          }),
          (e.update = function () {
            this.gumshoe.setup();
          }),
          (e.handleClickOnToggler = function (e) {
            var t = r(this.inPageList, this.element),
              i = r(this.toggleSelector, this.element);
            e.preventDefault();
            e = "true" === i.getAttribute("aria-expanded");
            i.setAttribute("aria-expanded", e ? "false" : "true"), e ? t.classList.remove("ecl-inpage-navigation__list--visible") : t.classList.add("ecl-inpage-navigation__list--visible");
          }),
          (e.handleClickOnLink = function () {
            var e = r(this.inPageList, this.element),
              t = r(this.toggleSelector, this.element);
            e.classList.remove("ecl-inpage-navigation__list--visible"), t.setAttribute("aria-expanded", "false");
          }),
          (e.destroy = function () {
            var t = this;
            this.attachClickListener && this.toggleElement && this.toggleElement.removeEventListener("click", this.handleClickOnToggler),
            this.attachClickListener &&
            this.navLinks &&
            this.navLinks.forEach(function (e) {
              return e.removeEventListener("click", t.handleClickOnLink);
            }),
              this.destroyScrollSpy(),
              this.destroySticky(),
              this.destroyObserver();
          }),
          i
      );
    })(),
    G = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          t = i.closeSelector,
          t = void 0 === t ? "[data-ecl-message-close]" : t,
          i = i.attachClickListener,
          i = void 0 === i || i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e), (this.closeSelector = t), (this.attachClickListener = i), (this.close = null), (this.handleClickOnClose = this.handleClickOnClose.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).MESSAGE), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLMessage = t);
      };
      var e = i.prototype;
      return (
        (e.init = function () {
          (this.close = r(this.closeSelector, this.element)), this.attachClickListener && this.close && this.close.addEventListener("click", this.handleClickOnClose);
        }),
          (e.destroy = function () {
            this.attachClickListener && this.close && this.close.removeEventListener("click", this.handleClickOnClose);
          }),
          (e.handleClickOnClose = function () {
            return this.element.parentNode && this.element.parentNode.removeChild(this.element), this;
          }),
          i
      );
    })(),
    X = c(function (e) {
      function n(e) {
        if (s[e]) return s[e].exports;
        var t = (s[e] = {
          i: e,
          l: !1,
          exports: {},
        });
        return i[e].call(t.exports, t, t.exports, n), (t.l = !0), t.exports;
      }
      var i, s;
      e.exports =
        ((s = {}),
          (n.m = i = [
            function (e, t, i) {
              e.exports = {
                BROWSER_TYPES: {
                  CHROME: "Chrome",
                  FIREFOX: "Firefox",
                  OPERA: "Opera",
                  YANDEX: "Yandex",
                  SAFARI: "Safari",
                  INTERNET_EXPLORER: "Internet Explorer",
                  EDGE: "Edge",
                  CHROMIUM: "Chromium",
                  IE: "IE",
                  MOBILE_SAFARI: "Mobile Safari",
                  EDGE_CHROMIUM: "Edge Chromium",
                },
                DEVICE_TYPES: {
                  MOBILE: "mobile",
                  TABLET: "tablet",
                  SMART_TV: "smarttv",
                  CONSOLE: "console",
                  WEARABLE: "wearable",
                  BROWSER: void 0,
                },
                OS_TYPES: {
                  IOS: "iOS",
                  ANDROID: "Android",
                  WINDOWS_PHONE: "Windows Phone",
                  WINDOWS: "Windows",
                  MAC_OS: "Mac OS",
                },
                defaultData: {
                  isMobile: !1,
                  isTablet: !1,
                  isBrowser: !1,
                  isSmartTV: !1,
                  isConsole: !1,
                  isWearable: !1,
                },
              };
            },
            function (e, t, i) {
              function n() {
                return C.name === h.WINDOWS && "10" === C.version && "string" == typeof L && -1 !== L.indexOf("Edg/");
              }
              function s() {
                return k.name === M;
              }
              function l() {
                return y("iPad");
              }
              var a = i(2),
                o = i(0),
                r = o.BROWSER_TYPES,
                h = o.OS_TYPES,
                c = o.DEVICE_TYPES,
                d = i(4),
                u = d.checkType,
                g = d.broPayload,
                v = d.mobilePayload,
                f = d.wearPayload,
                p = d.consolePayload,
                m = d.stvPayload,
                b = d.getNavigatorInstance,
                y = d.isIOS13Check,
                E = new a(),
                k = E.getBrowser(),
                w = E.getDevice(),
                S = E.getEngine(),
                C = E.getOS(),
                L = E.getUA(),
                x = r.CHROME,
                T = r.CHROMIUM,
                O = r.IE,
                _ = r.INTERNET_EXPLORER,
                A = r.OPERA,
                I = r.FIREFOX,
                D = r.SAFARI,
                M = r.EDGE,
                N = r.YANDEX,
                B = r.MOBILE_SAFARI,
                R = c.MOBILE,
                P = c.TABLET,
                F = c.SMART_TV,
                z = c.BROWSER,
                H = c.WEARABLE,
                V = c.CONSOLE,
                W = h.ANDROID,
                j = h.WINDOWS_PHONE,
                Y = h.IOS,
                U = h.WINDOWS,
                G = h.MAC_OS,
                X = w.type === F,
                q = w.type === V,
                K = w.type === H,
                $ = k.name === B || l(),
                Q = k.name === T,
                Z =
                  (function () {
                    switch (w.type) {
                      case R:
                      case P:
                        return !0;
                      default:
                        return !1;
                    }
                  })() || l(),
                J = w.type === R,
                ee = w.type === P || l(),
                te = w.type === z,
                ie = C.name === W,
                ne = C.name === j,
                se = C.name === Y || l(),
                le = k.name === x,
                o = k.name === I,
                i = k.name === D || k.name === B,
                d = k.name === A,
                a = k.name === _ || k.name === O,
                E = C.version || "none",
                r = C.name || "none",
                c = k.major,
                F = k.version,
                V = k.name,
                H = w.vendor || "none",
                T = w.model || "none",
                z = S.name,
                W = S.version,
                j = L,
                Y = s() || n(),
                x = k.name === N,
                I = w.type,
                B = (D = b()) && (/iPad|iPhone|iPod/.test(D.platform) || ("MacIntel" === D.platform && 1 < D.maxTouchPoints)) && !window.MSStream,
                A = l(),
                _ = y("iPhone"),
                O = y("iPod"),
                D = "string" == typeof (N = (N = b()) && N.userAgent.toLowerCase()) && /electron/.test(N),
                b = n(),
                N = s(),
                U = C.name === U,
                G = C.name === G,
                ae = u(w.type);
              e.exports = {
                deviceDetect: function () {
                  var e = ae.isBrowser,
                    t = ae.isMobile,
                    i = ae.isTablet,
                    n = ae.isSmartTV,
                    s = ae.isConsole,
                    l = ae.isWearable;
                  return e ? g(e, k, S, C, L) : n ? m(n, S, C, L) : s ? p(s, S, C, L) : t || i ? v(ae, w, C, L) : l ? f(l, S, C, L) : void 0;
                },
                isSmartTV: X,
                isConsole: q,
                isWearable: K,
                isMobileSafari: $,
                isChromium: Q,
                isMobile: Z,
                isMobileOnly: J,
                isTablet: ee,
                isBrowser: te,
                isAndroid: ie,
                isWinPhone: ne,
                isIOS: se,
                isChrome: le,
                isFirefox: o,
                isSafari: i,
                isOpera: d,
                isIE: a,
                osVersion: E,
                osName: r,
                fullBrowserVersion: c,
                browserVersion: F,
                browserName: V,
                mobileVendor: H,
                mobileModel: T,
                engineName: z,
                engineVersion: W,
                getUA: j,
                isEdge: Y,
                isYandex: x,
                deviceType: I,
                isIOS13: B,
                isIPad13: A,
                isIPhone13: _,
                isIPod13: O,
                isElectron: D,
                isEdgeChromium: b,
                isLegacyEdge: N,
                isWindows: U,
                isMacOs: G,
              };
            },
            function (w, S, C) {
              var L;
              !(function (s, d) {
                function l(e, t) {
                  if (("object" == typeof e && ((t = e), (e = d)), !(this instanceof l))) return new l(e, t).getResult();
                  var i = e || (s && s.navigator && s.navigator.userAgent ? s.navigator.userAgent : ""),
                    n = t ? p.extend(y, t) : y;
                  return (
                    (this.getBrowser = function () {
                      var e = {
                        name: d,
                        version: d,
                      };
                      return m.rgx.call(e, i, n.browser), (e.major = p.major(e.version)), e;
                    }),
                      (this.getCPU = function () {
                        var e = {
                          architecture: d,
                        };
                        return m.rgx.call(e, i, n.cpu), e;
                      }),
                      (this.getDevice = function () {
                        var e = {
                          vendor: d,
                          model: d,
                          type: d,
                        };
                        return m.rgx.call(e, i, n.device), e;
                      }),
                      (this.getEngine = function () {
                        var e = {
                          name: d,
                          version: d,
                        };
                        return m.rgx.call(e, i, n.engine), e;
                      }),
                      (this.getOS = function () {
                        var e = {
                          name: d,
                          version: d,
                        };
                        return m.rgx.call(e, i, n.os), e;
                      }),
                      (this.getResult = function () {
                        return {
                          ua: this.getUA(),
                          browser: this.getBrowser(),
                          engine: this.getEngine(),
                          os: this.getOS(),
                          device: this.getDevice(),
                          cpu: this.getCPU(),
                        };
                      }),
                      (this.getUA = function () {
                        return i;
                      }),
                      (this.setUA = function (e) {
                        return (i = e), this;
                      }),
                      this
                  );
                }
                var u = "function",
                  e = "undefined",
                  t = "model",
                  i = "name",
                  n = "type",
                  a = "vendor",
                  o = "version",
                  r = "architecture",
                  h = "console",
                  c = "mobile",
                  g = "tablet",
                  v = "smarttv",
                  f = "wearable",
                  p = {
                    extend: function (e, t) {
                      var i,
                        n = {};
                      for (i in e) t[i] && t[i].length % 2 == 0 ? (n[i] = t[i].concat(e[i])) : (n[i] = e[i]);
                      return n;
                    },
                    has: function (e, t) {
                      return "string" == typeof e && -1 !== t.toLowerCase().indexOf(e.toLowerCase());
                    },
                    lowerize: function (e) {
                      return e.toLowerCase();
                    },
                    major: function (e) {
                      return "string" == typeof e ? e.replace(/[^\d\.]/g, "").split(".")[0] : d;
                    },
                    trim: function (e) {
                      return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
                    },
                  },
                  m = {
                    rgx: function (e, t) {
                      for (var i, n, s, l, a, o = 0; o < t.length && !l; ) {
                        for (var r = t[o], h = t[o + 1], c = (i = 0); c < r.length && !l; )
                          if ((l = r[c++].exec(e)))
                            for (n = 0; n < h.length; n++)
                              (a = l[++i]),
                                "object" == typeof (s = h[n]) && 0 < s.length
                                  ? 2 == s.length
                                    ? typeof s[1] == u
                                      ? (this[s[0]] = s[1].call(this, a))
                                      : (this[s[0]] = s[1])
                                    : 3 == s.length
                                      ? typeof s[1] != u || (s[1].exec && s[1].test)
                                        ? (this[s[0]] = a ? a.replace(s[1], s[2]) : d)
                                        : (this[s[0]] = a ? s[1].call(this, a, s[2]) : d)
                                      : 4 == s.length && (this[s[0]] = a ? s[3].call(this, a.replace(s[1], s[2])) : d)
                                  : (this[s] = a || d);
                        o += 2;
                      }
                    },
                    str: function (e, t) {
                      for (var i in t)
                        if ("object" == typeof t[i] && 0 < t[i].length) {
                          for (var n = 0; n < t[i].length; n++) if (p.has(t[i][n], e)) return "?" === i ? d : i;
                        } else if (p.has(t[i], e)) return "?" === i ? d : i;
                      return e;
                    },
                  },
                  b = {
                    browser: {
                      oldsafari: {
                        version: {
                          "1.0": "/8",
                          1.2: "/1",
                          1.3: "/3",
                          "2.0": "/412",
                          "2.0.2": "/416",
                          "2.0.3": "/417",
                          "2.0.4": "/419",
                          "?": "/",
                        },
                      },
                    },
                    device: {
                      amazon: {
                        model: {
                          "Fire Phone": ["SD", "KF"],
                        },
                      },
                      sprint: {
                        model: {
                          "Evo Shift 4G": "7373KT",
                        },
                        vendor: {
                          HTC: "APA",
                          Sprint: "Sprint",
                        },
                      },
                    },
                    os: {
                      windows: {
                        version: {
                          ME: "4.90",
                          "NT 3.11": "NT3.51",
                          "NT 4.0": "NT4.0",
                          2e3: "NT 5.0",
                          XP: ["NT 5.1", "NT 5.2"],
                          Vista: "NT 6.0",
                          7: "NT 6.1",
                          8: "NT 6.2",
                          8.1: "NT 6.3",
                          10: ["NT 6.4", "NT 10.0"],
                          RT: "ARM",
                        },
                      },
                    },
                  },
                  y = {
                    browser: [
                      [/(opera\smini)\/([\w\.-]+)/i, /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i, /(opera).+version\/([\w\.]+)/i, /(opera)[\/\s]+([\w\.]+)/i],
                      [i, o],
                      [/(opios)[\/\s]+([\w\.]+)/i],
                      [[i, "Opera Mini"], o],
                      [/\s(opr)\/([\w\.]+)/i],
                      [[i, "Opera"], o],
                      [
                        /(kindle)\/([\w\.]+)/i,
                        /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,
                        /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,
                        /(?:ms|\()(ie)\s([\w\.]+)/i,
                        /(rekonq)\/([\w\.]*)/i,
                        /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark)\/([\w\.-]+)/i,
                      ],
                      [i, o],
                      [/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],
                      [[i, "IE"], o],
                      [/(edge|edgios|edgea)\/((\d+)?[\w\.]+)/i],
                      [[i, "Edge"], o],
                      [/(yabrowser)\/([\w\.]+)/i],
                      [[i, "Yandex"], o],
                      [/(puffin)\/([\w\.]+)/i],
                      [[i, "Puffin"], o],
                      [/((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i],
                      [[i, "UCBrowser"], o],
                      [/(comodo_dragon)\/([\w\.]+)/i],
                      [[i, /_/g, " "], o],
                      [/(micromessenger)\/([\w\.]+)/i],
                      [[i, "WeChat"], o],
                      [/(qqbrowserlite)\/([\w\.]+)/i],
                      [i, o],
                      [/(QQ)\/([\d\.]+)/i],
                      [i, o],
                      [/m?(qqbrowser)[\/\s]?([\w\.]+)/i],
                      [i, o],
                      [/(BIDUBrowser)[\/\s]?([\w\.]+)/i],
                      [i, o],
                      [/(2345Explorer)[\/\s]?([\w\.]+)/i],
                      [i, o],
                      [/(MetaSr)[\/\s]?([\w\.]+)/i],
                      [i],
                      [/(LBBROWSER)/i],
                      [i],
                      [/xiaomi\/miuibrowser\/([\w\.]+)/i],
                      [o, [i, "MIUI Browser"]],
                      [/;fbav\/([\w\.]+);/i],
                      [o, [i, "Facebook"]],
                      [/headlesschrome(?:\/([\w\.]+)|\s)/i],
                      [o, [i, "Chrome Headless"]],
                      [/\swv\).+(chrome)\/([\w\.]+)/i],
                      [[i, /(.+)/, "$1 WebView"], o],
                      [/((?:oculus|samsung)browser)\/([\w\.]+)/i],
                      [[i, /(.+(?:g|us))(.+)/, "$1 $2"], o],
                      [/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i],
                      [o, [i, "Android Browser"]],
                      [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i],
                      [i, o],
                      [/(dolfin)\/([\w\.]+)/i],
                      [[i, "Dolphin"], o],
                      [/((?:android.+)crmo|crios)\/([\w\.]+)/i],
                      [[i, "Chrome"], o],
                      [/(coast)\/([\w\.]+)/i],
                      [[i, "Opera Coast"], o],
                      [/fxios\/([\w\.-]+)/i],
                      [o, [i, "Firefox"]],
                      [/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],
                      [o, [i, "Mobile Safari"]],
                      [/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],
                      [o, i],
                      [/webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i],
                      [[i, "GSA"], o],
                      [/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],
                      [i, [o, m.str, b.browser.oldsafari.version]],
                      [/(konqueror)\/([\w\.]+)/i, /(webkit|khtml)\/([\w\.]+)/i],
                      [i, o],
                      [/(navigator|netscape)\/([\w\.-]+)/i],
                      [[i, "Netscape"], o],
                      [
                        /(swiftfox)/i,
                        /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
                        /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,
                        /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,
                        /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
                        /(links)\s\(([\w\.]+)/i,
                        /(gobrowser)\/?([\w\.]*)/i,
                        /(ice\s?browser)\/v?([\w\._]+)/i,
                        /(mosaic)[\/\s]([\w\.]+)/i,
                      ],
                      [i, o],
                    ],
                    cpu: [
                      [/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],
                      [[r, "amd64"]],
                      [/(ia32(?=;))/i],
                      [[r, p.lowerize]],
                      [/((?:i[346]|x)86)[;\)]/i],
                      [[r, "ia32"]],
                      [/windows\s(ce|mobile);\sppc;/i],
                      [[r, "arm"]],
                      [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],
                      [[r, /ower/, "", p.lowerize]],
                      [/(sun4\w)[;\)]/i],
                      [[r, "sparc"]],
                      [/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],
                      [[r, p.lowerize]],
                    ],
                    device: [
                      [/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i],
                      [t, a, [n, g]],
                      [/applecoremedia\/[\w\.]+ \((ipad)/],
                      [t, [a, "Apple"], [n, g]],
                      [/(apple\s{0,1}tv)/i],
                      [
                        [t, "Apple TV"],
                        [a, "Apple"],
                      ],
                      [/(archos)\s(gamepad2?)/i, /(hp).+(touchpad)/i, /(hp).+(tablet)/i, /(kindle)\/([\w\.]+)/i, /\s(nook)[\w\s]+build\/(\w+)/i, /(dell)\s(strea[kpr\s\d]*[\dko])/i],
                      [a, t, [n, g]],
                      [/(kf[A-z]+)\sbuild\/.+silk\//i],
                      [t, [a, "Amazon"], [n, g]],
                      [/(sd|kf)[0349hijorstuw]+\sbuild\/.+silk\//i],
                      [
                        [t, m.str, b.device.amazon.model],
                        [a, "Amazon"],
                        [n, c],
                      ],
                      [/\((ip[honed|\s\w*]+);.+(apple)/i],
                      [t, a, [n, c]],
                      [/\((ip[honed|\s\w*]+);/i],
                      [t, [a, "Apple"], [n, c]],
                      [/(blackberry)[\s-]?(\w+)/i, /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i, /(hp)\s([\w\s]+\w)/i, /(asus)-?(\w+)/i],
                      [a, t, [n, c]],
                      [/\(bb10;\s(\w+)/i],
                      [t, [a, "BlackBerry"], [n, c]],
                      [/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i],
                      [t, [a, "Asus"], [n, g]],
                      [/(sony)\s(tablet\s[ps])\sbuild\//i, /(sony)?(?:sgp.+)\sbuild\//i],
                      [
                        [a, "Sony"],
                        [t, "Xperia Tablet"],
                        [n, g],
                      ],
                      [/android.+\s([c-g]\d{4}|so[-l]\w+)\sbuild\//i],
                      [t, [a, "Sony"], [n, c]],
                      [/\s(ouya)\s/i, /(nintendo)\s([wids3u]+)/i],
                      [a, t, [n, h]],
                      [/android.+;\s(shield)\sbuild/i],
                      [t, [a, "Nvidia"], [n, h]],
                      [/(playstation\s[34portablevi]+)/i],
                      [t, [a, "Sony"], [n, h]],
                      [/(sprint\s(\w+))/i],
                      [
                        [a, m.str, b.device.sprint.vendor],
                        [t, m.str, b.device.sprint.model],
                        [n, c],
                      ],
                      [/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i],
                      [a, t, [n, g]],
                      [/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i, /(zte)-(\w*)/i, /(alcatel|geeksphone|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i],
                      [a, [t, /_/g, " "], [n, c]],
                      [/(nexus\s9)/i],
                      [t, [a, "HTC"], [n, g]],
                      [/d\/huawei([\w\s-]+)[;\)]/i, /(nexus\s6p)/i],
                      [t, [a, "Huawei"], [n, c]],
                      [/(microsoft);\s(lumia[\s\w]+)/i],
                      [a, t, [n, c]],
                      [/[\s\(;](xbox(?:\sone)?)[\s\);]/i],
                      [t, [a, "Microsoft"], [n, h]],
                      [/(kin\.[onetw]{3})/i],
                      [
                        [t, /\./g, " "],
                        [a, "Microsoft"],
                        [n, c],
                      ],
                      [/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i, /mot[\s-]?(\w*)/i, /(XT\d{3,4}) build\//i, /(nexus\s6)/i],
                      [t, [a, "Motorola"], [n, c]],
                      [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],
                      [t, [a, "Motorola"], [n, g]],
                      [/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i],
                      [
                        [a, p.trim],
                        [t, p.trim],
                        [n, v],
                      ],
                      [/hbbtv.+maple;(\d+)/i],
                      [
                        [t, /^/, "SmartTV"],
                        [a, "Samsung"],
                        [n, v],
                      ],
                      [/\(dtv[\);].+(aquos)/i],
                      [t, [a, "Sharp"], [n, v]],
                      [/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i, /((SM-T\w+))/i],
                      [[a, "Samsung"], t, [n, g]],
                      [/smart-tv.+(samsung)/i],
                      [a, [n, v], t],
                      [/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i, /(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i, /sec-((sgh\w+))/i],
                      [[a, "Samsung"], t, [n, c]],
                      [/sie-(\w*)/i],
                      [t, [a, "Siemens"], [n, c]],
                      [/(maemo|nokia).*(n900|lumia\s\d+)/i, /(nokia)[\s_-]?([\w-]*)/i],
                      [[a, "Nokia"], t, [n, c]],
                      [/android\s3\.[\s\w;-]{10}(a\d{3})/i],
                      [t, [a, "Acer"], [n, g]],
                      [/android.+([vl]k\-?\d{3})\s+build/i],
                      [t, [a, "LG"], [n, g]],
                      [/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],
                      [[a, "LG"], t, [n, g]],
                      [/(lg) netcast\.tv/i],
                      [a, t, [n, v]],
                      [/(nexus\s[45])/i, /lg[e;\s\/-]+(\w*)/i, /android.+lg(\-?[\d\w]+)\s+build/i],
                      [t, [a, "LG"], [n, c]],
                      [/android.+(ideatab[a-z0-9\-\s]+)/i],
                      [t, [a, "Lenovo"], [n, g]],
                      [/linux;.+((jolla));/i],
                      [a, t, [n, c]],
                      [/((pebble))app\/[\d\.]+\s/i],
                      [a, t, [n, f]],
                      [/android.+;\s(oppo)\s?([\w\s]+)\sbuild/i],
                      [a, t, [n, c]],
                      [/crkey/i],
                      [
                        [t, "Chromecast"],
                        [a, "Google"],
                      ],
                      [/android.+;\s(glass)\s\d/i],
                      [t, [a, "Google"], [n, f]],
                      [/android.+;\s(pixel c)\s/i],
                      [t, [a, "Google"], [n, g]],
                      [/android.+;\s(pixel xl|pixel)\s/i],
                      [t, [a, "Google"], [n, c]],
                      [
                        /android.+;\s(\w+)\s+build\/hm\1/i,
                        /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,
                        /android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i,
                        /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+))\s+build/i,
                      ],
                      [
                        [t, /_/g, " "],
                        [a, "Xiaomi"],
                        [n, c],
                      ],
                      [/android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+))\s+build/i],
                      [
                        [t, /_/g, " "],
                        [a, "Xiaomi"],
                        [n, g],
                      ],
                      [/android.+;\s(m[1-5]\snote)\sbuild/i],
                      [t, [a, "Meizu"], [n, g]],
                      [/android.+a000(1)\s+build/i, /android.+oneplus\s(a\d{4})\s+build/i],
                      [t, [a, "OnePlus"], [n, c]],
                      [/android.+[;\/]\s*(RCT[\d\w]+)\s+build/i],
                      [t, [a, "RCA"], [n, g]],
                      [/android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i],
                      [t, [a, "Dell"], [n, g]],
                      [/android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i],
                      [t, [a, "Verizon"], [n, g]],
                      [/android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i],
                      [[a, "Barnes & Noble"], t, [n, g]],
                      [/android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i],
                      [t, [a, "NuVision"], [n, g]],
                      [/android.+;\s(k88)\sbuild/i],
                      [t, [a, "ZTE"], [n, g]],
                      [/android.+[;\/]\s*(gen\d{3})\s+build.*49h/i],
                      [t, [a, "Swiss"], [n, c]],
                      [/android.+[;\/]\s*(zur\d{3})\s+build/i],
                      [t, [a, "Swiss"], [n, g]],
                      [/android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i],
                      [t, [a, "Zeki"], [n, g]],
                      [/(android).+[;\/]\s+([YR]\d{2})\s+build/i, /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i],
                      [[a, "Dragon Touch"], t, [n, g]],
                      [/android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i],
                      [t, [a, "Insignia"], [n, g]],
                      [/android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i],
                      [t, [a, "NextBook"], [n, g]],
                      [/android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i],
                      [[a, "Voice"], t, [n, c]],
                      [/android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i],
                      [[a, "LvTel"], t, [n, c]],
                      [/android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i],
                      [t, [a, "Envizen"], [n, g]],
                      [/android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i],
                      [a, t, [n, g]],
                      [/android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i],
                      [t, [a, "MachSpeed"], [n, g]],
                      [/android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i],
                      [a, t, [n, g]],
                      [/android.+[;\/]\s*TU_(1491)\s+build/i],
                      [t, [a, "Rotor"], [n, g]],
                      [/android.+(KS(.+))\s+build/i],
                      [t, [a, "Amazon"], [n, g]],
                      [/android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i],
                      [a, t, [n, g]],
                      [/\s(tablet|tab)[;\/]/i, /\s(mobile)(?:[;\/]|\ssafari)/i],
                      [[n, p.lowerize], a, t],
                      [/(android[\w\.\s\-]{0,9});.+build/i],
                      [t, [a, "Generic"]],
                    ],
                    engine: [
                      [/windows.+\sedge\/([\w\.]+)/i],
                      [o, [i, "EdgeHTML"]],
                      [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i, /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, /(icab)[\/\s]([23]\.[\d\.]+)/i],
                      [i, o],
                      [/rv\:([\w\.]{1,9}).+(gecko)/i],
                      [o, i],
                    ],
                    os: [
                      [/microsoft\s(windows)\s(vista|xp)/i],
                      [i, o],
                      [/(windows)\snt\s6\.2;\s(arm)/i, /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i, /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],
                      [i, [o, m.str, b.os.windows.version]],
                      [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
                      [
                        [i, "Windows"],
                        [o, m.str, b.os.windows.version],
                      ],
                      [/\((bb)(10);/i],
                      [[i, "BlackBerry"], o],
                      [/(blackberry)\w*\/?([\w\.]*)/i, /(tizen)[\/\s]([\w\.]+)/i, /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]*)/i, /linux;.+(sailfish);/i],
                      [i, o],
                      [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i],
                      [[i, "Symbian"], o],
                      [/\((series40);/i],
                      [i],
                      [/mozilla.+\(mobile;.+gecko.+firefox/i],
                      [[i, "Firefox OS"], o],
                      [
                        /(nintendo|playstation)\s([wids34portablevu]+)/i,
                        /(mint)[\/\s\(]?(\w*)/i,
                        /(mageia|vectorlinux)[;\s]/i,
                        /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i,
                        /(hurd|linux)\s?([\w\.]*)/i,
                        /(gnu)\s?([\w\.]*)/i,
                      ],
                      [i, o],
                      [/(cros)\s[\w]+\s([\w\.]+\w)/i],
                      [[i, "Chromium OS"], o],
                      [/(sunos)\s?([\w\.\d]*)/i],
                      [[i, "Solaris"], o],
                      [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i],
                      [i, o],
                      [/(haiku)\s(\w+)/i],
                      [i, o],
                      [/cfnetwork\/.+darwin/i, /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i],
                      [
                        [o, /_/g, "."],
                        [i, "iOS"],
                      ],
                      [/(mac\sos\sx)\s?([\w\s\.]*)/i, /(macintosh|mac(?=_powerpc)\s)/i],
                      [
                        [i, "Mac OS"],
                        [o, /_/g, "."],
                      ],
                      [/((?:open)?solaris)[\/\s-]?([\w\.]*)/i, /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i, /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i, /(unix)\s?([\w\.]*)/i],
                      [i, o],
                    ],
                  };
                (l.VERSION = "0.7.18"),
                  (l.BROWSER = {
                    NAME: i,
                    MAJOR: "major",
                    VERSION: o,
                  }),
                  (l.CPU = {
                    ARCHITECTURE: r,
                  }),
                  (l.DEVICE = {
                    MODEL: t,
                    VENDOR: a,
                    TYPE: n,
                    CONSOLE: h,
                    MOBILE: c,
                    SMARTTV: v,
                    TABLET: g,
                    WEARABLE: f,
                    EMBEDDED: "embedded",
                  }),
                  (l.ENGINE = {
                    NAME: i,
                    VERSION: o,
                  }),
                  (l.OS = {
                    NAME: i,
                    VERSION: o,
                  }),
                  typeof S != e
                    ? ((S = typeof w != e && w.exports ? (w.exports = l) : S).UAParser = l)
                    : C(3)
                      ? (L = function () {
                      return l;
                    }.call(S, C, S, w)) === d || (w.exports = L)
                      : s && (s.UAParser = l);
                var E,
                  k = s && (s.jQuery || s.Zepto);
                typeof k != e &&
                ((E = new l()),
                  (k.ua = E.getResult()),
                  (k.ua.get = function () {
                    return E.getUA();
                  }),
                  (k.ua.set = function (e) {
                    E.setUA(e);
                    var t,
                      i = E.getResult();
                    for (t in i) k.ua[t] = i[t];
                  }));
              })("object" == typeof window ? window : this);
            },
            function (t, e) {
              !function (e) {
                t.exports = e;
              }.call(e, {});
            },
            function (e, t, i) {
              Object.defineProperty(t, "__esModule", {
                value: !0,
              });
              var s =
                  Object.assign ||
                  function (e) {
                    for (var t = 1; t < arguments.length; t++) {
                      var i,
                        n = arguments[t];
                      for (i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
                    }
                    return e;
                  },
                i = i(0),
                n = i.DEVICE_TYPES,
                l = i.defaultData,
                a = (t.getNavigatorInstance = function () {
                  return !("undefined" == typeof window || (!window.navigator && !navigator)) && (window.navigator || navigator);
                }),
                t = (t.isIOS13Check = function (e) {
                  var t = a();
                  return t && t.platform && (-1 !== t.platform.indexOf(e) || ("MacIntel" === t.platform && 1 < t.maxTouchPoints && !window.MSStream));
                });
              e.exports = {
                checkType: function (e) {
                  switch (e) {
                    case n.MOBILE:
                      return {
                        isMobile: !0,
                      };
                    case n.TABLET:
                      return {
                        isTablet: !0,
                      };
                    case n.SMART_TV:
                      return {
                        isSmartTV: !0,
                      };
                    case n.CONSOLE:
                      return {
                        isConsole: !0,
                      };
                    case n.WEARABLE:
                      return {
                        isWearable: !0,
                      };
                    case n.BROWSER:
                      return {
                        isBrowser: !0,
                      };
                    default:
                      return l;
                  }
                },
                broPayload: function (e, t, i, n, s) {
                  return {
                    isBrowser: e,
                    browserMajorVersion: t.major,
                    browserFullVersion: t.version,
                    browserName: t.name,
                    engineName: i.name || !1,
                    engineVersion: i.version,
                    osName: n.name,
                    osVersion: n.version,
                    userAgent: s,
                  };
                },
                mobilePayload: function (e, t, i, n) {
                  return s({}, e, {
                    vendor: t.vendor,
                    model: t.model,
                    os: i.name,
                    osVersion: i.version,
                    ua: n,
                  });
                },
                stvPayload: function (e, t, i, n) {
                  return {
                    isSmartTV: e,
                    engineName: t.name,
                    engineVersion: t.version,
                    osName: i.name,
                    osVersion: i.version,
                    userAgent: n,
                  };
                },
                consolePayload: function (e, t, i, n) {
                  return {
                    isConsole: e,
                    engineName: t.name,
                    engineVersion: t.version,
                    osName: i.name,
                    osVersion: i.version,
                    userAgent: n,
                  };
                },
                wearPayload: function (e, t, i, n) {
                  return {
                    isWearable: e,
                    engineName: t.name,
                    engineVersion: t.version,
                    osName: i.name,
                    osVersion: i.version,
                    userAgent: n,
                  };
                },
                getNavigatorInstance: a,
                isIOS13Check: t,
              };
            },
          ]),
          (n.c = s),
          (n.d = function (e, t, i) {
            n.o(e, t) ||
            Object.defineProperty(e, t, {
              configurable: !1,
              enumerable: !0,
              get: i,
            });
          }),
          (n.n = function (e) {
            var t =
              e && e.__esModule
                ? function () {
                  return e.default;
                }
                : function () {
                  return e;
                };
            return n.d(t, "a", t), t;
          }),
          (n.o = function (e, t) {
            return Object.prototype.hasOwnProperty.call(e, t);
          }),
          (n.p = ""),
          n((n.s = 1)));
    }),
    q = (ee = X) && ee.__esModule && Object.prototype.hasOwnProperty.call(ee, "default") ? ee.default : ee,
    K = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.openSelector,
          s = void 0 === n ? "[data-ecl-menu-open]" : n,
          l = i.closeSelector,
          a = void 0 === l ? "[data-ecl-menu-close]" : l,
          o = i.backSelector,
          r = void 0 === o ? "[data-ecl-menu-back]" : o,
          h = i.overlaySelector,
          c = void 0 === h ? "[data-ecl-menu-overlay]" : h,
          d = i.innerSelector,
          u = void 0 === d ? "[data-ecl-menu-inner]" : d,
          g = i.itemSelector,
          t = void 0 === g ? "[data-ecl-menu-item]" : g,
          n = i.linkSelector,
          l = void 0 === n ? "[data-ecl-menu-link]" : n,
          o = i.megaSelector,
          h = void 0 === o ? "[data-ecl-menu-mega]" : o,
          d = i.subItemSelector,
          g = void 0 === d ? "[data-ecl-menu-subitem]" : d,
          n = i.attachClickListener,
          o = void 0 === n || n,
          d = i.attachHoverListener,
          n = void 0 === d || d,
          d = i.attachFocusListener,
          d = void 0 === d || d,
          i = i.attachResizeListener,
          i = void 0 === i || i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.openSelector = s),
          (this.closeSelector = a),
          (this.backSelector = r),
          (this.overlaySelector = c),
          (this.innerSelector = u),
          (this.itemSelector = t),
          (this.linkSelector = l),
          (this.megaSelector = h),
          (this.subItemSelector = g),
          (this.attachClickListener = o),
          (this.attachHoverListener = n),
          (this.attachFocusListener = d),
          (this.attachResizeListener = i),
          (this.open = null),
          (this.close = null),
          (this.back = null),
          (this.overlay = null),
          (this.inner = null),
          (this.items = null),
          (this.links = null),
          (this.isOpen = !1),
          (this.resizeTimer = null),
          (this.handleClickOnOpen = this.handleClickOnOpen.bind(this)),
          (this.handleClickOnClose = this.handleClickOnClose.bind(this)),
          (this.handleClickOnBack = this.handleClickOnBack.bind(this)),
          (this.handleClickOnLink = this.handleClickOnLink.bind(this)),
          (this.handleHoverOnItem = this.handleHoverOnItem.bind(this)),
          (this.handleHoverOffItem = this.handleHoverOffItem.bind(this)),
          (this.handleResize = this.handleResize.bind(this)),
          (this.useDesktopDisplay = this.useDesktopDisplay.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).MENU), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLMenu = t);
      };
      var e = i.prototype;
      return (
        (e.init = function () {
          var t = this;
          (this.open = r(this.openSelector, this.element)),
            (this.close = r(this.closeSelector, this.element)),
            (this.back = r(this.backSelector, this.element)),
            (this.overlay = r(this.overlaySelector, this.element)),
            (this.inner = r(this.innerSelector, this.element)),
            (this.items = o(this.itemSelector, this.element)),
            (this.links = o(this.linkSelector, this.element)),
            this.useDesktopDisplay(),
          this.attachClickListener && this.open && this.open.addEventListener("click", this.handleClickOnOpen),
          this.attachClickListener && this.close && this.close.addEventListener("click", this.handleClickOnClose),
          this.attachClickListener && this.back && this.back.addEventListener("click", this.handleClickOnBack),
          this.attachClickListener && this.overlay && this.overlay.addEventListener("click", this.handleClickOnClose),
          this.attachClickListener &&
          this.links &&
          this.links.forEach(function (e) {
            e.parentElement.hasAttribute("data-ecl-has-children") && e.addEventListener("click", t.handleClickOnLink);
          }),
          this.attachResizeListener && window.addEventListener("resize", this.handleResize),
          this.items &&
          !q.isMobile &&
          this.items.forEach(function (e) {
            t.checkMenuItem(e),
            e.hasAttribute("data-ecl-has-children") &&
            (t.attachHoverListener && (e.addEventListener("mouseover", t.handleHoverOnItem), e.addEventListener("mouseout", t.handleHoverOffItem)),
            t.attachFocusListener && (e.addEventListener("focusin", t.handleHoverOnItem), e.addEventListener("focusout", t.handleHoverOffItem)));
          }),
            (this.stickyInstance = new j.Sticky(this.element)),
            setTimeout(function () {
              t.element.classList.add("ecl-menu--transition");
            }, 500);
        }),
          (e.destroy = function () {
            var t = this;
            this.attachClickListener && this.open && this.open.removeEventListener("click", this.handleClickOnOpen),
            this.attachClickListener && this.close && this.close.removeEventListener("click", this.handleClickOnClose),
            this.attachClickListener && this.back && this.back.removeEventListener("click", this.handleClickOnBack),
            this.attachClickListener && this.overlay && this.overlay.removeEventListener("click", this.handleClickOnClose),
            this.items &&
            !q.isMobile &&
            this.items.forEach(function (e) {
              e.hasAttribute("data-ecl-has-children") &&
              (t.attachHoverListener && (e.removeEventListener("mouseover", t.handleHoverOnItem), e.removeEventListener("mouseout", t.handleHoverOffItem)),
              t.attachFocusListener && (e.removeEventListener("focusin", t.handleHoverOnItem), e.removeEventListener("focusout", t.handleHoverOffItem)));
            }),
            this.attachClickListener &&
            this.links &&
            this.links.forEach(function (e) {
              e.parentElement.hasAttribute("data-ecl-has-children") && e.removeEventListener("click", t.handleClickOnLink);
            }),
            this.attachResizeListener && window.removeEventListener("resize", this.handleResize);
          }),
          (e.useDesktopDisplay = function () {
            return !q.isMobileOnly && (q.isTablet ? (this.element.classList.add("ecl-menu--forced-mobile"), !1) : (this.element.classList.remove("ecl-menu--forced-mobile"), !0));
          }),
          (e.handleResize = function () {
            var t = this;
            return (
              this.element.classList.remove("ecl-menu--transition"),
                clearTimeout(this.resizeTimer),
                (this.resizeTimer = setTimeout(function () {
                  t.element.classList.remove("ecl-menu--forced-mobile"),
                    t.useDesktopDisplay(),
                  t.items &&
                  !q.isMobile &&
                  t.items.forEach(function (e) {
                    t.checkMenuItem(e);
                  }),
                    t.element.classList.add("ecl-menu--transition");
                }, 200)),
                this
            );
          }),
          (e.checkMenuItem = function (e) {
            var t = r(this.megaSelector, e);
            if (t) {
              var i = o(this.subItemSelector, t);
              if (i.length < 5) e.classList.add("ecl-menu__item--col1");
              else if (i.length < 9) e.classList.add("ecl-menu__item--col2");
              else {
                if (!(i.length < 13)) return void e.classList.add("ecl-menu__item--full");
                e.classList.add("ecl-menu__item--col3");
              }
              var n = t.getBoundingClientRect(),
                i = this.inner.getBoundingClientRect(),
                e = e.getBoundingClientRect(),
                n = n.width;
              i.width < e.left - i.left + n ? t.classList.add("ecl-menu__mega--rtl") : t.classList.remove("ecl-menu__mega--rtl");
            }
          }),
          (e.handleClickOnOpen = function (e) {
            return e.preventDefault(), this.element.setAttribute("aria-expanded", "true"), this.inner.setAttribute("aria-hidden", "false"), (this.isOpen = !0), this;
          }),
          (e.handleClickOnClose = function () {
            return (
              this.element.setAttribute("aria-expanded", "false"),
                this.inner.classList.remove("ecl-menu__inner--expanded"),
                this.inner.setAttribute("aria-hidden", "true"),
                this.items.forEach(function (e) {
                  e.classList.remove("ecl-menu__item--expanded"), e.setAttribute("aria-expanded", "false");
                }),
                (this.isOpen = !1),
                this
            );
          }),
          (e.handleClickOnBack = function () {
            return (
              this.inner.classList.remove("ecl-menu__inner--expanded"),
                this.items.forEach(function (e) {
                  e.classList.remove("ecl-menu__item--expanded"), e.setAttribute("aria-expanded", "false");
                }),
                this
            );
          }),
          (e.handleClickOnLink = function (e) {
            if (!this.isOpen || this.inner.classList.contains("ecl-menu__inner--expanded")) return !0;
            e.preventDefault(), this.inner.classList.add("ecl-menu__inner--expanded");
            var t = e.target.closest("[data-ecl-menu-item]");
            return (
              this.items.forEach(function (e) {
                e === t ? (e.classList.add("ecl-menu__item--expanded"), e.setAttribute("aria-expanded", "true")) : (e.classList.remove("ecl-menu__item--expanded"), e.setAttribute("aria-expanded", "false"));
              }),
                this
            );
          }),
          (e.handleHoverOnItem = function (e) {
            var t = e.target.closest("[data-ecl-menu-item]");
            return (
              this.items.forEach(function (e) {
                e === t ? e.setAttribute("aria-expanded", "true") : e.setAttribute("aria-expanded", "false");
              }),
                this
            );
          }),
          (e.handleHoverOffItem = function (e) {
            return e.target.closest("[data-ecl-menu-item]").setAttribute("aria-expanded", "false"), this;
          }),
          i
      );
    })(),
    $ = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.toggleSelector,
          s = void 0 === n ? "[data-ecl-news-ticker-toggle]" : n,
          l = i.prevSelector,
          a = void 0 === l ? "[data-ecl-news-ticker-prev]" : l,
          o = i.nextSelector,
          r = void 0 === o ? "[data-ecl-news-ticker-next]" : o,
          h = i.containerClass,
          c = void 0 === h ? ".ecl-news-ticker__container" : h,
          t = i.contentClass,
          n = void 0 === t ? ".ecl-news-ticker__content" : t,
          l = i.slidesClass,
          o = void 0 === l ? ".ecl-news-ticker__slides" : l,
          h = i.slideClass,
          t = void 0 === h ? ".ecl-news-ticker__slide" : h,
          l = i.currentSlideClass,
          h = void 0 === l ? ".ecl-news-ticker__counter--current" : l,
          l = i.attachClickListener,
          l = void 0 === l || l,
          i = i.attachResizeListener,
          i = void 0 === i || i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.toggleSelector = s),
          (this.prevSelector = a),
          (this.nextSelector = r),
          (this.containerClass = c),
          (this.contentClass = n),
          (this.slidesClass = o),
          (this.slideClass = t),
          (this.currentSlideClass = h),
          (this.attachClickListener = l),
          (this.attachResizeListener = i),
          (this.toggle = null),
          (this.container = null),
          (this.content = null),
          (this.slides = null),
          (this.btnPrev = null),
          (this.btnNext = null),
          (this.index = 1),
          (this.total = 0),
          (this.allowShift = !0),
          (this.autoPlay = !1),
          (this.autoPlayInterval = null),
          (this.resizeTimer = null),
          (this.handleClickOnToggle = this.handleClickOnToggle.bind(this)),
          (this.shiftSlide = this.shiftSlide.bind(this)),
          (this.checkIndex = this.checkIndex.bind(this)),
          (this.moveSlides = this.moveSlides.bind(this)),
          (this.resizeTicker = this.resizeTicker.bind(this)),
          (this.handleResize = this.handleResize.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).NEWS_TICKER), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLNewsTicker = t);
      };
      var e = i.prototype;
      return (
        (e.init = function () {
          (this.toggle = r(this.toggleSelector, this.element)),
            (this.btnPrev = r(this.prevSelector, this.element)),
            (this.btnNext = r(this.nextSelector, this.element)),
            (this.slidesContainer = r(this.slidesClass, this.element)),
            (this.container = r(this.containerClass, this.element)),
            (this.content = r(this.contentClass, this.element)),
            (this.slides = o(this.slideClass, this.element)),
            (this.total = this.slides.length);
          var e = this.slides[0],
            t = this.slides[this.slides.length - 1],
            i = e.cloneNode(!0),
            t = t.cloneNode(!0);
          this.slidesContainer.appendChild(i),
            this.slidesContainer.insertBefore(t, e),
            (this.slides = o(this.slideClass, this.element)),
            this.moveSlides(!1),
            this.resizeTicker(),
          this.toggle && this.handleClickOnToggle(),
          this.attachClickListener && this.toggle && this.toggle.addEventListener("click", this.handleClickOnToggle),
          this.attachClickListener && this.btnNext && this.btnNext.addEventListener("click", this.shiftSlide.bind(this, 1, !0)),
          this.attachClickListener && this.btnPrev && this.btnPrev.addEventListener("click", this.shiftSlide.bind(this, -1, !0)),
          this.slidesContainer && this.slidesContainer.addEventListener("transitionend", this.checkIndex),
          this.attachResizeListener && window.addEventListener("resize", this.handleResize);
        }),
          (e.destroy = function () {
            this.attachClickListener && this.toggle && this.toggle.removeEventListener("click", this.handleClickOnToggle),
            this.attachClickListener && this.btnNext && this.btnNext.removeEventListener("click", this.shiftSlide),
            this.attachClickListener && this.btnPrev && this.btnPrev.removeEventListener("click", this.shiftSlide),
            this.slidesContainer && this.slidesContainer.removeEventListener("transitionend", this.checkIndex),
            this.attachResizeListener && window.removeEventListener("resize", this.handleResize);
          }),
          (e.shiftSlide = function (e, t) {
            this.allowShift && ((this.index = 1 === e ? this.index + 1 : this.index - 1), this.moveSlides(!0)), t && this.autoPlay && this.handleClickOnToggle(), (this.allowShift = !1);
          }),
          (e.moveSlides = function (e) {
            var t = this.slides[this.index].offsetTop,
              i = this.slides[this.index].offsetHeight;
            (this.content.style.height = i + "px"), (this.slidesContainer.style.transitionDuration = e ? "0.4s" : "0s"), (this.slidesContainer.style.transform = "translate3d(0px, -" + t + "px, 0px)");
          }),
          (e.checkIndex = function () {
            0 === this.index && ((this.index = this.total), this.moveSlides(!1)),
            this.index === this.total + 1 && ((this.index = 1), this.moveSlides(!1)),
              (r(this.currentSlideClass, this.element).textContent = this.index),
              (this.allowShift = !0);
          }),
          (e.handleClickOnToggle = function () {
            var e = this,
              t = r(this.toggleSelector + " .ecl-icon use", this.element),
              i = t.getAttribute("xlink:href"),
              n = "",
              n = this.autoPlay
                ? (clearInterval(this.autoPlayInterval), (this.autoPlay = !1), i.replace("pause", "play"))
                : ((this.autoPlayInterval = setInterval(function () {
                  e.shiftSlide(1);
                }, 5e3)),
                  (this.autoPlay = !0),
                  i.replace("play", "pause"));
            t.setAttribute("xlink:href", n);
          }),
          (e.resizeTicker = function () {
            var t = 0;
            this.slides.forEach(function (e) {
              e = e.offsetHeight;
              t = t < e ? e : t;
            }),
              (this.container.style.height = t + 10 + "px");
          }),
          (e.handleResize = function () {
            return this.moveSlides(!1), this.resizeTicker(), this.autoPlay && this.handleClickOnToggle(), this;
          }),
          i
      );
    })(),
    Q = (function () {
      function c(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.defaultText,
          s = void 0 === n ? "" : n,
          l = i.searchText,
          a = void 0 === l ? "" : l,
          o = i.selectAllText,
          r = void 0 === o ? "" : o,
          h = i.noResultsText,
          c = void 0 === h ? "" : h,
          t = i.selectMultipleId,
          n = void 0 === t ? "select-multiple" : t,
          l = i.selectMultipleSelector,
          o = void 0 === l ? "[data-ecl-select-multiple]" : l,
          h = i.defaultTextAttribute,
          t = void 0 === h ? "data-ecl-select-default" : h,
          l = i.searchTextAttribute,
          h = void 0 === l ? "data-ecl-select-search" : l,
          l = i.selectAllTextAttribute,
          l = void 0 === l ? "data-ecl-select-all" : l,
          i = i.noResultsTextAttribute,
          i = void 0 === i ? "data-ecl-select-no-results" : i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.selectMultipleId = n),
          (this.selectMultipleSelector = o),
          (this.defaultTextAttribute = t),
          (this.searchTextAttribute = h),
          (this.selectAllTextAttribute = l),
          (this.noResultsTextAttribute = i),
          (this.defaultText = s),
          (this.searchText = a),
          (this.selectAllText = r),
          (this.noResultsText = c),
          (this.input = null),
          (this.search = null),
          (this.checkboxes = null),
          (this.select = null),
          (this.selectAll = null),
          (this.selectIcon = null),
          (this.textDefault = null),
          (this.textSearch = null),
          (this.textSelectAll = null),
          (this.textNoResults = null),
          (this.selectMultiple = null),
          (this.inputContainer = null),
          (this.optionsContainer = null),
          (this.searchContainer = null),
          (this.updateCurrentValue = this.updateCurrentValue.bind(this)),
          (this.handleToggle = this.handleToggle.bind(this)),
          (this.handleClickOption = this.handleClickOption.bind(this)),
          (this.handleClickSelectAll = this.handleClickSelectAll.bind(this)),
          (this.handleFocusout = this.handleFocusout.bind(this)),
          (this.handleSearch = this.handleSearch.bind(this)),
          (this.handleClickOutside = this.handleClickOutside.bind(this));
      }
      (c.autoInit = function (e, t) {
        t = new c(e, (t = void 0 === t ? {} : t));
        return t.init(), (e.ECLSelect = t);
      }),
        (c.createSvgIcon = function (e, t) {
          var i = document.createElement("div");
          i.innerHTML = e;
          i = i.children[0];
          return i.removeAttribute("height"), i.removeAttribute("width"), i.setAttribute("focusable", !1), i.setAttribute("aria-hidden", !0), i.setAttribute("class", t), i;
        }),
        (c.createCheckbox = function (e, t) {
          if (!e || !t) return "";
          var i = e.id,
            n = e.text,
            s = e.disabled,
            l = e.selected,
            a = e.extraClass;
          if (!i || !n) return "";
          var o = document.createElement("div"),
            r = document.createElement("input"),
            h = document.createElement("label"),
            e = document.createElement("span");
          return (
            a && o.classList.add(a),
            l && r.setAttribute("checked", !0),
            s && (o.classList.add("ecl-checkbox--disabled"), r.setAttribute("disabled", s)),
              o.classList.add("ecl-checkbox"),
              o.setAttribute("data-select-multiple-value", n),
              r.classList.add("ecl-checkbox__input"),
              r.setAttribute("type", "checkbox"),
              r.setAttribute("id", t + "-" + i),
              o.appendChild(r),
              h.classList.add("ecl-checkbox__label"),
              h.setAttribute("for", t + "-" + i),
              e.classList.add("ecl-checkbox__box"),
              e.appendChild(
                c.createSvgIcon(
                  '<svg width="48" height="48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="a" d="M36 12 20 28l-8-8-4 4 12 12 20-20z"/></defs><use xlink:href="#a"/></svg>',
                  "ecl-icon ecl-icon--s ecl-checkbox__icon"
                )
              ),
              h.appendChild(e),
              h.appendChild(document.createTextNode(n)),
              o.appendChild(h),
              o
          );
        }),
        (c.createSelectIcon = function () {
          var e = document.createElement("div");
          e.classList.add("ecl-select__icon");
          var t = c.createSvgIcon(
            '<svg width="48" height="48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="a" d="M40 38 24 20 8 38l-6-6L24 8l22 24z"/></defs><use xlink:href="#a"/></svg>',
            "ecl-icon ecl-icon--s ecl-select__icon-shape ecl-icon--rotate-180"
          );
          return e.appendChild(t), e;
        }),
        (c.checkCheckbox = function (e) {
          e = e.target.closest(".ecl-checkbox").querySelector("input");
          return (e.checked = !e.checked), e.checked;
        });
      var e = c.prototype;
      return (
        (e.init = function () {
          var e,
            t = this;
          this.select = this.element;
          var i = Array.from(this.select.parentElement.classList);
          (this.textDefault = this.defaultText || this.element.getAttribute(this.defaultTextAttribute)),
            (this.textSearch = this.searchText || this.element.getAttribute(this.searchTextAttribute)),
            (this.textSelectAll = this.selectAllText || this.element.getAttribute(this.selectAllTextAttribute)),
            (this.textNoResults = this.noResultsText || this.element.getAttribute(this.noResultsTextAttribute)),
            (this.selectMultiple = document.createElement("div")),
            this.selectMultiple.classList.add("ecl-select__multiple"),
            this.selectMultiple.addEventListener("focusout", this.handleFocusout),
            (this.inputContainer = document.createElement("div")),
            (e = this.inputContainer.classList).add.apply(e, i),
            this.selectMultiple.appendChild(this.inputContainer),
            (this.input = document.createElement("input")),
            this.input.classList.add("ecl-select", "ecl-select__multiple-toggle"),
            this.input.setAttribute("type", "text"),
            this.input.setAttribute("placeholder", this.textDefault || ""),
            this.input.setAttribute("readonly", !0),
          i.find(function (e) {
            return e.includes("disabled");
          }) && this.input.setAttribute("disabled", !0),
            this.input.addEventListener("keypress", this.handleToggle),
            this.input.addEventListener("click", this.handleToggle),
            this.inputContainer.appendChild(this.input),
            this.inputContainer.appendChild(c.createSelectIcon()),
            (this.searchContainer = document.createElement("div")),
            (this.searchContainer.style.display = "none"),
            (e = this.searchContainer.classList).add.apply(e, ["ecl-select__multiple-dropdown"].concat(i)),
            this.selectMultiple.appendChild(this.searchContainer),
            (this.search = document.createElement("input")),
            this.search.classList.add("ecl-text-input"),
            this.search.setAttribute("type", "search"),
            this.search.setAttribute("placeholder", this.textSearch || ""),
            this.search.addEventListener("keyup", this.handleSearch),
            this.search.addEventListener("search", this.handleSearch),
            this.searchContainer.appendChild(this.search),
          this.textSelectAll &&
          ((this.selectAll = c.createCheckbox(
            {
              id: "all",
              text: this.textSelectAll,
              extraClass: "ecl-select__multiple-all",
            },
            this.selectMultipleId
          )),
            this.selectAll.addEventListener("click", this.handleClickSelectAll),
            this.selectAll.addEventListener("keypress", this.handleClickSelectAll),
            this.selectAll.addEventListener("change", this.handleClickSelectAll),
            this.searchContainer.appendChild(this.selectAll)),
            (this.optionsContainer = document.createElement("div")),
            this.optionsContainer.classList.add("ecl-select__multiple-options"),
            this.searchContainer.appendChild(this.optionsContainer),
          this.select.options &&
          0 < this.select.options.length &&
          (this.checkboxes = Array.from(this.select.options).map(function (e) {
            e = c.createCheckbox(
              {
                id: e.value,
                text: e.text,
                disabled: e.disabled,
                selected: e.selected,
              },
              t.selectMultipleId
            );
            return (
              e.setAttribute("data-visible", !0),
              e.classList.contains("ecl-checkbox--disabled") || (e.addEventListener("click", t.handleClickOption), e.addEventListener("keypress", t.handleClickOption)),
                t.optionsContainer.appendChild(e),
                e
            );
          })),
            this.select.parentNode.parentNode.insertBefore(this.selectMultiple, this.select.parentNode.nextSibling),
            document.addEventListener("click", this.handleClickOutside),
            this.select.parentNode.classList.add("ecl-select__container--hidden"),
            this.updateCurrentValue();
        }),
          (e.destroy = function () {
            var t = this;
            this.selectMultiple.removeEventListener("focusout", this.handleFocusout),
              this.input.removeEventListener("keypress", this.handleToggle),
              this.input.removeEventListener("click", this.handleToggle),
              this.search.removeEventListener("keyup", this.handleSearch),
              this.selectAll.removeEventListener("click", this.handleClickSelectAll),
              this.selectAll.removeEventListener("keypress", this.handleClickSelectAll),
              this.checkboxes.forEach(function (e) {
                e.removeEventListener("click", t.handleClickSelectAll), e.removeEventListener("click", t.handleClickOption);
              }),
              document.removeEventListener("click", this.handleClickOutside),
            this.selectMultiple && this.selectMultiple.remove(),
              this.select.parentNode.classList.remove("ecl-select__container--hidden");
          }),
          (e.updateCurrentValue = function () {
            (this.input.value = Array.from(this.select.options)
              .filter(function (e) {
                return e.selected;
              })
              .map(function (e) {
                return e.text;
              })
              .join(", ")),
              this.select.dispatchEvent(
                new window.Event("change", {
                  bubbles: !0,
                })
              );
          }),
          (e.handleToggle = function (e) {
            e.preventDefault(), "none" === this.searchContainer.style.display ? (this.searchContainer.style.display = "block") : (this.searchContainer.style.display = "none");
          }),
          (e.handleClickOption = function (e) {
            var t = this;
            e.preventDefault(), c.checkCheckbox(e);
            var i = e.target.closest(".ecl-checkbox");
            Array.from(this.select.options).forEach(function (e) {
              e.text === i.getAttribute("data-select-multiple-value") &&
              (e.getAttribute("selected") || e.selected ? (e.removeAttribute("selected"), (e.selected = !1), (t.selectAll.querySelector("input").checked = !1)) : (e.setAttribute("selected", "selected"), (e.selected = !0)));
            }),
              this.updateCurrentValue();
          }),
          (e.handleClickSelectAll = function (e) {
            var i, n;
            e.preventDefault(),
            this.selectAll.querySelector("input").disabled ||
            ((i = c.checkCheckbox(e)),
              (n = Array.from(this.select.options).filter(function (e) {
                return !e.disabled;
              })),
              Array.from(this.searchContainer.querySelectorAll('[data-visible="true"]'))
                .filter(function (e) {
                  return !e.querySelector("input").disabled;
                })
                .forEach(function (t) {
                  t.querySelector("input").checked = i;
                  var e = n.find(function (e) {
                    return e.text === t.getAttribute("data-select-multiple-value");
                  });
                  e && (i ? (e.setAttribute("selected", "selected"), (e.selected = !0)) : (e.removeAttribute("selected", "selected"), (e.selected = !1)));
                }),
              this.updateCurrentValue());
          }),
          (e.handleFocusout = function (e) {
            e.relatedTarget && this.selectMultiple && !this.selectMultiple.contains(e.relatedTarget) && "block" === this.searchContainer.style.display && (this.searchContainer.style.display = "none");
          }),
          (e.handleSearch = function (e) {
            var n = [],
              s = e.target.value.toLowerCase();
            this.checkboxes.forEach(function (e) {
              var t, i;
              e.getAttribute("data-select-multiple-value").toLocaleLowerCase().includes(s)
                ? (e.setAttribute("data-visible", !0),
                  (e.style.display = "flex"),
                  (t = e.querySelector(".ecl-checkbox__box")),
                  ((i = e.querySelector(".ecl-checkbox__label")).innerHTML = s ? t.outerHTML + i.textContent.replace(new RegExp(s + "(?!([^<]+)?<)", "gi"), "<b>$&</b>") : t.outerHTML + i.textContent),
                  n.push(e))
                : (e.setAttribute("data-visible", !1), (e.style.display = "none"));
            });
            var t = n.filter(function (e) {
              return e.querySelector("input").checked;
            });
            0 === n.length || n.length !== t.length ? (this.selectAll.querySelector("input").checked = !1) : (this.selectAll.querySelector("input").checked = !0);
            var e = this.searchContainer.querySelector(".ecl-select__multiple-no-results");
            0 !== n.length || e
              ? 0 < n.length && null !== e && e.parentNode.removeChild(e)
              : ((t = document.createElement("div")),
                (e = document.createElement("span")),
                t.classList.add("ecl-select__multiple-no-results"),
                (e.innerHTML = this.textNoResults),
                t.appendChild(e),
                this.optionsContainer.appendChild(t)),
              0 === s.length
                ? (this.checkboxes.forEach(function (e) {
                  e.setAttribute("data-visible", !0), (e.style.display = "flex");
                }),
                  this.selectAll.classList.remove("ecl-checkbox--disabled"),
                  (this.selectAll.querySelector("input").disabled = !1))
                : (this.selectAll.classList.add("ecl-checkbox--disabled"), (this.selectAll.querySelector("input").disabled = !0));
          }),
          (e.handleClickOutside = function (e) {
            e.target && this.selectMultiple && !this.selectMultiple.contains(e.target) && "block" === this.searchContainer.style.display && (this.searchContainer.style.display = "none");
          }),
          c
      );
    })(),
    Z = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.languageLinkSelector,
          s = void 0 === n ? "[data-ecl-language-selector]" : n,
          l = i.languageListOverlaySelector,
          a = void 0 === l ? "[data-ecl-language-list-overlay]" : l,
          o = i.closeOverlaySelector,
          t = void 0 === o ? "[data-ecl-language-list-close]" : o,
          n = i.searchToggleSelector,
          l = void 0 === n ? "[data-ecl-search-toggle]" : n,
          o = i.searchFormSelector,
          n = void 0 === o ? "[data-ecl-search-form]" : o,
          o = i.loginToggleSelector,
          o = void 0 === o ? "[data-ecl-login-toggle]" : o,
          i = i.loginBoxSelector,
          i = void 0 === i ? "[data-ecl-login-box]" : i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.languageLinkSelector = s),
          (this.languageListOverlaySelector = a),
          (this.closeOverlaySelector = t),
          (this.searchToggleSelector = l),
          (this.searchFormSelector = n),
          (this.loginToggleSelector = o),
          (this.loginBoxSelector = i),
          (this.languageSelector = null),
          (this.languageListOverlay = null),
          (this.close = null),
          (this.focusTrap = null),
          (this.searchToggle = null),
          (this.searchForm = null),
          (this.loginToggle = null),
          (this.loginBox = null),
          (this.openOverlay = this.openOverlay.bind(this)),
          (this.closeOverlay = this.closeOverlay.bind(this)),
          (this.toggleOverlay = this.toggleOverlay.bind(this)),
          (this.toggleSearch = this.toggleSearch.bind(this)),
          (this.toggleLogin = this.toggleLogin.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).SITE_HEADER_CORE), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLSiteHeaderCore = t);
      };
      var e = i.prototype;
      return (
        (e.init = function () {
          (this.languageSelector = r(this.languageLinkSelector)),
            (this.languageListOverlay = r(this.languageListOverlaySelector)),
            (this.close = r(this.closeOverlaySelector)),
            (this.focusTrap = z(this.languageListOverlay, {
              onDeactivate: this.closeOverlay,
            })),
          this.languageSelector && this.languageSelector.addEventListener("click", this.toggleOverlay),
          this.close && this.close.addEventListener("click", this.toggleOverlay),
            (this.searchToggle = r(this.searchToggleSelector)),
            (this.searchForm = r(this.searchFormSelector)),
          this.searchToggle && this.searchToggle.addEventListener("click", this.toggleSearch),
            (this.loginToggle = r(this.loginToggleSelector)),
            (this.loginBox = r(this.loginBoxSelector)),
          this.loginToggle && this.loginToggle.addEventListener("click", this.toggleLogin);
        }),
          (e.destroy = function () {
            this.languageSelector && this.languageSelector.removeEventListener("click", this.toggleOverlay),
            this.focusTrap && this.focusTrap.deactivate(),
            this.close && this.close.removeEventListener("click", this.toggleOverlay),
            this.searchToggle && this.searchToggle.removeEventListener("click", this.toggleSearch),
            this.loginToggle && this.loginToggle.removeEventListener("click", this.toggleLogin);
          }),
          (e.openOverlay = function () {
            (this.languageListOverlay.hidden = !1), this.languageListOverlay.setAttribute("aria-modal", "true"), this.languageSelector.setAttribute("aria-expanded", "true");
          }),
          (e.closeOverlay = function () {
            (this.languageListOverlay.hidden = !0), this.languageListOverlay.removeAttribute("aria-modal"), this.languageSelector.setAttribute("aria-expanded", "false");
          }),
          (e.toggleOverlay = function (e) {
            this.languageListOverlay && this.focusTrap && (e.preventDefault(), this.languageListOverlay.hasAttribute("hidden") ? (this.openOverlay(), this.focusTrap.activate()) : this.focusTrap.deactivate());
          }),
          (e.toggleSearch = function (e) {
            var t;
            this.searchForm &&
            (e.preventDefault(),
              (t = "true" === this.searchToggle.getAttribute("aria-expanded")),
            this.loginToggle && "true" === this.loginToggle.getAttribute("aria-expanded") && this.toggleLogin(e),
              this.searchToggle.setAttribute("aria-expanded", t ? "false" : "true"),
              t ? this.searchForm.classList.remove("ecl-site-header-core__search--active") : this.searchForm.classList.add("ecl-site-header-core__search--active"));
          }),
          (e.toggleLogin = function (e) {
            var t;
            this.loginBox &&
            (e.preventDefault(),
              (t = "true" === this.loginToggle.getAttribute("aria-expanded")),
            this.searchToggle && "true" === this.searchToggle.getAttribute("aria-expanded") && this.toggleSearch(e),
              this.loginToggle.setAttribute("aria-expanded", t ? "false" : "true"),
              t ? this.loginBox.classList.remove("ecl-site-header-core__login-box--active") : this.loginBox.classList.add("ecl-site-header-core__login-box--active"));
          }),
          i
      );
    })(),
    J = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.languageLinkSelector,
          s = void 0 === n ? "[data-ecl-language-selector]" : n,
          l = i.languageListOverlaySelector,
          a = void 0 === l ? "[data-ecl-language-list-overlay]" : l,
          o = i.closeOverlaySelector,
          t = void 0 === o ? "[data-ecl-language-list-close]" : o,
          n = i.searchToggleSelector,
          l = void 0 === n ? "[data-ecl-search-toggle]" : n,
          o = i.searchFormSelector,
          n = void 0 === o ? "[data-ecl-search-form]" : o,
          o = i.loginToggleSelector,
          o = void 0 === o ? "[data-ecl-login-toggle]" : o,
          i = i.loginBoxSelector,
          i = void 0 === i ? "[data-ecl-login-box]" : i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.languageLinkSelector = s),
          (this.languageListOverlaySelector = a),
          (this.closeOverlaySelector = t),
          (this.searchToggleSelector = l),
          (this.searchFormSelector = n),
          (this.loginToggleSelector = o),
          (this.loginBoxSelector = i),
          (this.languageSelector = null),
          (this.languageListOverlay = null),
          (this.close = null),
          (this.focusTrap = null),
          (this.searchToggle = null),
          (this.searchForm = null),
          (this.loginToggle = null),
          (this.loginBox = null),
          (this.openOverlay = this.openOverlay.bind(this)),
          (this.closeOverlay = this.closeOverlay.bind(this)),
          (this.toggleOverlay = this.toggleOverlay.bind(this)),
          (this.toggleSearch = this.toggleSearch.bind(this)),
          (this.toggleLogin = this.toggleLogin.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).SITE_HEADER_CORE), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLSiteHeaderHarmonised = t);
      };
      var e = i.prototype;
      return (
        (e.init = function () {
          (this.languageSelector = r(this.languageLinkSelector)),
            (this.languageListOverlay = r(this.languageListOverlaySelector)),
            (this.close = r(this.closeOverlaySelector)),
            (this.focusTrap = z(this.languageListOverlay, {
              onDeactivate: this.closeOverlay,
            })),
          this.languageSelector && this.languageSelector.addEventListener("click", this.toggleOverlay),
          this.close && this.close.addEventListener("click", this.toggleOverlay),
            (this.searchToggle = r(this.searchToggleSelector)),
            (this.searchForm = r(this.searchFormSelector)),
          this.searchToggle && this.searchToggle.addEventListener("click", this.toggleSearch),
            (this.loginToggle = r(this.loginToggleSelector)),
            (this.loginBox = r(this.loginBoxSelector)),
          this.loginToggle && this.loginToggle.addEventListener("click", this.toggleLogin);
        }),
          (e.destroy = function () {
            this.languageSelector && this.languageSelector.removeEventListener("click", this.toggleOverlay),
            this.focusTrap && this.focusTrap.deactivate(),
            this.close && this.close.removeEventListener("click", this.toggleOverlay),
            this.searchToggle && this.searchToggle.removeEventListener("click", this.toggleSearch),
            this.loginToggle && this.loginToggle.removeEventListener("click", this.toggleLogin);
          }),
          (e.openOverlay = function () {
            (this.languageListOverlay.hidden = !1), this.languageListOverlay.setAttribute("aria-modal", "true"), this.languageSelector.setAttribute("aria-expanded", "true");
          }),
          (e.closeOverlay = function () {
            (this.languageListOverlay.hidden = !0), this.languageListOverlay.removeAttribute("aria-modal"), this.languageSelector.setAttribute("aria-expanded", "false");
          }),
          (e.toggleOverlay = function (e) {
            this.languageListOverlay && this.focusTrap && (e.preventDefault(), this.languageListOverlay.hasAttribute("hidden") ? (this.openOverlay(), this.focusTrap.activate()) : this.focusTrap.deactivate());
          }),
          (e.toggleSearch = function (e) {
            var t;
            this.searchForm &&
            (e.preventDefault(),
              (t = "true" === this.searchToggle.getAttribute("aria-expanded")),
            this.loginToggle && "true" === this.loginToggle.getAttribute("aria-expanded") && this.toggleLogin(e),
              this.searchToggle.setAttribute("aria-expanded", t ? "false" : "true"),
              t ? this.searchForm.classList.remove("ecl-site-header-harmonised__search--active") : this.searchForm.classList.add("ecl-site-header-harmonised__search--active"));
          }),
          (e.toggleLogin = function (e) {
            var t;
            this.loginBox &&
            (e.preventDefault(),
              (t = "true" === this.loginToggle.getAttribute("aria-expanded")),
            this.searchToggle && "true" === this.searchToggle.getAttribute("aria-expanded") && this.toggleSearch(e),
              this.loginToggle.setAttribute("aria-expanded", t ? "false" : "true"),
              t ? this.loginBox.classList.remove("ecl-site-header-harmonised__login-box--active") : this.loginBox.classList.add("ecl-site-header-harmonised__login-box--active"));
          }),
          i
      );
    })(),
    t = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.languageLinkSelector,
          s = void 0 === n ? "[data-ecl-language-selector]" : n,
          l = i.languageListOverlaySelector,
          a = void 0 === l ? "[data-ecl-language-list-overlay]" : l,
          o = i.closeOverlaySelector,
          t = void 0 === o ? "[data-ecl-language-list-close]" : o,
          n = i.searchToggleSelector,
          l = void 0 === n ? "[data-ecl-search-toggle]" : n,
          o = i.searchFormSelector,
          n = void 0 === o ? "[data-ecl-search-form]" : o,
          o = i.loginToggleSelector,
          o = void 0 === o ? "[data-ecl-login-toggle]" : o,
          i = i.loginBoxSelector,
          i = void 0 === i ? "[data-ecl-login-box]" : i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.languageLinkSelector = s),
          (this.languageListOverlaySelector = a),
          (this.closeOverlaySelector = t),
          (this.searchToggleSelector = l),
          (this.searchFormSelector = n),
          (this.loginToggleSelector = o),
          (this.loginBoxSelector = i),
          (this.languageSelector = null),
          (this.languageListOverlay = null),
          (this.close = null),
          (this.focusTrap = null),
          (this.searchToggle = null),
          (this.searchForm = null),
          (this.loginToggle = null),
          (this.loginBox = null),
          (this.openOverlay = this.openOverlay.bind(this)),
          (this.closeOverlay = this.closeOverlay.bind(this)),
          (this.toggleOverlay = this.toggleOverlay.bind(this)),
          (this.toggleSearch = this.toggleSearch.bind(this)),
          (this.toggleLogin = this.toggleLogin.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).SITE_HEADER_CORE), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLSiteHeaderStandardised = t);
      };
      var e = i.prototype;
      return (
        (e.init = function () {
          (this.languageSelector = r(this.languageLinkSelector)),
            (this.languageListOverlay = r(this.languageListOverlaySelector)),
            (this.close = r(this.closeOverlaySelector)),
            (this.focusTrap = z(this.languageListOverlay, {
              onDeactivate: this.closeOverlay,
            })),
          this.languageSelector && this.languageSelector.addEventListener("click", this.toggleOverlay),
          this.close && this.close.addEventListener("click", this.toggleOverlay),
            (this.searchToggle = r(this.searchToggleSelector)),
            (this.searchForm = r(this.searchFormSelector)),
          this.searchToggle && this.searchToggle.addEventListener("click", this.toggleSearch),
            (this.loginToggle = r(this.loginToggleSelector)),
            (this.loginBox = r(this.loginBoxSelector)),
          this.loginToggle && this.loginToggle.addEventListener("click", this.toggleLogin);
        }),
          (e.destroy = function () {
            this.languageSelector && this.languageSelector.removeEventListener("click", this.toggleOverlay),
            this.focusTrap && this.focusTrap.deactivate(),
            this.close && this.close.removeEventListener("click", this.toggleOverlay),
            this.searchToggle && this.searchToggle.removeEventListener("click", this.toggleSearch),
            this.loginToggle && this.loginToggle.removeEventListener("click", this.toggleLogin);
          }),
          (e.openOverlay = function () {
            (this.languageListOverlay.hidden = !1), this.languageListOverlay.setAttribute("aria-modal", "true"), this.languageSelector.setAttribute("aria-expanded", "true");
          }),
          (e.closeOverlay = function () {
            (this.languageListOverlay.hidden = !0), this.languageListOverlay.removeAttribute("aria-modal"), this.languageSelector.setAttribute("aria-expanded", "false");
          }),
          (e.toggleOverlay = function (e) {
            this.languageListOverlay && this.focusTrap && (e.preventDefault(), this.languageListOverlay.hasAttribute("hidden") ? (this.openOverlay(), this.focusTrap.activate()) : this.focusTrap.deactivate());
          }),
          (e.toggleSearch = function (e) {
            var t;
            this.searchForm &&
            (e.preventDefault(),
              (t = "true" === this.searchToggle.getAttribute("aria-expanded")),
            this.loginToggle && "true" === this.loginToggle.getAttribute("aria-expanded") && this.toggleLogin(e),
              this.searchToggle.setAttribute("aria-expanded", t ? "false" : "true"),
              t ? this.searchForm.classList.remove("ecl-site-header-standardised__search--active") : this.searchForm.classList.add("ecl-site-header-standardised__search--active"));
          }),
          (e.toggleLogin = function (e) {
            var t;
            this.loginBox &&
            (e.preventDefault(),
              (t = "true" === this.loginToggle.getAttribute("aria-expanded")),
            this.searchToggle && "true" === this.searchToggle.getAttribute("aria-expanded") && this.toggleSearch(e),
              this.loginToggle.setAttribute("aria-expanded", t ? "false" : "true"),
              t ? this.loginBox.classList.remove("ecl-site-header-standardised__login-box--active") : this.loginBox.classList.add("ecl-site-header-standardised__login-box--active"));
          }),
          i
      );
    })(),
    C = (function () {
      function n(e, t) {
        (t = (void 0 === t ? {} : t).sortSelector), (t = void 0 === t ? "[data-ecl-table-sort-toggle]" : t);
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e), (this.sortSelector = t), (this.sortHeadings = null), (this.handleClickOnSort = this.handleClickOnSort.bind(this));
      }
      (n.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).TABLE), (t = new n(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLTable = t);
      }),
        (n.createSortIcon = function (e) {
          var t = document.createElement("span");
          t.innerHTML = '<svg width="48" height="48" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path id="a" d="m32 30-8-13-8 13z"/></defs><use xlink:href="#a"/></svg>';
          t = t.children[0];
          return t.removeAttribute("height"), t.removeAttribute("width"), t.setAttribute("focusable", !1), t.setAttribute("aria-hidden", !0), t.setAttribute("class", "ecl-table__icon ecl-icon ecl-icon--l " + e), t;
        });
      var e = n.prototype;
      return (
        (e.init = function () {
          var i = this;
          (this.sortHeadings = o(this.sortSelector, this.element)),
          this.sortHeadings &&
          this.sortHeadings.forEach(function (e) {
            var t = document.createElement("span");
            t.classList.add("ecl-table__arrow"),
              t.appendChild(n.createSortIcon("ecl-table__icon-up")),
              t.appendChild(n.createSortIcon("ecl-table__icon-down")),
              e.appendChild(t),
              e.addEventListener("click", i.handleClickOnSort.bind(i, e));
          });
          var e = r("tbody", this.element);
          [].concat(o("tr", e)).forEach(function (e, t) {
            e.setAttribute("data-ecl-table-order", t);
          });
        }),
          (e.destroy = function () {
            var t = this;
            this.sortHeadings &&
            this.sortHeadings.forEach(function (e) {
              e.removeEventListener("click", t.handleClickOnSort);
            });
          }),
          (e.handleClickOnSort = function (t) {
            for (var e = t.closest("table"), i = r("tbody", e), n = t.getAttribute("aria-sort"), s = 0, l = t.previousElementSibling; l; )
              (s += l.getAttribute("colspan") ? Number(l.getAttribute("colspan")) : 1), (l = l.previousElementSibling);
            function a(n, s) {
              return function (e, t) {
                return (i = (s ? e : t).children[n].textContent), (e = (s ? t : e).children[n].textContent), "" === i || "" === e || Number.isNaN(+i) || Number.isNaN(+e) ? i.toString().localeCompare(e) : i - e;
                var i;
              };
            }
            n =
              "descending" === n
                ? ([].concat(o("tr", i)).forEach(function (e, t) {
                  t = r("[data-ecl-table-order='" + t + "']");
                  i.appendChild(t);
                }),
                  null)
                : ([]
                  .concat(o("tr", i))
                  .sort(a(s, "ascending" !== n))
                  .forEach(function (e) {
                    return i.appendChild(e);
                  }),
                  "ascending" === n ? "descending" : "ascending");
            this.sortHeadings.forEach(function (e) {
              n && e === t ? e.setAttribute("aria-sort", n) : e.removeAttribute("aria-sort");
            });
          }),
          n
      );
    })(),
    X = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.listSelector,
          s = void 0 === n ? ".ecl-tabs__list" : n,
          l = i.listItemsSelector,
          a = void 0 === l ? ".ecl-tabs__item:not(.ecl-tabs__item--more)" : l,
          o = i.moreItemSelector,
          r = void 0 === o ? ".ecl-tabs__item--more" : o,
          h = i.moreButtonSelector,
          t = void 0 === h ? ".ecl-tabs__toggle" : h,
          n = i.moreLabelSelector,
          l = void 0 === n ? ".ecl-tabs__toggle .ecl-button__label" : n,
          o = i.prevSelector,
          h = void 0 === o ? ".ecl-tabs__prev" : o,
          n = i.nextSelector,
          o = void 0 === n ? ".ecl-tabs__next" : n,
          n = i.attachClickListener,
          n = void 0 === n || n,
          i = i.attachResizeListener,
          i = void 0 === i || i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.listSelector = s),
          (this.listItemsSelector = a),
          (this.moreItemSelector = r),
          (this.moreButtonSelector = t),
          (this.moreLabelSelector = l),
          (this.prevSelector = h),
          (this.nextSelector = o),
          (this.attachClickListener = n),
          (this.attachResizeListener = i),
          (this.list = null),
          (this.listItems = null),
          (this.moreItem = null),
          (this.moreButton = null),
          (this.moreButtonActive = !1),
          (this.moreLabel = null),
          (this.moreLabelValue = null),
          (this.dropdown = null),
          (this.dropdownItems = null),
          (this.allowShift = !0),
          (this.buttonNextSize = 0),
          (this.index = 0),
          (this.total = 0),
          (this.handleClickOnToggle = this.handleClickOnToggle.bind(this)),
          (this.handleResize = this.handleResize.bind(this)),
          (this.closeMoreDropdown = this.closeMoreDropdown.bind(this)),
          (this.shiftTabs = this.shiftTabs.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).TABS), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLTabs = t);
      };
      var e = i.prototype;
      return (
        (e.init = function () {
          var t = this;
          (this.list = r(this.listSelector, this.element)),
            (this.listItems = o(this.listItemsSelector, this.element)),
            (this.moreItem = r(this.moreItemSelector, this.element)),
            (this.moreButton = r(this.moreButtonSelector, this.element)),
            (this.moreLabel = r(this.moreLabelSelector, this.element)),
            (this.moreLabelValue = this.moreLabel.innerText),
            (this.btnPrev = r(this.prevSelector, this.element)),
            (this.btnNext = r(this.nextSelector, this.element)),
            (this.total = this.listItems.length),
          this.moreButton &&
          ((this.dropdown = document.createElement("ul")),
            this.dropdown.classList.add("ecl-tabs__dropdown"),
            this.listItems.forEach(function (e) {
              t.dropdown.appendChild(e.cloneNode(!0));
            }),
            this.moreItem.appendChild(this.dropdown),
            (this.dropdownItems = o(".ecl-tabs__dropdown .ecl-tabs__item", this.element)),
            this.handleResize()),
          this.btnNext && (this.buttonNextSize = this.btnNext.getBoundingClientRect().width),
          this.attachClickListener && this.moreButton && this.moreButton.addEventListener("click", this.handleClickOnToggle),
          this.attachClickListener && document && this.moreButton && document.addEventListener("click", this.closeMoreDropdown),
          this.attachClickListener && this.btnNext && this.btnNext.addEventListener("click", this.shiftTabs.bind(this, "next", !0)),
          this.attachClickListener && this.btnPrev && this.btnPrev.addEventListener("click", this.shiftTabs.bind(this, "prev", !0)),
          this.attachResizeListener && window.addEventListener("resize", this.handleResize);
        }),
          (e.destroy = function () {
            this.attachClickListener && this.moreButton && this.moreButton.removeEventListener("click", this.handleClickOnToggle),
            this.attachClickListener && document && this.moreButton && document.removeEventListener("click", this.closeMoreDropdown),
            this.attachClickListener && this.btnNext && this.btnNext.removeEventListener("click", this.shiftTabs),
            this.attachClickListener && this.btnPrev && this.btnPrev.removeEventListener("click", this.shiftTabs),
            this.attachResizeListener && window.removeEventListener("resize", this.handleResize);
          }),
          (e.shiftTabs = function (e) {
            (this.index = "next" === e ? this.index + 1 : this.index - 1), (this.btnPrev.style.display = 1 <= this.index ? "block" : "none"), (this.btnNext.style.display = this.index >= this.total - 1 ? "none" : "block");
            var t = 0 === this.index ? 0 : this.btnPrev.getBoundingClientRect().width + 13,
              e = Math.ceil(this.listItems[this.index].offsetLeft - t),
              t = Math.ceil(this.list.getBoundingClientRect().width - this.element.getBoundingClientRect().width);
            t < e && ((this.btnNext.style.display = "none"), (e = t)), (this.list.style.transitionDuration = "0.4s"), (this.list.style.transform = "translate3d(-" + e + "px, 0px, 0px)");
          }),
          (e.handleClickOnToggle = function () {
            this.dropdown.classList.toggle("ecl-tabs__dropdown--show"), this.moreButton.setAttribute("aria-expanded", this.dropdown.classList.contains("ecl-tabs__dropdown--show"));
          }),
          (e.handleResize = function () {
            var i = this;
            if (
              ("none" === window.getComputedStyle(this.moreButton).display && this.closeMoreDropdown(this),
                (this.list.style.transform = "translate3d(0px, 0px, 0px)"),
              Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) <= 480)
            ) {
              (this.index = 1), (this.list.style.transitionDuration = "0.4s"), this.shiftTabs(this.index), this.moreItem && this.moreItem.setAttribute("aria-hidden", "true");
              var t = 0;
              return (
                this.listItems.forEach(function (e) {
                  e.setAttribute("aria-hidden", "false"), (t += Math.ceil(e.getBoundingClientRect().width));
                }),
                  (this.list.style.width = t + "px"),
                  (this.btnNext.style.display = "block"),
                  void (this.btnPrev.style.display = "none")
              );
            }
            (this.btnNext.style.display = "none"), (this.btnPrev.style.display = "none"), (this.list.style.width = "auto");
            var n = this.moreButton.getBoundingClientRect().width + 25,
              s = [],
              l = this.list.getBoundingClientRect().width;
            (this.moreButtonActive = !1),
              this.listItems.forEach(function (e, t) {
                e.setAttribute("aria-hidden", "false"),
                  l >= n + e.getBoundingClientRect().width && !s.includes(t - 1)
                    ? (n += e.getBoundingClientRect().width)
                    : (e.setAttribute("aria-hidden", "true"), e.childNodes[0].classList.contains("ecl-tabs__link--active") && (i.moreButtonActive = !0), s.push(t));
              }),
              this.moreButtonActive ? this.moreButton.classList.add("ecl-tabs__toggle--active") : this.moreButton.classList.remove("ecl-tabs__toggle--active"),
              s.length
                ? (this.moreItem.setAttribute("aria-hidden", "false"),
                  (this.moreLabel.textContent = this.moreLabelValue.replace("%d", s.length)),
                  this.dropdownItems.forEach(function (e, t) {
                    s.includes(t) ? e.setAttribute("aria-hidden", "false") : e.setAttribute("aria-hidden", "true");
                  }))
                : this.moreItem.setAttribute("aria-hidden", "true");
          }),
          (e.closeMoreDropdown = function (e) {
            for (var t = e.target; t; ) {
              if (t === this.moreButton) return;
              t = t.parentNode;
            }
            this.moreButton.setAttribute("aria-expanded", !1), this.dropdown.classList.remove("ecl-tabs__dropdown--show");
          }),
          i
      );
    })(),
    ee = (function () {
      function i(e, t) {
        var i = void 0 === t ? {} : t,
          n = i.buttonSelector,
          s = void 0 === n ? "[data-ecl-timeline-button]" : n,
          l = i.labelSelector,
          t = void 0 === l ? "[data-ecl-label]" : l,
          n = i.labelExpanded,
          l = void 0 === n ? "data-ecl-label-expanded" : n,
          n = i.labelCollapsed,
          n = void 0 === n ? "data-ecl-label-collapsed" : n,
          i = i.attachClickListener,
          i = void 0 === i || i;
        if (!e || e.nodeType !== Node.ELEMENT_NODE) throw new TypeError("DOM element should be given to initialize this widget.");
        (this.element = e),
          (this.buttonSelector = s),
          (this.labelSelector = t),
          (this.labelExpanded = l),
          (this.labelCollapsed = n),
          (this.attachClickListener = i),
          (this.button = null),
          (this.label = null),
          (this.handleClickOnButton = this.handleClickOnButton.bind(this));
      }
      i.autoInit = function (e, t) {
        (t = (void 0 === t ? {} : t).TIMELINE), (t = new i(e, void 0 === t ? {} : t));
        return t.init(), (e.ECLTimeline = t);
      };
      var e = i.prototype;
      return (
        (e.init = function () {
          (this.button = r(this.buttonSelector, this.element)), (this.label = r(this.labelSelector, this.element)), this.attachClickListener && this.button && this.button.addEventListener("click", this.handleClickOnButton);
        }),
          (e.destroy = function () {
            this.attachClickListener && this.button && this.button.removeEventListener("click", this.handleClickOnButton);
          }),
          (e.handleClickOnButton = function () {
            var e = "true" === this.button.getAttribute("aria-expanded");
            return (
              this.button.setAttribute("aria-expanded", e ? "false" : "true"),
                e ? (this.element.removeAttribute("data-ecl-timeline-expanded"), this.button.blur(), this.button.focus()) : this.element.setAttribute("data-ecl-timeline-expanded", "true"),
                this.label && !e && this.button.hasAttribute(this.labelExpanded)
                  ? (this.label.innerHTML = this.button.getAttribute(this.labelExpanded))
                  : this.label && e && this.button.hasAttribute(this.labelCollapsed) && (this.label.innerHTML = this.button.getAttribute(this.labelCollapsed)),
                this
            );
          }),
          i
      );
    })();
  return (
    (e.Accordion = s),
      (e.BreadcrumbCore = p),
      (e.BreadcrumbHarmonised = b),
      (e.BreadcrumbStandardised = m),
      (e.Carousel = l),
      (e.Datepicker = f),
      (e.Expandable = y),
      (e.FileDownload = w),
      (e.FileUpload = S),
      (e.Gallery = W),
      (e.InpageNavigation = U),
      (e.Menu = K),
      (e.Message = G),
      (e.NewsTicker = $),
      (e.Select = Q),
      (e.SiteHeaderCore = Z),
      (e.SiteHeaderHarmonised = J),
      (e.SiteHeaderStandardised = t),
      (e.Table = C),
      (e.Tabs = X),
      (e.Timeline = ee),
      (e.autoInit = function (e) {
        var t = void 0 === e ? {} : e,
          e = t.root,
          e = void 0 === e ? document : e,
          n = (function (e, t) {
            if (null == e) return {};
            for (var i, n = {}, s = Object.keys(e), l = 0; l < s.length; l++) (i = s[l]), 0 <= t.indexOf(i) || (n[i] = e[i]);
            return n;
          })(t, a);
        if (!ECL) throw new TypeError("Called autoInit but ECL is not present");
        function i() {
          l.filter(function (e) {
            return "true" !== e.getAttribute("data-ecl-auto-initialized");
          }).forEach(function (e) {
            var t = e.getAttribute("data-ecl-auto-init");
            if (!t) throw new TypeError("(ecl-auto-init) " + t + " data-ecl-auto-init is empty");
            var i = ECL[t];
            if ("function" != typeof i) throw new TypeError("(ecl-auto-init) Could not find '" + t + "'");
            if ("function" != typeof i.autoInit) throw new TypeError("(ecl-auto-init) Could not find autoInit for '" + t + "'");
            i = i.autoInit(e, n);
            s.push(i), e.setAttribute("data-ecl-auto-initialized", "true");
          });
        }
        var s = [],
          l = o("[data-ecl-auto-init]", e),
          e = i;
        return (
          i(),
            {
              update: e,
              destroy: function () {
                l.filter(function (e) {
                  return "true" === e.getAttribute("data-ecl-auto-initialized");
                }).forEach(function (e) {
                  var t = e.getAttribute("data-ecl-auto-init");
                  t && ECL[t] && ECL[t].destroy && (ECL[t].destroy(), e.removeAttribute("data-ecl-auto-initialized"));
                });
              },
              components: s,
            }
        );
      }),
      Object.defineProperty(e, "__esModule", {
        value: !0,
      }),
      e
  );
})({}, moment);
