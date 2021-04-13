sap.ui.define([
	"../../common/PickOnlyDateRangeSelection",
	"../../common/ZHR_TABLES",
	"../../control/ODataFileUploader",
	"../delegate/ViewTemplates",
	"../../common/Common"
], function(
	PickOnlyDateRangeSelection,
	ZHR_TABLES,
	ODataFileUploader,
	ViewTemplates,
	Common
) {
"use strict";

sap.ui.jsfragment([$.app.CONTEXT_PATH, "fragment", "RequestList"].join("."), { 

	createContent: function(oController) {

		return new sap.m.VBox({
			height: "100%",
			items: [
				this.getSearchHBox(oController),
				this.getInfoHBox(oController),
				this.getTable(oController)
			]
		});
	},

	getSearchHBox: function(oController) {

		return new sap.m.HBox({
			fitContainer: true,
			items: [
				new sap.m.HBox({
					items: [
					    new sap.m.Label({ text: "{i18n>LABEL_08007}" }), //대상자
						ViewTemplates.getCustomInput(oController.PAGEID +"_Ename", {
							layoutData: new sap.m.FlexItemData({ growFactor: 0, minWidth: "140px" }),
							customData: [
								
							],
							width : "140px",
							fieldWidth: "140px",
                            value: "{EnameOrOrgehTxt}",
                            showValueHelp: true,
                            valueHelpOnly: true,
                            valueHelpRequest: oController.searchOrgehPernr.bind(oController)
						}, oController.clearEname.bind(oController))
						.addStyleClass("field-min-width-50"),
						new sap.m.Label({text: "{i18n>LABEL_50003}"}), // 입금유형
						new sap.m.ComboBox({
							width: "200px",
							selectedKey: "{Lgart}",
							items: {
								path: "/Lgart",
								templateShareable: false,
								template: new sap.ui.core.ListItem({key: "{Lgart}", text: "{Lgtxt}"})
							}
						}),
						new sap.m.Label({text: "{i18n>LABEL_50004}"}), // 지급/공제일
						new PickOnlyDateRangeSelection({
							displayFormat: "{Dtfmt}",
							secondDateValue: "{Endda}",
							dateValue: "{Begda}",
							delimiter: "~",
							width: "210px"
						}),
						new sap.m.Label({text: "{i18n>LABEL_50005}"}), // 진행상태
						new sap.m.ComboBox({
							width: "150px",
							selectedKey: "{Status}",
							items: {
				    			path : "/Status",
								templateShareable: false,
								template: new sap.ui.core.ListItem({key: "{Status}", text: "{StatusText}"})
							}
						})
					]
				})
				.addStyleClass("search-field-group"),
				new sap.m.HBox({
					items: [
						new sap.m.Button({
							press: oController.onPressSearch,
							text: "{i18n>LABEL_00100}" // 조회
						})
						.addStyleClass("button-search")
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("search-box search-bg pb-7px mt-24px")
		.setModel(oController._ListCondJSonModel)
		.bindElement("/Data");
	},

	getInfoHBox: function(oController) {

		return new sap.m.HBox({
			justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
			items: [
				new sap.m.HBox({
					items: [
						// new sap.m.Label({text: "{i18n>LABEL_19004}"}).addStyleClass("sub-title"), // 신청현황,
						new sap.m.Text({text: "{ETitle}"})
						.setModel(oController._ListCondJSonModel)
						.bindElement("/Info")
						.addStyleClass("color-blue") // 신청현황 
					]
				})
				.addStyleClass("info-field-group"),
				new sap.m.HBox({
					items: [
						new sap.m.Button({
							text: "{i18n>LABEL_50008}", // 양식다운로드
							press : function(){
								if(common.Common.isLOCAL()){
									window.open("../webapp/ZUI5_HR_PayDeductionRequest/template/Upload Template.xlsx");
								}else{
									window.open("../ZUI5_HR_PayDeductionRequest/template/Upload Template.xlsx");
								}
								
							}
						})
						.addStyleClass("button-light"),
						new ODataFileUploader(oController.PAGEID+"_EXCEL_UPLOAD_BTN", {
		    				name : "UploadFile",
		    				slug : "",
		    				maximumFileSize: 1,
		    				multiple : false,
		    				uploadOnChange: false,
		    				mimeType: [],
		    				fileType: ["csv","xls","xlsx"],
		    				buttonText : "{i18n>LABEL_00134}", // 업로드
		    				buttonOnly : true,
		    				change : oController.changeFile,
		    			}).addDelegate({
		    				onAfterRendering: function() {
		    					// $("#" + oController.PAGEID + "_EXCEL_UPLOAD_BTN").find('BUTTON > span')
		    					// .removeClass('sapMBtnDefault sapMBtnHoverable')
		    					// .addClass('sapMBtnGhost');
		    				}
		    			}).addStyleClass("mt--3px button-light"),
						new sap.m.Button({
							press: oController.pressRequestForm.bind(oController),
							text: "{i18n>LABEL_00152}" // 신청
						})
						.addStyleClass("button-light"),
						new sap.m.Button({
							press: oController.onDelete.bind(oController),
							text: "{i18n>LABEL_08003}" // 삭제
						})
						.addStyleClass("button-light")
					]
				})
				.addStyleClass("button-group")
			]
		})
		.addStyleClass("info-box");
	},

	getTable: function(oController) {

		var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
			layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
			selectionMode: sap.ui.table.SelectionMode.MultiToggle,
			enableColumnReordering: false,
			enableColumnFreeze: false,
			enableBusyIndicator: true,
			busyIndicatorDelay: 0,
			visibleRowCount: 1,
			showOverlay: false,
			showNoData: true,
			width: "100%",
			rowHeight: 37,
			columnHeaderHeight: 38,
			noData: "{i18n>LABEL_00901}",
			// rowSettingsTemplate: new sap.ui.table.RowSettings({
			// 	highlight: {
			// 		path: "Status1",
			// 		formatter: function(Status1) {
			// 			if (Status1 === "AA") { // 미결재
			// 				return sap.ui.core.MessageType.None;
			// 			} else if (Status1 === "99") { // 결재완료
			// 				return sap.ui.core.MessageType.Success;
			// 			} else if (Status1 === "88") { // 반려
			// 				return sap.ui.core.MessageType.Warning;
			// 			} else {
			// 				return sap.ui.core.MessageType.Information;
			// 			}
			// 		}
			// 	}
			// }),
			// cellClick: OnRequest.clickRequestListCell.bind(oController)
		})
		.addStyleClass("mt-10px")
		.setModel(oController._ListJSonModel)
		.bindRows("/Data");

		ZHR_TABLES.makeColumn(oController, oTable, [
			{ id: "Idx",      label: "{i18n>LABEL_13005}"/* 번호     */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "50px" },
			{ id: "Pernr",  label: "{i18n>LABEL_19507}"/* 사번 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "90px" },
			{ id: "Ename",    label: "{i18n>LABEL_19508}"/* 성명 */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "8%" },
			{ id: "Orgtx",       label: "{i18n>LABEL_19509}"/* 소속     */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "10%" },
			{ id: "Pndt", label: "{i18n>LABEL_50006}"/* 지급/공제   */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "5%" },
			{ id: "Lgart",       label: "{i18n>LABEL_50003}"/* 임금유형   */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "5%"},
			{ id: "Lgtxt",     label: "{i18n>LABEL_50007}"/* 임금유형명   */, plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width:  "10%" },
			{ id: "Betrg",     label: "{i18n>LABEL_19612}"/* 금액   */, plabel: "", resize: true, span: 0, type: "money",   sort: true, filter: true, width:  "9%" },
			{ id: "Waers",      label: "{i18n>LABEL_19348}"/* 통화     */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "70px" },
			{ id: "Begda",      label: "{i18n>LABEL_50004}"/* 지급/공제일     */, plabel: "", resize: true, span: 0, type: "date",   sort: true, filter: true, width: "100px"},
			{ id: "Aename",      label: "{i18n>LABEL_19209}"/* 신청자     */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "8%" },
			{ id: "ApplyDt",      label: "{i18n>LABEL_33007}"/* 신청일     */, plabel: "", resize: true, span: 0, type: "date",   sort: true, filter: true, width: "100px"},		
			{ id: "StatusText",      label: "{i18n>LABEL_44013}"/* 진행상태     */, plabel: "", resize: true, span: 0, type: "template",   sort: true, filter: true, width: "100px", templateGetter: "getStatusTextTemplate", templateGetterOwner: this},		
			{ id: "Notes",      label: "{i18n>LABEL_34021}"/* 비고     */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "10%"},
			{ id: "Reject",      label: "{i18n>LABEL_30019}"/* 반려사유     */, plabel: "", resize: true, span: 0, type: "string",   sort: true, filter: true, width: "10%"},
		]);

		return oTable;
	},

	getStatusTextTemplate: function(columnInfo) {

		return new sap.ui.commons.TextView({
			textAlign: sap.ui.core.HorizontalAlign.Center,
			text: {
				parts: [
					{ path: columnInfo.id },
					{ path: "Status" },
				],
				formatter: function(v, Status) {
					this.removeStyleClass("color-signature-orange");
					this.removeStyleClass("color-signature-blue");
					this.removeStyleClass("color-green");
					this.removeStyleClass("color-signature-red");

					if(Status == "AA")       // 미결재
						this.addStyleClass("color-signature-orange");
					else if(Status == "00")  // 결재 중
						this.addStyleClass("color-signature-blue");
					else if(Status == "99")  //결재완료
						this.addStyleClass("color-green");
					else if(Status == "88")  // 반려
						this.addStyleClass("color-signature-red");
					return v;
				}
			}
		});
	}

});

});