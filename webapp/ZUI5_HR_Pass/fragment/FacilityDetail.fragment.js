sap.ui.define([
	"common/Common"
], function (Common) {
"use strict";

	sap.ui.jsfragment("ZUI5_HR_Pass.fragment.FacilityDetail", {

		createContent: function (oController) {
			var FacilityHandler = oController.FacilityHandler;

			var oDialog = new sap.m.Dialog(oController.PAGEID + "_FacilityDetail_Dialog", {
				title: "{i18n>LABEL_09024}",
				contentWidth: "800px",
				// contentHeight: "300px",
				buttons: [					
					new sap.m.Button({
						press: FacilityHandler.onPressSaveBtn.bind(FacilityHandler),
						text: "{i18n>LABEL_09031}", // 저장
						visible: {
							path: "isNew",
							formatter: function(v) {
								if(v) return false;
								else return true;
							}
						}
					}).addStyleClass("button-light"),
					new sap.m.Button({
						press: FacilityHandler.onPressApprovalBtn.bind(FacilityHandler),
						text: "{i18n>LABEL_09023}", // 신청
						visible: {
							path: "isNew",
							formatter: function(v) {
								if(v) return true;
								else return false;
							}
						}
					}).addStyleClass("button-dark"),
					new sap.m.Button({
						press: function () {
							oDialog.close();
						},
						text: "{i18n>LABEL_09025}" // 닫기
					}).addStyleClass("button-default custom-button-divide")
				],
				content: [
					this.getInputBox()
				]
			})
			.setModel(FacilityHandler.Model())
			.bindElement("/Detail");

			return oDialog;
		},

		getInputBox: function() {
			return new sap.m.FlexBox({
				fitContainer: true,
				direction: "Column",
				items: [
					new sap.m.FlexBox({
						items: [
							// 이용시설
							new sap.m.Label({ text: "{i18n>LABEL_09011}", width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({
								width: "250px",
								editable: false,
								value: "{FactyT}"
							})
						],
						visible: {
							path: "isNew",
							formatter: function(v) {
								if(v) return false;
								else return true;
							}
						}
					}).addStyleClass("search-field-group"),
					new sap.m.FlexBox({
						items: [
							// 사용일
							new sap.m.Label({ text: "{i18n>LABEL_09001}", width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({
								width: "250px",
								editable: false,
								value: {
									path: "Usday",
									formatter: function (v) {
										return Common.DateFormatter(v);
									}
								}
							})
						]
					}).addStyleClass("search-field-group search-inner-vbox"),
					new sap.m.FlexBox({
						items: [
							// 신청매수
							new sap.m.Label({ text: "{i18n>LABEL_09002}", required: true, width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({ 
								value: "{Reqno}", 
								width: "250px",
								maxLength : Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "FacilityApplyTableIn", "Reqno", false),
								liveChange: Common.setOnlyDigit
							})
						]
					}).addStyleClass("search-field-group"),
					new sap.m.FlexBox({
						items: [
							// 예약매수
							new sap.m.Label({ text: "{i18n>LABEL_09003}", width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({
								width: "250px",
								editable: false,
								value: "{Resno}"
							})
						],
						visible: {
							path: "isNew",
							formatter: function(v) {
								if(v) return false;
								else return true;
							}
						}
					}).addStyleClass("search-field-group"),
					new sap.m.FlexBox({
						items: [
							// 휴대전화번호
							new sap.m.Label({ text: "{i18n>LABEL_09026}", required: true, width: "9.7em" , layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({ 
								value: "{Cellp}", 
								width: "250px", 
								placeholder: "010-1111-1111",
								liveChange: Common.changeCellphoneFormat
							})
						]
					}).addStyleClass("search-field-group"),
					new sap.m.FlexBox({
						items: [
							// E-Mail
							new sap.m.Label({ text: "{i18n>LABEL_09027}", required: true, width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({ 
								value: "{Email}", 
								width: "350px",
								maxLength : Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "FacilityApplyTableIn", "Email")
							})
						]
					}).addStyleClass("search-field-group"),
					new sap.m.FlexBox({
						items: [
							// 비고
							new sap.m.Label({ text: "{i18n>LABEL_09028}", width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({ 
								value: "{Zbigo}", 
								width: "500px",
								maxLength : Common.getODataPropertyLength("ZHR_BENEFIT_SRV", "FacilityApplyTableIn", "Zbigo")
							})
						]
					}).addStyleClass("search-field-group"),
					new sap.m.FlexBox({
						items: [
							// 회신사항
							new sap.m.Label({ text: "{i18n>LABEL_09005}", width: "9.7em", layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch }) }),
							new sap.m.Input({ value: "{Rettx}", editable: false, width: "500px" })
						],
						visible: {
							path: "isNew",
							formatter: function(v) {
								if(v) return false;
								else return true;
							}
						}
					}).addStyleClass("search-field-group")
				]
			}).addStyleClass("search-box");
		}
	});

});
