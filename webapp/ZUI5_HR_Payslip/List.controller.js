sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
		"sap/ui/model/json/JSONModel",
		"sap/m/MessageBox",
        "common/OrgOfIndividualHandler",
        "common/DialogHandler"
    ],
    function (Common, CommonController, JSONModel, MessageBox,OrgOfIndividualHandler,DialogHandler) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            // 출장

            PAGEID: "List",
            _ListCondJSonModel: new JSONModel(),
            _ListJSonModel: new JSONModel(),
            _DetailJSonModel: new JSONModel(),

            _BusyDialog: new sap.m.BusyDialog(),

            onInit: function () {
                this.setupView().getView().addEventDelegate(
                    {
                        onBeforeShow: this.onBeforeShow,
                        onAfterShow: this.onAfterShow
                    },
                    this
                );
            },

            onBeforeShow: function () {
                var oController = $.app.getController(),
                    curDate = new Date(),
                    vYear = [
                        { Code: "" + curDate.getFullYear(), Text: curDate.getFullYear() },
                        { Code: "" + curDate.getFullYear() - 1, Text: curDate.getFullYear() - 1 },
                        { Code: "" + curDate.getFullYear() - 2, Text: curDate.getFullYear() - 2 }
                    ],
                    vPernr = this.getSessionInfoByKey("Pernr");

                oController._ListCondJSonModel.setProperty("/Year", vYear);
                oController._ListCondJSonModel.setProperty("/Data", { Year: "" + curDate.getFullYear(), Pernr: vPernr, Langu: this.getSessionInfoByKey("Langu"), Bukrs: this.getSessionInfoByKey("Bukrs") });
                if($.app.getAuth() == "H"){
                    oController._ListCondJSonModel.setProperty("/Data/Pernr", "");
                }
            },

            onAfterShow: function () {
                var oController = $.app.getController();
                if($.app.getAuth() != "H"){
                    oController.onPressSearch();
                }
            },

            onPressSearch: function () {
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_PAY_RESULT_SRV");
				var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
                var vCondiData = oController._ListCondJSonModel.getProperty("/Data");
                var vData = { Data: [] };
                if(vCondiData.Pernr == ""){
                    // 대상자를 선택 후 조회하시기 바랍니다.
                    MessageBox.error(oController.getBundleText("MSG_54002"));
                    return;
                }

                var search = function () {
                    var oPath = "";
                    var createData = { PayslipNav: [] };

                    oPath = "/PayslipSet";
                    createData.IGubun = "1";
                    createData.IPernr = vCondiData.Pernr && vCondiData.Pernr != "" ? vCondiData.Pernr : "";
                    createData.IYear = vCondiData.Year && vCondiData.Year != "" ? vCondiData.Year : "";
                    createData.ILangu = vCondiData.Langu && vCondiData.Langu != "" ? vCondiData.Langu : "";
                    createData.IBukrs = vCondiData.Bukrs && vCondiData.Bukrs != "" ? vCondiData.Bukrs : "";

                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data) {
                            if (data) {
                                if (data.PayslipNav && data.PayslipNav.results.length > 0) {
                                    for (var i = 0; i < data.PayslipNav.results.length; i++) {
                                        if (data.PayslipNav.results[i].Zyymm == "000000") {
                                            data.PayslipNav.results[i].Zyymm = "";
                                        }
                                        vData.Data.push(data.PayslipNav.results[i]);
                                    }
                                }
                            }
                        },
                        function (oError) {
                            var Err = {};
                            oController.Error = "E";

                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if (msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    );

                    oController._ListJSonModel.setProperty("/Data", vData.Data);
                    var row = parseInt((window.innerHeight - 170) / 38);
					oTable.setVisibleRowCount(vData.Data.length < row ? vData.Data.length : row);
                    // Common.adjustAutoVisibleRowCount.call(oTable);
                    oTable.setFixedBottomRowCount(1);
                    
                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        MessageBox.error(oController.ErrorMessage);
                        return;
                    }
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            clickListCell: function (oEvent) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Payslip.List");
                var oController = oView.getController();
                var oTable = sap.ui.getCore().byId(oController.PAGEID + "_Table");
                var sPath = oEvent.getParameters().rowBindingContext.sPath;
                var oData = oTable.getModel().getProperty(sPath);
                var vData = {};
                var vConditionData = oController._ListCondJSonModel.getProperty("/Data");

                if (oData.Zyymm == "") return;

                Object.assign(vData, oData);
                vData.Pernr = vConditionData.Pernr;
                vData.Bukrs = vConditionData.Bukrs;
                vData.Langu = vConditionData.Langu;
                vData.Seqnr = vData.Seqnr;
                vData.Year = vData.Zyymm.substring(0, 4);
                vData.Month = "" + vData.Zyymm.substring(4, 6) * 1;
                oController._DetailJSonModel.setProperty("/Data", vData);

                if (!oController._DetailDialog) {
                    var vMonth = [];
                    for (var i = 1; i <= 12; i++) {
                        vMonth.push({ Code: "" + i, Text: "" + i });
                    }
                    oController._DetailJSonModel.setProperty("/Year", oController._ListCondJSonModel.getProperty("/Year"));
                    oController._DetailJSonModel.setProperty("/Month", vMonth);
                    oController._DetailDialog = sap.ui.jsfragment("ZUI5_HR_Payslip.fragment.DetailDialog", oController);
                    oView.addDependent(oController._DetailDialog);
                }

                var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_PDF");
                oLayout.destroyContent();

                // oController.getOcrsnList(oController, "X");
                oController.getOcrsnList( "X");
                oController._DetailDialog.open();
            },

            getOcrsnList: function (searchDetailYn) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Payslip.List");
                var oController = oView.getController();
                var oModel = $.app.getModel("ZHR_PAY_RESULT_SRV");

                var vCondiData = oController._DetailJSonModel.getProperty("/Data");
                var vData = { Data: [] };

                var oSeqnr = $.app.byId(oController.PAGEID+"_Seqnr");
                oSeqnr.setValue("");

                var search = function () {
                    var oPath = "";
                    var createData = { PayreasonNav: [] };

                    oPath = "/PayreasonPeSet";
                    createData.IPernr = vCondiData.Pernr && vCondiData.Pernr != "" ? vCondiData.Pernr : "";
                    createData.IYear = vCondiData.Year && vCondiData.Year != "" ? vCondiData.Year : "";
                    createData.IMonth = vCondiData.Month && vCondiData.Month != "" ? vCondiData.Month : "";
                    createData.ILangu = vCondiData.Langu && vCondiData.Langu != "" ? vCondiData.Langu : "";
                    createData.IBukrs = vCondiData.Bukrs && vCondiData.Bukrs != "" ? vCondiData.Bukrs : "";

                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data) {
                            if (data) {
                                if (data.PayreasonNav && data.PayreasonNav.results.length > 0) {
                                    for (var i = 0; i < data.PayreasonNav.results.length; i++) {
                                        vData.Data.push(data.PayreasonNav.results[i]);
                                    }
                                    oController._DetailJSonModel.setProperty("/Data/Seqnr", data.PayreasonNav.results[0].Seqnr);
                                }else{
                                    oController._DetailJSonModel.setProperty("/Data/Seqnr", ""); 
                                }
                            }else{
                                oController._DetailJSonModel.setProperty("/Data/Seqnr", "");
                            }
                        },
                        function (oError) {
                            var Err = {};
                            oController.Error = "E";
                            oController._DetailJSonModel.setProperty("/Data/Seqnr", "");
                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if (msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    );

                    oController._DetailJSonModel.setProperty("/Ocrsn", vData.Data);
                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    if (searchDetailYn == "X") {
                        oController.onPressSearchDetail();
                    }
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            onPressSearchDetail: function () {
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_PAY_RESULT_SRV");
                var vCondiData = oController._DetailJSonModel.getProperty("/Data");
                var vZpdf = "";

                var oLayout = sap.ui.getCore().byId(oController.PAGEID + "_PDF");
                oLayout.destroyContent();

                if (!vCondiData.Seqnr || vCondiData.Seqnr == "") {
                    // 조회조건을 모두 입력하시기 바랍니다.
                    MessageBox.error(oController.getBundleText("MSG_54001"));
                    return;
                }

                var search = function () {
                    var oPath = "";
                    var createData = { PayslipNav: [] };
                    var vWidth = document.getElementById(oController.PAGEID + "_Searchbar").offsetWidth + "px";
                    var vHeight = document.getElementById(oController.PAGEID + "_DetailDialog").offsetHeight * 1 - 225 + "px";
                    oPath = "/PayslipSet";
                    createData.IGubun = "2";
                    createData.IPernr = vCondiData.Pernr && vCondiData.Pernr != "" ? vCondiData.Pernr : "";
                    createData.IYear = vCondiData.Year && vCondiData.Year != "" ? vCondiData.Year : "";
                    createData.ILangu = vCondiData.Langu && vCondiData.Langu != "" ? vCondiData.Langu : "";
                    createData.IBukrs = vCondiData.Bukrs && vCondiData.Bukrs != "" ? vCondiData.Bukrs : "";
                    createData.ISeqnr = vCondiData.Seqnr && vCondiData.Seqnr != "" ? vCondiData.Seqnr : "";

                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data) {
                            if (data) {
                                if (data.PayslipNav && data.PayslipNav.results.length > 0) {
                                    vZpdf = data.PayslipNav.results[0].Zpdf;
                                    vZpdf = "data:application/pdf;base64," + vZpdf;
                                    oLayout.addContent(
                                        new sap.ui.core.HTML({
                                            content: ["<iframe id='iWorkerPDF' name='iWorkerPDF' src='" + vZpdf + "' width='" + vWidth + "' height='" + vHeight + "' frameborder='0' border='0' scrolling='no'></>"],
                                            preferDOM: false
                                        })
                                    );
                                    oLayout.addDelegate({
                                        onAfterRendering: function () {
                                            var vWidth = document.getElementById(oController.PAGEID + "_Searchbar").offsetWidth + "px";
                                            $("#iWorkerPDF").width(vWidth);
                                        }
                                    });
                                }
                            }
                        },
                        function (oError) {
                            var Err = {};
                            oController.Error = "E";

                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if (msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    );

                    oController._DetailJSonModel.setProperty("/Data/Zpdf", vZpdf);
                    // oController._BusyDialog.close();
                    oController._DetailDialog.setBusy(false);    
                    if (oController.Error == "E") {
                        oController.Error = "";
                        MessageBox.error(oController.ErrorMessage);
                        return;
                    }
                };

                // oController._BusyDialog.open();
                oController._DetailDialog.setBusyIndicatorDelay(0);
                oController._DetailDialog.setBusy(true);
                setTimeout(search, 100);
            },
            
            // searchOrgehPernr : function(oEvent){
            //     var oController=this;
            //     var oSessionData=oController._SessionData;
            //     var oId=oEvent.getSource().getId();
            //     $.app.byId(oId).setValue();
            //     $.app.byId(oId).removeAllCustomData();
            //     oController._vPernr=oSessionData.Pernr;
            //     $.app.byId(oId).addCustomData(new sap.ui.core.CustomData({key:"Pernr",value:oController._vPernr}));
            //     var initData = {
            //         Percod: $.app.getModel("session").getData().Percod,
            //         Bukrs: $.app.getModel("session").getData().Bukrs2,
            //         Langu: $.app.getModel("session").getData().Langu,
            //         Molga: $.app.getModel("session").getData().Molga,
            //         Datum: new Date(),
            //         Mssty: "",
            //         autoClose : false
            //     };
            //     var callback = function(o) {
            //         if(o.Otype == "O"){
            //             sap.m.MessageBox.error(oController.getBundleText("MSG_48016")); // 대상자를 선택하여 주십시오.
            //             return;
            //         }
            //         $.app.byId(oId).setValue(o.Stext);
            //         $.app.byId(oId).removeAllCustomData();
            //         $.app.byId(oId).addCustomData(new sap.ui.core.CustomData({value:o.Objid,key:"Pernr"}));
            //         oController._vPernr=o.Objid;
            //         oController.OrgOfIndividualHandler.getDialog().close();
            //     };
    
            //     this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);	
            //     DialogHandler.open(this.OrgOfIndividualHandler);
            // },

            /**
             * @brief [공통]부서/사원 조직도호출
             */
             onESSelectPerson : function(Data){
                var oController = $.app.getController();
                oController._ListCondJSonModel.setProperty("/Data/Pernr",Data.Pernr);
                oController._ListCondJSonModel.setProperty("/Data/Ename",Data.Ename);
                sap.ui.getCore().byId(common.SearchUser1.oController.PAGEID + "_ES_Dialog").close();
                this.OrgOfIndividualHandler.getDialog().close();
            },
    
            displayMultiOrgSearchDialog: function(oEvent) {
                return !$.app.getController().EmployeeSearchCallOwner 
                        ? $.app.getController().OrgOfIndividualHandler.openOrgSearchDialog(oEvent)
                        : $.app.getController().EmployeeSearchCallOwner.openOrgSearchDialog(oEvent);
            },
    
            getOrgOfIndividualHandler: function() {
                return this.OrgOfIndividualHandler;
            },

            searchOrgehPernr: function (oEvent) {
                var oController = $.app.getController();
                var initData = {
                        Percod: this.getSessionInfoByKey("Percod"),
                        Bukrs: this.getSessionInfoByKey("Bukrs2"),
                        Langu: this.getSessionInfoByKey("Langu"),
                        Molga: this.getSessionInfoByKey("Molga"),
                        Datum: new Date(),
                        Mssty: $.app.getAuth()
                    },
                    callback = function (o) {
                        if(o.Otype == "O"){
                            sap.m.MessageBox.error(oController.getBundleText("MSG_48016")); // 대상자를 선택하여 주십시오.
                            return;
                        }
                       
                        if (o.Otype === "P") {
                            oController._ListCondJSonModel.setProperty("/Data/Pernr",o.Objid);
                            oController._ListCondJSonModel.setProperty("/Data/Ename",o.Stext);
                            oController.OrgOfIndividualHandler.getDialog().close();
                        }
                    };

                this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
                DialogHandler.open(this.OrgOfIndividualHandler);
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      // return new JSONModel({name: "20021052"}); //
                      return new JSONModel({ name: "20170084" }); //
                      // return new JSONModel({name: "35432259"}); // 첨단
                      // return new JSONModel({name: "35432260"}); // 첨단
                      // return new JSONModel({name: "35432261"}); // 첨단
                      // return new JSONModel({name: "981014"}); // 기초
                      // return new JSONModel({name: "991002"}); // 기초
                      // return new JSONModel({name: "991004"}); // 기초
                      // return new JSONModel({name: "8900366"}); // 기초
                      // return new JSONModel({name: "8903376"}); // 기초
                      // return new JSONModel({name: "9000290"}); // 기초
                  }
                : null
        });
    }
);
