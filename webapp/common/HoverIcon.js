sap.ui.define([
	"sap/ui/core/Icon"
], function (Icon) {
	"use strict";

	return Icon.extend("HoverIcon", {
		metadata: {
			events: {
				hover: {},
				leave: {}
			}
		},
		onmouseover: function(oEvent) {
			this.fireHover();
		},
		onmouseout: function(oEvent) {
			this.fireLeave();
		},
		renderer: {}
	});
});