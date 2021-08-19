sap.ui.define([
	"../common/PageHelper",
	"../common/ZHR_TABLES",
    "../common/Common"
], function (PageHelper, ZHR_TABLES, Common) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
        
        _Model: [
            {id: "Recstatx",  label: "{i18n>LABEL_77015}" /* 상태 */,        plabel: "", resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "auto"},
            {id: "Orgtx",     label: "{i18n>LABEL_77016}" /* 요청부서 */,    plabel: "", resize: true, span: 0, type: "string",sort: true,  filter: true,  width: "auto"},
            {id: "Recrsntx",  label: "{i18n>LABEL_77045}" /* 충원사유 */,    plabel: "", resize: true, span: 0, type: "string",sort: true,  filter: true,  width: "auto"},
            {id: "Zhgradetx", label: "{i18n>LABEL_77046}" /* 직군 */,        plabel: "", resize: true, span: 0, type: "string",sort: true,  filter: true,  width: "auto"},
            {id: "Recjikgb",  label: "{i18n>LABEL_77018}" /* 직급 */,        plabel: "", resize: true, span: 0, type: "string",sort: true,  filter: true,  width: "auto"},
            {id: "Recjob",    label: "{i18n>LABEL_77019}" /* 직무 */,        plabel: "", resize: true, span: 0, type: "string",sort: true,  filter: true,  width: "20%"},
            {id: "Werkstx",   label: "{i18n>LABEL_77047}" /* 담당인사영역 */,plabel: "", resize: true, span: 0, type: "string",sort: true,  filter: true,  width: "auto"},
            {id: "Recda",     label: "{i18n>LABEL_77021}" /* 채용희망일 */,  plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true,  width: "auto"},
            {id: "Reqda",     label: "{i18n>LABEL_77022}" /* 요청일 */,      plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true,  width: "auto"}
        ],
		
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
			this.loadModel();
			
			var oSearchBox = new sap.m.FlexBox({
				fitContainer: true,
				items: [ 
					new sap.m.HBox({
						items: [
							new sap.m.Label({text: "{i18n>LABEL_77002}" }), // 부서
							new sap.m.MultiInput(oController.PAGEID + "_Orgeh", {
                                width: "200px",
                                showValueHelp: true,
                                valueHelpOnly: true,
                                valueHelpRequest: oController.displayMultiOrgSearchDialog
                            }),
                            new sap.m.HBox({
                                items: [
                                    new sap.m.Button({
                                        press: oController.onPressSer.bind(oController),
                                        text: "{i18n>LABEL_77003}" // 조회
                                    }).addStyleClass("button-search")
                                ]
                            })
                            .addStyleClass("button-group")
						]
                    })
					.setModel(oController.SearchModel)
                    .bindElement("/Dept")
                    .addStyleClass("search-field-group")
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
                            new sap.m.Label().addStyleClass("custom-legend-color Indication01"),
                            new sap.m.Label({ text: "{i18n>LABEL_77004}"}).addStyleClass("custom-legend-item"), // 현업부서요청
                            new sap.m.Label({ 
                                visible: {
                                    path: "Num1",
                                    formatter: function(v) {
                                        return !(Common.checkNull(v) || v === 0);
                                    }
                                },
                                text: {
                                    path: "Num1",
                                    formatter: function(v) {
                                    return "(" + v + ")";
                                }
                            }}).addStyleClass("ml-5px NumBold"),
                            new sap.m.Label().addStyleClass("custom-legend-color Indication02 ml-35px"),
                            new sap.m.Label({ text: "{i18n>LABEL_77005}"}).addStyleClass("custom-legend-item"), // 인사팀검토중
                            new sap.m.Label({ 
                                visible: {
                                    path: "Num2",
                                    formatter: function(v) {
                                        return !(Common.checkNull(v) || v === 0);
                                    }
                                },
                                text: {
                                    path: "Num2",
                                    formatter: function(v) {
                                    return "(" + v + ")";
                                }
                            }}).addStyleClass("ml-5px NumBold"),
                            new sap.m.Label().addStyleClass("custom-legend-color Indication03 ml-35px"),
                            new sap.m.Label({ text: "{i18n>LABEL_77006}"}).addStyleClass("custom-legend-item"),  // 인사팀반송
                            new sap.m.Label({ 
                                visible: {
                                    path: "Num3",
                                    formatter: function(v) {
                                        return !(Common.checkNull(v) || v === 0);
                                    }
                                },
                                text: {
                                    path: "Num3",
                                    formatter: function(v) {
                                    return "(" + v + ")";
                                }
                            }}).addStyleClass("ml-5px NumBold"),
                            new sap.m.Label().addStyleClass("custom-legend-color Indication04 ml-35px"),
                            new sap.m.Label({ text: "{i18n>LABEL_77007}"}).addStyleClass("custom-legend-item"), // 결재중
                            new sap.m.Label({ 
                                visible: {
                                    path: "Num4",
                                    formatter: function(v) {
                                        return !(Common.checkNull(v) || v === 0);
                                    }
                                },
                                text: {
                                    path: "Num4",
                                    formatter: function(v) {
                                    return "(" + v + ")";
                                }
                            }}).addStyleClass("ml-5px NumBold"),
                            new sap.m.Label().addStyleClass("custom-legend-color Indication05 ml-35px"),
                            new sap.m.Label({ text: "{i18n>LABEL_77008}"}).addStyleClass("custom-legend-item"), // 승인
                            new sap.m.Label({ 
                                visible: {
                                    path: "Num5",
                                    formatter: function(v) {
                                        return !(Common.checkNull(v) || v === 0);
                                    }
                                },
                                text: {
                                    path: "Num5",
                                    formatter: function(v) {
                                    return "(" + v + ")";
                                }
                            }}).addStyleClass("ml-5px NumBold"),
                            new sap.m.Label().addStyleClass("custom-legend-color Indication06 ml-35px"),
                            new sap.m.Label({ text: "{i18n>LABEL_77009}"}).addStyleClass("custom-legend-item"),  // 반려
                            new sap.m.Label({ 
                                visible: {
                                    path: "Num6",
                                    formatter: function(v) {
                                        return !(Common.checkNull(v) || v === 0);
                                    }
                                },
                                text: {
                                    path: "Num6",
                                    formatter: function(v) {
                                    return "(" + v + ")";
                                }
                            }}).addStyleClass("ml-5px NumBold"),
                            new sap.m.Label().addStyleClass("custom-legend-color Indication07 ml-35px"),
                            new sap.m.Label({ text: "{i18n>LABEL_77010}"}).addStyleClass("custom-legend-item"), // 채용중
                            new sap.m.Label({ 
                                visible: {
                                    path: "Num7",
                                    formatter: function(v) {
                                        return !(Common.checkNull(v) || v === 0);
                                    }
                                },
                                text: {
                                    path: "Num7",
                                    formatter: function(v) {
                                    return "(" + v + ")";
                                }
                            }}).addStyleClass("ml-5px NumBold"),
                            new sap.m.Label().addStyleClass("custom-legend-color Indication08 ml-35px"),
                            new sap.m.Label({ text: "{i18n>LABEL_77011}"}).addStyleClass("custom-legend-item"), // 채용보류
                            new sap.m.Label({ 
                                visible: {
                                    path: "Num8",
                                    formatter: function(v) {
                                        return !(Common.checkNull(v) || v === 0);
                                    }
                                },
                                text: {
                                    path: "Num8",
                                    formatter: function(v) {
                                    return "(" + v + ")";
                                }
                            }}).addStyleClass("ml-5px NumBold"),
                            new sap.m.Label().addStyleClass("custom-legend-color Indication09 ml-35px"),
                            new sap.m.Label({ text: "{i18n>LABEL_77012}"}).addStyleClass("custom-legend-item"),  // 채용완료
                            new sap.m.Label({ 
                                visible: {
                                    path: "Num9",
                                    formatter: function(v) {
                                        return !(Common.checkNull(v) || v === 0);
                                    }
                                },
                                text: {
                                    path: "Num9",
                                    formatter: function(v) {
                                    return "(" + v + ")";
                                }
                            }}).addStyleClass("ml-5px NumBold")
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
                                press: oController.onPressReq.bind(oController),
                                text: "{i18n>LABEL_77014}" // 신청
                            }).addStyleClass("button-light")
                        ]
                    }).addStyleClass("button-group")
				]
            })
            .setModel(oController.PersNumModel)
            .bindElement("/Data")
            .addStyleClass("mt-20px");

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
                        path: "Recsta",
                        formatter: function (v) {
                            switch (v) {
                                case "10": // 현업부서요청
                                    return sap.ui.core.IndicationColor.Indication01;
                                case "20": // 인사팀검토중
                                    return sap.ui.core.IndicationColor.Indication02;
                                case "21": // 인사팀반송
                                    return sap.ui.core.IndicationColor.Indication03;
                                case "30": // 결재중
                                    return sap.ui.core.IndicationColor.Indication04;
                                case "31": // 승인
                                    return sap.ui.core.IndicationColor.Indication05;
                                case "32": // 반려
                                    return sap.ui.core.IndicationColor.Indication06;
                                case "40": // 채용중
                                    return sap.ui.core.IndicationColor.Indication07;
                                case "41": // 채용보류
                                    return sap.ui.core.IndicationColor.Indication08;
                                case "42": // 채용완료
                                    return sap.ui.core.IndicationColor.Indication09;
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
			$.app.setModel("ZHR_HRDOC_SRV");
			$.app.setModel("ZHR_COMMON_SRV");
		}
	});
});
