/* eslint-disable no-undef */
sap.ui.define(
    [
        "../../common/Common", //
        "../../common/DialogHandler",
        "../../common/OrgOfIndividualHandler",
        "./ODataService",
        "sap/ui/core/BusyIndicator",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, DialogHandler, OrgOfIndividualHandler, ODataService, BusyIndicator, JSONModel) {
        "use strict";

        var PageHandler = {
            oController: null,
            oModel: new JSONModel(),

            Model: function () {
                return this.oModel;
            },

            /**
             * constructor
             * 	- 최초 생성시 호출
             *
             * @param {object} oController
             */
            initialize: function (oController) {
                this.oController = oController;
                this.oModel.setData({
                    Dtfmt: "yyyy-MM",
                    Auth: $.app.getAuth(),
                    isEditOrgtree: false,
                    SearchConditions: {
                        Pernr: null,
                        Orgeh: null,
                        EnameOrOrgehTxt: null,
                        Begda: null,
                        Endda: null,
                        Zlangu: null,
                        Zltype: null
                    },
                    Zlangus: [],
                    Zltypes: [],
                    List: []
                });

                return this;
            },

            load: function () {
                BusyIndicator.show(0);

                var currDate = new Date();

                Common.getPromise(
                    function () {
                        this.oModel.setProperty(
                            "/isEditOrgtree",
                            ($.app.getAuth() === $.app.Auth.MSS && this.oController.getSessionInfoByKey("Chief") !== "X")
                                    ? false : true
                        );
                        this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", this.oController.getSessionInfoByKey("Stext"));
                        this.oModel.setProperty("/SearchConditions/Orgeh", this.oController.getSessionInfoByKey("Orgeh"));
                        this.oModel.setProperty("/SearchConditions/Begda", new Date(currDate.getFullYear() - 1, currDate.getMonth(), 1));
                        this.oModel.setProperty("/SearchConditions/Endda", new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0));
                        this.oModel.setProperty("/SearchConditions/Zlangu", "ALL");
                        this.oModel.setProperty("/SearchConditions/Zltype", "ALL");

                        this.oModel.setProperty("/Zlangus", ODataService.LanguPayApplyF4ImportSet.call(this.oController, { Code: "1" }));
                        this.oModel.setProperty("/Zltypes", ODataService.LanguPayApplyF4ImportSet.call(this.oController, { Code: "2", Lang: "ALL" }));
                    }.bind(this)
                ).then(function () {
                    BusyIndicator.hide();
                });
            },

            /**
             * @brief 검색
             * 
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
             */
            loadTableData: function () {
                var results = ODataService.LanguPayApplySet.call(this.oController, this.oModel.getProperty("/SearchConditions"));

                this.oModel.setProperty("/List", results);

                Common.adjustViewHeightRowCount({
                    tableControl: $.app.getView().byId("Table"),
                    viewHeight: 68,
                    dataCount: results.length
                });
            },

            /**
             * 어학 comboBox 변경 event handler
             * 
             * @param {sap.ui.base.Event} oEvent
             */
            onChangeZlangu: function (oEvent) {
                this.oModel.setProperty("/SearchConditions/Zltype", "ALL");
                this.oModel.setProperty(
                    "/Zltypes",
                    ODataService.LanguPayApplyF4ImportSet.call(this.oController, {
                        Code: "2",
                        Lang: oEvent.getSource().getSelectedKey()
                    })
                );
            },

            /**
             * @brief [공통]부서/사원 조직도 Dialog 호출
             * 
             * @this {PageHandler}
             */
            searchOrgehPernr: function () {
                setTimeout(function () {
                    var oModel = this.getHandler().Model(),
                        initData = {
                            Percod: this.getSessionInfoByKey("Percod"),
                            Bukrs: this.getSessionInfoByKey("Bukrs2"),
                            Langu: this.getSessionInfoByKey("Langu"),
                            Molga: this.getSessionInfoByKey("Molga"),
                            Datum: new Date(),
                            Mssty: $.app.Auth.MSS,
                        },
                        callback = function (o) {
                            oModel.setProperty("/SearchConditions/Pernr", o.Otype === "P" ? o.Objid : "");
                            oModel.setProperty("/SearchConditions/Orgeh", o.Otype === "O" ? o.Objid : "");
                            oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", o.Stext || "");
                        };

                    this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
                    DialogHandler.open(this.OrgOfIndividualHandler);
                }.bind(this), 0);
            },

            getDateRangeText: function () {
                return new sap.ui.commons.TextView({
                    text: {
                        parts: [
                            { path: "Lecbe" }, //
                            { path: "Lecen" }
                        ],
                        formatter: function (v1, v2) {
                            return !v1 && !v2 
                                    ? "" 
                                    : [Common.DateFormatter(v1), Common.DateFormatter(v2)].join(" ~ ");
                        }
                    },
                    textAlign: "Center"
                }).addStyleClass("FontFamily");
            }
        };

        return PageHandler;
    }
);