jQuery.sap.declare("control.MTalentSearchPersonCard");

sap.ui.core.Control.extend("control.MTalentSearchPersonCard", {
	metadata: {
		properties: {
			pernr: { type: "string" },
			name: { type: "string" },
			pictureUrl: { type: "string" },
			item: { type: "string[]" },
			width: { type: "sap.ui.core.CSSSize", defaultValue: "450px" },
			checked: { type: "boolean", defaultValue: false },
			chkBox: { type: "boolean", defaultValue: false },
			wave: { type: "string", defaultValue: "1" }
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
			var vItems = oControl.getItem();
			var vItemCount = vItems.length;
			var vRowSapn = vItemCount < 4 ? 4 : vItemCount;

			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.addClass("L2PPersonCardLayout3");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.getWidth());
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<table class='L2PPersonTable' cellpadding=0 cellspacing=0 style='table-layout:fixed;'");

			oRm.write("<tr>");

			//image content
			oRm.write("<td rowSpan='" + vRowSapn + "' style='width: 90px' align='center'>");
			var url1 = oControl.getPictureUrl();
			if (url1 && url1 != "") {
				oRm.write("<img id='IMG' src='" + oControl.getPictureUrl() + "' class='L2PPersonCardPicture2' width='85px' ");
				oRm.write(" />");
			} else {
				oRm.write(
					"<img id='IMG' src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/male.jpg' class='L2PPersonCardPicture2' width='85px' "
				);
				oRm.write(" />");
			}
			oRm.write("</td>");

			for (var i = 0; i < vItemCount; i++) {
				if (oControl.getChkBox()) {
					if (i != 0) oRm.write("<tr>");
					oRm.write("<td style='text-align:left;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;");
					if (i == 0) oRm.write("width:" + (oControl.getWidth() - 115) + "px");
					oRm.write("' class='");
					if (i < 2) oRm.write("L2PPersonCardTextBold");
					else oRm.write("L2PPersonCardText");
					if (i == 0) oRm.write("'>");
					else oRm.write("' nowrap colspan='2'>");
					oRm.write(vItems[i]);
					oRm.write("</td>");
					if (i == 0) {
						oRm.write(
							"<td style='text-align:left; width: 25px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;'>"
						);
						oRm.write("<input class='L2PPersonCard_Checkbox' type='CheckBox' id='_CheckBox_" + oControl.getPernr() + "'");
						if (oControl.getChecked()) oRm.write(" checked");
						oRm.write(">");
						oRm.write("</td>");
					}
					oRm.write("</tr>");
				} else {
					if (i != 0) oRm.write("<tr>");
					//oRm.write("<td style='text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;");
					oRm.write("<td style='text-align:left;overflow: hidden;");
					oRm.write("' class='");
					if (i < 2) oRm.write("L2PPersonCardTextBold");
					else oRm.write("L2PPersonCardText");
					oRm.write("' title='" + vItems[i] + "'>");
					oRm.write(vItems[i]);
					oRm.write("</td>");
					oRm.write("</tr>");
				}
			}

			oRm.write("</table>");
			oRm.write("</div>");
		}
	}
});

control.MTalentSearchPersonCard.M_EVENTS = { press: "press" };

control.MTalentSearchPersonCard.prototype.onclick = function (oBrowserEvent) {
	this.firePress({ pernr: this.getPernr(), ename: this.getName(), wave: this.getWave() });
};

control.MTalentSearchPersonCard.prototype.exit = function () {};
