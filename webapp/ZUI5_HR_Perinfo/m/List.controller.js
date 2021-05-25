/* eslint-disable no-undef */
sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper"
    ],
    function (Common, CommonController, JSONModelHelper) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            PAGEID: "List",

            _vCurrentTabKey: "",
            _BusyDialog: new sap.m.BusyDialog(),
            _ListCondJSonModel: new sap.ui.model.json.JSONModel(),
            _LicenseJSonModel: new sap.ui.model.json.JSONModel(),
            _BasicJSonModel: new sap.ui.model.json.JSONModel(),
            _AddressJSonModel: new sap.ui.model.json.JSONModel(),
            _SchoolJSonModel: new sap.ui.model.json.JSONModel(),
            _CarJSonModel: new sap.ui.model.json.JSONModel(),
            _CareerJSonModel: new sap.ui.model.json.JSONModel(),
            _AnnouncementJSonModel: new sap.ui.model.json.JSONModel(),
            _EvalJSonModel: new sap.ui.model.json.JSONModel(),
            EmpSearchResult: new sap.ui.model.json.JSONModel(),
            EmployeeModel: new common.EmployeeModel(),
			doubleRendering : "",	
            onInit: function () {
                this.setupView().getView().addEventDelegate(
                    {
                        onBeforeShow: this.onBeforeShow,
                        onAfterShow: this.onAfterShow
                    },
                    this
                );

                Common.log("onInit session", this.getView().getModel("session").getData());
            },

            onBeforeShow: function (oEvent) {
                if (!this._ListCondJSonModel.getProperty("/Data") || this._ListCondJSonModel.getProperty("/Data") == "") {
                    var vData = {
                        Data: Object.assign({ Auth: gAuth }, this.getView().getModel("session").getData())
                    };
                     this._ListCondJSonModel.setData(vData);
                     this.getPhoto();
                }

                if (oEvent && oEvent.data && oEvent.data.Pernr) {
                   // Employee Div 정의
                    this._ListCondJSonModel.setProperty("/Data/Pernr", oEvent.data.Pernr);
                    this._ListCondJSonModel.setProperty("/Data/Ename", oEvent.data.Ename);
                    this._ListCondJSonModel.setProperty("/Data/Stext", oEvent.data.Fulln);
                    this._ListCondJSonModel.setProperty("/Data/PGradeTxt", oEvent.data.ZpGradetx); //직급
                    this._ListCondJSonModel.setProperty("/Data/ZtitleT", oEvent.data.Ztitletx); // 직위
                    this.getPhoto();
                    var oIconBar = sap.ui.getCore().byId(this.PAGEID + "_IconBar");
                    oIconBar.setSelectedKey("Basic");
                    oIconBar.fireSelect();
                }
            },

            onAfterShow: function () {
        
            },

            handleTabBarSelect: function (oEvent) {
                var oController = $.app.getController();
                var oData = oController._ListCondJSonModel.getProperty("/Data");
                var sKey = oEvent.getParameter("selectedKey");
                if (!sKey || sKey == "") {
                    sKey = "Basic";
                } else if (this._vCurrentTabKey === sKey) return;

                this._vCurrentTabKey = sKey;

                switch (this._vCurrentTabKey) {
                    case "Basic":
                        oController.onPressSearchBasic();
                        Common.usePrivateLog({
                        	pernr : oData.Pernr,
                        	func : "개인정보",
                        	mobile : "X",
                            action : "R" 
                        });
                        break;
                    case "Address":
                        oController.onPressSearchAddress();
                        Common.usePrivateLog({
                        	pernr : oData.Pernr,
                        	func : "주소",
                        	mobile : "X",
                            action : "R" 
                        });
                        break;
                    case "Car":
                        oController.onPressSearchCar();
                        break;
                    case "School":
                        oController.onPressSearchSchool();
                        break;
                    case "License":
                        oController.onPressSearchLicense();
                        break;
                    case "Career":
                        oController.onPressSearchCareer();
                        break;
                    case "Announcement":
                        oController.onPressSearchAnnouncement();
                        break;
                    case "Eval":
                        oController.onPressSearchEval();
                        break;
                }
            },

            onPressSearchBasic: function () {
                var oController = $.app.getController();
                var oData = oController._ListCondJSonModel.getProperty("/Data");
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: oController.oView.getModel("session").getData().Dtfmt });
                var vData = { Data: {} };
                var search = function () {
                    var oPath = "";
                    var createData = { PinfoBasicNav: [] };

                    // Address
                    oPath = "/PerinfoBasicSet";
                    createData.IPernr = oData.Pernr;
                    createData.IConType = "1";
                    createData.IDatum = "/Date(" + Common.getTime(new Date()) + ")/";

                    var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
                    
                    oModel.create(oPath, createData, {
                        success: function (data) {
                            if (data) {
                                if (data.PinfoBasicNav && data.PinfoBasicNav.results.length > 0) {
                                    vData.Data = data.PinfoBasicNav.results[0];
                                }
                            }
                        },
                        error: function (oError) {
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
                    });
                    
                    vData.Data.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
                    vData.Data.Zzbdate = vData.Data.Zzbdate ? dateFormat.format(new Date(Common.setTime(vData.Data.Zzbdate))) : null;
                    vData.Data.Dat01 = vData.Data.Dat01 ? dateFormat.format(new Date(Common.setTime(vData.Data.Dat01))) : null;
                    vData.Data.Dat02 = vData.Data.Dat02 ? dateFormat.format(new Date(Common.setTime(vData.Data.Dat02))) : null;
                    oController._BasicJSonModel.setProperty("/Data", vData.Data);
                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            onPressSearchAddress: function () {
                var oController = $.app.getController();
                var oData = oController._ListCondJSonModel.getProperty("/Data");
                var vData = { Data: [] };

                var search = function () {
                    var oPath = "";
                    var createData = { PinfoAddressNav: [] };

                    // Address
                    oPath = "/PerinfoAddressSet";
                    createData.IPernr = oData.Pernr;
                    createData.IConType = "1";
                    createData.IDatum = "/Date(" + Common.getTime(new Date()) + ")/";
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;

                    var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
                    
                    oModel.create(oPath, createData, {
                        success: function (data) {
                            if (data) {
                                if (data.PinfoAddressNav && data.PinfoAddressNav.results) {
                                    for (var i = 0; i < data.PinfoAddressNav.results.length; i++) {
                                        data.PinfoAddressNav.results[i].Idx = i + 1;
                                        vData.Data.push(data.PinfoAddressNav.results[i]);
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
                                if (msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    });

                    oController._AddressJSonModel.setData(vData);
                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            onPressSearchCar: function () {
                var oController = $.app.getController();
                var oData = oController._ListCondJSonModel.getProperty("/Data");
                var vData = { Data: [] };

                var search = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };

                    oPath = "/PerinfoCarmanagerSet";
                    createData.IPernr = oData.Pernr;
                    createData.IConType = "1";
                    createData.IDatum = "/Date(" + Common.getTime(new Date()) + ")/";
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;

                    var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");
                    
                    oModel.create(oPath, createData, {
                        success: function (data) {
                            if (data) {
                                if (data.TableIn && data.TableIn.results.length > 0) {
                                    vData.Data = data.TableIn.results[0];
                                }
                            }
                        },
                        error: function (oError) {
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
                    });
                    
                    vData.Data.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
                    oController._CarJSonModel.setProperty("/Data", vData.Data);
                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            onPressSearchLicense: function () {
                var oController = $.app.getController();
                var oData = oController._ListCondJSonModel.getProperty("/Data");
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: oController.oView.getModel("session").getData().Dtfmt });
                var vData = { Data: [] };

                var search = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };

                    oPath = "/PerRecordLicenseSet";
                    createData.IPernr = oData.Pernr;
                    createData.IConType = "1";
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
                    createData.ILangu = oController.getView().getModel("session").getData().Langu;

                    var oModel = $.app.getModel("ZHR_PERS_RECORD_SRV");

                    oModel.create(oPath, createData, {
                        success: function (data) {
                            if (data) {
                                if (data.TableIn && data.TableIn.results) {
                                    for (var i = 0; i < data.TableIn.results.length; i++) {
                                        data.TableIn.results[i].GetDate = data.TableIn.results[i].GetDate ? dateFormat.format(new Date(Common.setTime(data.TableIn.results[i].GetDate))) : null;
                                        vData.Data.push(data.TableIn.results[i]);
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
                                if (msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    });

                    oController._LicenseJSonModel.setData(vData);
                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            onPressSearchCareer: function () {
                var oController = $.app.getController();
                var oData = oController._ListCondJSonModel.getProperty("/Data");
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: oController.oView.getModel("session").getData().Dtfmt });
                var vData = { Data: [] };

                var search = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };

                    oPath = "/PerRecordCareerSet";
                    createData.IPernr = oData.Pernr;
                    createData.IConType = "1";
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
                    createData.ILangu = oController.getView().getModel("session").getData().Langu;

                    var oModel = $.app.getModel("ZHR_PERS_RECORD_SRV");
                    
                    oModel.create(oPath, createData, {
                        success: function (data) {
                            if (data) {
                                if (data.TableIn && data.TableIn.results) {
                                    for (var i = 0; i < data.TableIn.results.length; i++) {
                                        data.TableIn.results[i].Begda = data.TableIn.results[i].Begda ? dateFormat.format(new Date(Common.setTime(data.TableIn.results[i].Begda))) : null;
                                        data.TableIn.results[i].Endda = data.TableIn.results[i].Endda ? dateFormat.format(new Date(Common.setTime(data.TableIn.results[i].Endda))) : null;
                                        data.TableIn.results[i].Period = data.TableIn.results[i].Begda + " ~ " + data.TableIn.results[i].Endda;
                                        vData.Data.push(data.TableIn.results[i]);
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
                                if (msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    });

                    oController._CareerJSonModel.setData(vData);
                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            onPressSearchAnnouncement: function () {
                var oController = $.app.getController();
                var oData = oController._ListCondJSonModel.getProperty("/Data");
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: oController.oView.getModel("session").getData().Dtfmt });
                var vData = { Data: [] };

                var search = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };

                    oPath = "/PerRecordAnnouncementSet";
                    createData.IPernr = oData.Pernr;
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
                    createData.ILangu = oController.getView().getModel("session").getData().Langu;

                    var oModel = $.app.getModel("ZHR_PERS_RECORD_SRV");
                   
                    oModel.create(oPath, createData, {
                        success: function (data) {
                            if (data) {
                                if (data.TableIn && data.TableIn.results) {
                                    for (var i = 0; i < data.TableIn.results.length; i++) {
                                        data.TableIn.results[i].Begda = data.TableIn.results[i].Begda ? dateFormat.format(new Date(Common.setTime(data.TableIn.results[i].Begda))) : null;
                                        vData.Data.push(data.TableIn.results[i]);
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
                                if (msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    });

                    oController._AnnouncementJSonModel.setData(vData);
                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            //학력사항
            onPressSearchSchool: function () {
                var oController = $.app.getController();
                var oData = oController._ListCondJSonModel.getProperty("/Data");
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: oController.oView.getModel("session").getData().Dtfmt });
                var vData = { Data: [] };

                var search = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };

                    oPath = "/PerRecordScholarshipSet";
                    createData.IPernr = oData.Pernr;
                    createData.IConType = "1";
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
                    createData.ILangu = oController.getView().getModel("session").getData().Langu;

                    var oModel = $.app.getModel("ZHR_PERS_RECORD_SRV");

                    oModel.create(oPath, createData, {
                        success: function (data) {
                            if (data) {
                                if (data.TableIn && data.TableIn.results) {
                                    for (var i = 0; i < data.TableIn.results.length; i++) {
                                        data.TableIn.results[i].Begda = data.TableIn.results[i].Begda ? dateFormat.format(new Date(Common.setTime(data.TableIn.results[i].Begda))) : null;
                                        data.TableIn.results[i].Endda = data.TableIn.results[i].Endda ? dateFormat.format(new Date(Common.setTime(data.TableIn.results[i].Endda))) : null;
                                        data.TableIn.results[i].Period = data.TableIn.results[i].Begda + " ~ " + data.TableIn.results[i].Endda;
                                        data.TableIn.results[i].Zzlmark = data.TableIn.results[i].Zzlmark == "X" ? true : false;
                                        vData.Data.push(data.TableIn.results[i]);
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
                                if (msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    });

                    oController._SchoolJSonModel.setData(vData);
                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            //평가이력
            onPressSearchEval: function () {
                var oController = $.app.getController();
                var oData = oController._ListCondJSonModel.getProperty("/Data");
                var vData = { Data: [] };
                var oDate = new Date();
                var vYear =  oDate.getFullYear();

                var search = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };

                    oPath = "/EvalResultsSet";
                    createData.IEmpid = oData.Pernr;
                    createData.IConType = "3";
                    createData.IAppye = "" + vYear;
                    createData.TableIn = [];

                    var oModel = $.app.getModel("ZHR_APPRAISAL_SRV");

                    oModel.create(oPath, createData, {
                        success: function (data) {
                            if (data) {
                                if (data.TableIn && data.TableIn.results) {
                                    for (var i = 0; i < data.TableIn.results.length; i++) {
                                        data.TableIn.results[i].Idx = i + 1;
                                        vData.Data.push(data.TableIn.results[i]);
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
                                if (msg1 && msg1.length) oController.ErrorMessage = Err.error.innererror.errordetails[0].message;
                                else oController.ErrorMessage = Err.error.message.value;
                            } else {
                                oController.ErrorMessage = oError.toString();
                            }
                        }
                    });

                    oController._EvalJSonModel.setData(vData);
                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            moveSearch: function () {
                var oController = $.app.getController();
                var vData = Object.assign(oController.getView().getModel("session").getData());
                sap.ui
                    .getCore()
                    .getEventBus()
                    .publish("nav", "to", {
                        id: "ZUI5_HR_Perinfo.m.FacilityDetail",
                        data: {
                            FromPageId: "ZUI5_HR_Perinfo.m.List",
                            Session: vData
                        }
                    });
            },
            getPhoto : function() {
            	var oController = $.app.getController();
            	var vPernr = parseInt(oController._ListCondJSonModel.getProperty("/Data/Pernr"));
            	var oPhoto = ""; 
            	
        		$.ajax({
					url:"/odata/fix/Photo?$filter=userId%20eq%20%27"+vPernr+"%27%20and%20photoType%20eq%20%2701%27&customPageSize="+1000,
					method:"get",
					dataType: "json",
					async:true
				}).done(function(data){
					if(data&&data.d.results.length){
						if (data && data.d.results.length) {
                            oPhoto = "data:text/plain;base64," + data.d.results[0].photo;
                        }else{
                            oPhoto = "images/male.jpg";
                        }
                    }else{
                        oPhoto = "images/male.jpg";
                    }

                    oController._ListCondJSonModel.setData({ Data: { photo: oPhoto } }, true);

				}).fail(function(res) {
					common.Common.log(res);
				});
		    },
            
            makeHtml: function () {
                var oController = $.app.getController();
                var oHtml = "";
                var oData = oController._ListCondJSonModel.getProperty("/Data");
                $.ajax({
                    url: "ZUI5_HR_Perinfo/m/fragment/EmployeeDiv.html",
                    cache: false,
                    async: false
                }).done(function (html) {
                    oHtml = html;
                }).fail(function (res) {
                    Common.log(res);
                });

                if (oHtml == "") {
                    sap.m.MessageBox.error(oController.getBundleText("MSG_27006")); // 오류가 발생하였습니다.
                    return "";
                }
                
                // 인적사항
                var textReplace = [
                    { label: "[PHOTO]", data: oData.photo },
                    { label: "[ENAME]", data: oData.Ename },
                    { label: "[STEXT]", data: oData.Ename },
                    { label: "[PERNR]", data: oData.Pernr }
                ];

                for (var i = 0; i < textReplace.length; i++) {
                    oHtml = oHtml.replace(textReplace[i].label, textReplace[i].data);
                }
				
				oController._ListCondJSonModel.setData({ Data: { html: oHtml } }, true);  
		        return oHtml;
            },
       

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "35110041" });
                  }
                : null
        });
    }
);
