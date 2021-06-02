sap.ui.jsfragment("ZUI5_HR_Dashboard.fragment.content03", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oJSONModel = new sap.ui.model.json.JSONModel();
		
		// 미평가
		var avatargroup1 = new sap.f.AvatarGroup(oController.PAGEID + "_Avatargroup1", {
			avatarDisplaySize : "S",
			groupType : "Group",
			items : {
				path : "/Data1",
				template : new sap.f.AvatarGroupItem({
							   initials : "{initials}",
							   src : "{photo}"
						   }) 
			}
		});
		
		// A
		var avatargroup2 = new sap.f.AvatarGroup(oController.PAGEID + "_Avatargroup2", {
			avatarDisplaySize : "S",
			groupType : "Group",
			items : {
				path : "/Data2",
				template : new sap.f.AvatarGroupItem({
							   initials : "{initials}",
							   src : "{photo}"
						   }) 
			}
		});
		
		// B
		var avatargroup3 = new sap.f.AvatarGroup(oController.PAGEID + "_Avatargroup3", {
			avatarDisplaySize : "S",
			groupType : "Group",
			items : {
				path : "/Data3",
				template : new sap.f.AvatarGroupItem({
							   initials : "{initials}",
							   src : "{photo}"
						   }) 
			}
		});
		
		// C
		var avatargroup4 = new sap.f.AvatarGroup(oController.PAGEID + "_Avatargroup4", {
			avatarDisplaySize : "S",
			groupType : "Group",
			items : {
				path : "/Data4",
				template : new sap.f.AvatarGroupItem({
							   initials : "{initials}",
							   src : "{photo}"
						   }) 
			}
		});
		
		for(var i=1; i<=4; i++){
			eval("avatargroup" + i + ".setModel(oJSONModel);");
		}
		
		var oMatrix = new sap.ui.commons.layout.MatrixLayout({
			columns : 3,
			width : "100%",
			widths : ["20%", "10px", "80%"],
			rows : [new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_Row2", {
						height : "55px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.ui.layout.HorizontalLayout({
												 	content : [new sap.m.Text({text : "A"}).addStyleClass("Font14 paddingtop12 FontWhite FontBold paddingLeft1")]
												}).addStyleClass("grade_A")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [avatargroup2],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"}),
					new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_Row3", {
						height : "55px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.ui.layout.HorizontalLayout({
											 		content : [new sap.m.Text({text : "B"}).addStyleClass("Font14 paddingtop12 FontWhite FontBold paddingLeft1")]
												}).addStyleClass("grade_B")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [avatargroup3],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"}),
					new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_Row4", {
						height : "55px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.ui.layout.HorizontalLayout({
											 		content : [new sap.m.Text({text : "C"}).addStyleClass("Font14 paddingtop12 FontWhite FontBold paddingLeft1")]
												}).addStyleClass("grade_C")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [avatargroup4],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 })]
					}),
					new sap.ui.commons.layout.MatrixLayoutRow({height : "5px"}),
					new sap.ui.commons.layout.MatrixLayoutRow(oController.PAGEID + "_Row1", {
						height : "55px",
						cells : [new sap.ui.commons.layout.MatrixLayoutCell({
									 content : [new sap.ui.layout.HorizontalLayout({
											 		content : [new sap.m.Text({text : oBundleText.getText("LABEL_05108")}).addStyleClass("Font13 paddingtop12 FontWhite FontBold")] // 미평가
												}).addStyleClass("grade_N")],
									 hAlign : "Center",
									 vAlign : "Middle"
								 }),
								 new sap.ui.commons.layout.MatrixLayoutCell(),
								 new sap.ui.commons.layout.MatrixLayoutCell({
								 	 content : [avatargroup1],
								 	 hAlign : "Begin",
								 	 vAlign : "Middle"
								 })]
					})]
		});
		
		var oScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_Content3", {
			horizontal : false,
			vertical : false,
			width : "",
			height : "",
			content : [oMatrix] 
		}).addStyleClass("dashboard_content2");
		
		var oContent = new sap.ui.layout.VerticalLayout({
			content : [new sap.m.Toolbar({
						   height : "50px",
						   content : [new sap.m.ToolbarSpacer({width : "18px"}),
									  new sap.m.Text({text : oBundleText.getText("LABEL_05107")}).addStyleClass("dashboard_title_text"), // 업적&역량 평가
									  new sap.m.ToolbarSpacer(),
									  new sap.m.Button({
									  	  icon : "sap-icon://display-more",
									  	  type : "Ghost",
									  	  press : function(){
										  	  	// window.open(
										  	  	// 	(common.Common.getOperationMode() == "DEV" ? "https://hcm10preview.sapsf.com" : "https://performancemanager10.successfactors.com")
										  	  	// 		+ "/sf/customExternalModule?urlName=EvalAchvCompGradeConfirmApp&moduleId=PERFORMANCE"
										  	  	// );
												var url = "";
												if(common.Common.isLOCAL() == true){
													url = "/webapp/index.html?popup=EvalAchvCompGradeConfirmApp.html&mid=1850&pernr=" + oController.getSessionInfoByKey("Pernr");
												} else {
													url = "/index.html?popup=EvalAchvCompGradeConfirmApp.html&mid=1850";
												}

												window.open(url);
									  	  }
									  }),
									  new sap.m.ToolbarSpacer({width : "10px"})]
					   }).addStyleClass("dashboard_title"),
					   oScrollContainer]
		}).addStyleClass("dashboard_layout1");
		
		return oContent;
	}
});
