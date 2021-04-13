sap.ui.define([
	"../../common/Common"
], function(Common) {
"use strict";

return { // view templates

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

};

});