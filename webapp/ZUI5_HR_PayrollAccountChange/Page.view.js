$.sap.require("fragment.COMMON_ATTACH_FILES");
sap.ui.define([
	"../common/PageHelper",
	"../common/ZHR_TABLES"
], function (PageHelper, ZHR_TABLES) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
        
        _Model: [
            {id: "Statust",label: "{i18n>LABEL_75002}" /* 진행상태 */, plabel: "", resize: true, span: 0, type: "string",sort: true,  filter: true,  width: "8%"},
            {id: "Pernr",  label: "{i18n>LABEL_75003}" /* 사번 */,     plabel: "", resize: true, span: 0, type: "string",sort: true,  filter: true,  width: "8%"},
            {id: "Ename",  label: "{i18n>LABEL_75004}" /* 성명 */,     plabel: "", resize: true, span: 0, type: "string",    sort: true,  filter: true,  width: "8%"},
            {id: "Banka",  label: "{i18n>LABEL_75005}" /* 은행(변경후) */, plabel: "", resize: true, span: 0, type: "string",   sort: true,  filter: true,  width: "10%"},
            {id: "Bankn",  label: "{i18n>LABEL_75006}" /* 계좌번호(변경후) */, plabel: "", resize: true, span: 0, type: "string",    sort: true,  filter: true,  width: "13%"},
            {id: "Banka2", label: "{i18n>LABEL_75007}" /* 은행(변경전) */, plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "10%"},
            {id: "Bankn2", label: "{i18n>LABEL_75008}" /* 계좌번호(변경전) */,     plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "13%"},
            {id: "Appda",  label: "{i18n>LABEL_75009}" /* 신청일 */,   plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true,  width: "auto"},
            {id: "Sgnda",  label: "{i18n>LABEL_75010}" /* 결재일 */,   plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true,  width: "auto"},
            {id: "Payym",  label: "{i18n>LABEL_75011}" /* 적용년월 */, plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"}
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
							new sap.m.Label({text: "{i18n>LABEL_75015}" }), // 사원
							new sap.m.Input({
								width: "140px",
								value: "{Ename}",
                                editable: false
							}),
							new sap.m.Label({text: "{i18n>LABEL_75016}"}), // 은행
							new sap.m.Input({
								width: "250px",
								value: "{IBanka}",
                                editable: false
							}),
							new sap.m.Label({text: "{i18n>LABEL_75017}"}), // 계좌번호
							new sap.m.Input({
								width: "200px",
								value: "{IBankn}",
                                editable: false
							})
						]
                    })
					.setModel(oController.EmpModel)
                    .bindElement("/User")
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
                            new sap.m.Label().addStyleClass("custom-legend-color bg-signature-gray"),
                            new sap.m.Label({ text: "{i18n>LABEL_75012}" }).addStyleClass("custom-legend-item"), // 신청
                            new sap.m.Label().addStyleClass("custom-legend-color bg-signature-darkgreen"),
                            new sap.m.Label({ text: "{i18n>LABEL_75013}" }).addStyleClass("custom-legend-item"), // 승인
                            new sap.m.Label().addStyleClass("custom-legend-color bg-signature-orange"),
                            new sap.m.Label({ text: "{i18n>LABEL_75014}" }).addStyleClass("custom-legend-item")  // 반려
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
			$.app.setModel("ZHR_PAY_RESULT_SRV");
			$.app.setModel("ZHR_COMMON_SRV");
		}
	});
});
