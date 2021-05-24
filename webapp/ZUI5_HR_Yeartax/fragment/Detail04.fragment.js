sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04", {
	/** 소득공제 **/
	createContent : function(oController) {
		
		var oPanel1 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								content : [new sap.m.Text({text : "세액감면 및 세액공제 - 보험료"}).addStyleClass("Font15 FontBold")]
							 }).addStyleClass("ToolbarNoBottomLine")],
			content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_01", oController)]
		});
		
		var oPanel2 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								content : [new sap.m.Text({text : "세액감면 및 세액공제 - 의료비"}).addStyleClass("Font15 FontBold")]
							 }).addStyleClass("ToolbarNoBottomLine")],
			content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_02", oController)]
		});
		
		var oPanel3 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								content : [new sap.m.Text({text : "세액감면 및 세액공제 - 교육비"}).addStyleClass("Font15 FontBold")]
							 }).addStyleClass("ToolbarNoBottomLine")],
			content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_03", oController)]
		});
		
		var oPanel4 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								content : [new sap.m.Text({text : "세액감면 및 세액공제 - 신용카드 등"}).addStyleClass("Font15 FontBold")]
							 }).addStyleClass("ToolbarNoBottomLine")],
			content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_04", oController)]
		});
		
		var oPanel5 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								content : [new sap.m.Text({text : "특별공제 - 장기주택 저당차입금 이자상환액"}).addStyleClass("Font15 FontBold")]
							 }).addStyleClass("ToolbarNoBottomLine")],
			content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_05", oController)]
		});
		
		var oPanel6 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								content : [new sap.m.Text({text : "특별공제 - 주택자금"}).addStyleClass("Font15 FontBold")]
							 }).addStyleClass("ToolbarNoBottomLine")],
			content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_06", oController)]
		});
		
		var oPanel7 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								content : [new sap.m.Text({text : "그 밖의 소득공제 - 주택마련저축"}).addStyleClass("Font15 FontBold")]
							 }).addStyleClass("ToolbarNoBottomLine")],
			content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_07", oController)]
		});

		var oPanel8 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								content : [new sap.m.Text({text : "그 밖의 소득공제 - 개인연금 저축공제"}).addStyleClass("Font15 FontBold")]
							 }).addStyleClass("ToolbarNoBottomLine")],
			content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_08", oController)]
		});

		var oPanel9 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								content : [new sap.m.Text({text : "세액감면 및 세액공제 - 퇴직연금 및 연금저축"}).addStyleClass("Font15 FontBold")]
							 }).addStyleClass("ToolbarNoBottomLine")],
			content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_09", oController)]
		});
		
		var oPanel10 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								content : [new sap.m.Text({text : "세액감면 및 세액공제 - 기부금"}).addStyleClass("Font15 FontBold")]
							 }).addStyleClass("ToolbarNoBottomLine")],
			content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_10", oController)]
		});
		
		var oPanel11 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								content : [new sap.m.Text({text : "그 밖의 소득공제 - 기타"}).addStyleClass("Font15 FontBold")]
							 }).addStyleClass("ToolbarNoBottomLine")],
			content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_11", oController)]
		});

		var oPanel12 = new sap.m.Panel({
			expandable : true,
			expanded : true,
			headerToolbar : [new sap.m.Toolbar({
								content : [new sap.m.Text({text : "그 밖의 소득공제 - 장기집합투자증권저축"}).addStyleClass("Font15 FontBold")]
							 }).addStyleClass("ToolbarNoBottomLine")],
			content : [sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_12", oController)]
		});
		
		var oLayout = new sap.ui.layout.VerticalLayout({
			content : [oPanel1, oPanel2, oPanel3, oPanel4, oPanel5, oPanel6, oPanel7, oPanel8, oPanel9, oPanel10, oPanel11, oPanel12]
		});
		
		oLayout.setModel(oController._DetailJSonModel);
		oLayout.bindElement("/Data4");
		
		return oLayout;
	}

});
