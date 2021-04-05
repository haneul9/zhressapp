jQuery.sap.require("common.Formatter");
jQuery.sap.require("common.Common");

sap.ui.jsfragment("fragment.ActTimelinePopover", {
	createContent: function (oController) {
		var tlItem = new sap.suite.ui.commons.TimelineItem(oController.PAGEID + "_AT_TimeItem", {
			dateTime: {
				path: "Datim",
				formatter: function (fVal) {
					if (fVal == null) return null;
					//return new Date(common.Common.setTime(new Date(fVal)));
					return new Date(fVal);
				}
			},
			userNameClickable: false,
			userName: "{Ename}",
			title: {
				path: "Reqst",
				formatter: function (fVal) {
					if (fVal == "10") return oController.getBundleText("MSG_00042");	// 발령품의서를 저장 하였습니다.
					else if (fVal == "20") return oController.getBundleText("MSG_00043");	// 발령품의서를 결재 상신 하였습니다.
					else if (fVal == "30") return oController.getBundleText("MSG_00044");	// 발령품의서를 승인 하였습니다.
					else if (fVal == "40") return oController.getBundleText("MSG_00045");	// 발령품의서를 반려 하였습니다.
					else if (fVal == "50") return oController.getBundleText("MSG_00046");	// 발령품의서를 확정 하였습니다.
					else if (fVal == "51") return oController.getBundleText("MSG_00047");	// 발령품의서를 게시 하였습니다.
					else if (fVal == "52") return oController.getBundleText("MSG_00048");	// 발령품의서를 게시취소 하였습니다.
				}
			},
			icon: {
				path: "Reqst",
				formatter: function (fVal) {
					if (fVal == "10") return "sap-icon://save";
					else if (fVal == "20") return "sap-icon://approvals";
					else if (fVal == "30") return "sap-icon://employee-approvals";
					else if (fVal == "40") return "sap-icon://reject";
					else if (fVal == "50") return "sap-icon://accept";
					else if (fVal == "51") return "sap-icon://notification-2";
					else if (fVal == "52") return "sap-icon://notification-2";
				}
			}
		}).addStyleClass("L2P13Font");

		var oTimeline = new sap.suite.ui.commons.Timeline(oController.PAGEID + "_AT_Timeline", {
			sortOldestFirst: true,
			enableAllInFilterItem: false,
			showHeaderBar: false,
			growing: false,
			noDataText: ""
		});
		oTimeline.setModel(sap.ui.getCore().getModel("ZHR_ACTIONAPP_SRV"));

		var oLayout = new sap.ui.commons.layout.MatrixLayout({
			width: "100%",
			layoutFixed: false,
			columns: 1
		});

		var oRow = new sap.ui.commons.layout.MatrixLayoutRow({ height: "400px" });

		var oCell = new sap.ui.commons.layout.MatrixLayoutCell({
			hAlign: sap.ui.commons.layout.HAlign.Begin,
			vAlign: sap.ui.commons.layout.VAlign.Top,
			content: oTimeline
		}).addStyleClass("L2PBackgroundWhite");

		oRow.addCell(oCell);
		oLayout.addRow(oRow);

		var oPopover = new sap.m.Popover(oController.PAGEID + "_AT_Popover", {
			title: "{i18n>LABEL_00170}",	// 진행상태
			placement: sap.m.PlacementType.Auto,
			content: oLayout,
			contentWidth: "450px",
			beforeOpen: oController.onBeforeOpenPopoverActTimeline,
			endButton: new sap.m.Button({
				icon: "sap-icon://sys-cancel-2",
				press: function (oEvent) {
					oEvent.getSource().getParent().getParent().close();
				}
			})
		});

		if (!jQuery.support.touch) {
			// apply compact mode if touch is not supported
			oPopover.addStyleClass("sapUiSizeCompact");
		}

		return oPopover;
	}
});
