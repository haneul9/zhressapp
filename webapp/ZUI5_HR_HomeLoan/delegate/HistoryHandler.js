/* eslint-disable no-undef */
/* eslint-disable no-empty */
sap.ui.define(
    [
        "common/Common", //
        "common/DialogHandler",
        "./HomeLoan",
        "./ODataService",
        "sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, DialogHandler, HomeLoan, ODataService, MessageBox, BusyIndicator, JSONModel) {
        "use strict";

        var Handler = {
            oController: null,
            oModel: new JSONModel(),

            oDetailDialog: null,
            aColumnModel: null,

            Model: function () {
                return this.oModel;
            },

            /**
             * @brief constructor
             * 	- 최초 생성시 호출
             *
             * @this {Handler}
             *
             * @param {object} oController
             */
            initialize: function (oController) {
                this.oController = oController;
                this.oModel.setData({
                    Dtfmt: "yyyy-MM-dd",
                    Auth: $.app.getAuth(),
                    IsSearch: false,
                    List: []
                });

                return this;
            },

            load: function () {
                this.oModel.setProperty("/Dtfmt", this.oController.getSessionInfoByKey("Dtfmt"));

                return this;
            },

            /**
             * @brief 검색
             *
             * @this {Handler}
             */
            search: function () {
                BusyIndicator.show(0);

                Common.getPromise(
                    function () {
                        this.loadTableData();
                    }.bind(this)
                ).then(function () {
                    BusyIndicator.hide();
                });
            },

            /**
             * @brief 목록 조회
             *
             * @this {Handler}
             */
            loadTableData: function () {
                var results = ODataService.HouseLoanRequestSet.call(this.oController, HomeLoan.ProcessType.HISTORY, {
                    Pernr: this.oController.getSessionInfoByKey("Pernr"),
                    Begda: moment().subtract(5, "years").hours(9).toDate(),
                    Endda: moment().hours(9).toDate(),
                    isErrorShow: false
                });

                this.oModel.setProperty("/IsSearch", true);
                this.oModel.setProperty(
                    "/List",
                    results.TableIn4.map(function (elem) {
                        return $.extend(true, elem, {
                            Zhlcat: elem.Zhlcat ? elem.Zhlcat : "0",
                            Zarpat: elem.Zarpat ? elem.Zarpat : "0",
                            Ztrpat: elem.Ztrpat ? elem.Ztrpat : "0",
                            Zhlbat: elem.Zhlbat ? elem.Zhlbat : "0"
                        });
                    })
                );

                $.app.byViewId("HistoryTable").setFirstVisibleRow(0);
                $.app.byViewId("HistoryTable").clearSelection();
                Common.adjustAutoVisibleRowCount.call($.app.byViewId("HistoryTable"));
            }
        };

        return Handler;
    }
);
