/* eslint-disable no-undef */
jQuery.sap.require("sap.m.MessageBox");

sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "common/EmployeeModel",
        "common/PageHelper",
        "common/OrgOfIndividualHandler",
        "common/AttachFileAction"
    ],
    function (Common, CommonController, JSONModelHelper, EmployeeModel, PageHelper, OrgOfIndividualHandler, AttachFileAction) {
        "use strict";

        return CommonController.extend("ZUI5_HR_Perinfo.List", {
            PAGEID: "Perinfo",
            _BusyDialog: new sap.m.BusyDialog(),
            oModel: new sap.ui.model.json.JSONModel(),
            Model: function () {
                return this.oModel;
            },
            _ListCondJSonModel: new sap.ui.model.json.JSONModel(),
            _HeaderJSonModel: new sap.ui.model.json.JSONModel(),
            _BasicJSonModel: new sap.ui.model.json.JSONModel(),
            _AddressJSonModel: new sap.ui.model.json.JSONModel(),
            _CarJSonModel: new sap.ui.model.json.JSONModel(),
            _PassportJSonModel: new sap.ui.model.json.JSONModel(),
            _SchoolJSonModel: new sap.ui.model.json.JSONModel(), // 학력사항 Popup Dialog
            _MilitaryJSonModel: new sap.ui.model.json.JSONModel(),
            _LicenseJSonModel: new sap.ui.model.json.JSONModel(), // 자격면허 Popup Dialog
            _CareerJSonModel: new sap.ui.model.json.JSONModel(), // 경력사항 Popup Dialog
            _AwardJSonModel: new sap.ui.model.json.JSONModel(), // 경력사항 Popup Dialog
            _HandicapJSonModel: new sap.ui.model.json.JSONModel(),
            EmpSearchResult: new sap.ui.model.json.JSONModel(),
            _Bukrs: "",
            EmployeeModel: new common.EmployeeModel(),

            onInit: function () {
                this.setupView().getView().addEventDelegate(
                    {
                        onBeforeShow: this.onBeforeShow
                    },
                    this
                );

                this.getView().addEventDelegate(
                    {
                        onAfterShow: this.onAfterShow
                    },
                    this
                );

                this.getView().addStyleClass("sapUiSizeCompact");
            },

            onBeforeShow: function (oEvent) {
                var oController = this;
                oController._SchoolJSonModel.setSizeLimit(5000);

                if (!oController._ListCondJSonModel.getProperty("/Data")) {
                    var vData = {
                        Data: Object.assign({ Auth: gAuth }, oController.getView().getModel("session").getData())
                    };

                    oController._ListCondJSonModel.setData(vData);

                    // Login Data 조회
                    // oController.EmployeeModel.retrieve(oController.getView().getModel("session").getData().Pernr);

                    Promise.all([
                        // }.bind(this)),
                        common.Common.getPromise(
                            function () {
                                $.app.getModel("ZHR_COMMON_SRV").create(
                                    "/CommonCodeListHeaderSet", //결혼여부
                                    {
                                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                        IMolga: oController.getView().getModel("session").getData().Molga,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        ICodeT: "007",
                                        NavCommonCodeList: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = [];
                                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                Object.assign(vData, data.NavCommonCodeList.results);
                                            }
                                            oController._BasicJSonModel.setProperty("/Famst", vData);
                                        },
                                        error: function (oResponse) {
                                            common.Common.log(oResponse);
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        common.Common.getPromise(
                            function () {
                                $.app.getModel("ZHR_COMMON_SRV").create(
                                    "/CommonCodeListHeaderSet", //FUEL
                                    {
                                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                        IMolga: oController.getView().getModel("session").getData().Molga,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        ICodeT: "004",
                                        ICodty: "ZZFUEL",
                                        NavCommonCodeList: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = [];
                                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                Object.assign(vData, data.NavCommonCodeList.results);
                                            }
                                            oController._CarJSonModel.setProperty("/Fuel", vData);
                                        },
                                        error: function (oResponse) {
                                            common.Common.log(oResponse);
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        common.Common.getPromise(
                            function () {
                                $.app.getModel("ZHR_COMMON_SRV").create(
                                    "/CommonCodeListHeaderSet",
                                    {
                                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                        IMolga: oController.getView().getModel("session").getData().Molga,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        ICodeT: "999",
                                        ICodty: "17",
                                        NavCommonCodeList: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = [];
                                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                Object.assign(vData, data.NavCommonCodeList.results);
                                            }
                                            oController._MilitaryJSonModel.setProperty("/Mrank", vData);
                                        },
                                        error: function (oResponse) {
                                            common.Common.log(oResponse);
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        common.Common.getPromise(
                            function () {
                                $.app.getModel("ZHR_COMMON_SRV").create(
                                    "/CommonCodeListHeaderSet",
                                    //oFilters2,
                                    {
                                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                        IMolga: oController.getView().getModel("session").getData().Molga,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        ICodeT: "999",
                                        ICodty: "18",
                                        NavCommonCodeList: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = [];
                                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                Object.assign(vData, data.NavCommonCodeList.results);
                                            }
                                            oController._MilitaryJSonModel.setProperty("/Serty", vData);
                                        },
                                        error: function (oResponse) {
                                            common.Common.log(oResponse);
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        common.Common.getPromise(
                            function () {
                                $.app.getModel("ZHR_COMMON_SRV").create(
                                    "/CommonCodeListHeaderSet",
                                    //oFilters2,
                                    {
                                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                        IMolga: oController.getView().getModel("session").getData().Molga,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        ICodeT: "999",
                                        ICodty: "19",
                                        NavCommonCodeList: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = [];
                                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                Object.assign(vData, data.NavCommonCodeList.results);
                                            }
                                            oController._MilitaryJSonModel.setProperty("/Jobcl", vData);
                                        },
                                        error: function (oResponse) {
                                            common.Common.log(oResponse);
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        common.Common.getPromise(
                            function () {
                                $.app.getModel("ZHR_COMMON_SRV").create(
                                    "/CommonCodeListHeaderSet",
                                    //oFilters2,
                                    {
                                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                        IMolga: oController.getView().getModel("session").getData().Molga,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        ICodeT: "999",
                                        ICodty: "20",
                                        NavCommonCodeList: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = [];
                                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                Object.assign(vData, data.NavCommonCodeList.results);
                                            }
                                            oController._MilitaryJSonModel.setProperty("/Zzarmy", vData);
                                        },
                                        error: function (oResponse) {
                                            common.Common.log(oResponse);
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        common.Common.getPromise(
                            function () {
                                $.app.getModel("ZHR_COMMON_SRV").create(
                                    "/CommonCodeListHeaderSet",
                                    {
                                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                        IMolga: oController.getView().getModel("session").getData().Molga,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        ICodeT: "999",
                                        ICodty: "21",
                                        NavCommonCodeList: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = [];
                                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                Object.assign(vData, data.NavCommonCodeList.results);
                                            }
                                            oController._MilitaryJSonModel.setProperty("/Preas", vData);
                                        },
                                        error: function (oResponse) {
                                            common.Common.log(oResponse);
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        common.Common.getPromise(
                            function () {
                                $.app.getModel("ZHR_COMMON_SRV").create(
                                    "/CommonCodeListHeaderSet",
                                    //oFilters2,
                                    {
                                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                        IMolga: oController.getView().getModel("session").getData().Molga,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        ICodeT: "999",
                                        ICodty: "22",
                                        NavCommonCodeList: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = [];
                                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                Object.assign(vData, data.NavCommonCodeList.results);
                                            }
                                            oController._MilitaryJSonModel.setProperty("/Zznarmy", vData);
                                        },
                                        error: function (oResponse) {
                                            common.Common.log(oResponse);
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        common.Common.getPromise(
                            function () {
                                $.app.getModel("ZHR_COMMON_SRV").create(
                                    "/CommonCodeListHeaderSet",
                                    {
                                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                        IMolga: oController.getView().getModel("session").getData().Molga,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        ICodeT: "999",
                                        ICodty: "11",
                                        NavCommonCodeList: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = [];
                                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                Object.assign(vData, data.NavCommonCodeList.results);
                                            }
                                            oController._HandicapJSonModel.setProperty("/Recmd", vData);
                                        },
                                        error: function (oResponse) {
                                            common.Common.log(oResponse);
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        common.Common.getPromise(
                            function () {
                                $.app.getModel("ZHR_COMMON_SRV").create(
                                    "/CommonCodeListHeaderSet",
                                    {
                                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                        IMolga: oController.getView().getModel("session").getData().Molga,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        ICodeT: "999",
                                        ICodty: "12",
                                        NavCommonCodeList: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                var vData = [];
                                                if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                    Object.assign(vData, data.NavCommonCodeList.results);
                                                }
                                                oController._HandicapJSonModel.setProperty("/Conty", vData);
                                            }
                                        },
                                        error: function (oResponse) {
                                            common.Common.log(oResponse);
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        common.Common.getPromise(
                            function () {
                                $.app.getModel("ZHR_COMMON_SRV").create(
                                    "/CommonCodeListHeaderSet",
                                    {
                                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                        IMolga: oController.getView().getModel("session").getData().Molga,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        ICodeT: "999",
                                        ICodty: "13",
                                        NavCommonCodeList: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                var vData = [];
                                                if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                    Object.assign(vData, data.NavCommonCodeList.results);
                                                }
                                                oController._HandicapJSonModel.setProperty("/Relat", vData);
                                            }
                                        },
                                        error: function (oResponse) {
                                            common.Common.log(oResponse);
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        common.Common.getPromise(
                            function () {
                                $.app.getModel("ZHR_COMMON_SRV").create(
                                    "/CommonCodeListHeaderSet",
                                    {
                                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                        IMolga: oController.getView().getModel("session").getData().Molga,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        ICodeT: "999",
                                        ICodty: "14",
                                        NavCommonCodeList: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = [];
                                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                Object.assign(vData, data.NavCommonCodeList.results);
                                            }
                                            oController._HandicapJSonModel.setProperty("/Zzorg", vData);
                                        },
                                        error: function (oResponse) {
                                            common.Common.log(oResponse);
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        common.Common.getPromise(
                            function () {
                                $.app.getModel("ZHR_COMMON_SRV").create(
                                    "/CommonCodeListHeaderSet",
                                    {
                                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                        IMolga: oController.getView().getModel("session").getData().Molga,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        ICodeT: "999",
                                        ICodty: "15",
                                        NavCommonCodeList: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = [];
                                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                Object.assign(vData, data.NavCommonCodeList.results);
                                            }
                                            oController._HandicapJSonModel.setProperty("/Chaty", vData);
                                        },
                                        error: function (oResponse) {
                                            common.Common.log(oResponse);
                                        }
                                    }
                                );
                            }.bind(this)
                        )
                        // common.Common.getPromise(function() {
                        // 	$.app.getModel("ZHR_COMMON_SRV").create("/CommonCodeListHeaderSet",
                        //   	{
                        // 		IBukrs:  oController.getView().getModel("session").getData().Bukrs2,
                        // 		IMolga:  oController.getView().getModel("session").getData().Molga,
                        // 		ILangu:  oController.getView().getModel("session").getData().Langu,
                        // 		ICodeT : "999",
                        // 		ICodty : "16",
                        // 		NavCommonCodeList : []
                        // 	 },
                        // 	{
                        //                 async: true,
                        //                 success: function (data) {
                        //             	  	var vData = [];
                        //             	    if(data.NavCommonCodeList && data.NavCommonCodeList.results){
                        // 				Object.assign(vData, data.NavCommonCodeList.results);
                        // 			}
                        // 			oController._HandicapJSonModel.setProperty("/Hndcd",vData);
                        // 		},
                        //                 error: function (oResponse) {
                        //                     common.Common.log(oResponse);
                        //                 }
                        //             })
                        // }.bind(this)),
                    ]);
                }
            },

            /**
             * @brief [공통]부서/사원 조직도호출
             */
            searchOrgehPernr: function (oController) {
                //var oModel = this.Model(),
                var initData = {
                        Percod: this.getSessionInfoByKey("Percod"),
                        Bukrs: this.getSessionInfoByKey("Bukrs2"),
                        Langu: this.getSessionInfoByKey("Langu"),
                        Molga: this.getSessionInfoByKey("Molga"),
                        Datum: new Date(),
                        Mssty: ""
                    },
                    callback = function (o) {
                        // oModel.setProperty("/SearchConditions/Pernr", o.Otype === "P" ? o.Objid : "");
                        // oModel.setProperty("/SearchConditions/Orgeh", o.Otype === "O" ? o.Objid : "");
                        // oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", o.Stext || "");
                        //전체 조회 OData 호출
                        if (o.Otype === "P") {
                            oController.onPressSearchAll(o.Objid, oController.getView().getModel("session").getData().Bukrs2);
                        }
                    };

                this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
            },

            onAfterShow: function (oEvent) {
                var oController = this;
                if (gAuth == "M") {
                    var OrgOfIndividualHandler = oController.getOrgOfIndividualHandler();
                    OrgOfIndividualHandler.autoClose = false;
                    OrgOfIndividualHandler.onBeforeOpen();
                }
                oController.onPressSearchAll(oController.getView().getModel("session").getData().Pernr, oController.getView().getModel("session").getData().Bukrs2);
            },

            getOrgOfIndividualHandler: function () {
                return this.OrgOfIndividualHandler;
            },

            onPressSearchAll: function (vPernr, vBurks) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List");
                var oController = oView.getController();
                var vConType = "1",
                    vDatum = "/Date(" + common.Common.getTime(new Date()) + ")/",
                    vBurks = oController.getView().getModel("session").getData().Bukrs2,
                    oPhoto;
                var vPercod = common.Common.encryptPernr(vPernr);
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: oView.getModel("session").getData().Dtfmt });
                var oFilters = [
                    new sap.ui.model.Filter("Percod", sap.ui.model.FilterOperator.EQ, oController.getSessionInfoByKey("Percod")),
                    new sap.ui.model.Filter("Bukrs", sap.ui.model.FilterOperator.EQ, vBurks),
                    new sap.ui.model.Filter("Actty", sap.ui.model.FilterOperator.EQ, $.app.APP_ID == "ZUI5_HR_HRDoc.Page" ? "A" : common.SearchUser1.searchAuth ? common.SearchUser1.searchAuth : $.app.getAuth()),
                    new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, new Date(new Date().setHours(9))),
                    new sap.ui.model.Filter("Ename", sap.ui.model.FilterOperator.EQ, vPernr)
                ];
                var oAddressTable = sap.ui.getCore().byId(oController.PAGEID + "_AddressTable"),
                    oAddressJSONModel = oAddressTable.getModel(),
                    oPassportTable = sap.ui.getCore().byId(oController.PAGEID + "_PassportTable"),
                    oPassportJSONModel = oPassportTable.getModel(),
                    oSchoolTable = sap.ui.getCore().byId(oController.PAGEID + "_SchoolTable"),
                    oSchoolJSONModel = oSchoolTable.getModel(),
                    oLicenseTable = sap.ui.getCore().byId(oController.PAGEID + "_LicenseTable"),
                    oLicenseJSONModel = oLicenseTable.getModel(),
                    oCareerTable = sap.ui.getCore().byId(oController.PAGEID + "_CareerTable"),
                    oCareerJSONModel = oCareerTable.getModel(),
                    oAwardTable = sap.ui.getCore().byId(oController.PAGEID + "_AwardTable"),
                    oAwardJSONModel = oAwardTable.getModel(),
                    oPunishTable = sap.ui.getCore().byId(oController.PAGEID + "_PunishTable"),
                    oPunishJSONModel = oPunishTable.getModel(),
                    oAnnouncementTable = sap.ui.getCore().byId(oController.PAGEID + "_AnnouncementTable"),
                    oAnnouncementJSONModel = oAnnouncementTable.getModel(),
                    oFamilyTable = sap.ui.getCore().byId(oController.PAGEID + "_FamilyTable"),
                    oFamilyTableJSONModel = oFamilyTable.getModel();

                var search = function () {
                    Promise.all([
                        Common.getPromise(
                            true,
                            function (resolve) {
                                new JSONModelHelper()
                                    .url("/odata/v2/Photo?$filter=userId eq '" + vPernr + "' and photoType eq '1'")
                                    .select("photo")
                                    .setAsync(true)
                                    .attachRequestCompleted(function () {
                                        var data = this.getData().d;

                                        if (data && data.results.length) {
                                            oPhoto = "data:text/plain;base64," + data.results[0].photo;
                                        } else {
                                            oPhoto = "images/male.jpg";
                                        }

                                        oController._HeaderJSonModel.setData({ User: { photo: oPhoto } }, true);
                                        resolve();
                                    })
                                    .attachRequestFailed(function () {
                                        oPhoto = "images/male.jpg";
                                        oController._HeaderJSonModel.setData({ User: { photo: oPhoto } }, true);
                                        resolve();
                                    })
                                    .load();
                            }.bind(this)
                        ),
                        Common.getPromise(
                            true,
                            function (resolve) {
                                $.app.getModel("ZHR_COMMON_SRV").read("/EmpSearchResultSet", {
                                    async: true,
                                    filters: oFilters,
                                    success: function (data) {
                                        var vData = { User: {} };
                                        if (data && data.results.length > 0) {
                                            data.results[0].nickname = data.results[0].Ename;
                                            data.results[0].Stext = data.results[0].Gbdat;
                                            data.results[0].PGradeTxt = data.results[0].ZpGradetx;
                                            data.results[0].ZtitleT = data.results[0].Ztitletx;

                                            vData.User = data.results[0];
                                        }
                                        vData.User.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
                                        oController._HeaderJSonModel.setData(vData, true);
                                        resolve();
                                    },
                                    error: function (oError) {
                                        var vData = { User: {} };
                                        vData.User.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
                                        oController._HeaderJSonModel.setData(vData, true);
                                        common.Common.displaylog(oError);
                                        resolve();
                                    }
                                });
                            }.bind(this)
                        ),
                        Common.getPromise(
                            true,
                            function (resolve) {
                                $.app.getModel("ZHR_PERS_INFO_SRV").create(
                                    // 기본인적
                                    "/PerinfoBasicSet",
                                    {
                                        IPernr: vPernr,
                                        IConType: vConType,
                                        // ILangu: Langu,
                                        PinfoBasicNav: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = { Data: {} };
                                            if (data) {
                                                if (data.PinfoBasicNav && data.PinfoBasicNav.results.length > 0) {
                                                    vData.Data = data.PinfoBasicNav.results[0];
                                                    vData.Data.disyn = "2";
                                                    vData.Data.Zzbdate = vData.Data.Zzbdate ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Zzbdate))) : null;
                                                    vData.Data.Famdt = vData.Data.Famdt ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Famdt))) : null;
                                                    vData.Data.Dat01 = vData.Data.Dat01 ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Dat01))) : null;
                                                    vData.Data.Dat02 = vData.Data.Dat02 ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Dat02))) : null;
                                                    vData.Data.Zzclass = vData.Data.Zzclass ? Number(vData.Data.Zzclass) - 1 : null;
                                                }
                                            }
                                            vData.Data.disyn = "2";
                                            vData.Data.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
                                            oController._ListCondJSonModel.setProperty("/Data/Openf", vData.Data.Openf);
                                            oController._BasicJSonModel.setProperty("/Data", vData.Data);
                                            resolve();
                                        }.bind(this),
                                        error: function (oError) {
                                            var vData = { Data: {} };
                                            vData.User.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
                                            vData.Data.disyn = "2";
                                            oController._ListCondJSonModel.setProperty("/Data/Openf", "");
                                            oController._BasicJSonModel.setProperty("/Data", vData.Data);
                                            common.Common.displaylog(oError);
                                            resolve();
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        Common.getPromise(
                            true,
                            function (resolve) {
                                $.app.getModel("ZHR_PERS_INFO_SRV").create(
                                    // Address
                                    "/PerinfoAddressSet",
                                    {
                                        IPernr: vPernr,
                                        IConType: vConType,
                                        IBukrs: vBurks,
                                        // ILangu: Langu,
                                        PinfoAddressNav: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = { Data: [] };
                                            if (data) {
                                                if (data.PinfoAddressNav && data.PinfoAddressNav.results) {
                                                    for (var i = 0; i < data.PinfoAddressNav.results.length; i++) {
                                                        data.PinfoAddressNav.results[i].Idx = i + 1;
                                                        vData.Data.push(data.PinfoAddressNav.results[i]);
                                                    }
                                                }
                                            }
                                            oAddressJSONModel.setData(vData);
                                            oAddressTable.bindRows("/Data");
                                            oAddressTable.setVisibleRowCount(vData.Data.length);
                                            resolve();
                                        }.bind(this),
                                        error: function (oError) {
                                            var vData = { Data: [] };
                                            oAddressJSONModel.setData(vData);
                                            oAddressTable.bindRows("/Data");
                                            oAddressTable.setVisibleRowCount(vData.Data.length);
                                            resolve();
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        Common.getPromise(
                            true,
                            function (resolve) {
                                $.app.getModel("ZHR_PERS_INFO_SRV").create(
                                    // 차량관리
                                    "/PerinfoCarmanagerSet",
                                    {
                                        IPernr: vPernr,
                                        IConType: vConType,
                                        IBukrs: vBurks,
                                        // ILangu: Langu,
                                        TableIn: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = { Data: {} };
                                            if (data) {
                                                if (data.TableIn && data.TableIn.results.length > 0) {
                                                    vData.Data = data.TableIn.results[0];
                                                }
                                            }
                                            if (vData.Data.Cartype == undefined) vData.Data.actMode = "3";
                                            //신규
                                            else vData.Data.actMode = "2"; //수정

                                            vData.Data.disyn = "2";
                                            vData.Data.Odsupport = vData.Data.Odsupport == "X" ? true : null;
                                            vData.Data.Parkticket = vData.Data.Parkticket == "X" ? true : null;
                                            vData.Data.Hybrid = vData.Data.Hybrid == "X" ? true : null;
                                            vData.Data.Hybrid2 = vData.Data.Hybrid2 == "X" ? true : null;
                                            vData.Data.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
                                            oController._CarJSonModel.setProperty("/Data", vData.Data);
                                            resolve();
                                        }.bind(this),
                                        error: function (oError) {
                                            var vData = { Data: {} };
                                            vData.User.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
                                            vData.Data.disyn = "2";
                                            oController._CarJSonModel.setProperty("/Data", vData.Data);
                                            resolve();
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        Common.getPromise(
                            true,
                            function (resolve) {
                                $.app.getModel("ZHR_PERS_INFO_SRV").create(
                                    // 여권/비자관리
                                    "/PerinfoPassportSet",
                                    {
                                        IPernr: vPernr,
                                        IConType: vConType,
                                        IBukrs: vBurks,
                                        // ILangu: Langu,
                                        TableIn: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = { Data: [] };
                                            if (data) {
                                                if (data.TableIn && data.TableIn.results) {
                                                    for (var i = 0; i < data.TableIn.results.length; i++) {
                                                        data.TableIn.results[i].Idx = i + 1;
                                                        vData.Data.push(data.TableIn.results[i]);
                                                    }
                                                }
                                            }
                                            oPassportJSONModel.setData(vData);
                                            oPassportTable.bindRows("/Data");
                                            oPassportTable.setVisibleRowCount(vData.Data.length);
                                            resolve();
                                        }.bind(this),
                                        error: function (oError) {
                                            var vData = { Data: [] };
                                            oPassportJSONModel.setData(vData);
                                            oPassportTable.bindRows("/Data");
                                            oPassportTable.setVisibleRowCount(vData.Data.length);
                                            // common.Common.displaylog(oError);
                                            resolve();
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        Common.getPromise(
                            true,
                            function (resolve) {
                                $.app.getModel("ZHR_PERS_RECORD_SRV").create(
                                    // 학력사항
                                    "/PerRecordScholarshipSet",
                                    {
                                        IPernr: vPernr,
                                        IConType: vConType,
                                        IBukrs: vBurks,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        TableIn: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = { Data: [] };
                                            if (data) {
                                                if (data.TableIn && data.TableIn.results) {
                                                    for (var i = 0; i < data.TableIn.results.length; i++) {
                                                        data.TableIn.results[i].Idx = i + 1;
                                                        data.TableIn.results[i].Begda = data.TableIn.results[i].Begda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Begda))) : null;
                                                        data.TableIn.results[i].Endda = data.TableIn.results[i].Endda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Endda))) : null;
                                                        data.TableIn.results[i].Period = data.TableIn.results[i].Begda + " ~ " + data.TableIn.results[i].Endda;
                                                        data.TableIn.results[i].Zzlmark = data.TableIn.results[i].Zzlmark == "X" ? true : false;
                                                        vData.Data.push(data.TableIn.results[i]);
                                                    }
                                                }
                                            }
                                            oSchoolJSONModel.setData(vData);
                                            oSchoolTable.bindRows("/Data");
                                            oSchoolTable.setVisibleRowCount(vData.Data.length);
                                            resolve();
                                        }.bind(this),
                                        error: function (oError) {
                                            var vData = { Data: [] };
                                            oSchoolJSONModel.setData(vData);
                                            oSchoolTable.bindRows("/Data");
                                            oSchoolTable.setVisibleRowCount(vData.Data.length);
                                            resolve();
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        Common.getPromise(
                            true,
                            function (resolve) {
                                $.app.getModel("ZHR_PERS_RECORD_SRV").create(
                                    // 병역사항
                                    "/PerRecordMilitarySet",
                                    {
                                        IPernr: vPernr,
                                        IConType: vConType,
                                        IBukrs: vBurks,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        TableIn: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = { Data: {} };
                                            if (data) {
                                                if (data.TableIn && data.TableIn.results.length > 0) {
                                                    vData.Data = data.TableIn.results[0];
                                                    vData.Data.Begda = vData.Data.Begda ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Begda))) : null;
                                                    vData.Data.Endda = vData.Data.Begda ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Endda))) : null;
                                                }
                                            }
                                            vData.Data.disyn = "2";
                                            vData.Data.Zrotc = vData.Data.Zrotc == "X" ? true : null;
                                            vData.Data.actMode = vData.Data.Begda == undefined ? (vData.Data.actMode = "3") : (vData.Data.actMode = "2"); // 신규 / 수정
                                            vData.Data.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
                                            oController._MilitaryJSonModel.setProperty("/Data", vData.Data);
                                            resolve();
                                        }.bind(this),
                                        error: function (oError) {
                                            var vData = { Data: {} };
                                            vData.User.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
                                            vData.Data.Zrotc = null;
                                            vData.Data.disyn = "2";
                                            oController._MilitaryJSonModel.setProperty("/Data", vData.Data);
                                            resolve();
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        Common.getPromise(
                            true,
                            function (resolve) {
                                $.app.getModel("ZHR_PERS_RECORD_SRV").create(
                                    // 자격면허
                                    "/PerRecordLicenseSet",
                                    {
                                        IPernr: vPernr,
                                        IConType: vConType,
                                        IBukrs: vBurks,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        TableIn: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = { Data: [] };
                                            if (data) {
                                                if (data.TableIn && data.TableIn.results) {
                                                    for (var i = 0; i < data.TableIn.results.length; i++) {
                                                        data.TableIn.results[i].Idx = i + 1;
                                                        data.TableIn.results[i].Begda = data.TableIn.results[i].Begda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Begda))) : null;
                                                        data.TableIn.results[i].GetDate = data.TableIn.results[i].GetDate ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].GetDate))) : null;
                                                        vData.Data.push(data.TableIn.results[i]);
                                                    }
                                                }
                                            }
                                            oLicenseJSONModel.setData(vData);
                                            oLicenseTable.bindRows("/Data");
                                            oLicenseTable.setVisibleRowCount(vData.Data.length);
                                            resolve();
                                        }.bind(this),
                                        error: function (oError) {
                                            var vData = { Data: [] };
                                            oLicenseJSONModel.setData(vData);
                                            oLicenseTable.bindRows("/Data");
                                            oLicenseTable.setVisibleRowCount(vData.Data.length);
                                            resolve();
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        Common.getPromise(
                            true,
                            function (resolve) {
                                $.app.getModel("ZHR_PERS_INFO_SRV").create(
                                    // 가족사항
                                    "/PerinfoFamilySet",
                                    {
                                        IPernr: vPernr,
                                        IBukrs: vBurks,
                                        IConType: vConType,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        PinfoFamilyNav: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = { Data: [] };
                                            if (data) {
                                                if (data.PinfoFamilyNav && data.PinfoFamilyNav.results) {
                                                    for (var i = 0; i < data.PinfoFamilyNav.results.length; i++) {
                                                        data.PinfoFamilyNav.results[i].Idx = i + 1;
                                                        data.PinfoFamilyNav.results[i].Fgbdt = data.PinfoFamilyNav.results[i].Fgbdt ? dateFormat.format(new Date(common.Common.setTime(data.PinfoFamilyNav.results[i].Fgbdt))) + " (" + data.PinfoFamilyNav.results[i].ZzclassT + ")" : null;
                                                        data.PinfoFamilyNav.results[i].Livid = data.PinfoFamilyNav.results[i].Livid == "X" ? true : false;
                                                        data.PinfoFamilyNav.results[i].Helid = data.PinfoFamilyNav.results[i].Helid == "X" ? true : false;
                                                        vData.Data.push(data.PinfoFamilyNav.results[i]);
                                                    }
                                                }
                                            }
                                            oFamilyTableJSONModel.setData(vData);
                                            oFamilyTable.bindRows("/Data");
                                            oFamilyTable.setVisibleRowCount(vData.Data.length);
                                            resolve();
                                        }.bind(this),
                                        error: function (oError) {
                                            var vData = { Data: [] };
                                            oFamilyTableJSONModel.setData(vData);
                                            oFamilyTable.bindRows("/Data");
                                            oFamilyTable.setVisibleRowCount(vData.Data.length);
                                            resolve();
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        Common.getPromise(
                            true,
                            function (resolve) {
                                $.app.getModel("ZHR_PERS_RECORD_SRV").create(
                                    // 경력사항
                                    "/PerRecordCareerSet",
                                    {
                                        IPernr: vPernr,
                                        IBukrs: vBurks,
                                        IConType: vConType,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        TableIn: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = { Data: [] };
                                            if (data) {
                                                if (data.TableIn && data.TableIn.results) {
                                                    for (var i = 0; i < data.TableIn.results.length; i++) {
                                                        data.TableIn.results[i].Idx = i + 1;
                                                        data.TableIn.results[i].Begda = data.TableIn.results[i].Begda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Begda))) : null;
                                                        data.TableIn.results[i].Endda = data.TableIn.results[i].Endda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Endda))) : null;
                                                        data.TableIn.results[i].Period = data.TableIn.results[i].Begda + " ~ " + data.TableIn.results[i].Endda;
                                                        vData.Data.push(data.TableIn.results[i]);
                                                    }
                                                }
                                            }
                                            oCareerJSONModel.setData(vData);
                                            oCareerTable.bindRows("/Data");
                                            oCareerTable.setVisibleRowCount(vData.Data.length);
                                            resolve();
                                        }.bind(this),
                                        error: function (oError) {
                                            var vData = { Data: [] };
                                            oCareerJSONModel.setData(vData);
                                            oCareerTable.bindRows("/Data");
                                            oCareerTable.setVisibleRowCount(vData.Data.length);
                                            resolve();
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        Common.getPromise(
                            true,
                            function (resolve) {
                                $.app.getModel("ZHR_PERS_RECORD_SRV").create(
                                    // 포상
                                    "/PerRecordAwardSet",
                                    {
                                        IPernr: vPernr,
                                        IBukrs: vBurks,
                                        IConType: vConType,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        TableIn: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = { Data: [] };
                                            if (data) {
                                                if (data.TableIn && data.TableIn.results) {
                                                    for (var i = 0; i < data.TableIn.results.length; i++) {
                                                        data.TableIn.results[i].Idx = i + 1;
                                                        data.TableIn.results[i].Begda = data.TableIn.results[i].Begda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Begda))) : null;
                                                        vData.Data.push(data.TableIn.results[i]);
                                                    }
                                                }
                                            }
                                            oAwardJSONModel.setData(vData);
                                            oAwardTable.bindRows("/Data");
                                            oAwardTable.setVisibleRowCount(vData.Data.length);
                                            resolve();
                                        }.bind(this),
                                        error: function (oError) {
                                            var vData = { Data: [] };
                                            oAwardJSONModel.setData(vData);
                                            oAwardTable.bindRows("/Data");
                                            oAwardTable.setVisibleRowCount(vData.Data.length);
                                            resolve();
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        Common.getPromise(
                            true,
                            function (resolve) {
                                $.app.getModel("ZHR_PERS_RECORD_SRV").create(
                                    // 징계
                                    "/PerRecordPunishSet",
                                    {
                                        IPernr: vPernr,
                                        IBukrs: vBurks,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        TableIn: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = { Data: [] };
                                            if (data) {
                                                if (data.TableIn && data.TableIn.results) {
                                                    for (var i = 0; i < data.TableIn.results.length; i++) {
                                                        data.TableIn.results[i].Idx = i + 1;
                                                        data.TableIn.results[i].Begda = data.TableIn.results[i].Begda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Begda))) : null;
                                                        data.TableIn.results[i].Endda = data.TableIn.results[i].Endda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Endda))) : null;
                                                        data.TableIn.results[i].Period = data.TableIn.results[i].Begda + " ~ " + data.TableIn.results[i].Endda;
                                                        vData.Data.push(data.TableIn.results[i]);
                                                    }
                                                }
                                            }
                                            oPunishJSONModel.setData(vData);
                                            oPunishTable.bindRows("/Data");
                                            oPunishTable.setVisibleRowCount(vData.Data.length);
                                            resolve();
                                        }.bind(this),
                                        error: function (oError) {
                                            var vData = { Data: [] };
                                            oPunishJSONModel.setData(vData);
                                            oPunishTable.bindRows("/Data");
                                            oPunishTable.setVisibleRowCount(vData.Data.length);
                                            resolve();
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        Common.getPromise(
                            true,
                            function (resolve) {
                                $.app.getModel("ZHR_PERS_RECORD_SRV").create(
                                    // 발령사항
                                    "/PerRecordAnnouncementSet",
                                    {
                                        IPernr: vPernr,
                                        IBukrs: vBurks,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        TableIn: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = { Data: [] };
                                            if (data) {
                                                if (data.TableIn && data.TableIn.results) {
                                                    for (var i = 0; i < data.TableIn.results.length; i++) {
                                                        data.TableIn.results[i].Idx = i + 1;
                                                        data.TableIn.results[i].Begda = data.TableIn.results[i].Begda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Begda))) : null;
                                                        vData.Data.push(data.TableIn.results[i]);
                                                    }
                                                }
                                            }
                                            oAnnouncementJSONModel.setData(vData);
                                            oAnnouncementTable.bindRows("/Data");
                                            oAnnouncementTable.setVisibleRowCount(vData.Data.length);
                                            resolve();
                                        }.bind(this),
                                        error: function (oError) {
                                            var vData = { Data: [] };
                                            oAnnouncementJSONModel.setData(vData);
                                            oAnnouncementTable.bindRows("/Data");
                                            oAnnouncementTable.setVisibleRowCount(vData.Data.length);
                                            resolve();
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        Common.getPromise(
                            true,
                            function (resolve) {
                                $.app.getModel("ZHR_PERS_RECORD_SRV").create(
                                    // 보훈 및 장애
                                    "/PerRecordHandicapSet",
                                    {
                                        IPernr: vPernr,
                                        IConType: vConType,
                                        IBukrs: vBurks,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        TableIn: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            var vData = { Data: {} };
                                            if (data) {
                                                if (data.TableIn && data.TableIn.results.length > 0) {
                                                    vData.Data = data.TableIn.results[0];
                                                    vData.Data.Begda = vData.Data.Begda ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Begda))) : null;
                                                    vData.Data.Endda = vData.Data.Endda ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Endda))) : null;
                                                    vData.Data.Idate = vData.Data.Idate ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Idate))) : null;
                                                }
                                            }
                                            vData.Data.disyn = "2";
                                            vData.Data.actMode = vData.Data.Begda == undefined ? (vData.Data.actMode = "3") : (vData.Data.actMode = "2"); // 신규 / 수정
                                            vData.Data.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
                                            oController._HandicapJSonModel.setProperty("/Data", vData.Data);
                                            resolve();
                                        }.bind(this),
                                        error: function (oError) {
                                            var vData = { Data: {} };
                                            vData.User.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
                                            vData.Data.disyn = "2";
                                            oController._HandicapJSonModel.setProperty("/Data", vData.Data);
                                            resolve();
                                        }
                                    }
                                );
                            }.bind(this)
                        )
                    ]).then(function () {
                        oController._HandicapJSonModel.setProperty("/Data/Openf", oController._ListCondJSonModel.getProperty("/Data/Openf"));
                        oController._MilitaryJSonModel.setProperty("/Data/Openf", oController._ListCondJSonModel.getProperty("/Data/Openf"));
                        oController._HeaderJSonModel.refresh();
                        oController._BusyDialog.close();
                    });
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            onPressSearchBasic: function (vPernr) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List");
                var oController = oView.getController();

                var oData = oController._ListCondJSonModel.getProperty("/Data");
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: oView.getModel("session").getData().Dtfmt });
                var vData = { Data: {} };

                var search = function () {
                    var oPath = "";
                    var createData = { PinfoBasicNav: [] };

                    // Address
                    oPath = "/PerinfoBasicSet";
                    createData.IPernr = vPernr;
                    createData.IConType = "1";
                    createData.IDatum = "/Date(" + common.Common.getTime(new Date()) + ")/";

                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_INFO_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
                                if (data.PinfoBasicNav && data.PinfoBasicNav.results.length > 0) {
                                    vData.Data = data.PinfoBasicNav.results[0];
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
                    vData.Data.disyn = "2";
                    vData.Data.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
                    vData.Data.Zzbdate = vData.Data.Zzbdate ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Zzbdate))) : null;
                    vData.Data.Zzclass = vData.Data.Zzclass ? Number(vData.Data.Zzclass) - 1 : null;
                    vData.Data.Famdt = vData.Data.Famdt ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Famdt))) : null;
                    vData.Data.Dat01 = vData.Data.Dat01 ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Dat01))) : null;
                    vData.Data.Dat02 = vData.Data.Dat02 ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Dat02))) : null;
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

            onPressSearchAddress: function (vPernr) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List");
                var oController = oView.getController();

                var oData = oController._ListCondJSonModel.getProperty("/Data"),
                    oTable = sap.ui.getCore().byId(oController.PAGEID + "_AddressTable"),
                    oJSONModel = oTable.getModel();
                var vData = { Data: [] };

                var search = function () {
                    var oPath = "";
                    var createData = { PinfoAddressNav: [] };

                    // Address
                    oPath = "/PerinfoAddressSet";
                    createData.IPernr = vPernr;
                    // this.oController.getSessionInfoByKey("Pernr");
                    createData.IConType = "1";
                    createData.IDatum = "/Date(" + common.Common.getTime(new Date()) + ")/";
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;

                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_INFO_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
                                if (data.PinfoAddressNav && data.PinfoAddressNav.results) {
                                    for (var i = 0; i < data.PinfoAddressNav.results.length; i++) {
                                        data.PinfoAddressNav.results[i].Idx = i + 1;
                                        vData.Data.push(data.PinfoAddressNav.results[i]);
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

                    oJSONModel.setData(vData);
                    oTable.bindRows("/Data");
                    oTable.setVisibleRowCount(vData.Data.length >= 10 ? 10 : vData.Data.length);

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

            onPressSearchCar: function (vPernr) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List");
                var oController = oView.getController();

                var oData = oController._ListCondJSonModel.getProperty("/Data");

                var vData = { Data: {} },
                    vError = "",
                    vErrorMessage = "";

                var search = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };

                    oPath = "/PerinfoCarmanagerSet";
                    createData.IPernr = vPernr;
                    createData.IConType = "1";
                    createData.IDatum = "/Date(" + common.Common.getTime(new Date()) + ")/";
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;

                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_INFO_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
                                if (data.TableIn && data.TableIn.results.length > 0) {
                                    vData.Data = data.TableIn.results[0];
                                }
                            }
                        },
                        function (oError) {
                            var Err = {};
                            vError = "E";

                            if (oError.response) {
                                Err = window.JSON.parse(oError.response.body);
                                var msg1 = Err.error.innererror.errordetails;
                                if (msg1 && msg1.length) vErrorMessage = Err.error.innererror.errordetails[0].message;
                                else vErrorMessage = Err.error.message.value;
                            } else {
                                vErrorMessage = oError.toString();
                            }
                        }
                    );
                    if (vData.Data.Cartype == undefined) vData.Data.actMode = "3";
                    //신규
                    else vData.Data.actMode = "2"; //수정

                    vData.Data.disyn = "2";
                    vData.Data.Odsupport = vData.Data.Odsupport == "X" ? true : null;
                    vData.Data.Parkticket = vData.Data.Parkticket == "X" ? true : null;
                    vData.Data.Hybrid = vData.Data.Hybrid == "X" ? true : null;
                    vData.Data.Hybrid2 = vData.Data.Hybrid2 == "X" ? true : null;
                    vData.Data.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
                    oController._CarJSonModel.setProperty("/Data", vData.Data);
                    oController._BusyDialog.close();

                    if (vError == "E") {
                        sap.m.MessageBox.error(vErrorMessage);
                        return;
                    }
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            onPressSearchPassport: function (vPernr) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List");
                var oController = oView.getController();

                var oData = oController._ListCondJSonModel.getProperty("/Data"),
                    oTable = sap.ui.getCore().byId(oController.PAGEID + "_PassportTable"),
                    oJSONModel = oTable.getModel();
                var vData = { Data: [] };

                var search = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };

                    // Address
                    oPath = "/PerinfoPassportSet";
                    createData.IPernr = vPernr;
                    createData.IConType = "1";
                    createData.IDatum = "/Date(" + common.Common.getTime(new Date()) + ")/";

                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_INFO_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
                                if (data.TableIn && data.TableIn.results) {
                                    for (var i = 0; i < data.TableIn.results.length; i++) {
                                        data.TableIn.results[i].Idx = i + 1;
                                        vData.Data.push(data.TableIn.results[i]);
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

                    oJSONModel.setData(vData);
                    oTable.bindRows("/Data");
                    oTable.setVisibleRowCount(vData.Data.length >= 10 ? 10 : vData.Data.length);

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
            onPressSearchSchool: function (vPernr) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List");
                var oController = oView.getController();
                oController.PAGEID = "Perinfo";
                var oData = oController._ListCondJSonModel.getProperty("/Data"),
                    oTable = sap.ui.getCore().byId(oController.PAGEID + "_SchoolTable"),
                    oJSONModel = oTable.getModel();
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: oView.getModel("session").getData().Dtfmt });
                var vData = { Data: [] };

                var search = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };

                    oPath = "/PerRecordScholarshipSet";
                    createData.IPernr = vPernr;
                    createData.IConType = "1";
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
                    createData.ILangu = oController.getView().getModel("session").getData().Langu;

                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_RECORD_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
                                if (data.TableIn && data.TableIn.results) {
                                    for (var i = 0; i < data.TableIn.results.length; i++) {
                                        data.TableIn.results[i].Idx = i + 1;
                                        data.TableIn.results[i].Begda = data.TableIn.results[i].Begda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Begda))) : null;
                                        data.TableIn.results[i].Endda = data.TableIn.results[i].Endda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Endda))) : null;
                                        data.TableIn.results[i].Period = data.TableIn.results[i].Begda + " ~ " + data.TableIn.results[i].Endda;
                                        data.TableIn.results[i].Zzlmark = data.TableIn.results[i].Zzlmark == "X" ? true : false;
                                        vData.Data.push(data.TableIn.results[i]);
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

                    oJSONModel.setData(vData);
                    oTable.bindRows("/Data");
                    oTable.setVisibleRowCount(vData.Data.length >= 10 ? 10 : vData.Data.length);

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

            //병역사항
            onPressSearchMilitary: function (vPernr) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List");
                var oController = oView.getController();

                var oData = oController._ListCondJSonModel.getProperty("/Data");
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: oView.getModel("session").getData().Dtfmt });
                var vData = { Data: {} };

                var search = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };

                    oPath = "/PerRecordMilitarySet";
                    createData.IPernr = vPernr;
                    createData.IConType = "1";
                    createData.IDatum = "/Date(" + common.Common.getTime(new Date()) + ")/";
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;

                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_RECORD_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
                                if (data.TableIn && data.TableIn.results.length > 0) {
                                    vData.Data = data.TableIn.results[0];
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
                    if (vData.Data.Begda == undefined) vData.Data.actMode = "3";
                    //신규
                    else vData.Data.actMode = "2"; //수정

                    vData.Data.disyn = "2";
                    vData.Data.Zrotc = vData.Data.Zrotc == "X" ? true : null;
                    vData.Data.Begda = vData.Data.Begda ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Begda))) : null;
                    vData.Data.Endda = vData.Data.Endda ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Endda))) : null;
                    vData.Data.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
                    vData.Data.Openf = oController._ListCondJSonModel.getProperty("/Data/Openf");

                    oController._MilitaryJSonModel.setProperty("/Data", vData.Data);
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

            //
            onPressSearchLicense: function (vPernr) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List");
                var oController = oView.getController();
                oController.PAGEID = "Perinfo";
                var oData = oController._ListCondJSonModel.getProperty("/Data"),
                    oTable = sap.ui.getCore().byId(oController.PAGEID + "_LicenseTable"),
                    oJSONModel = oTable.getModel();
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: oView.getModel("session").getData().Dtfmt });
                var vData = { Data: [] };

                var search = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };

                    oPath = "/PerRecordLicenseSet";
                    createData.IPernr = vPernr;
                    createData.IConType = "1";
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
                    createData.ILangu = oController.getView().getModel("session").getData().Langu;

                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_RECORD_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
                                if (data.TableIn && data.TableIn.results) {
                                    for (var i = 0; i < data.TableIn.results.length; i++) {
                                        data.TableIn.results[i].Idx = i + 1;
                                        data.TableIn.results[i].Begda = data.TableIn.results[i].Begda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Begda))) : null;
                                        data.TableIn.results[i].Endda = data.TableIn.results[i].Endda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Endda))) : null;
                                        data.TableIn.results[i].GetDate = data.TableIn.results[i].GetDate ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].GetDate))) : null;
                                        vData.Data.push(data.TableIn.results[i]);
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

                    oJSONModel.setData(vData);
                    oTable.bindRows("/Data");
                    oTable.setVisibleRowCount(vData.Data.length >= 10 ? 10 : vData.Data.length);

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

            onPressSearchCareer: function (vPernr) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List");
                var oController = oView.getController();
                oController.PAGEID = "Perinfo";
                var oData = oController._ListCondJSonModel.getProperty("/Data"),
                    oTable = sap.ui.getCore().byId(oController.PAGEID + "_CareerTable"),
                    oJSONModel = oTable.getModel();
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: oView.getModel("session").getData().Dtfmt });
                var vData = { Data: [] };

                var search = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };

                    oPath = "/PerRecordCareerSet";
                    createData.IPernr = vPernr;
                    createData.IConType = "1";
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
                    createData.ILangu = oController.getView().getModel("session").getData().Langu;

                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_RECORD_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
                                if (data.TableIn && data.TableIn.results) {
                                    for (var i = 0; i < data.TableIn.results.length; i++) {
                                        data.TableIn.results[i].Idx = i + 1;
                                        data.TableIn.results[i].Begda = data.TableIn.results[i].Begda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Begda))) : null;
                                        data.TableIn.results[i].Endda = data.TableIn.results[i].Endda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Endda))) : null;
                                        data.TableIn.results[i].Period = data.TableIn.results[i].Begda + " ~ " + data.TableIn.results[i].Endda;
                                        vData.Data.push(data.TableIn.results[i]);
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

                    oJSONModel.setData(vData);
                    oTable.bindRows("/Data");
                    oTable.setVisibleRowCount(vData.Data.length >= 10 ? 10 : vData.Data.length);

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

            onPressSearchAward: function (vPernr) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List");
                var oController = oView.getController();
                oController.PAGEID = "Perinfo";
                var oData = oController._ListCondJSonModel.getProperty("/Data"),
                    oTable = sap.ui.getCore().byId(oController.PAGEID + "_AwardTable"),
                    oJSONModel = oTable.getModel();
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: oView.getModel("session").getData().Dtfmt });
                var vData = { Data: [] };

                var search = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };

                    oPath = "/PerRecordAwardSet";
                    createData.IPernr = vPernr;
                    createData.IConType = "1";
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
                    createData.ILangu = oController.getView().getModel("session").getData().Langu;

                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_RECORD_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
                                if (data.TableIn && data.TableIn.results) {
                                    for (var i = 0; i < data.TableIn.results.length; i++) {
                                        data.TableIn.results[i].Idx = i + 1;
                                        data.TableIn.results[i].Begda = data.TableIn.results[i].Begda ? dateFormat.format(new Date(common.Common.setTime(data.TableIn.results[i].Begda))) : null;
                                        vData.Data.push(data.TableIn.results[i]);
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

                    oJSONModel.setData(vData);
                    oTable.bindRows("/Data");
                    oTable.setVisibleRowCount(vData.Data.length >= 10 ? 10 : vData.Data.length);

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

            //보훈 및 장애
            onPressSearchHandicap: function (vPernr) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List");
                var oController = oView.getController();

                var oData = oController._ListCondJSonModel.getProperty("/Data");
                var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: oView.getModel("session").getData().Dtfmt });
                var vData = { Data: {} };

                var search = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };

                    oPath = "/PerRecordHandicapSet";
                    createData.IPernr = vPernr;
                    createData.IConType = "1";
                    createData.IDatum = "/Date(" + common.Common.getTime(new Date()) + ")/";
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;

                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_RECORD_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
                                if (data.TableIn && data.TableIn.results.length > 0) {
                                    vData.Data = data.TableIn.results[0];
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
                    if (vData.Data.Begda == undefined) vData.Data.actMode = "3";
                    //신규
                    else vData.Data.actMode = "2"; //수정

                    vData.Data.disyn = "2";
                    vData.Data.Begda = vData.Data.Begda ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Begda))) : null;
                    vData.Data.Endda = vData.Data.Endda ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Endda))) : null;
                    vData.Data.Idate = vData.Data.Idate ? dateFormat.format(new Date(common.Common.setTime(vData.Data.Idate))) : null;
                    vData.Data.Auth = oController._ListCondJSonModel.getProperty("/Data/Auth");
                    vData.Data.Openf = oController._ListCondJSonModel.getProperty("/Data/Openf");

                    oController._HandicapJSonModel.setProperty("/Data", vData.Data);
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

            onAddressDblClick: function (actMode) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController(),
                    oTable = sap.ui.getCore().byId(oController.PAGEID + "_AddressTable"),
                    oModel = oTable.getModel(),
                    vIDXs = oTable.getSelectedIndices(),
                    selectRowObject = {},
                    dateFormat;
                if (oView.getModel("session")) {
                    dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: oView.getModel("session").getData().Dtfmt });
                }

                if (vIDXs.length < 1) {
                    sap.m.MessageBox.alert(oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                    return;
                }

                try {
                    Object.assign(selectRowObject, oModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath));
                } catch (e) {
                    console.log(e);
                }
                selectRowObject.actMode = actMode;
                if (actMode == "2") {
                    selectRowObject.actMode = selectRowObject.Pstlz == "" ? "3" : "2";
                }

                selectRowObject.Begda = selectRowObject.Begda ? dateFormat.format(new Date(common.Common.setTime(selectRowObject.Begda))) : null;

                if (!oController._AddressDialog) {
                    oController._AddressDialog = sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.AddressInfo", oController);
                    oView.addDependent(oController._AddressDialog);
                }
                // 신규일 경우 한국을 기본
                if (selectRowObject.actMode == "3") {
                    selectRowObject.Land1 = "KR";
                }
                // Data setting
                oController._AddressJSonModel.setData({ Data: selectRowObject });
                oController.onChangeCountry();
                var oPhonRow = sap.ui.getCore().byId(oController.PAGEID + "_PhonRow"); // Phone Row
                if (selectRowObject.Subty == "3") {
                    oPhonRow.removeStyleClass("DisplayNone");
                } else {
                    oPhonRow.addStyleClass("DisplayNone");
                }

                oController._AddressDialog.open();
            },

            onPassportDblClick: function (actMode) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController(),
                    oTable = sap.ui.getCore().byId(oController.PAGEID + "_PassportTable"),
                    oModel = oTable.getModel(),
                    vIDXs = oTable.getSelectedIndices(),
                    selectRowObject = {},
                    dateFormat;
                if (oView.getModel("session")) {
                    dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: oView.getModel("session").getData().Dtfmt });
                }

                if (actMode == "3") {
                    selectRowObject.Begda = dateFormat.format(new Date());
                    selectRowObject.Endda = dateFormat.format(new Date(9999, 11, 31));
                } else {
                    if (vIDXs.length < 1) {
                        sap.m.MessageBox.alert(oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                        return;
                    }
                    try {
                        Object.assign(selectRowObject, oModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath));
                    } catch (e) {
                        console.log(e);
                    }

                    selectRowObject.Begda = selectRowObject.Begda ? dateFormat.format(new Date(common.Common.setTime(selectRowObject.Begda))) : null;
                    selectRowObject.Endda = selectRowObject.Endda ? dateFormat.format(new Date(common.Common.setTime(selectRowObject.Endda))) : null;
                }
                selectRowObject.actMode = actMode;

                if (!oController._PassportDialog) {
                    oController._PassportDialog = sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.PassportInfo", oController);
                    oView.addDependent(oController._PassportDialog);
                }

                // Data setting
                oController._PassportJSonModel.setData({ Data: selectRowObject });
                if (actMode == "4") oController.onSavePassport("4");
                else oController._PassportDialog.open();
            },

            onSchoolDblClick: function (actMode) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController(),
                    oTable = sap.ui.getCore().byId(oController.PAGEID + "_SchoolTable"),
                    oModel = oTable.getModel(),
                    vIDXs = oTable.getSelectedIndices(),
                    selectRowObject = {},
                    dateFormat;

                if (oView.getModel("session")) {
                    // dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oView.getModel("session").getData().Dtfmt});
                }

                if (actMode == "3") {
                    selectRowObject.Sland = "KR"; // 신규생성 시 Default 국가는 한국
                } else {
                    if (vIDXs.length < 1) {
                        sap.m.MessageBox.alert(oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                        return;
                    }
                    try {
                        Object.assign(selectRowObject, oModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath));
                    } catch (e) {
                        console.log(e);
                    }
                }
                selectRowObject.actMode = actMode;

                // Dialog 가 오픈 될 때는 PAGE ID 변경
                if (actMode != "4") {
                    oController.PAGEID = "Perinfo_School"; // PAGE ID 변경 - 첨부파일 공통 사용 위함
                    if (!oController._SchoolDialog) {
                        oController._SchoolDialog = sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.SchoolInfo", oController);
                        oView.addDependent(oController._SchoolDialog);
                    }
                }
                // Data setting
                oController._SchoolJSonModel.setData({ Data: selectRowObject });

                if (actMode == "4") {
                    oController.onSaveSchool(actMode);
                } else if (actMode == "3") {
                    // 신규
                    AttachFileAction.setAttachFile(oController, {
                        Appnm: selectRowObject.Appnm ? selectRowObject.Appnm : "",
                        Required: false,
                        Mode: "M",
                        Max: "1",
                        Editable: actMode == "2" || actMode == "3" ? true : false,
                        FileTypes: ["ppt", "pptx", "xls", "xlsx", "doc", "docx", "jpg", "pdf", "zip", "gif", "png"]
                    });
                    oController._SchoolDialog.open();
                } else {
                    oController.refreshAttachFileList(oController); // 첨부파일 Clear
                    AttachFileAction.setAttachFile(oController, {
                        Appnm: selectRowObject.Appnm ? selectRowObject.Appnm : "",
                        Required: false,
                        Mode: "M",
                        Max: "1",
                        Editable: actMode == "2" || actMode == "3" ? true : false,
                        FileTypes: ["ppt", "pptx", "xls", "xlsx", "doc", "docx", "jpg", "pdf", "zip", "gif", "png"]
                    });
                    oController.onChangeSlart("N"); // 하위필드 초기화 하지 않음
                }
            },

            onLicenseDblClick: function (actMode) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController(),
                    oTable = sap.ui.getCore().byId(oController.PAGEID + "_LicenseTable"),
                    oModel = oTable.getModel(),
                    vIDXs = oTable.getSelectedIndices(),
                    selectRowObject = {},
                    dateFormat;

                if (oView.getModel("session")) {
                    // dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oView.getModel("session").getData().Dtfmt});
                }

                if (actMode == "3") {
                } else {
                    if (vIDXs.length < 1) {
                        sap.m.MessageBox.alert(oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                        return;
                    }
                    try {
                        Object.assign(selectRowObject, oModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath));
                    } catch (e) {
                        console.log(e);
                    }
                }
                selectRowObject.actMode = actMode;

                // Dialog 가 오픈 될 때는 PAGE ID 변경
                if (actMode != "4") {
                    oController.PAGEID = "Perinfo_License"; // PAGE ID 변경 - 첨부파일 공통 사용 위함
                    if (!oController._LicenseDialog) {
                        oController._LicenseDialog = sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.LicenseInfo", oController);
                        oView.addDependent(oController._LicenseDialog);
                    }
                }

                // Data setting
                oController._LicenseJSonModel.setProperty("/Data", selectRowObject);

                if (actMode == "4") {
                    oController.onSaveLicense(actMode);
                } else if (actMode == "3") {
                    oController.refreshAttachFileList(oController); // 첨부파일 Clear
                    AttachFileAction.setAttachFile(oController, {
                        Appnm: selectRowObject.Appnm ? selectRowObject.Appnm : "",
                        Required: false,
                        Mode: "M",
                        Max: "1",
                        Editable: actMode == "2" || actMode == "3" ? true : false,
                        FileTypes: ["ppt", "pptx", "xls", "xlsx", "doc", "docx", "jpg", "pdf", "zip", "gif", "png"]
                    });
                    oController._LicenseDialog.open();
                } else {
                    AttachFileAction.setAttachFile(oController, {
                        Appnm: selectRowObject.Appnm ? selectRowObject.Appnm : "",
                        Required: false,
                        Mode: "M",
                        Max: "1",
                        Editable: actMode == "2" || actMode == "3" ? true : false,
                        FileTypes: ["ppt", "pptx", "xls", "xlsx", "doc", "docx", "jpg", "pdf", "zip", "gif", "png"]
                    });
                    oController.onChangeLicnn("N"); // 하위필드 초기화 하지 않음
                }
            },

            onCareerDblClick: function (actMode) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController(),
                    oTable = sap.ui.getCore().byId(oController.PAGEID + "_CareerTable"),
                    oModel = oTable.getModel(),
                    vIDXs = oTable.getSelectedIndices(),
                    selectRowObject = {},
                    dateFormat;

                if (oView.getModel("session")) {
                    // dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oView.getModel("session").getData().Dtfmt});
                }

                if (actMode == "3") {
                    selectRowObject.Land1 = "KR"; // 신규생성 시 Default 국가는 한국
                } else {
                    if (vIDXs.length < 1) {
                        sap.m.MessageBox.alert(oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                        return;
                    }
                    try {
                        Object.assign(selectRowObject, oModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath));
                    } catch (e) {
                        console.log(e);
                    }
                }
                selectRowObject.actMode = actMode;
                // Dialog 가 오픈 될 때는 PAGE ID 변경
                if (actMode != "4") {
                    oController.PAGEID = "Perinfo_Career"; // PAGE ID 변경 - 첨부파일 공통 사용 위함
                    if (!oController._CareerDialog) {
                        oController._CareerDialog = sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.CareerInfo", oController);
                        oView.addDependent(oController._CareerDialog);
                    }
                }

                // Data setting
                oController._CareerJSonModel.setData({ Data: selectRowObject });

                if (actMode == "4") {
                    oController.onSaveCareer(actMode);
                } else {
                    oController.refreshAttachFileList(oController); // 첨부파일 Clear
                    AttachFileAction.setAttachFile(oController, {
                        Appnm: selectRowObject.Appnm ? selectRowObject.Appnm : "",
                        Required: false,
                        Mode: "M",
                        Max: "1",
                        Editable: actMode == "2" || actMode == "3" ? true : false,
                        FileTypes: ["ppt", "pptx", "xls", "xlsx", "doc", "docx", "jpg", "pdf", "zip", "gif", "png"]
                    });
                    oController._CareerDialog.open();
                }
            },

            onAwardDblClick: function (actMode) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController(),
                    oTable = sap.ui.getCore().byId(oController.PAGEID + "_AwardTable"),
                    oModel = oTable.getModel(),
                    vIDXs = oTable.getSelectedIndices(),
                    selectRowObject = {},
                    dateFormat;

                if (oView.getModel("session")) {
                    // dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oView.getModel("session").getData().Dtfmt});
                }

                if (actMode == "3") {
                } else {
                    if (vIDXs.length < 1) {
                        sap.m.MessageBox.alert(oController.getBundleText("MSG_00066")); // 대상 항목을 선택하세요.
                        return;
                    }
                    try {
                        Object.assign(selectRowObject, oModel.getProperty(oTable.getContextByIndex(vIDXs[0]).sPath));
                    } catch (e) {
                        console.log(e);
                    }
                }
                selectRowObject.actMode = actMode;
                // Dialog 가 오픈 될 때는 PAGE ID 변경
                if (actMode != "4") {
                    oController.PAGEID = "Perinfo_Award"; // PAGE ID 변경 - 첨부파일 공통 사용 위함
                    if (!oController._AwardDialog) {
                        oController._AwardDialog = sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.AwardInfo", oController);
                        oView.addDependent(oController._AwardDialog);
                    }
                }

                // Data setting
                oController._AwardJSonModel.setData({ Data: selectRowObject });

                if (actMode == "4") {
                    oController.onSaveAward(actMode);
                } else {
                    oController.refreshAttachFileList(oController); // 첨부파일 Clear
                    AttachFileAction.setAttachFile(oController, {
                        Appnm: selectRowObject.Appnm ? selectRowObject.Appnm : "",
                        Required: false,
                        Mode: "M",
                        Max: "1",
                        Editable: actMode == "2" || actMode == "3" ? true : false,
                        FileTypes: ["ppt", "pptx", "xls", "xlsx", "doc", "docx", "jpg", "pdf", "zip", "gif", "png"]
                    });
                    oController._AwardDialog.open();
                }
            },

            onSaveBasic: function (oEvent) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController();
                var saveData = oController._BasicJSonModel.getProperty("/Data");
                var vOData = oController.onValidationData(oController, saveData, "A1");
                if (!vOData || vOData == "") return;

                var create = function () {
                    var oPath = "";
                    var createData = { PinfoBasicNav: [] };
                    var detailData = {};
                    // 인적
                    oPath = "/PerinfoBasicSet";
                    createData.IPernr = oController.getView().getModel("session").getData().Pernr;
                    createData.IConType = "2";
                    createData.IDatum = "/Date(" + common.Common.getTime(new Date()) + ")/";

                    Object.assign(detailData, saveData);
                    delete detailData.disyn;
                    delete detailData.actMode;
                    delete detailData.Auth;
                    delete detailData.Regno;
                    delete detailData.Dat01;
                    delete detailData.Dat02;
                    detailData.Pernr = detailData.Pernr;
                    detailData.Zzbdate = detailData.Zzbdate ? "/Date(" + common.Common.getTime(new Date(detailData.Zzbdate)) + ")/" : null;
                    detailData.Famdt = detailData.Famdt ? "/Date(" + common.Common.getTime(new Date(detailData.Famdt)) + ")/" : null;
                    detailData.Zzclass = detailData.Zzclass ? String(detailData.Zzclass + 1) : null;
                    createData.PinfoBasicNav.push(detailData);
                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_INFO_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
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

                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    sap.m.MessageBox.alert(oController.getBundleText("MSG_57006"), {
                        title: oController.getBundleText("LABEL_00149")
                    });
                    // Data setting
                    oController._BasicJSonModel.setProperty("/Data", {});
                    oController.onPressSearchBasic(oController.getView().getModel("session").getData().Pernr);
                };

                var CreateProcess = function (fVal) {
                    if (fVal && fVal == sap.m.MessageBox.Action.YES) {
                        oController._BusyDialog.open();
                        setTimeout(create, 100);
                    }
                };

                var Message = oController.getBundleText("MSG_00058"); // 저장하시겠습니까?
                sap.m.MessageBox.confirm(Message, {
                    title: oController.getBundleText("LABEL_02053"), // 확인
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: CreateProcess
                });
            },

            onSaveAddress: function (oEvent) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController();
                var saveData = oController._AddressJSonModel.getProperty("/Data");
                var vOData = oController.onValidationData(oController, saveData, "A2");
                if (!vOData || vOData == "") return;

                var create = function () {
                    var oPath = "";
                    var createData = { PinfoAddressNav: [] };
                    var detailData = {};

                    // Address
                    oPath = "/PerinfoAddressSet";
                    createData.IPernr = oController.getView().getModel("session").getData().Pernr;
                    createData.IConType = "2";
                    createData.IDatum = "/Date(" + common.Common.getTime(new Date()) + ")/";
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;

                    Object.assign(detailData, saveData);
                    delete detailData.disyn;
                    delete detailData.actMode;
                    delete detailData.Auth;
                    delete detailData.Idx;
                    delete detailData.Openf;

                    detailData.Pernr = detailData.Pernr;
                    detailData.Begda = detailData.Begda ? "/Date(" + common.Common.getTime(new Date(detailData.Begda)) + ")/" : null;
                    detailData.Endda = detailData.Endda ? "/Date(" + common.Common.getTime(new Date(detailData.Endda)) + ")/" : null;
                    createData.PinfoAddressNav.push(detailData);
                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_INFO_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
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

                    oController._BusyDialog.close();

                    // Data setting
                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }
                    oController._AddressDialog.close();
                    oController._AddressJSonModel.setData({ Data: {} });

                    sap.m.MessageBox.alert(oController.getBundleText("MSG_57006"), {
                        title: oController.getBundleText("LABEL_00149")
                    });

                    oController.onPressSearchAddress(oController.getView().getModel("session").getData().Pernr);
                };

                oController._BusyDialog.open();
                setTimeout(create, 100);
            },

            onSaveCar: function (appType) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController();
                var Message;

                var create = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };
                    var detailData = {};
                    var saveData = oController._CarJSonModel.getProperty("/Data");

                    oPath = "/PerinfoCarmanagerSet";
                    createData.IPernr = oController.getView().getModel("session").getData().Pernr;
                    if (appType == "D") createData.IConType = "4";
                    else createData.IConType = saveData.actMode; //"2 : 수정, 3 : 신규 , 5 : 삭제"
                    createData.IDatum = "/Date(" + common.Common.getTime(new Date()) + ")/";
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;

                    Object.assign(detailData, saveData);
                    delete detailData.disyn;
                    delete detailData.actMode;
                    delete detailData.Auth;
                    delete detailData.Idx;
                    delete detailData.Openf;

                    detailData.Pernr = oController.getView().getModel("session").getData().Pernr;
                    detailData.Begda = saveData.Begda ? "/Date(" + common.Common.getTime(new Date(saveData.Begda)) + ")/" : "/Date(" + common.Common.getTime(new Date()) + ")/";
                    detailData.Endda = saveData.Endda ? "/Date(" + common.Common.getTime(new Date(saveData.Endda)) + ")/" : "/Date(" + common.Common.getTime(new Date(9999, 11, 31)) + ")/";
                    detailData.Odsupport = detailData.Odsupport == true ? "X" : null;
                    detailData.Parkticket = detailData.Parkticket == true ? "X" : null;
                    detailData.Hybrid = detailData.Hybrid == true ? "X" : null;
                    detailData.Hybrid2 = detailData.Hybrid2 == true ? "X" : null;

                    createData.TableIn.push(detailData);
                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_INFO_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
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

                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    if (appType == "D") {
                        Message = oController.getBundleText("MSG_02039");
                    } else {
                        Message = oController.getBundleText("MSG_02020");
                    }

                    sap.m.MessageBox.alert(Message, {
                        title: oController.getBundleText("LABEL_00149"),
                        onClose: function () {
                            // Data setting
                            oController._CarJSonModel.setProperty("/Data", {});
                            oController.onPressSearchCar(oController.getView().getModel("session").getData().Pernr);
                        }
                    });
                };

                var CreateProcess = function (fVal) {
                    if (fVal && fVal == sap.m.MessageBox.Action.YES) {
                        oController._BusyDialog.open();
                        setTimeout(create, 100);
                    }
                };

                if (appType == "D") {
                    Message = oController.getBundleText("MSG_02040"); // 삭제하시겠습니까?
                } else {
                    Message = oController.getBundleText("MSG_00058"); // 저장하시겠습니까?
                }
                sap.m.MessageBox.confirm(Message, {
                    title: oController.getBundleText("LABEL_02053"), // 확인
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: CreateProcess
                });
            },

            onSavePassport: function (actMode) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController();
                var Message;

                var create = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };
                    var detailData = {};
                    var saveData = oController._PassportJSonModel.getProperty("/Data");
                    // Address
                    oPath = "/PerinfoPassportSet";
                    createData.IPernr = oController.getView().getModel("session").getData().Pernr;
                    createData.IConType = actMode; //"2 : 수정, 3 : 신규 , 4 : 삭제"

                    Object.assign(detailData, saveData);
                    delete detailData.disyn;
                    delete detailData.actMode;
                    delete detailData.Auth;
                    delete detailData.Idx;
                    delete detailData.Openf;

                    detailData.Pernr = oController.getView().getModel("session").getData().Pernr;
                    detailData.Begda = "/Date(" + common.Common.getTime(new Date(detailData.Begda)) + ")/";
                    detailData.Endda = "/Date(" + common.Common.getTime(new Date(detailData.Endda)) + ")/";
                    detailData.BegdaOld = saveData.BegdaOld ? "/Date(" + common.Common.getTime(new Date(detailData.BegdaOld)) + ")/" : null;
                    detailData.EnddaOld = saveData.EnddaOld ? "/Date(" + common.Common.getTime(new Date(detailData.EnddaOld)) + ")/" : null;

                    createData.TableIn.push(detailData);
                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_INFO_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
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

                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    if (actMode == "4") {
                        Message = oController.getBundleText("MSG_02039");
                    } else {
                        Message = oController.getBundleText("MSG_02020");
                    }

                    sap.m.MessageBox.alert(Message, {
                        title: oController.getBundleText("LABEL_00149"),
                        onClose: function () {
                            oController._PassportDialog.close();
                            // Data setting
                            oController._PassportJSonModel.setData({ Data: {} });
                            oController.onPressSearchPassport(oController.getView().getModel("session").getData().Pernr);
                        }
                    });
                };

                var CreateProcess = function (fVal) {
                    if (fVal && fVal == sap.m.MessageBox.Action.YES) {
                        oController._BusyDialog.open();
                        setTimeout(create, 100);
                    }
                };

                if (actMode == "4") {
                    Message = oController.getBundleText("MSG_02040"); // 삭제하시겠습니까?
                } else {
                    Message = oController.getBundleText("MSG_00058"); // 저장하시겠습니까?
                }
                sap.m.MessageBox.confirm(Message, {
                    title: oController.getBundleText("LABEL_02053"), // 확인
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: CreateProcess
                });
            },

            onSaveSchool: function (actMode) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController();
                var Message;
                var saveData = oController._SchoolJSonModel.getProperty("/Data");
                var vOData = oController.onValidationData(oController, saveData, "A3");
                if (!vOData || vOData == "") return;

                var create = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };
                    var detailData = {};

                    oPath = "/PerRecordScholarshipSet";
                    createData.IPernr = oController.getView().getModel("session").getData().Pernr;
                    createData.IConType = actMode; //"2 : 수정, 3 : 신규 , 4 : 삭제"
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
                    createData.IPrevApply = "X";

                    Object.assign(detailData, saveData);
                    delete detailData.disyn;
                    delete detailData.actMode;
                    delete detailData.Auth;
                    delete detailData.Idx;
                    delete detailData.Openf;
                    delete detailData.Period;

                    detailData.Pernr = oController.getView().getModel("session").getData().Pernr;
                    detailData.Begda = "/Date(" + common.Common.getTime(new Date(detailData.Begda)) + ")/";
                    detailData.Endda = "/Date(" + common.Common.getTime(new Date(detailData.Endda)) + ")/";
                    detailData.Waers = detailData.Waers ? detailData.Waers : "KRW";
                    detailData.Zzlmark = detailData.Zzlmark == true ? "X" : "";
                    detailData.BegdaOld = detailData.BegdaOld ? "/Date(" + common.Common.getTime(new Date(detailData.BegdaOld)) + ")/" : null;
                    detailData.EnddaOld = detailData.EnddaOld ? "/Date(" + common.Common.getTime(new Date(detailData.EnddaOld)) + ")/" : null;
                    createData.TableIn.push(detailData);
                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_RECORD_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
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

                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    if (actMode == "4") {
                        Message = oController.getBundleText("MSG_37036"); // 삭제 요청하였습니다.
                    } else {
                        Message = oController.getBundleText("MSG_37034"); // 수정/등록 요청하였습니다.
                    }

                    sap.m.MessageBox.alert(Message, {
                        title: oController.getBundleText("LABEL_00149"),
                        onClose: function () {
                            oController._SchoolDialog.close();
                            // Data setting
                            oController._SchoolJSonModel.setData({ Data: {} });
                            oController.onPressSearchSchool(oController.getView().getModel("session").getData().Pernr);
                        }
                    });
                };

                var CreateProcess = function (fVal) {
                    if (fVal && fVal == sap.m.MessageBox.Action.YES) {
                        oController._BusyDialog.open();
                        setTimeout(create, 100);
                    }
                };

                if (actMode == "4") {
                    Message = oController.getBundleText("MSG_37033"); // 삭제 신청하시겠습니까?
                } else {
                    Message = oController.getBundleText("MSG_37035"); // 수정/등록 신청하시겠습니까?
                }
                sap.m.MessageBox.confirm(Message, {
                    title: oController.getBundleText("LABEL_02053"), // 확인
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: CreateProcess
                });
            },

            onSaveMilitary: function (appType) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController();
                var Message;
                var saveData = oController._MilitaryJSonModel.getProperty("/Data");
                var vOData = oController.onValidationData(oController, saveData, "A4");
                if (!vOData || vOData == "") return;

                var create = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };
                    var detailData = {};

                    oPath = "/PerRecordMilitarySet";
                    createData.IPernr = oController.getView().getModel("session").getData().Pernr;
                    if (appType == "D") createData.IConType = "4";
                    else createData.IConType = saveData.actMode; //"2 : 수정, 3 : 신규 , 5 : 삭제"
                    createData.IDatum = "/Date(" + common.Common.getTime(new Date()) + ")/";
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
                    createData.IPrevApply = "X";

                    Object.assign(detailData, saveData);
                    delete detailData.disyn;
                    delete detailData.actMode;
                    delete detailData.Auth;
                    delete detailData.Idx;
                    delete detailData.Openf;
                    delete detailData.Period;

                    detailData.Pernr = oController.getView().getModel("session").getData().Pernr;
                    detailData.Begda = detailData.Begda ? "/Date(" + common.Common.getTime(new Date(detailData.Begda)) + ")/" : "/Date(" + common.Common.getTime(new Date()) + ")/";
                    detailData.Endda = detailData.Endda ? "/Date(" + common.Common.getTime(new Date(detailData.Endda)) + ")/" : "/Date(" + common.Common.getTime(new Date(9999, 11, 31)) + ")/";
                    detailData.Zrotc = detailData.Zrotc == true ? "X" : null;
                    createData.TableIn.push(detailData);

                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_RECORD_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
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

                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    if (appType == "D") {
                        Message = oController.getBundleText("MSG_37036"); // 삭제 요청하였습니다.
                    } else {
                        Message = oController.getBundleText("MSG_37034"); // 수정/등록 요청하였습니다.
                    }

                    sap.m.MessageBox.alert(Message, {
                        title: oController.getBundleText("LABEL_00149"),
                        onClose: function () {
                            // Data setting
                            oController._MilitaryJSonModel.setProperty("/Data", {});
                            oController.onPressSearchMilitary(oController.getView().getModel("session").getData().Pernr);
                        }
                    });
                };

                var CreateProcess = function (fVal) {
                    if (fVal && fVal == sap.m.MessageBox.Action.YES) {
                        oController._BusyDialog.open();
                        setTimeout(create, 100);
                    }
                };

                if (appType == "D") {
                    Message = oController.getBundleText("MSG_37033"); // 삭제 신청하시겠습니까?
                } else {
                    Message = oController.getBundleText("MSG_37035"); // 수정/등록 신청하시겠습니까?
                }
                sap.m.MessageBox.confirm(Message, {
                    title: oController.getBundleText("LABEL_02053"), // 확인
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: CreateProcess
                });
            },

            onSaveLicense: function (actMode) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController();
                var Message;
                var saveData = oController._LicenseJSonModel.getProperty("/Data");
                var vOData = oController.onValidationData(oController, saveData, "A5");
                if (!vOData || vOData == "") return;

                var create = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };
                    var detailData = {};

                    oPath = "/PerRecordLicenseSet";
                    createData.IPernr = oController.getView().getModel("session").getData().Pernr;
                    createData.IConType = actMode; //"2 : 수정, 3 : 신규 , 4 : 삭제"
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
                    createData.IPrevApply = "X";

                    Object.assign(detailData, saveData);
                    delete detailData.disyn;
                    delete detailData.actMode;
                    delete detailData.Auth;
                    delete detailData.Idx;
                    delete detailData.Openf;
                    delete detailData.Period;

                    detailData.Pernr = oController.getView().getModel("session").getData().Pernr;
                    detailData.Begda = detailData.Begda ? "/Date(" + common.Common.getTime(new Date(detailData.Begda)) + ")/" : null; // 등록일
                    detailData.Endda = detailData.Endda ? "/Date(" + common.Common.getTime(new Date(detailData.Endda)) + ")/" : null; // 등록일
                    detailData.GetDate = detailData.GetDate ? "/Date(" + common.Common.getTime(new Date(detailData.GetDate)) + ")/" : null; //취득일

                    if (actMode != "4") {
                        if (AttachFileAction.getFileLength(oController) > 0) {
                            // 첨부파일 저장
                            detailData.Appnm = AttachFileAction.uploadFile.call(oController);
                            if (!detailData.Appnm) {
                                oController._BusyDialog.close();
                                return;
                            }
                        }
                    }

                    createData.TableIn.push(detailData);
                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_RECORD_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
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

                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    if (actMode == "4") {
                        Message = oController.getBundleText("MSG_37036"); // 삭제 요청하였습니다.
                    } else {
                        Message = oController.getBundleText("MSG_37034"); // 수정/등록 요청하였습니다.
                    }

                    sap.m.MessageBox.alert(Message, {
                        title: oController.getBundleText("LABEL_00149"),
                        onClose: function () {
                            oController._LicenseDialog.close();
                            // Data setting
                            oController._LicenseJSonModel.setProperty("/Data", {});
                            oController.onPressSearchLicense(oController.getView().getModel("session").getData().Pernr);
                        }
                    });
                };

                var CreateProcess = function (fVal) {
                    if (fVal && fVal == sap.m.MessageBox.Action.YES) {
                        oController._BusyDialog.open();
                        setTimeout(create, 100);
                    }
                };

                if (actMode == "4") {
                    Message = oController.getBundleText("MSG_37033"); // 삭제 신청하시겠습니까?
                } else {
                    Message = oController.getBundleText("MSG_37035"); // 수정/등록 신청하시겠습니까?
                }
                sap.m.MessageBox.confirm(Message, {
                    title: oController.getBundleText("LABEL_02053"), // 확인
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: CreateProcess
                });
            },

            onSaveCareer: function (actMode) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController();
                var Message;
                var saveData = oController._CareerJSonModel.getProperty("/Data");
                var vOData = oController.onValidationData(oController, saveData, "A6");
                if (!vOData || vOData == "") return;

                var create = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };
                    var detailData = {};

                    oPath = "/PerRecordCareerSet";
                    createData.IPernr = oController.getView().getModel("session").getData().Pernr;
                    createData.IConType = actMode; //"2 : 수정, 3 : 신규 , 4 : 삭제"
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
                    createData.IPrevApply = "X";

                    Object.assign(detailData, saveData);
                    delete detailData.disyn;
                    delete detailData.actMode;
                    delete detailData.Auth;
                    delete detailData.Idx;
                    delete detailData.Openf;
                    delete detailData.Period;

                    detailData.Pernr = oController.getView().getModel("session").getData().Pernr;
                    detailData.Begda = detailData.Begda ? "/Date(" + common.Common.getTime(new Date(detailData.Begda)) + ")/" : null; // 시작일자
                    detailData.Endda = detailData.Endda ? "/Date(" + common.Common.getTime(new Date(detailData.Endda)) + ")/" : null; // 종료일자
                    createData.TableIn.push(detailData);
                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_RECORD_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
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

                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    if (actMode == "4") {
                        Message = oController.getBundleText("MSG_37036"); // 삭제 요청하였습니다.
                    } else {
                        Message = oController.getBundleText("MSG_37034"); // 수정/등록 요청하였습니다.
                    }

                    sap.m.MessageBox.alert(Message, {
                        title: oController.getBundleText("LABEL_00149"),
                        onClose: function () {
                            oController._CareerDialog.close();
                            // Data setting
                            oController._CareerJSonModel.setProperty("/Data", {});
                            oController.onPressSearchCareer(oController.getView().getModel("session").getData().Pernr);
                        }
                    });
                };

                var CreateProcess = function (fVal) {
                    if (fVal && fVal == sap.m.MessageBox.Action.YES) {
                        oController._BusyDialog.open();
                        setTimeout(create, 100);
                    }
                };

                if (actMode == "4") {
                    Message = oController.getBundleText("MSG_37033"); // 삭제 신청하시겠습니까?
                } else {
                    Message = oController.getBundleText("MSG_37035"); // 수정/등록 신청하시겠습니까?
                }
                sap.m.MessageBox.confirm(Message, {
                    title: oController.getBundleText("LABEL_02053"), // 확인
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: CreateProcess
                });
            },

            onSaveAward: function (actMode) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController();
                var Message;

                var create = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };
                    var detailData = {};
                    var saveData = oController._AwardJSonModel.getProperty("/Data");

                    oPath = "/PerRecordAwardSet";
                    createData.IPernr = oController.getView().getModel("session").getData().Pernr;
                    createData.IConType = actMode; //"2 : 수정, 3 : 신규 , 4 : 삭제"
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
                    createData.IPrevApply = "X";

                    Object.assign(detailData, saveData);
                    delete detailData.disyn;
                    delete detailData.actMode;
                    delete detailData.Auth;
                    delete detailData.Idx;
                    delete detailData.Openf;

                    detailData.Pernr = oController.getView().getModel("session").getData().Pernr;
                    detailData.Begda = detailData.Begda ? "/Date(" + common.Common.getTime(new Date(detailData.Begda)) + ")/" : null; // 시작일자
                    detailData.Endda = detailData.Endda ? "/Date(" + common.Common.getTime(new Date(detailData.Endda)) + ")/" : null; // 종료일자
                    detailData.Paydt = detailData.Paydt ? "/Date(" + common.Common.getTime(new Date(detailData.Paydt)) + ")/" : null; // 지급일
                    createData.TableIn.push(detailData);
                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_RECORD_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
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

                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    if (actMode == "4") {
                        Message = oController.getBundleText("MSG_37036"); // 삭제 요청하였습니다.
                    } else {
                        Message = oController.getBundleText("MSG_37034"); // 수정/등록 요청하였습니다.
                    }

                    sap.m.MessageBox.alert(Message, {
                        title: oController.getBundleText("LABEL_00149"),
                        onClose: function () {
                            oController._AwardDialog.close();
                            // Data setting
                            oController._AwardJSonModel.setProperty("/Data", {});
                            oController.onPressSearchAward(oController.getView().getModel("session").getData().Pernr);
                        }
                    });
                };

                var CreateProcess = function (fVal) {
                    if (fVal && fVal == sap.m.MessageBox.Action.YES) {
                        oController._BusyDialog.open();
                        setTimeout(create, 100);
                    }
                };

                if (actMode == "4") {
                    Message = oController.getBundleText("MSG_37033"); // 삭제 신청하시겠습니까?
                } else {
                    Message = oController.getBundleText("MSG_37035"); // 수정/등록 신청하시겠습니까?
                }

                sap.m.MessageBox.confirm(Message, {
                    title: oController.getBundleText("LABEL_02053"), // 확인
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: CreateProcess
                });
            },

            onSaveHandicap: function (appType) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController();
                var Message;

                var create = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };
                    var detailData = {};
                    var saveData = oController._HandicapJSonModel.getProperty("/Data");

                    oPath = "/PerRecordHandicapSet";
                    createData.IPernr = oController.getView().getModel("session").getData().Pernr;
                    if (appType == "D") createData.IConType = "4";
                    else createData.IConType = saveData.actMode; //"2 : 수정, 3 : 신규 , 5 : 삭제"
                    createData.IDatum = "/Date(" + common.Common.getTime(new Date()) + ")/";
                    createData.IBukrs = oController.getView().getModel("session").getData().Bukrs2;
                    createData.IPrevApply = "X";

                    Object.assign(detailData, saveData);
                    delete detailData.disyn;
                    delete detailData.actMode;
                    delete detailData.Auth;
                    delete detailData.Idx;
                    delete detailData.Openf;

                    detailData.Pernr = oController.getView().getModel("session").getData().Pernr;
                    detailData.Begda = saveData.Begda ? "/Date(" + common.Common.getTime(new Date(saveData.Begda)) + ")/" : "/Date(" + common.Common.getTime(new Date()) + ")/";
                    detailData.Endda = saveData.Endda ? "/Date(" + common.Common.getTime(new Date(saveData.Endda)) + ")/" : "/Date(" + common.Common.getTime(new Date(9999, 11, 31)) + ")/";
                    detailData.Idate = saveData.Idate ? "/Date(" + common.Common.getTime(new Date(saveData.Idate)) + ")/" : null;
                    createData.TableIn.push(detailData);

                    var oModel = sap.ui.getCore().getModel("ZHR_PERS_RECORD_SRV");
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data, res) {
                            if (data) {
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

                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    if (appType == "D") {
                        Message = oController.getBundleText("MSG_37036"); // 삭제 요청하였습니다.
                    } else {
                        Message = oController.getBundleText("MSG_37034"); // 수정/등록 요청하였습니다.
                    }

                    sap.m.MessageBox.alert(Message, {
                        title: oController.getBundleText("LABEL_00149"),
                        onClose: function () {
                            // Data setting
                            oController._HandicapJSonModel.setProperty("/Data", {});
                            oController.onPressSearchHandicap(oController.getView().getModel("session").getData().Pernr);
                        }
                    });
                };

                var CreateProcess = function (fVal) {
                    if (fVal && fVal == sap.m.MessageBox.Action.YES) {
                        oController._BusyDialog.open();
                        setTimeout(create, 100);
                    }
                };

                if (appType == "D") {
                    Message = oController.getBundleText("MSG_37033"); // 삭제 신청하시겠습니까?
                } else {
                    Message = oController.getBundleText("MSG_37035"); // 수정/등록 신청하시겠습니까?
                }
                sap.m.MessageBox.confirm(Message, {
                    title: oController.getBundleText("LABEL_02053"), // 확인
                    actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    onClose: CreateProcess
                });
            },

            onChangeCountry: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController();
                var vData = oController._AddressJSonModel.getData(),
                    vState = [];
                Promise.all([
                    common.Common.getPromise(
                        function () {
                            $.app.getModel("ZHR_COMMON_SRV").create(
                                "/CommonCodeListHeaderSet",
                                {
                                    IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                    IMolga: oController.getView().getModel("session").getData().Molga,
                                    ILangu: oController.getView().getModel("session").getData().Langu,
                                    ICodeT: "010",
                                    ICodty: vData.Data.Land1,
                                    NavCommonCodeList: []
                                },
                                {
                                    async: false,
                                    success: function (data) {
                                        if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                            // for(var i=0; i<data.NavCommonCodeList.results.length; i++){
                                            // 	oState.addItem(new sap.ui.core.Item({key: data.NavCommonCodeList.results[i].Code, text:data.NavCommonCodeList.results[i].Text}));
                                            // }
                                            vState = data.NavCommonCodeList.results;
                                        }
                                        oController._AddressJSonModel.setProperty("/State", vState);
                                    },
                                    error: function (oResponse) {
                                        common.Common.log(oResponse);
                                        oController._AddressJSonModel.setProperty("/State", vState);
                                    }
                                }
                            );
                        }.bind(this)
                    )
                ]);
            },

            onChangeSlart: function (changeBelow) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController();
                var vData = oController._SchoolJSonModel.getData();
                vData.Ausbi = [];
                vData.Slabs = [];
                vData.Sltp = [];
                if (changeBelow == "N") {
                } else {
                    // 하위 필드 값 초기화
                    oController._SchoolJSonModel.setProperty("/Data/Ausbi", "");
                    oController._SchoolJSonModel.setProperty("/Data/Slabs", "");
                    oController._SchoolJSonModel.setProperty("/Data/Insti", "");
                    oController._SchoolJSonModel.setProperty("/Ausbi", []);
                    oController._SchoolJSonModel.setProperty("/Slabs", []);
                    oController._SchoolJSonModel.setProperty("/Sltp", []);
                    //
                    if (vData.Data.Slart == "H4" || vData.Data.Slart == "H5" || vData.Data.Slart == "H6") {
                    } else {
                        oController._SchoolJSonModel.setProperty("/Data/Majth", "");
                        oController._SchoolJSonModel.setProperty("/Data/Proff", "");
                        oController._SchoolJSonModel.setProperty("/Data/Degn1", "");
                        oController._SchoolJSonModel.setProperty("/Data/Degn2", "");
                        oController._SchoolJSonModel.setProperty("/Data/Degno", "");
                        oController._SchoolJSonModel.setProperty("/Data/Miny1", "");
                        oController._SchoolJSonModel.setProperty("/Data/Miny2", "");
                        oController._SchoolJSonModel.setProperty("/Data/Aprsn", "");
                    }
                }

                if (vData.Data.Slart && vData.Data.Slart != "") {
                    Promise.all([
                        Common.getPromise(
                            true,
                            function (resolve) {
                                $.app.getModel("ZHR_COMMON_SRV").create(
                                    "/CommonCodeListHeaderSet", //학교
                                    {
                                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                        IMolga: oController.getView().getModel("session").getData().Molga,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        ICodeT: "999",
                                        ICodty: "03",
                                        ICode: vData.Data.Slart,
                                        NavCommonCodeList: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                for (var i = 0; i < data.NavCommonCodeList.results.length; i++) {
                                                    vData.Ausbi.push(data.NavCommonCodeList.results[i]);
                                                }
                                            }
                                            oController._SchoolJSonModel.setData({ Ausbi: vData.Ausbi }, true);
                                            resolve();
                                        },
                                        error: function (oResponse) {
                                            oController._SchoolJSonModel.setData({ Ausbi: vData.Ausbi }, true);
                                            resolve();
                                            common.Common.log(oResponse);
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        Common.getPromise(
                            true,
                            function (resolve) {
                                $.app.getModel("ZHR_COMMON_SRV").create(
                                    "/CommonCodeListHeaderSet", //학위
                                    {
                                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                        IMolga: oController.getView().getModel("session").getData().Molga,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        ICodeT: "999",
                                        ICodty: "04",
                                        ICode: vData.Data.Slart,
                                        NavCommonCodeList: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                for (var i = 0; i < data.NavCommonCodeList.results.length; i++) {
                                                    vData.Slabs.push(data.NavCommonCodeList.results[i]);
                                                }
                                            }
                                            oController._SchoolJSonModel.setData({ Slabs: vData.Slabs }, true);
                                            resolve();
                                        },
                                        error: function (oResponse) {
                                            oController._SchoolJSonModel.setData({ Slabs: vData.Slabs }, true);
                                            resolve();
                                            common.Common.log(oResponse);
                                        }
                                    }
                                );
                            }.bind(this)
                        ),
                        Common.getPromise(
                            true,
                            function (resolve) {
                                $.app.getModel("ZHR_COMMON_SRV").create(
                                    "/CommonCodeListHeaderSet", //전공
                                    {
                                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                        IMolga: oController.getView().getModel("session").getData().Molga,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        ICodeT: "999",
                                        ICodty: "05",
                                        ICode: vData.Data.Slart,
                                        NavCommonCodeList: []
                                    },
                                    {
                                        async: true,
                                        success: function (data) {
                                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                for (var i = 0; i < data.NavCommonCodeList.results.length; i++) {
                                                    vData.Sltp.push(data.NavCommonCodeList.results[i]);
                                                }
                                            }
                                            oController._SchoolJSonModel.setData({ Sltp: vData.Sltp }, true);
                                            resolve();
                                        },
                                        error: function (oResponse) {
                                            oController._SchoolJSonModel.setData({ Sltp: vData.Sltp }, true);
                                            resolve();
                                            common.Common.log(oResponse);
                                        }
                                    }
                                );
                            }.bind(this)
                        )
                    ]).then(function () {
                        oController._SchoolDialog.open();
                    });
                }
            },

            onChangeLicnn: function (changeBelow) {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController();
                var vData = oController._LicenseJSonModel.getData();
                vData.Licnl = [];
                oController._LicenseJSonModel.setProperty("Licnl", []);
                if (changeBelow == "N") {
                } else {
                    // 하위 필드 값 초기화
                    oController._LicenseJSonModel.setProperty("/Data/Licnl", "");
                }
                if (vData.Data.Licnn && vData.Data.Licnn != "") {
                    Promise.all([
                        common.Common.getPromise(
                            function () {
                                $.app.getModel("ZHR_COMMON_SRV").create(
                                    "/CommonCodeListHeaderSet", //자격등급
                                    {
                                        IBukrs: oController.getView().getModel("session").getData().Bukrs2,
                                        IMolga: oController.getView().getModel("session").getData().Molga,
                                        ILangu: oController.getView().getModel("session").getData().Langu,
                                        ICodeT: "999",
                                        ICodty: "08",
                                        ICode: vData.Data.Licnn,
                                        NavCommonCodeList: []
                                    },
                                    {
                                        async: false,
                                        success: function (data) {
                                            if (data.NavCommonCodeList && data.NavCommonCodeList.results) {
                                                for (var i = 0; i < data.NavCommonCodeList.results.length; i++) {
                                                    vData.Licnl.push(data.NavCommonCodeList.results[i]);
                                                }
                                            }
                                            oController._LicenseJSonModel.setProperty("/Licnl", vData.Licnl);
                                            oController._LicenseDialog.open();
                                        },
                                        error: function (oResponse) {
                                            oController._LicenseDialog.open();
                                            common.Common.log(oResponse);
                                        }
                                    }
                                );
                            }.bind(this)
                        )
                    ]);
                }
            },

            onValidationData: function (oController, checkData, type) {
                switch (type) {
                    case "A1": //기본인적사항
                        if (!checkData.Zzbdate || checkData.Zzbdate == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37003"));
                            return;
                        }
                        if (checkData.Zzclass === "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37004"));
                            return;
                        }
                        break;
                    case "A2": //주소정보
                        if (!checkData.Pstlz || checkData.Pstlz == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37006"));
                            return;
                        }
                        if (!checkData.State || checkData.State == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37007"));
                            return;
                        }
                        if (!checkData.Ort01 || checkData.Ort01 == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37008"));
                            return;
                        }
                        if (!checkData.Ort02 || checkData.Ort02 == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37009"));
                            return;
                        }
                        if (!checkData.Stras || checkData.Stras == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37010"));
                            return;
                        }
                        if (!checkData.Telnr || checkData.Telnr == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37011"));
                            return;
                        }
                        if (checkData.Subty == "3" && (!checkData.Usrid || checkData.Usrid == "")) {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37012"));
                            return;
                        }
                        break;
                    case "A3": //학력
                        if (!checkData.Begda || checkData.Begda == "" || !checkData.Endda || checkData.Endda == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37018"));
                            return;
                        }
                        if (!checkData.Slart || checkData.Slart == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37013"));
                            return;
                        }
                        if ((!checkData.Ausbi || checkData.Ausbi == "") && (!checkData.Insti || checkData.Insti == "")) {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37014"));
                            return;
                        }
                        if (checkData.actMode != "4" && (checkData.Subty == "H4" || checkData.Subty == "H5" || checkData.Subty == "H6") && (!checkData.Sltp1 || checkData.Sltp1 == "")) {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37015"));
                            return;
                        }
                        if (checkData.actMode != "4" && (checkData.Subty == "H4" || checkData.Subty == "H5" || checkData.Subty == "H6") && AttachFileAction.getFileLength(oController) < 1) {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_42027"));
                            return;
                        }
                        if (!checkData.Slabs || checkData.Slabs == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37016"));
                            return;
                        }
                        if (!checkData.Sland || checkData.Sland == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37017"));
                            return;
                        }
                        break;
                    case "A4": //병역
                        if (!checkData.Zzarmy || checkData.Zzarmy == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37019"));
                            return;
                        }
                        break;
                    case "A5": //자격사항
                        if (!checkData.Licnn || checkData.Licnn == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37020"));
                            return;
                        }
                        if (!checkData.OrgCode || checkData.OrgCode == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37021"));
                            return;
                        }
                        if (!checkData.GetDate || checkData.GetDate == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37022"));
                            return;
                        }
                        if (!checkData.LicnNum || checkData.LicnNum == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37023"));
                            return;
                        }
                        if (checkData.actMode != "4" && AttachFileAction.getFileLength(oController) < 1) {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_42027"));
                            return;
                        }
                        break;
                    case "A6": //경력사항
                        if (!checkData.Begda || checkData.Begda == "" || !checkData.Endda || checkData.Endda == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37024"));
                            return;
                        }
                        if (!checkData.Arbgb || checkData.Arbgb == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37025"));
                            return;
                        }
                        if (!checkData.Ort01 || checkData.Ort01 == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37026"));
                            return;
                        }
                        if (!checkData.Zzjob || checkData.Zzjob == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37027"));
                            return;
                        }
                        if (!checkData.Land1 || checkData.Land1 == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37017"));
                            return;
                        }
                        break;
                    case "A7": //포상
                        if (!checkData.Begda || checkData.Begda == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37028"));
                            return;
                        }
                        if (!checkData.Awdtp || checkData.Awdtp == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37029"));
                            return;
                        }
                        if (!checkData.Zzcause || checkData.Zzcause == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37030"));
                            return;
                        }
                        if (!checkData.Prins || checkData.Prins == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_37031"));
                            return;
                        }
                        if (!checkData.Appnm || checkData.Appnm == "") {
                            sap.m.MessageBox.error(oController.getBundleText("MSG_42027"));
                            return;
                        }
                        break;
                }
                return true;
            },

            refreshAttachFileList: function (oController) {
                var f1 = document.getElementById(oController.PAGEID + "_ATTACHFILE_BTN-fu_input-inner"),
                    oAttachbox = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHBOX"),
                    oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table"),
                    oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN"),
                    oModel = sap.ui.getCore().getModel("ZHR_COMMON_SRV"),
                    JSonModel = oAttachbox.getModel(),
                    vAttachFileDatas = JSonModel.getProperty("/Data"),
                    vAppnm = JSonModel.getProperty("/Settings/Appnm"),
                    Datas = { Data: [] };

                JSonModel.setProperty("/Settings/Length", 0);
                JSonModel.setProperty("/Data", []);
                if (f1) f1.setAttribute("value", "");

                oFileUploader.clear();
                oFileUploader.setValue("");
                oAttachFileList.removeSelections(true);
            },

            onESSelectPerson: function (data) {
                return !this.EmployeeSearchCallOwner ? this.OrgOfIndividualHandler.setSelectionTagets(data) : this.EmployeeSearchCallOwner.setSelectionTagets(data);
            },

            displayMultiOrgSearchDialog: function (oEvent) {
                return !$.app.getController().EmployeeSearchCallOwner ? $.app.getController().OrgOfIndividualHandler.openOrgSearchDialog(oEvent) : $.app.getController().EmployeeSearchCallOwner.openOrgSearchDialog(oEvent);
            },

            /////////////////////////////////////////////////////////////////////////////////////////////

            /////////////////////////////////////////////////////////////////////////////////////////////
            // 주소 검색을 위한 Functions
            /////////////////////////////////////////////////////////////////////////////////////////////
            _ODialogSearchZipcodeEvent: null,

            onDisplaySearchZipcodeDialog: function () {
                window.open("zip_search2.html?CBF=fn_SetAddr", "pop", "width=550,height=550, scrollbars=yes, resizable=yes");
            },

            beforeOpenZSDialog: function () {
                var oView = sap.ui.getCore().byId("ZUI5_HR_Perinfo.List"),
                    oController = oView.getController();
                var oZipcodeSearchField = sap.ui.getCore().byId(oController.PAGEID + "_ZipcodeSearchField");

                if (oZipcodeSearchField) oZipcodeSearchField.setValue("");
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      // return new JSONModelHelper({name: "20001003"});
                      // return new JSONModelHelper({name: "20200317"});
                      return new JSONModelHelper({ name: "20140099" });
                      // return new JSONModelHelper({name: "35132261"});
                  }
                : null
        });
    }
);

// eslint-disable-next-line no-unused-vars
function fn_SetAddr(Zip, fullAddr, sido, sigungu) {
    var oController = $.app.getController("ZUI5_HR_Perinfo.List");
    var vData = oController._AddressJSonModel.getProperty("/Data");
    var oLand1 = $.app.byId(oController.PAGEID + "_Sub01_Land1"); // 국가
    var oState = $.app.byId(oController.PAGEID + "_Sub01_State"); // 지역
    var oPstlz = $.app.byId(oController.PAGEID + "_Sub01_Pstlz"); // 우편번호
    var oOrt01 = $.app.byId(oController.PAGEID + "_Sub01_Ort1k"); // 시/구/군
    var oOrt02 = $.app.byId(oController.PAGEID + "_Sub01_Ort2k"); // 동/읍/면
    var statesArr = {
        제주특별자치도: { key: "01", text: "제주도" }, // 제주도
        전북: { key: "02", text: "전라북도" }, // 전라북도
        전남: { key: "03", text: "전라남도" }, // 전라남도
        충북: { key: "04", text: "충청북도" }, // 충청북도
        충남: { key: "05", text: "충청남도" }, // 충청남도
        인천: { key: "06", text: "인천광역시" }, // 인천광역시
        강원: { key: "07", text: "강원도" }, // 강원도
        광주: { key: "08", text: "광주광역시" }, // 광주광역시
        경기: { key: "09", text: "경기도" }, // 경기도
        경북: { key: "10", text: "경상북도" }, // 경상북도
        경남: { key: "11", text: "경상남도" }, // 경상남도
        부산: { key: "12", text: "부산광역시" }, // 부산광역시
        서울: { key: "13", text: "서울특별시" }, // 서울특별시
        대구: { key: "14", text: "대구광역시" }, // 대구광역시
        대전: { key: "15", text: "대전광역시" }, // 대전광역시
        울산: { key: "16", text: "울산광역시" }, // 울산광역시
        세종특별자치시: { key: "22", text: "세종특별자치시" } // 세종특별자치시
    };

    // {세종특별자치시}는 sigungu가 없음. sido로 대체
    sigungu = sigungu || sido.substr(0, 2);

    if (statesArr[sido]) vData.State = statesArr[sido].key;
    vData.Land1 = "KR";
    vData.Pstlz = Zip;
    vData.Ort01 = sigungu;
    var Ort02 = "",
        vIdx = fullAddr.indexOf(sigungu);
    if (vIdx > -1) {
        Ort02 = fullAddr.substring(vIdx + sigungu.length + 1);
    }
    vData.Ort02 = Ort02;
    oController._AddressJSonModel.setProperty("/Data", vData);
}
