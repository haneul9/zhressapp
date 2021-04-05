/**
 * OrgPersonCard
 *
 * Create Date : 2015. 03. 23
 * Version : 1.0
 */

jQuery.sap.declare("control.OrgPersonCard");

jQuery.sap.require("sap.ui.core.Icon");

sap.ui.core.Control.extend("control.OrgPersonCard", {
	metadata: {
		properties: {
			pernr: { type: "string" },
			wave: { type: "string", defaultValue: "1" },
			name: { type: "string" },
			organization: { type: "string" },
			job: { type: "string" },
			employee: { type: "string", defaultValue: "" },
			jobCareer: { type: "string" },
			chief: { type: "string" },
			addpos: { type: "string" },
			pictureUrl: { type: "string" },
			width: { type: "sap.ui.core.CSSSize", defaultValue: "240px" }
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
			oRm.addClass("L2PPersonCardLayout");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.getWidth());
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<table class='L2PPersonTable' cellpadding=0 cellspacing=0");

			oRm.write("<tr>");

			//image content
			oRm.write("<td rowSpan='4' align='center' style='width: 80px'>");
			var url1 = oControl.getPictureUrl();
			if (url1 && url1 != "") oRm.write("<img src='" + oControl.getPictureUrl() + "' class='L2PPersonCardPicture' />");
			else oRm.write("<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/male.jpg' class='L2PPersonCardPicture' />");
			oRm.write("</td>");

			oRm.write("<td colSpan='2' style='text-align:left' class='L2PPersonCardOrgName'>");
			oRm.write(oControl.getOrganization());
			oRm.write("</td>");
			oRm.write("</tr>");

			oRm.write("<tr>");
			oRm.write("<td colSpan='2' style='text-align:left' class='L2PPersonCardName'>");

			var Ename = oControl.getName();
			oRm.write(Ename);

			//                if(oControl.getChief() == "X") {
			//                	Ename += "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/s_b_mngr.gif' style='padding-left:5px;vertical-align: middle;' title='������'>";
			//                }
			//                if(oControl.getAddpos() == "1") {
			//                	Ename += "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/s_incemp.gif' style='padding-left:5px;vertical-align: middle;' title='�İ�'>";
			//                }
			//                if(oControl.getAddpos() == "2") {
			//                	Ename += "<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/s_shapos.gif' style='padding-left:5px;vertical-align: middle;' title='����'>";
			//                }

			if (oControl.getChief() == "X") {
				oRm.write("<span styel='padding-left:5px'> </span>");
				oRm.renderControl(new sap.ui.core.Icon({ src: "sap-icon://manager", color: "gray", size: "0.8rem" }).setTooltip("조직장"));
			}

			if (oControl.getAddpos() == "1") {
				//�İ�
				oRm.write("<span styel='padding-left:5px'> </span>");
				oRm.renderControl(new sap.ui.core.Icon({ src: "sap-icon://begin", color: "gray", size: "0.8rem" }).setTooltip("파견"));
			} else if (oControl.getAddpos() == "2") {
				//����
				oRm.write("<span styel='padding-left:5px'> </span>");
				oRm.renderControl(new sap.ui.core.Icon({ src: "sap-icon://group", color: "gray", size: "0.8rem" }).setTooltip("겸직"));
			} else if (oControl.getAddpos() == "3") {
				//�⹫
				oRm.write("<span styel='padding-left:5px'> </span>");
				oRm.renderControl(new sap.ui.core.Icon({ src: "sap-icon://share-2", color: "gray", size: "0.8rem" }).setTooltip("겸무"));
			}

			oRm.write("</td>");
			oRm.write("</tr>");

			oRm.write("<tr>");
			oRm.write("<td colSpan='2' style='text-align:left' class='L2PPersonCardCount' title='" + oControl.getJob() + "'>");
			oRm.write(oControl.getJob());
			oRm.write("</td>");
			oRm.write("</tr>");

			oRm.write("<tr>");
			oRm.write("<td style='text-align:left' title='" + oControl.getEmployee() + "'><div class='L2PPersonCardJob'>");
			oRm.write(oControl.getEmployee());
			oRm.write("</div></td>");
			oRm.write("<td style='text-align:right;' class='L2PPersonCardJobCareer'>");
			oRm.write(oControl.getJobCareer());
			oRm.write("</td>");
			oRm.write("</tr>");

			oRm.write("</table>");
			oRm.write("</div>");
		}
	}
});

control.OrgPersonCard.M_EVENTS = { press: "press" };

control.OrgPersonCard.prototype.onclick = function (oBrowserEvent) {
	this.firePress({ pernr: this.getPernr(), ename: this.getName(), wave: this.getWave() });
};

control.OrgPersonCard.prototype.exit = function () {};
