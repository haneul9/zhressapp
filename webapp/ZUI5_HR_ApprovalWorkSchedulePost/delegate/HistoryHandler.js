/* eslint-disable no-undef */
/* eslint-disable no-empty */
sap.ui.define(
    [
        "common/Common", //
        "common/DialogHandler",
        "common/OrgOfIndividualHandler",
        "./WorkSchedule",
        "./ODataService",
		"sap/m/MessageBox",
        "sap/ui/core/BusyIndicator",
		"sap/ui/export/Spreadsheet",
        "sap/ui/model/json/JSONModel",
        "common/moment-with-locales"
    ],
    function (Common, DialogHandler, OrgOfIndividualHandler, WorkSchedule, ODataService, MessageBox, BusyIndicator, Spreadsheet, JSONModel) {
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
                    IsPossibleExcelButton: false,   // 엑셀 버튼 활성화 여부
                    SearchConditions: { // 검색조건
                        Bfchk: WorkSchedule.POST,
                        Pernr: "",
                        Orgeh: "",
                        EnameOrOrgehTxt: "",
                        Begda: null,
                        Endda: null,
                        Datum: null,
                        Apsta: null
                    },
                    Apstas: [],     // 진행상태
                    List: []
                });

                return this;
            },

            load: function () {
                var currDate = new Date();

                this.oModel.setProperty("/Dtfmt", this.oController.getSessionInfoByKey("Dtfmt"));
                this.oModel.setProperty("/SearchConditions/Begda", currDate);
                this.oModel.setProperty("/SearchConditions/Endda", currDate);
                this.oModel.setProperty("/SearchConditions/Datum", currDate);
                this.oModel.setProperty("/SearchConditions/Apsta", "ALL");
                this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", this.oController.getSessionInfoByKey("Stext"));
                this.oModel.setProperty("/SearchConditions/Orgeh", this.oController.getSessionInfoByKey("Orgeh"));

                // 진행상태 호출 : Apstas
                this.oModel.setProperty(
                    "/Apstas", 
                    ODataService.CommonCodeListHeaderSet.call(this.oController, {
                        IsContainsAll: true,
                        Pernr: this.oController.getSessionInfoByKey("Pernr"),
                        Bukrs: this.oController.getSessionInfoByKey("Bukrs"),
                        Molga: this.oController.getSessionInfoByKey("Molga"),
                        Langu: this.oController.getSessionInfoByKey("Langu"),
                        CodeT: WorkSchedule.Apsta.CodeT,
                        Codty: WorkSchedule.Apsta.Codty
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
                        this.toggleExcelBtn();
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
                var results = ODataService.OvertimeAppConfirmSet.call(
                    this.oController,
                    WorkSchedule.ProcessType.HISTORY,
                    this.oModel.getProperty("/SearchConditions")
                );

                this.oModel.setProperty("/IsSearch", true);
                this.oModel.setProperty(
                    "/List",
                    results.OtAppConfirmTab1.map(function(elem) {
                        return $.extend(true, elem, {
                            PlanTime: elem.Beguz ? "${start} ~ ${End}".interpolate(moment(elem.Beguz.ms).subtract(9, "hours").format("HH:mm"), moment(elem.Enduz.ms).subtract(9, "hours").format("HH:mm")) : "",
                            InoutTime: elem.Enttm ? "${start} ~ ${End}".interpolate(moment(elem.Enttm.ms).subtract(9, "hours").format("HH:mm"), moment(elem.Outtm.ms).subtract(9, "hours").format("HH:mm")) : "",
                            WorkTime: elem.Wkbuz ? "${start} ~ ${End}".interpolate(moment(elem.Wkbuz.ms).subtract(9, "hours").format("HH:mm"), moment(elem.Wkeuz.ms).subtract(9, "hours").format("HH:mm")) : "",
                            AddTime1: elem.Trbuz ? "${start} ~ ${End}".interpolate(moment(elem.Trbuz.ms).subtract(9, "hours").format("HH:mm"), moment(elem.Treuz.ms).subtract(9, "hours").format("HH:mm")) : "",
                            AddTime2: elem.Trbu1 ? "${start} ~ ${End}".interpolate(moment(elem.Trbu1.ms).subtract(9, "hours").format("HH:mm"), moment(elem.Treu1.ms).subtract(9, "hours").format("HH:mm")) : ""
                        });
                    })
                );

                $.app.byId("HistoryTable").setFirstVisibleRow(0);
                $.app.byId("HistoryTable").clearSelection();
                Common.adjustAutoVisibleRowCount.call($.app.byId("HistoryTable"));
            },

            toggleExcelBtn: function() {
                this.oModel.setProperty(
                    "/IsPossibleExcelButton",
                    this.oModel.getProperty("/List").length ? true : false
                );
            },

            pressExcelDownloadBtn: function() {
				var aTableDatas = this.oModel.getProperty("/List");

				if (!aTableDatas.length) {
					MessageBox.warning(this.oController.getBundleText("MSG_00023")); // 다운로드할 데이터가 없습니다.
					return;
				}

				new Spreadsheet({
					worker: false,
					dataSource: Common.convertListTimeToString(aTableDatas, "Otbet", "Otent"),
					workbook: {columns: this.aColumnModel},
					fileName: "${fileName}-${datetime}.xlsx".interpolate(this.oController.getBundleText("LABEL_55047"), sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}).format(new Date()))
				}).build();
            },

            /**
             * 목록에서 [공통]부서/사원 조직도 Dialog 호출
             */
            searchOrgehPernrByList: function() {
                this.searchOrgehPernr.call(this.oController, function(o) {
                    this.oModel.setProperty("/SearchConditions/Pernr", o.Otype === "P" ? o.Objid : "");
                    this.oModel.setProperty("/SearchConditions/Orgeh", o.Otype === "O" ? o.Objid : "");
                    this.oModel.setProperty("/SearchConditions/EnameOrOrgehTxt", o.Stext || "");
                }.bind(this));
            },

            /**
             * @brief [공통]부서/사원 조직도 Dialog 호출
             * 
             * @this {Handler}
             */
            searchOrgehPernr: function(callback) {
                setTimeout(function() {
                    var initData = {
                            Percod: this.getSessionInfoByKey("Percod"),
                            Bukrs: this.getSessionInfoByKey("Bukrs2"),
                            Langu: this.getSessionInfoByKey("Langu"),
                            Molga: this.getSessionInfoByKey("Molga"),
                            Datum: new Date(),
                            Mssty: "",
                        };
        
                    this.OrgOfIndividualHandler = OrgOfIndividualHandler.get(this, initData, callback);
                    DialogHandler.open(this.OrgOfIndividualHandler);
                }.bind(this), 0);
            }
        };

        return Handler;
    }
);
