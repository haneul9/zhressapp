sap.ui.define([
	"../../common/Common"
], function (Common) {
"use strict";

	var ViewTemplates = {

		getLabel: function(type, labelText, wid, align, isReq) {

			if (type === "header") {
				return new sap.m.Label({
					layoutData: new sap.m.FlexItemData({ maxHeight: "44px" }),
					textAlign: Common.checkNull(align) ? "Center" : align, 
					required: Common.checkNull(isReq) ? false : isReq,
					text: labelText,
					width: Common.checkNull(wid) ? "100%" : wid
				});
			}
		}
	};

	return ViewTemplates;

});