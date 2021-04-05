/**
 * RootOrgCard
 *
 * Create Date : 2015. 03. 23
 * Version : 1.0
 */

jQuery.sap.declare("control.RootOrgCard");

sap.ui.core.Control.extend("control.RootOrgCard", {
	metadata: {
		properties: {
			orgeh: { type: "string" },
			title: { type: "string" },
			count: { type: "string" },
			bgColor: { type: "sap.ui.core.CSSColor", defaultValue: "#FFFFFF" },

			width: { type: "sap.ui.core.CSSSize", defaultValue: "120px" },
			height: { type: "sap.ui.core.CSSSize", defaultValue: "120px" }
		},
		aggregations: {},

		associations: {},

		events: {
			press: {}
		}
	},

	init: function () {},

	onAfterRendering: function () {
		//called after instance has been rendered (it's in the DOM)
	},

	renderer: {
		render: function (oRm, oControl) {
			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.addClass("L2PRootOrgCardLayout");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.getWidth());
			oRm.addStyle("height", oControl.getHeight());
			oRm.addStyle("background-color", oControl.getBgColor());
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<table style='width: 100%; height: 100%'>");

			oRm.write("<tr>");

			oRm.write("<tr>");
			oRm.write("<td style='text-align:center' class='L2PRootOrgCardLayout-Title'>");
			oRm.write(oControl.getTitle());
			oRm.write("</td>");
			oRm.write("</tr>");

			oRm.write("<tr>");
			oRm.write("<td style='text-align:center' class='L2PRootOrgCardLayout-Count'>");
			oRm.write(oControl.getCount());
			oRm.write("</td>");
			oRm.write("</tr>");

			oRm.write("</table>");
			oRm.write("</div>");
		}
	}
});

control.RootOrgCard.M_EVENTS = { press: "press" };

control.RootOrgCard.prototype.onclick = function (oBrowserEvent) {
	this.firePress({ orgeh: this.getOrgeh() });
};

control.RootOrgCard.prototype.exit = function () {};
