sap.ui.define(
    [
        "common/Common", //
        "common/DialogHandler",
        "common/OrgOfIndividualHandler",
        "./SubstituteWork",
        "./ODataService",
        "sap/ui/core/BusyIndicator",
        "sap/ui/model/json/JSONModel"
    ],
    function (Common, DialogHandler, OrgOfIndividualHandler, SubstituteWork, ODataService, BusyIndicator, JSONModel) {
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
             * @param {object} oController
             */
            initialize: function (oController) {
                this.oController = oController;
                this.oModel.setData({
                    Dtfmt: "yyyy-MM-dd",
                    Bukrs: null,
                    Zflag: null,
                    Zfxck: null,
                    Auth: $.app.getAuth(),
                    IsSearch: false,
                    SearchConditions: {
                        Pernr: null,
                        Orgeh: null,
                        EnameOrOrgehTxt: null,
                        Begda: null,
                        Endda: null,
                        Tprog: null,
                        OrgDn: null
                    },
                    List: [],
                    Tprogs: []      // 근무조
                });

                return this;
            },

            load: function () {
                this.oModel.setProperty("/Dtfmt", this.oController.getSessionInfoByKey("Dtfmt"));
                this.oModel.setProperty("/Bukrs", this.oController.getSessionInfoByKey("Bukrs"));
                this.oModel.setProperty("/Zflag", this.oController.getSessionInfoByKey("Zflag"));
                this.oModel.setProperty("/Zfxck", this.oController.getSessionInfoByKey("Zfxck"));
                this.oModel.setProperty("/SearchConditions/Tprog", "ALL");
                this.oModel.setProperty("/SearchConditions/OrgDn", false);
                this.oModel.setProperty("/SearchConditions/Begda", new Date());
                this.oModel.setProperty("/SearchConditions/Endda", new Date());
                if($.app.getAuth() === $.app.Auth.MSS) {
                    this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", this.oController.getSessionInfoByKey("Stext"));
                    this.oModel.setProperty("/SearchConditions/Orgeh", this.oController.getSessionInfoByKey("Orgeh"));
                } else {
                    this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", this.oController.getSessionInfoByKey("Ename"));
                    this.oModel.setProperty("/SearchConditions/Pernr", this.oController.getSessionInfoByKey("name"));
                }

                this.oModel.setProperty(
                    "/Tprogs", 
                    ODataService.CommonCodeListHeaderSet.call(this.oController, {
                        IsContainsAll: true,
                        Pernr: this.oController.getSessionInfoByKey("name"),
                        Bukrs: this.oController.getSessionInfoByKey("Bukrs2"), 
                        CodeT: SubstituteWork.Tprog.CodeT,
                        Codty: SubstituteWork.Tprog.Codty
                    })
                );

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
                var results = ODataService.AlterWorkApplyHeaderSet.call(
                    this.oController, 
                    SubstituteWork.ProcessType.READ_STATUS, 
                    this.oModel.getProperty("/SearchConditions")
                );

                this.oModel.setProperty("/IsSearch", true);
                this.oModel.setProperty("/List", results);

                $.app.byId("StatusListTable").setFirstVisibleRow(0);
                Common.adjustAutoVisibleRowCount.call($.app.byId("StatusListTable"));
            },
            
            /**
             * 변경신청 버튼 event
             * 
             * @this {Handler}
             */
            pressChangeApprovalBtn: function() {
                this.openDetailDialog(this.getSelectedData());
                $.app.byId("StatusListTable").clearSelection();
            },

            getSelectedData: function() {
                var ret = [],
                    sIndexes = $.app.byId("StatusListTable").getSelectedIndices();

                if(!sIndexes.length) return [];

                // 선택한 대상 array
                ret = this.oModel.getProperty("/List").filter(function(elem, index) {
                    return sIndexes.indexOf(index) > -1;
                });

                // 중복제거
                ret = ret.filter(function(item, idx) {
                    return ret.findIndex(function(item2) { return item.Pernr === item2.Pernr; }) === idx;
                });

                return ret;
            },

            openDetailDialog: function(selectedList) {
                if (!this.oController.oDetailDialog) {
                    this.oController.oDetailDialog = sap.ui.jsfragment([$.app.CONTEXT_PATH, "Detail"].join(".fragment."), this.oController);
                    $.app.getView().addDependent(this.oController.oDetailDialog);
                }

                this.oController.getDetailHandler().setAppkey(null);
                this.oController.getDetailHandler().setList(selectedList.map(function(elem) {
                    delete elem.Tprog;
                    elem.Begda = new Date();
                    elem.Endda = new Date("9999-12-31");
                    elem.stateBegda = sap.ui.core.ValueState.None;
                    elem.stateTprog = sap.ui.core.ValueState.None;
                    elem.stateReqrs = sap.ui.core.ValueState.None;
                    
                    return elem;
                }));

                this.oController.oDetailDialog.open();
            },

            /**
             * @brief [공통]부서/사원 조직도 Dialog 호출
             * 
             * @this {Handler}
             */
            searchOrgehPernr: function() {
                setTimeout(function() {
                    var oModel = this.getStatusListHandler().Model(),
                        initData = {
                            Percod: this.getSessionInfoByKey("Percod"),
                            Bukrs: this.getSessionInfoByKey("Bukrs2"),
                            Langu: this.getSessionInfoByKey("Langu"),
                            Molga: this.getSessionInfoByKey("Molga"),
                            Datum: new Date(),
                            Mssty: ""
                        },
                        callback = function(o) {
                            oModel.setProperty("/SearchConditions/Pernr", o.Otype === "P" ? o.Objid : "");
                            oModel.setProperty("/SearchConditions/Orgeh", o.Otype === "O" ? o.Objid : "");
                            oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", o.Stext || "");
                        };
        
                    this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
                    DialogHandler.open(this.OrgOfIndividualHandler);
                }.bind(this), 0);
            }
        };

        return Handler;
    }
);
