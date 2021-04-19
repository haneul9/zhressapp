sap.ui.define(
    [
        "common/EmpBasicInfoBox" //
    ],
    function (EmpBasicInfoBox) {
        "use strict";

        sap.ui.jsfragment("ZUI5_HR_Perinfo.fragment.Header", {
            /** Specifies the Controller belonging to this View.
             * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
             * @memberOf fragment.SelectMassn
             */
            createContent: function (oController) {
                var oEmpBasicInfoBox = new EmpBasicInfoBox(oController._HeaderJSonModel).addStyleClass("ml-10px mt-15px");

                return oEmpBasicInfoBox;
            }
        });
    }
);
