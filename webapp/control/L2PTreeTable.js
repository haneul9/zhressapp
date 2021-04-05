/**
 * TreeTable
 *
 * @memberOf control.TreeTable
 *
 * Create Date : 2015. 03. 27
 * Version : 1.0
 */

jQuery.sap.declare("control.L2PTreeTable");

jQuery.sap.require("plugin.jquery_jscrollpane_min");
jQuery.sap.require("plugin.jquery_mousewheel");

sap.ui.core.Control.extend("control.L2PTreeTable", {
	/*
	 * @memberOf control.TreeTable
	 */
	nodePool: [],
	sumPool: [],
	t_w: 0,
	i_w: 0,
	c_w: 0,
	t_h: 0,
	c_h: 0,
	d_h: 0,

	minusImage: "images/minus.gif",
	plusImage: "images/plus.gif",
	leafImage: "images/leaf.gif",
	folderOpenImage: "images/folderOpen.gif",
	folderCloseImage: "images/folderClosed.gif",

	metadata: {
		properties: {
			cssPath: { type: "string", defaultValue: "" },
			headerHeight: { type: "sap.ui.core.CSSSize", defaultValue: "35px" },
			dataHeight: { type: "sap.ui.core.CSSSize", defaultValue: "35px" },
			header: { type: "string[]" },
			subHeader: { type: "string[][]" },
			columnWidths: { type: "string[]" },
			columnTypes: { type: "string[]" },
			columnIds: { type: "string[]" },
			sum: { type: "boolean", defaultValue: true },
			itemWidth: { type: "sap.ui.core.CSSSize", defaultValue: "150px" },

			parentColumn: { type: "string" },
			idColumn: { type: "string" },

			data: { type: "any" },

			width: { type: "sap.ui.core.CSSSize", defaultValue: "100%" },
			height: { type: "sap.ui.core.CSSSize", defaultValue: "100%" }
		},
		aggregations: {},

		associations: {},

		events: {
			press: {},
			select: {},
			dataSelect: {}
		}
	},

	init: function () {
		this.nodePool = [];

		//sap.ui.getCore().getEventBus().subscribe("app", "ResizeWindow", this.resizeView, this);
	},

	onBeforeRendering: function () {
		var domNode = this.getDomRef();
		$(domNode).unbind("select");
		$(domNode).unbind("dataSelect");
	},

	onAfterRendering: function () {
		var vData = this.getData();
		if (vData && vData.length) {
			for (var i = 0; i < vData.length; i++) {
				this.addData(vData[i].nodeid, vData[i].parentid, vData[i].level, vData[i].data);
			}
		}

		//called after instance has been rendered (it's in the DOM)
		var self = this,
			domNode = this.getDomRef();
		$(domNode).bind("select", function () {
			self.fireSelect({
				nodeid: ""
			});
		});

		$(domNode).bind("dataSelect", function () {
			self.fireSelect({
				nodeid: "",
				dataField: "",
				level: ""
			});
		});

		$(".L2PTreeTableDataBody").jScrollPane({
			autoReinitialise: true,
			mouseWheelSpeed: 1
		});

		$(".L2PTreeTableDataBody").hover(
			function () {
				$(".L2PTreeTableDataBody .jspVerticalBar").animate(
					{
						opacity: 1
					},
					200
				);
			},
			function () {
				$(".L2PTreeTableDataBody .jspVerticalBar").animate(
					{
						opacity: 0
					},
					200
				);
			}
		);

		this.resizeView();
	},

	resizeView: function () {
		console.log("resizeView");

		var oControl = this;

		var header = this.getHeader();
		var subheader = this.getSubHeader();

		oControl.t_w = oControl.getContainerWidth(oControl);
		oControl.i_w = oControl.getTreeWidth(oControl, oControl.t_w);

		oControl.c_w = Math.floor((oControl.t_w - oControl.i_w) / (header.length - 1)) - 1;

		oControl.t_w = oControl.i_w + (oControl.c_w + 1) * (header.length - 1);
		oControl.t_w = oControl.t_w + 16;

		$(".L2PTreeTableContainer").css("width", oControl.t_w + "px");
		$(".L2PTreeTableDataBody").css("width", oControl.t_w + "px");

		$(".L2PTreeTableHeaderCell").css("width", oControl.c_w + "px");
		$(".L2PTreeTableDataCell").css("width", oControl.c_w + "px");

		oControl.t_h = oControl.getContainerHeight(oControl);
		oControl.d_h = oControl.t_h - (2 + subheader.length) * oControl.c_h;

		var visible_cnt = 0;
		for (var n = 0; n < this.nodePool.length; n++) {
			if (this.nodePool[n].visible) visible_cnt++;
		}

		if (visible_cnt * oControl.c_h < oControl.d_h) {
			$(".L2PTreeTableDataBody").css("height", visible_cnt * oControl.c_h + "px");
		} else {
			$(".L2PTreeTableDataBody").css("height", oControl.d_h + "px");
		}

		$(".jspContainer").css("width", oControl.t_w + "px");
	},

	renderer: {
		render: function (oRm, oControl) {
			var cssPath = oControl.getCssPath();
			jQuery.sap.includeStyleSheet(cssPath + "L2PTreeTable.css");
			jQuery.sap.includeStyleSheet(cssPath + "jquery.jscrollpane.css");

			var header = oControl.getHeader();
			var columnWidths = oControl.getColumnWidths();
			var subheader = oControl.getSubHeader();

			for (var i = 0; i < header.length; i++) {
				oControl.sumPool.push(0);
			}

			oControl.t_w = oControl.getContainerWidth(oControl);
			oControl.i_w = oControl.getTreeWidth(oControl, oControl.t_w);
			oControl.t_h = oControl.getContainerHeight(oControl);
			oControl.c_h = oControl.getTreeDataHeight(oControl);

			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.addClass("L2PTreeTableContainer");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.t_w + "px");
			oRm.addStyle("height", oControl.t_h + "px");
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<table id='" + oControl.getId() + "_innerTableHeader' cellpadding='0' cellspacing='0' style='' ");
			oRm.addClass("L2PTreeTableHeader");
			oRm.writeClasses();
			oRm.write(">");

			if (header && header.length) {
				oControl.c_w = Math.floor((oControl.t_w - oControl.i_w) / (header.length - 1)) - 1;

				oRm.write("<tr ");
				oRm.addStyle("height", oControl.getHeaderHeight());
				oRm.writeStyles();
				oRm.write(">");

				for (var i = 0; i < header.length; i++) {
					if (header[i] == "#CSPAN" || header[i] == "#RSPAN") continue;

					oRm.write("<th align='center' id='" + oControl.getId() + "_h" + (i + 1) + "' ");
					oRm.addClass("L2PTreeTableHeaderCell");
					oRm.addClass("L2PTreeTableHeaderCellTop");
					if (i == 0) oRm.addClass("L2PTreeTableHeaderLeft");
					else if (i == header.length - 1) oRm.addClass("L2PTreeTableHeaderCellRight");
					oRm.writeClasses();

					var colSpan = oControl.getColSpan(i, header);
					oRm.write(" colspan='" + colSpan + "'");
					oRm.write(" rowspan='" + oControl.getRowSpan(i, 0, subheader) + "'");
					oRm.write(">");

					oRm.write("<div ");
					if (columnWidths && i < columnWidths.length) {
						oRm.addStyle("width", columnWidths[i]);
						oRm.writeStyles();
					} else {
						if (i == 0) {
							oRm.addStyle("width", oControl.getItemWidth());
							oRm.writeStyles();
						} else {
							oRm.addClass("L2PTreeTableHeaderCellData");
							oRm.writeClasses();
							oRm.addStyle("text-align", "center");
							oRm.writeStyles();
							oRm.addStyle("width", "100%");
							oRm.writeStyles();
							//                        		oRm.addStyle("width", (oControl.c_w * colSpan) + "px");
							//                                oRm.writeStyles();
						}
					}
					oRm.write(">");
					oRm.write(header[i]);
					oRm.write("</div>");

					oRm.write("</th>");
				}
				oRm.write("</tr>");

				if (subheader && subheader.length) {
					for (var i = 0; i < subheader.length; i++) {
						oRm.write("<tr ");
						oRm.addStyle("height", oControl.getHeaderHeight());
						oRm.writeStyles();
						oRm.write(">");

						for (var j = 0; j < subheader[i].length; j++) {
							if (subheader[i][j] == "#CSPAN" || subheader[i][j] == "#RSPAN") continue;

							oRm.write("<th align='center' ");
							oRm.addClass("L2PTreeTableHeaderCell");
							if (j == 0) oRm.addClass("L2PTreeTableHeaderLeftCell");
							else if (j == subheader[i].length - 1) oRm.addClass("L2PTreeTableHeaderRightCell");
							oRm.writeClasses();

							var colSpan2 = oControl.getColSpan(j, subheader[i]);
							oRm.write(" colspan='" + colSpan2 + "'");
							oRm.write(" rowspan='" + oControl.getRowSpan(j, i + 1, subheader) + "'");
							oRm.write(">");

							oRm.write("<div style='text-align:center' ");
							if (columnWidths && j < columnWidths.length) {
								oRm.addStyle("width", columnWidths[j]);
								oRm.writeStyles();
							} else {
								oRm.addClass("L2PTreeTableHeaderCellData");
								oRm.writeClasses();
								oRm.addStyle("text-align", "center");
								oRm.writeStyles();
								oRm.addStyle("width", "100%");
								oRm.writeStyles();
								//                                	oRm.addStyle("width", (oControl.c_w * colSpan2) + "px");
								//                                    oRm.writeStyles();
							}
							oRm.write(">");
							oRm.write(subheader[i][j]);
							oRm.write("</div>");

							oRm.write("</th>");
						}
						oRm.write("</tr>");
					}
					oRm.write("</thead>");
				}
			}
			oRm.write("</table>");

			var scrollHtml = "<div ";
			scrollHtml += "class='L2PTreeTableDataBody' ";
			scrollHtml += "style='";
			scrollHtml += "width:" + oControl.t_w + "px;";
			scrollHtml += "left:0px;";
			scrollHtml += "top:" + oControl.c_h * 3 + "px;";
			//scrollHtml += "height: " + oControl.t_h + "px;";
			scrollHtml += "' >";
			oRm.write(scrollHtml);

			oRm.write("<table id='" + oControl.getId() + "_innerTableData' cellpadding='0' cellspacing='0' style='' ");
			oRm.addClass("L2PTreeTableData");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("</table>");
			oRm.write("</div>");

			oRm.write("<table id='" + oControl.getId() + "_innerTableSumData' cellpadding='0' cellspacing='0' style='' ");
			oRm.addClass("L2PTreeTableSumData");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("</table>");

			oRm.write("</div>");
		}
	},

	getColSpan: function (idx, datas) {
		var i,
			colspan = 1;
		for (i = idx + 1; i < datas.length; i++) {
			if (datas[i] != "#CSPAN") break;
			colspan++;
		}
		return colspan;
	},

	getRowSpan: function (idx, row_idx, datas) {
		var rowspan = 1;
		if (!datas) return 1;

		for (var i = row_idx; i < datas.length; i++) {
			if (!datas[i][idx]) return 1;
			else {
				if (datas[i][idx] == "#RSPAN") rowspan++;
				else break;
			}
		}
		return rowspan;
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
				if ($(".L2PTreeTableContainer").parent().height() != null) {
					oParent_height = $(".L2PTreeTableContainer").parent().height();
				}
				r_h = Math.floor((oParent_height * p1) / 100);
			}
		}
		console.log("Tree Table Height : " + r_h);
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
				if ($(".L2PTreeTableContainer").parent().width() != null) {
					oParent_width = $(".L2PTreeTableContainer").parent().width();
				}
				r_w = Math.floor((oParent_width * p1) / 100);
			}
		}
		console.log("Tree Table Width : " + r_w);
		return r_w;
	},

	getTreeWidth: function (oControl, t_w) {
		var r_w = 0;
		var c_w = oControl.getItemWidth();

		if (c_w.toLowerCase().indexOf("px") != -1) {
			r_w = parseInt(c_w.substring(0, c_w.toLowerCase().indexOf("px")));
		} else if (c_w.toLowerCase().indexOf("%") != -1) {
			var p1 = parseInt(c_w.substring(0, c_w.toLowerCase().indexOf("%")));
			r_w = Math.floor((t_w * p1) / 100);
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

	addData: function (nodeid, parentid, level, data) {
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

		var oColumnIds = this.getColumnIds();
		var oColumnTypes = this.getColumnTypes();

		var vHtml = "";
		vHtml +=
			"<tr class='L2PTreeTableDataTr' id='TreeTable_Node_" +
			nodeid +
			"' " +
			"l2ptreetable-nodeid='" +
			nodeid +
			"' " +
			"l2ptreetable-parentid='" +
			parentid +
			"' " +
			"style='height:" +
			this.getDataHeight() +
			";' " +
			">";
		if (oColumnIds && oColumnIds.length) {
			for (var i = 0; i < oColumnIds.length; i++) {
				var dataValue = eval("data." + oColumnIds[i]);
				if (oColumnTypes[i] == "TreeItem") {
					vHtml += "<td class='L2PTreeTableDataTreeCell'><div style='width:" + this.i_w + "px;'>";

					vHtml += "<table style='width:100% cellspacing='0' cellpadding='0'>";
					vHtml += "<tr>";
					for (var j = 0; j < level; j++) {
						if (j == 0) vHtml += "<td><span class='L2PTreeTablePadding10'></span></td>";
						else {
							vHtml += "<td><span class='L2PTreeTablePadding10'></span></td>";
							vHtml += "<td><span class='L2PTreeTablePadding10'></span></td>";
						}
					}
					vHtml +=
						"<td><img id='TreeTable_TreeImg_" +
						nodeid +
						"' src='" +
						this.minusImage +
						"' style='visibility:hidden; cursor:pointer'></td>";
					vHtml += "<td><img id='TreeTable_IconImg_" + nodeid + "' src='" + this.leafImage + "' style=''></td>";
					vHtml += "<td><div id='TreeTable_TreeItem_" + nodeid + "' style='cursor:pointer'>" + dataValue + "</div></td>";
					vHtml += "</tr></table>";
					vHtml += "</div></td>";
				} else if (oColumnTypes[i] == "number") {
					if (i < oColumnIds.length - 1) {
						vHtml += "<td class='L2PTreeTableDataCell'>";
					} else {
						vHtml += "<td class='L2PTreeTableDataCell L2PTreeTableHeaderCellRight'>";
					}
					vHtml +=
						"<div id='L2PTreeTable-Data_" +
						nodeid +
						"_" +
						oColumnIds[i] +
						"' class='L2PTreeTableNumberData' nodeid='" +
						nodeid +
						"' fieldid='" +
						oColumnIds[i] +
						"' level='" +
						level +
						"'>";
					vHtml += dataValue + "<span class='L2PTreeTablePadding5'></span></div></td>";

					if (parentid == "" || parentid == "0000") {
						if (dataValue != "" && !isNaN(dataValue)) {
							this.sumPool[i] = this.sumPool[i] + parseInt(dataValue);
						}
					}
				}
			}
		}
		vHtml += "</tr>";

		var sumHtml = "";
		if (this.getSum()) {
			sumHtml +=
				"<tr class='L2PTreeTableSumDataTr' id='TreeTable_Node_sum' " +
				"l2ptreetable-nodeid='' " +
				"l2ptreetable-parentid='' " +
				"style='height:" +
				this.getDataHeight() +
				";' " +
				">";

			sumHtml += "<td class='L2PTreeTableDataTreeCell'><div style='width:" + this.i_w + "px;'>";
			sumHtml += "<table style='width:100% cellspacing='0' cellpadding='0'>";
			sumHtml += "<tr>";

			for (var s = 0; s < oColumnIds.length; s++) {
				if (oColumnTypes[s] == "TreeItem") {
					for (var j = 0; j < 1; j++) {
						sumHtml += "<td><span class='L2PTreeTablePadding10'></span></td>";
					}
					sumHtml += "<td><img id='TreeTable_TreeImg_sum' src='" + this.minusImage + "' style='visibility:hidden;'></td>";
					sumHtml += "<td><img id='TreeTable_IconImg_sum' src='" + this.leafImage + "' style='visibility:hidden;'></td>";
					sumHtml += "<td><div id='TreeTable_TreeItem_sum' style=''>합계</div></td>";
					sumHtml += "</tr></table>";
					sumHtml += "</div></td>";
				} else if (oColumnTypes[s] == "number") {
					if (s < this.sumPool.length - 1) {
						sumHtml += "<td class='L2PTreeTableDataCell'><div style=''>";
					} else {
						sumHtml += "<td class='L2PTreeTableDataCell L2PTreeTableHeaderCellRight'><div style=''>";
					}
					sumHtml += this.sumPool[s] + "<span class='L2PTreeTablePadding5'></span></div></td>";
				}
			}
			sumHtml += "</tr>";

			if ($("#TreeTable_Node_sum").html() != undefined) {
				$("#TreeTable_Node_sum").replaceWith(sumHtml);
			} else {
				$(sumHtml).appendTo(".L2PTreeTableSumData");
			}
		}

		if (parentid == "" || parentid == "0000") {
			$(vHtml).appendTo(".L2PTreeTableData");
		} else {
			var tmp = $(".L2PTreeTableDataTr");
			var parent_nodeid = "";

			if (tmp && tmp.length) {
				for (var i = 0; i < tmp.length; i++) {
					var nid = $(tmp[i]).attr("l2ptreetable-nodeid");
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
				$("#TreeTable_IconImg_" + parentid).attr("src", this.folderOpenImage);
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
			if (tParentId == "" || tParentId == "0000") {
				break;
			}
			vAllParentId += "," + tParentId;
			t_parentid = tParentId;
		}

		var nodeInfo = { nodeid: nodeid, parentid: parentid, allparentid: vAllParentId, level: level, data: data, visible: true };

		this.nodePool.push(nodeInfo);

		var visible_cnt = 0;
		for (var n = 0; n < this.nodePool.length; n++) {
			if (this.nodePool[n].visible) visible_cnt++;
		}
		if (visible_cnt * this.c_h < this.d_h) {
			$(".L2PTreeTableDataBody").css("height", visible_cnt * this.c_h + "px");
		} else {
			$(".L2PTreeTableDataBody").css("height", this.d_h + "px");
		}

		this.resizeView();
	}
});

control.L2PTreeTable.prototype.exit = function () {};

control.L2PTreeTable.prototype.addNode = function (nodeid, parentid, level, data) {
	this.addData(nodeid, parentid, level, data);
	return;
};

control.L2PTreeTable.prototype.hasChildNode = function (nodeid) {
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

control.L2PTreeTable.prototype.removeData = function () {
	this.nodePool = [];
	this.sumPool = [];

	for (var i = 0; i < this.getHeader().length; i++) {
		this.sumPool.push(0);
	}

	$(".L2PTreeTableDataTr").remove();
	$(".L2PTreeTableData").empty();
	$(".L2PTreeTableSumDataTr").remove();
	$(".L2PTreeTableSumData").empty();
};

/**
 * Function is called when button is clicked.
 */
control.L2PTreeTable.prototype.reSize = function (w, h) {
	if (w == null || w < 1) h = windiw.innerWidth;
	if (h == null || h < 1) h = windiw.innerHeight;

	$("#" + this.getId()).css("width", w);
	$("#" + this.getId()).css("height", h);
	this.resizeView();
};

control.L2PTreeTable.prototype.closeAllNode = function () {
	if (this.nodePool && this.nodePool.length) {
		for (var n = 0; n < this.nodePool.length; n++) {
			var oControlId = "TreeTable_Node_" + this.nodePool[n].nodeid;
			if (this.nodePool[n].level == 1) {
				console.log($("#" + oControlId));
				$("#TreeTable_TreeImg_" + this.nodePool[n].nodeid).attr("src", this.plusImage);
				$("#TreeTable_IconImg_" + this.nodePool[n].nodeid).attr("src", this.folderCloseImage);
			} else {
				$("#" + oControlId).css("display", "none");
				this.nodePool[n].visible = false;
			}
		}

		var visible_cnt = 0;
		for (var n = 0; n < this.nodePool.length; n++) {
			if (this.nodePool[n].visible) visible_cnt++;
		}
		if (visible_cnt * this.c_h < this.d_h) {
			$(".L2PTreeTableDataBody").css("height", visible_cnt * this.c_h + "px");
		} else {
			$(".L2PTreeTableDataBody").css("height", this.d_h + "px");
		}
	}
};

control.L2PTreeTable.M_EVENTS = { press: "press", select: "select", dataSelect: "dataSelect" };

/**
 * Function is called when button is clicked.
 */
control.L2PTreeTable.prototype.onclick = function (oBrowserEvent) {
	var oClickedControlId = oBrowserEvent.target.id;
	var nodeId = "";
	var t1 = oClickedControlId.split("_");
	nodeId = t1[t1.length - 1];

	if (oClickedControlId.indexOf("TreeTable_TreeItem_") != -1) {
		this.fireSelect({ nodeid: nodeId });
	}

	if (oClickedControlId.indexOf("L2PTreeTable-Data_") != -1) {
		//nodeId = t1[t1.length - 2];
		//var fieldId = t1[t1.length - 1];

		var oControl = $("#" + oClickedControlId);

		this.fireDataSelect({ nodeid: oControl.attr("nodeid"), fieldid: oControl.attr("fieldid"), level: oControl.attr("level") });
	}

	if (oClickedControlId.indexOf("TreeTable_TreeImg_") != -1) {
		var tmp = $(".L2PTreeTableDataTr");

		var vSrc = $("#" + oClickedControlId).attr("src");

		if (vSrc.indexOf("minus") != -1) {
			$("#" + oClickedControlId).attr("src", this.plusImage);
			$("#TreeTable_IconImg_" + nodeId).attr("src", this.folderCloseImage);

			if (tmp && tmp.length) {
				for (var i = 0; i < tmp.length; i++) {
					var vnodeid = $(tmp[i]).attr("l2ptreetable-nodeid");

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
			$("#" + oClickedControlId).attr("src", this.minusImage);
			$("#TreeTable_IconImg_" + nodeId).attr("src", this.folderOpenImage);

			if (tmp && tmp.length) {
				for (var i = 0; i < tmp.length; i++) {
					var vnodeid = $(tmp[i]).attr("l2ptreetable-nodeid");
					if (this.nodePool && this.nodePool.length) {
						for (var n = 0; n < this.nodePool.length; n++) {
							if (vnodeid == this.nodePool[n].nodeid) {
								if (this.nodePool[n].allparentid.indexOf(nodeId) != -1) {
									var aDisplay = $(tmp[i]).css("display");
									if (aDisplay == "none") {
										$(tmp[i]).css("display", "");
									}
									this.nodePool[n].visible = true;
								}
								break;
							}
						}
					}
				}
			}
		}

		var visible_cnt = 0;
		for (var n = 0; n < this.nodePool.length; n++) {
			if (this.nodePool[n].visible) visible_cnt++;
		}
		if (visible_cnt * this.c_h < this.d_h) {
			$(".L2PTreeTableDataBody").css("height", visible_cnt * this.c_h + "px");
		} else {
			$(".L2PTreeTableDataBody").css("height", this.d_h + "px");
		}
	}
};
