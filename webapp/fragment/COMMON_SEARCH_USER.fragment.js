jQuery.sap.require("common.SearchUser");

sap.ui.jsfragment("fragment.COMMON_SEARCH_USER", {
	createContent: function (oController) {
		var oLayoutOrgTree = new sap.ui.layout.VerticalLayout("COMMON_SEARCH_USER_OrgTree", {
			width: "100%"
		}).addStyleClass("L2POrgTree");

		oLayoutOrgTree.addDelegate({
			onAfterRendering: function () {
				common.SearchUser.createOrgTree(oController.PAGEID);
			}
		});

		/*
		 * 사원검색 탭의 Left Part
		 * 검색조건 및 검색결과 리스트를 표시한다.
		 */
		var oMatrixLayoutTab2_Left = new sap.ui.commons.layout.MatrixLayout({
			layoutFixed: true,
			columns: 3,
			widths: ["20%", "65%", "15%"],
			width: "100%"
		});

		var searchName = new sap.ui.commons.TextField("COMMON_SEARCH_USER_SFIELD1").addStyleClass("L2P12Font");
		searchName.attachBrowserEvent("keyup", common.SearchUser.onKeyUp);

		var searchDept = new sap.ui.commons.TextField("COMMON_SEARCH_USER_SFIELD2").addStyleClass("L2P12Font");
		searchDept.attachBrowserEvent("keyup", common.SearchUser.onKeyUp);

		oMatrixLayoutTab2_Left.createRow(
			new sap.m.Label({ text: "제직구분" }).addStyleClass("L2P12Font"),
			searchName,
			new sap.ui.commons.Label()
		);
		oMatrixLayoutTab2_Left.createRow(
			new sap.m.Label({ text: "사원그룹" }).addStyleClass("L2P12Font"),
			searchDept,
			new sap.ui.commons.Label()
		);
		oMatrixLayoutTab2_Left.createRow(
			new sap.m.Label({ text: "사원하위그룹" }).addStyleClass("L2P12Font"),
			new sap.ui.commons.DropdownBox("COMMON_SEARCH_USER_SFIELD3", {
				items: [new sap.ui.core.ListItem({ text: "전체 직책" })]
			}).addStyleClass("L2P12Font"),
			new sap.ui.commons.Button({
				icon: "sap-icon://search",
				press: common.SearchUser.searchPerson
			})
		);

		var oLayoutLeft_Search = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content: [oMatrixLayoutTab2_Left]
		}).addStyleClass("L2PSearchBox");

		var oTable1 = new sap.ui.table.Table("COMMON_SEARCH_USER_Table1", {
			visibleRowCount: 11,
			firstVisibleRow: 11,
			selectionMode: sap.ui.table.SelectionMode.Single,
			showOverlay: false,
			selectionBehavior: sap.ui.table.SelectionBehavior.RowOnly
		});
		oTable1.addColumn(
			new sap.ui.table.Column({
				label: new sap.ui.commons.Label({ text: "{i18n>COMMON_SEARCH_USER_COLUMN1}", textAlign: "Center" }).addStyleClass(
					"L2P12Font"
				),
				template: new sap.ui.commons.TextView({ text: "{Orgtx}", textAlign: "Center" }).addStyleClass("L2P12Font"),
				hAlign: sap.ui.core.HorizontalAlign.Center
			})
		);

		oTable1.addColumn(
			new sap.ui.table.Column({
				label: new sap.ui.commons.Label({ text: "{i18n>COMMON_SEARCH_USER_COLUMN2}", textAlign: "Center" }).addStyleClass(
					"L2P12Font"
				),
				template: new sap.ui.commons.TextView({ text: "{Ename}", textAlign: "Center" }).addStyleClass("L2P12Font"),
				hAlign: sap.ui.core.HorizontalAlign.Center
			})
		);

		oTable1.addColumn(
			new sap.ui.table.Column({
				label: new sap.ui.commons.Label({ text: "{i18n>COMMON_SEARCH_USER_COLUMN3}", textAlign: "Center" }).addStyleClass(
					"L2P12Font"
				),
				template: new sap.ui.commons.TextView({ text: "{JikgNm}", textAlign: "Center" }).addStyleClass("L2Pfont12"),
				hAlign: sap.ui.core.HorizontalAlign.Center
			})
		);

		oTable1.addColumn(
			new sap.ui.table.Column({
				label: new sap.ui.commons.Label({ text: "{i18n>COMMON_SEARCH_USER_COLUMN4}", textAlign: "Center" }).addStyleClass(
					"L2P12Font"
				),
				template: new sap.ui.commons.TextView({ text: "{JikcNm}", textAlign: "Center" }).addStyleClass("L2Pfont12"),
				hAlign: sap.ui.core.HorizontalAlign.Center
			})
		);

		var oLayoutSearch = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content: [
				new sap.ui.core.HTML({ content: "<div style='height:10px'> </div>", preferDOM: false }),
				oLayoutLeft_Search,
				new sap.ui.core.HTML({ content: "<div style='height:10px'> </div>", preferDOM: false }),
				oTable1
			]
		});

		var oIconTabBar = new sap.m.IconTabBar("COMMON_SEARCH_USER_ICONTABBAR", {
			upperCase: true,
			selectedKey: "1",
			select: common.SearchUser.handleIconTabBarSelect,
			items: [
				new sap.m.IconTabFilter({
					key: "1",
					icon: "sap-icon://org-chart",
					text: "{i18n>COMMON_SEARCH_USER_TAB_NAME1}",
					content: [oLayoutOrgTree]
				}),
				new sap.m.IconTabFilter({
					key: "2",
					icon: "sap-icon://collaborate",
					text: "{i18n>COMMON_SEARCH_USER_TAB_NAME2}",
					content: [oLayoutSearch]
				})
			]
		}).addStyleClass("L2PESDialog");

		var oDialog = new sap.ui.commons.Dialog("COMMON_SEARCH_USER_Dialog", {
			title: "{i18n>COMMON_SEARCH_USER_TITLE}",
			width: "400px",
			height: "670px",
			modal: true,
			buttons: [
				new sap.ui.commons.Button({
					icon: "sap-icon://accept",
					text: "{i18n>BTN_CONFIRM}",
					press: common.SearchUser.onConfirm
				}),
				new sap.ui.commons.Button({
					icon: "sap-icon://sys-cancel-2",
					text: "{i18n>BTN_CANCEL}",
					press: common.SearchUser.onClose
				})
			],
			content: [oIconTabBar]
		});

		return oDialog;
	}
});
