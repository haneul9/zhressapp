sap.ui.define([
	"common/Common",
	"common/CommonController",
	"common/JSONModelHelper",
	"common/PageHelper",
	"common/AttachFileAction",
    "common/SearchOrg",
    "common/SearchUser1",
    "common/OrgOfIndividualHandler",
    "common/DialogHandler",
    "sap/m/MessageBox"], 
	function (Common, CommonController, JSONModelHelper, PageHelper, AttachFileAction, SearchOrg, SearchUser1, OrgOfIndividualHandler, DialogHandler, MessageBox) {
	"use strict";

	return CommonController.extend("ZUI5_HR_Yeartax.YearTaxDetail", {
        PAGEID : "YearTaxDetail",

        _vPersa : "",
        _vPernr : "",
        _SortDialog : null,
        _Actty : "E" ,  //ESS 에서 호출
        
        _DetailJSonModel : new sap.ui.model.json.JSONModel(),
        
        _BusyDialog : new sap.m.BusyDialog(),
        BusyDialog : new sap.m.BusyDialog(),
        
        _Columns : [],
        _vFromPageId : "",
        
        _Pernr : "",
        _Zyear : "",
        _Pystat : "",
        _Yestat : "",
        
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
        },

    /**
    * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
    * (NOT before the first rendering! onInit() is used for that one!).
    * @memberOf epmproductapp.EPMProductApp
    */
    //	onBeforeRendering: function() {
    //
    //	},

    /**
    * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
    * This hook is the same one that SAPUI5 controls get after being rendered.
    * @memberOf epmproductapp.EPMProductApp
    */
    //	onAfterRendering: function() {
    //
    //	},

    /**
    * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
    * @memberOf epmproductapp.EPMProductApp
    */
    //	onExit: function() {
    //
    //	}
        
        SmartSizing : function(){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();

        },	
        
        onBeforeShow: function(oEvent) {
            var oController = this;
            
            if(!oController._DetailJSonModel.getProperty("/Data")){
            	var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
	            var oPath = "/YeartaxHeaderSet?$filter=IZyear eq '2019'";
	                oPath += " and IBukrs eq '" + oController.getSessionInfoByKey("Bukrs") + "'";
	                oPath += " and IPercod eq '" + encodeURIComponent(oController.getSessionInfoByKey("Percod")) + "'";
	                oPath += " and IEmpid eq '" + encodeURIComponent(oController.getSessionInfoByKey("Pernr")) + "'";
	                
	            var oZyear = "", oPystat = "", oYestat = "";
	            
	            oModel.read(oPath, null, null, false,
	                    function(data, oResponse) {
	                        if(data && data.results.length) {
	                            oZyear = data.results[0].Zyear == "0000" ? '2019' : data.results[0].Zyear;
								oPystat = data.results[0].Pystat;
								oYestat = (data.results[0].Yestat == "X" ? "1" : "");
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
	            
	            if(oController.Error == "E"){
	                oController.Error = "";
	                MessageBox.error(oController.ErrorMessage);
	                return;
	            }
	            
                var vData = {
                    Data : {
                        Zyear : oZyear,
                        Pernr : oController.getSessionInfoByKey("Pernr"),
                        Pystat : oPystat,
                        Yestat : oYestat,
                        Auth : $.app.getAuth(),
                        Key : "1",
                        Key2 : "",
                    },
                    // 인적공제
                    Data2 : {
                        Zyear : oZyear,
                        Pernr : oController.getSessionInfoByKey("Pernr"),
                        Pystat : oPystat,
                        Yestat : oYestat,
                        Ename : oController.getSessionInfoByKey("Ename"),
                        Zzorgtx : oController.getSessionInfoByKey("Stext"),
                        ZpGradeTxt : oController.getSessionInfoByKey("PGradeTxt"),
                        Auth : $.app.getAuth()
                    },
                    // 소득공제
                    Data4 : {},
                    // 종전근무지
                    Data7 : []
                };
                
                oController._Pernr = oController.getSessionInfoByKey("Pernr");
                oController._Zyear = oZyear;
                oController._Pystat = oPystat;
                oController._Yestat = oYestat;
                
                console.log("대상자: " , oController._Pernr, oController._Zyear, oController._Pystat, oController._Yestat);
                
                oController._DetailJSonModel.setData(vData);
            }
        },
        
        onAfterShow : function(evt){
            var oController = this;
            
            oController.handleIconTabBarSelect();
        },	
        
        onChangeDate : function(oEvent){
            var oControl = oEvent.getSource();
            if(oEvent.getParameter.valid == false) {
                MessageBox.error("잘못된 일자형식입니다.", {
                    onClose : function() {
                        oControl.setValue("");
                    }
                });
            }
        },
        
        // Flag == "X" : 무조건 재조회
        handleIconTabBarSelect : function(oEvent, Flag) {
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
            
            var sKey = sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").getSelectedKey();
        
            if(sKey == "1"){
                return;
            }
            
            var oKey = oController._DetailJSonModel.getProperty("/Data/Key2");
            if((oKey != sKey) || Flag == "X"){
                eval("oController.onPressSearch" + sKey + "(oEvent);");
                oController._DetailJSonModel.setProperty("/Data/Key2", sKey);
            }
        },
        
        // 인적공제
        onPressSearch2 : function(oEvent){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
            
            var oData = oController._DetailJSonModel.getProperty("/Data2");
            var oData2 = $.extend(true, {}, oData);
            
            var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
            
            // Code List
            // 장애인
            var oHndcd = sap.ui.getCore().byId(oController.PAGEID + "_Hndcd");
            if(oHndcd.getItems().length == 0){
                var oPath = "/YeartaxCodeTableSet?$filter=ICodeT eq '899' and ICodty eq 'PKR_HNDCD' and IPernr eq '" + oData.Pernr + "'";
                
                oModel.read(oPath, null, null, false,
                    function(data, oResponse) {
                        if(data && data.results.length){
                            oHndcd.addItem(new sap.ui.core.Item({key : "0", text : "- 선택 -"}));
                            
                            for(var i=0; i<data.results.length; i++){
                                oHndcd.addItem(new sap.ui.core.Item({key : data.results[i].Code, text : data.results[i].Text}));
                            }
                        }
                    },
                    function(Res) {
                        oController.Error = "E";
                        if(Res.response.body){
                            var ErrorJSON = JSON.parse(Res.response.body);
                            if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
                                oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
                            } else {
                                oController.ErrorMessage = ErrorMessage;
                            }
                        }
                    }
                );
                
                if(oController.Error == "E"){
                    oController.Error = "";
                    MessageBox.error(oController.ErrorMessage);
                }
            }
            
            // 1. 본인정보
            var oPath = "?$filter=IPernr eq '" + oData.Pernr + "'";
                oPath += " and IYear eq '" + oData.Zyear + "'";
            
            var createData = {ET_PINFO : []};
                createData.IMode = "1";
                createData.IPernr = oData.Pernr;
                createData.IYear = oData.Zyear;
                
            oModel.create("/YeartaxGetFamPinfoHeaderSet", createData,
                {
                    success: function(data, res){
                        if(data && data.ET_PINFO) {
                            if(data.ET_PINFO.results && data.ET_PINFO.results.length){
                                var oneData = data.ET_PINFO.results[0];
                            
                                oneData.Pystat = oData.Pystat;
                                oneData.Yestat = oData.Yestat;
                                oneData.Ename = oData.Ename;
                                oneData.Zzorgtx = oData.Zzorgtx;
                                oneData.Zzjikcht = oData.Zzjikcht;
                                oneData.Auth = $.app.getAuth();
                                
                                oneData.Womee = oneData.Womee == "X" ? true : false; // 부녀자
                                oneData.Sigpr = oneData.Sigpr == "X" ? true : false; // 한부모
                                oneData.Ageid = oneData.Ageid == "X" ? true : false; // 경로자
                                oneData.Hndee = oneData.Hndee == "X" ? true : false; // 장애인
                                oneData.Zzinsyn = oneData.Zzinsyn == "X" ? true : false; // 보험료 공제여부
                                oneData.Zzmedyn = oneData.Zzmedyn == "X" ? true : false; // 의료비 공제여부
                                oneData.Zzeduyn = oneData.Zzeduyn == "X" ? true : false; // 교육비 공제여부
                                oneData.Zzcrdyn = oneData.Zzcrdyn == "X" ? true : false; // 신용카드 공제여부
                                oneData.Zzdonyn = oneData.Zzdonyn == "X" ? true : false; // 기부금 공제여부
                                
                                oneData.Hndcd = oneData.Hndcd == "" ? "0" : oneData.Hndcd;
                                
                                oData2 = oneData;
                            }
                        } 
                    },
                    error: function (oError) {
                        var Err = {};
                        oController.Error = "E";
                                
                        if (oError.response) {
                            Err = window.JSON.parse(oError.response.body);
                            var msg1 = Err.error.innererror.errordetails;
                            if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                            else oController.ErrorMessage = Err.error.message.value;
                        } else {
                            oController.ErrorMessage = oError.toString();
                        }
                    }
                }
            );

            oController._DetailJSonModel.setProperty("/Data2", oData2);
            
            if(oController.Error == "E"){
                oController.Error = "";
                MessageBox.error(oController.ErrorMessage);
                return;
            }
            
            // 2. 가족정보
            var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
            var oJSONModel = oTable.getModel();
            var vData = {Data : []};
            
            var createData = {RESULT : []};
                createData.IMode = "";
                createData.IPernr = oData.Pernr;
                createData.IYear = oData.Zyear;
                
            oModel.create("/YeartaxGetFamResultHeaderSet", createData, 
                {
                    success: function(data, res){
                        if(data && data.RESULT) {
                            if(data.RESULT.results && data.RESULT.results.length){
                                for(var i=0; i<data.RESULT.results.length; i++){
                                    data.RESULT.results[i].Regno2 = data.RESULT.results[i].Regno.substring(0,6) + "-" + data.RESULT.results[i].Regno.substring(6,7) + "******";
                                    data.RESULT.results[i].Regno = data.RESULT.results[i].Regno.substring(0,6) + "-" + data.RESULT.results[i].Regno.substring(6);
                                    
                                    vData.Data.push(data.RESULT.results[i]);
                                }
                            }
                        } 
                    },
                    error: function (oError) {
                        var Err = {};
                        oController.Error = "E";
                                
                        if (oError.response) {
                            Err = window.JSON.parse(oError.response.body);
                            var msg1 = Err.error.innererror.errordetails;
                            if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                            else oController.ErrorMessage = Err.error.message.value;
                        } else {
                            oController.ErrorMessage = oError.toString();
                        }
                    }
                }
            );
            
            if(oData2.Pystat == "1" && oData2.Yestat == "1"){
                oTable.setSelectionMode("MultiToggle");
            } else {
                oTable.setSelectionMode("None");
            }
            
            oJSONModel.setData(vData);
            oTable.bindRows("/Data");
            oTable.setVisibleRowCount(vData.Data.length);
            
            if(oController.Error == "E"){
                oController.Error = "";
                MessageBox.error(oController.ErrorMessage);
                return;
            }
        },
        
        // 가족정보 : C 신규 M 변경
        onPressFamInfo : function(oEvent, oFlag){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
            
            var vData = {};
            
            if(oFlag == "M"){
                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
                var oJSONModel = oTable.getModel();
                
                var oIndices = oTable.getSelectedIndices();
                
                if(oIndices.length == 0){
                    MessageBox.error("변경할 대상자를 선택하여 주십시오.");
                    return;
                } else if(oIndices.length != 1){
                    MessageBox.error("변경할 대상자를 한명만 선택하여 주십시오.");
                    return;
                }
                
                var sPath = oTable.getContextByIndex(oIndices[0]).sPath;
                
                vData = Object.assign({}, oJSONModel.getProperty(sPath));
                
                // checkbox 데이터 변환
                vData.Dptid = vData.Dptid == "X" ? true : false;
                vData.Ageid = vData.Ageid == "X" ? true : false;
                vData.Fstid = vData.Fstid == "X" ? true : false;
                vData.Hndid = vData.Hndid == "X" ? true : false;
                vData.Sesch = vData.Sesch == "X" ? true : false;
                vData.Zzinsyn = vData.Zzinsyn == "X" ? true : false;
                vData.Zzmedyn = vData.Zzmedyn == "X" ? true : false;
                vData.Zzeduyn = vData.Zzeduyn == "X" ? true : false;
                vData.Zzcrdyn = vData.Zzcrdyn == "X" ? true : false;
                vData.Zzdonyn = vData.Zzdonyn == "X" ? true : false;
                
                // 주민등록번호
                vData.Regno1 = vData.Regno.split("-")[0];
                vData.Regno2 = vData.Regno.split("-")[1];
                vData.Regno2tx = vData.Regno2.substring(0,1) + "******";

                oTable.clearSelection();
            } else {
                vData.Zyear = oController._DetailJSonModel.getProperty("/Data/Zyear");
                vData.Pernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
                vData.Lnmhg = "";
                vData.Fnmhg = "";
                vData.Regno1 = "";
                vData.Regno2 = "";
                vData.Regno2tx = "";
                vData.Fanat = "KR"; // 국적
            }
            
                vData.Flag = oFlag;
                
            if(!oController._FamInfoDialog){
                oController._FamInfoDialog = sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail02_FamInfo", oController);
                oView.addDependent(oController._FamInfoDialog);

                oController._BusyDialog.open();
                setTimeout(function(){
                    // 코드 리스트 
                    var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
                    var oPath = "IPernr eq '" + oController._DetailJSonModel.getProperty("/Data/Pernr") + "'";
                    
                    // 관계
                    var oKdsvh = sap.ui.getCore().byId(oController.PAGEID + "_Kdsvh");
                    oModel.read("/YeartaxCodeTableSet?$filter=ICodeT eq '806'", null, null, false,
                        function(data, oResponse) {
                            if(data && data.results.length) {
                                for(var i=0; i<data.results.length; i++){
                                    oKdsvh.addItem(new sap.ui.core.Item({key : data.results[i].Code, text : data.results[i].Text}));
                                }
                            }
                        },
                        function(Res) {
                            oController.Error = "E";
                            if(Res.response.body){
                                var ErrorJSON = JSON.parse(Res.response.body);
                                if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
                                    oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
                                } else {
                                    oController.ErrorMessage = ErrorMessage;
                                }
                            }
                        }
                    );
                    
                    if(oController.Error == "E"){
                        oController.Error = "";
                        oController._BusyDialog.close();
                        MessageBox.error(oController.ErrorMessage);
                        return;
                    }
                    
                    // 국적
                    var oFanat = sap.ui.getCore().byId(oController.PAGEID + "_Fanat");
                    oModel.read("/YeartaxCodeTableSet?$filter=ICodeT eq '805'", null, null, false,
                        function(data, oResponse) {
                            if(data && data.results.length) {
                                for(var i=0; i<data.results.length; i++){
                                    oFanat.addItem(new sap.ui.core.Item({key : data.results[i].Code, text : data.results[i].Text}));
                                }
                            }
                        },
                        function(Res) {
                            oController.Error = "E";
                            if(Res.response.body){
                                var ErrorJSON = JSON.parse(Res.response.body);
                                if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
                                    oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
                                } else {
                                    oController.ErrorMessage = ErrorMessage;
                                }
                            }
                        }
                    );
                    
                    if(oController.Error == "E"){
                        oController.Error = "";
                        oController._BusyDialog.close();
                        MessageBox.error(oController.ErrorMessage);
                        return;
                    }
                    
                    // 자녀구분
                    var oKdbsl = sap.ui.getCore().byId(oController.PAGEID + "_Kdbsl");
                    oModel.read("/YeartaxCodeTableSet?$filter=ICodeT eq '807'", null, null, false,
                        function(data, oResponse) {
                            if(data && data.results.length) {
                                for(var i=0; i<data.results.length; i++){
                                    oKdbsl.addItem(new sap.ui.core.Item({key : data.results[i].Code, text : data.results[i].Text}));
                                }
                            }
                        },
                        function(Res) {
                            oController.Error = "E";
                            if(Res.response.body){
                                var ErrorJSON = JSON.parse(Res.response.body);
                                if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
                                    oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
                                } else {
                                    oController.ErrorMessage = ErrorMessage;
                                }
                            }
                        }
                    );
                    
                    if(oController.Error == "E"){
                        oController.Error = "";
                        oController._BusyDialog.close();
                        MessageBox.error(oController.ErrorMessage);
                        return;
                    }
                    
                    // 장애인
                    var oHndid = sap.ui.getCore().byId(oController.PAGEID + "_Hndid2");
                    oModel.read("/YeartaxCodeTableSet?$filter=ICodeT eq '899' and ICodty eq 'PKR_HNDCD'", null, null, false,
                        function(data, oResponse) {
                            if(data && data.results.length) {
                                for(var i=0; i<data.results.length; i++){
                                    oHndid.addItem(new sap.ui.core.Item({key : data.results[i].Code, text : data.results[i].Text}));
                                }
                            }
                        },
                        function(Res) {
                            oController.Error = "E";
                            if(Res.response.body){
                                var ErrorJSON = JSON.parse(Res.response.body);
                                if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
                                    oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
                                } else {
                                    oController.ErrorMessage = ErrorMessage;
                                }
                            }
                        }
                    );
                    
                    if(oController.Error == "E"){
                        oController.Error = "";
                        oController._BusyDialog.close();
                        MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    oController._BusyDialog.close();

                    oController._FamInfoDialog.getModel().setData({Data : vData});
                    oController._FamInfoDialog.open();
                }, 100);
            } else {
                oController._FamInfoDialog.getModel().setData({Data : vData});
                oController._FamInfoDialog.open();
            }
           
        },
        
        // 가족정보 저장
        onSaveFamInfo : function(oEvent){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
            
            var oData = oController._FamInfoDialog.getModel().getProperty("/Data");
            
            // validation check
            if(oData.Lnmhg.trim() == "" || oData.Fnmhg.trim() == ""){
                MessageBox.error("성명을 입력하여 주십시오.");
                return;
            } else if(!oData.Kdsvh){
                MessageBox.error("관계를 선택하여 주십시오.");
                return;
            } else if(!oData.Fanat){
                MessageBox.error("국적을 선택하여 주십시오.");
                return;
            } else if(oData.Regno1 == "" || oData.Regno2 == ""){
                MessageBox.error("주민번호를 입력하여 주십시오.");
                return;
            } else if(oData.Hndid == true && !oData.Hndcd){
                MessageBox.error("장애코드를 선택하여 주십시오.");
                return;
            }
            
            var onProcess = function(){
                var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
                var createData = {RESULT : []};
                    createData.IMode = "1";
                    createData.IPernr = oData.Pernr; 
                    createData.IYear = oData.Zyear; 
                    
                var detail = {};
                    detail.Zyear = oData.Zyear;
                    detail.Pernr = oData.Pernr;
                    detail.Lnmhg = oData.Lnmhg;
                    detail.Fnmhg = oData.Fnmhg;
                    detail.Kdsvh = oData.Kdsvh;
                    detail.Fanat = oData.Fanat;
                    detail.Regno = (oData.Regno1 + oData.Regno2);
                    detail.Dptid = (oData.Dptid && oData.Dptid == true ? "X" : "");
                    detail.Kdbsl = (oData.Kdbsl ? oData.Kdbsl : "");
                    detail.Fstid = (oData.Fstid && oData.Fstid == true ? "X" : "");
                    detail.Hndid = (oData.Hndid && oData.Hndid == true ? "X" : "");
                    detail.Hndcd = (oData.Hndcd ? oData.Hndcd : "");
                    detail.Zzinsyn = (oData.Zzinsyn && oData.Zzinsyn == true ? "X" : "");
                    detail.Zzmedyn = (oData.Zzmedyn && oData.Zzmedyn == true ? "X" : "");
                    detail.Zzeduyn = (oData.Zzeduyn && oData.Zzeduyn == true ? "X" : "");
                    detail.Zzcrdyn = (oData.Zzcrdyn && oData.Zzcrdyn == true ? "X" : "");
                    detail.Zzdonyn = (oData.Zzdonyn && oData.Zzdonyn == true ? "X" : "");
                    
                    createData.RESULT.push(detail);
                    
                oModel.create("/YeartaxGetFamResultHeaderSet", createData, // YeartaxSaveFamilyDataFamSet
                    {
                        success : function(data,res){
                            if(data){
                                
                            }
                        },
                        error : function (oError) {
                            var Err = {};
                            oController.Error = "E";
                            
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    }
                );
                
                oController._BusyDialog.close();
                if(oController.Error == "E"){
                    oController.Error = "";
                    MessageBox.error(oController.ErrorMessage);
                    return;
                }
                
                MessageBox.success("저장되었습니다.", {
                    onClose : function(oEvent){
                        oController._FamInfoDialog.close();
                        oController.onPressSearch2();
                    }
                });
            };
            
            var beforeSave = function(fVal){
                if(fVal && fVal == "YES"){
                    oController._BusyDialog.open();
                    setTimeout(onProcess, 100);
                }
            };
            
            MessageBox.confirm("저장하시겠습니까?", {
                actions : ["YES", "NO"],
                onClose : beforeSave
            });
        },
        
        // 가족정보 삭제
        onDeleteFamInfo : function(oEvent){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
            
            var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
            
            var oIndices = oTable.getSelectedIndices();
            if(oIndices.length == 0){
                MessageBox.error("삭제할 대상자를 선택하여 주십시오.");
                return;
            }
            
            var process = function(){
                var oModel = $.app.getModel("ZHR_YEARTAX_SRV");

                var createData = {RESULT : []};

                for(var i=0; i<oIndices.length; i++){
                    var sPath = oTable.getContextByIndex(oIndices[i]).sPath;
                    var oData = oTable.getModel().getProperty(sPath);

                    var detail = {};
                        detail.Zyear = oData.Zyear;
                        detail.Pernr = oData.Pernr;
                        detail.Regno = oData.Regno.replace(/-/g, "");
                        detail.Objps = oData.Objps;

                        createData.RESULT.push(detail);  
                }

                    createData.IMode = "2";
                    createData.IPernr = oData.Pernr;
                    createData.IYear = oData.Zyear;
                    
                oModel.create("/YeartaxGetFamResultHeaderSet", createData, 
                    {
                        success : function(data,res){
                            if(data){
                                
                            }
                        },
                        error : function (oError) {
                            var Err = {};
                            oController.Error = "E";
                            
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    }
                );
                
                oController._BusyDialog.close();
                if(oController.Error == "E"){
                    oController.Error = "";
                    MessageBox.error(oController.ErrorMessage);
                    return;
                }
                
                MessageBox.success("삭제되었습니다.", {
                    onClose : oController.onPressSearch2
                });
            };
            
            var beforeDelete = function(fVal){
                if(fVal && fVal == "YES"){
                    oController._BusyDialog.open();
                    setTimeout(process, 100);
                }
            };
            
            MessageBox.confirm("삭제하시겠습니까?", {
                actions : ["YES", "NO"],
                onClose : beforeDelete
            });
        },
        
        // 국세청자료
        onPressSearch3 : function(oEvent){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();

            // common.YeaAttachFileAction.setAttachFile(oController);
            oController.setAttachFile(oController);
        },
        
        // 소득공제
        onPressSearch4 : function(oEvent){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
            
            var oData = oController._DetailJSonModel.getProperty("/Data");
            var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
            
            var vData = Object.assign({}, oData);
            
            oController._DetailJSonModel.setProperty("/Data4", vData);
            
            var createData = {Yeartax0542DataTableIn1Set : [], Yeartax0542DataTableIn2Set : []};
                createData.IPernr = oData.Pernr;
                createData.IZyear = oData.Zyear;
                createData.IMode = "1"; 
                
            // Table1 조회	
            oModel.create("/Yeartax0542DataHeaderSet", createData, 
                {
                    success : function(data,res){
                        if(data){
                            if(data.Yeartax0542DataTableIn1Set && data.Yeartax0542DataTableIn1Set.results){
                                vData = Object.assign(vData, data.Yeartax0542DataTableIn1Set.results[0]);
                            }
                        }
                    },
                    error : function (oError) {
                        var Err = {};
                        oController.Error = "E";
                        
                        if (oError.response) {
                            Err = window.JSON.parse(oError.response.body);
                            var msg1 = Err.error.innererror.errordetails;
                            if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                            else oController.ErrorMessage = Err.error.message.value;
                        } else {
                            oController.ErrorMessage = oError.toString();
                        }
                    }
                }
            );
            
            if(oController.Error == "E"){
                oController.Error = "";
                MessageBox.error(oController.ErrorMessage);
                return;                                            
            }
            
            // Table2 조회
            createData.IMode = "3";
            oModel.create("/Yeartax0542DataHeaderSet", createData, 
                {
                    success : function(data,res){
                        if(data){
                            if(data.Yeartax0542DataTableIn2Set && data.Yeartax0542DataTableIn2Set.results){
                                vData = Object.assign(vData, data.Yeartax0542DataTableIn2Set.results[0]);
                            }
                        }
                    },
                    error : function (oError) {
                        var Err = {};
                        oController.Error = "E";
                        
                        if (oError.response) {
                            Err = window.JSON.parse(oError.response.body);
                            var msg1 = Err.error.innererror.errordetails;
                            if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                            else oController.ErrorMessage = Err.error.message.value;
                        } else {
                            oController.ErrorMessage = oError.toString();
                        }
                    }
                }
            );
            
            oController._DetailJSonModel.setProperty("/Data4", vData);
            
            if(oController.Error == "E"){
                oController.Error = "";
                MessageBox.error(oController.ErrorMessage);
                return;
            }
        },
        
        // 양식출력
        onPressSearch5 : function(oEvent){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
            
            var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_Detail5_PDF");
                oLayout.destroyContent();
            
            var search = function(){
                var oData = oController._DetailJSonModel.getProperty("/Data");
            
                var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
                var oPath = "/YeartaxPdfFormSet?$filter=IYear eq '" + oData.Zyear + "'";
                    oPath += " and IPernr eq '" + oData.Pernr + "'";
                    oPath += " and IType eq '" + oData.Key + "'";
                    
                oModel.read(oPath, null, null, false, 
                    function(data, oResponse) {
                        if(data && data.results.length){
                            oLayout.addContent(
                                new sap.ui.core.HTML({	
                                        content : ["<iframe id='iWorkerPDF'" +
                                                        "name='iWorkerPDF' src='data:application/pdf;base64," + data.results[0].EPdfTable + "'" +
                                                        "width='1500px' height='" + (parseInt(window.innerHeight - 210) + "px") + "'" +
                                                        "frameborder='0' border='0' scrolling='no'></>"],
                                    preferDOM : false
                                })	
                            );
                        }
                    },
                    function(Res) {
                        // oController.Error = "E";
                        if(Res.response && Res.response.body){
                            var ErrorJSON = JSON.parse(Res.response.body);
                            if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
                                oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
                            } else {
                                oController.ErrorMessage = ErrorMessage;
                            }
                            
                            MessageBox.error(oController.ErrorMessage);
                        } else {
                            MessageBox.error("오류가 발생하였습니다.");
                        }
                    }
                );
                
                oController._BusyDialog.close();
                
            };
            
            oController._BusyDialog.open();
            setTimeout(search, 100);
        },
        
        // 모의실행
        onPressSearch6 : function(oEvent){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
            
            var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_Detail6_PDF");
                oLayout.destroyContent();
                
            if(oController._DetailJSonModel.getProperty("/Data/Yeatat") == "3"){
                oLayout.addContent(
                    new sap.m.MessageStrip({
                        showIcon : true,
                        showCloseButton : false,
                        type : "Information",
                        text : "연말정산이 완료되어 모의실행이 불가합니다."
                    })	
                );
            } else {
                var search = function(){
                    var oData = oController._DetailJSonModel.getProperty("/Data");
            
                    var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
                    var oPath = "/YeartaxPdfFormSet?$filter=IYear eq '" + oData.Zyear + "'";
                        oPath += " and IPernr eq '" + oData.Pernr + "'";
                        oPath += " and IType eq '5'";
                        
                    oModel.read(oPath, null, null, false, 
                            function(data, oResponse) {
                                if(data && data.results.length){
                                    oLayout.addContent(
                                        new sap.ui.core.HTML({	
                                            content : ["<iframe id='iWorkerPDF'" +
                                                            "name='iWorkerPDF' src='data:application/pdf;base64," + data.results[0].EPdfTable + "'" +
                                                            "width='1500px' height='" + (parseInt(window.innerHeight - 210) + "px") + "'" +
                                                            "frameborder='0' border='0' scrolling='no'></>"],
                                            preferDOM : false
                                        })	
                                    );
                                }
                            },
                            function(Res) {
                                // oController.Error = "E";
                                if(Res.response && Res.response.body){
                                    var ErrorJSON = JSON.parse(Res.response.body);
                                    if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
                                        oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
                                    } else {
                                        oController.ErrorMessage = ErrorMessage;
                                    }
                                    
                                    MessageBox.error(oController.ErrorMessage);
                                } else {
                                    MessageBox.error("오류가 발생하였습니다.");
                                }
                            }
                    );
                    
                    oController._BusyDialog.close();
                };
                
                oController._BusyDialog.open();
                setTimeout(search, 100);
            }
        },
        
        // 종(전)근무지
        onPressSearch7 : function(oEvent){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
            
            var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
            
            var oData = oController._DetailJSonModel.getProperty("/Data");
            var vData = [];
            
            var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
            var createData = {NavYeartaxPrevWorkN2 : []};
                createData.IPernr = oData.Pernr;
                createData.IPyear = oData.Zyear;
                createData.IConType = "1";
                
            oModel.create("/YeartaxPrevWorkN2HeaderSet", createData, 
                {
                    success: function(data,res){
                        if(data){
                            if(data.NavYeartaxPrevWorkN2.results && data.NavYeartaxPrevWorkN2.results.length){
                                for(var i=0; i<data.NavYeartaxPrevWorkN2.results.length; i++){
                                    data.NavYeartaxPrevWorkN2.results[i].Pystat = oData.Pystat;
                                    data.NavYeartaxPrevWorkN2.results[i].Yestat = oData.Yestat;
                                    
                                    data.NavYeartaxPrevWorkN2.results[i].Pabeg = data.NavYeartaxPrevWorkN2.results[i].Pabeg ? dateFormat.format(data.NavYeartaxPrevWorkN2.results[i].Pabeg) : null;
                                    data.NavYeartaxPrevWorkN2.results[i].Paend = data.NavYeartaxPrevWorkN2.results[i].Paend ? dateFormat.format(data.NavYeartaxPrevWorkN2.results[i].Paend) : null;
                                    
                                    data.NavYeartaxPrevWorkN2.results[i].Bet01 = data.NavYeartaxPrevWorkN2.results[i].Bet01.trim();
                                    data.NavYeartaxPrevWorkN2.results[i].Bet02 = data.NavYeartaxPrevWorkN2.results[i].Bet02.trim();
                                    data.NavYeartaxPrevWorkN2.results[i].Bet03 = data.NavYeartaxPrevWorkN2.results[i].Bet03.trim();
                                    data.NavYeartaxPrevWorkN2.results[i].Bet04 = data.NavYeartaxPrevWorkN2.results[i].Bet04.trim();
                                    data.NavYeartaxPrevWorkN2.results[i].Bet05 = data.NavYeartaxPrevWorkN2.results[i].Bet05.trim();
                                    data.NavYeartaxPrevWorkN2.results[i].Bet06 = data.NavYeartaxPrevWorkN2.results[i].Bet06.trim();
                                    data.NavYeartaxPrevWorkN2.results[i].Bet07 = data.NavYeartaxPrevWorkN2.results[i].Bet07.trim();
                                    data.NavYeartaxPrevWorkN2.results[i].Bet08 = data.NavYeartaxPrevWorkN2.results[i].Bet08.trim();
                                    data.NavYeartaxPrevWorkN2.results[i].Bet09 = data.NavYeartaxPrevWorkN2.results[i].Bet09.trim();
                                    data.NavYeartaxPrevWorkN2.results[i].Bet10 = data.NavYeartaxPrevWorkN2.results[i].Bet10.trim();
                                    
                                    vData.push(data.NavYeartaxPrevWorkN2.results[i]);
                                }
                                
                                if(data.NavYeartaxPrevWorkN2.results.length == 1){
                                    vData.push({Pystat : oData.Pystat, Yestat : oData.Yestat});
                                }
                            } else {
                                // 데이터가 조회되지 않은 경우에도 수정할 수 있도록 데이터를 추가한다.
                                vData.push({Pystat : oData.Pystat, Yestat : oData.Yestat});
                                vData.push({Pystat : oData.Pystat, Yestat : oData.Yestat});
                            }
                        }
                    },
                    error: function (oError) {
                        var Err = {};
                        oController.Error = "E";
                        
                        if (oError.response) {
                            Err = window.JSON.parse(oError.response.body);
                            var msg1 = Err.error.innererror.errordetails;
                            if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                            else oController.ErrorMessage = Err.error.message.value;
                        } else {
                            oController.ErrorMessage = oError.toString();
                        }
                    }
                }
            );
            
            oController._DetailJSonModel.setProperty("/Data7", vData);
            
            if(oController.Error == "E"){
                oController.Error = "";
                MessageBox.error(oController.ErrorMessage);
                return;
            }
        },
        
        // 첨부파일 리스트 
        onSetView : function(oEvent){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
            
            var oData = oController._DetailJSonModel.getProperty("/Data");
            var oFileDelButton = sap.ui.getCore().byId("yeaUploader_AttachFileDelete");
            var oAttachFileList = sap.ui.getCore().byId("yeaUploader_AttachFileList");
            
            if(oData.Pystat == "1" && oData.Yestat == "1" && oEvent.getParameters().actual > 0) {
                oFileDelButton.setVisible(true);
            } else {
                oFileDelButton.setVisible(false);
            }	
        },
        
        // 첨부파일 다운로드
        onDownloadAttachFile : function(oEvent) {
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
            
            var oData = oEvent.getSource().getCustomData()[0].getValue();
            
            if(!oController._Detail3Dialog){
                oController._Detail3Dialog = sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail03_PDF", oController);
                oView.addDependent(oController._Detail3Dialog);
            }
            
            var oPanel = sap.ui.getCore().byId(oController.PAGEID + "_Detail3Panel");
                oPanel.destroyContent();
                
                oPanel.addContent(
                    new sap.ui.core.HTML({	
                        content : ["<iframe id='iWorkerPDF'" +
                                        "name='iWorkerPDF' src='data:application/pdf;base64," + oData.EPdfbn + "'" +
                                        "width='100%' height='" + (parseInt(window.innerHeight - 300) + "px") + "'" +
                                        "frameborder='0' border='0' scrolling='no'></>"],
                        preferDOM : false
                    })
                );
                
            oController._Detail3Dialog.setTitle(oData.EFname);
            oController._Detail3Dialog.open();
        },
        
        // 종전근무지 삭제
        onPressDelete7 : function(oEvent){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
        
            var oData = oController._DetailJSonModel.getProperty("/Data7");
            
            // validation check
            var check = "";
            var createData = {NavYeartaxPrevWorkN2 : []};
                
            for(var i=0; i<oData.length; i++){
                if(oData[i].Checkbox && oData[i].Checkbox == true){
                    check = "X";
                }
                
                var detail = {};
                    detail.Pernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
                    detail.Zdelfg = oData[i].Zdelfg;
                    detail.Bizno = oData[i].Bizno ? oData[i].Bizno : "";
                    detail.Comnm = oData[i].Comnm ? oData[i].Comnm : "";
                    detail.Pabeg = oData[i].Pabeg ? "\/Date(" + common.Common.getTime(new Date(oData[i].Pabeg)) + ")\/" : null;
                    detail.Paend = oData[i].Paend ? "\/Date(" + common.Common.getTime(new Date(oData[i].Paend)) + ")\/" : null;
                    detail.Bet01 = oData[i].Bet01 ? oData[i].Bet01.replace(/[^0-9]/g, "") : "";
                    detail.Bet02 = oData[i].Bet02 ? oData[i].Bet02.replace(/[^0-9]/g, "") : "";
                    detail.Bet03 = oData[i].Bet03 ? oData[i].Bet03.replace(/[^0-9]/g, "") : "";
                    detail.Bet04 = oData[i].Bet04 ? oData[i].Bet04.replace(/[^0-9]/g, "") : "";
                    detail.Bet05 = oData[i].Bet05 ? oData[i].Bet05.replace(/[^0-9]/g, "") : "";
                    detail.Bet06 = oData[i].Bet06 ? oData[i].Bet06.replace(/[^0-9]/g, "") : "";
                    detail.Bet07 = oData[i].Bet07 ? oData[i].Bet07.replace(/[^0-9]/g, "") : "";
                    detail.Bet08 = oData[i].Bet08 ? oData[i].Bet08.replace(/[^0-9]/g, "") : "";
                    detail.Bet09 = oData[i].Bet09 ? oData[i].Bet09.replace(/[^0-9]/g, "") : "";
                    detail.Bet10 = oData[i].Bet10 ? oData[i].Bet10.replace(/[^0-9]/g, "") : "";
                    
                createData.NavYeartaxPrevWorkN2.push(detail);
            }
            
            if(check == ""){
                MessageBox.error("삭제할 데이터를 선택하여 주십시오.");
                return;
            }
            
            var process = function(){
                createData.IPernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
                createData.IPyear = oController._DetailJSonModel.getProperty("/Data/Zyear");
                createData.IConType = "4";
                    
                var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
                oModel.create("/YeartaxPrevWorkN2HeaderSet", createData,
                    {
                        success: function(data,res){
                            if(data){
                                
                            }
                        },
                        error: function (oError) {
                            var Err = {};
                            oController.Error = "E";
                            
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    }
                );
                
                oController._BusyDialog.close();
                
                if(oController.Error == "E"){
                    oController.Error = "";
                    MessageBox.error(oController.ErrorMessage);
                    return;
                }
                
                MessageBox.success("삭제되었습니다.", {
                    onClose : function(){
                        oController.handleIconTabBarSelect(oEvent, "X");
                    }
                });
            };
            
            var beforeDelete = function(fVal){
                if(fVal && fVal == "YES"){
                    oController._BusyDialog.open();
                    setTimeout(process, 100);
                }
            }
            
            MessageBox.confirm("삭제하시겠습니까?", {
                actions : ["YES", "NO"],
                onClose : beforeDelete
            });
        },
        
        // 저장
        onPressSave : function(oEvent){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
            
            // 개인정보
            var oData = oController._DetailJSonModel.getProperty("/Data2");
            if(oData.Pernr == undefined){
                oController.onPressSearch2();
                    oData = oController._DetailJSonModel.getProperty("/Data2");
            }
            
            // 개인정보 validation check
            if(oData.Hndee == true && oData.Hndcd == "0"){
                sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").setSelectedKey("2");
                
                MessageBox.error("장애코드를 선택하여 주십시오.");
                return;
            }

            // 소득공제
            var oData2 = oController._DetailJSonModel.getProperty("/Data4");
            if(oData2.Pernr == undefined){
                oController.onPressSearch4();
                oData2 = oController._DetailJSonModel.getProperty("/Data4");
            }
            
            // 종(전)근무지
            var oData3 = oController._DetailJSonModel.getProperty("/Data7");
            if(oData3.length == 0){
                oController.onPressSearch7();
                oData3 = oController._DetailJSonModel.getProperty("/Data7");
            }
            
            var onProcess = function(){
                var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
                
                // 1. 인적공제 저장
                var createData = {};
                    createData.IMode = "3";
                    createData.IZyear = oData.Zyear;
                    createData.Zyear = oData.Zyear;
                    createData.IPernr = oData.Pernr;
                    createData.Pernr = oData.Pernr;
                    createData.Pdcid = oData.Pdcid;
                    createData.Hshld = oData.Hshld;
                    createData.Hndee = oData.Hndee == true ? "X" : "";
                    createData.Hndcd = oData.Hndcd && oData.Hndcd != "0" ? oData.Hndcd : "";
                    createData.Hndtx = oData.Hndtx ? oData.Hndtx : "";
                    createData.Womee = oData.Womee == true ? "X" : "";
                    createData.Sigpr = oData.Sigpr == true ? "X" : "";
                    createData.Ageid = oData.Ageid == true ? "X" : "";
                    createData.Zzinsyn = oData.Zzinsyn == true ? "X" : "";
                    createData.Zzmedyn = oData.Zzmedyn == true ? "X" : "";
                    createData.Zzeduyn = oData.Zzeduyn == true ? "X" : "";
                    createData.Zzcrdyn = oData.Zzcrdyn == true ? "X" : "";
                    createData.Zzdonyn = oData.Zzdonyn == true ? "X" : "";
                    
                oModel.create("/YeartaxSaveFamilyDataPinfoSet", createData, 
                    {
                        success: function(data,res){
                            if(data){
                                
                            }
                        },
                        error: function (oError) {
                            var Err = {};
                            oController.Error = "E";
                            
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    }
                );
                
                if(oController.Error == "E"){
                    oController.Error = "";
                    oController._BusyDialog.close();
                    MessageBox.error(oController.ErrorMessage);
                    return;
                }
                
                // 2. 소득공제
                var createData2 = {Yeartax0542DataTableIn1Set : [], Yeartax0542DataTableIn2Set : []};
                    createData2.IMode = "2";
                    createData2.IPernr = oData2.Pernr;
                    createData2.IZyear = oData2.Zyear;
                
                    var detail = {};
                        detail.ZzrepayNts = oData2.ZzrepayNts.replace(/[^0-9]/g, "");
                        detail.ZzrepayNto = oData2.ZzrepayNto.replace(/[^0-9]/g, "");
                        detail.ZzrepayOth = oData2.ZzrepayOth.replace(/[^0-9]/g, "");
                        detail.ZzsmbfiNts = oData2.ZzsmbfiNts.replace(/[^0-9]/g, "");
                        detail.ZzsmbfiNto = oData2.ZzsmbfiNto.replace(/[^0-9]/g, "");
                        detail.ZzsmbfiOth = oData2.ZzsmbfiOth.replace(/[^0-9]/g, "");
                        
                    createData2.Yeartax0542DataTableIn1Set.push(detail);
                    
                oModel.create("/Yeartax0542DataHeaderSet", createData2, 
                    {
                        success: function(data,res){
                            if(data){
                                
                            }
                        },
                        error: function (oError) {
                            var Err = {};
                            oController.Error = "E";
                            
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    }
                );
                
                if(oController.Error == "E"){
                    oController._BusyDialog.close();
                    oController.Error = "";
                    MessageBox.error(oController.ErrorMessage);
                    return;
                }
                
                // 3. 종(전)근무지
                var createData3 = {NavYeartaxPrevWorkN2 : []};
                    createData3.IPernr = oData2.Pernr;
                    createData3.IPyear = oData2.Zyear;
                    createData3.IConType = "3";
                    
                for(var i=0; i<oData3.length; i++){
                    var detail = {};
                        detail.Pernr = oData2.Pernr;
                        detail.Bizno = oData3[i].Bizno ? oData3[i].Bizno : "";
                        detail.Comnm = oData3[i].Comnm ? oData3[i].Comnm : "";
                        detail.Pabeg = oData3[i].Pabeg ? "\/Date(" + common.Common.getTime(new Date(oData3[i].Pabeg)) + ")\/" : null;
                        detail.Paend = oData3[i].Paend ? "\/Date(" + common.Common.getTime(new Date(oData3[i].Paend)) + ")\/" : null;
                        detail.Bet01 = oData3[i].Bet01 ? oData3[i].Bet01.replace(/[^0-9]/g, "") : "";
                        detail.Bet02 = oData3[i].Bet02 ? oData3[i].Bet02.replace(/[^0-9]/g, "") : "";
                        detail.Bet03 = oData3[i].Bet03 ? oData3[i].Bet03.replace(/[^0-9]/g, "") : "";
                        detail.Bet04 = oData3[i].Bet04 ? oData3[i].Bet04.replace(/[^0-9]/g, "") : "";
                        detail.Bet05 = oData3[i].Bet05 ? oData3[i].Bet05.replace(/[^0-9]/g, "") : "";
                        detail.Bet06 = oData3[i].Bet06 ? oData3[i].Bet06.replace(/[^0-9]/g, "") : "";
                        detail.Bet07 = oData3[i].Bet07 ? oData3[i].Bet07.replace(/[^0-9]/g, "") : "";
                        detail.Bet08 = oData3[i].Bet08 ? oData3[i].Bet08.replace(/[^0-9]/g, "") : "";
                        detail.Bet09 = oData3[i].Bet09 ? oData3[i].Bet09.replace(/[^0-9]/g, "") : "";
                        detail.Bet10 = oData3[i].Bet10 ? oData3[i].Bet10.replace(/[^0-9]/g, "") : "";
                        
                    createData3.NavYeartaxPrevWorkN2.push(detail);
                }

                oModel.create("/YeartaxPrevWorkN2HeaderSet", createData3,
                    {
                        success: function(data,res){
                            if(data){
                                
                            }
                        },
                        error: function (oError) {
                            var Err = {};
                            oController.Error = "E";
                            
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    }
                );
                
                oController._BusyDialog.close();
                
                if(oController.Error == "E"){
                    oController.Error = "";
                    MessageBox.error(oController.ErrorMessage);
                    return;
                }
                
                MessageBox.success("저장되었습니다.", {
                    onClose : function(){
                        oController.handleIconTabBarSelect(oEvent, "X");
                    }
                });
            };
            
            var CreateProcess = function(fVal){
                if(fVal && fVal == MessageBox.Action.YES) {
                    oController._BusyDialog.open();
                    setTimeout(onProcess, 100);
                }
            };
            
            MessageBox.confirm("저장하시겠습니까?", {
                actions : [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose : CreateProcess
            });
        },
        
        // 최종승인완료
        onPressComplete : function(oEvent){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();

            // 개인정보
            var oData = oController._DetailJSonModel.getProperty("/Data2");
            if(oData.Pernr == undefined){
                oController.onPressSearch2();
                oData = oController._DetailJSonModel.getProperty("/Data2");
            }
            
            // 소득공제
            var oData2 = oController._DetailJSonModel.getProperty("/Data4");
            if(oData2.Pernr == undefined){
                oController.onPressSearch4();
                oData2 = oController._DetailJSonModel.getProperty("/Data4");
            }
            
            // 개인정보 validation check
            if(oData.Hndee == true && oData.Hndcd == "0"){
                sap.ui.getCore().byId(oController.PAGEID + "_Icontabbar").setSelectedKey("2");
                
                MessageBox.error("장애코드를 선택하여 주십시오.");
                return;
            }
            
            var onProcess = function(){
                var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
                
                // 1. 인적공제 저장
                var createData = {};
                    createData.IMode = "3";
                    createData.Zyear = oData.Zyear;
                    createData.Pernr = oData.Pernr;
                    createData.Pdcid = oData.Pdcid;
                    createData.Hshld = oData.Hshld;
                    createData.Hndee = oData.Hndee == true ? "X" : "";
                    createData.Hndcd = oData.Hndcd && oData.Hndcd != "0" ? oData.Hndcd : "";
                    createData.Hndtx = oData.Hndtx ? oData.Hndtx : "";
                    createData.Womee = oData.Womee == true ? "X" : "";
                    createData.Sigpr = oData.Sigpr == true ? "X" : "";
                    createData.Ageid = oData.Ageid == true ? "X" : "";
                    createData.Zzinsyn = oData.Zzinsyn == true ? "X" : "";
                    createData.Zzmedyn = oData.Zzmedyn == true ? "X" : "";
                    createData.Zzeduyn = oData.Zzeduyn == true ? "X" : "";
                    createData.Zzcrdyn = oData.Zzcrdyn == true ? "X" : "";
                    createData.Zzdonyn = oData.Zzdonyn == true ? "X" : "";
                    
                oModel.create("/YeartaxSaveFamilyDataPinfoSet", createData,
                    {
                        success: function(data,res){
                            if(data){
                                
                            }
                        },
                        error: function (oError) {
                            var Err = {};
                            oController.Error = "E";
                            
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    }
                );
                
                if(oController.Error == "E"){
                    oController.Error = "";
                    oController._BusyDialog.close();
                    MessageBox.error(oController.ErrorMessage);
                    return;
                }
                
                // 2. 소득공제 저장
                var createData2 = {Yeartax0542DataTableIn1Set : [], Yeartax0542DataTableIn2Set : []};
                    createData2.IMode = "2";
                    createData2.IPernr = oData2.Pernr;
                    createData2.IZyear = oData2.Zyear;
                
                    var detail = {};
                        detail.ZzrepayNts = oData2.ZzrepayNts.replace(/[^0-9]/g, "");
                        detail.ZzrepayNto = oData2.ZzrepayNto.replace(/[^0-9]/g, "");
                        detail.ZzrepayOth = oData2.ZzrepayOth.replace(/[^0-9]/g, "");
                        detail.ZzsmbfiNts = oData2.ZzsmbfiNts.replace(/[^0-9]/g, "");
                        detail.ZzsmbfiNto = oData2.ZzsmbfiNto.replace(/[^0-9]/g, "");
                        detail.ZzsmbfiOth = oData2.ZzsmbfiOth.replace(/[^0-9]/g, "");
                        
                    createData2.Yeartax0542DataTableIn1Set.push(detail);
                    
                oModel.create("/Yeartax0542DataHeaderSet", createData2, 
                    {
                        success: function(data,res){
                            if(data){
                                
                            }
                        },
                        error: function (oError) {
                            var Err = {};
                            oController.Error = "E";
                            
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    }
                );
                
                oController._BusyDialog.close();
                
                if(oController.Error == "E"){
                    oController.Error = "";
                    MessageBox.error(oController.ErrorMessage);
                    return;
                }
                
                // 3. 최종제출
                var createData3 = {};
                    createData3.Zyear = oData.Zyear;
                    createData3.Pernr = oData.Pernr;
                    createData3.Pystat = "";
                    createData3.Pystatx = "";
                
                oModel.update("/DataProgress(Zyear='" + oData.Zyear + "',Pernr='" + oData.Pernr + "')", createData3, null,
                        function(data,res){
                            if(data) {
                                
                            } 
                        },
                        function (oError) {
                            oController.Error = "E";
                            var Err = {};
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                );
                
                oController._BusyDialog.close();
                
                if(oController.Error == "E"){
                    oController.Error = "";
                    MessageBox.error(oController.ErrorMessage);
                    return;
                }
                
                MessageBox.success("최종입력완료되었습니다. 조회모드로 변경됩니다.", {
                    onClose : function(){
                        oController.handleIconTabBarSelect("", "X");
                    }
                });
            };
            
            var CreateProcess = function(fVal){
                if(fVal && fVal == MessageBox.Action.YES){
                    oController._BusyDialog.open();
                    setTimeout(onProcess, 100);
                }
            };
            
            MessageBox.confirm( "※ 최종 제출 전에 반드시 확인하십시오." +
								"\n\n(1) 부양가족이 올바르게 체크 되었는지 확인" +
								"\n- 기본공제 대상자에 해당하지 않는데 부양가족으로 체크된 경우 가족등록신청 메뉴에서 수정하시기 바랍니다." +
								"\n* 기본공제 대상자 나이요건" +
								"\n 직계존속: 1957년 12월 31일 이전 출생자" +
								"\n 직계비속: 1997년 1월 1일 이후 출생자" +
								"\n\n(2) 부양가족 중복공제 여부 확인" +
								"\n- 독립적인 생계능력이 없는 부모님에 대해 가족 구성원이 중복하여 공제받지 않았는지 확인하십시오." +
								"\n- 맞벌이 부부인 경우 자녀에 대한 보험료, 의료비, 교육비, 기부금, 신용카드 등의 사용액을 부부가 중복으로 공제받지 않았는지 반드시 확인하십시오." + 
								"\n\n 제출 후에는 수정이 불가능합니다. 최종입력완료하시겠습니까?", {
                actions : [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose : CreateProcess
            });
        },
        
        // 소득공제 - 주택자금 국세청 금액 삭제
        onPressDelete : function(oEvent){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();

            var oData = oController._DetailJSonModel.getProperty("/Data4");
            
            var onProcess = function(){
                var createData = {};
                    createData.Zyear = oData.Zyear;
                    createData.Pernr = oData.Pernr;
                    createData.ZzrepayNts = oData.ZzrepayNts;
                    createData.ZzrepayNto = "0";
                    createData.ZzrepayOth = oData.ZzrepayOth;
                    createData.ZzsmbfiNts = oData.ZzsmbfiNts;
                    createData.ZzsmbfiNto = oData.ZzsmbfiNto;
                    createData.ZzsmbfiOth = oData.ZzsmbfiOth;
                    createData.Tinvs = oData.Tinvs;
                    createData.Invst = oData.Invst;
                    createData.Finvt = oData.Finvt;
                    
                var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
                oModel.update("/P0542List(Zyear='" + oData.Zyear + "',Pernr='" + oData.Pernr + "')", createData, null,
                    function(data,res){
                        if(data) {
                            
                        } 
                    },
                    function (oError) {
                        oController.Error = "E";
                        var Err = {};
                        if (oError.response) {
                            Err = window.JSON.parse(oError.response.body);
                            var msg1 = Err.error.innererror.errordetails;
                            if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                            else oController.ErrorMessage = Err.error.message.value;
                        } else {
                            oController.ErrorMessage = oError.toString();
                        }
                    }
                );	
                    
                oController._BusyDialog.close();
                
                if(oController.Error == "E"){
                    oController.Error = "";
                    MessageBox.error(oController.ErrorMessage);
                    return;
                }
                
                MessageBox.success("삭제되었습니다.", {
                    onClose : oController.onPressSearch4
                });
            };
            
            var createProcess = function(fVal){
                if(fVal && fVal == MessageBox.Action.YES){
                    oController._BusyDialog.open();
                    setTimeout(onProcess, 100);
                }
            };
            
            MessageBox.confirm("삭제하시겠습니까?", {
                actions : [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose : createProcess
            });
        },
        
        // 대상자 조회 및 선택로직
        onDataProgress : function(oEvent){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();

			var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
			var oPath = "/YeartaxHeaderSet?$filter=IZyear eq '" + oController._DetailJSonModel.getProperty("/Data/Zyear") + "'";
				oPath += " and IBukrs eq '" + oController.getSessionInfoByKey("Bukrs") + "'";
				oPath += " and IPercod eq '" + encodeURIComponent(oController.getSessionInfoByKey("Percod")) + "'";
                oPath += " and IEmpid eq '" + encodeURIComponent(oController.getSessionInfoByKey("Pernr")) + "'";
				
			var oZyear = "", oPystat = "", oYestat = "";
			
			oModel.read(oPath, null, null, false,
					function(data, oResponse) {
						if(data && data.results.length) {
							oController._Zyear = data.results[0].Zyear;
							oController._Pystat = data.results[0].Pystat;
							oController._Yestat = data.results[0].Yestat;
							
							oController._DetailJSonModel.setProperty("/Data/Zyear",  data.results[0].Zyear);
							oController._DetailJSonModel.setProperty("/Data/Pystat", data.results[0].Pystat);
							oController._DetailJSonModel.setProperty("/Data/Yestat", data.results[0].Yestat);
							oController._DetailJSonModel.setProperty("/Data/Key", "1");
							
							oController._DetailJSonModel.setProperty("/Data2/Zyear",  data.results[0].Zyear);
							oController._DetailJSonModel.setProperty("/Data2/Pystat", data.results[0].Pystat);
							oController._DetailJSonModel.setProperty("/Data2/Yestat", data.results[0].Yestat);
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
			
			if(oController.Error == "E"){
				oController.Error = "";
				MessageBox.error(oController.ErrorMessage);
				return;
			}

            console.log("대상자: " + oController._Pernr, oController._Zyear, oController._Pystat, oController._Yestat);
            
            if(oController.Error == "E"){
                oController.Error = "";
                MessageBox.error(oController.ErrorMessage);
                return;
            }
        },
        
        // 소득공제 - dialog
        // oSubty : fragment name, oSubty2 : oData 호출용 flag (의료비, 기부금 제외)
        onPressOpenSubty : function(oEvent, oSubty, oSubty2){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();

            console.log(oSubty, " / ", oSubty2);
            var oName = "ZUI5_HR_Yeartax.fragment.Detail04_" + oSubty;
            
            if(!eval("oController._" + oSubty + "Dialog")){
                eval("oController._" + oSubty + "Dialog = sap.ui.jsfragment('" + oName + "', oController);");
                eval("oView.addDependent(oController._" + oSubty + "Dialog);");
            }
            
            if(oController.onBindTable(oController, oSubty, oSubty2) == false){
                return;
            }
            
            eval("oController._" + oSubty + "Dialog.open();");
        },
        
        // oSubty : Fragment, oSubty2 : oData 호출용 flag (의료비, 기부금 제외)
        onBindTable : function(oController, oSubty, oSubty2){
            if(!oController || !oSubty) return;
            
            var oTable = sap.ui.getCore().byId(oController.PAGEID + "_" + oSubty + "Table");
            var oJSONModel = oTable.getModel();
            var vData = {Data : []};
            
            // sort, filter 제거
            var oColumns = oTable.getColumns();
            for(var i=0; i<oColumns.length; i++){
                oColumns[i].setSorted(false);
                oColumns[i].setFiltered(false);
            }
            
            var oData = oController._DetailJSonModel.getProperty("/Data");
            var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : "yyyy-MM-dd"});
            
            var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
            
            if(oSubty == "P0812ListY15"){ // 의료비
                var createData = {Yeartax0812DataSet : []};
                    createData.IMode = "1";
                    createData.IPernr = oData.Pernr;
                    createData.IZyear = oData.Zyear;
                
                oModel.create("/Yeartax0812DataHeaderSet", createData,
                    {
                        success: function(data,res){
                            if(data){
                                if(data.Yeartax0812DataSet && data.Yeartax0812DataSet.results.length){
                                    for(var i=0; i<data.Yeartax0812DataSet.results.length; i++){
                                        data.Yeartax0812DataSet.results[i].Idx = i+1;
                                        
                                        if(oData.Pystat == "1" && oData.Yestat == "1" && data.Yeartax0812DataSet.results[i].Zflnts == ""){
                                            data.Yeartax0812DataSet.results[i].Editable = true;
                                        } else {
                                            data.Yeartax0812DataSet.results[i].Editable = false;
                                        }
                                        
                                        data.Yeartax0812DataSet.results[i].Mecnt = parseFloat(data.Yeartax0812DataSet.results[i].Mecnt);
                                        
                                        data.Yeartax0812DataSet.results[i].Mesty = data.Yeartax0812DataSet.results[i].Mesty == "X" ? true : false;
                                        data.Yeartax0812DataSet.results[i].Surpg = data.Yeartax0812DataSet.results[i].Surpg == "X" ? true : false;
                                        
                                        // data.Yeartax0812DataSet.results[i].Supnr = data.Yeartax0812DataSet.results[i].Supnr == "" ? "" : 
                                        // 													data.Yeartax0812DataSet.results[i].Supnr.substring(0,3) + "-" 
                                        // 													+ data.Yeartax0812DataSet.results[i].Supnr.substring(3,5) + "-"
                                        // 													+ data.Yeartax0812DataSet.results[i].Supnr.substring(5,10);
                                        data.Yeartax0812DataSet.results[i].Meamt = data.Yeartax0812DataSet.results[i].Meamt ? common.Common.numberWithCommas(data.Yeartax0812DataSet.results[i].Meamt) : "";
                                        
                                        vData.Data.push(data.Yeartax0812DataSet.results[i]);
                                    }
                                }
                            }
                        },
                        error: function (oError) {
                            var Err = {};
                            oController.Error = "E";
                            
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    }
                );
                    
            } else if(oSubty == "P0858List"){ // 기부금
                var createData = {NavYeartax0858Data : []};
                    createData.IMode = "1";
                    createData.IPernr = oData.Pernr;
                    createData.IZyear = oData.Zyear;

                oModel.create("/Yeartax0858DataHeaderSet", createData, 
                    {
                        success: function(data,res){
                            if(data){
                                if(data.NavYeartax0858Data && data.NavYeartax0858Data.results.length){
                                    for(var i=0; i<data.NavYeartax0858Data.results.length; i++){
                                        data.NavYeartax0858Data.results[i].Idx = i;
                                        data.NavYeartax0858Data.results[i].Flnts = data.NavYeartax0858Data.results[i].Flnts == "X" ? true : false;
                                        
                                        vData.Data.push(data.NavYeartax0858Data.results[i]);
                                    }
                                }
                            }
                        },
                        error: function (oError) {
                            var Err = {};
                            oController.Error = "E";
                            
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    }
                );
                
            } else {
                var createData = {NavYeartax0881Data : []};
                    createData.IMode = "1";
                    createData.IPernr = oData.Pernr;
                    createData.IZyear = oData.Zyear;
                    createData.ISubty = oSubty2;
                    
                    if(oSubty2 == "E2"){
                        if(oSubty == "P0881E201"){
                            createData.IPnsty = "01";
                        } else if(oSubty == "P0881E202"){
                            createData.IPnsty = "02";
                        }
                    }
                    
                oModel.create("/Yeartax0881DataHeaderSet", createData,
                    {
                        success: function(data,res){
                            if(data){
                                if(data.NavYeartax0881Data && data.NavYeartax0881Data.results){
                                    for(var i=0; i<data.NavYeartax0881Data.results.length; i++){
                                        data.NavYeartax0881Data.results[i].Idx = i;
                                        
                                        if(oData.Pystat == "1" && oData.Yestat == "1" && data.NavYeartax0881Data.results[i].Zflnts == ""){
                                            data.NavYeartax0881Data.results[i].Editable = true;
                                        } else {
                                            data.NavYeartax0881Data.results[i].Editable = false;
                                        }
                                        
                                        switch(oSubty){
                                            case "P088101": // 보험료
                                                data.NavYeartax0881Data.results[i].Haned = data.NavYeartax0881Data.results[i].Haned == "X" ? true : false;
                                                data.NavYeartax0881Data.results[i].Handi = data.NavYeartax0881Data.results[i].Handi == "X" ? true : false;
                                                data.NavYeartax0881Data.results[i].Ntsam = data.NavYeartax0881Data.results[i].Ntsam ? common.Common.numberWithCommas(data.NavYeartax0881Data.results[i].Ntsam) : "";
                                                data.NavYeartax0881Data.results[i].Otham = data.NavYeartax0881Data.results[i].Otham ? common.Common.numberWithCommas(data.NavYeartax0881Data.results[i].Otham) : "";
                                                break;
                                            case "P088102": // 교육비
                                                data.NavYeartax0881Data.results[i].Haned = data.NavYeartax0881Data.results[i].Haned == "X" ? true : false;
                                                data.NavYeartax0881Data.results[i].Exsty1 = data.NavYeartax0881Data.results[i].Exsty == "X" ? true : false;
                                                data.NavYeartax0881Data.results[i].Exsty2 = data.NavYeartax0881Data.results[i].Exsty == "F" ? true : false;
                                                break;
                                            case "P088103": // 신용카드
                                            case "P088104": // 현금영수증
                                            case "P088106": // 직불,선불카드
                                                data.NavYeartax0881Data.results[i].Ntsam = data.NavYeartax0881Data.results[i].Ntsam ? common.Common.numberWithCommas(data.NavYeartax0881Data.results[i].Ntsam) : "";
                                                data.NavYeartax0881Data.results[i].Otham = data.NavYeartax0881Data.results[i].Otham ? common.Common.numberWithCommas(data.NavYeartax0881Data.results[i].Otham) : "";
                                                break;
                                            case "P0881E6": // 주택임대차대출
            //									data.NavYeartax0881Data.results[i].Regnr = data.NavYeartax0881Data.results[i].Ldreg == "" ? "" :
                                                                                            // data.NavYeartax0881Data.results[i].Ldreg.substring(0,6) + "-" + data.NavYeartax0881Data.results[i].Ldreg.substring(6,13);
                                                data.NavYeartax0881Data.results[i].Rcbeg = dateFormat.format(data.NavYeartax0881Data.results[i].Rcbeg);
                                                data.NavYeartax0881Data.results[i].Rcend = dateFormat.format(data.NavYeartax0881Data.results[i].Rcend);
                                                data.NavYeartax0881Data.results[i].Inrat = parseFloat(data.NavYeartax0881Data.results[i].Inrat);
                                                data.NavYeartax0881Data.results[i].Pricp = data.NavYeartax0881Data.results[i].Pricp ? common.Common.numberWithCommas(data.NavYeartax0881Data.results[i].Pricp) : "";
                                                data.NavYeartax0881Data.results[i].Intrs = data.NavYeartax0881Data.results[i].Intrs ? common.Common.numberWithCommas(data.NavYeartax0881Data.results[i].Intrs) : "";
                                                break;
                                            case "P0881E3Y15": // 주택마련저축
                                                data.NavYeartax0881Data.results[i].Ptbeg = dateFormat.format(data.NavYeartax0881Data.results[i].Ptbeg);
                                                break;
                                            case "P0881E8": // 장기주택 저당차입금 이자상환액
                                                data.NavYeartax0881Data.results[i].Rcbeg = dateFormat.format(data.NavYeartax0881Data.results[i].Rcbeg);
                                                data.NavYeartax0881Data.results[i].Rcend = dateFormat.format(data.NavYeartax0881Data.results[i].Rcend);
                                                data.NavYeartax0881Data.results[i].Fixrt = data.NavYeartax0881Data.results[i].Fixrt == "1" ? true : false;
                                                data.NavYeartax0881Data.results[i].Nodef = data.NavYeartax0881Data.results[i].Nodef == "1" ? true : false;
                                                break;
                                            case "P0881E5": // 주택자금 - 월세
                                                data.NavYeartax0881Data.results[i].Rcbeg = dateFormat.format(data.NavYeartax0881Data.results[i].Rcbeg);
                                                data.NavYeartax0881Data.results[i].Rcend = dateFormat.format(data.NavYeartax0881Data.results[i].Rcend);
                                                // if(data.NavYeartax0881Data.results[i].Regnr.length == 10){
                                                // 	data.NavYeartax0881Data.results[i].Regnr = data.NavYeartax0881Data.results[i].Regnr.substring(0,3) + 
                                                // 												"-" + data.NavYeartax0881Data.results[i].Regnr.substring(3,5) + 
                                                // 												"-" + data.NavYeartax0881Data.results[i].Regnr.substring(5,10);
                                                // }
                                                if(data.NavYeartax0881Data.results[i].Ldreg.length == 13){
                                                    data.NavYeartax0881Data.results[i].Ldreg = data.NavYeartax0881Data.results[i].Ldreg.substring(0,6) + "-"
                                                                                                + data.NavYeartax0881Data.results[i].Ldreg.substring(6);
                                                }
                                                break;
                                        }
                                        
                                        vData.Data.push(data.NavYeartax0881Data.results[i]);
                                    }
                                }
                            }
                        },
                        error: function (oError) {
                            var Err = {};
                            oController.Error = "E";
                            
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    }
                );
            }
            
            oJSONModel.setData(vData);
            oTable.bindRows("/Data");
            oTable.setVisibleRowCount(vData.Data.length > 10 ? 10 : vData.Data.length);
            
            if(oController.Error == "E"){
                oController.Error = "";
                MessageBox.error(oController.ErrorMessage);
                return false;
            }		
        },
        
        // oSubty : fragment, oSubty2 : oData 호출을 위한 Flag(의료비, 기부금 제외)
        onPressSaveSubty : function(oEvent, oSubty, oSubty2){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
            
            var oTable = sap.ui.getCore().byId(oController.PAGEID + "_" + oSubty + "Table");
            var oJSONModel = oTable.getModel();
            var oData = oJSONModel.getProperty("/Data");
            console.log(oData)
            var onProcess = function(){
                var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
                
                var oZyear = oController._DetailJSonModel.getProperty("/Data/Zyear");
                var oPernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
                
                if(oSubty == "P0812ListY15"){ // 의료비
                    var createData = {Yeartax0812DataSet : []};
                        createData.IMode = "2";
                        createData.IPernr = oPernr;
                        createData.IZyear = oZyear;
                    
                    for(var i=0; i<oData.length; i++){
                        if(!oData[i].Zflnts || oData[i].Zflnts == ""){
                            if(!oData[i].Supnr){
                                if(oData[i].Medty == "I"){
                                    
                                } else {
                                    MessageBox.error("사업자등록번호를 입력하여 주십시오.");
                                    return;
                                }
                            } else if(oController.check_busino(oData[i].Supnr.replace(/[^0-9]/g, "")) == false && oData[i].Mepcd != "1"){
                                MessageBox.error("사업자등록번호가 올바르지 않습니다.");
                                oController._BusyDialog.close();
                                return;
                            } else if(!oData[i].Supnm || oData[i].Supnm.trim() == ""){
                                MessageBox.error("상호명을 입력하여 주십시오.");
                                oController._BusyDialog.close();
                                return;
                            } else if(!oData[i].Mepcd || oData[i].Mepcd == "0"){
                                MessageBox.error("증빙코드를 선택하여 주십시오.");
                                oController._BusyDialog.close();
                                return;
                            } else if(oData[i].Mesty == true && oData[i].Mepcd != "5"){
                                MessageBox.error("안경구입비의 경우 증빙코드 '기타 의료비 영수증'을 선택하여 주십시오.");
                                oController._BusyDialog.close();
                                return;
                            } else if(!oData[i].Mecnt){
                                MessageBox.error("건수를 입력하여 주십시오.");
                                oController._BusyDialog.close();
                                return;
                            } else if(!oData[i].Meamt){
                                MessageBox.error("금액을 입력하여 주십시오.");
                                oController._BusyDialog.close();
                                return;
                            }
                        } else if(!oData[i].Supnr){
                            if(oData[i].Mesty == "I"){ // 실손 의료비 제외
                                
                            } else {
                                MessageBox.error("사업자등록번호를 입력하여 주십시오.");
                                oController._BusyDialog.close();
                                return;
                            } 
                        }
                        
                        var detail = {};
                            detail.Zyear = oZyear;
                            detail.Pernr = oPernr;
                            detail.Seqnr = (i+1) + "";
                            detail.Subty = oData[i].Subty;
                            detail.Emnam = oData[i].Emnam;
                            detail.Objps = oData[i].Objps;
                            detail.Supnr = oData[i].Supnr ? oData[i].Supnr.replace(/[^0-9]/g, "") : "";
                            detail.Supnm = oData[i].Supnm ? oData[i].Supnm : "";
                            detail.Mepcd = oData[i].Mepcd;
                            detail.Mesty = oData[i].Mesty && oData[i].Mesty == true ? "X" : "";
                            detail.Surpg = oData[i].Surpg && oData[i].Surpg == true ? "X" : "";
                            detail.Mecnt = oData[i].Mecnt ? (oData[i].Mecnt + "").replace(/[^0-9]/g, "") : "";
                            detail.Meamt = oData[i].Meamt ? oData[i].Meamt.replace(/[^0-9]/g, "") : "";
                            detail.Zflnts = oData[i].Zflnts;
                        
                        createData.Yeartax0812DataSet.push(detail);
                    }
                    
                    oModel.create("/Yeartax0812DataHeaderSet", createData, 
                        {
                            success: function(data,res){
                                if(data){
                                
                                }
                            },
                            error: function (oError) {
                                var Err = {};
                                oController.Error = "E";
                                
                                if (oError.response) {
                                    Err = window.JSON.parse(oError.response.body);
                                    var msg1 = Err.error.innererror.errordetails;
                                    if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                    else oController.ErrorMessage = Err.error.message.value;
                                } else {
                                    oController.ErrorMessage = oError.toString();
                                }
                            }
                        }
                    );
                    
                } else if(oSubty == "P0858List"){ // 기부금
                    var createData = {NavYeartax0858Data : []};
                        createData.IPernr = oPernr;
                        createData.IZyear = oZyear;
                        createData.IMode = "2";
                        
                    for(var i=0; i<oData.length; i++){
                        if(!oData[i].Zflnts || oData[i].Zflnts == ""){
                            if(!oData[i].Docod || oData[i].Docod == "0"){
                                MessageBox.error("기부금 유형을 선택하여 주십시오.");
                                oController._BusyDialog.close();
                                return;
                            } else if(!oData[i].Donum || oData[i].Donum.trim() == ""){
                                MessageBox.error("사업자등록번호를 입력하여 주십시오.");
                                oController._BusyDialog.close();
                                return;
                            } else if(oController.check_busino(oData[i].Donum) == false){
                                MessageBox.error("사업자등록번호가 올바르지 않습니다.");
                                oController._BusyDialog.close();
                                return;
                            } else if(!oData[i].Donam || oData[i].Donam.trim() == ""){
                                MessageBox.error("기부처명을 입력하여 주십시오.");
                                oController._BusyDialog.close();
                                return;
                            } else if(!oData[i].Doamt){
                                MessageBox.error("금액을 입력하여 주십시오.");
                                oController._BusyDialog.close();
                                return;
                            }
                        }
                        
                        var detail = {};
                            detail.Zyear = oZyear;
                            detail.Pernr = oPernr;
                            detail.Seqnr = (i+1) + "";
                            detail.Deptx = oData[i].Deptx;
                            detail.Depty = oData[i].Depty;
                            detail.Emnam = oData[i].Emnam;
                            detail.Regno = oData[i].Regno;
                            detail.Docod = oData[i].Docod;
                            detail.Donum = oData[i].Donum.replace(/[^0-9]/g, "");
                            detail.Donam = oData[i].Donam;
                            detail.Depoi = oData[i].Depoi;
                            detail.Doamt = oData[i].Doamt.replace(/[^0-9]/g, "");
                            detail.Flnts = oData[i].Flnts == "X" || oData[i].Flnts == true ? "X" : "";
                            detail.Zflnts = oData[i].Zflnts;
                            
                        createData.NavYeartax0858Data.push(detail);
                    }	
                    
                    oModel.create("/Yeartax0858DataHeaderSet", createData, 
                        {
                            success: function(data,res){
                                if(data){
                                
                                }
                            },
                            error: function (oError) {
                                var Err = {};
                                oController.Error = "E";
                                
                                if (oError.response) {
                                    Err = window.JSON.parse(oError.response.body);
                                    var msg1 = Err.error.innererror.errordetails;
                                    if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                    else oController.ErrorMessage = Err.error.message.value;
                                } else {
                                    oController.ErrorMessage = oError.toString();
                                }
                            }
                        }
                    );
                } else {
                    var createData = {NavYeartax0881Data : []};
                        createData.IPernr = oPernr;
                        createData.IZyear = oZyear;
                        createData.IMode = "2";
                        
                        createData.ISubty = oSubty2;
                        
                        if(oSubty2 == "E2"){
                            if(oSubty == "P0881E201"){
                                createData.IPnsty = "01";
                            } else if(oSubty == "P0881E202"){
                                createData.IPnsty = "02";
                            }
                        }
                    
                    switch(oSubty){
                        case "P088101": // 보험료
                            for(var i=0; i<oData.length; i++){					
                                if(!oData[i].Zflnts || oData[i].Zflnts == ""){
                                    if(!oData[i].Ntsam && !oData[i].Otham){
                                        MessageBox.error("기타금액을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    }
                                }
                                
                                var detail = {};
                                    detail.Zyear = oZyear;
                                    detail.Pernr = oPernr;
                                    detail.Seqnr = (i+1) + "";
                                    detail.Depty = oData[i].Depty;
                                    detail.Emnam = oData[i].Emnam;
                                    detail.Objps = oData[i].Objps;
                                    detail.Regno = oData[i].Regno; 
                                    detail.Haned = oData[i].Haned == "X" || oData[i].Haned == true ? "X" : ""; // 장애인여부
                                    detail.Handi = oData[i].Handi == "X" || oData[i].Handi == true ? "X" : ""; // 장애인보험
                                    detail.Ntsam = oData[i].Ntsam ? oData[i].Ntsam.replace(/[^0-9]/g, "") : ""; // 국세청금액
                                    detail.Otham = oData[i].Otham ? oData[i].Otham.replace(/[^0-9]/g, "") : ""; // 기타금액
                                    detail.Zflnts = oData[i].Zflnts ? oData[i].Zflnts : ""; // 국세청자료
                                
                                createData.NavYeartax0881Data.push(detail);
                            }				
                            break;
                        case "P088102": // 교육비
                            for(var i=0; i<oData.length; i++){
                                if(!oData[i].Zflnts || oData[i].Zflnts == ""){
                                    if(!oData[i].Edulv || oData[i].Edulv == "0"){
                                        MessageBox.error("교육단계를 선택하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Ntsam && !oData[i].Otham){
                                        MessageBox.error("기타금액을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    }
                                }
                                
                                var detail = {};
                                    detail.Zyear = oZyear;
                                    detail.Pernr = oPernr;
                                    detail.Seqnr = (i+1) + "";
                                    detail.Depty = oData[i].Depty;
                                    detail.Emnam = oData[i].Emnam;
                                    detail.Objps = oData[i].Objps;
                                    detail.Regno = oData[i].Regno;
                                    detail.Haned = oData[i].Haned == "X" || oData[i].Haned == true ? "X" : "";
                                    detail.Edulv = oData[i].Edulv;
                                    
                                    if(oData[i].Exsty1 == true)
                                        detail.Exsty = "X";
                                    else if(oData[i].Exsty2 == true)
                                        detail.Exsty = "F";
                                    
                                    detail.Ntsam = oData[i].Ntsam ? oData[i].Ntsam.replace(/[^0-9]/g, "") : "";
                                    detail.Otham = oData[i].Otham ? oData[i].Otham.replace(/[^0-9]/g, "") : "";
                                    detail.Zflnts = oData[i].Zflnts;
                                
                                createData.NavYeartax0881Data.push(detail);
                            }
                            break;
                        case "P088103": // 신용카드
                        case "P088104": // 현금영수증
                        case "P088106": // 직불,선불카드
                        case "P088107": // 제로페이
                            for(var i=0; i<oData.length; i++){
                                if(!oData[i].Zflnts || oData[i].Zflnts == ""){
                                    if(!oData[i].Cadme || oData[i].Cadme == "0"){
                                        MessageBox.error("사용구분을 선택하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Ntsam && !oData[i].Otham){
                                        MessageBox.error("기타금액을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    }
                                }
                                
                                var detail = {};
                                    detail.Zyear = oZyear;
                                    detail.Pernr = oPernr;
                                    detail.Seqnr = (i+1) + "";
                                    detail.Depty = oData[i].Depty;
                                    detail.Emnam = oData[i].Emnam;
                                    detail.Objps = oData[i].Objps;
                                    detail.Regno = oData[i].Regno;
                                    detail.Cadme = oData[i].Cadme;
                                    detail.Ntsam = oData[i].Ntsam ? oData[i].Ntsam.replace(/[^0-9]/g, "") : "";
                                    detail.Otham = oData[i].Otham ? oData[i].Otham.replace(/[^0-9]/g, "") : "";
                                    detail.Zflnts = oData[i].Zflnts;
                                    detail.Zzupld = oData[i].Zzupld ? oData[i].Zzupld : "";
                                
                                createData.NavYeartax0881Data.push(detail);
                            }					
                            break;
                        case "P0881E6": // 주택임대차대출
                            for(var i=0; i<oData.length; i++){
                                if(!oData[i].Zflnts || oData[i].Zflnts == ""){
                                    if(!oData[i].Ldnam || oData[i].Ldnam.trim() == ""){
                                        MessageBox.error("대주명을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Ldreg){
                                        MessageBox.error("주민등록번호를 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(oController.check_jumin(oData[i].Ldreg) == false){
                                        MessageBox.error("주민등록번호가 올바르지 않습니다.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Rcbeg){
                                        MessageBox.error("시작일을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Rcend){
                                        MessageBox.error("종료일을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Inrat){
                                        MessageBox.error("이자율을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Pricp){
                                        MessageBox.error("원리금을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Intrs){
                                        MessageBox.error("이자를 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    }
                                }
                                
                                var detail = {};
                                    detail.Zyear = oZyear;
                                    detail.Pernr = oPernr;
                                    detail.Seqnr = (i+1) + "";
                                    detail.Ldnam = oData[i].Ldnam;
                                    detail.Ldreg = (oData[i].Regnr.indexOf("*") != -1) ? oData[i].Ldreg : oData[i].Regnr.replace(/[^0-9]/g, "");
                                    detail.Rcbeg = "\/Date(" + common.Common.getTime(oData[i].Rcbeg) + ")\/";
                                    detail.Rcend = "\/Date(" + common.Common.getTime(oData[i].Rcend) + ")\/";
                                    detail.Inrat = oData[i].Inrat;
                                    detail.Pricp = oData[i].Pricp.replace(/[^0-9]/g, "");
                                    detail.Intrs = oData[i].Intrs.replace(/[^0-9]/g, "");
                                    detail.Zflnts = oData[i].Zflnts;
                                
                                createData.NavYeartax0881Data.push(detail);
                            }
                            break;
                        case "P0881E5": // 월세임대계약
                            for(var i=0; i<oData.length; i++){
                                if(!oData[i].Zflnts || oData[i].Zflnts == ""){
                                    if(!oData[i].Ldnam || oData[i].Ldnam.trim() == ""){
                                        MessageBox.error("임대인성명을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Ldreg){
                                        MessageBox.error("주민등록번호를 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(oController.check_jumin(oData[i].Ldreg) == false){
                                        MessageBox.error("주민등록번호가 올바르지 않습니다.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Houty || oData[i].Houty == "0"){
                                        MessageBox.error("주택유형을 선택하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Addre || oData[i].Addre.trim() == ""){
                                        MessageBox.error("임대차 계약주소를 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Rcbeg){
                                        MessageBox.error("계약 시작일을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Rcend){
                                        MessageBox.error("계약 종료일을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Monrt){
                                        MessageBox.error("총금액을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    }
                                }
                                
                                var detail = {};
                                    detail.Zyear = oZyear;
                                    detail.Pernr = oPernr;
                                    detail.Seqnr = (i+1) + "";
                                    detail.Ldnam = oData[i].Ldnam;
                                    // detail.Ldreg = (oData[i].Regnr.indexOf("*") != -1) ? oData[i].Ldreg : oData[i].Regnr.replace(/[^0-9]/g, "");
                                    detail.Ldreg = oData[i].Ldreg;
                                    detail.Houty = oData[i].Houty;
                                    detail.Flrar = oData[i].Flrar;
                                    detail.Addre = oData[i].Addre;
                                    detail.Rcbeg = "\/Date(" + common.Common.getTime(oData[i].Rcbeg) + ")\/";
                                    detail.Rcend = "\/Date(" + common.Common.getTime(oData[i].Rcend) + ")\/";
                                    detail.Monrt = oData[i].Monrt.replace(/[^0-9]/g, "");
                                    detail.Zflnts = oData[i].Zflnts.replace(/[^0-9]/g, "");
                                    
                                createData.NavYeartax0881Data.push(detail);
                            }
                            break;
                        case "P0881E3Y15": // 주택마련저축
                            for(var i=0; i<oData.length; i++){
                                if(!oData[i].Zflnts || oData[i].Zflnts == ""){
                                    if(!oData[i].Pnsty || oData[i].Pnsty == "0"){
                                        MessageBox.error("유형을 선택하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Finco || oData[i].Finco == "0"){
                                        MessageBox.error("금융사를 선택하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Accno){
                                        MessageBox.error("계좌번호를 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Ptbeg){
                                        MessageBox.error("가입일자를 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Ntsam){
                                        MessageBox.error("금액을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    }
                                }
                                
                                var detail = {};
                                    detail.Zyear = oZyear;
                                    detail.Pernr = oPernr;
                                    detail.Seqnr = (i+1) + "";
                                    detail.Pnsty = oData[i].Pnsty;
                                    detail.Finco = oData[i].Finco;
                                    detail.Accno = oData[i].Accno;
                                    detail.Ptbeg = "\/Date(" + common.Common.getTime(oData[i].Ptbeg) + ")\/";
                                    detail.Ntsam = oData[i].Ntsam.replace(/[^0-9]/g, "");
                                    detail.Zflnts = oData[i].Zflnts;
                                    
                                createData.NavYeartax0881Data.push(detail);	
                            }
                            break;
                        case "P0881E1" :   // 퇴직연금
                        case "P0881E202" : // 연금저축
                        case "P0881E7" :   // 장기집합투자증권저축
                        case "P0881E201":  // 개인연금 저축공제
                            for(var i=0; i<oData.length; i++){
                                if(!oData[i].Zflnts || oData[i].Zflnts == ""){
                                    if(!oData[i].Finco || oData[i].Finco == "0"){
                                        MessageBox.error("금융사를 선택하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Accno || oData[i].Accno.trim() == ""){
                                        MessageBox.error("계좌번호를 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Ntsam){
                                        MessageBox.error("금액을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    }
                                }
                                
                                var detail = {};
                                    detail.Zyear = oZyear;
                                    detail.Pernr = oPernr;
                                    detail.Seqnr = (i+1) + "";
                                    
                                    if(oSubty2 == "E2"){
                                        if(oSubty == "P0881E201"){
                                            detail.Pnsty = "01";
                                        } else if(oSubty == "P0881E202"){
                                            detail.Pnsty = "02";
                                        }
                                    }
                                    
                                    detail.Finco = oData[i].Finco;
                                    detail.Insnm = oData[i].Insnm;
                                    detail.Accno = oData[i].Accno;
                                    detail.Ntsam = oData[i].Ntsam.replace(/[^0-9]/g, "");
                                    detail.Zflnts = oData[i].Zflnts;
                                
                                createData.NavYeartax0881Data.push(detail);
                            }
                            break;
                        case "P0881E9": // 기타
                            for(var i=0; i<oData.length; i++){
                                if(!oData[i].Zflnts || oData[i].Zflnts == ""){
                                    if(!oData[i].Pnsty || oData[i].Pnsty == "0"){
                                        MessageBox.error("유형을 선택하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Finco || oData[i].Finco == "0"){
                                        MessageBox.error("금융사를 선택하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Accno || oData[i].Accno.trim() == ""){
                                        MessageBox.error("계좌번호를 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Ntsam || oData[i].Ntsam.trim() == ""){
                                        MessageBox.error("금액을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    }
                                }
                                
                                var createData = {};
                                    createData.Zyear = oZyear;
                                    createData.Pernr = oPernr;
                                    createData.Seqnr = (i+1) + "";
                                    createData.Pnsty = oData[i].Pnsty;
                                    createData.Finco = oData[i].Finco;
                                    createData.Accno = oData[i].Accno;
                                    createData.Ntsam = oData[i].Ntsam.replace(/[^0-9]/g, "");
                                    createData.Zflnts = oData[i].Zflnts;
                                    
                                var oPath = "/P0881E9(Zyear='" + oZyear + "',Pernr='" + oPernr + "',Seqnr='" + createData.Seqnr + "')";
                                batchChanges.push(oModel.createBatchOperation(oPath, "PUT", createData));
                            }
                            break;
                        case "P0881E8": // 장기주택 저당차입금 이자상환액
                            for(var i=0; i<oData.length; i++){
                                if(!oData[i].Zflnts || oData[i].Zflnts == ""){
                                    if(!oData[i].Rcbeg){
                                        MessageBox.error("상환시작일을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Rcend){
                                        MessageBox.error("상환종료일을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Lnprd || oData[i].Lnprd.trim() == ""){
                                        MessageBox.error("대출기간(연도)을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    } else if(!oData[i].Ntsam){
                                        MessageBox.error("금액을 입력하여 주십시오.");
                                        oController._BusyDialog.close();
                                        return;
                                    }
                                }
                                
                                var detail = {};
                                    detail.Zyear = oZyear;
                                    detail.Pernr = oPernr;
                                    detail.Seqnr = (i+1) + "";
                                    detail.Rcbeg = "\/Date(" + common.Common.getTime(oData[i].Rcbeg) + ")\/";
                                    detail.Rcend = "\/Date(" + common.Common.getTime(oData[i].Rcend) + ")\/";
                                    detail.Lnprd = oData[i].Lnprd;
                                    detail.Fixrt = oData[i].Fixrt && (oData[i].Fixrt == "X" || oData[i].Fixrt == true) ? "1" : "";
                                    detail.Nodef = oData[i].Nodef && (oData[i].Nodef == "X" || oData[i].Nodef == true) ? "1" : "";
                                    detail.Ntsam = oData[i].Ntsam.replace(/[^0-9]/g, "");
                                    detail.Zflnts = oData[i].Zflnts;
                                
                                createData.NavYeartax0881Data.push(detail);
                            }
                            break;
                        default:
                    }
                    
                    oModel.create("/Yeartax0881DataHeaderSet", createData,
                        {
                            success: function(data,res){
                                if(data){
                                
                                }
                            },
                            error: function (oError) {
                                var Err = {};
                                oController.Error = "E";
                                
                                if (oError.response) {
                                    Err = window.JSON.parse(oError.response.body);
                                    var msg1 = Err.error.innererror.errordetails;
                                    if(msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                    else oController.ErrorMessage = Err.error.message.value;
                                } else {
                                    oController.ErrorMessage = oError.toString();
                                }
                            }
                        }
                    );
                }
                
                oController._BusyDialog.close();
                
                if(oController.Error == "E"){
                    oController.Error = "";
                    MessageBox.error(oController.ErrorMessage);
                    return;
                }
                
                MessageBox.success("저장되었습니다.", {
                    onClose : function(oEvent){
                        oController.onPressSearch4();
                        oController.onBindTable(oController, oSubty, oSubty2);
                    }
                });
            };
            
            var saveProcess = function(oEvent){
                if(oEvent && oEvent == MessageBox.Action.YES){
                    oController._BusyDialog.open();
                    setTimeout(onProcess, 100);
                }
            };
            
            MessageBox.confirm("저장하시겠습니까?", {
                actions : [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose : saveProcess 
            });
        },
        
        // 사업자등록번호 확인
        check_busino : function(vencod) {
            vencod = vencod.replace(/-/gi,"");
            if(vencod.length != 10) return false;
    //		var sum = 0;
    //		var getlist = new Array(10);
    //		var chkvalue = new Array("1","3","7","1","3","7","1","3","5");
    //		console.log("사업 넘버 : " + vencod);
    //		for(var i=0; i<10; i++) {
    //			getlist[i] = vencod.substring(i, i+1); 	
    //		}
    //		for(var i=0; i<9; i++) { 
    //			sum += getlist[i]*chkvalue[i]; 
    //		}
    //		sum = sum + parseInt((getlist[8]*5)/10);
    //		sidliy = sum % 10;
    //		sidchk = 0;
    //
    //		if(sidliy != 0) { 
    //			sidchk = 10 - sidliy; 
    //		}else { 
    //			sidchk = 0; 
    //		}
    //		
    //		if(sidchk != getlist[9]) { return false; }

            return true;
        },

        // 주민등록번호 확인
        check_jumin : function(jumin) {
    //		1var fmt = /^\d{6}[1234]\d{6}$/; // 포멧 설정
    //		if (!fmt.test(jumin)) {
    //			return false;
    //		}
            
            jumin = jumin.replace(/-/gi,"");
            
            if(jumin.length != 13) return false;
                    
    //		// 생년월일 검사
    //		var birthYear = (jumin.charAt(6) <= "2") ? "19" : "20";
    //		birthYear += jumin.substr(0, 2);
    //		var birthMonth = jumin.substr(2, 2) - 1;
    //		var birthDate = jumin.substr(4, 2);
    //		var birth = new Date(birthYear, birthMonth, birthDate);
    //
    //		if (birth.getYear() % 100 != jumin.substr(0, 2)
    //				|| birth.getMonth() != birthMonth
    //				|| birth.getDate() != birthDate) {
    //			return false;
    //		}
    //
    //		// Check Sum 코드의 유효성 검사
    //		var buf = new Array(13), x = 0;
    //		for (var i = 0; i < 13; i++){
    //			if(i==6) {
    //				x = 1;
    //				continue;
    //			}
    //			buf[i-x] = parseInt(jumin.charAt(i));
    //		}
    //			
    //
    //		multipliers = [ 2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5 ];
    //		for (var sum = 0, i = 0; i < 12; i++)
    //			sum += (buf[i] *= multipliers[i]);
    //
    //		if ((11 - (sum % 11)) % 10 != buf[12]) {
    //			return false;
    //		}

            return true;
        },
        
        onMakeData : function(oSubty, oSubty2, oData){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();


            return batchChanges;
        },
        
        onSaveOperator : function(oEvent, oSubty){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();

            var createData = {};
                createData.Zyear = oController._DetailJSonModel.getProperty("/Data/Zyear");
                createData.Pernr = oController._DetailJSonModel.getProperty("/Data/Pernr");
                createData.Entity = oSubty;
                createData.Finish = "";
                
            var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
            var oPath = "/YeartaxOper(Zyear='" + oController._DetailJSonModel.getProperty("/Data/Zyear");
                oPath += "',Pernr='" + oController._DetailJSonModel.getProperty("/Data/Pernr") + "')";
                
            oModel.update(oPath, createData, null,
                function doSaveLunchData_OnSuccess(oData, response) {
                    MessageBox.success("저장되었습니다.", {
                        onClose : function() {
                            console.log("Yeartax Operator Sucess!!!");
                            oController.onPressSearch4();
                            oController.onBindTable(oController, oSubty); // 데이터 다시 조회함
                        } 
                    });
                },
                function doSaveLunchData_OnError(oError) {
                    var Err = {};
                    if(oError.response) {
                        Err = common.Common.getErrMessage(oError.response);
                        MessageBox.error(Err.Message);
                    } else {
                        MessageBox.error(oError);
                    }
                }
            );
        },
        
        // 소득공제 - dialog 라인추가
        onAddLine : function(oEvent, oSubty, oSubty2){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
            
            console.log(oSubty, " ", oSubty2);
            
            if(!oController._AddLineDialog){
                oController._AddLineDialog = sap.ui.jsfragment("ZUI5_HR_Yeartax.fragment.Detail04_AddLine", oController);
                oView.addDependent(oController._AddLineDialog);
            }
            
            var oData = oController._DetailJSonModel.getProperty("/Data");
            
            var oTable = sap.ui.getCore().byId(oController.PAGEID + "_AddLineTable");
            var oJSONModel = oTable.getModel();
            var vData = {Data : []};
            
            var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
            var oPath = "/YeartaxGetFamResultSet?$filter=IYear eq '" + oData.Zyear + "'";
                oPath += " and IPernr eq '" + oData.Pernr + "'";
                oPath += " and IMode eq '3'";
            
            oModel.read(oPath, null, null, false,
                function(data, oResponse) {
                    if(data && data.results.length) {
                        for(var i=0; i<data.results.length; i++){
                            data.results[i].Idx = (vData.Data.length + 1);
                            
                            vData.Data.push(data.results[i]);
                        }					
                    }
                },
                function(Res) {
                    oController.Error = "E";
                    if(Res.response.body){
                        var ErrorJSON = JSON.parse(Res.response.body);
                        if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
                            oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
                        } else {
                            oController.ErrorMessage = ErrorMessage;
                        }
                    }
                }
            );
            
            if(oController.Error == "E"){
                oController.Error = "";
                MessageBox.error(oController.ErrorMessage);
                return;
            }
            
            oJSONModel.setData(vData);
            oTable.bindRows("/Data");
            oTable.setVisibleRowCount(vData.Data.length > 10 ? 10 : vData.Data.length);
                    
            oController._AddLineDialog.getModel().setData({Data : {Subty : oSubty, Subty2 : oSubty2}});
            
            oController._AddLineDialog.open();
        },
        
        // 단순 라인추가
        onAddLine2 : function(oEvent, oSubty){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();

            var oTable = sap.ui.getCore().byId(oController.PAGEID + "_" + oSubty + "Table");
            var oJSONModel = oTable.getModel();
            var oData = oJSONModel.getProperty("/Data");
            
            var oNewData = {Data : []};
            
            // 신규데이터 
            oNewData.Data.push({Idx : 0, Zflnts : "", Editable : true});
            
            // 기존데이터 추가
            for(var i=0; i<oData.length; i++){
                oData[i].Idx = oNewData.Data.length;
                oNewData.Data.push(oData[i]);
            }
            
            oJSONModel.setData(oNewData);
            oTable.bindRows("/Data");
            oTable.setVisibleRowCount(oNewData.Data.length > 10 ? 10 : oNewData.Data.length);
        },
        
        onSaveAddLine : function(oEvent){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();

            var oSubty = oController._AddLineDialog.getModel().getProperty("/Data/Subty");
            
            var oTable = sap.ui.getCore().byId(oController.PAGEID + "_AddLineTable");
            var oJSONModel = oTable.getModel();
            
            var vIdx = oTable.getSelectedIndices();
            
            if(vIdx.length == 0){
                MessageBox.error("대상자를 선택하여 주십시오.");
                return;
            }
            
            // 신규데이터
            var oNewData = {Data : []};
            
            for(var i=0; i<vIdx.length; i++){
                var sPath = oTable.getContextByIndex(vIdx[i]).sPath;
                var vData = oJSONModel.getProperty(sPath);
                
                vData.Idx = i;
                vData.Editable = true;
                
                if(oSubty == "P0858List"){
                    vData.Depoi = vData.Objps;
                } else {
                    vData.Objps = vData.Objps;
                }
                
                if(oSubty == "P0812List" || oSubty == "P0812ListY15") {
                    vData.Subty = vData.Subty;
                    vData.Subtx = vData.Stext;
                } else {
                    vData.Depty = vData.Subty;
                    vData.Deptx = vData.Stext;
                    vData.Regno = vData.Regno;
                    vData.Regnr = vData.Regnr;
                }
                
                oNewData.Data.push(vData);
            }
            
            // 기존 테이블에 들어있던 데이터 추가
            var oTable2 = sap.ui.getCore().byId(oController.PAGEID + "_" + oSubty + "Table");
            var oJSONModel2 = oTable2.getModel();
            var oData = oJSONModel2.getProperty("/Data");
            for(var i=0; i<oData.length; i++){
                oData[i].Idx = oNewData.Data.length;
                oNewData.Data.push(oData[i]);
            }
            
            oJSONModel2.setData(oNewData);
            oTable2.bindRows("/Data");
            oTable2.setVisibleRowCount(oNewData.Data.length > 10 ? 10 : oNewData.Data.length);
            
            oController._AddLineDialog.close();
        },
        
        // 소득공제 - dialog 라인삭제
        onDeleteLine : function(oEvent, oSubty, oSubty2){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
            
            var oTable = sap.ui.getCore().byId(oController.PAGEID + "_" + oSubty + "Table");
            var oJSONModel = oTable.getModel();
            var oData = oJSONModel.getProperty("/Data");
            
            var vIdx = oTable.getSelectedIndices();		
            if(vIdx.length == 0){
                MessageBox.error("삭제할 라인을 선택하여 주십시오.");
                return;
            }
            
            var oNewData = {Data : []};
            
            for(var i=0; i<oData.length; i++){
                var check = "";
                
                for(var j=0; j<vIdx.length; j++){
                    if(check == "X") continue;
                    
                    var sPath = oTable.getContextByIndex(vIdx[j]).sPath;
                    
                    if(oJSONModel.getProperty(sPath + "/Idx") == oData[i].Idx){
                        if(oJSONModel.getProperty(sPath + "/Zflnts") == "X"){
                            MessageBox.error("국세청자료를 통해 등록된 데이터는 삭제가 불가능합니다.");
                            return;
                        }
                        
                        check = "X";
                    }
                }
                
                if(check == ""){
                    oData[i].Idx = oNewData.Data.length;
                    oNewData.Data.push(oData[i]);
                }
            }
            
            oJSONModel.setData(oNewData);
            oTable.bindRows("/Data");
            oTable.setVisibleRowCount(oNewData.Data.length > 10 ? 10 : oNewData.Data.length);
        },
        
        // 소득공제 dialog 내 테이블 생성
        makeTable : function(oController, oTable, col_info){
            if(!oController || !oTable || !col_info) return;
            
            for(var i=0; i<col_info.length; i++){
                var oColumn = new sap.ui.table.Column({
                    hAlign : "Center",
                    flexible : false,
                    autoResizable : true,
                    resizable : true,
                    showFilterMenuEntry : true
                });		
                
                if(col_info[i].filter){
                    oColumn.setFilterProperty(col_info[i].id);
                }
                
                if(col_info[i].sort){
                    oColumn.setSortProperty(col_info[i].id);
                }
                
                oColumn.addMultiLabel(new sap.ui.commons.TextView({text : col_info[i].label, textAlign : "Center", width : "100%"}).addStyleClass("FontFamily"));
                
                if(col_info[i].plabel != ""){
                    oColumn.addMultiLabel(new sap.ui.commons.TextView({text : col_info[i].plabel, textAlign : "Center", width : "100%"}).addStyleClass("FontFamily"));
                }

                if(col_info[i].span > 0){
                    oColumn.setHeaderSpan([col_info[i].span, 1]);
                }
                
                if(col_info[i].width && col_info[i].width != ""){
                    oColumn.setWidth(col_info[i].width);
                }
                
                if(col_info[i].align && col_info[i].align != ""){
                    oColumn.setHAlign(col_info[i].align);
                }
                
                var oTemplate;
                            
                switch(col_info[i].type){
                    case "checkbox":
                        oTemplate = new sap.m.CheckBox({
                                        selected : "{" + col_info[i].id + "}",
                                        editable : "{Editable}"
                                    });
                        break;
                    case "checkbox2":
                        oTemplate = new sap.m.CheckBox({
                                        selected : "{" + col_info[i].id + "}",
                                        editable : false
                                    });
                        break;
                    case "input":
                        oTemplate = new sap.m.Input({
                                        value : "{" + col_info[i].id + "}",
                                        editable : "{Editable}",
                                        width : "100%",
                                        textAlign : "End",
                                        maxLength : 13,
                                        liveChange : function(oEvent){
                                            var value = oEvent.getParameters().value.replace(/[^0-9\.]/g, "");
                                            
                                            oEvent.getSource().setValue(common.Common.numberWithCommas(value));
                                        }
                                    }).addStyleClass("FontFamily");
                        break;
                    case "inputnumber":
                        oTemplate = new sap.m.Input({
                                        value : "{" + col_info[i].id + "}",
                                        editable : "{Editable}",
                                        width : "100%",
                                        textAlign : "End",
                                        maxLength : 3,
                                        liveChange : function(oEvent){
                                            var value = oEvent.getParameters().value.replace(/[^0-9\.]/g, "");
                                            
                                            oEvent.getSource().setValue(value);
                                        }
                                    }).addStyleClass("FontFamily");
                        break;
                    case "inputtext":
                        oTemplate = new sap.m.Input({
                                        value : "{" + col_info[i].id + "}",
                                        editable : "{Editable}",
                                        width : "100%",
                                        maxLength : 40
                                    }).addStyleClass("FontFamily");
                        break;
                    case "inputregnr":
                        oTemplate = new sap.m.Input({
                                        value : "{" + col_info[i].id + "}",
                                        editable : "{Editable}",
                                        width : "100%",
                                        maxLength : 15,
                                        change : function(oEvent){
                                            var value = oEvent.getParameters().value.replace(/[^0-9]/g, "");
                                            
                                            oEvent.getSource().setValue(value.substring(0,6) + "-" + value.substring(6,13));
                                        }
                                    }).addStyleClass("FontFamily");
                        break;
                    case "inputregnr2":
                        oTemplate = new sap.m.Input({
                                        value : "{" + col_info[i].id + "}",
                                        editable : "{Editable}",
                                        width : "100%",
                                        maxLength : 15,
                                        change : function(oEvent){
                                            var value = oEvent.getParameters().value.replace(/[^0-9]/g, "");
                                            // 주민등록번호
                                            if(value.length > 10){
                                                oEvent.getSource().setValue(value.substring(0,6) + "-" + value.substring(6,13));
                                            // 사업자번호
                                            } else {
                                                oEvent.getSource().setValue(value.substring(0,3) + "-" + value.substring(3,5) + "-" + value.substring(5,10));
                                            }
                                        }
                                    }).addStyleClass("FontFamily");
                        break;
                    case "datepicker":
                        oTemplate = new sap.m.DatePicker({
                                        width : "100%",
                                        valueFormat : "yyyy-MM-dd",
                                        displayFormat : gDtfmt,
                                        value : "{" + col_info[i].id + "}",
                                        textAlign : "Begin",
                                        change : oController.onChangeDate,
                                        editable : "{Editable}"
                                    }).addStyleClass("FontFamily");
                        break;
                    case "radiobutton":
                        oTemplate = new sap.m.RadioButton({
                                        selected : "{" + col_info[i].id + "}",
                                        groupName : "{Idx}",
                                        width : "100%",
                                        useEntireWidth : true,
                                        editable : {
                                            parts : [{path : "Editable"}, {path : "Edulv"}],
                                            formatter : function(fVal1, fVal2){
                                                if(fVal1 == true && fVal2 == "2") return true;
                                                else return false;
                                            }
                                        }
                                    });
                        break;
                    case "radiobutton2":
                        oTemplate = new sap.m.RadioButton({
                                        selected : "{" + col_info[i].id + "}",
                                        groupName : "{Idx}",
                                        width : "100%",
                                        useEntireWidth : true,
                                        editable : "{Editable}"
                                    });
                        break;
                    case "regnr": // 주민등록번호
                        oTemplate = new sap.ui.commons.TextView({
                                        text : {
                                            path : col_info[i].id,
                                            formatter : function(fVal){
                                                return fVal ? fVal.substring(0,6) + "-" + fVal.substring(6,13) : "";
                                            }
                                        },
                                        textAlign : "Center"
                                    }).addStyleClass("FontFamily");
                        break;
                    case "supnr": // 사업자등록번호
                        oTemplate = new sap.m.Input({
                                        value : "{" + col_info[i].id + "}",
                                        change : function(oEvent){
                                            var value = oEvent.getParameters().value.replace(/[^0-9]/g, "");
                                            
                                            // oEvent.getSource().setValue(value.substring(0,3) + "-" + value.substring(3,5) + "-" + value.substring(5,10));
                                        },
                                        editable : "{Editable}",
                                        maxLength : common.Common.getODataPropertyLength("ZHR_YEARTAX_SRV", "Yeartax0812Data", "Supnr")
                                    }).addStyleClass("FontFamily");
                        break;
                    case "pdf":
                        oTemplate = new sap.ui.core.Icon({
                                        src : "sap-icon://pdf-attachment",
                                        visible : {
                                            path : col_info[i].id,
                                            formatter : function(fVal){
                                                return fVal == "X" ? true : false;
                                            }
                                        }
                                    });
                        break;
                    case "icon":
                        oTemplate = new sap.ui.core.Icon({
                                        src : "sap-icon://accept",
                                        size : "15px",
                                        color : "#ee0000",
                                        visible : {
                                            path : col_info[i].id,
                                            formatter : function(fVal){
                                                return fVal == "X" ? true : false;
                                            }
                                        }
                                    });
                        break;
                    case "combobox":
                        oTemplate = new sap.m.ComboBox({
                                        selectedKey : "{" + col_info[i].id + "}",
                                        width : "100%",
                                        editable : "{Editable}",
                                        customData : [new sap.ui.core.CustomData({key : "", value : "{Idx}"})]
                                    }).addStyleClass("FontFamily");
                                    
                        var oModel = $.app.getModel("ZHR_YEARTAX_SRV");
                        var oPath = "/YeartaxCodeTableSet?$filter=ICodeT eq ";
                        
                        switch(col_info[i].id){
                            case "Mepcd": // 의료비-의료증빙코드
                                oPath += "'899' and ICodty eq 'PKR_MEPCD'";
                                break;
                            case "Cadme": // 신용카드/현금영수증/제로페이-사용구분
                                oPath += "'801'";
                                break;
                            case "Finco": // 개인연금저축공제-금융사
                                oPath += "'803'";
                                
                                oTemplate.attachChange(function(oEvent){
                                    var oIdx = oEvent.getSource().getCustomData()[0].getValue();
                                    var oInsnm = "";
                                    
                                    if(oEvent.getSource().getSelectedItem()){
                                        oInsnm = oEvent.getSource().getSelectedItem().getText();
                                    } else {
                                        oInsnm = "";
                                    }
                                    
                                    oTable.getModel().setProperty("/Data/" + oIdx + "/Insnm", oInsnm);
                                });
                                break;
                            case "Houty": // 주택유형
                                oPath += "'899' and ICodty eq 'PKR_HOUTY'";
                                break;
                            case "Pnsty": // 주택마련저축-유형
                                oPath += "'804' and ICodty eq 'E3'";
                                break;
                            case "Docod": // 기부금-유형
                                oPath += "'898' and ICodty eq '0858'";
                                break;
                            case "Edulv": // 교육비-교육단계
                                oPath += "'899' and ICodty eq 'PKR_EDULV'";
                                
                                oTemplate.attachChange(function(oEvent){
                                    if(oEvent.getSource().getSelectedKey() != "2"){
                                        var oIdx = oEvent.getSource().getCustomData()[0].getValue();
                                        
                                        oTable.getModel().setProperty("/Data/" + oIdx + "/Exsty1", false);
                                        oTable.getModel().setProperty("/Data/" + oIdx + "/Exsty2", false);
                                    }	
                                });
                                
                                break;
                        }
                        
                        oModel.read(oPath, null, null, false,
                            function(data, oResponse) {
                                if(data && data.results.length){
                                    for(var i=0; i<data.results.length; i++){
                                        oTemplate.addItem(new sap.ui.core.Item({key : data.results[i].Code, text : data.results[i].Text}));
                                    }
                                }
                            },
                            function(Res) {
                                if(Res.response.body){
                                    var ErrorJSON = JSON.parse(Res.response.body);
                                    if(ErrorJSON.error.innererror.errordetails&&ErrorJSON.error.innererror.errordetails.length){
                                        oController.ErrorMessage = ErrorJSON.error.innererror.errordetails[0].message;
                                    } else {
                                        oController.ErrorMessage = ErrorMessage;
                                    }
                                }
                            }
                        );
                        
                        break;
                    default:
                        oTemplate = new sap.ui.commons.TextView({
                                        text : "{" + col_info[i].id + "}",
                                        textAlign : (col_info[i].align && col_info[i].align != "") ? col_info[i].align : "Center"
                                    }).addStyleClass("FontFamily");
                }
                
                oColumn.setTemplate(oTemplate);
                oTable.addColumn(oColumn);
            }
        },
        
        // 대상자 변경
        searchOrgehPernr : function(oEvent){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
			var oController = oView.getController();
			
			var initData = {
                Percod: oController.getSessionInfoByKey("Percod"),
                Bukrs: oController.getSessionInfoByKey("Bukrs2"),
                Langu: oController.getSessionInfoByKey("Langu"),
                Molga: oController.getSessionInfoByKey("Molga"),
                Datum: new Date(),
                Mssty: "",
                autoClose : false
            },
            callback = function(o) {
				var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
				var oController = oView.getController();
				
				if(o.Otype == "O"){
					MessageBox.error(oController.getBundleText("MSG_48016")); // 대상자를 선택하여 주십시오.
					return;
				}
			
				// 인적공제 - 대상자 정보 변경
                oController._DetailJSonModel.setProperty("/Data/Pernr", o.Objid);
                oController._DetailJSonModel.setProperty("/Data2/Pernr", o.Objid);
                oController._DetailJSonModel.setProperty("/Data2/Ename", o.Stext);
                oController._DetailJSonModel.setProperty("/Data2/Zzorgtx", o.PupStext);
                oController._DetailJSonModel.setProperty("/Data2/ZpGradeTxt", o.ZpGradeTxt);
    
                oController._Pernr = o.Objid;			
                
                oController.onDataProgress();
                oController.handleIconTabBarSelect("", "X");
    			
    			oController.OrgOfIndividualHandler.getDialog().close();
            };
    
            oController.OrgOfIndividualHandler = OrgOfIndividualHandler.get(oController, initData, callback);	
            DialogHandler.open(oController.OrgOfIndividualHandler);
		},
		
		getOrgOfIndividualHandler: function() {
            return this.OrgOfIndividualHandler;
        },
        
		/**
         * @brief 공통-사원검색 > 조직검색 팝업 호출 event handler
         */
		displayMultiOrgSearchDialog: function (oEvent) {
			var oController = $.app.getController();

			SearchOrg.oController = oController;
			SearchOrg.vActionType = "Multi";
			SearchOrg.vCallControlId = oEvent.getSource().getId();
			SearchOrg.vCallControlType = "MultiInput";

			if (!oController.oOrgSearchDialog) {
				oController.oOrgSearchDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
				$.app.getView().addDependent(oController.oOrgSearchDialog);
			}

			oController.oOrgSearchDialog.open();
		},

		onESSelectPerson : function(data){
			var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
			var oController = oView.getController();
 
			// 인적공제 - 대상자 정보 변경
            oController._DetailJSonModel.setProperty("/Data/Pernr", data.Pernr);
            oController._DetailJSonModel.setProperty("/Data2/Pernr", data.Pernr);
            oController._DetailJSonModel.setProperty("/Data2/Ename", data.Ename);
            oController._DetailJSonModel.setProperty("/Data2/Zzorgtx", data.Zzorgtx);
            oController._DetailJSonModel.setProperty("/Data2/ZpGradeTxt", data.ZpGradeTxt);

            oController._Pernr = data.Pernr;			
            
            oController.onDataProgress();
            oController.handleIconTabBarSelect("", "X");

			oController.OrgOfIndividualHandler.getDialog().close();
			SearchUser1.onClose();
		},
        
        // _AddPersonDialog : null ,
        // displayEmpSearchDialog : function(oEvent){
        //     var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
        //     var oController = oView.getController();
            
        //     if(oEvent){
        //         oController._oControl = oEvent.getSource();
        //         oController._vEnamefg = "";
        //     }
            
        //     jQuery.sap.require("common.SearchUser1");
            
        //     //각 발령대상자의 발령일을 검색조건으로 설정한다.
        //     var oActda = sap.ui.getCore().byId(oController.PAGEID + "_Actda");
        //     if(oActda) oController._vActda = oActda.getValue();
            
        //     common.SearchUser1.oController = oController;
        //     common.SearchUser1.fPersaEnabled = false;
            
        //     if(!oController._AddPersonDialog) {
        //         oController._AddPersonDialog = sap.ui.jsfragment("fragment.EmployeeSearch1", oController);
        //         oView.addDependent(oController._AddPersonDialog);
        //     }
            
        //     oController._AddPersonDialog.open();
            
        // },
        
        // displayMultiOrgSearchDialog : function(oEvent) {
        //     var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
        //     var oController = oView.getController();
            
        //     jQuery.sap.require("common.SearchOrg");
            
        //     common.SearchOrg.oController = oController;
        //     common.SearchOrg.vActionType = "Multi";
        //     common.SearchOrg.vCallControlId = oEvent.getSource().getId();
        //     common.SearchOrg.vCallControlType = "MultiInput";
            
        //     if(!oController._SerachOrgDialog) {
        //         oController._SerachOrgDialog = sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", oController);
        //         oView.addDependent(oController._SerachOrgDialog);
        //     }
        //     oController._SerachOrgDialog.open();
        // },
        
        // displayOrgSearchDialog : function(oEvent) {
        //     var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
        //     var oController = oView.getController();
            
        //     jQuery.sap.require("common.SearchOrg");
            
        //     common.SearchOrg.oController = oController;
        //     common.SearchOrg.vActionType = "Single";
        //     common.SearchOrg.vCallControlId = oEvent.getSource().getId();
        //     common.SearchOrg.vCallControlType = "Input";
        //     common.SearchOrg.vNoPersa = true;
            
        //     if(!oController._SerachOrgDialog) {
        //         oController._SerachOrgDialog = sap.ui.jsfragment("ZUI5_HR_YET.fragment.COMMON_SEARCH_ORG", oController);
        //         oView.addDependent(oController._SerachOrgDialog);
        //     }
        //     oController._SerachOrgDialog.open();
        // },
        
        // onESSelectPerson : function(oEvent) {
        //     var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
        //     var oController = oView.getController();
        
        //     var mEmpSearchResult = $.app.getModel("EmpSearchResult");
        //     var vEmpSearchResult = mEmpSearchResult.getProperty("/EmpSearchResultSet");
            
        //     var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table"); 
        //     var vIDXs = oTable.getSelectedIndices();
        //     if(vEmpSearchResult && vEmpSearchResult.length > 0 ) {
        //         if(vIDXs.length > 1){
        //             MessageBox.alert("대상자를 한명만 선택하여 주십시오.");
        //             return;
        //         }else if(vIDXs.length < 1){
        //             MessageBox.alert("대상자를 선택하여 주십시오.");
        //             return;
        //         }
                
        //         var _selPath = oTable.getContextByIndex(vIDXs[0]).sPath; // 
                
        //         // 인적공제 - 대상자 정보 변경
        //         oController._DetailJSonModel.setProperty("/Data/Pernr", mEmpSearchResult.getProperty(_selPath + "/Pernr"));
        //         oController._DetailJSonModel.setProperty("/Data2/Pernr", mEmpSearchResult.getProperty(_selPath + "/Pernr"));
        //         oController._DetailJSonModel.setProperty("/Data2/Ename", mEmpSearchResult.getProperty(_selPath + "/Ename"));
        //         oController._DetailJSonModel.setProperty("/Data2/Zzorgtx", mEmpSearchResult.getProperty(_selPath + "/Zzorgtx"));
        //         oController._DetailJSonModel.setProperty("/Data2/ZpGradeTxt", mEmpSearchResult.getProperty(_selPath + "/ZpGradeTxt"));

        //         oController._Pernr = mEmpSearchResult.getProperty(_selPath + "/Pernr");			
                
        //         oController.onDataProgress();
        //         oController.handleIconTabBarSelect("", "X");

        //     }else {
        //         MessageBox.alert("대상자를 선택하여 주십시오.");
        //         return;
        //     }
            
        //     oController._AddPersonDialog.close();
        // },
        
        // onESSClose : function(oEvent){
        //     var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
        //     var oController = oView.getController();

        //     oController._AddPersonDialog.close();
        // },

        // PDF업로드 관련
        setAttachFile : function(oController) {
            var oFileUploader = sap.ui.getCore().byId("yeaUploader");
                oFileUploader.setSlug(oController._Pernr + "|" + oController._Zyear);
            
            oController.refreshAttachFileList(oController);
        },
        
        refreshAttachFileList : function(oController) {
            //console.log("Pernr : " + oController._Pernr);
            //console.log("Zyear : " + oController._Zyear);
            var oAttachFileList = sap.ui.getCore().byId("yeaUploader_AttachFileList");
            var oAttachFileInfo = sap.ui.getCore().byId("yeaUploader_AttachFileInfo");
            var oFilters = [];
                oFilters.push(new sap.ui.model.Filter("IPernr", "EQ", oController._Pernr));
                oFilters.push(new sap.ui.model.Filter("ITyear", "EQ", oController._Zyear));
                oFilters.push(new sap.ui.model.Filter("IMode", "EQ", "1")); 
                
            oAttachFileList.bindItems("/YeartaxPdfUploadSet", oAttachFileInfo, null, oFilters);
        },
        
        fileSizeExceed : function (oEvent) {
            var sName = oEvent.getParameter("fileName");
            var fSize = oEvent.getParameter("fileSize");
            var fLimit = this.getMaximumFileSize();
            MessageBox.alert("File: " + sName + " is of size " + fSize + " MB which exceeds the file size limit of " + fLimit + " MB.", "ERROR", "File size exceeded");
        },
        
        typeMissmatch : function (oEvent) {
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
            
            var sName = oEvent.getParameter("fileName");
            var sType = oEvent.getParameter("fileType");
            var sMimeType = this.getMimeType();
            console.log("mimetype : " + sMimeType);
            if (!sMimeType) {			
                console.log(sap.ui.getCore().byId(oController.PAGEID + "_1001_ATTACHFILE_BTN"));
                var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_1001_ATTACHFILE_BTN");
        //		sMimeType = oFileUploader.getFileType();
            }
            MessageBox.alert(sName + " 는 허용된 파일 확장자가 아닙니다.", {title : "안내"});
            
        },
        
        uploadComplete: function (oEvent) {
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
        
            oController._BusyDialog.close();
            
            var sResponse = oEvent.getParameter("response");
    //2015 변경		
            if(sResponse == "Error: null"){
                sResponse = "파일 업로드가 완료되었습니다.";
                MessageBox.success(sResponse);
            } else {
                MessageBox.error(sResponse);
            }
            
            var oFileUploader = sap.ui.getCore().byId("yeaUploader");
                oFileUploader.setValue("");
            
            oController.refreshAttachFileList(oController);
        },
        
        uploadAborted : function(oEvent) {
            MessageBox.alert("파일 업로드에 실패하였습니다.");
        },
        
        onFileChange : function(oEvent) {
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
        
            // if(!oController.loadDialog) {
            // 	oController.loadDialog = new sap.m.Dialog({showHeader : false}); 
            // 	oController.loadDialog.addContent(new sap.m.BusyIndicator({text : "파일 업로드 중입니다. 잠시만 기다려 주십시오."}));
            // 	oController.getView().addDependent(oController.loadDialog);
            // } else {
            // 	oController.loadDialog.removeAllContent();
            // 	oController.loadDialog.destroyContent();
            // 	oController.loadDialog.addContent(new sap.m.BusyIndicator({text : "파일 업로드 중입니다. 잠시만 기다려 주십시오."}));
            // }
            // if(!oController.loadDialog.isOpen()) {
            // 	oController.loadDialog.open();
            // }
            oController._BusyDialog.open();
        },
        
        onDeleteAttachFile : function(oEvent) {
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
            
            // if(!oController.loadDialog) {
            // 	oController.loadDialog = new sap.m.Dialog({showHeader : false}); 			
            // 	oController.loadDialog.addContent(new sap.m.BusyIndicator({text : "파일 삭제 중입니다. 잠시만 기다려 주십시오."}));
            // 	oController.getView().addDependent(oController.loadDialog);
            // } else {
            // 	oController.loadDialog.removeAllContent();
            // 	oController.loadDialog.destroyContent();
            // 	oController.loadDialog.addContent(new sap.m.BusyIndicator({text : "파일 삭제 중입니다. 잠시만 기다려 주십시오."}));
            // }
            // if(!oController.loadDialog.isOpen()) {
            // 	oController.loadDialog.open();
            // }
            
            oController._BusyDialog.open();
            
            var oModel = sap.ui.getCore().getModel("ZHR_YEARTAX_SRV");
            oModel.remove(
                    "/YeaPdfDel(Pernr='" + oController._Pernr + "',Zyear='" + oController._Zyear + "')",
                    null,
                    function (oData, response) {
                        MessageBox.alert("파일을 삭제하였습니다.", {title : "안내"});
                        console.log("Sucess Doc Attach File Delete !!!");
    //					oController.onTab2Refresh(oController);
                    },
                    function (oError) {
                        var Err = {};
                        if(rError2.response) {
                            Err = window.JSON.parse(rError2.response.body);
                            MessageBox.alert(Err.error.message.value);
                        } else {
                            MessageBox.alert(rError2);
                        }
                        rError = oError;
                    }
            );
            
            // if(oController.loadDialog && oController.loadDialog.isOpen()) {
            // 	oController.loadDialog.close();
            // }
            
            oController._BusyDialog.close();
            
            oController.refreshAttachFileList(oController);
        },
        
        onDownloadAttachFile : function(oEvent) {
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
        
            var vPernr = oController._Pernr;
            var vZyear = oController._Zyear;
            
            var jsonURL = "/sap/bc/bsp/sap/ZUI5_HR_BSP/yea_json.htm";
            
            var sendData = {
                PERNR : vPernr,
                ZYEAR : vZyear,
                ZTYPE : "P"
            };
            
            $.getJSON(jsonURL, sendData, function(data){
                if(data.URL != "" && data.URL != null) {
                    if($.browser.webkit) {
                        var iframe = document.getElementById('iWorker');
                        iframe.onload = function() {
                            setTimeout(function() {
                                iframe.focus();
                                iframe.contentWindow.print();
                            }, 100);
                        };
                        iframe.src = data.URL;
                    } else {
                        window.open("pdfPrint.html?pdf=" + data.URL.replace(/=/g, "%3D"), "pdfPring", "width=800, height=700, toolbar=no, menubar=no, scrollbars=no, resizable=no" );
                    }
                }
            });
        },
        
        onSetView : function(oEvent){
            var oView = sap.ui.getCore().byId("ZUI5_HR_Yeartax.YearTaxDetail");
            var oController = oView.getController();
        
            var oFileDelButton = sap.ui.getCore().byId("yeaUploader_AttachFileDelete");
            var oAttachFileList = sap.ui.getCore().byId("yeaUploader_AttachFileList");
            
            if(oController._DISABLED && oEvent.getParameters().actual > 0) {
                //oAttachFileList.setVisible(true);
                oFileDelButton.setVisible(true);
            } else {
                //oAttachFileList.setVisible(false);
                oFileDelButton.setVisible(false);
            }		
        }
        
    });
});