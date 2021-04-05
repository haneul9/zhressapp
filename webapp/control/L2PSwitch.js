/**
 * L2PSwitch
 *
 * @memberOf control.L2PSwitch
 *
 * Create Date : 2015. 09. 01
 * Version : 1.0
 */

jQuery.sap.declare("control.L2PSwitch");

sap.ui.core.Control.extend("control.L2PSwitch", {
	/*
	 * @memberOf control.L2PSwitch
	 */

	_vState: true,

	metadata: {
		properties: {
			cssPath: { type: "string", defaultValue: "" },
			onText: { type: "string", defaultValue: "ON" },
			offText: { type: "string", defaultValue: "OFF" },
			onBgColor: { type: "sap.ui.core.CSSColor", defaultValue: "#ffffff" },
			offBgColor: { type: "sap.ui.core.CSSColor", defaultValue: "#9a9a9a" },
			onColor: { type: "sap.ui.core.CSSColor", defaultValue: "#666666" },
			offColor: { type: "sap.ui.core.CSSColor", defaultValue: "#ffffff" },
			height: { type: "sap.ui.core.CSSSize", defaultValue: "1.0rem" },
			width: { type: "sap.ui.core.CSSSize", defaultValue: "3.0rem" }
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
			var cssPath = oControl.getCssPath();
			jQuery.sap.includeStyleSheet(cssPath + "L2PSwitch.css");

			oRm.write("<div class='L2PSwitch'");
			oRm.writeControlData(oControl);
			oRm.addStyle("width", oControl.getWidth());
			oRm.addStyle("height", oControl.getHeight());
			oRm.addStyle("background-color", oControl.getOnBgColor());
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<div class='L2PSwitchInner' style='width:100%'>");

			oRm.write("<div id='" + oControl.getId() + "-inner_OnText' class='L2PSwitchText' style='color:" + oControl.getOnColor() + "'>");
			oRm.write(
				"<span id='" + oControl.getId() + "-inner_OnLabel' class='L2PSwitchLabel' style='color:" + oControl.getOnColor() + "'>"
			);
			oRm.write(oControl.getOnText());
			oRm.write("</span>");
			oRm.write("</div>");

			oRm.write(
				"<div id='" +
					oControl.getId() +
					"-inner_OffText' class='L2PSwitchText' style='color:" +
					oControl.getOffColor() +
					"; left:3.1rem;'>"
			);
			oRm.write(
				"<span id='" + oControl.getId() + "-inner_OnLabel' class='L2PSwitchLabel' style='color:" + oControl.getOffColor() + "'>"
			);
			oRm.write(oControl.getOffText());
			oRm.write("</span>");
			oRm.write("</div>");

			oRm.write(
				"<div id='" +
					oControl.getId() +
					"-inner_SwitchHandle' class='L2PSwitchHandle L2PSwitchHandleOn' style='height:0.7rem;width:0.7rem;left:1.8rem;'></div>"
			);

			oRm.write("</div>");
			oRm.write("</div>");
		}
	}
});

control.L2PSwitch.prototype.exit = function () {};

/**
 * Function is called when button is clicked.
 */
control.L2PSwitch.prototype.onclick = function (oBrowserEvent) {
	if (this._vState) {
		$("#" + this.getId()).css("background-color", this.getOffBgColor());
		$("#" + this.getId() + "-inner_OnText").css("left", "-3.1rem");
		$("#" + this.getId() + "-inner_OffText").css("left", "1.025rem");
		$("#" + this.getId() + "-inner_SwitchHandle").css("left", "0.3rem");
		$("#" + this.getId() + "-inner_SwitchHandle").removeClass("L2PSwitchHandleOn");
		$("#" + this.getId() + "-inner_SwitchHandle").addClass("L2PSwitchHandleOff");
		this._vState = false;
	} else {
		$("#" + this.getId()).css("background-color", this.getOnBgColor());
		$("#" + this.getId() + "-inner_OnText").css("left", "0rem");
		$("#" + this.getId() + "-inner_OffText").css("left", "3.1rem");
		$("#" + this.getId() + "-inner_SwitchHandle").css("left", "1.8rem");
		$("#" + this.getId() + "-inner_SwitchHandle").removeClass("L2PSwitchHandleOff");
		$("#" + this.getId() + "-inner_SwitchHandle").addClass("L2PSwitchHandleOn");
		this._vState = true;
	}
};

control.L2PSwitch.prototype.getState = function () {
	return this._vState;
};

control.L2PSwitch.prototype.setState = function (state) {
	this._vState = state;
	if (this._vState) {
		$("#" + this.getId()).css("background-color", this.getOnBgColor());
		$("#" + this.getId() + "-inner_OnText").css("left", "0rem");
		$("#" + this.getId() + "-inner_OffText").css("left", "3.1rem");
		$("#" + this.getId() + "-inner_SwitchHandle").css("left", "1.8rem");
		$("#" + this.getId() + "-inner_SwitchHandle").removeClass("L2PSwitchHandleOff");
		$("#" + this.getId() + "-inner_SwitchHandle").addClass("L2PSwitchHandleOn");
	} else {
		$("#" + this.getId()).css("background-color", this.getOffBgColor());
		$("#" + this.getId() + "-inner_OnText").css("left", "-3.1rem");
		$("#" + this.getId() + "-inner_OffText").css("left", "1.025rem");
		$("#" + this.getId() + "-inner_SwitchHandle").css("left", "0.3rem");
		$("#" + this.getId() + "-inner_SwitchHandle").removeClass("L2PSwitchHandleOn");
		$("#" + this.getId() + "-inner_SwitchHandle").addClass("L2PSwitchHandleOff");
	}
};
