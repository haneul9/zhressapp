sap.ui.define(
    [
        "common/Common", //
        "sap/m/MessageBox"
    ],
    function (Common, MessageBox) {
        "use strict";

        var ODataService = {
            HouseLoanRequestSet: function (processType, arg) {
                var results = {
                    Export: [],
                    TableIn1: [],
                    TableIn2: [],
                    TableIn3: [],
                    TableIn4: [],
                    TableIn5: []
                };

                $.app.getModel("ZHR_BENEFIT_SRV").create(
                    "/HouseLoanRequestSet",
                    {
                        IConType: processType,
                        IPernr: arg.Pernr ? arg.Pernr : undefined,
                        IBegda: arg.Begda ? moment(arg.Begda).hours(10).toDate() : undefined,
                        IEndda: arg.Endda ? moment(arg.Endda).hours(10).toDate() : undefined,
                        IStatus: arg.Status ? arg.Status : undefined,
                        ILangu: "KO",
                        IDatum: moment().hours(9).toDate(),
                        IEmpid: arg.Empid ? arg.Empid : undefined,
                        IExtryn: Common.isExternalIP() ? "X" : "",
                        Export: arg.Export ? arg.Export : [],
                        TableIn1: arg.TableIn1 ? arg.TableIn1 : [],
                        TableIn2: arg.TableIn2 ? arg.TableIn2 : [],
                        TableIn3: arg.TableIn3 ? arg.TableIn3 : [],
                        TableIn4: arg.TableIn4 ? arg.TableIn4 : [],
                        TableIn5: arg.TableIn5 ? arg.TableIn5 : []
                    },
                    {
                        success: function (data) {
                            if (data.Export) results.Export = data.Export.results;
                            if (data.TableIn1) results.TableIn1 = data.TableIn1.results;
                            if (data.TableIn2) results.TableIn2 = data.TableIn2.results;
                            if (data.TableIn3) results.TableIn3 = data.TableIn3.results;
                            if (data.TableIn4) results.TableIn4 = data.TableIn4.results;
                            if (data.TableIn5) results.TableIn5 = data.TableIn5.results;
                        },
                        error: function (res) {
                            Common.log(res);
                            if (arg.isErrorShow) {
                                var errData = Common.parseError(res);
                                if (errData.Error && errData.Error === "E") {
                                    MessageBox.error(errData.ErrorMessage, {
                                        title: this.getBundleText("LABEL_00149")
                                    });
                                }
                            }
                        }.bind(this)
                    }
                );

                return results;
            },

            HouseLoanRequestSetByProcess: function (processType, payload, success, error) {
                var oModel = $.app.getModel("ZHR_BENEFIT_SRV");

                oModel.create(
                    "/HouseLoanRequestSet",
                    {
                        IConType: processType,
                        IPernr: payload.Pernr ? payload.Pernr : undefined,
                        ILangu: "KO",
                        IDatum: moment(payload.Datum).hours(9).toDate(),
                        IExtryn: Common.isExternalIP() ? "X" : "",
                        Export: payload.Export ? payload.Export : [],
                        TableIn1: payload.TableIn1 ? payload.TableIn1 : [],
                        TableIn2: payload.TableIn2 ? payload.TableIn2 : [],
                        TableIn3: payload.TableIn3 ? payload.TableIn3 : [],
                        TableIn4: payload.TableIn4 ? payload.TableIn4 : [],
                        TableIn5: payload.TableIn5 ? payload.TableIn5 : []
                    },
                    {
                        success: function (data) {
                            if (typeof success === "function") success.call(null, data);
                        },
                        error: function (res) {
                            if (typeof error === "function") error.call(null, res);
                        }
                    }
                );
            }
        };

        return ODataService;
    }
);
