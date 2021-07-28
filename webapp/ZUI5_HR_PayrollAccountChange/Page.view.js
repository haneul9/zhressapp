$.sap.require("fragment.COMMON_ATTACH_FILES");
sap.ui.define([
	"../common/PageHelper",
	"../common/ZHR_TABLES"
], function (PageHelper, ZHR_TABLES) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
        
        _Model: [
            {id: "Statust",     label: "{i18n>LABEL_74011}" /* 결재상태 */, plabel: "", resize: true, span: 0, type: "string",sort: true,  filter: true,  width: "8%"},
            {id: "Pernr",       label: "{i18n>LABEL_74012}" /* 사번 */,     plabel: "", resize: true, span: 0, type: "string",sort: true,  filter: true,  width: "8%"},
            {id: "Ename",       label: "{i18n>LABEL_74013}" /* 성명 */,     plabel: "", resize: true, span: 0, type: "string",    sort: true,  filter: true,  width: "8%"},
            {id: "Ngtprd",      label: "{i18n>LABEL_74014}" /* 숙박기간 */, plabel: "", resize: true, span: 0, type: "string",   sort: true,  filter: true,  width: "auto"},
            {id: "Ngtcnt",	    label: "{i18n>LABEL_74028}" /* 숙박일수 */, plabel: "", resize: true, span: 0, type: "string",    sort: true,  filter: true,  width: "8%"},
            {id: "Supcnt",      label: "{i18n>LABEL_74035}" /* 지원일수 */, plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "8%"},
            {id: "Supamttx",    label: "{i18n>LABEL_74030}" /* 지원금액 */, plabel: "", resize: true, span: 0, type: "money",  sort: true,  filter: true,  width: "10%"},
            {id: "Restxt",      label: "{i18n>LABEL_74017}" /* 콘도 */,     plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "8%"},
            {id: "Appda",       label: "{i18n>LABEL_74018}" /* 신청일 */,   plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true,  width: "10%"},
            {id: "Sgnda",       label: "{i18n>LABEL_74040}" /* 결재일 */,   plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true,  width: "10%"},
            {id: "Payym",       label: "{i18n>LABEL_74020}" /* 지급년월 */, plabel: "", resize: true, span: 0, type: "template",  sort: true,  filter: true,  width: "10%", templateGetter: "getPayDate"}
        ],
		
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
			this.loadModel();

            var oDateYearCombo = new sap.m.ComboBox({ // 대상년도
                selectedKey: "{Zyear}",
                width: "150px",
                items: {
                    path: "/Zyears",
                    template: new sap.ui.core.ListItem({ key: "{Code}", text: "{Text}" })
                }
            })
            .addStyleClass("mr-5px");

			oDateYearCombo.addDelegate({
				onAfterRendering: function () {
					oDateYearCombo.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
            }, oDateYearCombo);
			
			var oSearchBox = new sap.m.FlexBox({
				fitContainer: true,
				items: [ 
					new sap.m.HBox({
						items: [
							new sap.m.Label({text: "{i18n>LABEL_74002}" }), // 부서/사원
							new sap.m.Input(oController.PAGEID + "_EmpInput", {
								width: "140px",
								value: "{Ename}",
								showValueHelp: true,
								valueHelpOnly: true,
								valueHelpRequest: oController.searchOrgehPernr
							}),
							new sap.m.Label({text: "{i18n>LABEL_74003}"}), // 대상년도
                            oDateYearCombo
						]
                    })
					.setModel(oController.SearchModel)
                    .bindElement("/User")
                    .addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [
							new sap.m.Button({
								press: oController.onPressSer.bind(oController),
								text: "{i18n>LABEL_74004}" // 조회
							}).addStyleClass("button-search")
						]
					})
					.addStyleClass("button-group")
				]
			})
			.addStyleClass("search-box search-bg pb-7px mt-16px");

			var infoBox = new sap.m.HBox({
                justifyContent: sap.m.FlexJustifyContent.End,
                alignContent: sap.m.FlexAlignContent.End,
                alignItems: sap.m.FlexAlignItems.End,
                fitContainer: true,
                items: [                         
                    new sap.m.HBox({
                        items: [
                            new sap.m.Label().addStyleClass("custom-legend-color bg-signature-gray"),
                            new sap.m.Label({ text: "{i18n>LABEL_74041}" }).addStyleClass("custom-legend-item"), // 결재중
                            new sap.m.Label().addStyleClass("custom-legend-color bg-signature-darkgreen"),
                            new sap.m.Label({ text: "{i18n>LABEL_74006}" }).addStyleClass("custom-legend-item"), // 승인
                            new sap.m.Label().addStyleClass("custom-legend-color bg-signature-orange"),
                            new sap.m.Label({ text: "{i18n>LABEL_74007}" }).addStyleClass("custom-legend-item"), // 반려
                            new sap.m.Label().addStyleClass("custom-legend-color bg-signature-cyanblue"),
                            new sap.m.Label({ text: "{i18n>LABEL_74008}" }).addStyleClass("custom-legend-item") // 지급
                        ]
                    }).addStyleClass("custom-legend-group mb-5px mr-10px"),
                    new sap.m.HBox({
                        items: [
                            new sap.m.Button({
                                press: oController.onPressExcelDownload.bind(oController),
                                text: "{i18n>LABEL_00129}" // Excel
                            })
                            .addStyleClass("button-light"),
                            new sap.m.Button({
                                press: oController.onPressReq,
                                text: "{i18n>LABEL_74005}" // 신청
                            }).addStyleClass("button-light")
                        ]
                    }).addStyleClass("button-group")
				]
            }).addStyleClass("mt-20px");

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
                rowSettingsTemplate: new sap.ui.table.RowSettings({
                    highlight: {
                        path: "Status",
                        formatter: function (v) {
                            switch (v) {
                                case "00":
                                    return sap.ui.core.IndicationColor.Indication01;
                                case "99":
                                    return sap.ui.core.IndicationColor.Indication02;
                                case "88":
                                    return sap.ui.core.IndicationColor.Indication03;
                                case "ZZ":
                                    return sap.ui.core.IndicationColor.Indication04;
                                default:
                                    return null;
                            }
                        }
                    }
                }),
				noData: "{i18n>LABEL_00901}"
			})
			.addStyleClass("mt-8px row-link")
			.setModel(oController.TableModel)
			.bindRows("/Data")
			.attachCellClick(oController.onSelectedRow);
			
			ZHR_TABLES.makeColumn(oController, oTable, this._Model);

            oTable.addEventDelegate({
                onAfterRendering : function(){
                    oController._Columns = [];
                    for(var i=0; i<oController.getView()._Model.length; i++){	
                        var column = {};
                            column.label = oController.getBundleText(common.Common.stripI18nExpression(oController.getView()._Model[i].label));
                            column.property = oController.getView()._Model[i].id;
                            column.type = "string";
                            column.width = 20;
                        oController._Columns.push(column);
                    }
                }
            });
			
			return new PageHelper({
				contentItems: [
					oSearchBox,
					infoBox,
					oTable
				]
			});
		},

		loadModel: function () {
			// Model 선언
			$.app.setModel("ZHR_BENEFIT_SRV");
			$.app.setModel("ZHR_COMMON_SRV");
		}
	});
});
