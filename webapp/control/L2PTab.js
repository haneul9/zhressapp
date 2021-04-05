/**
 * L2PTab
 *
 * @memberOf control.TreeTable
 *
 * Create Date : 2015. 03. 27
 * Version : 1.0
 */

jQuery.sap.declare("control.L2PTab");

sap.ui.core.Control.extend("control.L2PTab", {
	/*
	 * @memberOf control.L2PTab
	 */
	metadata: {
		properties: {
			bgColor: { type: "sap.ui.core.CSSColor", defaultValue: "RGB(225, 225, 225)" },
			cssPath: { type: "string", defaultValue: "" },
			itemIds: { type: "string[]" },
			itemLabels: { type: "string[]" },
			secondMenu: { type: "boolean", defaultValue: false },
			parentMenuCount: { type: "int", defaultValue: 1 },
			selectParentIdx: { type: "int", defaultValue: 1 },
			selectedKey: { type: "string", defaultValue: "" },
			width: { type: "sap.ui.core.CSSSize", defaultValue: "100%" },
			height: { type: "int", defaultValue: 40 }
		},
		aggregations: {},

		associations: {},

		events: {
			select: {}
		}
	},

	init: function () {},

	onBeforeRendering: function () {
		var domNode = this.getDomRef();
		$(domNode).unbind("select");
	},

	onAfterRendering: function () {},

	renderer: {
		render: function (oRm, oControl) {
			var vItemIds = oControl.getItemIds();
			var vItemLabels = oControl.getItemLabels();

			var vOnePaddingLeft = Math.floor(100 / (oControl.getParentMenuCount() + 1));
			var vPaddingLeft = vOnePaddingLeft * (oControl.getSelectParentIdx() - 1);

			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.addClass("L2PTabContainer");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.getWidth());
			oRm.addStyle("height", oControl.getHeight() - 0 + "px");
			if (oControl.getSecondMenu()) {
				oRm.addStyle("padding-left", vPaddingLeft + "%");
			}
			oRm.writeStyles();
			oRm.write(">");

			if (oControl.getSecondMenu() == false) {
				oRm.write("<table id='" + oControl.getId() + "_innerTab' cellpadding='0' cellspacing='0' style='width:100%'>");
				oRm.write("<tr id='" + oControl.getId() + "_innerTab-tr' style=''>");
			} else {
				oRm.write(
					"<table class='L2PTabContainerBorder' id='" + oControl.getId() + "_innerTab' cellpadding='0' cellspacing='0' style=''>"
				);
				oRm.write("<tr id='" + oControl.getId() + "_innerTab-tr' style=''>");
			}

			if (vItemIds && vItemIds.length) {
				var c_w = Math.floor(100 / (vItemIds.length + 1)) + "%";

				for (var i = 0; i < vItemIds.length; i++) {
					if (oControl.getSecondMenu() == false) {
						oRm.write("<td id='" + oControl.getId() + "_innerTab-td_" + (i + 1) + "' style='width:" + c_w + "' ");
						oRm.write("L2PTabMenuId='" + vItemIds[i] + "' ");
						oRm.addClass("L2PTabMenu");
						oRm.writeClasses();
						oRm.write(">");
					} else {
						oRm.write("<td id='" + oControl.getId() + "_innerTab-td_" + (i + 1) + "' style='' ");
						oRm.write("L2PTabMenuId='" + vItemIds[i] + "' ");
						oRm.addClass("L2PTabMenu");
						oRm.writeClasses();
						oRm.write(">");
					}

					if (oControl.getSecondMenu() == false) {
						oRm.write("<div style='width:100%;' id='" + oControl.getId() + "_innerTab-div_" + (i + 1) + "' ");
						oRm.write(" L2PTabMenuId='" + vItemIds[i] + "' ");
						if (vItemIds[i] == oControl.getSelectedKey()) {
							oRm.addClass("L2PTabMenuSelectedDiv");
						} else {
							oRm.addClass("L2PTabMenuDiv");
						}
						oRm.writeClasses();
						oRm.write(">");

						oRm.write(
							"<span style='width:100%;line-height:" +
								oControl.getHeight() +
								"px' id='" +
								oControl.getId() +
								"_innerTab-span_" +
								(i + 1) +
								"' "
						);
						if (vItemIds[i] == oControl.getSelectedKey()) {
							oRm.addClass("L2PTabMenuSelectedText");
						} else {
							oRm.addClass("L2PTabMenuText");
						}

						oRm.writeClasses();
						oRm.write(" L2PTabMenuId='" + vItemIds[i] + "' ");
						oRm.write(">");
						oRm.write(vItemLabels[i]);
						oRm.write("</span>");

						oRm.write("</div>");
					} else {
						oRm.write(
							"<div style='width:100%; height:" +
								oControl.getHeight() +
								"px' id='" +
								oControl.getId() +
								"_innerTab-div_" +
								(i + 1) +
								"' "
						);
						oRm.addClass("L2PTabSubMenuDiv");
						oRm.writeClasses();
						oRm.write(" L2PTabSubMenuId='" + vItemIds[i] + "' ");
						oRm.write(">");

						oRm.write(
							"<span style='width:100%;line-height:" +
								oControl.getHeight() +
								"px' id='" +
								oControl.getId() +
								"_innerTab-span_" +
								(i + 1) +
								"' "
						);
						if (vItemIds[i] == oControl.getSelectedKey()) {
							oRm.addClass("L2PTabSubMenuSelectedText");
						} else {
							oRm.addClass("L2PTabSubMenuText");
						}
						if (i < vItemIds.length - 1) oRm.addClass("L2PTabSubMenuDivide");
						oRm.writeClasses();
						oRm.write(" L2PTabMenuId='" + vItemIds[i] + "' ");
						oRm.write(">");
						oRm.write(vItemLabels[i]);
						oRm.write("</span>");

						oRm.write("</div>");
					}

					oRm.write("</td>");
				}

				if (oControl.getSecondMenu() == false) {
					oRm.write("<td id='" + oControl.getId() + "_innerTab-td_99' style='width:" + c_w + "'");
					oRm.write("L2PTabMenuId='' ");
					oRm.write(">");
					oRm.write("<div class='L2PTabDUmmy' style='width:100%;' id='" + oControl.getId() + "_innerTab-div_99'>");
					oRm.write(
						"<span style='width:100%;line-height:" +
							oControl.getHeight() +
							"px' id='" +
							oControl.getId() +
							"_innerTab-span_99'>&nbsp;</span> "
					);
					oRm.write("</div></td>");
				}
			}

			oRm.write("</tr>");
			oRm.write("</table>");

			oRm.write("</div>");
		}
	}
});

control.L2PTab.prototype.exit = function () {};

control.L2PTab.M_EVENTS = { select: "select" };

/**
 * Function is called when button is clicked.
 */
control.L2PTab.prototype.onclick = function (oBrowserEvent) {
	var oClickedControlId = oBrowserEvent.target.id;

	var pos1 = oClickedControlId.indexOf("-span_");
	var pos2 = oClickedControlId.indexOf("-div_");

	if (pos1 > 0 || pos2 > 0) {
	} else {
		return;
	}

	var vDivId = "";
	var vSpanId = "";

	if (pos1 > 0) {
		vDivId = oClickedControlId.replace("-span_", "-div_");
		vSpanId = oClickedControlId;
	}

	if (pos2 > 0) {
		vDivId = oClickedControlId;
		vSpanId = oClickedControlId.replace("-div_", "-span_");
	}

	var vItemIds = this.getItemIds();

	var oSpanControl = $("#" + vSpanId);
	var oDivControl = $("#" + vDivId);

	if (oDivControl.hasClass("L2PTabMenuSelectedDiv") || oDivControl.hasClass("L2PTabSubMenuSelectedDiv")) {
		return;
	}

	var vSpanPrefix = vSpanId.substring(0, vSpanId.lastIndexOf("_"));
	var vDivPrefix = vDivId.substring(0, vDivId.lastIndexOf("_"));
	for (var i = 0; i < vItemIds.length; i++) {
		if (this.getSecondMenu() == false) {
			$("#" + vSpanPrefix + "_" + (i + 1)).removeClass("L2PTabMenuSelectedText");
			$("#" + vSpanPrefix + "_" + (i + 1)).removeClass("L2PTabMenuText");
			$("#" + vSpanPrefix + "_" + (i + 1)).addClass("L2PTabMenuText");

			$("#" + vDivPrefix + "_" + (i + 1)).removeClass("L2PTabMenuSelectedDiv");
			$("#" + vDivPrefix + "_" + (i + 1)).removeClass("L2PTabMenuDiv");
			$("#" + vDivPrefix + "_" + (i + 1)).addClass("L2PTabMenuDiv");
		} else {
			$("#" + vSpanPrefix + "_" + (i + 1)).removeClass("L2PTabSubMenuSelectedText");
			$("#" + vSpanPrefix + "_" + (i + 1)).removeClass("L2PTabSubMenuText");
			$("#" + vSpanPrefix + "_" + (i + 1)).addClass("L2PTabSubMenuText");

			$("#" + vDivPrefix + "_" + (i + 1)).removeClass("L2PTabSubMenuSelectedDiv");
			$("#" + vDivPrefix + "_" + (i + 1)).removeClass("L2PTabSubMenuDiv");
			$("#" + vDivPrefix + "_" + (i + 1)).addClass("L2PTabSubMenuDiv");
		}
	}

	if (this.getSecondMenu() == false) {
		oSpanControl.removeClass("L2PTabMenuText");
		oSpanControl.addClass("L2PTabMenuSelectedText");

		oDivControl.removeClass("L2PTabMenuDiv");
		oDivControl.addClass("L2PTabMenuSelectedDiv");
	} else {
		oSpanControl.removeClass("L2PTabSubMenuText");
		oSpanControl.addClass("L2PTabSubMenuSelectedText");

		oDivControl.removeClass("L2PTabSubMenuDiv");
		oDivControl.addClass("L2PTabSubMenuSelectedDiv");
	}

	this.fireSelect({ menuid: oSpanControl.attr("L2PTabMenuId") });
};
