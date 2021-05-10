$.sap.require("fragment.COMMON_ATTACH_FILES");
sap.ui.define([
	"../common/PageHelper",
	"../common/ZHR_TABLES",
	"../common/PickOnlyDateRangeSelection"
], function (PageHelper, ZHR_TABLES, PickOnlyDateRangeSelection) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
        
        _colModel: [
            {id: "Check",       label: "{i18n>LABEL_59003}" /* 선택 */,             plabel: "", resize: true, span: 0, type: "template",sort: true,  filter: true,  width: "7%", templateGetter: "getChoice"},
            {id: "Begda",       label: "{i18n>LABEL_59004}" /* 신청일 */,           plabel: "", resize: true, span: 0, type: "date",sort: true,  filter: true,  width: "auto"},
            {id: "ZfwkpsT",     label: "{i18n>LABEL_59005}" /* 파견지 */,           plabel: "", resize: true, span: 0, type: "template",    sort: true,  filter: true,  width: "auto", templateGetter: "getLocation"},
            {id: "ZmuflgT",     label: "{i18n>LABEL_59006}" /* 기혼/미혼 여부 */,    plabel: "", resize: true, span: 0, type: "string",   sort: true,  filter: true,  width: "auto"},
            {id: "ZlfplsT", 	label: "{i18n>LABEL_59007}" /* 교통비 지급 기준지 */,plabel: "", resize: true, span: 0, type: "template",    sort: true,  filter: true,  width: "auto", templateGetter: "getCostPlace"},
            {id: "Zscsym",  	label: "{i18n>LABEL_59008}" /* 숙소계약기간 */,      plabel: "", resize: true, span: 0, type: "template",    sort: true,  filter: true,  width: "auto", templateGetter: "getDatepicker"},
            {id: "Zseeym",      label: "{i18n>LABEL_59009}" /* 조기 종료월 */,      plabel: "", resize: true, span: 0, type: "template",  sort: true,  filter: true,  width: "auto", templateGetter: "getEalryDate"},
            {id: "Zcoamt",      label: "{i18n>LABEL_59010}" /* 회사 지원금액 */,    plabel: "", resize: true, span: 0, type: "currency",  sort: true,  filter: true,  width: "auto"},
            {id: "Zactdt",      label: "{i18n>LABEL_59011}" /* 발령일자 */,         plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true,  width: "auto"},
            {id: "Status",      label: "{i18n>LABEL_59012}" /* 결재상태 */,         plabel: "", resize: true, span: 0, type: "template",  sort: true,  filter: true,  width: "auto", templateGetter: "getStatus"}
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
                                text: "{i18n>LABEL_59002}" // 신청 현황                                
                            })
                            .addStyleClass("sub-title")
						]
					})
					.addStyleClass("info-field-group"),

					new sap.m.HBox({
						items: [
							new sap.m.Button({ // 신청
								press: oController.onPressReq.bind(oController),
								text: "{i18n>LABEL_59026}",
                                visible: {
                                    path: "/Data/EClose",
                                    formatter: function(v) {
                                        return v !== "X";
                                    }
                                }
							}).addStyleClass("button-light mr-10px"),
							new sap.m.Button({ // 계약기간 조기 종료 신청
								press: oController.onPressEnd.bind(oController),
								text: "{i18n>LABEL_59027}",
                                visible: {
                                    path: "/Data/EClose",
                                    formatter: function(v) {
                                        return v !== "X";
                                    }
                                }
							}).addStyleClass("button-light")
						]
					})
				]
            })
            .setModel(oController.LogModel)
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
				noData: "{i18n>LABEL_00901}"
			})
			.addStyleClass("mt-8px row-link")
			.setModel(oController.TableModel)
			.bindRows("/Data")
			.attachCellClick(oController.onSelectedRow);
			
			ZHR_TABLES.makeColumn(oController, oTable, this._colModel);
			
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
