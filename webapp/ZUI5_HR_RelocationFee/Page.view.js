sap.ui.define([
	"../common/PageHelper",
	"../common/ZHR_TABLES"
], function (PageHelper, ZHR_TABLES) {
"use strict";
//test
	sap.ui.jsview($.app.APP_ID, {
		
		_colModel: [
			{id: "ZfwkpsT",  label: "{i18n>LABEL_34003}" /* 부임지 */,          plabel: "", resize: true, span: 0, type: "template",sort: true,  filter: true,  width: "auto", templateGetter: "getRelocation"},
			{id: "ZwtfmlT",  label: "{i18n>LABEL_34004}" /* 가족동반 여부 */,   plabel: "", resize: true, span: 0, type: "string",    sort: true,  filter: true,  width: "auto"},
			{id: "Ztstot",   label: "{i18n>LABEL_34005}" /* 부임이전비 */,      plabel: "", resize: true, span: 0, type: "template",   sort: true,  filter: true,  width: "auto", templateGetter: "getLocationCost"},
			{id: "Zactdt", 	 label: "{i18n>LABEL_34006}" /* 발령일자 */,        plabel: "", resize: true, span: 0, type: "date",    sort: true,  filter: true,  width: "auto"},
			{id: "StatusT",  label: "{i18n>LABEL_34007}" /* 결재상태 */,        plabel: "", resize: true, span: 0, type: "template",  sort: true,  filter: true,  width: "auto", templateGetter: "getStatus"}
		],
		
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
			this.loadModel();

			var infoBox = new sap.m.FlexBox({
				justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
				alignContent: sap.m.FlexAlignContent.End,
				alignItems: sap.m.FlexAlignItems.End,
				fitContainer: true,
				items: [
                    new sap.m.FlexBox({
						items: [
							new sap.m.Label({
                                text: "{i18n>LABEL_34002}", // 신청 현황
                                design: "Bold"
                            })
                            .addStyleClass("sub-title")
						]
					}).addStyleClass("info-field-group"),
					new sap.m.FlexBox({
						items: [
							new sap.m.Button({
								press: oController.onPressReq.bind(oController),
								text: "{i18n>LABEL_34022}", // 신청
								visible: {
									path: "/LogData/EClose",
									formatter: function(v) {
										if(v === "X") return false;
										else return true;
									}
								}
							}).addStyleClass("button-light")
						]
					})
					.addStyleClass("button-group")
					.setModel(oController.LogModel)
				]
            }).addStyleClass("info-box");
			
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
			.addStyleClass("mt-10px")
			.setModel(oController.TableModel)
			.bindRows("/Data")
			.attachCellClick(oController.onSelectedRow.bind(oController));
			
			ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
			
			return new PageHelper({
				contentItems: [
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
