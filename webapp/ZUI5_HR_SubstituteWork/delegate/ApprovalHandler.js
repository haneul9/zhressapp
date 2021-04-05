sap.ui.define(
    [
        "common/Common", //
        "common/DialogHandler",
        "common/OrgOfIndividualHandler",
        "./SubstituteWork",
        "./ODataService",
        "sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, DialogHandler, OrgOfIndividualHandler, SubstituteWork, ODataService, MessageBox, BusyIndicator, JSONModel) {
        "use strict";

        var Handler = {
            oController: null,
            oModel: new JSONModel(),
            
            Model: function () {
                return this.oModel;
            },

            /**
             * @brief constructor
             * 	- 최초 생성시 호출
             * 
             * @this {Handler}
             *
             * @param {Tab.controller} oController
             */
            initialize: function (oController) {
                this.oController = oController;
                this.oModel.setData({
                    Dtfmt: "yyyy-MM-dd",
                    Auth: $.app.getAuth(),
                    IsSearch: false,
                    SearchConditions: {
                        Pernr: null,
                        Orgeh: null,
                        EnameOrOrgehTxt: null,
                        Tprog: null,
                        Begda: null,
                        Endda: null,
                        OrgDn: null,
                        Apstat: null
                    },
                    List: [],
                    Tprogs: [],     // 근무일정
                    ApprStats: []   // 결재상태
                });

                return this;
            },

            load: function () {
                this.oModel.setProperty("/Dtfmt", this.oController.getSessionInfoByKey("Dtfmt"));
                this.oModel.setProperty("/SearchConditions/Tprog", "ALL");  // 전체
                this.oModel.setProperty("/SearchConditions/Apstat", "0"); // 전체
                this.oModel.setProperty("/SearchConditions/OrgDn", false);
                this.oModel.setProperty("/SearchConditions/Begda", new Date(new Date().setDate(new Date().getDate() - 14)));
                this.oModel.setProperty("/SearchConditions/Endda", new Date(new Date().setDate(new Date().getDate() + 14)));
                if($.app.getAuth() === $.app.Auth.MSS) {
                    this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", this.oController.getSessionInfoByKey("Stext"));
                    this.oModel.setProperty("/SearchConditions/Orgeh", this.oController.getSessionInfoByKey("Orgeh"));
                } else {
                    this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", this.oController.getSessionInfoByKey("Ename"));
                    this.oModel.setProperty("/SearchConditions/Pernr", this.oController.getSessionInfoByKey("name"));
                }

                this.oModel.setProperty(
                    "/Tprogs",
                    this.oController.getStatusListHandler().Model().getProperty("/Tprogs").slice()
                );

                this.oModel.setProperty(
                    "/ApprStats", 
                    ODataService.CommonCodeListHeaderSet.call(this.oController, {
                        IsContainsAll: false,
                        CodeT: SubstituteWork.ApprStat.CodeT,
                        Codty: SubstituteWork.ApprStat.Codty
                    })
                );

                return this;
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
                var results = ODataService.AlterWorkApplyHeaderSet.call(
                    this.oController, 
                    SubstituteWork.ProcessType.READ_APPROVAL, 
                    this.oModel.getProperty("/SearchConditions")
                );

                this.oModel.setProperty("/IsSearch", true);
                this.oModel.setProperty("/List", results);

                $.app.byId("ApprovalTable").setFirstVisibleRow(0);
                Common.adjustAutoVisibleRowCount.call($.app.byId("ApprovalTable"));
            },

            pressRowAppkeyLink: function(oEvent) {
                this.openDetailDialog(oEvent.getSource().getText());
            },

            openDetailDialog: function(appkey) {
                if (!this.oController.oDetailDialog) {
                    this.oController.oDetailDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "Detail"].join(".fragment."), this.oController);
                    $.app.getView().addDependent(this.oController.oDetailDialog);
                }

                this.oController.getDetailHandler().setList([]);
                this.oController.getDetailHandler().setAppkey(appkey);

                this.oController.oDetailDialog.open();
            },

            /**
             * @brief [공통]부서/사원 조직도 Dialog 호출
             */
            searchOrgehPernr: function() {
                setTimeout(function() {
                    var oModel = this.getApprovalHandler().Model(),
                        initData = {
                            Percod: this.getSessionInfoByKey("Percod"),
                            Bukrs: this.getSessionInfoByKey("Bukrs2"),
                            Langu: this.getSessionInfoByKey("Langu"),
                            Molga: this.getSessionInfoByKey("Molga"),
                            Datum: new Date(),
                            Mssty: "",
                        },
                        callback = function(o) {
                            oModel.setProperty("/SearchConditions/Pernr", o.Otype === "P" ? o.Objid : "");
                            oModel.setProperty("/SearchConditions/Orgeh", o.Otype === "O" ? o.Objid : "");
                            oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", o.Stext || "");
                        };
        
                    this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
                    DialogHandler.open(this.OrgOfIndividualHandler);
                }.bind(this), 0);
            },

            getAppkeyLink: function(columnInfo, oController) {
                var ApprovalHandler = oController.ApprovalHandler;

				return new sap.m.Link({
					text: "{Appkey1}",
					textAlign: "Center",
					press: ApprovalHandler.pressRowAppkeyLink.bind(ApprovalHandler)
				}).addStyleClass("FontFamily");
			}

        };

        return Handler;
    }
);
