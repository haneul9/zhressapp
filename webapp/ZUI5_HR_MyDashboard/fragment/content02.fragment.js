sap.ui.jsfragment("ZUI5_HR_MyDashboard.fragment.content02", {
	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf fragment.SelectMassn
	*/

	createContent : function(oController) {
		var oTimeline = new sap.suite.ui.commons.Timeline(oController.PAGEID + "_Timeline", {
			// height : "",
			alignment : "Right",
			axisOrientation : "Vertical",
			enableScroll : false,
			forceGrowing : false,
			showFilterBar : false,
			growingThreshold : 0,
			noDataText : "데이터가 없습니다.",
			content : {
				path : "/Data",
				template : new sap.suite.ui.commons.TimelineItem({
							   icon : {
							   		path : "index",
							   		formatter : function(fVal){
							   			switch(fVal){
							   				case "1": // 활동
							   					return "sap-icon://activity-2";
							   					break;
							   				case "2": // 실적
							   					return "sap-icon://activity-items";
							   					break;
						   					case "3": // 활동 - 피드백
					   						case "4": // 실적 - 피드백
				   							case "5": // 활동 - comment
					   						case "6": // 피드백
					   							return "sap-icon://feedback";
					   							break;
						   					default:
						   						return "";
							   			}
							   		}
							   },
							   useIconTooltip : false,
							   //status : "{status}",
							   userName : "{Ename}",
							   title : "{title}",
							   text : "{comment}",
							   dateTime : "{datetime}",
							   userPicture : "{photo}"
						   })
			}
		});
		
		oTimeline.setModel(new sap.ui.model.json.JSONModel());
		oTimeline.bindElement("/Data");
		
		var oScrollContainer = new sap.m.ScrollContainer(oController.PAGEID + "_Content2", {
			horizontal : false,
			vertical : true,
			width : "",
			height : "460px",
			content : [oTimeline]
		});
		
		var oContent = new sap.ui.layout.VerticalLayout({
			content : [new sap.m.Toolbar({
						   content : [new sap.m.Text({text : "Timeline"}).addStyleClass("Font15 FontBold"),
									  new sap.m.ToolbarSpacer(),
									  new sap.m.Button({
									  	  icon : "sap-icon://refresh",
									  	  type : "Ghost",
									  	  press : function(){
									  			oController.onSearch2();
									  			oController.onSearch4();
									  	  }
									  })]
					   }).addStyleClass("toolbarNoBottomLine"),
					   oScrollContainer]
		}).addStyleClass("overviewlayout");
		
		return oContent;
	}
});
