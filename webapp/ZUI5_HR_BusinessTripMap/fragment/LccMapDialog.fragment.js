sap.ui.define([], function() {
"use strict";

sap.ui.jsfragment("ZUI5_HR_BusinessTripMap.fragment.LccMapDialog", {

	createContent: function(oController) {

		var LccMapDialogHandler = oController.LccMapDialogHandler,
		oDialog = new sap.m.Dialog({
			title: oController.getBundleText("LABEL_19632"), // 출장 경로 탐색
			stretch: true,
			contentWidth: "100%",
			contentHeight: "100%",
			content: this.getContent(oController),
			horizontalScrolling: false,
			verticalScrolling: false,
			beginButton: new sap.m.Button({
				visible: "{/Header/Edtfg}",
				text: oController.getBundleText("LABEL_00204"), // 적용
				press: LccMapDialogHandler.applyResult.bind(LccMapDialogHandler)
			})
			.addStyleClass("button-light"),
			endButton: new sap.m.Button({
				text: oController.getBundleText("LABEL_00133"), // 닫기
				press: LccMapDialogHandler.close.bind(LccMapDialogHandler)
			})
			.addStyleClass("button-default custom-button-divide"),
			afterOpen: LccMapDialogHandler.onAfterOpen.bind(LccMapDialogHandler)
		})
		.addStyleClass("custom-dialog-popup lcc-map-dialog-popup");

		return oDialog;
	},

	getContent: function(oController) {

		var LccMapDialogHandler = oController.LccMapDialogHandler;
		return new sap.m.HBox({
			width: "100%",
			height: "100%",
			items: [
				this.getSearchVBox(oController).setModel(LccMapDialogHandler.getModel()),
				new sap.ui.core.HTML({
					layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
					content: "<div id=\"${map-id}\" class=\"lcc-map\"></div>".interpolate(LccMapDialogHandler.getMapId())
				})
			]
		});
	},

	getSearchVBox: function(oController) {

		var LccMapDialogHandler = oController.LccMapDialogHandler;

		return new sap.m.VBox({
			width: "300px",
			items: [
				new sap.m.Label({ text: "{i18n>LABEL_19633}" }), // 출발지
				new sap.m.Input("LccMapDeparture", {
					maxLength: 30,
					width: "100%",
					value: "{/LccMap/Departure}",
					valueHelpOnly: true,
					showValueHelp: true,
					valueHelpRequest: LccMapDialogHandler.selectPlace.bind(LccMapDialogHandler),
					submit: LccMapDialogHandler.searchPlace.bind(LccMapDialogHandler)
				})
				.addStyleClass("mb-16px"),
				new sap.m.Label({ text: "{i18n>LABEL_19634}" }), // 도착지
				new sap.m.Input("LccMapDestination", {
					maxLength: 30,
					width: "100%",
					value: "{/LccMap/Destination}",
					valueHelpOnly: true,
					showValueHelp: true,
					valueHelpRequest: LccMapDialogHandler.selectPlace.bind(LccMapDialogHandler),
					submit: LccMapDialogHandler.searchPlace.bind(LccMapDialogHandler)
				})
				.addStyleClass("mb-16px"),
				new sap.m.Label({ text: "{i18n>LABEL_19625}" }), // 이동거리
				new sap.m.Label({ text: "{/LccMap/Distance}" }).addStyleClass("mb-16px"),
				new sap.m.Label({ text: "{i18n>LABEL_19629}" }), // 톨게이트요금
				new sap.m.Label({ text: "{/LccMap/TollFare}" }).addStyleClass("mb-16px"),
				new sap.m.Button({
					press: LccMapDialogHandler.searchPath.bind(LccMapDialogHandler),
					text: "{i18n>LABEL_19635}", // 경로 탐색 시작
					width: "100%"
				})
				.addStyleClass("button-search mb-16px"),
				new sap.m.Button({
					press: LccMapDialogHandler.clear.bind(LccMapDialogHandler),
					text: "{i18n>LABEL_19636}", // 경로 초기화
					width: "100%"
				})
				.addStyleClass("button-search mb-16px"),
				new sap.m.Button({
					press: LccMapDialogHandler.reloadMap.bind(LccMapDialogHandler),
					text: "{i18n>LABEL_19637}", // 지도 재생성
					width: "100%"
				})
				.addStyleClass("button-search")
			]
		})
		.addStyleClass("search-box search-bg");
	}

});

});