/* global moment:true LotteChemMap:true SouthKoreaBounds:true */
sap.ui.define([
	"common/Common",
	"common/moment-with-locales",
	"common/map/LotteChemMap",
	"common/map/SouthKoreaBounds",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel"
], function(
	Common,
	momentjs,
	LotteChemMap,
	SouthKoreaBounds,
	MessageBox,
	JSONModel
) {
"use strict";

var Handler = {

	oController: null,
	oDialog: null,
	oModel: new JSONModel({
		LccMap: {
			Departure: null,
			Destination: null,
			Params: {
				start: null,
				goal: null,
				cartype: null,
				fueltype: null,
				lang: null,
			},
			Results: {
				distance: null,
				tollFare: null,
				fuelPrice: null
			}
		}
	}),
	callback: null,

	// DialogHandler 호출 function
	get: function(oController, params, callback) {

		params = params || {};

		this.oController = oController;
		this.callback = callback;

		this.oModel.setProperty("/LccMap", {
			Departure: null,
			Destination: null,
			Params: {
				start: null,
				goal: null,
				cartype: params.cartype || "1",
				fueltype: params.fueltype,
				lang: params.lang || "ko",
			},
			Results: {
				distance: null,
				tollFare: null,
				fuelPrice: null
			}
		});

		oController.LccMapDialogHandler = this;

		return this;
	},

	// DialogHandler 호출 function
	getLoadingProperties: function() {

		return {
			id: "LccMapDialog",
			name: "ZUI5_HR_BusinessTrip.fragment.LccMapDialog",
			type: "JS",
			controller: this.oController
		};
	},

	// DialogHandler 호출 function
	once: function() {

		return Common.getPromise(function() {
			this.SouthKoreaBounds = new SouthKoreaBounds();

			this.LccMap = new LotteChemMap().get("LccMap");
			this.LccMap.setOptions("maxBounds", this.SouthKoreaBounds.get());
		}.bind(this));
	},

	// DialogHandler 호출 function
	getParentView: function() {

		return this.oController.getView();
	},

	// DialogHandler 호출 function
	getModel: function() {

		return this.oModel;
	},

	// DialogHandler 호출 function
	getDialog: function() {

		return this.oDialog;
	},

	// DialogHandler 호출 function
	setDialog: function(oDialog) {

		this.oDialog = oDialog;

		return this;
	},

	onBeforeOpen: function() {

		this.oDialog.setBusy(true, 0);

		return Common.getPromise(function() {
			this.searchPath();
		}.bind(this));
	},

	getFuelTypeMap: function() {

		return {
			gasoline: "휘발유",
			highgradegasoline: "고급 휘발유",
			diesel: "경유",
			lpg: "LPG"
		};
	},

	getLangMap: function() {

		return {
			ko: "한국어",
			en: "영어",
			ja: "일본어",
			zh: "중국어 간체"
		};
	},

	// 지역 검색
	searchPlace: function(oEvent) {

		var value = oEvent.getSource().getValue();
		$.getJSON({
			// url: "https://openapi.naver.com/v1/search/local",
			// url: "https://essproxyyzdueo754l.jp1.hana.ondemand.com/ESSProxy/local",
			url: Common.getJavaOrigin(this.oController, "/local"),
			data: {
				// sort: "",
				// start: 1,
				display: 5,
				query: value
			},
			success: function() {
				Common.log("searchPlace success", arguments);
				this.oDialog.setBusy(false);
			}.bind(this),
			error: function() {
				Common.log("searchPlace error", arguments);
				this.oDialog.setBusy(false);
			}.bind(this)
		});
	},

	// 주소 -> 좌표
	searchCoord: function(oEvent) {

		var value = oEvent.getSource().getValue();
		$.getJSON({
			// url: "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode",
			// url: "https://essproxyyzdueo754l.jp1.hana.ondemand.com/ESSProxy/geocode",
			url: Common.getJavaOrigin(this.oController, "/geocode"),
			data: {
				// coordinate: "",
				// filter: "",
				// page: "",
				// count: "",
				query: value
			},
			success: function() {
				Common.log("retrieveCoord success", arguments);
				this.oDialog.setBusy(false);
			}.bind(this),
			error: function() {
				Common.log("retrieveCoord error", arguments);
				this.oDialog.setBusy(false);
			}.bind(this)
		});
	},

	// 경로 탐색
	searchPath: function() {

		$.getJSON({
			// url: "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving",
			// url: "https://essproxyyzdueo754l.jp1.hana.ondemand.com/ESSProxy/driving",
			url: Common.getJavaOrigin(this.oController, "/driving"),
			data: {
				start: this.oModel.getProperty("/LccMap/Params/start"),			// 출발지
				goal: this.oModel.getProperty("/LccMap/Params/goal"),			// 도착지
				fueltype: this.oModel.getProperty("/LccMap/Params/fueltype"),	// 유종
				lang: this.oModel.getProperty("/LccMap/Params/lang"),			// 언어
				// waypoints: "",												// 경유지
				option: "traoptimal",											// 탐색 옵션
				cartype: "1",													// 차종
				mileage: 14														// 연비
			},
			success: function(data) {
				Common.log("searchPath success", arguments);

				if (data.code === 0) {
					var summary = ((data.route || {}).traoptimal || [{}])[0].summary || {};
					this.oModel.setProperty("/LccMap/Results/distance", Number((Common.toNumber(summary.distance) * 0.001).toFixed()));	// 거리
					this.oModel.setProperty("/LccMap/Results/tollFare", Common.toNumber(summary.tollFare));								// 통행요금
					this.oModel.setProperty("/LccMap/Results/fuelPrice", Common.toNumber(summary.fuelPrice));							// 유류비
				} else {
					this.oModel.setProperty("/LccMap/Results", {});
				}
				setTimeout(function() {
					alert(data.message || "오류가 발생하였습니다.\n잠시 후 다시 시도해주세요.");
					this.oDialog.setBusy(false);
				}, 500);
			}.bind(this),
			error: function() {
				Common.log("searchPath error", arguments);
				this.oDialog.setBusy(false);
			}.bind(this)
		});
	},

	setResult: function() {

		var p = this.oModel.getProperty("/LccMap/Results");
		return Common.getPromise(function() {
			if (this.callback) {
				this.callback(p);
			}
		}.bind(this))
		.then(function() {
			this.oDialog.close();
		}.bind(this));
	}

};

return Handler;

});