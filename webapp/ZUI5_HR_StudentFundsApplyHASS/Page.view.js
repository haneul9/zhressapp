$.sap.require("fragment.COMMON_ATTACH_FILES");
sap.ui.define([
	"../common/PageHelper",
	"../common/ZHR_TABLES",
	"../common/PickOnlyDateRangeSelection"
], function (PageHelper, ZHR_TABLES, PickOnlyDateRangeSelection) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
        
        _BaseModel: [
            {id: "Begda",       label: "{i18n>LABEL_38003}" /* 신청일 */,       plabel: "", resize: true, span: 0, type: "date",sort: true,  filter: true,  width: "8%"},
            {id: "Paydt",       label: "{i18n>LABEL_38052}" /* 납부일 */,       plabel: "", resize: true, span: 0, type: "date",sort: true,  filter: true,  width: "8%"},
            {id: "RelationTx",  label: "{i18n>LABEL_38004}" /* 관계 */,         plabel: "", resize: true, span: 0, type: "string",    sort: true,  filter: true,  width: "auto"},
            {id: "NameKor",     label: "{i18n>LABEL_38005}" /* 성명 */,         plabel: "", resize: true, span: 0, type: "string",   sort: true,  filter: true,  width: "auto"},
            {id: "SchoolText",	label: "{i18n>LABEL_38006}" /* 학교구분 */,      plabel: "", resize: true, span: 0, type: "string",    sort: true,  filter: true,  width: "10%"},
            {id: "SchoolName",  label: "{i18n>LABEL_38007}" /* 학교명 */,        plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "13%", align: sap.ui.core.HorizontalAlign.Left},
            {id: "GradeTx",     label: "{i18n>LABEL_38008}" /* 학년 */,          plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"},
            {id: "ReqSum",      label: "{i18n>LABEL_38009}" /* 신청금액 */,      plabel: "", resize: true, span: 0, type: "currency",  sort: true,  filter: true,  width: "10%"},
            {id: "AdmSum",      label: "{i18n>LABEL_38010}" /* 지원금액 */,      plabel: "", resize: true, span: 0, type: "currency",  sort: true,  filter: true,  width: "10%"},
            {id: "PayDate",     label: "{i18n>LABEL_38011}" /* 지급(예정)년월 */,plabel: "", resize: true, span: 0, type: "template",  sort: true,  filter: true,  width: "10%", templateGetter: "getPayDate"},
            {id: "StatusT",     label: "{i18n>LABEL_38012}" /* 결재상태 */,      plabel: "", resize: true, span: 0, type: "template",  sort: true,  filter: true,  width: "13%", templateGetter: "getStatus"}
        ],

		_HighTargetModel: [ // 첨단 (학자금 대상자)
			{id: "Fname", label: "{i18n>LABEL_38005}" /* 성명 */,     plabel: "", resize: true, span: 0, type: "string",sort: true,  filter: true,  width: "auto"},
			{id: "Atext", label: "{i18n>LABEL_38028}" /* 가족관계 */, plabel: "", resize: true, span: 0, type: "string",    sort: true,  filter: true,  width: "auto"},
			{id: "Fasin", label: "{i18n>LABEL_38049}" /* 학력 */,     plabel: "", resize: true, span: 0, type: "string",   sort: true,  filter: true,  width: "auto"},
			{id: "Fgbdt", label: "{i18n>LABEL_38030}" /* 생년월일 */, plabel: "", resize: true, span: 0, type: "date",    sort: true,  filter: true,  width: "auto"},
			{id: "Krage", label: "{i18n>LABEL_38029}" /* 나이 */,     plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"}
		],
		
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
			this.loadModel();

			var vYear = new Date().getFullYear();
			
			var oSearchBox = new sap.m.FlexBox({
				fitContainer: true,
				items: [ 
					new sap.m.HBox({
						items: [
							new sap.m.Label({text: "{i18n>LABEL_26027}" }), // 사원
							new sap.m.Input(oController.PAGEID + "_EmpInput", {
								width: "140px",
								value: "{Ename}",
								showValueHelp: true,
								valueHelpOnly: true,
								valueHelpRequest: oController.searchOrgehPernr
							})
							.setModel(oController.SearchModel)
							.bindElement("/User"),
							new sap.m.Label({text: "{i18n>LABEL_38003}"}), // 신청일
                            new PickOnlyDateRangeSelection(oController.PAGEID + "_SearchDate", {
								width: "250px",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								delimiter: "~",
								dateValue: new Date(vYear, 0, 1),
								secondDateValue: new Date()
							})
						]
                    }).addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [
							new sap.m.Button({
								press: oController.onPressSer.bind(oController),
								text: "{i18n>LABEL_00100}" // 조회
							}).addStyleClass("button-search")
						]
					})
					.addStyleClass("button-group")
				]
			})
			.addStyleClass("search-box search-bg pb-7px mt-16px");

			var infoBox = new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [
                    new sap.m.HBox({
						items: [
							new sap.m.Label({
                                text: "{i18n>LABEL_38002}" // 신청 현황                                
                            })
                            .addStyleClass("sub-title")
						]
					})
					.addStyleClass("info-field-group"),

					new sap.m.HBox({
						items: [
							new sap.m.Button({
								press: oController.onPressReq,
								text: "{i18n>LABEL_38044}", // 신청
								visible: {
                                    path: "/Bukrs",
                                    formatter: function(v) {
                                        if(v !== "A100") return true;
                                        else return false;
                                    }
                                },
							}).addStyleClass("button-light")
						]
					})
					.setModel(oController.LogModel)
				]
            }).addStyleClass("mt-20px");

            var oHighTable = new sap.ui.table.Table(oController.PAGEID + "_HighTable", {
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
				noData: "{i18n>LABEL_00901}",
				rowSettingsTemplate : new sap.ui.table.RowSettings({
					highlight : {
						path : "Gubun",
						formatter : function(v) {
							if(v === "Y")
								this.getParent().addStyleClass("background-lightblue");
							else
								this.getParent().removeStyleClass("background-lightblue");

							return sap.ui.core.ValueState.None;
						}
					}
				})
			})
			.addStyleClass("mt-10px row-link")
			.attachCellClick(oController.onHighSelectedRow)
			.setModel(oController.ChildrenModel)
			.bindRows("/Data");
			
			ZHR_TABLES.makeColumn(oController, oHighTable, this._HighTargetModel);

            var targetBox = new sap.m.VBox({
				fitContainer: true,
                visible: {
                    path: "/Bukrs",
                    formatter: function(v) {
                        if(v === "A100") return true;
                        else return false;
                    }
                },
				items: [
                    new sap.m.FlexBox({
                        justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
                        alignContent: sap.m.FlexAlignContent.End,
                        alignItems: sap.m.FlexAlignItems.End,
                        fitContainer: true,
                        items: [
							new sap.m.HBox({
								items: [
									new sap.m.Label({
										text: "{i18n>LABEL_38027}" // 학자금 대상자                                
									})
									.addStyleClass("sub-title")
								]
							})
							.addStyleClass("info-field-group"),
                        
                            new sap.m.Button({
                                press: oController.onPressReq,
                                text: "{i18n>LABEL_38044}", // 신청
                                visible: {
                                    path: "/LogData/EClose",
                                    formatter: function(v) {
                                        if(v === "X") return false;
                                        else return true;
                                    }
                                }
                            })
                            .addStyleClass("button-light")
                        ]
                    }).addStyleClass("mt-20px"),
                    oHighTable
				]
            })
            .setModel(oController.LogModel);

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
			.addStyleClass("mt-8px row-link")
			.setModel(oController.TableModel)
			.bindRows("/Data")
			.attachCellClick(oController.onSelectedRow);
			
			ZHR_TABLES.makeColumn(oController, oTable, this._BaseModel);
			
			return new PageHelper({
				contentItems: [
					oSearchBox,
                    targetBox,
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
