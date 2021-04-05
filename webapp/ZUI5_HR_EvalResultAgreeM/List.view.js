sap.ui.define([
	"../common/Common",
	"../common/Formatter",
	"../common/PageHelper",
	"../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
		
		_colModel: [ // 가입현황 Table
			{id: "Donghotx",label: "{i18n>LABEL_10002}"/* 동호회 */,	  plabel: "", resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "auto"},
			{id: "Begda", 	label: "{i18n>LABEL_10003}"/* 가입 시작일 */, plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true,  width: "auto"},
			{id: "Endda", 	label: "{i18n>LABEL_10004}"/* 가입 종료일 */, plabel: "", resize: true, span: 0, type: "date",  sort: true,  filter: true,  width: "auto"},
			{id: "Manager", label: "{i18n>LABEL_10005}"/* 관리자 */,	  plabel: "", resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "350px", align: sap.ui.core.HorizontalAlign.Left},
			{id: "Phone",	label: "{i18n>LABEL_10006}"/* 연락처 */,	  plabel: "", resize: true, span: 0, type: "string", sort: true,  filter: true,  width: "auto"},
			{id: "Betrgtx",	label: "{i18n>LABEL_10007}"/* 회비(월) */,  plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "100px", align: sap.ui.core.HorizontalAlign.Right, templateGetter: "getBetrgTx"},
			{id: "Statustx",label: "{i18n>LABEL_10008}"/* 상태 */,	  plabel: "", resize: true, span: 0, type: "string", sort: false, filter: false, width: "150px"},
			{id: "Bigo",	label: "{i18n>LABEL_10009}"/* 비고 */,	  plabel: "", resize: true, span: 0, type: "template", sort: false, filter: false, width: "100px", templateGetter: "getVisibleButton"}
		],
		
		_memeberColModel: [ //회원정보 Table 해당사원이 운영진이냐에 따라 visible ture
			{id: "Gubuntx",	label: "{i18n>LABEL_10010}"/* 구분 */,	  plabel: "", resize: true, span: 0, type: "string",   sort: true,  filter: true,  width: "auto"},
			{id: "Orgtx", 	label: "{i18n>LABEL_10011}"/* 소속 */,	  plabel: "", resize: true, span: 0, type: "string",   sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Left},
			{id: "Name", 	label: "{i18n>LABEL_10012}"/* 회원명 */, 	  plabel: "", resize: true, span: 0, type: "string",   sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Left},
			{id: "Phone", 	label: "{i18n>LABEL_10013}"/* 연락처 */,	  plabel: "", resize: true, span: 0, type: "string",   sort: true,  filter: true,  width: "auto"},
			{id: "Begda", 	label: "{i18n>LABEL_10014}"/* 가입 시작일 */, plabel: "", resize: true, span: 0, type: "date",   sort: true,  filter: true,  width: "auto"},
			{id: "Endda",	label: "{i18n>LABEL_10015}"/* 가입 종료일 */, plabel: "", resize: true, span: 0, type: "date",   sort: true,  filter: true,  width: "auto"},
			{id: "ApplyDt",	label: "{i18n>LABEL_10016}"/* 가입 신청일 */, plabel: "", resize: true, span: 0, type: "date",   sort: false, filter: false, width: "auto"}
			//{id: "Werks",	label: "{i18n>LABEL_10017}"/* 가입처리 */,	  plabel: "", resize: true, span: 0, type: "template",   sort: false, filter: false, width: "auto", templateGetter: "getRequestButton1"}
		],
		
		_memeberColModel2: [ 
			{id: "Gubuntx",	label: "{i18n>LABEL_10010}"/* 구분 */,	  plabel: "", resize: true, span: 0, type: "string",   sort: true,  filter: true,  width: "auto"},
			{id: "Orgtx", 	label: "{i18n>LABEL_10011}"/* 소속 */,	  plabel: "", resize: true, span: 0, type: "string",   sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Left},
			{id: "Name", 	label: "{i18n>LABEL_10012}"/* 회원명 */, 	  plabel: "", resize: true, span: 0, type: "string",   sort: true,  filter: true,  width: "auto", align: sap.ui.core.HorizontalAlign.Left},
			{id: "Phone", 	label: "{i18n>LABEL_10013}"/* 연락처 */,	  plabel: "", resize: true, span: 0, type: "string",   sort: true,  filter: true,  width: "auto"},
			{id: "Begda", 	label: "{i18n>LABEL_10014}"/* 가입 시작일 */, plabel: "", resize: true, span: 0, type: "date",   sort: true,  filter: true,  width: "auto"},
			{id: "Endda",	label: "{i18n>LABEL_10015}"/* 가입 종료일 */, plabel: "", resize: true, span: 0, type: "date",   sort: true,  filter: true,  width: "auto"},
			{id: "ApplyDt",	label: "{i18n>LABEL_10016}"/* 가입 신청일 */, plabel: "", resize: true, span: 0, type: "date",   sort: false, filter: false, width: "auto"}
			//{id: "Werks",	label: "{i18n>LABEL_10017}"/* 가입처리 */,	  plabel: "", resize: true, span: 0, type: "template",   sort: false, filter: false, width: "auto", templateGetter: "getRequestButton2"}
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
								text: "{i18n>LABEL_10022}"
							})
							.addStyleClass("sub-title") // 가입 현황
						]
					}).addStyleClass("info-field-group"),
					new sap.m.FlexBox({
						items: [
							new sap.m.Button({
								press: oController.onPressReqBtn,
								text: "{i18n>LABEL_10018}" // 가입신청
							}).addStyleClass("button-light")
						]
					})
					.addStyleClass("button-group")
				]
			})
			.addStyleClass("info-box"); 
			
			var oTable = new sap.ui.table.Table(oController.PAGEID + "_Table", {
				selectionMode: sap.ui.table.SelectionMode.None,
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 10,
				showOverlay: false,
				showNoData: true,
				width: "100%",
				rowHeight: 37,
				columnHeaderHeight: 38,
				visibleRowCountMode: sap.ui.table.VisibleRowCountMode.Auto,
				noData: "{i18n>LABEL_00901}"
			})
			.addStyleClass("mt-10px")
			.setModel(oController.TableModel)
			.bindRows("/Data");
			
			ZHR_TABLES.makeColumn(oController, oTable, this._colModel); //colModel에 실질적으로 칼럼에대한 테이블을 만들어주는곳
			
			/*////////////////////////First MemberInfo///////////////////////////////////////////*/
			/*////////////////////////First MemberInfo///////////////////////////////////////////*/	
			var memberInfoBox = new sap.m.FlexBox(oController.PAGEID + "_MemberInfoBox",{
				fitContainer: true,
				items: [
					new sap.m.FlexBox({
						items: [
							new sap.ui.commons.TextView(oController.PAGEID + "_ClubView", {
								text:  "{DonghoName}",// 동호회 이름  
								design: "Bold"
							})
							.addStyleClass("font-18px mt-5px ml-5px mb-10px color-signature-gray"),
							new sap.m.Label(oController.PAGEID + "_MemberCount", {
								text: "{i18n>LABEL_10031}",  // 회원수
								design: "Bold"
							})
							.addStyleClass("font-18px ml-15px color-signature-gray")
						]
					})
					.addStyleClass("mt-30px")
				]
			});
			
			var oMemberTable = new sap.ui.table.Table(oController.PAGEID + "_MemberTable", {
				selectionMode: sap.ui.table.SelectionMode.None,
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 10,
				showOverlay: false,
				showNoData: true,
				width: "auto",
				noData: "{i18n>LABEL_00901}",
				rowSettingsTemplate : new sap.ui.table.RowSettings({
					highlight : {
						path : "Gubuntx",
						//Warning : 주황색,  Success : 초록색
						formatter : function(v) {
							switch(v) {
								case "회장":
								case "총무":
								case "고문":
									this.getParent().removeStyleClass("background-color-lightgreen");
									this.getParent().removeStyleClass("background-color-lightgray");
									this.getParent().addStyleClass("background-color-lightorange");
									return sap.ui.core.ValueState.None;
								case "회원":
									this.getParent().removeStyleClass("background-color-lightgreen");
									this.getParent().removeStyleClass("background-color-lightgray");
									this.getParent().removeStyleClass("background-color-lightorange");
									return sap.ui.core.ValueState.None;
								case "신청자":
									this.getParent().removeStyleClass("background-color-lightgray");
									this.getParent().removeStyleClass("background-color-lightorange");
									this.getParent().addStyleClass("background-color-lightgreen");
									return sap.ui.core.ValueState.None;
								case "탈퇴자":
									this.getParent().removeStyleClass("background-color-lightorange");
									this.getParent().removeStyleClass("background-color-lightgreen");
									this.getParent().addStyleClass("background-color-lightgray");
									return sap.ui.core.ValueState.None;
								default:
									this.getParent().removeStyleClass("background-color-lightorange");
									this.getParent().removeStyleClass("background-color-lightgreen");
									this.getParent().removeStyleClass("background-color-lightgray");
									return sap.ui.core.ValueState.None;
							}
						}
					}
				})
			})
			.addStyleClass("mt-4px")
			.setModel(oController.MemberTableModel)
			.bindRows("/Data");
			
			ZHR_TABLES.makeColumn(oController, oMemberTable, this._memeberColModel); //colModel에 실질적으로 칼럼에대한 테이블을 만들어주는곳
			
			/*////////////////////////Second MemberInfo///////////////////////////////////////////*/
			/*////////////////////////Second MemberInfo///////////////////////////////////////////*/
			
			var memberInfoLabel =	 new sap.m.Label(oController.PAGEID + "_MemberInfoLabel", {
										text: "{i18n>LABEL_10023}",  // 회원 정보
										design: "Bold"
									})
									.addStyleClass("app-title ml-5px mt-36px font-22px");
			
			var memberInfoBox2 = new sap.m.FlexBox(oController.PAGEID + "_MemberInfoBox2",{
				fitContainer: true,
				items: [
					new sap.m.FlexBox({
						items: [
							new sap.ui.commons.TextView(oController.PAGEID + "_ClubView2", {
								text:  "{DonghoName}",// 동호회 이름  
								design: "Bold"
							})
							.addStyleClass("font-18px mt-5px ml-5px mb-10px color-signature-gray"),
							new sap.m.Label(oController.PAGEID + "_MemberCount2", {
								text: "{i18n>LABEL_10031}",  // 회원수
								design: "Bold"
							})
							.addStyleClass("font-18px ml-15px color-signature-gray")
						]
					})
					.addStyleClass("mt-22px")
				],
				direction: "Column" //세로 정렬
			});
			
			var oMemberTable2 = new sap.ui.table.Table(oController.PAGEID + "_MemberTable2", {
				selectionMode: sap.ui.table.SelectionMode.None,
				enableColumnReordering: false,
				enableColumnFreeze: false,
				enableBusyIndicator: true,
				visibleRowCount: 10,
				showOverlay: false,
				showNoData: true,
				width: "auto",
				noData: "{i18n>LABEL_00901}",
				rowSettingsTemplate : new sap.ui.table.RowSettings({
					highlight : {
						path : "Gubuntx",
						//Information : 파란색 , Warning : 주황색,  Success : 초록색
						formatter : function(v) {
							switch(v) {
								case "회장":
								case "총무":
								case "고문":
									this.getParent().removeStyleClass("background-color-skyblue");
									this.getParent().removeStyleClass("background-color-lightgreen");
									this.getParent().removeStyleClass("background-color-lightgray");
									this.getParent().addStyleClass("background-color-lightorange");
									return sap.ui.core.ValueState.None;
								case "회원":
									this.getParent().removeStyleClass("background-color-lightgreen");
									this.getParent().removeStyleClass("background-color-lightgray");
									this.getParent().removeStyleClass("background-color-lightorange");
									this.getParent().addStyleClass("background-color-skyblue");
									return sap.ui.core.ValueState.None;
								case "신청자":
									this.getParent().removeStyleClass("background-color-lightgray");
									this.getParent().removeStyleClass("background-color-lightorange");
									this.getParent().removeStyleClass("background-color-skyblue");
									this.getParent().addStyleClass("background-color-lightgreen");
									return sap.ui.core.ValueState.None;
								case "탈퇴자":
									this.getParent().removeStyleClass("background-color-lightorange");
									this.getParent().removeStyleClass("background-color-skyblue");
									this.getParent().removeStyleClass("background-color-lightgreen");
									this.getParent().addStyleClass("background-color-lightgray");
									return sap.ui.core.ValueState.None;
								default:
									this.getParent().removeStyleClass("background-color-lightorange");
									this.getParent().removeStyleClass("background-color-skyblue");
									this.getParent().removeStyleClass("background-color-lightgreen");
									this.getParent().removeStyleClass("background-color-lightgray");
									return sap.ui.core.ValueState.None;
							}
						}
					}
				})
			})
			.addStyleClass("mt-4px")
			.setModel(oController.MemberTableModel2)
			.bindRows("/Data");	
			
			ZHR_TABLES.makeColumn(oController, oMemberTable2, this._memeberColModel2); //colModel에 실질적으로 칼럼에대한 테이블을 만들어주는곳
	
			
			
			return new PageHelper({
				contentItems: [
					infoBox,
					oTable,
					memberInfoLabel,
					memberInfoBox2,
					oMemberTable2,
					memberInfoBox,
					oMemberTable
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
