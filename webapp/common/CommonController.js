sap.ui.define([
	"./Common",
	"sap/base/util/UriParameters",
	"sap/ui/core/IconPool",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel"
], function (Common, UriParameters, IconPool, Controller, JSONModel, ResourceModel) {
    "use strict";

    if (window._init_sequence_logging) {
        $.app.log("common.CommonController definition.");
    }

    return Controller.extend("common.CommonController", {

        __alreadyInitialized: false,

        setupView: function () {

            if (window._init_sequence_logging) {
                $.app.log("common.CommonController.setupView called.");
            }

            if (this.__alreadyInitialized) {
                return this;
            }

            var sessionModel = this.retrieveSessionModel();

            this.getView()
                .addStyleClass($.app.getViewInitStyleClasses())
                .setModel(this.getI18nModel(), "i18n")
                .setModel(sessionModel, "session");

            // Registering to the icon pool
            IconPool.registerFont({
                fontFamily: "SAP-icons-TNT",
                fontURI: sap.ui.require.toUrl("sap/tnt/themes/base/fonts/")
            });
            IconPool.fontLoaded("SAP-icons-TNT");

            this.__alreadyInitialized = true;

            return this;
        },

        getI18nModel: function () {

            return new ResourceModel({
                bundleUrl: "i18n/i18n.properties",
                supportedLocales: [""],
                fallbackLocale: ""
            });
        },

        retrieveSessionModel: function () {
            if (window._init_sequence_logging) {
                $.app.log("common.CommonController.retrieveSessionModel called.");
            }

            var sfSessionModel = this.retrieveSFSessionModel(),
                sessionModelData = sfSessionModel.getData(),
				mLoginData = Common.retrieveLoginInfo(sessionModelData.name),
				traceInfo = Common.activeClientTrace({ async: false });

            // mLoginData.encryptedPernrByJava = Common.encryptByJava({ input: sessionModelData.name, async: false });
            mLoginData.Langu = Common.retrieveSFUserLocale(sessionModelData.name);
            if ($.isEmptyObject(traceInfo) === false) mLoginData.Ipadd = traceInfo.Ipadd.split(',')[0];

            // mLoginData.ADAuth = Common.activeDirectoryAuth({
            //     ad_user: sessionModelData.name,
            //     ad_password: "1",
            //     async: false
            // });

            sfSessionModel.setData($.extend(sessionModelData, mLoginData));

            return sfSessionModel;
        },

        retrieveSFSessionModel: function () {
            if (window._init_sequence_logging) {
                $.app.log("common.CommonController.retrieveSFSessionModel called.");
            }

            if (!Common.isPRD()) {
                var pernr = UriParameters.fromQuery(document.location.search).get("pernr");
                if (pernr) {
                    if (window._init_sequence_logging) {
                        $.app.log("common.CommonController.retrieveSFSessionModel pernr parameter.");
                    }
                    return new JSONModel({
                        name: pernr
                    });
                }
                if (typeof this.getLocalSessionModel === "function") {
                    if (window._init_sequence_logging) {
                        $.app.log("common.CommonController.retrieveSFSessionModel localSessionModel.");
                    }
                    return this.getLocalSessionModel();
                }
            }

            var sfSessionModel = new JSONModel()
                .attachRequestCompleted(function (oEvent) {
                    if (window._init_sequence_logging) {
                        $.app.log("common.CommonController.retrieveSFSessionModel attachRequestCompleted.");
                    }
                    if (oEvent.getParameter("success")) {
                        this.setData({
                            json: this.getJSON(),
                            status: "Success"
                        }, true);
                    } else {
                        var msg = oEvent.getParameter("errorObject").textStatus;
                        if (msg) {
                            this.setData("status", msg);
                        } else {
                            this.setData("status", "Unknown error retrieving user info");
                        }
                    }
                });

            sfSessionModel.loadData("/services/userapi/currentUser", null, false) // sync

            return sfSessionModel;
        },

        getSessionModel: function () {

            return this.getView().getModel("session");
        },

        getSessionInfoByKey: function (sessionKey) {

            return this.getSessionModel().getData()[sessionKey];
        },

        getBundleText: function (key, values) {

            var i18nModel = this.getView().getModel("i18n");
            if (!i18nModel) {
                i18nModel = this.getI18nModel();
                this.getView().setModel(i18nModel, "i18n");
            }

            return i18nModel.getResourceBundle().getText(key, values);
        }

    });

});