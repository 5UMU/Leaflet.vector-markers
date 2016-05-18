(function() {
  (function(window, document, undefined_) {
    "use strict";
    L.VectorMarkers = {};
    L.VectorMarkers.version = "1.0.0";
    L.VectorMarkers.MAP_PIN = 'M16,1 C7.7146,1 1,7.65636364 1,15.8648485 C1,24.0760606 16,51 16,51 C16,51 31,24.0760606 31,15.8648485 C31,7.65636364 24.2815,1 16,1 L16,1 Z';
	L.VectorMarkers.MAP_STAR = 'M25,36 L39.695,45.225 35.462,28.399 48.776,17.275 31.466,16.101 25,0 18.534,16.101 1.224,17.275 14.538,28.399 10.305,45.225 Z';
    L.VectorMarkers.Icon = L.Icon.extend({
      options: {
        iconSize: [30, 50],
        iconAnchor: [15, 50],
        popupAnchor: [2, -40],
        shadowAnchor: [7, 45],
        shadowSize: [54, 51],
        className: "vector-marker",
        prefix: "fa",
        spinClass: "fa-spin",
        extraClasses: "",
        icon: "home",
		markerType: 'pin',
        markerColor: "blue",
		colorRotation: 0,
        iconColor: "white"
      },
      initialize: function(options) {
        return options = L.Util.setOptions(this, options);
      },
      createIcon: function(oldIcon) {
        var div, icon, options, pin_path, gradient_tag, svg_width, svg_height;
        div = (oldIcon && oldIcon.tagName === "DIV" ? oldIcon : document.createElement("div"));
        options = this.options;
		options.className += ' ' + options.markerType;
		if (options.markerType == 'pin') {
			options.extraClasses = ('pin ' + options.extraClasses).trim(); 
			pin_path = L.VectorMarkers.MAP_PIN;
			svg_width = '32';
			svg_height = '52';
		}
		else if (options.markerType == 'star') {
			options.extraClasses = ('star ' + options.extraClasses).trim(); 
			options.iconSize = [50, 50];
			pin_path = L.VectorMarkers.MAP_STAR;
			svg_width = '50';
			svg_height = '50';
		}
        if (options.icon) {
          icon = this._createInner();
        }
		var uniqueID = window.performance.now();
		var degree = (options.colorRotation - 90) % 360;
		var radian = degree / 180 * Math.PI;
		var segment = Math.floor(radian / Math.PI * 2) + 2;
		var diagonal =  (1/2 * segment + 1/4) * Math.PI;
		var op = Math.cos(Math.abs(diagonal - radian)) * Math.sqrt(2);
		var x = op * Math.cos(radian);
		var y = op * Math.sin(radian);
		gradient_tag = '<defs>' + '<linearGradient id="' + uniqueID + '" x1="' + (x < 0 ? 1 : 0) + '" y1="' + (y < 0 ? 1 : 0) + '" x2="' + (x >= 0 ? x : x + 1) + '" y2="' + (y >= 0 ? y : y + 1) + '">';
		if (typeof options.markerColor != 'string') {
			options.markerColor.forEach(function(color, index) {
				var fraction = 1.00 / (options.markerColor.length > 1 ? (options.markerColor.length - 1) : 1) * index;
				gradient_tag += '<stop offset="' + fraction + '" style="stop-color:' + color + ';stop-opacity:1"></stop>'
			});
		}
		else {
			gradient_tag += '<stop offset="0" style="stop-color:' + options.markerColor + ';stop-opacity:1"></stop>'
		}
		gradient_tag += '</linearGradient>' + '</defs>';
        div.innerHTML = '<svg width="' + svg_width + 'px" height="' + svg_height + 'px" viewBox="0 0 ' + svg_width + ' ' + svg_height + '" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' + gradient_tag + '<path d="' + pin_path + '" fill="url(#' + uniqueID + ')"></path>' + icon + '</svg>';
        this._setIconStyles(div, "icon");
        this._setIconStyles(div, "icon-" + options.markerColor);
		
        return div;
      },
      _createInner: function() {
        var iconClass, iconColorClass, iconColorStyle, iconSpinClass, options;
        iconClass = void 0;
        iconSpinClass = "";
        iconColorClass = "";
        iconColorStyle = "";
        options = this.options;
        if (options.prefix === '' || options.icon.slice(0, options.prefix.length + 1) === options.prefix + "-") {
          iconClass = options.icon;
        } else {
          iconClass = options.prefix + "-" + options.icon;
        }
        if (options.spin && typeof options.spinClass === "string") {
          iconSpinClass = options.spinClass;
        }
        if (options.iconColor) {
          if (options.iconColor === "white" || options.iconColor === "black") {
            iconColorClass = "icon-" + options.iconColor;
          } else {
            iconColorStyle = "style='color: " + options.iconColor + "' ";
          }
        }
        return "<i " + iconColorStyle + "class='" + options.extraClasses + " " + options.prefix + " " + iconClass + " " + iconSpinClass + " " + iconColorClass + "'></i>";
      },
      _setIconStyles: function(img, name) {
        var anchor, options, size;
        options = this.options;
        size = L.point(options[(name === "shadow" ? "shadowSize" : "iconSize")]);
        anchor = void 0;
        if (name === "shadow") {
          anchor = L.point(options.shadowAnchor || options.iconAnchor);
        } else {
          anchor = L.point(options.iconAnchor);
        }
        if (!anchor && size) {
          anchor = size.divideBy(2, true);
        }
        img.className = "vector-marker-" + name + " " + options.className;
        if (anchor) {
          img.style.marginLeft = (-anchor.x) + "px";
          img.style.marginTop = (-anchor.y) + "px";
        }
        if (size) {
          img.style.width = size.x + "px";
          return img.style.height = size.y + "px";
        }
      },
      createShadow: function() {
        var div;
        div = document.createElement("div");
        this._setIconStyles(div, "shadow");
        return div;
      }
    });
    return L.VectorMarkers.icon = function(options) {
      return new L.VectorMarkers.Icon(options);
    };
  })(this, document);

}).call(this);
