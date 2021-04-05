sap.ui.define(
    [
        "common/Common", //
        "common/DialogHandler",
        "common/EmployeeModel",
        "./OutLang",
        "./ODataService",
        "./DetailHandler",
        "sap/ui/core/BusyIndicator",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, DialogHandler, EmployeeModel, OutLang, ODataService, DetailHandler, BusyIndicator, JSONModel) {
        "use strict";

        var Handler = {
            oController: null,
            oModel: new JSONModel(),
            oChartDialog: null,
            EmployeeModel: new EmployeeModel(),
            
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

                this.EmployeeModel.retrieve(this.oController.getSessionInfoByKey("name"));

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
                var results = ODataService.LanguageApplySet.call(this.oController);

                this.oModel.setProperty("/List", results);

                $.app.byId("StatusListTable").setFirstVisibleRow(0);
                $.app.byId("StatusListTable").clearSelection();
                Common.adjustAutoVisibleRowCount.call($.app.byId("StatusListTable"));
            },

            /**
             * @brief 목록 row Click event handler
             * 
             * @param rowData
             */
            pressSelectRowDetail: function (rowData) {
                rowData.Tescd = rowData.Zltype;
                
                this.onPopDetail({
                    IsViewMode: true,
                    Info: rowData
                });
            },

            pressChart: function() {
                if (!this.oChartDialog) {
					this.oChartDialog = sap.ui.jsfragment("ZUI5_HR_OutLanguageScore.fragment.ScoreChart", this.oController);
					$.app.getView().addDependent(this.oChartDialog);
                }
                
                this.oChartDialog.open();
            },

            pressNew: function() {
                this.onPopDetail({
                    IsViewMode: false
                });
            },

            onPopDetail: function(initData) {
                setTimeout(function() {
                    this.oController.DetailHandler = DetailHandler.get(this.oController, initData);
                    DialogHandler.open(this.oController.DetailHandler);
                }.bind(this), 0);
            }
        };

        return Handler;
    }
);
