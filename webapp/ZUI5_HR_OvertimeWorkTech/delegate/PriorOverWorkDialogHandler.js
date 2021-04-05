sap.ui.define([
	"common/Common",
    "./OvertimeWork",
    "./ODataService",
	"sap/ui/model/json/JSONModel"
], function(Common, OvertimeWork, ODataService, JSONModel) {
"use strict";

    var Handler = {

        oController: null,
        oDialog: null,
        oModel: new JSONModel({ SearchConditions: {}, List: [] }),
        callback: null,

        // DialogHandler 호출 function
        get: function(oController, initData, callback) {

            this.oController = oController;
            this.callback = callback;

            this.oModel.setProperty("/Dtfmt", this.oController.getSessionInfoByKey("Dtfmt"));
            this.oModel.setProperty("/SearchConditions/Aftck",   OvertimeWork.PRIOR);   // 사전/사후
            this.oModel.setProperty("/SearchConditions/Pernr",   initData.Pernr || ""); // 사번
            this.oModel.setProperty("/SearchConditions/Datum",   initData.Datum || ""); // 일자
            this.oModel.setProperty("/SearchConditions/Begda",   initData.Begda || ""); // 검색 : 근무 시작일
            this.oModel.setProperty("/SearchConditions/Endda",   initData.Endda || ""); // 검색 : 근무 종료일

            oController.PriorOverWorkDialogHandler = this;

            return this;
        },

        // DialogHandler 호출 function
        getLoadingProperties: function() {

            return {
                id: "PriorOverWorkDialog",
                name: "ZUI5_HR_OvertimeWorkTech.fragment.priorOverWorkDialog",
                type: "JS",
                controller: this.oController
            };
        },

        // DialogHandler 호출 function
        getParentView: function() {

            return this.oController.getView();
        },

        // DialogHandler 호출 function
        getModel: function() {

            return this.oModel;
        },

        // DialogHandler 호출 function
        getDialog: function() {

            return this.oDialog;
        },

        // DialogHandler 호출 function
        setDialog: function(oDialog) {

            this.oDialog = oDialog;

            return this;
        },

        onBeforeOpen: function() {

            $.app.byViewId("PriorOverWorkTable").setBusy(true, 0);

            return Common.getPromise(function() {
                var results = ODataService.OvertimeWorkApplySet.call(
                    this.oController,
                    OvertimeWork.ProcessType.PRIOR,
                    this.oModel.getProperty("/SearchConditions")
                );

                this.oModel.setProperty("/List", results.OtWorkTab1.map(function(elem) {
                    return $.extend(true, elem, {
                        Otbetm: Common.timeFormatter(elem.Otbetm),
                        Otentm: Common.timeFormatter(elem.Otentm)
                    });
                }));
                $.app.byViewId("PriorOverWorkTable").setBusy(false);
            }.bind(this));
        },

        clickTableCell: function(oEvent) {

            var p = oEvent.getParameter("rowBindingContext").getProperty();
            return Common.getPromise(function () {
                if (this.callback) {
                    this.callback({
                        Otdat: p.Otdat,     // 근무일
                        Otbetm: p.Otbetm,   // 시작시간
                        Otentm: p.Otentm,   // 종료시간
                        Holick: p.Holick,   // 휴일여부,
                        Horex: p.Horex      // 신청사유
                    });
                }
            }.bind(this))
            .then(function () {
                this.oDialog.close();
            }.bind(this));
        }

    };

    return Handler;

});