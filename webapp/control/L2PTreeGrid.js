/**
 * TreeGrid
 *
 * @memberOf control.L2PTreeGrid
 *
 * Create Date : 2016. 01. 04
 * Version : 1.0
 */

jQuery.sap.declare("control.L2PTreeGrid");

jQuery.sap.require("plugin.jquery_jscrollpane_min");
jQuery.sap.require("plugin.jquery_mousewheel");

sap.ui.core.Control.extend("control.L2PTreeGrid", {
	/*
	 * @memberOf control.L2PTreeGrid
	 */
	nodePool: [],
	nodeSearchPool: [],
	searchIdx: 0,

	minusImage: "minus.gif",
	plusImage: "plus.gif",
	leafImage: "leaf.gif",
	folderOpenImage: "folderOpen.gif",
	folderCloseImage: "folderClosed.gif",

	checkOffImage: "iconUncheckAll.gif",
	checkOnImage: "iconCheckAll.gif",
	radioOffImage: "radio_off.gif",
	radioOnImage: "radio_on.gif",

	metadata: {
		properties: {
			cssPath: { type: "string", defaultValue: "" },
			dataHeight: { type: "sap.ui.core.CSSSize", defaultValue: "30px" },
			data: { type: "any" },
			header: { type: "string[]" },
			columns: { type: "string[]" },
			widths: { type: "string[]" },
			checked: { type: "string", defaultValue: "" },
			width: { type: "sap.ui.core.CSSSize", defaultValue: "100%" },
			height: { type: "sap.ui.core.CSSSize", defaultValue: "100%" }
		},
		aggregations: {},

		associations: {},

		events: {
			press: {},
			select: {},
			dblclick: {}
		}
	},

	init: function () {
		this.nodePool = [];
		this.nodeSearchPool = [];
	},

	onBeforeRendering: function () {
		var domNode = this.getDomRef();
		$(domNode).unbind("select");
		$(domNode).unbind("dblclick");
	},

	onAfterRendering: function () {
		//called after instance has been rendered (it's in the DOM)
		//        	var self = this, domNode = this.getDomRef();
		//            $(domNode).bind('select', function() {
		//                self.fireSelect({
		//                    nodeid: ""
		//                });
		//            });
		//
		//            $(domNode).bind('dblclick', function() {
		//                self.fireDblclick({
		//                    nodeid: ""
		//                });
		//            });

		$(".L2PTreeContainer").jScrollPane({
			autoReinitialise: true,
			mouseWheelSpeed: 1
		});

		$(".L2PTreeContainer").hover(
			function () {
				$(".L2PTreeContainer .jspVerticalBar").animate(
					{
						opacity: 1
					},
					200
				);
			},
			function () {
				$(".L2PTreeContainer .jspVerticalBar").animate(
					{
						opacity: 0
					},
					200
				);
			}
		);
	},

	renderer: {
		render: function (oRm, oControl) {
			var cssPath = oControl.getCssPath();
			jQuery.sap.includeStyleSheet(cssPath + "L2PTree.css");
			jQuery.sap.includeStyleSheet(cssPath + "jquery.jscrollpane.css");

			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.write(">");

			oRm.write("<div ");
			oRm.addStyle("width", oControl.getContainerWidth(oControl) + "px");
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<table cellpadding='0' cellspacing='0' style='width:100%;overflow:hidden'>");
			oRm.write("<thead>");
			oRm.write("<tr style='height:" + oControl.getDataHeight() + ";'>");
			var vHeaders = oControl.getHeader();
			var vWidths = oControl.getWidths();
			if (vHeaders != null) {
				for (var i = 0; i < vHeaders.length; i++) {
					oRm.write("<td class='L2PTreeGridHeaderText' ");
					if (vWidths != null) {
						oRm.write("style='width:" + vWidths[i] + ";'");
					}
					oRm.write(">");
					oRm.write(vHeaders[i]);
					oRm.write("</td>");
				}
			}
			oRm.write("</tr>");
			oRm.write("</thead>");
			oRm.write("</table>");

			oRm.write("</div>");

			oRm.write("<div ");
			oRm.addClass("L2PTreeContainer");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.getContainerWidth(oControl) + "px");
			oRm.addStyle("height", oControl.getContainerHeight(oControl) + "px");
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<div style='position: relative;' ");
			oRm.write(">");

			oRm.write(
				"<table id='" + oControl.getId() + "_innerTreeData' cellpadding='0' cellspacing='0' style='width:100%;overflow:hidden' "
			);
			oRm.addClass("L2PTreeGridData");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("</table>");

			oRm.write("</div>");
			oRm.write("</div>");

			oRm.write("</div>");
		}
	},

	getContainerHeight: function (oControl) {
		var r_h = 0;
		var c_h = oControl.getHeight();

		r_h = $("#" + oControl.getId()).height();

		if (r_h == null) {
			if (c_h.toLowerCase().indexOf("px") != -1) {
				r_h = parseInt(c_h.substring(0, c_h.toLowerCase().indexOf("px")));
			} else if (c_h.toLowerCase().indexOf("%") != -1) {
				var p1 = parseInt(c_h.substring(0, c_h.toLowerCase().indexOf("%")));

				var oParent_height = window.innerHeight;
				if ($(".L2PTreeContainer").parent().height() != null) {
					oParent_height = $(".L2PTreeContainer").parent().height();
				}
				r_h = Math.floor((oParent_height * p1) / 100);
			}
		}
		return r_h;
	},

	getContainerWidth: function (oControl) {
		var r_w = 0;
		var c_w = oControl.getWidth();

		r_w = $("#" + oControl.getId()).width();
		if (r_w == null) {
			if (c_w.toLowerCase().indexOf("px") != -1) {
				r_w = parseInt(c_w.substring(0, c_w.toLowerCase().indexOf("px")));
			} else if (c_w.toLowerCase().indexOf("%") != -1) {
				var p1 = parseInt(c_w.substring(0, c_w.toLowerCase().indexOf("%")));
				var oParent_width = window.innerWidth;
				if ($(".L2PTreeContainer").parent().width() != null) {
					oParent_width = $(".L2PTreeContainer").parent().width();
				}
				r_w = Math.floor((oParent_width * p1) / 100);
			}
		}
		return r_w;
	},

	getTreeDataHeight: function (oControl) {
		var r_w = 0;
		var c_w = oControl.getDataHeight();

		if (c_w.toLowerCase().indexOf("px") != -1) {
			r_w = parseInt(c_w.substring(0, c_w.toLowerCase().indexOf("px")));
		}
		return r_w;
	},

	setSelctedRow: function (nodeid) {
		if (this.nodePool && this.nodePool.length) {
			for (var n = 0; n < this.nodePool.length; n++) {
				var oControlId = "TreeTable_Node_" + this.nodePool[n].nodeid;
				$("#" + oControlId).removeClass("L2PSelectedTreeRow");
			}
		}

		$("#TreeTable_Node_" + nodeid).addClass("L2PSelectedTreeRow");
	},

	setSelctedRowCheckbox: function () {
		if (this.nodePool && this.nodePool.length) {
			for (var n = 0; n < this.nodePool.length; n++) {
				var oControlId = "TreeTable_Node_" + this.nodePool[n].nodeid;
				if (this.nodePool[n].checked == true) {
					$("#" + oControlId).addClass("L2PSelectedTreeRow");
				} else {
					$("#" + oControlId).removeClass("L2PSelectedTreeRow");
				}
			}
		}
	},

	addData: function (nodeid, parentid, data, icon, userData) {
		var isExists = false;

		if (this.nodePool && this.nodePool.length) {
			for (var i = 0; i < this.nodePool.length; i++) {
				if (nodeid == this.nodePool[i].nodeid) {
					isExists = true;
					break;
				}
			}
		}
		if (isExists) {
			console.log("이미 존제하는 Node Id (" + nodeid + ") 입니다.");
			return;
		}

		var vHtml = "";
		vHtml +=
			"<tr class='L2PTreeGridDataTr' id='TreeTable_Node_" +
			nodeid +
			"' " +
			"L2PTree-nodeid='" +
			nodeid +
			"' " +
			"L2PTree-parentid='" +
			parentid +
			"' " +
			"style='height:" +
			this.getDataHeight() +
			";' " +
			">";

		vHtml += "<td class='L2PTreeGridDataTreeCell'>";

		vHtml += "<table style='' cellspacing='0' cellpadding='0'>";
		vHtml += "<tr>";

		var level = 0;
		if (parentid == "" || parentid == "0") {
			level = 1;
		} else {
			if (this.nodePool && this.nodePool.length) {
				for (var i = 0; i < this.nodePool.length; i++) {
					if (parentid == this.nodePool[i].nodeid) {
						level = this.nodePool[i].level + 1;
						break;
					}
				}
			}
		}

		for (var j = 0; j < level - 1; j++) {
			vHtml += "<td style='padding-left:18px;'></td>";
		}

		var vIconImage = this.getCssPath() + "/l2ptree/" + this.leafImage;
		if (typeof icon != "undefined" && icon != "") {
			vIconImage = this.getCssPath() + "/l2ptree/" + icon;
		}

		vHtml +=
			"<td style='width:18px;'><img id='TreeTable_TreeImg_" +
			nodeid +
			"' src='" +
			this.getCssPath() +
			"/l2ptree/" +
			this.minusImage +
			"' style='visibility:hidden; cursor:pointer'></td>";
		if (this.getChecked() == "radio") {
			vHtml +=
				"<td style='width:18px;'><img id='TreeTable_CheckImg_" +
				nodeid +
				"' src='" +
				this.getCssPath() +
				"/l2ptree/" +
				this.radioOffImage +
				"' style=''></td>";
		} else if (this.getChecked() == "checkbox") {
			vHtml +=
				"<td style='width:18px;'><img id='TreeTable_CheckImg_" +
				nodeid +
				"' src='" +
				this.getCssPath() +
				"/l2ptree/" +
				this.checkOffImage +
				"' style=''></td>";
		}

		vHtml += "<td style='width:18px;'><img id='TreeTable_IconImg_" + nodeid + "' src='" + vIconImage + "' style=''></td>";

		var vColumns = this.getColumns();

		var vTmp1 = eval("data." + vColumns[0]);
		vHtml +=
			"<td nowrap><div class='L2PTreeDataTreeText' id='TreeTable_TreeItem_" +
			nodeid +
			"' style='cursor:pointer;line-height:" +
			this.getDataHeight() +
			";' >" +
			vTmp1 +
			"</div></td>";

		vHtml += "</tr>";
		vHtml += "</table>";

		vHtml += "</td>";

		for (var i = 1; i < vColumns.length; i++) {
			vHtml += "<td class='L2PTreeGridDataText'>";
			var vTmp2 = eval("data." + vColumns[i]);
			vHtml += vTmp2;
			vHtml += "</td>";
		}

		vHtml += "</tr>";

		if (parentid == "" || parentid == "0") {
			$(vHtml).appendTo(".L2PTreeGridData");
		} else {
			var tmp = $(".L2PTreeGridDataTr");
			var parent_nodeid = "";

			if (tmp && tmp.length) {
				for (var i = 0; i < tmp.length; i++) {
					var nid = $(tmp[i]).attr("L2PTree-nodeid");
					if (nid == parentid) {
						parent_nodeid = $(tmp[i]).attr("id");
						break;
					}
				}
			}

			var last_nodeid = "";
			if (this.nodePool && this.nodePool.length) {
				for (var n = 0; n < this.nodePool.length; n++) {
					if (parentid == this.nodePool[n].parentid) {
						last_nodeid = this.nodePool[n].nodeid;
					}
				}
			}

			if (parent_nodeid != "") {
				$("#TreeTable_TreeImg_" + parentid).css("visibility", "visible");
				$("#TreeTable_IconImg_" + parentid).attr("src", this.getCssPath() + "/l2ptree/" + this.folderOpenImage);
				if (last_nodeid == "") {
					$("#" + parent_nodeid).after(vHtml);
				} else {
					$("#TreeTable_Node_" + last_nodeid).after(vHtml);
				}
			}
		}

		var vAllParentId = parentid;

		var getParent = function (nodePool, vnodeid) {
			var ret = "";
			if (nodePool && nodePool.length) {
				for (var i = 0; i < nodePool.length; i++) {
					if (vnodeid == nodePool[i].nodeid) {
						ret = nodePool[i].parentid;
						break;
					}
				}
			}
			return ret;
		};

		var t_parentid = parentid;
		for (;;) {
			var tParentId = getParent(this.nodePool, t_parentid);
			if (tParentId == "" || tParentId == "0") {
				break;
			}
			vAllParentId += "," + tParentId;
			t_parentid = tParentId;
		}

		var nodeInfo = {
			nodeid: nodeid,
			data: data,
			parentid: parentid,
			allparentid: vAllParentId,
			level: level,
			userData: userData,
			visible: true,
			checked: false
		};

		var getParentIdx = function (nodePool, nodeid, parentid) {
			var ret = -1;
			if (nodePool && nodePool.length) {
				for (var i = 0; i < nodePool.length; i++) {
					if (parentid == nodePool[i].parentid) {
						ret = i;
					}
				}

				if (ret == -1) {
					for (var i = 0; i < nodePool.length; i++) {
						if (parentid == nodePool[i].nodeid) {
							ret = i;
							break;
						}
					}
				}
			}
			return ret;
		};

		var p_idx = getParentIdx(this.nodePool, nodeid, parentid);
		if (p_idx == -1) {
			this.nodePool.push(nodeInfo);
		} else {
			this.nodePool.splice(p_idx + 1, 0, nodeInfo);
		}
	},

	JSONtoString: function (object) {
		var results = [];
		for (var property in object) {
			var value = object[property];
			if (value) results.push(value);
		}

		return "{" + results.join(", ") + "}";
	},

	openNode: function (nodeid) {
		var visible = true;
		var allparentid = "";
		var parentid = "";

		if (this.nodePool && this.nodePool.length) {
			for (var i = 0; i < this.nodePool.length; i++) {
				if (nodeid == this.nodePool[i].nodeid) {
					visible = this.nodePool[i].visible;
					allparentid = this.nodePool[i].allparentid;
					parentid = this.nodePool[i].parentid;
					if (visible == false) {
						this.nodePool[i].visible = true;
					}
					break;
				}
			}
		}
		console.log(allparentid);
		if (visible == false) {
			$("#TreeTable_TreeImg_" + nodeid).attr("src", this.getCssPath() + "/l2ptree/" + this.minusImage);
			$("#TreeTable_Node_" + nodeid).css("display", "");

			$("#TreeTable_TreeImg_" + parentid).attr("src", this.getCssPath() + "/l2ptree/" + this.minusImage);

			if (this.nodePool && this.nodePool.length) {
				for (var n = 0; n < this.nodePool.length; n++) {
					if (parentid == this.nodePool[n].parentid) {
						$("#TreeTable_TreeImg_" + this.nodePool[n].nodeid).attr("src", this.getCssPath() + "/l2ptree/" + this.minusImage);
						$("#TreeTable_Node_" + this.nodePool[n].nodeid).css("display", "");
						this.nodePool[n].visible = true;
					}
				}

				var all_parentids = allparentid.split(",");
				if (all_parentids && all_parentids.length) {
					for (var p = 0; p < all_parentids.length; p++) {
						var p_visible = false;
						for (var n = 0; n < this.nodePool.length; n++) {
							if (all_parentids[p] == this.nodePool[n].nodeid) {
								if (this.nodePool[n].visible == true) {
									p_visible = true;
									break;
								} else {
									$("#TreeTable_TreeImg_" + this.nodePool[n].nodeid).attr(
										"src",
										this.getCssPath() + "/l2ptree/" + this.minusImage
									);
									$("#TreeTable_Node_" + this.nodePool[n].nodeid).css("display", "");
									this.nodePool[n].visible = true;
								}
							}
						}
						if (p_visible == true) {
							break;
						}
					}
				}
			}
		}
	}
});

control.L2PTreeGrid.M_EVENTS = { press: "press", select: "select", dblclick: "dblclick" };

control.L2PTreeGrid.prototype.exit = function () {};

control.L2PTreeGrid.prototype.addNode = function (nodeid, parentid, text, icon, userData) {
	this.addData(nodeid, parentid, text, icon, userData);
	return;
};

control.L2PTreeGrid.prototype.hasChildNode = function (nodeid) {
	var ret = false;
	if (this.nodePool && this.nodePool.length) {
		for (var n = 0; n < this.nodePool.length; n++) {
			if (this.nodePool[n].parentid == nodeid) {
				ret = true;
				break;
			}
		}
	}
	return ret;
};

control.L2PTreeGrid.prototype.getUserData = function (nodeid) {
	var retData = null;
	if (this.nodePool && this.nodePool.length) {
		for (var n = 0; n < this.nodePool.length; n++) {
			if (this.nodePool[n].nodeid == nodeid) {
				retData = this.nodePool[n].userData;
				break;
			}
		}
	}
	return retData;
};

control.L2PTreeGrid.prototype.getText = function (nodeid) {
	var retData = null;
	if (this.nodePool && this.nodePool.length) {
		for (var n = 0; n < this.nodePool.length; n++) {
			if (this.nodePool[n].nodeid == nodeid) {
				retData = this.nodePool[n].text;
				break;
			}
		}
	}
	return retData;
};

control.L2PTreeGrid.prototype.setSelectNode = function (nodeid) {
	this.setSelctedRow(nodeId);
	this.fireSelect({ nodeid: nodeid });
};

control.L2PTreeGrid.prototype.findText = function (sVal) {
	this.nodeSearchPool = [];
	if (this.nodePool && this.nodePool.length) {
		for (var n = 0; n < this.nodePool.length; n++) {
			var vVals = this.JSONtoString(this.nodePool[n].data);
			if (vVals.toLowerCase().indexOf(sVal.toLowerCase()) != -1) {
				this.nodeSearchPool.push(this.nodePool[n]);
			}
		}
	}

	if (this.nodeSearchPool.length > 0) {
		this.setSelctedRow(this.nodeSearchPool[this.searchIdx].nodeid);

		this.searchIdx = 0;
		this.openNode(this.nodeSearchPool[this.searchIdx].nodeid);
		this.fireSelect({ nodeid: this.nodeSearchPool[this.searchIdx].nodeid });

		jsapi = $(".L2PTreeContainer").data("jsp");
		jsapi.scrollToElement("#TreeTable_Node_" + this.nodeSearchPool[this.searchIdx].nodeid, "0s");
	} else {
		if (this.nodePool && this.nodePool.length) {
			for (var n = 0; n < this.nodePool.length; n++) {
				var oControlId = "TreeTable_Node_" + this.nodePool[n].nodeid;
				$("#" + oControlId).removeClass("L2PSelectedTreeRow");
			}
		}
	}
};

control.L2PTreeGrid.prototype.findNextText = function (sVal) {
	this.nodeSearchPool = [];
	if (this.nodePool && this.nodePool.length) {
		for (var n = 0; n < this.nodePool.length; n++) {
			var vVals = this.JSONtoString(this.nodePool[n].data);
			if (vVals.toLowerCase().indexOf(sVal.toLowerCase()) != -1) {
				this.nodeSearchPool.push(this.nodePool[n]);
			}
		}
	}

	if (this.nodeSearchPool.length > 0) {
		this.searchIdx = this.searchIdx + 1;
		if (this.searchIdx > this.nodeSearchPool.length - 1) this.searchIdx = 0;

		this.openNode(this.nodeSearchPool[this.searchIdx].nodeid);
		this.setSelctedRow(this.nodeSearchPool[this.searchIdx].nodeid);
		this.fireSelect({ nodeid: this.nodeSearchPool[this.searchIdx].nodeid });

		jsapi = $(".L2PTreeContainer").data("jsp");
		jsapi.scrollToElement("#TreeTable_Node_" + this.nodeSearchPool[this.searchIdx].nodeid, "0s");
	}
};

control.L2PTreeGrid.prototype.findPrevText = function (sVal) {
	this.nodeSearchPool = [];
	if (this.nodePool && this.nodePool.length) {
		for (var n = 0; n < this.nodePool.length; n++) {
			var vVals = this.JSONtoString(this.nodePool[n].data);
			if (vVals.toLowerCase().indexOf(sVal.toLowerCase()) != -1) {
				this.nodeSearchPool.push(this.nodePool[n]);
			}
		}
	}

	if (this.nodeSearchPool.length > 0) {
		this.searchIdx = this.searchIdx - 1;
		if (this.searchIdx < 0) this.searchIdx = this.nodeSearchPool.length - 1;

		this.openNode(this.nodeSearchPool[this.searchIdx].nodeid);
		this.setSelctedRow(this.nodeSearchPool[this.searchIdx].nodeid);
		this.fireSelect({ nodeid: this.nodeSearchPool[this.searchIdx].nodeid });

		jsapi = $(".L2PTreeContainer").data("jsp");
		jsapi.scrollToElement("#TreeTable_Node_" + this.nodeSearchPool[this.searchIdx].nodeid, "0s");
	}
};

control.L2PTreeGrid.prototype.removeData = function () {
	this.nodePool = [];
	this.sumPool = [];

	$(".L2PTreeDataTr").remove();
	$(".L2PTreeData").empty();
};

control.L2PTreeGrid.prototype.closeAllNode = function () {
	if (this.nodePool && this.nodePool.length) {
		for (var n = 0; n < this.nodePool.length; n++) {
			var oControlId = "TreeTable_Node_" + this.nodePool[n].nodeid;
			if (this.nodePool[n].level == 1) {
				$("#TreeTable_TreeImg_" + this.nodePool[n].nodeid).attr("src", this.getCssPath() + "/l2ptree/" + this.plusImage);
				$("#TreeTable_IconImg_" + this.nodePool[n].nodeid).attr("src", this.getCssPath() + "/l2ptree/" + this.folderCloseImage);
			} else {
				$("#" + oControlId).css("display", "none");
				this.nodePool[n].visible = false;
			}
		}
	}
};

control.L2PTreeGrid.prototype.getCheckedNode = function () {
	var retData = [];
	if (this.nodePool && this.nodePool.length) {
		for (var n = 0; n < this.nodePool.length; n++) {
			if (this.nodePool[n].checked == true) {
				retData.push(this.nodePool[n].nodeid);
			}
		}
	}
	return retData;
};

control.L2PTreeGrid.prototype.setCheckedShow = function (nodeid, show) {
	var vDisplay = "";
	if (show) vDisplay = "visible";
	else vDisplay = "hidden";
	$("#TreeTable_CheckImg_" + nodeid).css("visibility", vDisplay);
};

control.L2PTreeGrid.prototype.closeNode = function (nodeid) {
	$("#TreeTable_TreeImg_" + nodeid).attr("src", this.getCssPath() + "/l2ptree/" + this.plusImage);
	$("#TreeTable_IconImg_" + nodeid).attr("src", this.getCssPath() + "/l2ptree/" + this.folderCloseImage);

	if (this.nodePool && this.nodePool.length) {
		for (var n = 0; n < this.nodePool.length; n++) {
			if (this.nodePool[n].allparentid.indexOf(nodeid) != -1) {
				var oControlId = "TreeTable_Node_" + this.nodePool[n].nodeid;

				$("#" + oControlId).css("display", "none");
				this.nodePool[n].visible = false;
			}
		}
	}
};

control.L2PTreeGrid.prototype.ondblclick = function (oBrowserEvent) {
	var oClickedControlId = oBrowserEvent.target.id;
	var nodeId = "";
	var t1 = oClickedControlId.split("_");
	nodeId = t1[t1.length - 1];

	if (oClickedControlId.indexOf("TreeTable_TreeItem_") != -1) {
		if (this.nodePool && this.nodePool.length) {
			for (var n = 0; n < this.nodePool.length; n++) {
				var oControlId = "TreeTable_TreeItem_" + this.nodePool[n].nodeid;
				$("#" + oControlId).removeClass("L2PSelectedTreeRow");
			}
		}
		$("#TreeTable_TreeItem_" + nodeId).addClass("L2PSelectedTreeRow");
		this.fireDblclick({ nodeid: nodeId });
	}
};

/**
 * Function is called when button is clicked.
 */
control.L2PTreeGrid.prototype.onclick = function (oBrowserEvent) {
	var oClickedControlId = oBrowserEvent.target.id;
	var nodeId = "";
	var t1 = oClickedControlId.split("_");
	nodeId = t1[t1.length - 1];

	if (oClickedControlId.indexOf("TreeTable_TreeItem_") != -1) {
		//    		if(this.nodePool && this.nodePool.length) {
		//    			for(var n=0; n<this.nodePool.length; n++) {
		//    				var oControlId = "TreeTable_TreeItem_" + this.nodePool[n].nodeid;
		//    				$("#" + oControlId).removeClass("L2PSelectedTreeRow");
		//    			}
		//    		}
		//    		$("#TreeTable_TreeItem_" + nodeId).addClass("L2PSelectedTreeRow");
		this.setSelctedRow(nodeId);
		this.fireSelect({ nodeid: nodeId });
	}

	var nodePool = this.nodePool;
	var setChecked = function (nodeid, checked) {
		if (nodePool && nodePool.length) {
			for (var n = 0; n < nodePool.length; n++) {
				if (nodeid == nodePool[n].nodeid) {
					nodePool[n].checked = checked;
					break;
				}
			}
		}
	};

	if (oClickedControlId.indexOf("TreeTable_CheckImg_") != -1) {
		var vCheckImage = $("#" + oClickedControlId).attr("src");
		if (this.getChecked() == "radio") {
			if (vCheckImage.indexOf(this.radioOffImage) != -1) {
				if (this.nodePool && this.nodePool.length) {
					for (var n = 0; n < this.nodePool.length; n++) {
						this.nodePool[n].checked = false;
						$("#TreeTable_CheckImg_" + this.nodePool[n].nodeid).attr(
							"src",
							this.getCssPath() + "/l2ptree/" + this.radioOffImage
						);
					}
				}
				$("#" + oClickedControlId).attr("src", this.getCssPath() + "/l2ptree/" + this.radioOnImage);
				setChecked(nodeId, true);
				this.setSelctedRow(nodeId);
			} else {
				$("#" + oClickedControlId).attr("src", this.getCssPath() + "/l2ptree/" + this.radioOffImage);
				setChecked(nodeId, false);
			}
		} else if (this.getChecked() == "checkbox") {
			if (vCheckImage.indexOf(this.checkOffImage) != -1) {
				$("#" + oClickedControlId).attr("src", this.getCssPath() + "/l2ptree/" + this.checkOnImage);
				setChecked(nodeId, true);
				this.setSelctedRowCheckbox();
			} else {
				$("#" + oClickedControlId).attr("src", this.getCssPath() + "/l2ptree/" + this.checkOffImage);
				setChecked(nodeId, false);
				this.setSelctedRowCheckbox();
			}
		}
	}

	if (oClickedControlId.indexOf("TreeTable_TreeImg_") != -1) {
		var tmp = $(".L2PTreeGridDataTr");

		var vSrc = $("#" + oClickedControlId).attr("src");

		if (vSrc.indexOf("minus") != -1) {
			$("#" + oClickedControlId).attr("src", this.getCssPath() + "/l2ptree/" + this.plusImage);
			$("#TreeTable_IconImg_" + nodeId).attr("src", this.getCssPath() + "/l2ptree/" + this.folderCloseImage);

			if (tmp && tmp.length) {
				for (var i = 0; i < tmp.length; i++) {
					var vnodeid = $(tmp[i]).attr("L2PTree-nodeid");

					if (this.nodePool && this.nodePool.length) {
						for (var n = 0; n < this.nodePool.length; n++) {
							if (vnodeid == this.nodePool[n].nodeid) {
								if (this.nodePool[n].allparentid.indexOf(nodeId) != -1) {
									var aDisplay = $(tmp[i]).css("display");
									if (aDisplay != "none") {
										$(tmp[i]).css("display", "none");
									}
									this.nodePool[n].visible = false;
								}
								break;
							}
						}
					}
				}
			}
		} else {
			$("#" + oClickedControlId).attr("src", this.getCssPath() + "/l2ptree/" + this.minusImage);
			$("#TreeTable_IconImg_" + nodeId).attr("src", this.getCssPath() + "/l2ptree/" + this.folderOpenImage);

			if (tmp && tmp.length) {
				for (var i = 0; i < tmp.length; i++) {
					var vnodeid = $(tmp[i]).attr("L2PTree-nodeid");
					if (this.nodePool && this.nodePool.length) {
						for (var n = 0; n < this.nodePool.length; n++) {
							if (vnodeid == this.nodePool[n].nodeid) {
								if (this.nodePool[n].parentid == nodeId) {
									var aDisplay = $(tmp[i]).css("display");
									if (aDisplay == "none") {
										$(tmp[i]).css("display", "");
									}
									this.nodePool[n].visible = true;

									var vIconImage = $("#TreeTable_IconImg_" + this.nodePool[n].nodeid).attr("src");
									if (vIconImage.indexOf(this.folderOpenImage) != -1) {
										$("#TreeTable_TreeImg_" + this.nodePool[n].nodeid).attr(
											"src",
											this.getCssPath() + "/l2ptree/" + this.plusImage
										);
										$("#TreeTable_IconImg_" + this.nodePool[n].nodeid).attr(
											"src",
											this.getCssPath() + "/l2ptree/" + this.folderCloseImage
										);
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
