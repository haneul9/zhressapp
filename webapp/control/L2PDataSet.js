/**
s * L2PDataSet
 * 
 * @memberOf control.L2PDataSet
 * 
 * Create Date : 2015. 03. 27
 * Version : 1.0
 */

jQuery.sap.declare("control.L2PDataSet");

sap.ui.core.Control.extend("control.L2PDataSet", {
	/*
	 * @memberOf control.L2PDataSet
	 */
	metadata: {
		properties: {
			pageId: { type: "string" },
			menuId: { type: "string" },
			pernr: { type: "string" },
			subMenus: { type: "any[]" },
			width: { type: "sap.ui.core.CSSSize", defaultValue: "100%" }
		},
		aggregations: {},

		associations: {},

		events: {
			select: {}
		}
	},

	init: function () {},

	onBeforeRendering: function () {},

	onAfterRendering: function () {},

	renderer: {
		render: function (oRm, oControl) {
			var vPernr = oControl.getPernr();
			var vPageId = oControl.getPageId();
			var vMenuId = oControl.getMenuId();
			var vSubMenus = oControl.getSubMenus();

			var oModel = oControl.getModel();
			if (typeof oModel == "undefined") {
				return;
			}

			var vDataSetContentsSet = [];
			oModel.read(
				"/DataSetContentsSet/?$filter=Pernr%20eq%20%27" +
					vPernr +
					"%27" +
					"%20and%20Menuc%20eq%20%27" +
					vMenuId.substring(1) +
					"%27",
				null,
				null,
				false,
				function (oData, oResponse) {
					if (oData && oData.results.length) {
						for (var i = 0; i < oData.results.length; i++) {
							vDataSetContentsSet.push(oData.results[i]);
						}
					}
				},
				function (oResponse) {
					common.Common.log(oResponse);
				}
			);
			if (vDataSetContentsSet.length < 1) {
				return;
			}

			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.addClass("L2PTabContainer");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.getWidth());
			oRm.write(">");

			var vSubMenuList = [];
			for (var i = 0; i < vSubMenus.length; i++) {
				if (vSubMenus[i].parent == vMenuId) {
					vSubMenuList.push(vSubMenus[i]);
				}
			}

			for (var i = 0; i < vSubMenuList.length; i++) {
				oRm.write("<div id='" + vPageId + "_" + vSubMenuList[i].id + "' class='pe-txt-data-set-box'>");
				oRm.write("<div class='pe-txt-dataset-title'>" + vSubMenuList[i].label + "</div>");

				oRm.write("<ul class='pe-txt-dataset-ul pe-al-right'>");
				for (var j = 0; j < vDataSetContentsSet.length; j++) {
					if (vSubMenuList[i].id.substring(1) == vDataSetContentsSet[j].Menuc) {
						if (vDataSetContentsSet[j].Subtl != "" && vDataSetContentsSet[j].Label == "") {
							oRm.write("<li class='pe-b'>" + vDataSetContentsSet[j].Subtl + "</li>");
						} else {
							oRm.write("<li>" + vDataSetContentsSet[j].Label + "</li>");
						}
					}
				}
				oRm.write("</ul>");

				oRm.write("<ul class='pe-txt-upda1'>");
				for (var j = 0; j < vDataSetContentsSet.length; j++) {
					if (vSubMenuList[i].id.substring(1) == vDataSetContentsSet[j].Menuc) {
						if (vDataSetContentsSet[j].Subtl != "" && vDataSetContentsSet[j].Label == "") {
							oRm.write("<li>" + vDataSetContentsSet[j].Value + "</li>");
						} else {
							oRm.write("<li>" + vDataSetContentsSet[j].Value + "</li>");
						}
					}
				}

				oRm.write("</ul>");
				oRm.write("<div style='clear: both'></div>");
				oRm.write("</div>");
			}

			oRm.write("</div>");
		}
	}
});

control.L2PDataSet.prototype.exit = function () {};
