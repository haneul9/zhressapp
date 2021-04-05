/**
 * TalentSearchPersonCard
 *
 * Create Date : 2015. 05. 19
 * Version : 1.0
 */

jQuery.sap.declare("control.TalentSearchPersonCard");

sap.ui.core.Control.extend("control.TalentSearchPersonCard", {
	metadata: {
		properties: {
			pernr: { type: "string" }, // Perid
			pernr2: { type: "string" }, // Pernr
			name: { type: "string" },
			pictureUrl: { type: "string" },
			fid009: { type: "string" },
			fid013: { type: "string" },
			Hpitx: { type: "string" }, // HPI 구분 text
			item: { type: "string[]" },
			width: { type: "sap.ui.core.CSSSize", defaultValue: "360px" },
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
			oRm.addClass("L2PPersonCardLayout2");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.getWidth());
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<table class='L2PPersonTable' cellpadding=0 cellspacing=0 style='table-layout:fixed;'");

			oRm.write("<tr>");

			//image content
			oRm.write("<td rowSpan='" + vRowSapn + "' style='width: 90px; padding-right: 5px;' align='center'>");
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
					if (i == 0) oRm.write("width:" + (oControl.getWidth() - 150) + "px");
					oRm.write("' class='");
					if (i == 0) oRm.write("L2PPersonCardTextBold");
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
					if (i != 0) oRm.write("</tr>");
				} else if (oControl.getHpitx() && oControl.getHpitx() != "") {
					if (i != 0) {
						oRm.write("<tr>");
						oRm.write("<td colSpan=2 style='text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;");
					} else {
						oRm.write("<td style='text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width:200px;");
					}
					oRm.write("' class='");
					if (i == 0) oRm.write("L2PPersonCardTextBold");
					else oRm.write("L2PPersonCardText");
					oRm.write("' title='" + vItems[i] + "'>");
					oRm.write(vItems[i]);
					oRm.write("</td>");

					if (i == 0) {
						oRm.write(
							"<td style='text-align:right;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;color:#0093D0; font-weight:bold;'>"
						);
						oRm.write(oControl.getHpitx());
						oRm.write("&nbsp; </td>");

						var vColor = "#8B9297";
						if (oControl.getFid009() == "임원") {
							vColor = "#0093D0";
						} else if (oControl.getFid013() == "팀장") {
							vColor = "#32CD32";
						} else if (oControl.getFid013() != "" && oControl.getFid013() != "-") {
							// 부서장
							vColor = "#E64848";
						}
						oRm.write(
							"<td rowSpan='" + vRowSapn + "' style='width: 10px; background-color : " + vColor + ";' align='center'></td>"
						);
						oRm.write("</tr>");
					}

					if (i != 0) oRm.write("</tr>");
				} else {
					if (i != 0) oRm.write("<tr>");
					oRm.write("<td style='text-align:left;text-overflow: ellipsis;white-space: nowrap;overflow: hidden;");
					//oRm.write("<td style='text-align:left;overflow: hidden;");
					oRm.write("' class='");
					if (i == 0) oRm.write("L2PPersonCardTextBold");
					else oRm.write("L2PPersonCardText");
					oRm.write("' title='" + vItems[i] + "'>");
					oRm.write(vItems[i]);
					oRm.write("</td>");
					if (i != 0) oRm.write("</tr>");
				}

				if (i == 0 && !oControl.getHpitx()) {
					var vColor = "#8B9297";
					if (oControl.getFid009() == "임원") {
						vColor = "#0093D0";
					} else if (oControl.getFid013() == "팀장") {
						vColor = "#32CD32";
					} else if (oControl.getFid013() != "" && oControl.getFid013() != "-") {
						// 부서장
						vColor = "#E64848";
					}
					oRm.write(
						"<td rowSpan='" + vRowSapn + "' style='width: 10px; background-color : " + vColor + ";' align='center'></td>"
					);
					oRm.write("</tr>");
				}
			}

			oRm.write("</table>");
			oRm.write("</div>");
		}
	}
});

control.TalentSearchPersonCard.M_EVENTS = { press: "press" };

control.TalentSearchPersonCard.prototype.onclick = function (oBrowserEvent) {
	var oClickedControlId = oBrowserEvent.target.id;

	if (oClickedControlId == "IMG")
		this.firePress({ pernr: this.getPernr(), ename: this.getName(), wave: this.getWave(), pernr2: this.getPernr2() });
	else if (oClickedControlId.indexOf("CheckBox") > 0) this.setChecked(!this.getChecked());
};

control.TalentSearchPersonCard.prototype.exit = function () {};
