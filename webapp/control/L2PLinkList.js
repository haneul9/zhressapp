/**
 * L2PLinkList
 *
 * @memberOf control.L2PLinkList
 *
 * Create Date : 2015. 03. 27
 * Version : 1.0
 */

jQuery.sap.declare("control.L2PLinkList");

sap.ui.core.Control.extend("control.L2PLinkList", {
	/*
	 * @memberOf control.L2PLinkList
	 */
	metadata: {
		properties: {
			ename: { type: "string" },
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
			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.addStyle("width", oControl.getWidth());
			oRm.write(">");

			var vEname = oControl.getEname();

			if (vEname.length > 8) {
				//oRm.write("<ul style='padding:0px;list-style:none;'>");

				var vTmp1 = vEname.split(",");

				for (var i = 0; i < vTmp1.length; i++) {
					var vTmp2 = vTmp1[i].split("_");

					//oRm.write("<li style=\"font-size:14px;font-family: 'Malgun Gothic'\">");
					oRm.write("<div style=\"font-size:14px;font-family: 'Malgun Gothic'\">");

					oRm.write("<a href='javascript:onClickPerson(" + vTmp2[0] + ")'>");
					oRm.write(vTmp2[1]);
					oRm.write("</a>");

					//oRm.write("</li>");
					oRm.write("</div>");
				}

				//oRm.write("</ul>");
			} else {
				oRm.write("<span style=\"color:blue;font-size:14px;font-family: 'Malgun Gothic'\">");
				oRm.write(vEname);
				oRm.write("</span>");
			}

			oRm.write("</div>");
		}
	}
});

control.L2PLinkList.prototype.exit = function () {};
