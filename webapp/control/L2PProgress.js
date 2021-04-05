/**
 * L2PProgress
 *
 * @memberOf control.L2PProgress
 *
 * Create Date : 2015. 09. 20
 * Version : 1.0
 */

jQuery.sap.declare("control.L2PProgress");

sap.ui.core.Control.extend("control.L2PProgress", {
	/*
	 * @memberOf control.L2PProgress
	 */

	metadata: {
		properties: {
			displayValue: { type: "string", defaultValue: "" },
			value: { type: "int" },
			min: { type: "int", defaultValue: 0 },
			max: { type: "int", defaultValue: 100 },
			bgColor: { type: "sap.ui.core.CSSColor", defaultValue: "#FFFFFF" },
			barColor: { type: "sap.ui.core.CSSColor", defaultValue: "#2E8AE8" },
			displayLabel: { type: "boolean", defaultValue: false },
			height: { type: "sap.ui.core.CSSSize", defaultValue: "1.2rem" },
			width: { type: "sap.ui.core.CSSSize", defaultValue: "100%" }
		},
		aggregations: {},

		associations: {},

		events: {}
	},

	init: function () {},

	onBeforeRendering: function () {},

	onAfterRendering: function () {},

	renderer: {
		render: function (oRm, oControl) {
			jQuery.sap.includeStyleSheet("css/L2PProgress.css");

			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.addStyle("width", oControl.getWidth());
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<table cellpadding='0' cellspacing='0' id='" + oControl.getId() + "-inner_ProgressLabel' class='L2PProgressLabel'");
			oRm.addStyle("width", oControl.getWidth());
			if (oControl.getDisplayLabel()) {
				oRm.addStyle("display", "");
			} else {
				oRm.addStyle("display", "none");
			}
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<tr>");
			oRm.write("<td id='" + oControl.getId() + "-inner_ProgressLabelMin' class='L2PProgressLabelMin'>");
			oRm.write("<sub>" + oControl.getMin() + "</sub>");
			oRm.write("</td>");

			oRm.write("<td id='" + oControl.getId() + "-inner_ProgressLabelAvg' class='L2PProgressLabelAvg'>");
			oRm.write("<sub>" + (oControl.getMax() / 4) * 2 + "</sub>");
			oRm.write("</td>");

			oRm.write("<td id='" + oControl.getId() + "-inner_ProgressLabelMax' class='L2PProgressLabelMax'>");
			oRm.write("<sub>" + oControl.getMax() + "</sub>");
			oRm.write("</td>");

			oRm.write("</tr>");
			oRm.write("</table>");

			oRm.write("<div id='" + oControl.getId() + "-inner_Progress' class='L2PProgressBase L2PRadius'");
			oRm.addStyle("width", oControl.getWidth());
			oRm.addStyle("height", oControl.getHeight());
			oRm.addStyle("background-color", oControl.getBgColor());
			oRm.writeStyles();

			oRm.write(">");

			var max = parseFloat(oControl.getMax());
			var min = parseFloat(oControl.getMin());
			var val = parseFloat(oControl.getValue());
			var p = ((val - min) * 100.0) / (max - min);

			oRm.write("<div id='" + oControl.getId() + "-inner_ProgressBar' class='L2PProgressBar ");
			if (p == 100.0) {
				oRm.write("L2PRadius");
			}
			oRm.write("' ");
			oRm.addStyle("width", p + "%");
			oRm.addStyle("height", oControl.getHeight());
			oRm.addStyle("background-color", oControl.getBarColor());
			oRm.writeStyles();

			oRm.write(" title='" + oControl.getValue() + "' ");
			oRm.write(">");

			oRm.write(oControl.getDisplayValue());

			oRm.write("</div>");

			oRm.write("</div>");

			oRm.write("</div>");
		}
	}
});

control.L2PProgress.prototype.exit = function () {};

control.L2PProgress.prototype.setDisplayLabel = function (b) {
	this.setProperty("displayLabel", b, true);

	var c1 = $("#" + this.getId() + "-inner_ProgressLabel");

	if (b) {
		c1.css("display", "");
	} else {
		c1.css("display", "none");
	}
};

control.L2PProgress.prototype.setValue = function (v) {
	this.setProperty("value", v, true);

	var max = parseFloat(this.getMax());
	var min = parseFloat(this.getMin());
	var val = parseFloat(v);
	var p = ((val - min) * 100.0) / (max - min);

	var c1 = $("#" + this.getId() + "-inner_ProgressBar");
	c1.attr("title", v);
	if (p == 100.0) {
		c1.addClass("L2PRadius");
	} else {
		c1.removeClass("L2PRadius");
	}

	c1.css("width", p + "%");
};
