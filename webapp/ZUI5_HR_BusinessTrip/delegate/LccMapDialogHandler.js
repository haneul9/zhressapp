/* global moment naver */
sap.ui.define([
	"common/Common",
	"common/DialogHandler",
	"common/moment-with-locales",
	"common/map/AddressOverlay",
	"common/map/CustomLayer",
	"common/map/SouthKoreaBounds",
	"common/map/LotteChemMap",
	"./PlaceSearchDialogHandler",
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
	PlaceSearchDialogHandler,
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
			Departure: null,
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
			name: "ZUI5_HR_BusinessTrip.fragment.LccMapDialog",
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

	// onBeforeOpen: function() {

	// 	return Common.getPromise(function() {
	// 	}.bind(this));
	// },

	onAfterOpen: function() {

		Common.getPromise(true, function(resolve) {
			this.LccMap = new LotteChemMap({
				id: this.getMapId(),
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
					maxBounds: new SouthKoreaBounds(),
					functionProvider: this
				});
				this.LccMap.get().setOptions("coord", this.LccMap.getCoord());
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

	getDepartureId: function() {

		return this.LccMap.getDepartureId();
	},

	getDestinationId: function() {

		return this.LccMap.getDestinationId();
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

	// 지역 검색
	searchPlace: function(oEvent) {

		var keyword = oEvent.getParameter("value"),
		target = oEvent.getParameter("id").replace(/LccMap/, "").toLowerCase();

		setTimeout(function() {
			this.LccMap.searchLocal({
				keyword: keyword,
				target: target,
				callback: function(PlaceList) {
					this.oModel.setProperty("/LccMap/PlaceList", PlaceList);
				}.bind(this)
			});
		}.bind(this), 0);
	},

	selectPlace: function(oEvent) {

		var o = oEvent.getParameter("listItem").getBindingContext().getProperty();
		setTimeout(function() {
			this.LccMap
				.panTo(o.coord)
				.setMarker({
					target: o.target,
					coord: o.coord,
					address: o.address
				});
			$.app.byId("LccMapPlaceList").removeSelections(true);
		}.bind(this), 0);
	},

	// 경로 탐색
	searchPath: function() {

		this.LccMap.searchPath();
	},

	clear: function() {

		setTimeout(function() {
			this.oModel.setProperty("/LccMap/Departure", "");
			this.oModel.setProperty("/LccMap/Destination", "");

			this.oModel.setProperty("/LccMap/Distance", "0km");
			this.oModel.setProperty("/LccMap/TollFare", "0" + this.oController.getBundleText("LABEL_19638")); // 원

			this.oModel.setProperty("/LccMap/Results/distance", "0");
			this.oModel.setProperty("/LccMap/Results/tollFare", "0");
			this.oModel.setProperty("/LccMap/Results/fuelPrice", "0");

			this.LccMap
				.removeMarker(this.LccMap.PLACE_TARGET.CHOICE)
				.removeMarker(this.LccMap.PLACE_TARGET.DEPARTURE)
				.removeMarker(this.LccMap.PLACE_TARGET.DESTINATION)
				.initPath(true);
		}.bind(this), 0);
	},

	reloadMap: function() {

		if (this.LccMap) {
			this.LccMap.get().destroy();
		}

		setTimeout(function() {
			this.LccMap = new LotteChemMap({
				id: this.getMapId(),
				maxBounds: new SouthKoreaBounds(),
				functionProvider: this
			});
			this.LccMap.get().setOptions("coord", this.LccMap.getCoord());
		}.bind(this), 300);
	},

	applyResult: function() {

		var departure = this.oModel.getProperty("/LccMap/Departure"),
		destination = this.oModel.getProperty("/LccMap/Destination");

		if (!departure) {
			MessageBox.alert(this.oController.getBundleText("MSG_19036", this.oController.getBundleText("LABEL_19633"))); // 출발지를 검색하세요.
			return;
		}
		if (!destination) {
			MessageBox.alert(this.oController.getBundleText("MSG_19036", this.oController.getBundleText("LABEL_19634"))); // 도착지를 검색하세요.
			return;
		}

		var p = $.extend({}, this.oModel.getProperty("/LccMap/Results"));
		return Common.getPromise(function() {
			if (this.callback) {
				p.departure = departure;
				p.destination = destination;

				this.callback(p);
			}
		}.bind(this))
		.then(function() {
			this.oDialog.close();

			this.clear();
			this.LccMap.get().destroy();
		}.bind(this));
	},

	close: function() {

		MessageBox.confirm(this.oController.getBundleText("MSG_00069"), { // Popup을 닫으시겠습니까?
			onClose: function(oAction) {
				if (sap.m.MessageBox.Action.OK === oAction) {
					this.oDialog.setBusy(false);
					this.oDialog.close();

					this.clear();
					this.LccMap.get().destroy();
				}
			}.bind(this)
		});
	}

};

return Handler;

});