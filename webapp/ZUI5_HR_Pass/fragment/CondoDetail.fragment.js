sap.ui.define([
	"common/Common",
	"common/ZHR_TABLES"
], function (Common, ZHR_TABLES) {
	"use strict";

	sap.ui.jsfragment("ZUI5_HR_Pass.fragment.CondoDetail", {
		
		createContent: function (oController) {
			var CondoHandler = oController.CondoHandler;

			var oDialog = new sap.m.Dialog(oController.PAGEID + "_CondoDetail_Dialog", {
				title: "{i18n>LABEL_09032}",
				contentWidth: "800px",
				beforeOpen: CondoHandler.onBeforeCondoDetail.bind(CondoHandler),
				buttons: [
					new sap.m.Button({
						press: CondoHandler.onPressCondoRequestCompleteBtn.bind(CondoHandler),
						text: "{i18n>LABEL_09023}", // 신청
						visible: {
							path: "isNew",
							formatter: function (v) {
								if (v) return true;
								else return false;
							}
						}
					}).addStyleClass("button-dark"),
					new sap.m.Button({
						press: CondoHandler.onPressCondoModifyCompleteBtn.bind(CondoHandler),
						text: "{i18n>LABEL_09031}", // 저장
						visible: {
							path: "isNew",
							formatter: function (v) {
								if (v) return false;
								else return true;
							}
						}
					}).addStyleClass("button-light"),
					new sap.m.Button({
						press: function () {
							oDialog.close();
						},
						text: "{i18n>LABEL_09025}" // 닫기
					}).addStyleClass("button-default custom-button-divide")
				],
				content: [
					this.getInputBox(oController)
				]
			})
			.setModel(CondoHandler.Model())
			.bindElement("/Detail/Data");

			return oDialog;
		},

		getInputBox: function(oController) {
			var CondoHandler = oController.CondoHandler;

			var confirmTable = new sap.ui.table.Table(oController.PAGEID + "_CondoConfirmTable", {
				selectionMode: sap.ui.table.SelectionMode.None,
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 5,
				showOverlay: false,
				showNoData: true,
				width: "auto",
				rowHeight: 37,
				columnHeaderHeight: 38,
				noData: "{i18n>LABEL_00901}"
			}).bindRows("/Detail/Confirms");

			var columnModels = [
				{ id: "Contx", label: "{i18n>LABEL_09033}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "20%" },
				{ id: "Loctx", label: "{i18n>LABEL_09034}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "20%" },
				{ id: "Begda", label: "{i18n>LABEL_09039}", plabel: "", resize: true, span: 0, type: "template", sort: true, filter: true, width: "30%", templateGetter: "getDateRangeText", templateGetterOwner: CondoHandler },
				{ id: "Resev", label: "{i18n>LABEL_09058}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "15%" },
				{ id: "Confm", label: "{i18n>LABEL_09059}", plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "15%" }
			];

			ZHR_TABLES.makeColumn(oController, confirmTable, columnModels);

			return new sap.m.FlexBox({
				fitContainer: true,
				direction: "Column",
				items: [
					new sap.m.FlexBox({
						items: [
							// 콘도
							new sap.m.Label({ text: "{i18n>LABEL_09033}", width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({
								width: "250px",
								editable: false,
								value: "{Contx}"
							})
						]
					}).addStyleClass("search-field-group search-inner-vbox"),
					new sap.m.FlexBox({
						items: [
							// 위치
							new sap.m.Label({ text: "{i18n>LABEL_09034}", width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({
								width: "250px",
								editable: false,
								value: "{Loctx}"
							})
						]
					}).addStyleClass("search-field-group"),
					new sap.m.FlexBox({
						items: [
							// 성수기구분
							new sap.m.Label({ text: "{i18n>LABEL_09053}", width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({
								width: "250px",
								editable: false,
								value: "{SeasnT}"
							})
						]
					}).addStyleClass("search-field-group"),
					new sap.m.FlexBox({
						items: [
							// 입/퇴실일
							new sap.m.Label({ text: "{i18n>LABEL_09055}", required: true, width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.DateRangeSelection("BegdaRange", {
								width: "250px",
								delimiter: "~",
								displayFormat: oController.getSessionInfoByKey("Dtfmt"),
								minDate: "{minDate}",
								maxDate: "{maxDate}",
								dateValue: "{Begda}",
								secondDateValue: "{Endda}",
								specialDates: new sap.ui.unified.DateTypeRange({
									type: sap.ui.unified.CalendarDayType.Type03,
									startDate: "{Sbegda}",
									endDate: "{Sendda}"
								}),
								change: CondoHandler.handleDrsChange.bind(CondoHandler)
							}).addDelegate({
								onAfterRendering: function () {
									Common.disableKeyInput($.app.byId("BegdaRange"));
								}
							}),
							new sap.m.Input({
								width: "100px",
								editable: false,
								value: "{Rangeda}"
							}).addStyleClass("ml-8px")
						]
					}).addStyleClass("search-field-group"),
					new sap.m.FlexBox({
						items: [
							new sap.ui.core.Icon({
								src: "sap-icon://alert",
								color: "#da291c"
							})
							.addStyleClass("info-text-red ml-158px mt-12px"),
							new sap.m.Text({
								text: {
									parts: [
										{path: "Sbegda"},
										{path: "Sendda"}
									],
									formatter: function(v1, v2) {
										if(v1 && v2) {
											return oController.getBundleText("MSG_09015").interpolate(Common.DateFormatter(v1, "yyyy.MM.dd"), Common.DateFormatter(v2, "yyyy.MM.dd"));
										} else {
											return "";
										}
									}
								},
								textAlign: "Begin"
							})
							.addStyleClass("ml-3px mt-9px")
						],
						visible: {
							path: "Sbegda",
							formatter: function(v) {
								if(v) return true;
								else return false;
							}
						}
					}).addStyleClass("search-field-group mb-8px"),
					new sap.m.FlexBox({
						items: [
							// 객실수/사용인원
							new sap.m.Label({ text: "{i18n>LABEL_09056}", required: true, width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.ComboBox({
								width: "100px",
								selectedKey: "{Romno}",
								items: {
									path: "/Rooms",
									template: new sap.ui.core.ListItem({
										key: "{Code}",
										text: "{Text}"
									})
								}
							}),
							new sap.m.Input({
								width: "30%",
								value: "{Usepn}",
								description: "{i18n>LABEL_09068}",   // 명
								liveChange: Common.setOnlyDigit,
								maxLength : Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "CondoUseRequestIt", "Usepn")
							}).addStyleClass("ml-8px")
						]
					}).addStyleClass("search-field-group"),
					new sap.m.FlexBox({
						items: [
							// 휴대전화번호
							new sap.m.Label({ text: "{i18n>LABEL_09026}", required: true, width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({ 
								value: "{Comnr}", 
								width: "250px", 
								placeholder: "010-1111-1111",
								maxLength : Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "CondoUseRequestIt", "Comnr"),
								liveChange: Common.changeCellphoneFormat
							})
						]
					}).addStyleClass("search-field-group"),
					new sap.m.FlexBox({
						items: [
							// 비고
							new sap.m.Label({ text: "{i18n>LABEL_09028}", width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({ value: "{Descr}", width: "500px", maxLength : Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "CondoUseRequestIt", "Descr") })
						]
					}).addStyleClass("search-field-group"),
					new sap.m.FlexBox({
						items: [
							// 콘도정보
							new sap.m.Label({ text: "{i18n>LABEL_09057}", width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Link({
								target: "_blank",
								text: "{UsridLong}",
								press: CondoHandler.openUri.bind(CondoHandler)
								// href: "{UsridLong}"
							})
						],
						visible: {
							path: "isNew",
							formatter: function(v) {
								if(v) return true;
								else return false;
							}
						}
					}).addStyleClass("search-field-group"),
					new sap.m.FlexBox({
						items: [
							confirmTable
						],
						visible: {
							path: "isNew",
							formatter: function(v) {
								if(v) return false;
								else return true;
							}
						}
					}).addStyleClass("mt-20px")
				]
			}).addStyleClass("search-box mb-40px");
		}
	});

});
