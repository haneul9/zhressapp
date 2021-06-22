﻿$.sap.require("fragment.COMMON_ATTACH_FILES");
sap.ui.define([
	"../common/PageHelper",
    "../common/ZHR_TABLES"
], function (PageHelper, ZHR_TABLES) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
		
		_colModel: [
			{id: "Pchk", 	label: "{i18n>LABEL_47058}"/* CheckBox */,	plabel: "", resize: true, span: 0, type: "template",  sort: true,  filter: true, width: "auto", templateGetter:"getCheckBox"},
			{id: "EdotyT", 	label: "{i18n>LABEL_70002}"/* 구분 */,		plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "auto"},
			{id: "Reqdt", 	label: "{i18n>LABEL_70012}"/* 제출일 */,	plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true, width: "10%"},
			{id: "Edkaj",  	label: "{i18n>LABEL_70013}"/* 교육과정 */,  plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true, width: "20%", align: sap.ui.core.HorizontalAlign.Left},
			{id: "Begda",	label: "{i18n>LABEL_70014}"/* 학습일자 */,  plabel: "", resize: true, span: 0, type: "date",   sort: false, filter: false, width: "15%"},
			{id: "Beguz",	label: "{i18n>LABEL_70015}"/* 학습시간 */,	plabel: "", resize: true, span: 0, type: "template",  sort: true,  filter: true,  width: "15%", templateGetter:"getTimeFormatter"}, 
			{id: "RepstT",	label: "{i18n>LABEL_70016}"/* 보고서 */,    plabel: "", resize: true, span: 0, type: "string", sort: true, filter: true, width: "10%"},
			{id: "Status1",	label: "{i18n>LABEL_70017}"/* 신청부서 */,  plabel: "", resize: true, span: 0, type: "template",  sort: false, filter: false, width: "auto", templateGetter:"getUrl1"},
			{id: "Status",	label: "{i18n>LABEL_70018}"/* 주관부서 */,  plabel: "", resize: true, span: 0, type: "template",  sort: false, filter: false, width: "auto", templateGetter:"getUrl2"}
		],
		
		getControllerName: function() {
			return $.app.APP_ID;
		},
		
		createContent: function(oController) {
            this.loadModel();
            
			var oGubunCombo = new sap.m.ComboBox({ // 구분
				selectedKey: "{Gubun}",
				width: "200px",
				items: {
					path: "/GubunCombo",
					template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
				}
			})
			.addStyleClass("mr-5px");

			oGubunCombo.addDelegate({
				onAfterRendering: function () {
					oGubunCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
			}, oGubunCombo);

			var oDateYearCombo = new sap.m.ComboBox({ // 학습년월 (년도)
                selectedKey: "{Zyear1}",
                width: "150px",
                items: {
                    path: "/Zyears1",
                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                }
            })
            .addStyleClass("mr-5px");

			oDateYearCombo.addDelegate({
				onAfterRendering: function () {
					oDateYearCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oDateYearCombo);

			var oDateMonthCombo = new sap.m.ComboBox({ // 학습년월 (월)
                selectedKey: "{Zmonth1}",
                width: "130px",
                items: {
                    path: "/Zmonths1",
                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                }
            })
            .addStyleClass("mr-5px");

			oDateMonthCombo.addDelegate({
				onAfterRendering: function () {
					oDateMonthCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oDateMonthCombo);

			var oStatusCombo = new sap.m.ComboBox({ // 결재상태
                selectedKey: "{Status}",
                width: "130px",
                items: {
                    path: "/StatusCombo",
                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                }
            })
            .addStyleClass("mr-5px");

			oStatusCombo.addDelegate({
				onAfterRendering: function () {
					oStatusCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oStatusCombo);

			var oIsReportCombo = new sap.m.ComboBox({ // 보고서 제출여부
                selectedKey: "{IsReport}",
                width: "170px",
                items: {
                    path: "/IsReportCombo",
                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                }
            })
            .addStyleClass("mr-5px");

			oIsReportCombo.addDelegate({
				onAfterRendering: function () {
					oIsReportCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oIsReportCombo);

			var infoBox = new sap.m.HBox({
				justifyContent: sap.m.FlexJustifyContent.End,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				items: [ 				
					new sap.m.HBox({
						items: [					
							new sap.m.Button({
								press: oController.onPressAppBtn.bind(oController),
								text: "{i18n>LABEL_70008}" // OJT신고서작성
							}).addStyleClass("button-light"),
							new sap.m.Button({
								press: oController.onPressRepBtn.bind(oController),
								text: "{i18n>LABEL_70009}" // 결과보고
							}).addStyleClass("button-light"),
							new sap.m.Button({
								press: oController.onPressReqBtn.bind(oController),
								text: "{i18n>LABEL_70010}" // 결재요청
							}).addStyleClass("button-light"),
							new sap.m.Button({
								press: oController.onPressDelBtn.bind(oController),
								text: "{i18n>LABEL_70011}" // 삭제
							}).addStyleClass("button-delete")
						]
					})
					.addStyleClass("button-group")
				]
			})
			.addStyleClass("info-box");

            
            var oApplyDateBox = new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				fitContainer: true,
				items: [
					new sap.m.HBox({
						items: [
							new sap.m.Label({ text: "{i18n>LABEL_70002}" }), // 구분
                            oGubunCombo,
							new sap.m.Label({ text: "{i18n>LABEL_70003}" }), // 학습년월
							oDateYearCombo.addStyleClass("mr-5px"),
							oDateMonthCombo,							
							new sap.m.Label({ text: "{i18n>LABEL_70005}" }), // 결재상태
							oIsReportCombo,
							new sap.m.Label({ text: "{i18n>LABEL_70006}" }), // 보고서 제출여부
							oStatusCombo
						]
					}).addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [							
							new sap.m.Button({
								press: oController.onTableSearch.bind(oController),
								text: "{i18n>LABEL_70007}" // 조회
							}).addStyleClass("button-search")
						]
					})
					.addStyleClass("button-group")
				]
            })
			.addStyleClass("search-box search-bg pb-7px mt-16px")
            .setModel(oController.SearchModel)
			.bindElement("/Data");
			
			var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
				selectionMode: sap.ui.table.SelectionMode.None,
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 10,
				showOverlay: false,
				showNoData: true,
				width: "auto",
				rowHeight: 37,
				columnHeaderHeight: 38,
				noData: "{i18n>LABEL_00901}"
			})
			.addStyleClass("mt-10px row-link")
			.setModel(oController.TableModel)
			.bindRows("/Data")
			.attachCellClick(oController.onSelectedRow);
			
			ZHR_TABLES.makeColumn(oController, oTable, this._colModel); 
	
			return new PageHelper({
				contentItems: [               
                    oApplyDateBox,
					infoBox,
					oTable
				]
			});
		},
		
		loadModel: function () {
			// Model 선언
			$.app.setModel("ZHR_TRAINING_SRV");
			$.app.setModel("ZHR_COMMON_SRV");
		}
	});
});