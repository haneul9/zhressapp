sap.ui.define([
	"../common/PageHelper",
	"../common/ZHR_TABLES",
	"../common/PickOnlyDateRangeSelection"
], function (PageHelper, ZHR_TABLES, PickOnlyDateRangeSelection) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
        
        _ColModel: [
            {id: "Reqdt",     label: "{i18n>LABEL_45003}", /* 신청일 */      plabel: "", resize: true, span: 0, type: "date",	sort: true,  filter: true,  width: "auto"},
            {id: "Pernr",     label: "{i18n>LABEL_45004}", /* 사번 */        plabel: "", resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "auto"},
            {id: "Ename",     label: "{i18n>LABEL_45024}", /* 성명 */        plabel: "", resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "auto"},
            {id: "Stext",     label: "{i18n>LABEL_45005}", /* 부서 */        plabel: "", resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "auto"},
            {id: "ZtitleTxt", label: "{i18n>LABEL_45006}", /* 직위 */        plabel: "", resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "auto"},
            {id: "ZpGradeTxt",label: "{i18n>LABEL_45007}", /* 직급 */        plabel: "", resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "auto"},
            {id: "Jentd",     label: "{i18n>LABEL_45008}", /* 자사입사일 */  plabel: "", resize: true, span: 0, type: "date",  	sort: true,  filter: true,  width: "auto"},
            {id: "Gentd",     label: "{i18n>LABEL_45009}", /* 그룹입사일 */  plabel: "", resize: true, span: 0, type: "date",  	sort: true,  filter: true,  width: "auto"},
            {id: "Prmdt",     label: "{i18n>LABEL_45010}", /* 승진일 */      plabel: "", resize: true, span: 0, type: "date",  	sort: true,  filter: true,  width: "auto"},
            {id: "Zchenm",    label: "{i18n>LABEL_45011}", /* 담당자 */      plabel: "", resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "auto"},
            {id: "StatusTxt", label: "{i18n>LABEL_45012}", /* 진행상태 */    plabel: "", resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "auto"}
        ],
		
		getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
			this.loadModel();

			var vYear = new Date().getFullYear();
			var vMonth = new Date().getMonth()+1;
			
			var oApplyDateBox = new sap.m.FlexBox({
				fitContainer: true,
				items: [ 
					new sap.m.HBox({
						items: [
							new sap.m.Label({
								text: "{i18n>LABEL_23001}", // 신청일								
							}),							
							new PickOnlyDateRangeSelection(oController.PAGEID + "_ApplyDate", {
								width: "220px",
								layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
								delimiter: "~",
								dateValue: new Date(vYear-1, vMonth, 1),
								secondDateValue: new Date(vYear, vMonth, 0)
							}),
							new sap.m.Label({
								text: "{i18n>LABEL_23031}", // 신청자 성명							
							}),
                            new sap.m.Input(oController.PAGEID + "_EnameInput",{
                                width: "200px",
                                value: "{Ename}"
                            })
						]
                    }).addStyleClass("search-field-group"),
					new sap.m.HBox({
						items: [
							new sap.m.Button({
								press: oController.onPressSer,
								text: "{i18n>LABEL_23010}", // 조회
							}).addStyleClass("button-search")
						]
					})
					.addStyleClass("button-group")
				]
			}).addStyleClass("search-box search-bg pb-7px");
            
			var infoBox = new sap.m.FlexBox({
				fitContainer: true,
				items: [
                    new sap.m.HBox({
						items: [
							 // 신청 현황
							new sap.m.Label({text: "{i18n>LABEL_45002}" }).addStyleClass("sub-title")
						]
					})
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
				noData: "{i18n>LABEL_00901}"
			})
			.addStyleClass("mt-30px")
			.setModel(oController.TableModel)
			.bindRows("/Data")
			.attachCellClick(oController.onSelectedRow);
			
			ZHR_TABLES.makeColumn(oController, oTable, this._ColModel);
			
			return new PageHelper({
				contentItems: [
					infoBox,
					oApplyDateBox,
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
