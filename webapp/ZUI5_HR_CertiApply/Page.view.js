sap.ui.define([
	"../common/PageHelper",
	"../common/ZHR_TABLES",
	"../common/EmpBasicInfoBox"
], function (PageHelper, ZHR_TABLES, EmpBasicInfoBox) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
        
       	getControllerName: function () {
			return $.app.APP_ID;
		},

		createContent: function (oController) {
			this.loadModel();

			var oEmpBasicInfoBox = new EmpBasicInfoBox(oController.EmployeeModel);
            
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
							// new sap.m.Button({
							// 	press: oController.onTableSearch,
							// 	text: "{i18n>LABEL_00100}", // 조회
							// }).addStyleClass("button-light"),
							new sap.m.Button({
								press: oController.onPressReq,
								text: "{i18n>LABEL_38044}", // 신청
							}).addStyleClass("button-light")
						]
					})
					.setModel(oController.LogModel)
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
			.addStyleClass("mt-8px")
			.setModel(oController.TableModel)
			.bindRows("/Data");
			
			// ZHR_TABLES.makeColumn(oController, oTable, this._BaseModel);
			ZHR_TABLES.makeColumn(oController, oTable,   
				[{id: "Begda",       label: "{i18n>LABEL_38003}" /* 신청일 */,       plabel: "", resize: true, span: 0, type: "date",sort: true,  filter: true,  width: "8%"},
	            {id: "Typetxt",       label: "{i18n>LABEL_65002}" /* 구분 */,       plabel: "", resize: true, span: 0, type: "string",sort: true,  filter: true,  width: "8%"},
	            {id: "Langtxt",  label: "{i18n>LABEL_65003}" /* 언어 */,         plabel: "", resize: true, span: 0, type: "string",    sort: true,  filter: true,  width: "auto"},
	            {id: "Zyear",     label: "{i18n>LABEL_65004}" /* 기준년도 */,         plabel: "", resize: true, span: 0, type: "string",   sort: true,  filter: true,  width: "auto"},
	            {id: "Zsubmit",	label: "{i18n>LABEL_65005}" /* 제출처 */,      plabel: "", resize: true, span: 0, type: "string",    sort: true,  filter: true,  width: "10%"},
	            {id: "Zuse",  label: "{i18n>LABEL_65006}" /* 용도 */,        plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "13%", align: sap.ui.core.HorizontalAlign.Left},
	            {id: "Zcount",     label: "{i18n>LABEL_65007}" /* 수량 */,          plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "5%"},
	            {id: "Zstatustxt",      label: "{i18n>LABEL_65008}" /* 처리상태 */,      plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "10%"},
	            {id: "AptypT",      label: "{i18n>LABEL_65009}" /* 수령방법 */,      plabel: "", resize: true, span: 0, type: "string",  sort: true,  filter: true,  width: "10%"},
	            {id: "Zstatus",     label: "{i18n>LABEL_65010}" /* 비고 */,plabel: "", resize: true, span: 0, type: "template",  sort: true,  filter: true,  width: "10%", templateGetter: "getStatusTemplate", templateGetterOwner: this},
	        	]
	        );
			return new PageHelper({
				contentItems: [
					oEmpBasicInfoBox,
                   	infoBox,
					oTable
				]
			});
		},
	
		loadModel: function () {
				// Model 선언
				$.app.setModel("ZHR_CERTI_SRV");
				$.app.setModel("ZHR_COMMON_SRV");
			},
			
		getStatusTemplate: function(columnInfo) {
			var oController = $.app.getController();
						
			return new sap.m.Button({
				press : oController.onPressButton,
				text: {
					parts: [
						{ path: columnInfo.id },
						{ path: "Aptyp" }
					],
					formatter : function(v, v2) {
						if(v === "1"){
							return oController.getBundleText("LABEL_65022"); // 처리중
						}else if(v === "2" && v2 === "1"){
							return oController.getBundleText("LABEL_65023"); // 재발급
						}else if(v === "3"){
							return oController.getBundleText("LABEL_65024"); // 프린트
						}
					}
				},
				icon : {
					parts: [
						{ path: columnInfo.id },		
						{ path: "Aptyp" }
					],
					formatter : function(v, v2) {
						if(v === "1"){
							return "sap-icon://repost";
						}else if(v === "2" && v2 === "1"){
							return "sap-icon://edit";
						}else if(v === "3"){
							return "sap-icon://print";
						}
					}
				},
				visible : {
					parts: [
						{ path: columnInfo.id },		
						{ path: "Aptyp" }
					],
					formatter : function(v, v2) {
						if(v === "2"){
							if( v2 === "1") return true;
							else return false;
						}else{
							return true;
						}
					}
				},
			});
		}
	})
});
