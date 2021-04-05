sap.ui.define([
	"../../common/Common",
	"../../common/Formatter",
	"../../common/PageHelper",
	"../../common/ZHR_TABLES"
], function (Common, Formatter, PageHelper, ZHR_TABLES) {
"use strict";
	sap.ui.jsfragment("ZUI5_HR_CulturalLivingExpenses.fragment.LivingExpensesAdd", {
		
		createContent: function (oController) {
			
			var oDialog = new sap.m.Dialog(oController.PAGEID + "_LivingExpensesAdd_Dialog", {
				title: "{i18n>LABEL_21001}",
				contentWidth: "400px",
				horizontalScrolling: false,
				buttons: [
					new sap.m.Button({
					press: $.proxy(oController.onPressDialogSave, oController),
						text: "{i18n>LABEL_21029}" // 저장
					}),
					new sap.m.Button({
						press: function () {
							oDialog.close();
						},
						text: "{i18n>LABEL_21032}" // 취소
					})
				],
				content: [
					this.inputData(oController)
				]
			})
			.setModel(oController.DetailModel)
			.bindElement("/InputData");
	
			return oDialog;
		 },
		
		inputData: function(oController) {
			
			var oUseDatePicker = new sap.m.DatePicker({
				dateValue: "{Usedt}",
				width: "150px",
				textAlign: "Center",
				valueFormat: "yyyy-MM-dd",
				placeholder:"yyyy-mm-dd",
				displayFormat: oController.getSessionInfoByKey("Dtfmt"),
			});
			
			// 키보드 입력 방지
			oUseDatePicker.addDelegate({
				onAfterRendering: function () {
					oUseDatePicker.$().find("INPUT").attr("disabled", true).css("color", "#ccc !important");
				}
			}, oUseDatePicker);
			
			return new sap.m.VBox({
				items: [
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "90px",required: true, text: "{i18n>LABEL_21015}", design: "Bold", textAlign: "Begin" }), // 사용일
							oUseDatePicker
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "90px",required: true, text: "{i18n>LABEL_21016}", design: "Bold", textAlign: "Begin" }), // 내용
							new sap.m.Input({
								value: "{Usetx}",
								width: "230px",
								textAlign: "End",
								maxLength: Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "CultureTableIn2", "Usetx", false),
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "90px",required: true, text: "{i18n>LABEL_21017}", design: "Bold", textAlign: "Begin" }), // 금액(원)
							new sap.m.Input(oController.PAGEID + "_BetrgInput", {
								value: {
									path: "Betrg",
									formatter: function(v) {
										return (v) ? Common.numberWithCommas(v) : "";
									}
								},
								liveChange: oController.InputCost,
								width: "230px",
								maxLength: 9, 
								textAlign: "End",
							})
						]
					}),
					new sap.m.HBox({
						height: "40px",
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.m.Label({ width: "90px",required: true, text: "{i18n>LABEL_21018}", design: "Bold", textAlign: "Begin" }), // 현금/카드
							new sap.m.FlexBox({
								items: [
									new sap.m.RadioButtonGroup({
							 			columns : 2,
										width: "150px",
										select : oController.onChangeData,
							 			buttons : [
											new sap.m.RadioButton({
												text : "{i18n>LABEL_21023}",
												textAlign: "Center",
												selected: {
													path: "Usecd",
													formatter: function(v) {
														if(v === "M") return true;
														else return false;
													}
												}, 
												useEntireWidth : true, 
												width : "auto"
											}),
							 				new sap.m.RadioButton({
												text : "{i18n>LABEL_21024}",
												textAlign: "Center",
												selected: {
													path: "Usecd",
													formatter: function(v) {
														if(v === "C") return true;
														else return false;
													}
												}, 
												useEntireWidth : true, 
												width : "auto"
											})
										]
									})
								]
							})
						]
					})
				]
			})
			.addStyleClass("vbox-form-mobile ml-10px mt-20px");
		}
	})
});