/**
 * TalentSearchSProfile
 *
 * Create Date : 2015. 07. 03
 * Version : 1.0
 */

jQuery.sap.declare("control.TalentSearchSProfile");

sap.ui.core.Control.extend("control.TalentSearchSProfile", {
	metadata: {
		properties: {
			type: { type: "string", defaultValue: "data" },
			pernr: { type: "string" },
			name: { type: "string" },
			pictureUrl: { type: "string" },
			item1: { type: "string[]" },
			item2: { type: "string[]" },
			item3: { type: "string[]" },
			width: { type: "sap.ui.core.CSSSize", defaultValue: "100%" }
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
			var vPhotoWidth = "300px";

			oRm.write("<table cellpadding=0 cellspacing=0 style='width:" + oControl.getWidth() + "; table-layout:fixed;'>");
			switch (oControl.getType()) {
				case "header":
					oRm.write("<tr>");
					oRm.write("<td style='width:" + vPhotoWidth + "'>");
					oRm.write("</td>");
					oRm.write("<td>");
					oRm.write("<table cellpadding=0 cellspacing=0 style='width:100%; table-layout:fixed;'>");
					oRm.write("<tr>");
					oRm.write("<td class='L2PSProfile_Header' style='width:30%;'>");
					oRm.write("기본정보");
					oRm.write("</td>");
					oRm.write("<td style='width:5%'></td>");
					oRm.write("<td class='L2PSProfile_Header' style='width:30%;'>");
					oRm.write("직무(Sub job) 및 경력");
					oRm.write("</td>");
					oRm.write("<td style='width:5%'></td>");
					oRm.write("<td class='L2PSProfile_Header' style='width:30%;'>");
					oRm.write("글로벌 이력");
					oRm.write("</td>");
					oRm.write("</tr>");
					oRm.write("</table>");
					oRm.write("</td>");
					oRm.write("</tr>");
					oRm.write("<tr><td colspan='2' style='height : 10px;'></td></tr>");
					break;
				case "data":
					var pictureUrl = oControl.getPictureUrl();
					var item1 = oControl.getItem1();
					var item2 = oControl.getItem2();
					var item3 = oControl.getItem3();

					oRm.write("<tr valign='top'>");
					oRm.write("<td style='width:" + vPhotoWidth + "' align='center'>");
					if (pictureUrl && pictureUrl != "") {
						oRm.write("<img src='" + pictureUrl + "' class='L2PSProfile_Image' ");
						oRm.writeControlData(oControl);
						oRm.write(" />");
					} else {
						oRm.write("<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/male.jpg' class='L2PSProfile_Image' ");
						oRm.writeControlData(oControl);
						oRm.write(" />");
					}
					oRm.write("</td>");
					oRm.write("<td>");
					oRm.write("<table cellpadding=0 cellspacing=0 style='width:100%; table-layout:fixed;'>");
					oRm.write("<tr valign='top'>");
					oRm.write("<td style='width:30%;'>");
					oRm.write("<table cellpadding=0 cellspacing=0 style='width:100%; table-layout:fixed;'>");
					for (var i = 0; i < item1.length; i++) {
						var text = item1[i] == "" ? "&nbsp;" : item1[i];
						oRm.write("<tr><td class='L2PSProfile_Data'>" + text + "</td></tr>");
					}
					oRm.write("</table>");
					oRm.write("</td>");
					oRm.write("<td style='width:5%'></td>");
					oRm.write("<td style='width:30%;'>");
					oRm.write("<table cellpadding=0 cellspacing=0 style='width:100%; table-layout:fixed;'>");
					for (var i = 0; i < item2.length; i++) {
						var text = item2[i] == "" ? "&nbsp;" : item2[i];
						oRm.write("<tr><td class='L2PSProfile_Data'>" + text + "</td></tr>");
					}
					oRm.write("</table>");
					oRm.write("</td>");
					oRm.write("<td style='width:5%'></td>");
					oRm.write("<td style='width:30%;'>");
					oRm.write("<table cellpadding=0 cellspacing=0 style='width:100%; table-layout:fixed;'>");
					for (var i = 0; i < item3.length; i++) {
						var text = item3[i] == "" ? "&nbsp;" : item3[i];
						oRm.write("<tr><td class='L2PSProfile_Data'>" + text + "</td></tr>");
					}
					oRm.write("</table>");
					oRm.write("</td>");
					oRm.write("</tr>");
					oRm.write("</table>");
					oRm.write("</td>");
					oRm.write("</tr>");
					break;
				case "line":
					oRm.write("<tr><td style='height : 3px;border-bottom : 1px solid #000000;'></td></tr>");
					oRm.write("<tr><td style='height : 10px;'></td></tr>");
					break;
				default:
			}
			oRm.write("</table>");
		}
	}
});

control.TalentSearchSProfile.M_EVENTS = { press: "press" };

control.TalentSearchSProfile.prototype.onclick = function (oBrowserEvent) {
	var oClickedControlId = oBrowserEvent.target.id;

	this.firePress({ pernr: this.getPernr(), ename: this.getName() });
};

control.TalentSearchSProfile.prototype.exit = function () {};
