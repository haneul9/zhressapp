/* global naver */
sap.ui.define([
	"common/Common"
], function(
	Common
) {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTrip.fragment.LccMapDialog", {

	createContent: function(oController) {

		var oDialog = new sap.m.Dialog({
			title: oController.getBundleText("LABEL_19801"), // 출장 경로 탐색
			contentWidth: "100%",
			contentHeight: "100%",
			content: this.getContent(oController),
			horizontalScrolling: false,
			verticalScrolling: false,
			endButton: [
				new sap.m.Button({
					type: sap.m.ButtonType.Default,
					text: oController.getBundleText("LABEL_00133"), // 닫기
					press: function() {
						oDialog.close();
					}
				})
				.addStyleClass("button-default")
			],
			afterOpen: function() {
				var varname = '_lccmap';
				window[varname] = new common.map.LotteChemMap({
					id: 'LccMap',
					varname: name,
					coord: new naver.maps.LatLng(37.5125701, 127.1025624),
					maxBounds: new common.map.SouthKoreaBounds()
				});

				$('#button-select-departure').click(function() {
					window[varname].target = window[varname].PLACE_TARGET.DEPARTURE;
					alert('지도에서 출발지를 클릭하세요.');
				});
				$('#button-select-destination').click(function() {
					window[varname].target = window[varname].PLACE_TARGET.DESTINATION;
					alert('지도에서 도착지를 클릭하세요.');
				});
				$('#button-search-path').click(function() {
					window[varname].searchPath();
				});
				$('#button-init-path').click(function() {
					window[varname].initPath();
				});
				$('#start,#goal,#LccMapDeparture,#LccMapDestination').on('keydown', function(e) {
					var keyCode = e.keyCode || e.which;
					if (keyCode === 13) { // Enter Key
						e.preventDefault();
						window[varname].searchLocal($(e.currentTarget).val());
					}
				});
			}
		})
		.addStyleClass("custom-dialog-popup");

		return oDialog;
	},

	getContent: function(oController) {

		var oModel = oController.NaverMapDialogHandler.getModel();
		return new sap.m.HBox({
			items: [
				this.getSearchVBox(oController).setModel(oModel),
				this.getMapHBox(oController)
			]
		});
	},

	getSearchVBox: function(oController) {

		var LccMapDialogHandler = oController.LccMapDialogHandler;

		return new sap.m.VBox({
			items: [
				new sap.m.Label({ text: "{i18n>LABEL_19802}" }), // 출발지
				new sap.m.Input("LccMapDeparture", {
					maxLength: 20,
					width: "100%",
					value: "{/LccMap/Departure}",
					showSuggestion: true,
					startSuggestion: 2,
					suggestionItems: {
						path: "{/LccMap/DepartureList}",
						templateShareable: false,
						template: new sap.ui.core.Item({ text: "title" })
					},
					suggest: LccMapDialogHandler.searchPlace.bind(LccMapDialogHandler),
					suggestionItemSelected: LccMapDialogHandler.selectPlace.bind(LccMapDialogHandler)
				}),
				new sap.m.Label({ text: "{i18n>LABEL_19803}" }), // 도착지
				new sap.m.Input("LccMapDestination", {
					maxLength: 20,
					width: "100%",
					value: "{/LccMap/Destination}",
					showSuggestion: true,
					startSuggestion: 2,
					suggestionItems: {
						path: "{/LccMap/DestinationList}",
						templateShareable: false,
						template: new sap.ui.core.Item({ text: "title" })
					},
					suggest: LccMapDialogHandler.searchPlace.bind(LccMapDialogHandler),
					suggestionItemSelected: LccMapDialogHandler.selectPlace.bind(LccMapDialogHandler)
				}),
				new sap.m.Button({
					press: LccMapDialogHandler.onBeforeOpen.bind(LccMapDialogHandler),
					text: "{i18n>LABEL_19804}" // 경로 탐색 시작
				})
				.addStyleClass("button-search")
			]
		})
		.addStyleClass("search-box search-bg pb-7px");
	},

	getMapHBox: function() {

		return new sap.m.HBox("LccMap");
	}

});

});