$.sap.require("sap.ui.model.resource.ResourceModel");

$.extend(String, {
	interpolate: function() {
		var args = [].slice.call(arguments), template = args.shift() || "";
		$.each(args, function(i, v) {
			template = template.replace(/\$\{[^{}]*\}/, v);
		});
		return template;
	}
});

$.extend(String.prototype, {
	interpolate: function() {
		var args = [].slice.call(arguments), template = this;
		$.each(args, function(i, v) {
			template = template.replace(/\$\{[^{}]*\}/, v);
		});
		return template;
	},
	capitalize: function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	}
});

if (!$.app) {
	$.app = {};
}

$.extend(true, $.app, {

LOG: {
	ENABLE_SUCCESS: false,
	ENABLE_FAILURE: true,
	DATA: {} // 프로그램 실행중 남기고 싶은 로그성 데이터를 자유롭게 남김. ZUI5_SF_Eval360ReviewApp.List.controller.js 참고
},
Auth: {
	ESS: "E",
	MSS: "M",
	HASS: "H",
},
ConType: {
	CHECK: "0",
	READ: "1",
	UPDATE: "2",
	CREATE: "3",
	DELETE: "4"
},
log: function() {
	var args = arguments;
	setTimeout(function() {
		try {
			if (parent && parent._basis) {
				parent._basis.log.apply(null, [].slice.call(args));
			} else {
				if (typeof window.console !== "undefined" && typeof window.console.log === "function") {
					window.console.log.apply(null, [].slice.call(args));
				}
			}
		} catch(e) {
			// SF 평가 메뉴 접속시 parent 객체 참조시 cross-origin 오류 발생
		}
	}, 0);
},
init: function() {
	if (window._init_sequence_logging) {
		$.app.log("common.AppBasis.init called.");
	}

	if ($.app.APP_TILE) {
		$(document).attr("title", $.app.APP_TILE);
		try {
			if (parent) {
				parent.$(document).attr("title", $.app.APP_TILE);
			}
		} catch(e) {
			// SF 평가 메뉴 접속시 parent 객체 참조시 cross-origin 오류 발생
		}
	}

	checkAppPrefilter();

	sap.ui.getCore().attachInit(function() {
		new Promise(function(resolve, reject) {
			try {
				$.sap.registerModulePath("common", "common");
				$.sap.registerModulePath("control", "control");
				$.sap.registerModulePath("fragment", "fragment");
				$.sap.registerModulePath("ZUI5_SF", "ZUI5_SF");
				if ($.app.registerModulePaths && Object.keys($.app.registerModulePaths).length) {
					$.map($.app.registerModulePaths, function(v, k) {
						$.sap.registerModulePath(k, v);
					});
				}

				if ($.app.APP_ID !== "ZUI5_HR_ActApp.ActAppMain") {	// 발령제외
					$.sap.includeStyleSheet("css/lotte-chemical.css");
				}
				if ($.app.includeStyleSheets instanceof Array && $.app.includeStyleSheets.length) {
					$.map($.app.includeStyleSheets, function(v) {
						$.sap.includeStyleSheet(v);
					});
				}

				sap.ui.localResources($.app.CONTEXT_PATH);

				if ($.app.APP_TYPE === "M") {
					$.app.APP_ID = $.app.APP_ID.split(".").join($.app.getDeviceSuffix());
				}
				if (window._init_sequence_logging) {
					$.app.log("common.AppBasis.init - sap.ui.jsview('app-container', '" + $.app.APP_SFMAIN_ID + ") called.");
				}
				$.app.container = sap.ui.jsview("app-container", $.app.APP_SFMAIN_ID);

				resolve();
			} catch(e) {
				reject(e);
			}
		})
		.then(function() {
			$("body").fadeOut("slow", function() {
				$("#ui-body").empty().removeAttr("style");
				$.app.container.placeAt("ui-body");
				$(this).fadeIn("slow");
			});
		});
	});
},
byId: function(id) {
	return sap.ui.getCore().byId(id);
},
createId: function(id) {
	return $.app.getView().createId(id);
},
byViewId: function(id) {
	return $.app.getView().byId(id);
},
getAuth: function() {
	return $.app.APP_AUTH || $.app.Auth.ESS;
},
getDestination: function() {
	if (!$.app.DEST) {
		var param = $.map(location.search.replace(/\?/, "").split(/&/), function(p) {
			var pair = p.split(/=/);
			if (pair[0] === "s4hana") { return pair[1]; }
		})[0];

		$.app.DEST = (common.Common.isPRD() || param === "legacy") ? "/s4hana" : "/s4hana-pjt"
	}

	return $.app.DEST;
},
setModel: function(modelName) {
	try {
		var serviceURL = $.app.getDestination() + "/sap/opu/odata/sap/" + modelName,
			oModel = new sap.ui.model.odata.ODataModel(serviceURL, true, undefined, undefined, undefined, undefined, undefined, false);

		oModel.setCountSupported(false);
		sap.ui.getCore().setModel(oModel, modelName);

		setTimeout(function() {
			common.Common.setMetadataModel(oModel, modelName);
		}, 0);
	} catch(e) {
		common.Common.log(e);
	}
},
getModel: function(id, viewId) {
	return $.app.getView(viewId).getModel(id) || sap.ui.getCore().getModel(id);
},
getView: function(id) {
	return $.app.byId(id || $.app.APP_ID);
},
getController: function(id) {
	return $.app.getView(id).getController();
},
getBundleText: function(key, values) {
	return $.app.getView().getModel("i18n").getResourceBundle().getText(key, values);
},
geti18nResource: function() {
	return new sap.ui.model.resource.ResourceModel({
		bundleUrl: "i18n/i18n.properties",
		supportedLocales: [""],
		fallbackLocale: ""
	}).getResourceBundle();
},
getDeviceSuffix: function() {
	// "phone", "tablet", "desktop"
	return (sap.ui.Device.system.desktop === true) ? "." 
			: (sap.ui.Device.system.phone === true || sap.ui.Device.system.tablet === true) ? ".m." 
			: ".";
},
getDeviceSystem: function() {
	// sap.ui.Device.system.SYSTEMTYPE.DESKTOP
	// sap.ui.Device.system.SYSTEMTYPE.TABLET
	// sap.ui.Device.system.SYSTEMTYPE.PHONE
	return (sap.ui.Device.system.desktop === true) ? sap.ui.Device.system.SYSTEMTYPE.DESKTOP
			: (sap.ui.Device.system.phone === true) ? sap.ui.Device.system.SYSTEMTYPE.PHONE		
			: (sap.ui.Device.system.tablet === true) ? sap.ui.Device.system.SYSTEMTYPE.PHONE
			: "";
},
spinner: function(show) {
	setTimeout(function() {
		$(".spinner-container em")[show ? "show" : "hide"]();
	}, 0);
},
getViewInitStyleClasses: function() {
	var s = $.app.VIEW_STYLE_CLASSES;
	if (typeof s === "string") {
		return s;
	} else if (s instanceof Array) {
		return s.join(" ");
	} else {
		return "sapUiSizeCompact";
	}
}

});

function checkAppPrefilter() {

	if (typeof AppPrefilter !== "function" || typeof window._menu_prefilter === "undefined") {
		$.app.log("common.AppBasis.init - AppPrefilter.js <script> 선언이 필요합니다.");
		try {
			if (parent && parent._gateway) {
				parent._gateway.alert({ title: "오류", html: "<p>개발 오류입니다.\n해당 프로그램 개발자에게 AppPrefilter script 추가를 요청하세요.</p>" });
				setTimeout(function () {
					parent.$('.ess-body .menu-spinner-wrapper').toggleClass('d-none', true);
				}, 0);
			} else {
				alert("개발 오류입니다.\n해당 프로그램 개발자에게 AppPrefilter script 추가를 요청하세요.");
			}
		} catch(e) {
			// SF 평가 메뉴 접속시 parent 객체 참조시 cross-origin 오류 발생
			alert("개발 오류입니다.\n해당 프로그램 개발자에게 AppPrefilter script 추가를 요청하세요.");
		}
		location.href = "Error.html";
		return;
	}

	if (!window._menu_prefilter.isMenuAuthorized()) {
		$.app.log("common.AppBasis.init - Unauthorized menu.");
		location.href = "Error.html";
		return;
	}
}