sap.ui.define(
    [
        "../../common/Common", //
        "./HRDoc" //
    ],
    function (Common, HRDoc) {
        "use strict";

        var ODataService = {
            HrDocumentsPersaSet: function () {
                var results = [{ Code: "ALL", Text: this.getBundleText("LABEL_00131") }];

                $.app.getModel("ZHR_HRDOC_SRV").read("/HrDocumentsPersaSet", {
                    async: false,
                    filters: null,
                    success: function (oData) {
                        if (oData && oData.results.length) results = results.concat(oData.results);
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });

                return results;
            },
            
            HrDocumentsTypeSet: function () {
                var results = [{ Hrdoc: "ALL", Hrdoctx: this.getBundleText("LABEL_00131") }];

                $.app.getModel("ZHR_HRDOC_SRV").read("/HrDocumentsTypeSet", {
                    async: false,
                    filters: null,
                    success: function (oData) {
                        if (oData && oData.results.length) results = results.concat(oData.results);
                    },
                    error: function (oResponse) {
                        Common.log(oResponse);
                    }
                });

                return results;
            },

            HrDocumentsHeaderSet: function (searchConditions) {
                var results = [];

                $.app.getModel("ZHR_HRDOC_SRV").create(
                    "/HrDocumentsHeaderSet",
                    {
                        IOdkey: "",
                        IActty: $.app.getAuth(),
                        IPernr: this.getSessionInfoByKey("name"),
                        ITmode: HRDoc.ProcessType.LIST,
                        IPersa: (searchConditions.Persa !== "ALL" && $.app.getAuth() == "H") ? searchConditions.Persa : undefined,
                        IHrdoc: (searchConditions.Hrdoc !== "ALL") ? searchConditions.Hrdoc : undefined,
                        IDoctl: searchConditions.Doctl ? searchConditions.Doctl : undefined,
                        IReqbeg: searchConditions.Reqbeg ? Common.adjustGMTOdataFormat(new Date(searchConditions.Reqbeg.setHours(9))) : undefined,
                        IReqend: searchConditions.Reqend ? Common.adjustGMTOdataFormat(new Date(searchConditions.Reqend.setHours(9))) : undefined,
                        HrDocumentsSet: []
                    },
                    {
                        success: function (data) {
                            if (data.HrDocumentsSet) results = data.HrDocumentsSet.results;
                        },
                        error: function (res) {
                            Common.log(res);
                        }
                    }
                );

                return results;
            },

            HrDocumentsDetailHeaderSet: function(data) {
                var results = {
                    HrDocumentsDetailOutlineSet: {},
                    HrDocumentsDetailSet: []
                };

                $.app.getModel("ZHR_HRDOC_SRV").create(
                    "/HrDocumentsDetailHeaderSet",
                    {
                        IOdkey: "",
                        IActty: $.app.getAuth(),
                        ITmode: HRDoc.ProcessType.DETAIL,
                        IPernr: this.getSessionInfoByKey("name"),
                        IHrdno: data.Hrdno,
                        HrDocumentsDetailOutlineSet: [],
                        HrDocumentsDetailSet: []
                    },
                    {
                        success: function (data) {
                            if (data.HrDocumentsDetailOutlineSet) results.HrDocumentsDetailOutlineSet = data.HrDocumentsDetailOutlineSet.results[0];
                            if (data.HrDocumentsDetailSet) results.HrDocumentsDetailSet = data.HrDocumentsDetailSet.results;
                        },
                        error: function (res) {
                            Common.log(res);
                        }
                    }
                );

                return results;
            },

            HrDocumentsDetailHeaderSetByProcess: function (contype, payload, success, error) {
                var oModel = $.app.getModel("ZHR_HRDOC_SRV");

                oModel.create(
                    "/HrDocumentsDetailHeaderSet",
                    {
                        IOdkey: "",
                        ITmode: contype,
                        IActty: $.app.getAuth(),
                        IPernr: this.getSessionInfoByKey("name"),
                        IHrdno: payload.Hrdno,
                        HrDocumentsDetailOutlineSet: payload.Summary,
                        HrDocumentsDetailSet: payload.List
                    },
                    {
                        success: function (data) {
                            if (typeof success === "function") success.call(null, data, contype);
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
