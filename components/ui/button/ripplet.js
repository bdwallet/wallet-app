(function(e, t) {
	typeof exports === "object" && typeof module !== "undefined" ? module.exports = t() : typeof define === "function" && define.amd ? define(t) : e.ripplet = t()
})(this, function() {
	"use strict";
	var e = {
		className: "",
		color: "rgba(0, 0, 0, .1)",
		opacity: null,
		spreadingDuration: ".4s",
		spreadingDelay: "0s",
		spreadingTimingFunction: "linear",
		clearingDuration: "1s",
		clearingDelay: "0s",
		clearingTimingFunction: "ease-in-out"
	};

	function t(e, t, el) {
		var r = e.currentTarget,
			o = e.clientX,
			a = e.clientY;
		if (r instanceof Element && typeof o === "number" && typeof a === "number") {
			return n({
				clientX: o,
				clientY: a
			}, r.getBoundingClientRect(), window.getComputedStyle(r), i(t),el)
		} else {
			return
		}
	}
	function n(e, t, n, i,el) {
		var r = document;
		var o = el.appendChild(r.createElement("div"));
		
		{
			var a = o.style;
			a.position = "absolute";
			a.overflow = "hidden";
			a.pointerEvents = "none";
			a.left = 0;
			a.top = 0;
			a.width = '100%';
			a.height = '100%';
			a.zIndex = "" + ((n.zIndex && parseInt(n.zIndex, 10) || 0) + 1);
			a.borderTopLeftRadius = n.borderTopLeftRadius;
			a.borderTopRightRadius = n.borderTopRightRadius;
			a.borderBottomLeftRadius = n.borderBottomLeftRadius;
			a.borderBottomRightRadius = n.borderBottomRightRadius;
			a.opacity = i.opacity
		}
		var c = o.appendChild(r.createElement("div"));
		c.className = i.className; {
			var d = Math.max(e.clientX - t.left, t.right - e.clientX);
			var l = Math.max(e.clientY - t.top, t.bottom - e.clientY);
			var s = Math.sqrt(d * d + l * l);
			var p = c.style;
			p.backgroundColor = i.color;
			p.width = s * 2 + "px";
			p.height = s * 2 + "px";
			p.marginLeft = e.clientX - t.left - s + "px";
			p.marginTop = e.clientY - t.top - s + "px";
			p.borderRadius = "50%";
			p.transitionProperty = "transform,opacity";
			p.transitionDuration = i.spreadingDuration + "," + i.clearingDuration;
			p.transitionTimingFunction = i.spreadingTimingFunction + "," + i.clearingTimingFunction;
			p.transitionDelay = i.spreadingDelay + "," + i.clearingDelay;
			p.transform = "scale(0)";
			p.opacity = "1";
			setTimeout(function() {
				p.transform = "scale(1)";
				p.opacity = "0"
			})
		}
		c.addEventListener("transitionend", function(e) {
			if (e.propertyName === "opacity" && o.parentNode)o.parentNode.removeChild(o)
		});
		return o
	}
	function i(t) {
		if (!t) {
			return e
		}
		var n = {};
		Object.keys(e).forEach(function(i) {
			n[i] = t.hasOwnProperty(i) ? t[i] : e[i]
		});
		return n
	}
	var r = Object.freeze({
		defaultOptions: e,
	default:
		t
	});
	var o = Object.keys(r).reduce(function(e, t) {
		return e[t] = r[t], e
	}, t);
	return o
});