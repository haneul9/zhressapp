sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper",
        "common/SearchUserMobile"
    ],
    function (Common, CommonController, JSONModelHelper, SearchUserMobile) {
        "use strict";

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "FacilityDetail"].join($.app.getDeviceSuffix());

        return CommonController.extend(SUB_APP_ID, {
            PAGEID: "FacilityDetail",
            LoginSession: new sap.ui.model.json.JSONModel(),
            
            onInit: function () {
                this.setupView().getView().addEventDelegate(
                    {
                        onBeforeShow: this.onBeforeShow,
                        onAfterShow: this.onAfterShow
                    },
                    this
                );
            },

            onBeforeShow: function (oEvent) {
                // if(oEvent && oEvent.data && typeof oEvent.data.isResvRefresh === "boolean") return;
                if (oEvent && oEvent.data) {
                    this.LoginSession.setProperty("/Data", oEvent.data);
                    SearchUserMobile.oController = this;
                    SearchUserMobile.fPersaEnabled = false;
                    SearchUserMobile._vPersa = oEvent.data.Session.Persa;
                }
            },

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "35110041" });
                  }
                : null
        });
    }
);
