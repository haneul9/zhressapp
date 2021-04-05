sap.ui.define([
	"./On",
	"../../common/Common"
], function (On, Common) {
"use strict";

return { // 업적&역량 평가 view templates

	// Table 본인 업적/역량, 1차 업적/역량 column Progress Indicator
	getScoreChart: function(columnInfo) {

		return new sap.m.ProgressIndicator({
			displayOnly: true,
			height: "24px",
			percentValue: "{${columnInfo.id}}".interpolate(columnInfo.id),
			displayValue: {
				path: columnInfo.id,
				formatter: function(pV) {
					var v = pV || 0;
					if (v >= 90) {
						this.toggleStyleClass("cpi-bg-signature-cyanblue", false)
							.toggleStyleClass("cpi-bg-signature-darkgreen", false)
							.toggleStyleClass("cpi-bg-signature-orange", true);
					} else if (v >= 80) {
						this.toggleStyleClass("cpi-bg-signature-cyanblue", false)
							.toggleStyleClass("cpi-bg-signature-darkgreen", true)
							.toggleStyleClass("cpi-bg-signature-orange", false);
					} else {
						this.toggleStyleClass("cpi-bg-signature-cyanblue", true)
							.toggleStyleClass("cpi-bg-signature-darkgreen", false)
							.toggleStyleClass("cpi-bg-signature-orange", false);
					}
					return v.toFixed(2);
				}
			}
		}).addStyleClass("cpi-body");
	},

	// Table 등급 column combobox template
	getEvalGradeComboBox: function(columnInfo, oController) {

		return new sap.m.ComboBox({
			width: "100%",
			enabled: "{=${currentStep} === '업적평가 등급결정'}",
			selectedKey : "{evaluationGrade}",
			change: On.changeGrade.bind(oController),
			customData : [new sap.ui.core.CustomData({key: "", value: "{rowIndex}"})],
			items: {
				template: new sap.ui.core.ListItem({key: "{EvalGradeComboModel>value}", text: "{EvalGradeComboModel>text}"}),
				templateShareable: false,
				path: "EvalGradeComboModel>/Grades"
			}
		});
	},

	// Table 문서 column icon template
	getDeepLinkIcon: function(columnInfo, oController) {

		return new sap.ui.core.Icon({
			press: On.pressDeepLinkIcon.bind(oController),
			size: "1rem",
			src: "sap-icon://generate-shortcut"
		})
		.addStyleClass("color-signature-blue");
	},

	// Table 프로필 column icon template
	getPopupIcon: function(columnInfo, oController) {

		return new sap.ui.core.Icon({
			press: On.pressPopupIcon.bind(oController),
			size: "1rem",
			src: "sap-icon://generate-shortcut"
		})
		.addStyleClass("color-signature-blue");
	},

	// CustomProgressIndicator infoValue/infoText formatter
	formatInfoText: function() {
		Common.log("formatInfoText", arguments);

		var args = [].slice.call(arguments);
		return this.getBundleText(args.shift(), [args[0] || 0]);
	}

};

});