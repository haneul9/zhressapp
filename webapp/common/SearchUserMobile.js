jQuery.sap.declare("common.SearchUserMobile");

jQuery.sap.require("common.Common");
jQuery.sap.require("common.JSONModelHelper");


common.SearchUserMobile = {
    /**
     * @memberOf common.SearchUserMobile
     */

    oController: null,
    EsBusyDialog: new sap.m.BusyDialog(),

    fPersaEnabled: true,
    searchAuth: null,

    vHeight: 330,
    clicks: 0,
    _vSPath: -1,
	
    initModels: function () {
        // Set Model
        if (!sap.ui.getCore().getModel("EmpSearchResult")) {
            sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "EmpSearchResult");
        }
        if (!sap.ui.getCore().getModel("EmpSearchCodeList")) {
            sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel(), "EmpSearchCodeList");
        }
        $.app.byId(common.SearchUserMobile.oController.PAGEID + "_EmpSearchResult_Table").setModel(sap.ui.getCore().getModel("EmpSearchResult"));
    },

    loadPersaControl: function () {
        var oController = common.SearchUserMobile.oController;
        var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");
        var aFilters = [
			new sap.ui.model.Filter("Percod", sap.ui.model.FilterOperator.EQ, oController.getSessionInfoByKey("Percod")),
			new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, oController.getSessionInfoByKey("Bukrs2"))
		];

        oPersa.setEnabled(common.SearchUserMobile.fPersaEnabled);

        if (common.SearchUserMobile.searchAuth === "A") {
            aFilters.push(new sap.ui.model.Filter("Mtype", sap.ui.model.FilterOperator.EQ, "A"));
        }

        $.app.getModel("ZHR_COMMON_SRV").read("/WerksListAuthSet", {
            async: false,
            filters: aFilters,
            success: function (oData) {
                if (oData && oData.results.length) {
                    oData.results.forEach(function (elem) {
                        oPersa.addItem(new sap.ui.core.Item({
                            key: elem.Persa,
                            text: elem.Pbtxt
                        }));
                    });

                    if (!oController._vPersa || common.SearchUserMobile.searchAuth === "A") {
                        oPersa.setSelectedKey(oPersa.getItemAt(0).getKey());
                        if((common.SearchUserMobile.searchAuth !== "A"))
                            oController._vPersa = oPersa.getItemAt(0).getKey();
                    } else {
                        oPersa.setSelectedKey(oController._vPersa);
                    }
                }
            },
            error: function (Res) {
                common.Common.log(Res);
                
                if(Res.response.body){
					var ErrorMessage = Res.response.body;
					var ErrorJSON = JSON.parse(ErrorMessage);
					
					if(ErrorJSON.error.innererror.errordetails && ErrorJSON.error.innererror.errordetails.length){
						sap.m.MessageBox.error(ErrorJSON.error.innererror.errordetails[0].message);
					} else {
						sap.m.MessageBox.error(ErrorMessage);
					}
				}
            }
        });
    },

    onAfterOpenSearch : function () {
        var oController = common.SearchUserMobile.oController;

        // Set Model
        common.SearchUserMobile.initModels();

        // ????????????
        if (common.SearchUserMobile._vPersa) {
            oController._vPersa = common.SearchUserMobile._vPersa;
        }
        common.SearchUserMobile.loadPersaControl();
    },

    onBeforeCloseSearchDialog: function () {
        var oController = common.SearchUserMobile.oController;
        var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");
        var oEname = sap.ui.getCore().byId(oController.PAGEID + "_ES_Ename");
        var oFulln = sap.ui.getCore().byId(oController.PAGEID + "_ES_Fulln");
        var oStat2 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat2");
        var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");
        var oZhgrade = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zhgrade");

        oEname.setValue("");
        oFulln.removeAllTokens();
        oFulln.destroyTokens();
        oFulln.setValue("");

        oStat2.removeAllItems();
        oStat2.destroyItems();
        if (oPersg) {
            oPersg.removeAllItems();
            oPersg.destroyItems();
        }
        
        if(oZhgrade){
        	oZhgrade.removeAllItems();
        	oZhgrade.destroyItems();
        	oZhgrade.setSelectedKey("0000");
        }

        oPersa.destroyItems();

        // common.SearchUserMobile._vPersa = null;
        // common.SearchUserMobile.fPersaEnabled = true;

        var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
        mEmpSearchResult.setData(null);
    },

    onClose: function () {
        var oDialog = sap.ui.getCore().byId(common.SearchUserMobile.oController.PAGEID + "_ES_Dialog");
        if (oDialog) oDialog.close();
    },

    onKeyUp: function (oEvent) {
        if (oEvent.which == 13) {
            common.SearchUserMobile.searchFilterBar();
        }
    },

    onChangePersa: function () {
        // ????????????, ????????????
        common.SearchUserMobile.loadCommonControls();
    },

    searchFilterBar: function () {
        var oController = common.SearchUserMobile.oController;
        var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
        var oTableModel = oTable.getModel();
        var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");
        var oEname = sap.ui.getCore().byId(oController.PAGEID + "_ES_Ename");
        var vActda = new Date().setHours(9);

        var oFilters = [
			new sap.ui.model.Filter("Percod", sap.ui.model.FilterOperator.EQ, oController.getSessionInfoByKey("Percod")),
			new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, oController.getSessionInfoByKey("Bukrs2")),
			new sap.ui.model.Filter("Actty", sap.ui.model.FilterOperator.EQ, $.app.APP_ID == "ZUI5_HR_HRDoc.Page" ? "A" : common.SearchUserMobile.searchAuth ? common.SearchUserMobile.searchAuth : $.app.getAuth()),
			new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oPersa.getSelectedKey()),
			new sap.ui.model.Filter("Stat2", sap.ui.model.FilterOperator.EQ, "3"),
			new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(vActda))
		];
        if (oEname.getValue() == "") {
            sap.m.MessageBox.alert(oController.getBundleText("MSG_00070")); // ????????? ????????? ??????????????? ?????????. 
            return;
        }
        
        if (oEname.getValue() != "") {
            if (oEname.getValue().length < 2) {
                sap.m.MessageBox.alert(oController.getBundleText("MSG_00064")); // ????????? 2??? ??????????????? ?????????.
                return;
            }
            oFilters.push(new sap.ui.model.Filter("Ename", sap.ui.model.FilterOperator.EQ, oEname.getValue()));
        }

        if (oFilters.length < 4) {
            sap.m.MessageBox.alert(oController.getBundleText("MSG_00063")); // ????????? 2???????????? ??????????????? ????????? ?????????.
            return;
        }

        var vEmpSearchResult = {
            EmpSearchResultSet: []
        };
		
		common.SearchUserMobile.EsBusyDialog.open(); 
        common.Common.getPromise(
            function () {
                $.app.getModel("ZHR_COMMON_SRV").read("/EmpSearchResultSet", {
                    async: false,
                    filters: oFilters,
                    success: function (oData) {
                        if (oData && oData.results) {
                            vEmpSearchResult.EmpSearchResultSet = oData.results.map(function (elem) {
                                return $.extend(true, elem, {
                                    Chck: false
                                });
                            });
                            oTableModel.setData(vEmpSearchResult);
                            common.SearchUserMobile.searchPhoto();
                        }
                    },
                    error: function (oResponse) {
                        common.Common.log(oResponse);
                    }
                });
            }
        ).then(function () {
            common.SearchUserMobile.EsBusyDialog.close();
        });
    },
    
    searchPhoto :function(){
    	var oController = common.SearchUserMobile.oController;
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
		var oTableModel = oTable.getModel();
		var vData = oTableModel.getProperty("/EmpSearchResultSet");
		var promises = [];
		
		var isPernr = function(vPernr) {
			for(var i = 0; i< vData.length; i++){
				if(vData[i].Pernr === vPernr){
					return i;
				}
			}
		};
		
		vData.forEach(function(o){
			promises.push(
				new Promise(function(){
					 new JSONModelHelper()
                            .url("/odata/fix/Photo?$filter=userId eq '" + parseInt(o.Pernr) + "' and photoType eq '1'")
                            .select("photo")
                            .setAsync(true)
                            .attachRequestCompleted(function () {
                                var data = this.getData().d;
                                var oPhoto = "";
								if (data && data.results.length) {
                                    oPhoto = "data:text/plain;base64," + data.results[0].photo;
                                } else {
                                    oPhoto = "images/male.jpg";
                                }
								oTableModel.setProperty("/EmpSearchResultSet/" + isPernr(o.Pernr) + "/photo",  oPhoto  );
						    })
                            .attachRequestFailed(function () {
                                var oPhoto = "images/male.jpg";
                                oTableModel.setProperty("/EmpSearchResultSet/" +isPernr(o.Pernr) + "/photo",  oPhoto  );
						    })
                            .load();
					})		
			);
		});
		
		Promise.all(promises);
    },
    
	onESSelectPerson: function (oEvent) {
		var oController = common.SearchUserMobile.oController;
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
        var oTableModel = oTable.getModel();
		var vSpath = oEvent.getSource().getParent().getBindingContext().getPath(),
			oRowData = $.extend(true, {}, oTableModel.getProperty(vSpath));
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			id: oController.LoginSession.getProperty("/Data/FromPageId"),
			data : oRowData
		});
	},
    
    navBack : function(){
		var oController = common.SearchUserMobile.oController;
		sap.ui.getCore().getEventBus().publish("nav", "to", {
		      id : oController.LoginSession.getProperty("/Data/FromPageId")
		});
    }

};