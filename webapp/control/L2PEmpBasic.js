/**
 * L2PDataSet
 *
 * @memberOf control.L2PDataSet
 *
 * Create Date : 2015. 03. 27
 * Version : 1.0
 */

jQuery.sap.declare("control.L2PEmpBasic");

sap.ui.core.Control.extend("control.L2PEmpBasic", {
	/*
	 * @memberOf control.L2PEmpBasic
	 */
	metadata: {
		properties: {
			empData: { type: "any" },
			labels: { type: "any[]" },
			mobile: { type: "boolean", defaultValue: false },
			width: { type: "sap.ui.core.CSSSize", defaultValue: "100%" }
		},
		aggregations: {},

		associations: {},

		events: {
			select: {}
		}
	},

	init: function () {},

	onBeforeRendering: function () {},

	onAfterRendering: function () {},

	renderer: {
		render: function (oRm, oControl) {
			var vEmpData = oControl.getEmpData();
			var vLabels = oControl.getLabels();

			var vWave = "1";
			if (vEmpData.Zzwavet && vEmpData.Zzwavet != "") vWave = vEmpData.Zzwavet;

			var vHead2 = "&nbsp;";
			if (vEmpData.Head2 && vEmpData.Head2 != "") vHead2 = vEmpData.Head2;

			var vHead1 = "&nbsp;";
			if (vEmpData.Head1 && vEmpData.Head1 != "") vHead1 = vEmpData.Head1;

			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.addStyle("width", oControl.getWidth());
			oRm.write(">");

			oRm.write("<div class='ep-user-detail-info1'>");
			oRm.write("<table class='pe-photo-box1' cellspacing='0' cellpadding='0'>");
			oRm.write("	<tr>");
			oRm.write(
				"		<td class='pe-td-photo-set' rowspan='2'><div class='pe-photo'><img src='" +
					vEmpData.Ephotourl +
					"' alt='' style='width:100%; height:100%' /></div></td>"
			);
			oRm.write("		<td colspan='1' class='pe-td-name'><div class='pe-top-txt-name'>" + vHead1 + "</div></td>");
			if (oControl.getMobile() == false) {
				oRm.write("		<td colspan='1' align='Right'><div class='pe-top-txt-name2'>" + vHead2 + "</div></td>");
			}

			oRm.write("	</tr>");
			oRm.write("	<tr>");
			oRm.write("		<td class='pe-td-width1' >");
			oRm.write("			<ul>");
			oRm.write("				<li title='" + vEmpData.Line1 + "'>" + vEmpData.Line1 + "</li>");
			oRm.write("				<li title='" + vEmpData.Line2 + "'>" + vEmpData.Line2 + "</li>");
			oRm.write("				<li title='" + vEmpData.Line3 + "'>" + vEmpData.Line3 + "</li>");
			oRm.write("				<li title='" + vEmpData.Line4 + "'>" + vEmpData.Line4 + "</li>");
			oRm.write("				<li title='" + vEmpData.Line5 + "'>" + vEmpData.Line5 + "</li>");
			oRm.write("			</ul>");
			oRm.write("		</td>");

			if (oControl.getMobile() == false) {
				if (vWave == "1") {
					oRm.write("		<td class='pe-td-width2'");
					oRm.write(" id='" + oControl.getId() + "-inner-Date" + "'>");

					oRm.write("			<ul style='text-align:right'>");
					oRm.write("				<li>" + vLabels[0].label + " :</li>");
					oRm.write("				<li>" + vLabels[1].label + " :</li>");
					oRm.write("				<li>" + vLabels[2].label + " :</li>");
					oRm.write("				<li>" + vLabels[3].label + " :</li>");
					//                        oRm.write("				<li>" + vLabels[4].label + " :</li>");
					oRm.write("			</ul>");
					oRm.write("			<ul class='pe-txt-upda1'>");
					oRm.write("				<li>" + vEmpData.Datt1 + "</li>");
					oRm.write("				<li>" + vEmpData.Datt2 + "</li>");
					oRm.write("				<li>" + vEmpData.Datt3 + "</li>");
					oRm.write("				<li>" + vEmpData.Datt4 + "</li>");
					//                        oRm.write("				<li>" + vEmpData.Datt5 + "</li>");
					oRm.write("			</ul>");
					oRm.write("		</td>");
				} else {
					oRm.write("		<td class='pe-td-width2'");
					oRm.write(" id='" + oControl.getId() + "-inner-Date" + "'>");
					oRm.write("		</td>");
				}
			}

			oRm.write("	</tr>");
			oRm.write("</table>");
			oRm.write("</div>");

			oRm.write("</div>");
		}
	}
});

control.L2PEmpBasic.prototype.exit = function () {};
