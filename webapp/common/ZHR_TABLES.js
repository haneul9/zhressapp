/* eslint-disable no-undef */
/* global common:true */
jQuery.sap.declare("common.ZHR_TABLES");

jQuery.sap.require("common.moment-with-locales");

common.ZHR_TABLES = {
	/*
	 *
	 */
	makeColumn : function(oController, oTable, vColumnInfo){
		if(!oTable) return;
		if(!vColumnInfo || !vColumnInfo.length) return;
		
		// var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
		var HoverIcon = sap.ui.require("common/HoverIcon");
		var oTableId = oTable.getId();
		var oColumns =oTable.getColumns();
		
		if(!oColumns || !oColumns.length) oTable.destroyColumns();

		for(var i=0; i<vColumnInfo.length; i++) {
			var oColumnId = vColumnInfo[i].id;
			var oColumn = new sap.ui.table.Column(oColumnId ? oTableId + oColumnId : "", {
				hAlign : "Center",
				flexible : false,
				autoResizable : true,
				resizable : ("resize" in vColumnInfo[i] && vColumnInfo[i].resize === false) ? false : true,
				showFilterMenuEntry : true
			});

			if(vColumnInfo[i].filter) {
				oColumn.setFilterProperty(vColumnInfo[i].type.indexOf("date") > -1 ? oColumnId + "Txt" : oColumnId);
			}
			if(vColumnInfo[i].sort) {
				oColumn.setSortProperty(oColumnId);
			}
			if(vColumnInfo[i].tooltip) {
				oColumn.addMultiLabel(new sap.m.HBox({
					alignItems: sap.m.FlexAlignItems.Center,
					items: [
						new sap.ui.commons.TextView({
							tooltip: new sap.ui.core.TooltipBase(),
							text: vColumnInfo[i].label,
							textAlign: vColumnInfo[i].plabel ? sap.ui.core.HorizontalAlign.Center : (vColumnInfo[i].headerAlign || vColumnInfo[i].align || sap.ui.core.HorizontalAlign.Center),
							width: "100%"
						})
						.addStyleClass(!vColumnInfo[i].plabel && vColumnInfo[i].required === true ? "required line-height-22px" : "line-height-22px"),
						new HoverIcon({
							src: "sap-icon://information",
							customData: new sap.ui.core.CustomData({
								key: "messages",
								value: vColumnInfo[i].tooltip
							}),
							hover: function(oEvent) {
								common.Common.onPressTableHeaderInformation.call(oController, oEvent, oEvent.getSource().data("messages"));
							},
							leave: function(oEvent) {
								common.Common.onPressTableHeaderInformation.call(oController, oEvent);
							}
						})
						.addStyleClass(sap.m.InputBase.ICON_CSS_CLASS + " thead-icon")
					]
				}));
			} else {
				oColumn.addMultiLabel(
					new sap.ui.commons.TextView({
						tooltip: new sap.ui.core.TooltipBase(),
						text: vColumnInfo[i].label,
						textAlign: vColumnInfo[i].plabel ? sap.ui.core.HorizontalAlign.Center : (vColumnInfo[i].headerAlign || vColumnInfo[i].align || sap.ui.core.HorizontalAlign.Center),
						width: "100%"
					})
					.addStyleClass(!vColumnInfo[i].plabel && vColumnInfo[i].required === true ? "required" : "")
				);
			}
			if(vColumnInfo[i].plabel) {
				if(vColumnInfo[i].ptooltip) {
					oColumn.addMultiLabel(new sap.m.HBox({
						alignItems: sap.m.FlexAlignItems.Center,
						items: [
							new sap.ui.commons.TextView({
								tooltip: new sap.ui.core.TooltipBase(),
								text: vColumnInfo[i].plabel,
								textAlign: oTable.hasStyleClass("multi-header") ? (vColumnInfo[i].headerAlign || sap.ui.core.HorizontalAlign.Center) : (vColumnInfo[i].align || sap.ui.core.HorizontalAlign.Center),
								width: "100%"
							})
							.addStyleClass(vColumnInfo[i].required === true ? "required line-height-22px" : "line-height-22px"),
							new HoverIcon({
								src: "sap-icon://information",
								customData: new sap.ui.core.CustomData({
									key: "messages",
									value: vColumnInfo[i].ptooltip
								}),
								hover: function(oEvent) {
									common.Common.onPressTableHeaderInformation.call(oController, oEvent, oEvent.getSource().data("messages"));
								},
								leave: function (oEvent) {
									common.Common.onPressTableHeaderInformation.call(oController, oEvent);
								}
							})
							.addStyleClass(sap.m.InputBase.ICON_CSS_CLASS + " thead-icon")
						]
					}));
				} else {
					oColumn.addMultiLabel(
						new sap.ui.commons.TextView({
							tooltip: new sap.ui.core.TooltipBase(),
							text: vColumnInfo[i].plabel,
							textAlign: oTable.hasStyleClass("multi-header") ? (vColumnInfo[i].headerAlign || sap.ui.core.HorizontalAlign.Center) : (vColumnInfo[i].align || sap.ui.core.HorizontalAlign.Center),
							width: "100%"
						})
						.addStyleClass(vColumnInfo[i].required === true ? "required" : "")
					);
				}
			}
			if(vColumnInfo[i].span > 0) {
				oColumn.setHeaderSpan([vColumnInfo[i].span, 1]);
			}
			if(vColumnInfo[i].width) {
				oColumn.setWidth(vColumnInfo[i].width);
			}
			if(vColumnInfo[i].align) {
				oColumn.setHAlign(vColumnInfo[i].align);
			}

			switch(vColumnInfo[i].type) {
				case "decimal" :
					oColumn.setTemplate(
						new sap.ui.commons.TextView({
							text: {
								path: oColumnId,
								formatter: function (v) {
									if(v && !isNaN(v)) {
										return String(parseFloat(v));
									} else {
										return "0";
									}
								}
							},
							textAlign: "Center",
							tooltip: new sap.ui.core.TooltipBase()
						}).addStyleClass("FontFamily")
					);

					break;
				case "template" :
					var getterOwnerInstance = vColumnInfo[i].templateGetterOwner || oController,
					templateGetter = vColumnInfo[i].templateGetter,
					templateGetterFunction = typeof templateGetter === "function"
						? templateGetter.bind(oColumn)
						: (typeof templateGetter === "string"
							? getterOwnerInstance[templateGetter].bind(oColumn)
							: function() { return null; });
					oColumn.setTemplate(templateGetterFunction(vColumnInfo[i], oController));
					break;
				case "string" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : "{" + oColumnId + "}",
						textAlign : common.Common.checkNull(vColumnInfo[i].align) ? "Center" :  vColumnInfo[i].align,
						tooltip: new sap.ui.core.TooltipBase()
					}).addStyleClass("FontFamily"));

					break;
				case "time" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : {
							path : oColumnId,
							formatter : function(fVal){
								if(fVal && typeof fVal === "object" && "ms" in fVal) {
									return moment(fVal.ms).subtract(9, "hours").format("HH:mm");
								} else if(fVal && (fVal.length === 4 || fVal.indexOf(":") > -1)) {
									return common.Common.timeFormatter(fVal);
								} else {
									return "";
								}
							}
						},
						textAlign : "Center",
						tooltip: new sap.ui.core.TooltipBase()
					}).addStyleClass("FontFamily"));

					break;
				case "currency" :
					oColumn.setTemplate(
						new sap.m.Text({
							textAlign: sap.ui.core.TextAlign.End,
							text: {
								path: oColumnId,
								formatter: common.Common.toCurrency
							}
						})
					)
					.setHAlign(sap.ui.core.HorizontalAlign.Right);

					break;
				case "money" :
					oColumn.setTemplate(
						new sap.ui.commons.TextView({
							textAlign: "End",
							text: {
								path: oColumnId,
								formatter: function(x) {
									if (x == null || x == "") return "";
									return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
								}
							},
							tooltip: new sap.ui.core.TooltipBase()
						}).addStyleClass("FontFamily")
					);

					break;
				case "number" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : "{" + oColumnId + "}",
						textAlign : "Right",
						tooltip: new sap.ui.core.TooltipBase()
					}).addStyleClass("FontFamily"));

					break;
				case "Checkbox" :
					oColumn.setTemplate(new sap.m.CheckBox({
						selected  : "{" + oColumnId + "}"
							}).addStyleClass("FontFamily"));
					oColumn.setWidth("50px");
					oColumn.setSorted(false);

					break;
				case "date" :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : {
							path : oColumnId,
							formatter : function(fVal){
								if(!fVal) return '';
								return common.Common.DateFormatter(fVal);
							}
						},
						textAlign : "Center",
						tooltip: new sap.ui.core.TooltipBase()
					}).addStyleClass("FontFamily"));

					break;
				default :
					oColumn.setTemplate(new sap.ui.commons.TextView({
						text : "{" + oColumnId + "}",
						textAlign : "Center",
						tooltip: new sap.ui.core.TooltipBase()
					}).addStyleClass("FontFamily"));

					break;
			}

			oTable.addColumn(oColumn);
		}

	}
};