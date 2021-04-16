/* global moment naver */
sap.ui.define([
	"common/Common",
	"common/DialogHandler",
	"common/moment-with-locales",
	"common/map/AddressOverlay",
	"common/map/CustomLayer",
	"common/map/SouthKoreaBounds",
	"common/map/LotteChemMap",
	"./TripPlaceDialogHandler",
	"sap/m/MessageBox",
	"sap/ui/core/BusyIndicator",
	"sap/ui/model/json/JSONModel"
], function(
	Common,
	DialogHandler,
	momentjs,
	AddressOverlay,
	CustomLayer,
	SouthKoreaBounds,
	LotteChemMap,
	TripPlaceDialogHandler,
	MessageBox,
	BusyIndicator,
	JSONModel
) {
"use strict";

var Handler = {

	oController: null,
	oDialog: null,
	oModel: new JSONModel({
		LccMap: {
			Id: null,
			Departure: null,
			Destination: null,
			Params: {
				start: null,
				goal: null,
				cartype: null,
				fueltype: null,
				lang: null
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

		var fueltypeMap = {
			"1": "gasoline",
			"2": "diesel",
			"3": "lpg"
		};

		this.oModel.setProperty("/LccMap", {
			Id: params.id,
			Departure: "롯데케미칼본사",
			Destination: null,
			Distance: "0km",
			TollFare: "0" + this.oController.getBundleText("LABEL_19638"), // 원
			Params: {
				start: null,
				goal: null,
				cartype: params.cartype || "1",
				fueltype: fueltypeMap[params.fueltype],
				lang: (params.lang || "ko").toLowerCase()
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
			name: "ZUI5_HR_BusinessTripMap.fragment.LccMapDialog",
			type: "JS",
			controller: this.oController
		};
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

		return Common.getPromise(function() {
		}.bind(this));
	},

	onAfterOpen: function() {

		Common.getPromise(true, function(resolve) {
			this.LccMap = new LotteChemMap({
				id: this.getMapId(),
				coord: new naver.maps.LatLng(37.5125701, 127.1025624), // map center
				maxBounds: new SouthKoreaBounds(),
				functionProvider: this
			});
			resolve();
		}.bind(this))
		.then(function() {
			setTimeout(function() {
				this.LccMap.get().destroy();

				this.LccMap = new LotteChemMap({
					id: this.getMapId(),
					coord: new naver.maps.LatLng(37.5125701, 127.1025624), // map center
					maxBounds: new SouthKoreaBounds(),
					functionProvider: this
				});

				this.LccMap.searchLocal(this.oModel.getProperty("/LccMap/Departure"), this.LccMap.PLACE_TARGET.DEPARTURE);
			}.bind(this), 500);

			$(document)
				.off('click', '.button-departure')
				.on('click', '.button-departure', function() {
					this.LccMap.setPlace(this.LccMap.PLACE_TARGET.DEPARTURE);
				}.bind(this));
			$(document)
				.off('click', '.button-destination')
				.on('click', '.button-destination', function() {
					this.LccMap.setPlace(this.LccMap.PLACE_TARGET.DESTINATION);
				}.bind(this));
		}.bind(this));
	},

	log: function() {

		Common.log.apply(null, [].slice.call(arguments));
	},

	spinner: function(onoff) {

		setTimeout(function() {
			if (onoff) {
				BusyIndicator.show(0);
			} else {
				BusyIndicator.hide();
			}
		}, 0);
	},

	alert: function(message) {

		MessageBox.alert(message);
	},

	getURL: function(path) {

		return Common.getJavaOrigin(this.oController, path);
	},

	getPathSearchOptions: function() {
/*
		option = {
			traoptimal:			실시간 최적(Default),
			trafast:			실시간 빠른길,
			tracomfort:			실시간 편한길,
			traavoidtoll:		무료 우선,
			traavoidcaronly:	자동차 전용도로 회피 우선
		}
		cartype = {
			1: 1종(소형차) 2축 차량. 윤폭 279.4mm 이하 승용차, 소형승합차, 소형화물차(Default),
			2: 2종(중형차) 2축 차량. 윤폭 279.4mm 초과, 윤거 1,800mm 이하 중형승합차, 중형화물차,
			3: 3종(대형차) 2축 차량. 윤폭 279.4mm 초과, 윤거 1,800mm 초과 대형승합차, 2축 대형화물차,
			4: 4종(대형화물차) 3축 대형화물차,
			5: 5종(특수화물차) 4축 이상 특수화물차,
			6: 1종(경형자동차) 배기량 1000cc 미만으로 길이 3.6m, 너비 1.6m, 높이 2.0m 이하
		}
		fueltype = {
			gasoline:			휘발유(Default),
			highgradegasoline:	고급 휘발유,
			diesel:				경유,
			lpg:				LPG
		}
*/
		return {
			option: "traoptimal",											// 탐색 옵션
			cartype: "1",													// 차종
			fueltype: this.oModel.getProperty("/LccMap/Params/fueltype"),	// 유종
			mileage: 14,													// 연비
			lang: this.oModel.getProperty("/LccMap/Params/lang")			// 언어
		};
	},

	renderResultInformation: function(o) {

		this.oModel.setProperty("/LccMap/Distance", o.distance + "km");
		this.oModel.setProperty("/LccMap/TollFare", o.tollFare + this.oController.getBundleText("LABEL_19638")); // 원

		this.oModel.setProperty("/LccMap/Results/distance", o.distance);
		this.oModel.setProperty("/LccMap/Results/tollFare", o.tollFare);
		this.oModel.setProperty("/LccMap/Results/fuelPrice", o.fuelPrice);
	},

	getMapId: function() {

		return this.oModel.getProperty("/LccMap/Id");
	},

	getFuelTypeMap: function() {

		return {
			highgradegasoline: "고급 휘발유",
			gasoline: "휘발유",	// 1
			diesel: "경유",		// 2
			lpg: "LPG"			// 3
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

	// 출장지 선택
	selectPlace: function(oEvent) {

		var sId = oEvent.getParameter("id"),
		sPath = sId.replace(/(LccMap)/, "/$1/");

		setTimeout(function() {
			var callback = function(PlaceName) {
				this.oModel.setProperty(sPath, PlaceName);

				var target = sId.replace(/LccMap/, "").toLowerCase();
				this.LccMap.setPlace(target);
				this.LccMap.searchLocal(PlaceName, target);
			}.bind(this);

			DialogHandler.open(TripPlaceDialogHandler.get(this.oController, this.oModel.getProperty(sPath), callback));
		}.bind(this), 0);
	},

	// 지역 검색
	searchPlace: function(oEvent) {

		this.LccMap.searchLocal(oEvent.getSource().getValue(), oEvent.getParameter("id").replace(/LccMap/, "").toLowerCase());
	},

	// 주소 -> 좌표
	searchCoord: function(oEvent) {

		this.oDialog.setBusy(true, 0);

		var value = oEvent.getSource().getValue();
		return $.getJSON({
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
			}.bind(this),
			error: function() {
				Common.log("retrieveCoord error", arguments);
			}.bind(this),
			complete: function() {
				this.oDialog.setBusy(false);
			}.bind(this)
		}).promise();
	},

	// 경로 탐색
	searchPath: function() {

		this.LccMap.searchPath();
	},

	initPath: function() {

		this.oModel.setProperty("/LccMap/Departure", "");
		this.oModel.setProperty("/LccMap/Destination", "");

		this.oModel.setProperty("/LccMap/Distance", "0km");
		this.oModel.setProperty("/LccMap/TollFare", "0" + this.oController.getBundleText("LABEL_19638")); // 원

		this.oModel.setProperty("/LccMap/Results/distance", "0");
		this.oModel.setProperty("/LccMap/Results/tollFare", "0");
		this.oModel.setProperty("/LccMap/Results/fuelPrice", "0");

		this.LccMap.initPath();
	},

	clear: function() {

		this.LccMap
			.removeMarker(this.LccMap.PLACE_TARGET.CHOICE)
			.removeMarker(this.LccMap.PLACE_TARGET.DEPARTURE)
			.removeMarker(this.LccMap.PLACE_TARGET.DESTINATION)
			.initPath();
	},

	reloadMap: function() {

		this.LccMap.get().destroy();

		this.LccMap = new LotteChemMap({
			id: this.getMapId(),
			coord: new naver.maps.LatLng(37.5125701, 127.1025624), // map center
			maxBounds: new SouthKoreaBounds(),
			functionProvider: this
		});
	},

	applyResult: function() {

		var p = this.oModel.getProperty("/LccMap/Results");
		return Common.getPromise(function() {
			if (this.callback) {
				p.departure = this.oModel.getProperty("/LccMap/Departure");
				p.destination = this.oModel.getProperty("/LccMap/Destination");

				this.callback(p);
			}
		}.bind(this))
		.then(function() {
			this.oDialog.close();

			this.LccMap.get().destroy();
		}.bind(this));
	},

	close: function() {

		MessageBox.confirm(this.oController.getBundleText("MSG_00069"), { // Popup을 닫으시겠습니까?
			onClose: function(oAction) {
				if (sap.m.MessageBox.Action.OK === oAction) {
					this.oDialog.setBusy(false);
					this.oDialog.close();

					this.LccMap.get().destroy();
				}
			}.bind(this)
		});
	}

};

return Handler;

});