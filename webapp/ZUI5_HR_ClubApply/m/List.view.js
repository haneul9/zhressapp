sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/PageHelper",
	"../../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";

	sap.ui.jsview($.app.APP_ID, {
		
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
					}),
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
			
			var oTable = new sap.m.Table(oController.PAGEID + "_Table", {
				inset: false,
				rememberSelections: false,
				noDataText: "{i18n>LABEL_00901}",
				growing: true,
				growingThreshold: 5,
				mode: sap.m.ListMode.SingleSelectMaster,
				itemPress: oController.onSelectedRow.bind(oController),
				columns: [
					new sap.m.Column({
						width: "70%",
						hAlign: sap.ui.core.TextAlign.Begin
					}),
					new sap.m.Column({
						width: "30%",
						hAlign: sap.ui.core.TextAlign.End
					})
				],
				items: {
					path: "/Data",
					template: new sap.m.ColumnListItem({
						type: sap.m.ListType.Active,
						counter: 5,
						cells: [
							new sap.m.FlexBox({
								direction: sap.m.FlexDirection.Column,
								items: [
									new sap.m.Text({
										text: "{Donghotx}",
										textAlign: "Begin"
									}).addStyleClass("L2P13Font"),
									new sap.m.Text({
										text: {
											parts: [
												{path: "Begda"},
												{path: "Endda"}
											],
											formatter: function (v1, v2) {
												if (!v1 || !v2) {
													return "";
												}
												return Common.DateFormatter(v1) + " ~ " + Common.DateFormatter(v2);
											}
										},
										textAlign: "Begin"
									}).addStyleClass("L2P13Font")
								]
							}),
							new sap.m.Text({
								text: "{Statustx}",
								textAlign: "Begin"
							}).addStyleClass("L2P13Font")
						]
					})
				}
			})
			.addStyleClass("mt-8px")
			.setModel(oController.TableModel);
			
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
			
			var oMemberTable = new sap.m.Table(oController.PAGEID + "_MemberTable", {
				inset: false,
				noDataText: "{i18n>LABEL_00901}",
				growing: true,
				growingThreshold: 5,
				/*alternateRowColors : new sap.ui.table.RowSettings({
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
				}),*/
				columns: [
					new sap.m.Column({
						width: "40%",
						hAlign: sap.ui.core.TextAlign.Begin
					}),
					new sap.m.Column({
						width: "60%",
						hAlign: sap.ui.core.TextAlign.End
					})
				],
				items: {
					path: "/Data",
					template: new sap.m.ColumnListItem({
						counter: 5,
						cells: [
							new sap.m.FlexBox({
								direction: sap.m.FlexDirection.Column,
								items: [
									new sap.m.Text({
										text: "{Gubuntx}",
										textAlign: "Begin"
									}).addStyleClass("L2P13Font"),
									new sap.m.Text({
										text: "{Name}",
										textAlign: "Begin"
									}).addStyleClass("L2P13Font")
								]
							}),
							new sap.m.FlexBox({
								direction: sap.m.FlexDirection.Column,
								items: [
									new sap.m.Text({
										text: "{Orgtx}",
										textAlign: "End"
									}).addStyleClass("L2P13Font"),
									new sap.m.Text({
										text: "{Phone}",
										textAlign: "End"
									}).addStyleClass("L2P13Font")
								]
							})
						]
					})
				}
			})
			.addStyleClass("mt-4px")
			.setModel(oController.MemberTableModel);
			
			/*////////////////////////Second MemberInfo///////////////////////////////////////////*/
			/*////////////////////////Second MemberInfo///////////////////////////////////////////*/
			
			var memberInfoLabel =	 new sap.m.Label(oController.PAGEID + "_MemberInfoLabel", {
										text: "{i18n>LABEL_10023}",  // 회원 정보
										design: "Bold"
									})
									.addStyleClass("sub-title ml-5px mt-36px");
			
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
							.addStyleClass("font-15px ml-15px color-signature-gray")
						]
					})
					.addStyleClass("mt-22px")
				],
				direction: "Column" //세로 정렬
			});
			
			var oMemberTable2 = new sap.m.Table(oController.PAGEID + "_MemberTable2", {
				inset: false,
				noDataText: "{i18n>LABEL_00901}",
				growing: true,
				growingThreshold: 5,
				/*alternateRowColors : new sap.ui.table.RowSettings({
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
				}),*/
				columns: [
					new sap.m.Column({
						width: "40%",
						hAlign: sap.ui.core.TextAlign.Begin
					}),
					new sap.m.Column({
						width: "60%",
						hAlign: sap.ui.core.TextAlign.End
					})
				],
				items: {
					path: "/Data",
					template: new sap.m.ColumnListItem({
						counter: 5,
						cells: [
							new sap.m.FlexBox({
								direction: sap.m.FlexDirection.Column,
								items: [
									new sap.m.Text({
										text: "{Gubuntx}",
										textAlign: "Begin"
									}).addStyleClass("L2P13Font"),
									new sap.m.Text({
										text: "{Name}",
										textAlign: "Begin"
									}).addStyleClass("L2P13Font")
								]
							}),
							new sap.m.FlexBox({
								direction: sap.m.FlexDirection.Column,
								items: [
									new sap.m.Text({
										text: "{Orgtx}",
										textAlign: "End"
									}).addStyleClass("L2P13Font"),
									new sap.m.Text({
										text: "{Phone}",
										textAlign: "End"
									}).addStyleClass("L2P13Font")
								]
							})
						]
					})
				}
			})
			.addStyleClass("mt-4px")
			.setModel(oController.MemberTableModel2);	
			
			ZHR_TABLES.makeColumn(oController, oMemberTable2, this._memeberColModel2); //colModel에 실질적으로 칼럼에대한 테이블을 만들어주는곳
			
			return new PageHelper({
				contentContainerStyleClass: "app-content-container-mobile",
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
