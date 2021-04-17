sap.ui.jsfragment("ZUI5_HR_Perinfo.m.fragment.Car", {

	createContent: function(oController) {

		return new sap.m.VBox({
			height: "100%",
			items: [
              	this.getInfoHBox(oController),
			]
		});
	},
	
	getInfoHBox: function(oController) {
        return new sap.m.VBox({
            items: [
            // 	 new sap.m.HBox({
            //         height: "55px",
            //         alignItems: sap.m.FlexAlignItems.Center,
            //         items: [				
            //             new sap.m.Label({ layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
										  //width: "100%", text: "{i18n>LABEL_37030}" }).addStyleClass("sub-title"), // 기본차량
            //         ]
            //     }).addStyleClass("sub-con-titleBar-both"),
                
                new sap.m.HBox({
                    height: "40px",
                    alignItems: sap.m.FlexAlignItems.Center,
                    items: [
                        new sap.m.Label({ width: "150px", text: "{i18n>LABEL_37031}", textAlign : "Left" }).addStyleClass("sub-conRead-title"), // 차량 명
                        new sap.m.Label({
                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                            text: "{Cartype}",
							textAlign : "End",
							width: "100%"
                        })
                    ]
                }),
                new sap.m.HBox({
                    height: "40px",
                    alignItems: sap.m.FlexAlignItems.Center,
                    items: [
                        new sap.m.Label({ width: "150px", text: "{i18n>LABEL_37032}", textAlign : "Left" }).addStyleClass("sub-conRead-title"), // 차량번호
                        new sap.m.Label({
                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                            text: "{Carnum}",
							textAlign : "End",
							width: "100%"
                        })
                    ]
                }),
                new sap.m.HBox({
                    height: "40px",
                    alignItems: sap.m.FlexAlignItems.Center,
                    items: [
                        new sap.m.Label({ width: "150px", text: "{i18n>LABEL_37033}", textAlign : "Left"}).addStyleClass("sub-conRead-title"), // OD지원
                        new sap.m.Label({
                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                            text: "{Odamount}",
							textAlign : "End",
							width: "100%"
                        })
                    ]
                }),
                new sap.m.HBox({
                    height: "40px",
                    alignItems: sap.m.FlexAlignItems.Center,
                    items: [
                        new sap.m.Label({ width: "150px", text: "{i18n>LABEL_37034}", textAlign : "Left"}).addStyleClass("sub-conRead-title"), // 주차
                        new sap.ui.core.Icon({ layoutData: new sap.m.FlexItemData({ growFactor: 1 }).setStyleClass("AlignEnd"),
    					    src: "sap-icon://accept", 
    					    size: "1.0rem", 
    					    color: "#8DC63F",
    					    visible : {
	    					   	path : "Parkticket",
	    					   	formatter : function(v){
	    					   		return v === "X" ? true : false         
	    					   	} 
    					    }
                        }),
         //               new sap.m.CheckBox({
         //           	    layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
		 	 				// selected : "{Parkticket}",
		 	 				// editable: false }).addStyleClass("AlignEnd")
                    ]
                }),
                new sap.m.HBox({
                    height: "40px",
                    alignItems: sap.m.FlexAlignItems.Center,
                    items: [
                        new sap.m.Label({ width: "150px", text: "{i18n>LABEL_37035}", textAlign : "Left"}).addStyleClass("sub-conRead-title"), // 배기량
                        new sap.m.Label({
                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                            text: "{Bagirang}" + " CC",
							textAlign : "End",
							width: "100%"
                        })
                    ]
                }),
                new sap.m.HBox({
                    height: "40px",
                    alignItems: sap.m.FlexAlignItems.Center,
                    items: [
                        new sap.m.Label({ width: "150px", text: "{i18n>LABEL_37041}", textAlign : "Left"}).addStyleClass("sub-conRead-title"), // 사용연료
                        new sap.m.Label({
                            layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                            text: "{FuelT}",
							textAlign : "End",
							width: "100%"
                        })
                    ]
                }),
                new sap.m.HBox({
                    height: "40px",
                    alignItems: sap.m.FlexAlignItems.Center,
                    items: [
                        new sap.m.Label({ width: "150px", text: "{i18n>LABEL_37036}", textAlign : "Left"}).addStyleClass("sub-conRead-title"), // 하이브리드
                        new sap.ui.core.Icon({ layoutData: new sap.m.FlexItemData({ growFactor: 1 }).setStyleClass("AlignEnd"),
    					    src: "sap-icon://accept", 
    					    size: "1.0rem", 
    					    color: "#8DC63F",
    					    visible : {
	    					   	path : "Hybrid",
	    					   	formatter : function(v){
	    					   		return v === "X" ? true : false         
	    					   	} 
    					   }
                        }),
         //               new sap.m.CheckBox({
         //               	layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
		 	 				// selected : "{Hybrid}",
		 	 				// editable: false })
                    ]
                })
            ]
        })		
		.setModel(oController._CarJSonModel)
        .bindElement("/Data");
    }

});