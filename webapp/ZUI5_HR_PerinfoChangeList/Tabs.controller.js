/* global moment:true */
sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, CommonController, JSONModel) {
        "use strict";

        return CommonController.extend($.app.APP_ID, {
            // 출장

            PAGEID: "ZUI5_HR_PerinfoChangeList",
            _ListCondJSonModel: new JSONModel(),
            _ListJSonModel: new JSONModel(),
            _DetailJSonModel: new JSONModel(),
            _DetailTableJSonModel: new JSONModel(),
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
                    IBegda = new Date(curDate.getFullYear(), curDate.getMonth(), 1),
                    IEndda = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate());

                oController._ListCondJSonModel.setProperty("/Data", { Begda: IBegda, Endda: IEndda, Apsta: "0", Dtfmt: oController.getView().getModel("session").getData().Dtfmt  });
                oController._ListJSonModel.setProperty("/Data", []);
                oController.onPressSearch();
            },

            onAfterShow: function () {},

            onPressSearch: function () {
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");

                var vCondiData = oController._ListCondJSonModel.getProperty("/Data");
                // var	dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern : oController.getView().getModel("session").getData().Dtfmt});
                var vData = { Data: [] };

                var search = function () {
                    var oPath = "";
                    var createData = { TableIn: [] };

                    oPath = "/PerinfoHistorySet";
                    createData.IBukrs = vCondiData.Burks && vCondiData.Burks != "" ? vCondiData.Burks : oController.getView().getModel("session").getData().Burks2;
                    createData.IPernr = oController.getView().getModel("session").getData().Pernr;
                    createData.ILangu = oController.getView().getModel("session").getData().Langu;
                    createData.IConType = "1";
                    createData.IApsta = vCondiData.Apsta == "0" ? "" : vCondiData.Apsta;
                    createData.IBegda = vCondiData.Begda && vCondiData.Begda != "" ? "/Date(" + Common.getTime(new Date(vCondiData.Begda)) + ")/" : null;
                    createData.IEndda = vCondiData.Endda && vCondiData.Endda != "" ? "/Date(" + Common.getTime(new Date(vCondiData.Endda)) + ")/" : null;

                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data) {
                            if (data) {
                                if (data.TableIn && data.TableIn.results.length > 0) {
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

                    oController._ListJSonModel.setProperty("/Data", vData.Data);
                    Common.adjustAutoVisibleRowCount.call($.app.byId(oController.PAGEID + "_Table"));
                    oController._BusyDialog.close();

                    if (oController.Error == "E") {
                        oController.Error = "";
                        sap.m.MessageBox.error(oController.ErrorMessage);
                        return;
                    }

                    $.app.byId(oController.PAGEID + "_Table").clearSelection();
                };

                oController._BusyDialog.open();
                setTimeout(search, 100);
            },

            onPressDetail: function () {
                var oView = $.app.getView();
                var oController = $.app.getController(),
                    vSelectedIndex = $.app.byId(oController.PAGEID + "_Table").getSelectedIndices(),
                    vSelectedData = $.app
                        .byId(oController.PAGEID + "_Table")
                        .getModel()
                        .getProperty("/Data/" + vSelectedIndex);

                if (!oController._DetailDialog) {
                    oController._DetailDialog = sap.ui.jsfragment("ZUI5_HR_PerinfoChangeList.fragment.DetailDialog", oController);
                    oView.addDependent(oController._DetailDialog);
                }
                oController._DetailJSonModel.setProperty("/Data", vSelectedData);
                oController.onSearchDetail(vSelectedData);
                oController._DetailDialog.open();
            },

            onSearchDetail: function (vSelectedData) {
                var oController = $.app.getController();
                var oModel = $.app.getModel("ZHR_PERS_INFO_SRV");

                var vCondiData = oController._ListCondJSonModel.getProperty("/Data");
                var vData = { Data: [] };

                var search = function () {
                    var oPath = "";
                    var createData = { TableIn2: [] };

                    oPath = "/PerinfoHistorySet";
                    createData.IBukrs = vCondiData.Burks && vCondiData.Burks != "" ? vCondiData.Burks : oController.getView().getModel("session").getData().Burks2;
                    createData.IPernr = oController.getView().getModel("session").getData().Pernr;
                    createData.ILangu = oController.getView().getModel("session").getData().Langu;
                    createData.IConType = "1";
                    createData.IApsta = vCondiData.Apsta == "0" ? "" : vCondiData.Apsta;
                    createData.IBegda = vCondiData.Begda && vCondiData.Begda != "" ? "/Date(" + Common.getTime(new Date(vCondiData.Begda)) + ")/" : null;
                    createData.IEndda = vCondiData.Endda && vCondiData.Endda != "" ? "/Date(" + Common.getTime(new Date(vCondiData.Endda)) + ")/" : null;
                    createData.IApppn = vSelectedData.Apppn;
                    oModel.create(
                        oPath,
                        createData,
                        null,
                        function (data) {
                            if (data) {
                                if (data.TableIn2 && data.TableIn2.results.length > 0) {
                                    for (var i = 0; i < data.TableIn2.results.length; i++) {
                                        data.TableIn2.results[i].Idx = i + 1;
                                        vData.Data.push(data.TableIn2.results[i]);
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

                    oController._DetailTableJSonModel.setData(vData);
                    $.app.byId(oController.PAGEID + "_DetailTable").setVisibleRowCount(vData.Data.length);
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

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModel({ name: "20140099" }); //
                      // return new JSONModel({name: "35132258"}); // 첨단
                      // return new JSONModel({name: "35132259"}); // 첨단
                      // return new JSONModel({name: "35132260"}); // 첨단
                      // return new JSONModel({name: "35132261"}); // 첨단
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
