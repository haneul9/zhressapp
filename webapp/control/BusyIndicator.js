/**
 * CapaPersonCard
 *
 * Create Date : 2015. 04. 14
 * Version : 1.0
 */

jQuery.sap.declare("control.BusyIndicator");

sap.ui.core.Control.extend("control.BusyIndicator", {
	metadata: {
		properties: {
			text: { type: "string" },
			width: { type: "sap.ui.core.CSSSize", defaultValue: "300px" }
		},
		aggregations: {},

		associations: {},

		events: {}
	},

	init: function () {},

	onAfterRendering: function () {
		//called after instance has been rendered (it's in the DOM)
	},

	renderer: {
		render: function (oRm, oControl) {
			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.addStyle("width", oControl.getWidth());
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<table cellpadding='0' cellspacing='0' style='width:100%; height:100%;'>");
			oRm.write("<tr>");

			//image content
			oRm.write("<td style='width:32px; height:32px'>");
			oRm.write("<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/progress.gif' style='width:32px; height:32px' />");
			oRm.write("</td>");

			oRm.write("<td style='text-align:left; padding-left:10px; font-size: 0.9rem; font-family: 'Malgun Gothic';'>");
			oRm.write(oControl.getText());
			oRm.write("</td>");

			oRm.write("</tr>");
			oRm.write("</table>");
			oRm.write("</div>");
		}
	}
});

control.BusyIndicator.prototype.exit = function () {};
