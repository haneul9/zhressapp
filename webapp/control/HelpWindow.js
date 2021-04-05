jQuery.sap.declare("control.HelpWindow");

jQuery.sap.includeStyleSheet("ZHR_COMMON/css/L2PWindow.css");

jQuery.sap.require("sap.ui.core.Control");

sap.ui.core.Control.extend("control.HelpWindow", {
	vCollapsed: true,

	/**
	 * @MemberOf control.ScheduleCalendar
	 */

	metadata: {
		properties: {
			showCollapseIcon: { type: "boolean", defaultValue: true },
			collapsed: { type: "boolean", defaultValue: true },
			helpTitle: { type: "string", defaultValue: "" },
			helpWidth: { type: "sap.ui.core.CSSSize", defaultValue: "300px" },

			width: { type: "sap.ui.core.CSSSize", defaultValue: "100%" },
			height: { type: "sap.ui.core.CSSSize", defaultValue: "100%" }
		},
		aggregations: {
			helpContent: { type: "sap.ui.core.Control", multiple: true, singularName: "helpContent" },
			content: { type: "sap.ui.core.Control", multiple: true, singularName: "content" }
		},

		associations: {},

		events: {}
	},

	init: function () {
		sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.resizeView, this);
		sap.ui.getCore().getEventBus().subscribe("HelpWindow", "onPresscollapseIcon", this.onPresscollapseIcon, this);
	},

	onAfterRendering: function () {
		var oControl = this;

		if (oControl.getShowCollapseIcon()) {
			$("#" + this.getId() + "_Inner_SideWindowCollapsedBtn").click(function () {
				sap.ui.getCore().getEventBus().publish("HelpWindow", "onPresscollapseIcon", {});
			});
		}

		setTimeout(function () {
			oControl.resizeView();
		}, 100);
	},

	onPresscollapseIcon: function () {
		if (this.vCollapsed) {
			this.enableCollapse();
		} else {
			this.disableCollapse();
		}
	},

	enableCollapse: function () {
		var SideWindow = "#" + this.getId() + "_Inner_SideWindow";
		var SideTitle = "#" + this.getId() + "_Inner_SideWindowTitle";
		var SideContent = "#" + this.getId() + "_Inner_SideWindowContent";
		var SideCollapseBtn = "#" + this.getId() + "_Inner_SideWindowCollapsedBtn";
		var SideCollapseImage = "#" + this.getId() + "_Inner_SideWindowCollapsedImage";
		var BodyContent = "#" + this.getId() + "_Inner_BodyContent";

		$(SideWindow).css("width", "32px");

		$(SideTitle).css("top", "30px");
		$(SideTitle).css("left", "32px");
		$(SideTitle).css("text-align", "left");
		$(SideTitle).css("width", window.innerHeight - 32);
		$(SideTitle).addClass("x-title-rotate-right");

		$(BodyContent).css("left", 32);
		$(BodyContent).css("height", window.innerHeight - 0);
		$(BodyContent).css("width", window.innerWidth - 33);

		$(SideCollapseBtn).css("right", "0px");
		$(SideCollapseImage).attr("src", "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/icon_r.png");

		$(SideContent).css("left", -1000);

		this.vCollapsed = false;
	},

	disableCollapse: function () {
		var SideWindow = "#" + this.getId() + "_Inner_SideWindow";
		var SideTitle = "#" + this.getId() + "_Inner_SideWindowTitle";
		var SideContent = "#" + this.getId() + "_Inner_SideWindowContent";
		var SideCollapseBtn = "#" + this.getId() + "_Inner_SideWindowCollapsedBtn";
		var SideCollapseImage = "#" + this.getId() + "_Inner_SideWindowCollapsedImage";
		var BodyContent = "#" + this.getId() + "_Inner_BodyContent";

		$(SideWindow).css("width", "300px");

		$(SideTitle).css("top", "0px");
		$(SideTitle).css("left", "0px");
		$(SideTitle).css("width", "100%");
		$(SideTitle).css("text-align", "center");
		$(SideTitle).removeClass("x-title-rotate-right");

		$(BodyContent).css("left", "301px");
		$(BodyContent).css("height", window.innerHeight - 0);
		$(BodyContent).css("width", window.innerWidth - 301);

		$(SideCollapseBtn).css("right", "5px");

		$(SideContent).css("left", 0);

		$(SideCollapseImage).attr("src", "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/icon_l.png");

		this.vCollapsed = true;
	},

	renderer: {
		render: function (oRm, oControl) {
			var c_w = oControl.getContainerWidth();
			var i_w = oControl.getSideWidth(c_w);

			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.addClass("L2PWindowContainer");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.getWidth());
			oRm.addStyle("height", oControl.getHeight());
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<div ");
			oRm.write("id='" + oControl.getId() + "_Inner_SideWindow' ");
			oRm.addClass("L2PSideWindowContainer");
			oRm.writeClasses();
			oRm.addStyle("width", i_w + "px");
			oRm.addStyle("height", oControl.getHeight());
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<div ");
			oRm.write("id='" + oControl.getId() + "_Inner_SideWindowTitle' ");
			oRm.addClass("L2PSideWindowTitle");
			oRm.writeClasses();
			oRm.write(">");

			oRm.write("<div ");
			oRm.addClass("L2PSideWindowPanel");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write(oControl.getHelpTitle());
			oRm.write("</div>"); //Panel Title

			oRm.write("</div>"); //Window Title

			if (oControl.getShowCollapseIcon()) {
				oRm.write("<div ");
				oRm.write("id='" + oControl.getId() + "_Inner_SideWindowCollapsedBtn' ");
				oRm.addClass("L2PSideWindowCollapsedBtn");
				oRm.writeClasses();
				oRm.write(">");
				oRm.write(
					"<img id='" +
						oControl.getId() +
						"_Inner_SideWindowCollapsedImage' src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/images/icon_l.png'>"
				);
				oRm.write("</div>"); //Collapsed Button
			}

			oRm.write("<div ");
			oRm.write("id='" + oControl.getId() + "_Inner_SideWindowContent' ");
			oRm.addClass("L2PSideWindowContent");
			oRm.writeClasses();
			oRm.write(">");

			var oSideContents = oControl.getHelpContent();
			if (oSideContents && oSideContents.length) {
				for (var i = 0; i < oSideContents.length; i++) {
					oRm.renderControl(oSideContents[i]);
				}
			}

			oRm.write("</div>"); //Side Content

			oRm.write("</div>"); //SideWindow

			oRm.write("<div ");
			oRm.write("id='" + oControl.getId() + "_Inner_BodyContent' ");
			oRm.addClass("L2PBodyContainer");
			oRm.writeClasses();
			oRm.addStyle("left", i_w + 1 + "px");
			oRm.writeStyles();
			oRm.write(">");

			var oContents = oControl.getContent();
			if (oContents && oContents.length) {
				for (var i = 0; i < oContents.length; i++) {
					oRm.renderControl(oContents[i]);
				}
			}

			oRm.write("</div>"); //Body Content

			oRm.write("</div>");
		}
	},

	resizeView: function () {
		var oControl = this;

		var c_w = oControl.getContainerWidth();
		var i_w = oControl.getSideWidth(c_w);

		var t_h = window.innerHeight;

		$("#" + this.getId() + "_Inner_BodyContent").css("width", window.innerWidth - i_w);
		$("#" + this.getId() + "_Inner_BodyContent").css("height", t_h);

		$("#" + this.getId() + "_Inner_SideWindow").css("height", t_h);

		if (!oControl.getCollapsed()) {
			oControl.enableCollapse();
		}
	},

	getContainerWidth: function () {
		var r_w = 0;
		var c_w = this.getWidth();

		if (c_w.toLowerCase().indexOf("px") != -1) {
			r_w = parseInt(c_w.substring(0, c_w.toLowerCase().indexOf("px")));
		} else if (c_w.toLowerCase().indexOf("%") != -1) {
			var p1 = parseInt(c_w.substring(0, c_w.toLowerCase().indexOf("%")));

			var oParent_width = window.innerWidth;

			if ($(".L2PWindowContainer").parent().width() != null) {
				oParent_width = $(".L2PWindowContainer").parent().width();
			}
			r_w = Math.floor((oParent_width * p1) / 100);
		}
		return r_w;
	},

	getSideWidth: function (c_w) {
		var r_w = 0;
		var i_w = this.getHelpWidth();

		if (i_w.toLowerCase().indexOf("px") != -1) r_w = parseInt(i_w.substring(0, i_w.toLowerCase().indexOf("px")));
		else if (i_w.toLowerCase().indexOf("%") != -1) {
			var p1 = parseInt(i_w.substring(0, i_w.toLowerCase().indexOf("%")));
			r_w = Math.floor((c_w * p1) / 100);
		}
		return r_w;
	}
});

control.HelpWindow.prototype.exit = function () {};
