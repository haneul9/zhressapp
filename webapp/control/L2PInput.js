/**
 * L2PInput
 *
 * @memberOf control.L2PNavBar
 *
 * Create Date : 2015. 09. 01
 * Version : 1.0
 */

jQuery.sap.declare("control.L2PInput");

sap.ui.core.Control.extend("control.L2PInput", {
	/*
	 * @memberOf control.L2PInput
	 */

	metadata: {
		properties: {
			value: { type: "string", defaultValue: "" },
			maxlength: { type: "int", defaultValue: 0 },
			placeholder: { type: "string", defaultValue: "" },
			wrongMsg: { type: "string", defaultValue: "wrong entry !!!" },
			editable: { type: "boolean", defaultValue: true },
			showHelp: { type: "boolean", defaultValue: false },
			search: { type: "boolean", defaultValue: false },
			height: { type: "sap.ui.core.CSSSize", defaultValue: "2.0rem" },
			width: { type: "sap.ui.core.CSSSize", defaultValue: "100%" }
		},
		aggregations: {},

		associations: {},

		events: {
			liveChange: {},
			valueHelpRequest: {}
		}
	},

	init: function () {},

	onBeforeRendering: function () {
		var domNode = this.getDomRef();
		$(domNode).unbind("liveChange");
		$(domNode).unbind("valueHelpRequest");
	},

	onAfterRendering: function () {
		var self = this,
			domNode = this.getDomRef();

		$(domNode).bind("liveChange", function () {
			self.fireSelect({
				values: ""
			});
		});

		$(domNode).bind("valueHelpRequest", function () {
			self.fireSelect({});
		});

		var c = $("#" + self.getId() + "-inner_Input");
		$(c).keyup(function (ev) {
			self.fireLiveChange({ values: c.val() });
		});

		$(c).change(function (ev) {
			self.setValue(c.val());
		});
	},

	renderer: {
		render: function (oRm, oControl) {
			jQuery.sap.includeStyleSheet("css/L2PInput.css");

			oRm.write("<div class='L2PInputBase'");
			oRm.writeControlData(oControl);
			oRm.addStyle("width", oControl.getWidth());
			oRm.addStyle("height", oControl.getHeight());
			oRm.writeStyles();
			//oRm.write(" title='" + oControl.getWrongMsg() + "' ");
			oRm.write(">");

			if (oControl.getEditable()) {
				oRm.write("<input id='" + oControl.getId() + "-inner_Input' class='L2PInput' ");
			} else {
				oRm.write("<input id='" + oControl.getId() + "-inner_Input' class='L2PInput L2PInputDisabled' ");
			}

			if (!oControl.getSearch()) {
				oRm.write(" type='text' ");
			} else {
				oRm.write(" type='search' ");
			}

			if (oControl.getMaxlength() > 0) {
				oRm.write(" maxLength='" + oControl.getMaxlength() + "' ");
			}

			if (oControl.getValue() != "") {
				oRm.write(" value='" + oControl.getValue() + "' ");
			}

			if (!oControl.getEditable()) {
				oRm.write(" readonly ");
			}

			if (oControl.getEditable() && oControl.getShowHelp()) {
				oRm.write(" readonly ");
				oRm.addStyle("padding-right", "20px");
			} else {
				oRm.write(" placeholder='" + oControl.getPlaceholder() + "' ");
			}

			oRm.addStyle("width", "100%");
			oRm.addStyle("height", "81.25%");
			oRm.writeStyles();
			oRm.write(">");

			if (oControl.getEditable() && oControl.getShowHelp()) {
				oRm.write("<dv id='" + oControl.getId() + "-inner_InputHelp' class='L2PInputHelp'>");
				oRm.write("<img id='" + oControl.getId() + "-inner_InputHelpImage' src='images/Search.gif' class='L2PInputHelpImage'>");
				oRm.write("</div>");
			}

			oRm.write("</div>");
		}
	},

	showHelp: function () {
		var c1 = $("#" + this.getId() + "-inner_Input");
		var c2 = $("#" + this.getId() + "-inner_InputHelp");

		c1.css("padding-right", "20px");
		c1.attr("readonly", true);
		c2.css("display", "block");
		c1.removeAttr("placeholder");
	},

	hideHelp: function () {
		var c1 = $("#" + this.getId() + "-inner_Input");
		var c2 = $("#" + this.getId() + "-inner_InputHelp");

		c1.css("padding-right", "0px");
		c2.css("display", "none");
		c1.removeAttr("readonly");
		c1.attr("placeholder", this.getPlaceholder());
	}
});

control.L2PInput.prototype.exit = function () {};

control.L2PInput.M_EVENTS = { liveChange: "liveChange" };

control.L2PInput.prototype.setState = function (state) {
	var c1 = $("#" + this.getId());
	var c2 = $("#" + this.getId() + "-inner_Input");
	if (state == 0) {
		c2.removeClass("L2PInputError");
		c2.removeClass("L2PInputWarning");
		c2.removeClass("L2PInputCorrect");
		c1.attr("title", "");
	} else if (state == 1) {
		c2.addClass("L2PInputError");
		c2.removeClass("L2PInputWarning");
		c2.removeClass("L2PInputCorrect");
		c1.attr("title", this.getWrongMsg());
	} else if (state == 2) {
		c2.removeClass("L2PInputError");
		c2.addClass("L2PInputWarning");
		c2.removeClass("L2PInputCorrect");
		c1.attr("title", "");
	} else if (state == 3) {
		c2.removeClass("L2PInputError");
		c2.removeClass("L2PInputWarning");
		c2.addClass("L2PInputCorrect");
		c1.attr("title", "");
	}
};

control.L2PInput.prototype.setShowHelp = function (showhelp) {
	this.setProperty("showHelp", showhelp, true);

	if (showhelp) {
		this.showHelp();
	} else {
		this.hideHelp();
	}
};

control.L2PInput.prototype.setEditable = function (editable) {
	this.setProperty("editable", editable, true);

	var c1 = $("#" + this.getId() + "-inner_Input");
	var c2 = $("#" + this.getId() + "-inner_InputHelp");

	if (editable) {
		c1.removeClass("L2PInputDisabled");

		if (this.getShowHelp()) {
			this.showHelp();
		} else {
			this.hideHelp();
		}
	} else {
		c1.addClass("L2PInputDisabled");
		c1.attr("readonly", true);
		c2.css("display", "none");
	}
};

control.L2PInput.prototype.onclick = function (oBrowserEvent) {
	var oClickedControlId = oBrowserEvent.target.id;

	if (oClickedControlId.indexOf("inner_InputHelpImage") != -1) {
		this.fireValueHelpRequest();
	}
};
