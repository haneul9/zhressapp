sap.ui.define(
    [
        "common/Common", //
        "common/CommonController",
        "common/JSONModelHelper"
    ],
    function (Common, CommonController, JSONModelHelper) {
        "use strict";

        var SUB_APP_ID = [$.app.CONTEXT_PATH, "SearchUser"].join($.app.getDeviceSuffix());

        return CommonController.extend(SUB_APP_ID, {
            PAGEID: "SearchUser",

            onInit: function () {
                this.setupView().getView().addEventDelegate(
                    {
                        onBeforeShow: this.onBeforeShow,
                        onAfterShow: this.onAfterShow
                    },
                    this
                );

                Common.log("onInit session", this.getView().getModel("session").getData());
            },

            onBeforeShow: function (oEvent) {
                if (oEvent && oEvent.data && typeof oEvent.data.isResvRefresh === "boolean") return;
            },

            onAfterShow: function () {},

            getLocalSessionModel: Common.isLOCAL()
                ? function () {
                      return new JSONModelHelper({ name: "35110041" });
                  }
                : null
        });
    }
);
