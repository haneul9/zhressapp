/**
 * Table
 *
 * @memberOf control.Table
 *
 * Create Date : 2015. 09. 23
 * Version : 1.0
 */

jQuery.sap.declare("control.L2PTable");

sap.ui.core.Control.extend("control.L2PTable", {
	/*
	 * @memberOf control.Table
	 */

	drag_id: "",
	drag_x: -1,
	hscroll_left: 0,
	t_w: 0,
	t_h: 0,
	d_w: 0,
	d_h: 0,
	fixedcol_w: 0,

	data: [],
	columns: [],

	currentPage: 1,
	totalPage: 0,

	metadata: {
		properties: {
			columns: { type: "any[]" },
			fixedcol: { type: "int", defaultValue: 0 },

			paging: { type: "boolean", defaultValue: false },
			pagesize: { type: "int", defaultValue: 10 },

			loading: { type: "any" },
			dateFormat: { type: "string", defaultValue: "yyyy-MM-dd" },
			datetimeFormat: { type: "string", defaultValue: "yyyy-MM-dd hh:mm:ss" },
			timeFormat: { type: "string", defaultValue: "hh:mm:ss" },

			headerHeight: { type: "int", defaultValue: 35 },
			dataHeight: { type: "int", defaultValue: 35 },

			width: { type: "sap.ui.core.CSSSize", defaultValue: "100%" },
			height: { type: "sap.ui.core.CSSSize", defaultValue: "100%" }
		},
		aggregations: {},

		associations: {},

		events: {
			linkSelect: {}
		}
	},

	init: function () {
		this.data = [];
		this.fixedcol_w = 0;
	},

	onBeforeRendering: function () {
		var domNode = this.getDomRef();
		$(domNode).unbind("linkSelect");
	},

	getWidthOfText: function (txt, fontname, fontsize) {
		// Create a dummy canvas (render invisible with css)
		var c = document.createElement("canvas");
		// Get the context of the dummy canvas
		var ctx = c.getContext("2d");
		// Set the context.font to the font that you are using
		ctx.font = fontsize + "px" + fontname;
		// Measure the string
		// !!! <CRUCIAL>  !!!
		var length = ctx.measureText(txt).width;
		// !!! </CRUCIAL> !!!
		// Return width
		return length * 1.5;
	},

	getMaxLength: function (oControl, id) {
		var len = 0;

		if (oControl.data && oControl.data.length) {
			var old_len = 0;
			for (var i = 0; i < oControl.data.length; i++) {
				var t1 = eval("oControl.data[i]." + id + ";");
				var t2 = this.getWidthOfText(t1, "'Malgun Gothic'", "13px");
				if (t2 > old_len) {
					old_len = t2;
				}
			}
			len = old_len;
		}
		return len;
	},

	sortData: function (oControl, oEvent) {
		var click_id = oEvent.target.id;

		var colid = $("#" + click_id).attr("colid");

		if (typeof colid == "undefined" || colid == "") {
			return;
		}

		var s = $("#" + click_id).attr("sort");

		var a = $("#" + click_id).html();
		if (typeof a == "undefined") {
			return;
		}

		if (a.indexOf("<span") != -1) {
			a = a.substring(0, a.indexOf("<span"));
		}

		var bDescending = false;

		if (s == "") {
			a += "<span style='color:blue'>▼</span>";
			$("#" + click_id).attr("sort", "A");
			bDescending = false;
		} else if (s == "A") {
			a += "<span style='color:blue'>▲</span>";
			$("#" + click_id).attr("sort", "D");
			bDescending = true;
		} else if (s == "D") {
			a += "<span style='color:blue'>▼</span>";
			$("#" + click_id).attr("sort", "A");
			bDescending = false;
		}

		$("#" + click_id).empty();
		$("#" + click_id).append(a);

		oControl.sorting(colid, bDescending);
		if (oControl.getPaging()) {
			oControl.makePageData(oControl.currentPage);
		} else {
			oControl.makeData();
		}
	},

	sorting: function (id, bDescending) {
		var oControl = this;
		var sKey = id;

		if (bDescending) {
			oControl.data.sort(function (a, b) {
				var a1 = eval("a." + sKey);
				var b1 = eval("b." + sKey);
				return a1 < b1 ? 1 : a1 > b1 ? -1 : 0;
			});
		} else {
			oControl.data.sort(function (a, b) {
				var a1 = eval("a." + sKey);
				var b1 = eval("b." + sKey);
				return a1 < b1 ? -1 : a1 > b1 ? 1 : 0;
			});
		}
	},

	adjustColumn: function (oControl, oEvent) {
		var dbl_id = oEvent.target.id;

		var columnid = dbl_id.replace("_div", "");
		var dataid = columnid.replace("HeaderTd", "DataCol");

		var colid = $("#" + dbl_id).attr("colid");
		var max_length = oControl.getMaxLength(oControl, colid);

		var header_title = "";
		for (var i = 0; i < oControl.columns.length; i++) {
			if (oControl.columns[i].id == colid) {
				header_title = oControl.columns[i].text;
				break;
			}
		}
		var header_length = this.getWidthOfText(header_title, "'Malgun Gothic'", "13px");
		if (max_length < header_length) {
			max_length = header_length;
		}

		$("#" + columnid).css("width", max_length + "px");
		$("#" + dataid).css("width", max_length + "px");

		for (var i = 0; i < oControl.columns.length; i++) {
			if (oControl.columns[i].id == colid) {
				oControl.columns[i].width = max_length;
				break;
			}
		}

		oControl.showHScrollbar(oControl);
	},

	resizeColumnStart: function (oControl, oEvent) {
		oControl.drag_id = oEvent.target.id;
		oControl.drag_x = oEvent.originalEvent.x;
	},

	resizeColumnEnd: function (oControl, oEvent) {
		oEvent.preventDefault();

		var vMoveX = oEvent.originalEvent.x - oControl.drag_x;

		var columnid = oControl.drag_id.replace("_div", "");
		var dataid = columnid.replace("HeaderTd", "DataCol");

		var old_w = $("#" + columnid).width();
		var new_w = old_w + vMoveX;

		$("#" + columnid).css("width", new_w + "px");
		$("#" + dataid).css("width", new_w + "px");

		var colid = $("#" + columnid).attr("colid");

		for (var i = 0; i < oControl.columns.length; i++) {
			if (oControl.columns[i].id == colid) {
				oControl.columns[i].width = new_w;
				break;
			}
		}

		oControl.showHScrollbar(oControl);
	},

	showHScrollbar: function (oControl) {
		var vFixedCol = oControl.getFixedcol();

		var column_total_width = 0;
		for (var i = 0; i < oControl.columns.length; i++) {
			if (i >= vFixedCol) {
				column_total_width += oControl.columns[i].width + 4;
			}
		}

		var hs = $("#" + oControl.getId() + "_inner-TableHScrollbar");
		var hs_cnt = $("#" + oControl.getId() + "_inner-TableHScrollbar-sbcnt");

		var h_dummy = $("#" + oControl.getId() + "_inner-TableHeaderTd_dummy");
		var d_dummy = $("#" + oControl.getId() + "_inner-TableDataCol_dummy");

		if (oControl.d_w - oControl.fixedcol_w >= column_total_width) {
			hs.css("display", "none");
			h_dummy.width(oControl.d_w - oControl.fixedcol_w - column_total_width);
			d_dummy.width(oControl.d_w - oControl.fixedcol_w - column_total_width);

			$("#" + oControl.getId() + "_inner-TableHeaderContain").css("left", 0 + "px");
			$("#" + oControl.getId() + "_inner-TableHeaderContain").width(oControl.d_w - oControl.fixedcol_w);
			$("#" + oControl.getId() + "_inner-TableDataContain").css("left", 0 + "px");
			$("#" + oControl.getId() + "_inner-TableDataContain").width(oControl.d_w - oControl.fixedcol_w);
		} else {
			hs.css("display", "block");
			hs_cnt.width(column_total_width);

			h_dummy.width(oControl.d_w - oControl.fixedcol_w - column_total_width);
			d_dummy.width(oControl.d_w - oControl.fixedcol_w - column_total_width);
		}
	},

	allowDrop: function (oEvent) {
		oEvent.preventDefault();
	},

	onAfterRendering: function () {
		var oControl = this;

		var self = this,
			domNode = this.getDomRef();
		$(domNode).bind("linkSelect", function () {
			self.fireSelect({
				row: "",
				colid: "",
				value: ""
			});
		});

		var vFixedCol = oControl.getFixedcol();

		$("#" + oControl.getId() + "_inner-TableHeaderTr").bind("drop", function (ev) {
			oControl.resizeColumnEnd(oControl, ev);
		});

		$("#" + oControl.getId() + "_inner-TableHeaderTr").bind("dragover", function (ev) {
			oControl.allowDrop(ev);
		});

		var columns = oControl.getColumns();

		for (var i = 0; i < columns.length; i++) {
			if (i >= vFixedCol) {
				$("#" + oControl.getId() + "_inner-TableHeaderTd_" + i + "_div").bind("dragstart", function (ev) {
					oControl.resizeColumnStart(oControl, ev);
				});

				$("#" + oControl.getId() + "_inner-TableHeaderTd_" + i + "_div").bind("dblclick", function (ev) {
					oControl.adjustColumn(oControl, ev);
				});
			}

			$("#" + oControl.getId() + "_inner-TableHeaderTd_" + i).bind("click", function (ev) {
				oControl.sortData(oControl, ev);
			});

			if (columns[i].type == "checkbox") {
				$("#" + oControl.getId() + "_inner-TableHeaderCheckbox-col" + i).bind("click", function (ev) {
					oControl.checkAll(ev);
				});
			}
		}

		$("#" + oControl.getId() + "_inner-TableHScrollbar-sb").bind("scroll", function (ev) {
			var s_l = ev.target.scrollLeft;

			$("#" + oControl.getId() + "_inner-TableHeaderContain").css("left", -1 * s_l + "px");
			$("#" + oControl.getId() + "_inner-TableHeaderContain").width(oControl.d_w - oControl.fixedcol_w + s_l);
			$("#" + oControl.getId() + "_inner-TableDataContain").css("left", -1 * s_l + "px");
			$("#" + oControl.getId() + "_inner-TableDataContain").width(oControl.d_w - oControl.fixedcol_w + s_l);
		});

		$("#" + oControl.getId() + "_inner-TableDataContain").bind("scroll", function (ev) {
			var s_t = ev.target.scrollTop;

			$("#" + oControl.getId() + "_inner-TableFixedData").css("top", -1 * s_t + "px");
		});
	},

	checkAll: function (ev) {
		var oClickedControlId = ev.target.id;

		var checked = $("#" + oClickedControlId).prop("checked");
		var col = $("#" + oClickedControlId).attr("col");

		var id = this.columns[parseInt(col)].id;

		for (var i = 0; i < this.data.length; i++) {
			eval("this.data[i]." + id + " = " + checked + ";");

			$("#" + this.getId() + "_inner-TableDataCheckbox-row" + i + "-col" + col).prop("checked", checked);
		}
	},

	setCheckbox: function (row, col, checked) {
		var id = this.columns[parseInt(col)].id;
		eval("this.data[parseInt(row)]." + id + " = " + checked + ";");
	},

	renderer: {
		render: function (oRm, oControl) {
			jQuery.sap.includeStyleSheet("css/L2PTable.css");

			oControl.t_w = oControl.getContainerWidth(oControl);
			oControl.t_h = oControl.getContainerHeight(oControl);

			oControl.d_h = oControl.t_h - (oControl.getHeaderHeight() + 1);
			oControl.d_w = oControl.t_w;

			if (oControl.getPaging()) {
				oControl.d_h = oControl.d_h - 25;
			}

			var columns = oControl.getColumns();

			var undefine_width_cnt = 0;
			var define_width = 0;
			for (var i = 0; i < columns.length; i++) {
				if (typeof columns[i].width == "undefined" || columns[i].width == 0) {
					undefine_width_cnt++;
				} else {
					define_width += columns[i].width;
				}
			}

			if (undefine_width_cnt > 0) {
				var one_width = (oControl.d_w - columns.length * 4 - define_width) / undefine_width_cnt;
				if (one_width < 100) one_width = 100;
				for (var i = 0; i < columns.length; i++) {
					if (typeof columns[i].width == "undefined") {
						columns[i].width = parseInt(one_width);
					}
				}
			}

			oControl.fixedcol_w = 0;
			var vFixedCol = oControl.getFixedcol();
			if (vFixedCol > 0) {
				for (var i = 0; i < columns.length; i++) {
					if (i < vFixedCol) {
						oControl.fixedcol_w += columns[i].width + 4;
					}
				}
			}

			var column_total_width = 0;
			for (var i = 0; i < columns.length; i++) {
				if (i >= vFixedCol) {
					column_total_width += columns[i].width + 4;
				}
			}

			oControl.columns = columns;

			oRm.write("<div ");
			oRm.writeControlData(oControl);
			oRm.addClass("L2PTableContainer");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.t_w + "px");
			oRm.addStyle("height", oControl.t_h + "px");
			oRm.writeStyles();
			oRm.write(">");

			//전체 Table 정의
			oRm.write("<table cellpadding='0' cellspacing='0' style='width:100%; table-layout:fixed'>");

			//테이블 타이틀 및 Toolbar 영역
			oRm.write("<tr id='" + oControl.getId() + "_inner-TableTitleArea' style='display:none'>");
			oRm.write("<td>");
			oRm.write("</td>");
			oRm.write("<td style='display:none;'>");
			oRm.write("</td>");
			oRm.write("</tr>");

			//테이블 Header 및 세로 Scrollbar 영역
			oRm.write("<tr id='" + oControl.getId() + "_inner-TableHeaderArea' style=''>");
			oRm.write("<td>");

			oRm.write("<table cellpadding='0' cellspacing='0' style='width:100%'>");
			oRm.write("<tr>");

			//fixed column area
			oRm.write("<td ");
			oRm.addStyle("width", oControl.fixedcol_w + "px");
			oRm.addStyle("height", oControl.getHeaderHeight() + 1 + "px");
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<div id='" + oControl.getId() + "_inner-TableFixedHeaderContain' ");
			oRm.addClass("L2PTableFixedHeaderContainer");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.fixedcol_w + "px");
			oRm.addStyle("height", oControl.getHeaderHeight() + 1 + "px");
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<table id='" + oControl.getId() + "_inner-TableFixedHeader' cellpadding='0' cellspacing='0' ");
			oRm.addClass("L2PTableHeader");
			oRm.writeClasses();
			oRm.addStyle("width", "100%");
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<tr id='" + oControl.getId() + "_inner-TableFixedHeaderTr' ");
			oRm.addClass("L2PTableHeaderTr");
			oRm.writeClasses();
			oRm.addStyle("height", oControl.getHeaderHeight() + "px");
			oRm.writeStyles();
			oRm.write(">");

			for (var i = 0; i < columns.length; i++) {
				if (i < vFixedCol) {
					oRm.write("<td id='" + oControl.getId() + "_inner-TableHeaderTd_" + i + "' ");
					oRm.addClass("L2PTableHeaderTd");
					oRm.writeClasses();

					oRm.write(" style='width:" + columns[i].width + "px;");
					oRm.write("' ");
					if (columns[i].type == "string") {
						oRm.write(" sort='' colid='" + columns[i].id + "'");
						oRm.write(">");
						oRm.write(columns[i].label);
					} else if (columns[i].type == "checkbox") {
						oRm.write(">");
						oRm.write("<input type='checkbox' id='" + oControl.getId() + "_inner-TableHeaderCheckbox-col" + i + "' ");
						oRm.write("col='" + i + "' ");
						oRm.write(">");
					}

					oRm.write("</td>");

					oRm.write("<td id='" + oControl.getId() + "_inner-TableHeaderTd_" + i + "_div' ");
					oRm.addClass("L2PTableFixedHeaderTd_div");
					oRm.writeClasses();
					oRm.write(">");
					oRm.write("</td>");
				} else {
					break;
				}
			}
			oRm.write("</tr>");
			oRm.write("</table>");

			oRm.write("</div>");
			oRm.write("</td>");

			//normal column area
			oRm.write("<td ");
			oRm.addStyle("width", oControl.d_w - oControl.fixedcol_w + "px");
			oRm.addStyle("height", oControl.getHeaderHeight() + 1 + "px");
			oRm.addStyle("overflow", "hidden");
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<div id='" + oControl.getId() + "_inner-TableHeaderContain' ");
			oRm.addClass("L2PTableHeaderContainer");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.d_w - oControl.fixedcol_w + "px");
			oRm.addStyle("height", oControl.getHeaderHeight() + 1 + "px");
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<table id='" + oControl.getId() + "_inner-TableHeader' cellpadding='0' cellspacing='0' ");
			oRm.addClass("L2PTableHeader");
			oRm.writeClasses();
			oRm.addStyle("width", "100%"); //oControl.t_w + "px");
			oRm.writeStyles();
			oRm.write(">");

			if (columns && columns.length) {
				oRm.write("<tr id='" + oControl.getId() + "_inner-TableHeaderTr' ");
				oRm.addClass("L2PTableHeaderTr");
				oRm.writeClasses();
				oRm.addStyle("height", oControl.getHeaderHeight() + "px");
				oRm.writeStyles();
				oRm.write(">");

				for (var i = 0; i < columns.length; i++) {
					if (i < vFixedCol) {
						continue;
					}

					oRm.write("<td id='" + oControl.getId() + "_inner-TableHeaderTd_" + i + "' ");
					oRm.addClass("L2PTableHeaderTd");
					oRm.writeClasses();

					oRm.write(" style='width:" + columns[i].width + "px;");
					oRm.write("' ");
					if (columns[i].type == "string") {
						oRm.write(" sort='' colid='" + columns[i].id + "'");
						oRm.write(">");
						oRm.write(columns[i].label);
					} else if (columns[i].type == "checkbox") {
						oRm.write(">");
						oRm.write("<input type='checkbox' id='" + oControl.getId() + "_inner-TableHeaderCheckbox-col" + i + "' ");
						oRm.write("col='" + i + "' ");
						oRm.write(">");
					} else {
						oRm.write(" sort='' colid='" + columns[i].id + "'");
						oRm.write(">");
						oRm.write(columns[i].label);
					}

					oRm.write("</td>");

					oRm.write("<td id='" + oControl.getId() + "_inner-TableHeaderTd_" + i + "_div' ");
					oRm.addClass("L2PTableHeaderTd_div");
					oRm.writeClasses();
					oRm.write(" draggable='true' colid='" + columns[i].id + "' ");
					oRm.write(">");
					oRm.write("</td>");
				}

				oRm.write("<td id='" + oControl.getId() + "_inner-TableHeaderTd_dummy' ");
				oRm.addClass("L2PTableHeaderTd_dummy");
				oRm.writeClasses();
				if (column_total_width < oControl.d_w) {
					oRm.write(" style='width:" + (oControl.d_w - column_total_width) + "px;' ");
				} else {
					oRm.write(" style='width:" + 16 + "px;' ");
				}
				oRm.write(">&nbsp;");
				oRm.write("</td>");
				oRm.write("</tr>");
			}
			oRm.write("</table>");
			oRm.write("</div>");
			oRm.write("</td>");

			oRm.write("</tr>");
			oRm.write("</table>");

			oRm.write("</td>");

			oRm.write("<td style='display:none;'>");
			oRm.write("</td>");
			oRm.write("</tr>");

			//테이터 영역
			oRm.write("<tr>");
			oRm.write("<td>");

			oRm.write("<table cellpadding='0' cellspacing='0' style='width:100%'>");
			oRm.write("<tr>");

			//fixed data area
			oRm.write("<td ");
			oRm.addStyle("width", oControl.fixedcol_w + "px");
			oRm.addStyle("height", oControl.d_h + "px");
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<div id='" + oControl.getId() + "_inner-TableFixedDataContain' ");
			oRm.addClass("L2PTableFixedDataContainer");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.fixedcol_w + "px");
			oRm.addStyle("height", oControl.d_h + "px");
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("</div>");
			oRm.write("</td>");

			//normal data area
			oRm.write("<td ");
			oRm.addStyle("width", oControl.d_w - oControl.fixedcol_w + "px");
			oRm.addStyle("height", oControl.d_h + "px");
			oRm.addStyle("overflow", "hidden");
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("<div id='" + oControl.getId() + "_inner-TableDataContain' ");
			oRm.addClass("L2PTableDataContainer");
			oRm.writeClasses();
			oRm.addStyle("width", oControl.d_w - oControl.fixedcol_w + "px");
			oRm.addStyle("height", oControl.d_h + "px");
			oRm.writeStyles();
			oRm.write(">");

			oRm.write("</div>");
			oRm.write("</td>");

			oRm.write("</tr>");
			oRm.write("</table>");

			oRm.write("</td>");

			oRm.write("</tr>");

			//가로 Scrollbar 영역
			oRm.write("<tr>");
			oRm.write("<td colspan='2'>");
			var vHSDisplay = "";
			if (column_total_width <= oControl.t_w - oControl.fixedcol_w) {
				vHSDisplay = "none";
			} else {
				vHSDisplay = "block";
			}

			oRm.write(
				"<div id='" +
					oControl.getId() +
					"_inner-TableHScrollbar' style='position:relative;overflow:hidden;height:16px;left:" +
					oControl.fixedcol_w +
					"px;width:" +
					(oControl.d_w - oControl.fixedcol_w) +
					"px;display:" +
					vHSDisplay +
					";'>"
			);
			oRm.write(
				"<div id='" +
					oControl.getId() +
					"_inner-TableHScrollbar-sb' style='height:32px;margin-top:-16px;overflow-x:scroll;overflow-y:hidden'>"
			);
			oRm.write(
				"<div id='" + oControl.getId() + "_inner-TableHScrollbar-sbcnt' style='height:16px;width:" + column_total_width + "px;'>"
			);
			oRm.write("</div>");
			oRm.write("</div>");
			oRm.write("</td>");
			oRm.write("</tr>");

			//Paging 영역
			if (oControl.getPaging()) {
				oRm.write("<tr style='height:25px;'>");
				oRm.write("<td colspan='2' style='padding-right:5px; padding-left:5px; padding-top:2px; text-align:right;'>");
				oRm.write("<div id='" + oControl.getId() + "_inner-tablepageinfo' style='float:left;'></div>");
				oRm.write("<div id='" + oControl.getId() + "_inner-tablepage' style='float:right;'></div>");
				oRm.write("</td>");
				oRm.write("</tr>");
			}

			oRm.write("</table>");
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
				if ($(".L2PTableContainer").parent().height() != null) {
					oParent_height = $(".L2PTableContainer").parent().height();
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
				if ($(".L2PTableContainer").parent().width() != null) {
					oParent_width = $(".L2PTableContainer").parent().width();
				}
				r_w = Math.floor((oParent_width * p1) / 100);
			}
		}
		return r_w;
	},

	makeColGroup: function (Fixed, vFixedCol) {
		var oControl = this;

		var columns = oControl.columns;

		var column_total_width = 0;
		for (var i = 0; i < columns.length; i++) {
			if (i >= vFixedCol) {
				column_total_width += columns[i].width + 4;
			}
		}

		var data_html = "<colgroup>";
		for (var i = 0; i < columns.length; i++) {
			var fRender = false;
			if (Fixed) {
				if (i < vFixedCol) {
					fRender = true;
				}
			} else {
				if (i >= vFixedCol) {
					fRender = true;
				}
			}

			if (fRender) {
				data_html += "<col id='" + oControl.getId() + "_inner-TableDataCol_" + i + "' ";
				data_html += " class='L2PTableDataCol' ";
				data_html += " style='width:" + columns[i].width + "px;' ";
				data_html += ">";

				data_html += "<col id='" + oControl.getId() + "_inner-TableDataCol_" + i + "_div' ";
				data_html += " class='L2PTableDataCol_div' ";
				data_html += ">";
			}
		}

		if (Fixed == false) {
			if (column_total_width < oControl.d_w) {
				data_html += "<col id='" + oControl.getId() + "_inner-TableDataCol_dummy' ";
				data_html += " class='L2PTableDataCol' style='width:" + (oControl.d_w - column_total_width) + "px;'";
				data_html += ">";
			} else {
				data_html += "<col id='" + oControl.getId() + "_inner-TableDataCol_dummy' ";
				data_html += " class='L2PTableDataCol' style='width:" + 16 + "px;'";
				data_html += ">";
			}
		}

		data_html += "</colgroup>";

		return data_html;
	},

	makeDataType: function (from_cnt, to_cnt, Fixed, vFixedCol) {
		var oControl = this;

		var data_html = "";

		for (var i = from_cnt; i < to_cnt; i++) {
			if (Fixed) data_html += "<tr id='" + oControl.getId() + "_inner-TableFixedDataTr-row" + i + "' ";
			else data_html += "<tr id='" + oControl.getId() + "_inner-TableDataTr-row" + i + "' ";
			data_html += " class='L2PTableDataTr' ";
			data_html += " style='height:" + oControl.getDataHeight() + "px' ";
			data_html += ">";

			for (var j = 0; j < columns.length; j++) {
				var fRender = false;
				if (Fixed) {
					if (j < vFixedCol) {
						fRender = true;
					}
				} else {
					if (j >= vFixedCol) {
						fRender = true;
					}
				}

				if (fRender) {
					data_html += "<td id='" + oControl.getId() + "_inner-TableDataTd-row" + i + "-col" + j + "' ";
					data_html += " class='L2PTableDataTd' ";

					data_html += " style='text-align:" + columns[j].align + ";'>";

					var v1 = eval("oControl.data[i]." + columns[j].id + ";");

					if (columns[j].type == "string") {
						data_html += "<span style='";
						if (typeof columns[j].style != "undefined" && columns[j].style != "") {
							data_html += columns[j].style;
						}
						data_html += "'>";
						data_html += v1;
						data_html += "</span>";
					} else if (columns[j].type == "checkbox") {
						data_html +=
							"<input type='checkbox' id='" + oControl.getId() + "_inner-TableDataCheckbox-row" + i + "-col" + j + "' ";
						data_html += " row='" + i + "' col='" + j + "' ";
						if (v1 == true) data_html += " checked ";
						data_html += " >";
					} else if (columns[j].type == "int") {
						data_html += "<span style='";
						if (typeof columns[j].style != "undefined" && columns[j].style != "") {
							data_html += columns[j].style;
						}
						data_html += "'>";
						data_html += v1;
						data_html += "</span>";
					} else if (columns[j].type == "date") {
						data_html += "<span style='";
						if (typeof columns[j].style != "undefined" && columns[j].style != "") {
							data_html += columns[j].style;
						}
						data_html += "'>";
						data_html += oControl.getDate2String(new Date(v1));
						data_html += "</span>";
					} else if (columns[j].type == "time") {
						data_html += "<span style='";
						if (typeof columns[j].style != "undefined" && columns[j].style != "") {
							data_html += columns[j].style;
						}
						data_html += "'>";
						data_html += oControl.getTime2String(new Date(v1));
						data_html += "</span>";
					} else if (columns[j].type == "datetime") {
						data_html += "<span style='";
						if (typeof columns[j].style != "undefined" && columns[j].style != "") {
							data_html += columns[j].style;
						}
						data_html += "'>";
						data_html += oControl.getDatetime2String(new Date(v1));
						data_html += "</span>";
					} else if (columns[j].type == "link") {
						data_html += "<a href='javascript:void(0)' class='L2PTableDataLink' style='";
						if (typeof columns[j].style != "undefined" && columns[j].style != "") {
							data_html += columns[j].style;
						}
						data_html += "' id='" + oControl.getId() + "_inner-TableDataLink-row" + i + "-col" + j + "' ";
						data_html += " row='" + i + "' colid='" + columns[j].id + "' >";
						data_html += v1;
						data_html += "</a>";
					}

					data_html += "</td>";

					data_html += "<td id='" + oControl.getId() + "_inner-TableDataTd-row" + i + "-col" + j + "_div' ";
					data_html += " class='L2PTableDataTd_div' ";
					data_html += ">";
					data_html += "</td>";
				}
			}
			data_html += "</tr>";
		}

		return data_html;
	},

	addZero: function (d) {
		if (parseInt(d) < 10) return "0" + d;
		else return d;
	},

	getDate2String: function (d) {
		if (d == null) return "";
		var f = this.getDateFormat();

		var yyyy = d.getFullYear().toString();
		var MM = (d.getMonth() + 1).toString();
		var dd = d.getDate().toString();

		f = f.replace("yyyy", yyyy);
		f = f.replace("MM", this.addZero(MM));
		f = f.replace("dd", this.addZero(dd));

		return f;
	},

	getTime2String: function (d) {
		if (d == null) return "";
		var f = this.getTimeFormat();

		var hh = d.getHours().toString();
		var mm = d.getMinutes().toString();
		var ss = d.getSeconds().toString();

		f = f.replace("hh", this.addZero(hh));
		f = f.replace("mm", this.addZero(mm));
		f = f.replace("ss", this.addZero(ss));

		return f;
	},

	getDatetime2String: function (d) {
		if (d == null) return "";
		var f = this.getDatetimeFormat();

		var yyyy = d.getFullYear().toString();
		var MM = (d.getMonth() + 1).toString();
		var dd = d.getDate().toString();

		var hh = d.getHours().toString();
		var mm = d.getMinutes().toString();
		var ss = d.getSeconds().toString();

		f = f.replace("yyyy", yyyy);
		f = f.replace("MM", this.addZero(MM));
		f = f.replace("dd", this.addZero(dd));
		f = f.replace("hh", this.addZero(hh));
		f = f.replace("mm", this.addZero(mm));
		f = f.replace("ss", this.addZero(ss));

		return f;
	},

	makeData: function () {
		var oControl = this;

		var vFixedCol = oControl.getFixedcol();

		var fixedDataContain = $("#" + oControl.getId() + "_inner-TableFixedDataContain");
		fixedDataContain.empty();

		var dataContain = $("#" + oControl.getId() + "_inner-TableDataContain");
		dataContain.empty();

		var loop_cnt = oControl.data.length;

		if (oControl.getPaging()) {
			var t_cnt = oControl.data.length;
			var p_cnt = oControl.getPagesize();

			var pageContent = $("#" + oControl.getId() + "_inner-tablepage");
			pageContent.empty();

			var p1 = t_cnt / p_cnt;
			if (t_cnt % p_cnt != 0) p1 = p1 + 1;

			var p_html = "";
			p_html +=
				"<span id='" +
				oControl.getId() +
				"_inner-TablePagePrev' class='L2PTablePageNumber L2PTablePageNumberPrev' >" +
				"<" +
				"</span>";
			for (var i = 1; i <= 10; i++) {
				if (i == 1)
					p_html +=
						"<span id='" +
						oControl.getId() +
						"_inner-TablePageNumber_" +
						i +
						"' class='L2PTablePageNumber L2PTablePageNumberSelect' page='" +
						i +
						"'>" +
						i +
						"</span>";
				else
					p_html +=
						"<span id='" +
						oControl.getId() +
						"_inner-TablePageNumber_" +
						i +
						"' class='L2PTablePageNumber L2PTablePageNumberUnSelect' page='" +
						i +
						"'>" +
						i +
						"</span>";
			}
			p_html +=
				"<span id='" +
				oControl.getId() +
				"_inner-TablePageNext' class='L2PTablePageNumber L2PTablePageNumberNext' >" +
				">" +
				"</span>";

			pageContent.append(p_html);

			var pageinfoContent = $("#" + oControl.getId() + "_inner-tablepageinfo");
			pageinfoContent.empty();
			pageinfoContent.append("<span class='L2PTablePageInfo'> 1 of " + parseInt(p1) + " Pages</span>");

			oControl.currentPage = 1;
			oControl.totalPage = parseInt(p1);

			loop_cnt = p_cnt;
		}

		if (vFixedCol > 0) {
			var fixed_data_html = "";
			fixed_data_html = "<table id='" + oControl.getId() + "_inner-TableFixedData' cellpadding='0' cellspacing='0' ";
			fixed_data_html += " class='L2PTableFixedData' ";
			fixed_data_html += " style='width:100%' ";
			fixed_data_html += ">";

			fixed_data_html += oControl.makeColGroup(true, vFixedCol);

			fixed_data_html += oControl.makeDataType(0, loop_cnt, true, vFixedCol);

			fixed_data_html += "</table>";

			fixedDataContain.append(fixed_data_html);
		}

		var data_html = "";
		data_html = "<table id='" + oControl.getId() + "_inner-TableData' cellpadding='0' cellspacing='0' ";
		data_html += " class='L2PTableData' ";
		data_html += " style='width:100%' ";
		data_html += ">";

		data_html += oControl.makeColGroup(false, vFixedCol);

		data_html += oControl.makeDataType(0, loop_cnt, false, vFixedCol);

		data_html += "</table>";

		dataContain.append(data_html);

		var aa = eval(oControl.getLoading());
		for (var i = 0; i < loop_cnt; i++) {
			for (var j = 0; j < oControl.columns.length; j++) {
				var v1 = eval("oControl.data[i]." + oControl.columns[j].id + ";");
				aa(i, j, v1);
			}
		}
	},

	makePageData: function (page) {
		var oControl = this;

		var vFixedCol = oControl.getFixedcol();

		oControl.currentPage = page;

		for (var i = 1; i <= oControl.totalPage; i++) {
			var o1 = $("#" + oControl.getId() + "_inner-TablePageNumber_" + i);
			if (i == page) {
				o1.removeClass("L2PTablePageNumberUnSelect");
				o1.addClass("L2PTablePageNumberSelect");
			} else {
				o1.addClass("L2PTablePageNumberUnSelect");
				o1.removeClass("L2PTablePageNumberSelect");
			}
		}

		var from_cnt = (page - 1) * oControl.getPagesize();
		var to_cnt = page * oControl.getPagesize();

		if (to_cnt > oControl.data.length) {
			to_cnt = oControl.data.length;
		}

		var pageinfoContent = $("#" + oControl.getId() + "_inner-tablepageinfo");
		pageinfoContent.empty();
		pageinfoContent.append("<span class='L2PTablePageInfo'> " + oControl.currentPage + " of " + oControl.totalPage + " Pages</span>");

		var fixedDataContain = $("#" + oControl.getId() + "_inner-TableFixedDataContain");
		fixedDataContain.empty();

		var dataContain = $("#" + oControl.getId() + "_inner-TableDataContain");
		dataContain.empty();
		dataContain.scrollTop(0);

		if (vFixedCol > 0) {
			var fixed_data_html = "";
			fixed_data_html = "<table id='" + oControl.getId() + "_inner-TableFixedData' cellpadding='0' cellspacing='0' ";
			fixed_data_html += " class='L2PTableFixedData' ";
			fixed_data_html += " style='width:100%' ";
			fixed_data_html += ">";

			fixed_data_html += oControl.makeColGroup(true, vFixedCol);

			fixed_data_html += oControl.makeDataType(from_cnt, to_cnt, true, vFixedCol);

			fixed_data_html += "</table>";

			fixedDataContain.append(fixed_data_html);
		}

		var data_html = "";
		data_html = "<table id='" + oControl.getId() + "_inner-TableData' cellpadding='0' cellspacing='0' ";
		data_html += " class='L2PTableData' ";
		data_html += " style='width:100%' ";
		data_html += ">";

		data_html += oControl.makeColGroup(false, vFixedCol);

		data_html += oControl.makeDataType(from_cnt, to_cnt, false, vFixedCol);

		data_html += "</table>";

		dataContain.append(data_html);
	},

	makePage: function (opt) {
		var oControl = this;

		var pageContent = $("#" + oControl.getId() + "_inner-tablepage");

		var from_page = 1;
		var to_page = 10;

		var t2 = oControl.currentPage % 10;
		var t1 = 0;
		if (opt == 2) {
			t1 = oControl.currentPage + 10;
		} else {
			t1 = oControl.currentPage - 10;
		}
		from_page = t1 - t2 + 1;
		to_page = t1 - t2 + 10;

		if (t2 == 0) {
			from_page = from_page - 10;
			to_page = to_page - 10;
		}

		if (opt == 1) {
			if (from_page < 0) {
				return;
			}
		}

		if (opt == 2) {
			if (from_page > oControl.totalPage) {
				return;
			}
			if (to_page > oControl.totalPage) {
				to_page = oControl.totalPage;
			}
		}

		pageContent.empty();

		oControl.currentPage = from_page;

		var p_html = "";
		p_html +=
			"<span id='" + oControl.getId() + "_inner-TablePagePrev' class='L2PTablePageNumber L2PTablePageNumberPrev' >" + "<" + "</span>";
		for (var i = from_page; i <= to_page; i++) {
			if (i == 1)
				p_html +=
					"<span id='" +
					oControl.getId() +
					"_inner-TablePageNumber_" +
					i +
					"' class='L2PTablePageNumber L2PTablePageNumberSelect' page='" +
					i +
					"'>" +
					i +
					"</span>";
			else
				p_html +=
					"<span id='" +
					oControl.getId() +
					"_inner-TablePageNumber_" +
					i +
					"' class='L2PTablePageNumber L2PTablePageNumberUnSelect' page='" +
					i +
					"'>" +
					i +
					"</span>";
		}
		p_html +=
			"<span id='" + oControl.getId() + "_inner-TablePageNext' class='L2PTablePageNumber L2PTablePageNumberNext' >" + ">" + "</span>";

		pageContent.append(p_html);
	},

	setData: function (data) {
		this.data = data;
	}
});

control.L2PTable.prototype.exit = function () {};

control.L2PTable.prototype.loadData = function (dataset) {
	if (!dataset || !dataset.length) return;

	var oControl = this;

	oControl.setData(dataset);

	oControl.makeData();
};

control.L2PTable.M_EVENTS = { linkSelect: "linkSelect" };

control.L2PTable.prototype.onclick = function (oBrowserEvent) {
	var oClickedControlId = oBrowserEvent.target.id;
	var oControl = this;

	if (oClickedControlId.indexOf("_inner-TablePageNumber_") != -1) {
		var page = $("#" + oClickedControlId).attr("page");
		oControl.makePageData(parseInt(page));
	}

	if (oClickedControlId.indexOf("_inner-TablePagePrev") != -1) {
		oControl.makePage(1);
		oControl.makePageData(oControl.currentPage);
	}

	if (oClickedControlId.indexOf("_inner-TablePageNext") != -1) {
		oControl.makePage(2);
		oControl.makePageData(oControl.currentPage);
	}

	if (oClickedControlId.indexOf("_inner-TableDataCheckbox") != -1) {
		var row = $("#" + oClickedControlId).attr("row");
		var col = $("#" + oClickedControlId).attr("col");
		var checked = $("#" + oClickedControlId).prop("checked");

		oControl.setCheckbox(row, col, checked);
	}

	if (oClickedControlId.indexOf("_inner-TableDataLink-row") != -1) {
		var oControl = $("#" + oClickedControlId);

		this.fireLinkSelect({ row: oControl.attr("row"), colid: oControl.attr("colid"), value: oControl.html() });
	}
};

control.L2PTable.prototype.getCheckedRow = function (col) {
	var rst = "";
	try {
		var id = "";
		if (isNaN(col)) {
			id = col;
		} else {
			id = this.columns[parseInt(col)].id;
		}

		for (var i = 0; i < this.data.length; i++) {
			var v = eval("this.data[i]." + id + ";");
			if (v == true) {
				rst += i + ",";
			}
		}
		if (rst.length > 1) {
			rst = rst.substring(0, rst.length - 1);
		}
	} catch (ex) {
		console.log(ex);
		return "";
	}

	return rst;
};

control.L2PTable.prototype.getCellValue = function (row, col) {
	var rst = null;
	try {
		var id = "";
		if (isNaN(col)) {
			id = col;
		} else {
			id = this.columns[parseInt(col)].id;
		}

		rst = eval("this.data[parseInt(row)]." + id + ";");
	} catch (ex) {
		console.log(ex);
		return null;
	}

	return rst;
};

control.L2PTable.prototype.setCellStyle = function (row, col, style) {
	try {
		var o1 = $("#" + this.getId() + "_inner-TableDataTd-row" + row + "-col" + col);
		var keys = Object.keys(style);
		for (var i = 0; i < keys.length; i++) {
			o1.css(keys[i].replace("_", "-"), eval("style." + keys[i]));
		}
	} catch (ex) {
		console.log(ex);
	}
};
