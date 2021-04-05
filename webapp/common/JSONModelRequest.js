sap.ui.define([
	"./Common",
	"sap/base/security/encodeURLParameters",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function (Common, encodeURLParameters, MessageBox, JSONModel) {
	"use strict";

	function JSONModelRequest() {

		this.sURL = null;
		this.oParametersTemp = {
			select: null,
			filter: null,
			expand: null,
			skip: null,
			top: null
		};
		this.oParameters = {
			customPageSize: 1000
		};
	}

	$.extend(JSONModelRequest.prototype, {

		setParameter: function(key, value) {

			this.oParametersTemp[key] = value;
			return this;
		},

		getParameter: function(key) {

			var t = this.oParametersTemp;
			return key ? t[key] : t;
		},

		url: function(sURL) {

			this.sURL = sURL;
			return this;
		},

		top: function(value) {

			return this.setParameter("top", value);
		},

		skip: function(value) {

			return this.setParameter("skip", value);
		},

		select: function(value) {

			var s = this.getParameter("select");
			if (typeof s === "object" && s instanceof Array) {
				s.push(value);
			} else {
				this.setParameter("select", [value]);
			}
			return this;
		},

		filter: function(value) {

			var f = this.getParameter("filter");
			if (typeof f === "object" && f instanceof Array) {
				f.push(value);
			} else {
				this.setParameter("filter", [value]);
			}
			return this;
		},

		expand: function(value) {

			var e = this.getParameter("expand");
			if (typeof e === "object" && e instanceof Array) {
				e.push(value);
			} else {
				this.setParameter("expand", [value]);
			}
			return this;
		},

		orderby: function(value) {

			var e = this.getParameter("orderby");
			if (typeof e === "object" && e instanceof Array) {
				e.push(value);
			} else {
				this.setParameter("orderby", [value]);
			}
			return this;
		},

		customPageSize: function(i) {

			this.oParameters.customPageSize = i;
			return this;
		},

		inlinecount: function(b) {

			if (typeof b === "undefined" || b === true) {
				this.oParameters.$inlinecount = "allpages";
			} else {
				if (typeof this.oParameters.$inlinecount !== "undefined") {
					delete this.oParameters.$inlinecount;
				}
			}
			return this;
		},

		isInlinecount: function() {

			return this.oParameters.$inlinecount && this.oParameters.$inlinecount === "allpages";
		},

		getParameterMap: function() {

			var param = $.extend({}, this.oParameters),
			temp = this.oParametersTemp;

			if (temp.top) {
				param.$top = temp.top;
			}
			if (temp.skip) {
				param.$skip = temp.skip;
			}
			if (temp.select && temp.select.length) {
				param.$select = temp.select.join(",");
			}
			if (temp.filter && temp.filter.length) {
				param.$filter = temp.filter.join(" and ");
			}
			if (temp.expand && temp.expand.length) {
				param.$expand = temp.expand.join(",");
			}
			if (temp.orderby && temp.orderby.length) {
				param.$orderby = temp.orderby.join(",");
			}

			return param;
		},

		getURL: function() {

			return this.sURL;
		},

		getEncodedURL: function(parameterMap) {

			return location.origin + this.sURL + "?" + encodeURLParameters(parameterMap || this.getParameterMap());
		},

		getDecodedURL: function(parameterMap) {

			return location.origin + this.sURL + "?" + $.map(parameterMap || this.getParameterMap(), function(v, k) {
				return [k, "=", v].join("");
			}).join("&");
		},

		getEncodedQueryString: function(parameterMap) {

			return encodeURLParameters(parameterMap || this.getParameterMap());
		},

		isMultipleRequest: function() {

			return (this.getEncodedURL().length + 16) > 8192; // 16은 JSONModel이 실제 요청을 보낼때 붙이는 underscore parameter와 그 값의 길이 (ex: &_=1603696169123)
		},

		getEstimatedRequestCount: function() {

			return Math.ceil((this.getEncodedURL().length + 16) / 8192);
		}

	});

	return JSONModelRequest;
});