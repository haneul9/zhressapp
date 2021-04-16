sap.ui.define([
	"common/Common"
], function(Common) {
"use strict";

return { // 출장 신청/정산 view templates

	getHeaderLabel: function(text, required, width) {

		return new sap.m.Label({
			text: text,
			width: width ? width : "130px",
			required: required,
			design: sap.m.LabelDesign.Bold,
			textAlign: sap.ui.core.TextAlign.Right,
			layoutData: new sap.m.FlexItemData({ alignSelf: sap.m.FlexAlignSelf.Stretch })
		});
	},

	getCustomInput: function(id, inputSettings, clear) {

		var oInput = new sap.m.Input(id, inputSettings).addStyleClass("custom-clearable-input");

		oInput.addEventDelegate({
			onAfterRendering: function() {
				this.$().find(".sapMInputBaseIconContainer").prepend(
					$(["<span data-sap-ui=\"clear-icon-" + String(Math.random()).replace(/\./, "") + "-vhi\"",
						"data-sap-ui-icon-content=\"\"",
						"class=\"sapUiIcon sapUiIconMirrorInRTL sapUiIconPointer sapMInputBaseIcon\"",
						"style=\"font-family:'SAP\\2dicons'\"></span>"
					].join(" ")).click(clear)
				);
			}
		}, oInput);

		return oInput;
	},

	getDateTextTemplate: function(columnInfo) {

		return new sap.m.Text({
			text: {
				path: columnInfo.id,
				type: new sap.ui.model.type.Date({ pattern: "yyyy-MM-dd" })
			}
		});
	},

	getCardApprDateTemplate: function(columnInfo) {

		return new sap.m.Text({
			text: {
				path: columnInfo.id,
				type: new sap.ui.model.type.Date({ source: "yyyy.MM.dd", pattern: "yyyy-MM-dd" })
			}
		});
	},

	getFlexTableHeader: function(text) {

		return new sap.m.Label({
			text: text,
			design: sap.m.LabelDesign.Bold,
			textAlign: sap.ui.core.TextAlign.Right,
			layoutData: new sap.m.FlexItemData({ baseSize: "12.5%", minWidth: "100px" })
		})
		.addStyleClass("flexbox-table-header");
	},

	getFlexTableCell: function (text, isUnit) {

		return new sap.m.Label({
			text: isUnit ? text : {
				path: text,
				formatter: Common.toCurrency
			},
			textAlign: isUnit ? sap.ui.core.TextAlign.Center : sap.ui.core.TextAlign.Right,
			layoutData: new sap.m.FlexItemData({ baseSize: "12.5%", minWidth: "100px" })
		})
		.addStyleClass("flexbox-table-cell");
	}

};

});