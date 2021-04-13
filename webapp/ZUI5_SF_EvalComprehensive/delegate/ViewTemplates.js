sap.ui.define([
	"./On"
], function (On) {
"use strict";

var ViewTemplates = { // 종합평가 : 수행 view templates

	// Header 영역 label
	getLabel: function(type, labelText) {

		if (type === "header") {
			return new sap.m.Label({textAlign: sap.ui.core.TextAlign.Center, text: labelText}).addStyleClass("flexbox-table-header");
		} else { // type === "cell"
			return new sap.m.Label({textAlign: sap.ui.core.TextAlign.Center, text: labelText}).addStyleClass("flexbox-table-cell");
		}
	},

	// 부서별 평가등급 현황 Table 인원수/평가점수 column template
	getCountText: function(columnInfo) {

		return new sap.m.Text({
			textAlign: sap.ui.core.TextAlign.Center,
			text: {
				path: columnInfo.id,
				formatter: function (pV) {
					if (!isNaN(pV)) {
						return pV == 0 ? "-" : String(parseFloat(pV));
					} else {
						return "-";
					}
				}
			}
		});
	},

	// Table 종합평가 column ComboBox template
	getCogradeComboBox: function(columnInfo, oController) {

		return new sap.m.ComboBox({
			change: On.changeCogradeComboBox.bind(oController),
			textAlign: "{= ${dragable} ? 'Left' : 'Center' }",
			editable: "{dragable}",
			selectedKey: "{Cograde}",
			items: {
				path: "/ComboBoxItems",
				templateShareable: true,
				template: new sap.ui.core.ListItem({key: "{Cograde}", text: "{Cograde}"})
			}
		});
	},

	// Table 평가결과 column icon template, EvalResult.fragment.js 호출
	getEvalResultDialogIcon: function(columnInfo, oController) {

		return new sap.ui.core.Icon({
			press: On.pressEvalResultDialogIcon.bind(oController),
			src: "sap-icon://history",
			size: "22px",
			color: "#666",
			tooltip: "{i18n>LABEL_11320}" // 평가결과
		})
		.addStyleClass((columnInfo ? "mt-4px" : ""));
	},

	// Table 인사기록카드 column icon template, EmpProfile.fragment.js 호출
	getEmpProfileDialogIcon: function(columnInfo, oController) {

		return new sap.ui.core.Icon({
			press: On.pressEmpProfileDialogIcon.bind(oController),
			src: "sap-icon://customer",
			size: "22px",
			color: "#666",
			tooltip: "{i18n>LABEL_11321}" // 사원정보
		})
		.addStyleClass((columnInfo ? "mt-4px" : ""));
	},

	// Drag and Drop 영역 카드 생성 및 반환
	getEmployeeCard: function(oController) {

		return new sap.m.VBox({
			layoutData: new sap.f.GridContainerItemLayoutData({
				minRows: 2, columns: 2
			}),
			width: "270px",
			height: "126px",
			items: [
				new sap.m.HBox({
					height: "63px",
					items: [
						new sap.m.VBox({
							items: new sap.m.Image({
								src: {
									path: "Photo",
									formatter: function(pV) {
										return pV || "images/photoNotAvailable.gif";
									}
								}
							})
							.addStyleClass("employee-basic-info-photo")
						}),
						new sap.m.VBox({
							layoutData: new sap.m.FlexItemData({growFactor: 1}),
							items: [
								new sap.m.HBox({
									justifyContent: sap.m.FlexJustifyContent.SpaceBetween,
									height: "24px",
									items: [
										new sap.m.Label({text: "{Ename}"}).addStyleClass("name"),
										new sap.m.HBox({
											items: [
												new sap.m.Label({
													textAlign: sap.ui.core.TextAlign.Center,
													text: {
														path: "Pegrade",
														formatter: function(pV) {
															if (pV) {
																this.addStyleClass("prev-grade-" + pV.toLowerCase());
															}
															return pV;
														}
													}
												}),
												ViewTemplates.getEvalResultDialogIcon(null, oController).addStyleClass("ml-6px"),
												ViewTemplates.getEmpProfileDialogIcon(null, oController).addStyleClass("ml-6px")
											]
										})
									]
								}),
								new sap.m.Label({text: "{Evorgtx}"}).addStyleClass("card-text"),
								new sap.m.Label({text: "{ZpGradetx}({Gdyea}{i18n>LABEL_00151}) / {Ztitletx}"}).addStyleClass("card-text")
							]
						})
						.addStyleClass("card-texts ml-14px")
					]
				}),
				new sap.m.HBox({
					items: [
						new sap.m.Label({text: "{i18n>LABEL_11421}"}).addStyleClass("card-text"), // 업적
						new sap.m.Label({text: "{Pepnt}"}).addStyleClass("ml-5px score-grade"),
						new sap.m.Label({text: "{i18n>LABEL_11422}"}).addStyleClass("ml-10px card-text"), // 역량
						new sap.m.Label({text: "{Cepnt}"}).addStyleClass("ml-5px score-grade"),
						new sap.m.Label({text: "{i18n>LABEL_11423}"}).addStyleClass("ml-10px card-text"), // 다면
						new sap.m.Label({text: "{Mepnt}"}).addStyleClass("ml-5px score-grade")
					]
				}),
				new sap.m.HBox({
					items: [
						new sap.m.Label({text: "{Pyear1}"}).addStyleClass("card-text"),
						new sap.m.Label({text: "{Pgrade1}"}).addStyleClass("ml-5px score-grade"),
						new sap.m.Label({text: "{Pyear2}"}).addStyleClass("ml-10px card-text"),
						new sap.m.Label({text: "{Pgrade2}"}).addStyleClass("ml-5px score-grade"),
						new sap.m.Label({text: "{Pyear3}"}).addStyleClass("ml-10px card-text"),
						new sap.m.Label({text: "{Pgrade3}"}).addStyleClass("ml-5px score-grade")
					]
				})
			]
		})
		.addStyleClass("employee-evaluation-card");
	}

};

return ViewTemplates;

});