jQuery.sap.require("sap.m.MessageBox");

sap.ui.define([
        "common/Common",
        "common/CommonController",
        "common/JSONModelHelper",
        "common/PageHelper"], 
        function (Common, CommonController, JSONModelHelper, PageHelper) {
        "use strict";

        return CommonController.extend("ZUI5_HR_Yeartax.YearTaxList", {
        PAGEID : "YearTaxList",

        _vPersa : "",
        _vPernr : "",
        _SortDialog : null,
        _Actty : "E" ,  //ESS 에서 호출
        
        _ListCondJSonModel : new sap.ui.model.json.JSONModel(),
        
        _BusyDialog : new sap.m.BusyDialog(),
        BusyDialog : new sap.m.BusyDialog(),
        
        _Columns : [],
        _vFromPageId : "",
        
    /**
    * Called when a controller is instantiated and its View controls (if available) are already created.
    * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
    * @memberOf epmproductapp.EPMProductApp
    */
        onInit: function() {
            this.setupView()
				.getView()
				.addEventDelegate({
					onBeforeShow : this.onBeforeShow
				}, this);
				
			this.getView()
				.addEventDelegate({
					onAfterShow: this.onAfterShow
				}, this);
				
			gDtfmt = this.getSessionInfoByKey("Dtfmt");
        },
        
        onBeforeShow: function(oEvent) {
            var oController = this;
            
            oController.onPressSearch(oEvent);
        },
        
        onAfterShow : function(evt){
            
        },	
        
        onPressSearch : function(oEvent) {
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxList");
            var oController = oView.getController();
            
            var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
            
            var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
            var oPath = "/YeartaxHeaderSet?$filter=IZyear eq '2019'";
                oPath += " and IBukrs eq '" + oController.getSessionInfoByKey("Bukrs") + "'";
                oPath += " and IPercod eq '" + encodeURIComponent(oController.getSessionInfoByKey("Percod")) + "'";
                
            var vData = {Data : {Msg : ""}};
            
            oModel.read(oPath, null, null, false,
                    function(data, oResponse) {
                        if(data && data.results.length) {
                            sap.ui.getCore().getEventBus().publish("nav", "to", {
                                id : "ZUI5_HR_Yeartax.YearTaxDetail",
                                data : {
                                    Pernr : data.results[0].Pernr,
                                    Zyear : data.results[0].Zyear == "0000" ? '2019' : data.results[0].Zyear,
                                    Pystat : data.results[0].Pystat,
                                    Yestat : (data.results[0].Yestat == "X" ? "1" : "")
                                }
                            });		
                        }
                    },
                    function(Res) {
                        oController.Error = "E";
                        if(Res.response.body){
                            ErrorMessage = Res.response.body;
                            var ErrorJSON = JSON.parse(ErrorMessage);
                            if(ErrorJSON.error.innererror.errordetails && ErrorJSON.error.innererror.errordetails.length){
                                oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
                            } else {
                                oController.ErrorMessage = ErrorMessage;
                            }
                        }
                    }
            );
            
            oController._ListCondJSonModel.setData(vData);
                    
            if(oController.Error == "E"){
                oController.Error = "";
                sap.m.MessageBox.error(oController.ErrorMessage);
                return;
            }
        },	
    })
});