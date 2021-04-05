/**
 * CapaPersonCard
 *
 * Create Date : 2015. 04. 14
 * Version : 1.0
 */

jQuery.sap.declare("control.CapaPersonCard");

sap.ui.core.Control.extend("control.CapaPersonCard", {
	metadata: {
		properties: {
			name: { type: "string" },
			organization: { type: "string" },
			sabun: { type: "string" },
			jobTitle: { type: "string", defaultValue: "" },
			jobPosition: { type: "string" },

			pictureUrl: { type: "string" },

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
			oRm.addClass("L2PPersonCardLayout");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.getWidth());
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<table cellpadding='0' cellspacing='0' style='width:100%; height:100%; margin :0px'>");

			oRm.write("<tr>");

			//image content
			oRm.write("<td rowSpan='5' style='width:110px'>");
			var url1 = oControl.getPictureUrl();
			if (url1 && url1 != "") oRm.write("<img src='" + oControl.getPictureUrl() + "' class='L2PPersonCardPicture' />");
			else oRm.write("<img src='images/employee1.jpg' class='L2PPersonCardPicture' />");
			oRm.write("</td>");

			oRm.write("<td style='text-align:left' colSpan='2' class='L2PPersonCardOrgName'>");
			oRm.write(oControl.getName());
			oRm.write("</td>");

			oRm.write("</tr>");

			oRm.write("<tr>");
			oRm.write("<td style='text-align:left' class='L2PPersonLabel'>");
			oRm.write("사번 : ");
			oRm.write("</td>");
			oRm.write("<td style='text-align:left' class='L2PPersonInfo'>");
			oRm.write(oControl.getSabun());
			oRm.write("</td>");
			oRm.write("</tr>");

			oRm.write("<tr>");
			oRm.write("<td style='text-align:left' class='L2PPersonLabel'>");
			oRm.write("조직 : ");
			oRm.write("</td>");
			oRm.write("<td style='text-align:left' class='L2PPersonInfo'>");
			oRm.write(oControl.getOrganization());
			oRm.write("</td>");
			oRm.write("</tr>");

			oRm.write("<tr>");
			oRm.write("<td style='text-align:left' class='L2PPersonLabel'>");
			oRm.write("직위 : ");
			oRm.write("</td>");
			oRm.write("<td style='text-align:left' class='L2PPersonInfo'>");
			oRm.write(oControl.getJobPosition());
			oRm.write("</td>");
			oRm.write("</tr>");

			oRm.write("<tr>");
			oRm.write("<td style='text-align:left' class='L2PPersonLabel'>");
			oRm.write("직책 : ");
			oRm.write("</td>");
			oRm.write("<td style='text-align:left' class='L2PPersonInfo'>");
			oRm.write(oControl.getJobTitle());
			oRm.write("</td>");
			oRm.write("</tr>");

			oRm.write("</table>");
			oRm.write("</div>");
		}
	}
});

control.CapaPersonCard.prototype.exit = function () {};
