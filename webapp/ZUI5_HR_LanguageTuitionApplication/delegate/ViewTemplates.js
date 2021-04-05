sap.ui.define([
	"../../common/Common"
], function (Common) {
"use strict";

	var ViewTemplates = {

		// Header 영역 label
		getLabel: function(type, labelText, wid, align, isReq) {

			if (type === "header") {
				return new sap.m.Label({
					textAlign: Common.checkNull(align) ? "Center" : align, 
					required: Common.checkNull(isReq) ? false : isReq,
					text: labelText,
					width: Common.checkNull(wid) ? "100%" : wid
				})
				.addStyleClass("flexbox-table-header");
			} else { // type === "cell"
				return new sap.m.Label({
					textAlign: Common.checkNull(align) ? "Center" : align, 
					required: Common.checkNull(isReq) ? false : isReq,
					text: labelText,
					width: Common.checkNull(wid) ? "auto" : wid
				})
				.addStyleClass("flexbox-table-cell");
			}
		}
	};

	return ViewTemplates;

});