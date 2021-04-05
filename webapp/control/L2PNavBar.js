/**
 * L2PNavBar
 *
 * @memberOf control.L2PNavBar
 *
 * Create Date : 2015. 09. 01
 * Version : 1.0
 */

jQuery.sap.declare("control.L2PNavBar");

sap.ui.core.Control.extend("control.L2PNavBar", {
	/*
	 * @memberOf control.L2PNavBar
	 */

	_vLeft: 0,
	_vShiftWidth: 70,
	_vMenuWidth: 0,
	_vNavBarWidth: 0,
	_vSelectedItem: {},

	metadata: {
		properties: {
			cssPath: { type: "string", defaultValue: "" },
			items: { type: "any[]" },
			selectedItem: { type: "any" },
			width: { type: "sap.ui.core.CSSSize", defaultValue: "100%" }
		},
		aggregations: {},

		associations: {},

		events: {
			select: {}
		}
	},

	init: function () {},

	onBeforeRendering: function () {
		var domNode = this.getDomRef();
		$(domNode).unbind("select");
	},

	onAfterRendering: function () {
		var oControl = this;

		$(window).resize(function () {
			oControl.showArrow(oControl);
		});

		$(window).click(function (ev) {
			oControl.hidePopup(oControl, ev);
		});

		this.showArrow(this);
	},

	showArrow: function (oControl) {
		var vItems = oControl.getItems();
		if (oControl._vMenuWidth == 0) {
			for (var i = 0; i < vItems.length; i++) {
				oControl._vMenuWidth += $("#" + oControl.getId() + "-inner_NavBarItem_" + i).width();
			}
			oControl._vMenuWidth = oControl._vMenuWidth + vItems.length * 10;
		}

		if ($("#" + this.getId() + "-inner_PopupDiv").css("display") == "block") {
			$("#" + this.getId() + "-inner_PopupDiv").css("display", "none");
		}

		oControl._vNavBarWidth = $("#" + oControl.getId() + "-inner_NavBar").width();

		if (oControl._vNavBarWidth > oControl._vMenuWidth) {
			$("#" + oControl.getId() + "-inner_NavBarItemList").css("left", "0px");
			$("#" + oControl.getId() + "-inner_NavBarItemList").css("right", "0px");
			$(".L2PNavBarBack").css("display", "none");
			$(".L2PNavBarForward").css("display", "none");
			$(".L2PNavBarMenu").css("display", "none");
		} else {
			$("#" + oControl.getId() + "-inner_NavBarItemList").css("left", "0px");
			$("#" + oControl.getId() + "-inner_NavBarItemList").css("right", "75px");
			$(".L2PNavBarBack").css("display", "block");
			$(".L2PNavBarForward").css("display", "block");
			$(".L2PNavBarMenu").css("display", "block");
		}
	},

	hidePopup: function (oControl, oBrowserEvent) {
		var oClickedControlId = oBrowserEvent.target.id;

		if (oClickedControlId.indexOf("_NavBar") == -1) {
			if ($("#" + this.getId() + "-inner_PopupDiv").css("display") == "block") {
				$("#" + this.getId() + "-inner_PopupDiv").css("display", "none");
			}
		}

		if (oClickedControlId.indexOf("inner_NavBarPopupItem_") != -1 || oClickedControlId.indexOf("inner_NavBarPopupList_") != -1) {
			var vItems = this.getItems();
			for (var i = 0; i < vItems.length; i++) {
				$("#" + this.getId() + "-inner_NavBarItem_" + i).removeClass("L2PNavBarItemClick");
			}

			if ($("#" + this.getId() + "-inner_PopupDiv").css("display") == "block") {
				$("#" + this.getId() + "-inner_PopupDiv").css("display", "none");
			}

			var tmp = oClickedControlId.split("_");
			$("#" + this.getId() + "-inner_NavBarItem_" + tmp[tmp.length - 1]).addClass("L2PNavBarItemClick");
			var vItemid = $("#" + this.getId() + "-inner_NavBarItem_" + tmp[tmp.length - 1]).attr("itemid");

			this._vSelectedItem = vItems[parseInt(tmp[tmp.length - 1])];

			this.fireSelect({ itemid: vItemid });
		}
	},

	renderer: {
		render: function (oRm, oControl) {
			var cssPath = oControl.getCssPath();
			jQuery.sap.includeStyleSheet(cssPath + "L2PNavBar.css");

			var vItems = oControl.getItems();

			oControl._vSelectedItem = oControl.getSelectedItem();

			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.addStyle("width", oControl.getWidth());
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<nav id='" + oControl.getId() + "-inner_NavBar' class='L2PNavBar' style='width:100%'>");
			oRm.write("<ul id='" + oControl.getId() + "-inner_NavBarItemList' class='L2PNavBarItemList'>");

			if (vItems && vItems.length) {
				for (var i = 0; i < vItems.length; i++) {
					if (typeof oControl._vSelectedItem == "undefined") {
						if (i == 0) {
							oRm.write(
								"<li class='L2PNavBarItemLi'><span id='" +
									oControl.getId() +
									"-inner_NavBarItem_" +
									i +
									"' itemid='" +
									vItems[i].id +
									"' class='L2PNavBarItem L2PNavBarItemClick'>"
							);
							oRm.write(vItems[i].text);
							oRm.write("</span></li>");
						} else {
							oRm.write(
								"<li class='L2PNavBarItemLi'><span id='" +
									oControl.getId() +
									"-inner_NavBarItem_" +
									i +
									"' itemid='" +
									vItems[i].id +
									"' class='L2PNavBarItem'>"
							);
							oRm.write(vItems[i].text);
							oRm.write("</span></li>");
						}
					} else {
						if (oControl._vSelectedItem.id == vItems[i].id) {
							oRm.write(
								"<li class='L2PNavBarItemLi'><span id='" +
									oControl.getId() +
									"-inner_NavBarItem_" +
									i +
									"' itemid='" +
									vItems[i].id +
									"' class='L2PNavBarItem L2PNavBarItemClick'>"
							);
							oRm.write(vItems[i].text);
							oRm.write("</span></li>");
						} else {
							oRm.write(
								"<li class='L2PNavBarItemLi'><span id='" +
									oControl.getId() +
									"-inner_NavBarItem_" +
									i +
									"' itemid='" +
									vItems[i].id +
									"' class='L2PNavBarItem'>"
							);
							oRm.write(vItems[i].text);
							oRm.write("</span></li>");
						}
					}
				}
			}

			oRm.write("</ul>");

			oRm.write("<span id='" + oControl.getId() + "-inner_NavBarBack' class='L2PNavBarBack L2PNavBarBtnInactive'></span>");
			oRm.write("<span id='" + oControl.getId() + "-inner_NavBarForward' class='L2PNavBarForward L2PNavBarBtnActive'></span>");
			oRm.write("<span id='" + oControl.getId() + "-inner_NavBarMenu' class='L2PNavBarMenu'></span>");

			oRm.write("</nav>");
			oRm.write("</div>");

			oRm.write("<div id='" + oControl.getId() + "-inner_PopupDiv' class='L2PNavBarPopupDiv'>");
			if (vItems && vItems.length) {
				for (var i = 0; i < vItems.length; i++) {
					oRm.write(
						"<div id='" +
							oControl.getId() +
							"-inner_NavBarPopupList_" +
							i +
							"' class='L2PNavBarItemListPopup'><span id='" +
							oControl.getId() +
							"-inner_NavBarPopupItem_" +
							i +
							"' itemid='" +
							vItems[i].id +
							"' class='L2PNavBarItemPopup'>"
					);
					oRm.write(vItems[i].text);
					oRm.write("</span></div>");
				}
			}
			oRm.write("</div>");
		}
	}
});

control.L2PNavBar.prototype.exit = function () {};

control.L2PNavBar.M_EVENTS = { select: "select" };

/**
 * Function is called when button is clicked.
 */
control.L2PNavBar.prototype.onclick = function (oBrowserEvent) {
	//console.log(oBrowserEvent.clientX + ", " + oBrowserEvent.clientY);

	var oClickedControlId = oBrowserEvent.target.id;

	if (oClickedControlId.indexOf("inner_NavBarItem_") != -1) {
		var vItems = this.getItems();
		for (var i = 0; i < vItems.length; i++) {
			$("#" + this.getId() + "-inner_NavBarItem_" + i).removeClass("L2PNavBarItemClick");
		}

		$("#" + oClickedControlId).addClass("L2PNavBarItemClick");
		var vItemid = $("#" + oClickedControlId).attr("itemid");
		this.fireSelect({ itemid: vItemid });

		var tmp = oClickedControlId.split("_");
		this._vSelectedItem = vItems[parseInt(tmp[tmp.length - 1])];
	}

	if (oClickedControlId.indexOf("inner_NavBarForward") != -1) {
		$("#" + this.getId() + "-inner_NavBarBack").removeClass("L2PNavBarBtnInactive");
		$("#" + this.getId() + "-inner_NavBarBack").addClass("L2PNavBarBtnActive");

		if (this._vNavBarWidth < this._vMenuWidth + (this._vLeft - this._vShiftWidth)) {
			this._vLeft = this._vLeft - this._vShiftWidth;
			$("#" + this.getId() + "-inner_NavBarItemList").css("left", this._vLeft + "px");

			if (this._vNavBarWidth >= this._vMenuWidth + (this._vLeft - this._vShiftWidth)) {
				$("#" + this.getId() + "-inner_NavBarForward").addClass("L2PNavBarBtnInactive");
				$("#" + this.getId() + "-inner_NavBarForward").removeClass("L2PNavBarBtnActive");
			}
		} else {
			$("#" + this.getId() + "-inner_NavBarForward").addClass("L2PNavBarBtnInactive");
			$("#" + this.getId() + "-inner_NavBarForward").removeClass("L2PNavBarBtnActive");
		}
	}

	if (oClickedControlId.indexOf("inner_NavBarBack") != -1) {
		$("#" + this.getId() + "-inner_NavBarForward").removeClass("L2PNavBarBtnInactive");
		$("#" + this.getId() + "-inner_NavBarForward").addClass("L2PNavBarBtnActive");

		if (this._vLeft + this._vShiftWidth <= 0) {
			this._vLeft = this._vLeft + this._vShiftWidth;
			$("#" + this.getId() + "-inner_NavBarItemList").css("left", this._vLeft + "px");
			if (this._vLeft == 0) {
				$("#" + this.getId() + "-inner_NavBarBack").addClass("L2PNavBarBtnInactive");
				$("#" + this.getId() + "-inner_NavBarBack").removeClass("L2PNavBarBtnActive");
			}
		} else {
			$("#" + this.getId() + "-inner_NavBarBack").addClass("L2PNavBarBtnInactive");
			$("#" + this.getId() + "-inner_NavBarBack").removeClass("L2PNavBarBtnActive");
		}
	}

	if (oClickedControlId.indexOf("inner_NavBarMenu") != -1) {
		$("#" + this.getId() + "-inner_PopupDiv").css("display", "block");
		$("#" + this.getId() + "-inner_PopupDiv").css("left", oBrowserEvent.clientX - 150 + "px");
		$("#" + this.getId() + "-inner_PopupDiv").css("top", oBrowserEvent.clientY + "px");

		var vItems = this.getItems();
		for (var i = 0; i < vItems.length; i++) {
			if (this._vSelectedItem.id == vItems[i].id) {
				$("#" + this.getId() + "-inner_NavBarPopupItem_" + i).addClass("L2PNavBarItemClick");
			} else {
				$("#" + this.getId() + "-inner_NavBarPopupItem_" + i).removeClass("L2PNavBarItemClick");
			}
		}
	}
};
