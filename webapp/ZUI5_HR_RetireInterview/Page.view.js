sap.ui.define([
	"../common/PageHelper",
	"../common/ZHR_TABLES"
], function (PageHelper, ZHR_TABLES) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
        
        _ColModel: [
            {id: "Reqdt",     label: "{i18n>LABEL_45003}" /* 신청일 */,      plabel: "", resize: true, span: 0, type: "date",sort: true,  filter: true,  width: "auto"},
            {id: "Pernr",     label: "{i18n>LABEL_45004}" /* 사번 */,        plabel: "", resize: true, span: 0, type: "string",    sort: true,  filter: true,  width: "auto"},
            {id: "Stext",     label: "{i18n>LABEL_45005}" /* 부서 */,        plabel: "", resize: true, span: 0, type: "string",   sort: true,  filter: true,  width: "auto"},
            {id: "ZtitleTxt", label: "{i18n>LABEL_45006}" /* 직위 */,        plabel: "", resize: true, span: 0, type: "string",    sort: true,  filter: true,  width: "auto"},
            {id: "ZpGradeTxt",label: "{i18n>LABEL_45007}" /* 직급 */,        plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"},
            {id: "Jentd",     label: "{i18n>LABEL_45008}" /* 자사입사일 */,  plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true,  width: "auto"},
            {id: "Gentd",     label: "{i18n>LABEL_45009}" /* 그룹입사일 */,  plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true,  width: "auto"},
            {id: "Prmdt",     label: "{i18n>LABEL_45010}" /* 승진일 */,      plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true,  width: "auto"},
            {id: "Zchenm",    label: "{i18n>LABEL_45011}" /* 담당자 */,      plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "auto"},
            {id: "Status",    label: "{i18n>LABEL_45012}" /* 진행상태 */,    plabel: "", resize: true, span: 0, type: "template",  sort: true,  filter: true,  width: "auto", templateGetter: "getStatus"}
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
                    new sap.m.HBox({
						items: [
							new sap.m.Label({
                                text: "{i18n>LABEL_45002}" // 신청 현황                                
                            })
                            .addStyleClass("sub-title")
						]
					})
					.addStyleClass("info-field-group"),

					new sap.m.HBox({
						items: [
							new sap.m.Button({
								press: oController.onPressReq,
								text: "{i18n>LABEL_45016}" // 신청
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
				cellClick: oController.onSelectedRow,
			    width: "auto",
				rowHeight: 37,
				columnHeaderHeight: 38,
				noData: "{i18n>LABEL_00901}"
			})
			.addStyleClass("mt-10px row-link")
			.setModel(oController.TableModel)
			.bindRows("/Data");
			
			ZHR_TABLES.makeColumn(oController, oTable, this._ColModel);
			
			return new PageHelper({
				contentItems: [
					infoBox,
					oTable
				]
			});
		},

		loadModel: function () {
			// Model 선언
			$.app.setModel("ZHR_PERS_INFO_SRV");
			$.app.setModel("ZHR_COMMON_SRV");
		}
	});
});
