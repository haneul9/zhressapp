sap.ui.define(
    [
        "common/Common" //
    ],
    function (Common) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_PerinfoNewEmp.fragment.School-code", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */

            createContent: function (oController) {
            	var beforeOpenDialog = function(oEvent){
							
					oSearchField.setValue("");
					oList.removeSelections(true);
					
					onSearch();
				};
		
				var onSearch = function(oEvent) {
					var oFilters = [];
						oFilters.push(new sap.ui.model.Filter("Text", sap.ui.model.FilterOperator.Contains, oSearchField.getValue()));
				    
					oList.getBinding("items").filter(oFilters);
				};
				
				var onCancel = function(oEvent) {
					var oBinding = oList.getBinding("items");
				    	oBinding.filter([]);
				    
				    oList.setSelectedItemById(null);
				};
				
				var onSelect = function(oEvent){
					var vContext = oList.getSelectedContexts()[0];
					
					var Flag = oDialog.getModel().getProperty("/Data/Flag");
					
					if(!vContext){
						sap.m.MessageBox.error(oController.getBundleText("MSG_76002") // ${Flag}을 선택하십시오.
													.interpolate(Flag == "Ausbi" ? oController.getBundleText("LABEL_76063") : oController.getBundleText("LABEL_76065")));	// 교육기관명, 전공
						return;
					}
					
					if(oController.PAGEID == "PerinfoNewEmpDetail-School"){
						if(Flag == "Ausbi"){
							oController._DetailJSonModel.setProperty("/Data/Ausbi", oList.getModel().getProperty(vContext.sPath + "/Code"));
							oController._DetailJSonModel.setProperty("/Data/Insti", oList.getModel().getProperty(vContext.sPath + "/Text"));
						} else {
							oController._DetailJSonModel.setProperty("/Data/Sltp1", oList.getModel().getProperty(vContext.sPath + "/Code"));
							oController._DetailJSonModel.setProperty("/Data/Ftext1", oList.getModel().getProperty(vContext.sPath + "/Text"));
						}
					} else {
						if(Flag == "Ausbi"){
							oController._SchoolDialog.getModel().setProperty("/Data/Ausbi", oList.getModel().getProperty(vContext.sPath + "/Code"));
							oController._SchoolDialog.getModel().setProperty("/Data/Insti", oList.getModel().getProperty(vContext.sPath + "/Text"));
						} else {
							oController._SchoolDialog.getModel().setProperty("/Data/Sltp1", oList.getModel().getProperty(vContext.sPath + "/Code"));
							oController._SchoolDialog.getModel().setProperty("/Data/Ftext1", oList.getModel().getProperty(vContext.sPath + "/Text"));
						}
					}
					
					oDialog.close();
				};
            	
                var oJSONModel = new sap.ui.model.json.JSONModel();
				
				var oList = new sap.m.List(oController.PAGEID + "_SchoolCodeList", {
					items : {
						path : "/Data",
						template  : new sap.m.StandardListItem({
										title : "{Text} ({Code})"
									})
					},
					growing : true,
					growingScrollToLoad : true,
					rememberSelections : false,
					mode : "SingleSelectMaster"
				});
				
				oList.setModel(oJSONModel);
				oList.attachBrowserEvent("dblclick", onSelect);
				
				var oListScroll = new sap.m.ScrollContainer({
					width : "100%",
					height : "450px",
					horizontal : false,
					vertical : true,
					content : [oList]
				});
		
				var oSearchField = new sap.m.SearchField({
					showSearchButton : true,
					width : "100%",
					liveChange : onSearch,
					search : onSearch
				});

                var oDialog = new sap.m.Dialog({
                    contentWidth: "500px",
                    contentHeight: "",
                    draggable: false,
                    horizontalScrolling: false,
                    content: [oSearchField, oListScroll],
                    title : {
                    	path : "Flag",
                    	formatter : function(fVal){
                    								// 교육기관구분 검색						// 전공명 검색
                    		return fVal == "Ausbi" ? oController.getBundleText("LABEL_76086") : oController.getBundleText("LABEL_76087");
                    	}
                    },
                    beforeOpen : beforeOpenDialog,
                    buttons: [
                        new sap.m.Button({
                            text: "{i18n>LABEL_00118}", // 선택
                        	press : onSelect
                        }).addStyleClass("button-dark"),
                        new sap.m.Button({
                            type: "Default",
                            text: "{i18n>LABEL_06122}", // 닫기
                            press: function () {
                                oDialog.close();
                            }
                        }).addStyleClass("button-default custom-button-divide")
                    ]
                }).addStyleClass("custom-dialog-popup");

                oDialog.setModel(new sap.ui.model.json.JSONModel());
                oDialog.bindElement("/Data");

                return oDialog;
            }
        });
    }
);
