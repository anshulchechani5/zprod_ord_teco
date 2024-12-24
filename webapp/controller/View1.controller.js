sap.ui.define([
    'sap/ui/core/library',
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    'sap/m/SearchField',
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (coreLibrary, Controller, UIComponent, JSONModel, SearchField, MessageBox) {
        "use strict";
        var ValueState = coreLibrary.ValueState;  // add 
        return Controller.extend("zproteco.zproductionorderteco.controller.View1", {
            onInit: function () {
                var oObject = {
                    "visible1":true,
                }
                var LabelNameChange = {
                    "TableData": "Teco"
                }
                this.getView().setModel(new JSONModel(oObject), "oVisibleObject")
                this.getView().setModel(new sap.ui.model.json.JSONModel(LabelNameChange), "oLabelChaneModel");
                this.getView().getModel('oLabelChaneModel').setProperty("/aLabelChange", "Teco");

                // For combo search help

                this.getView().setModel(new JSONModel(oObject), "oComboModel");
                this.getView().getModel('oComboModel').setProperty("/oComboModelData", []);

                
            },
            onChangeAction:function(){
                var value = this.getView().byId("idActionRadioBtnGroup").getSelectedButton().getText();

                if (value === "Internal" ) {
                    var LabelNameChange = {
                        "TableData": "Teco"
                    }
                    this.getView().setModel(new sap.ui.model.json.JSONModel(LabelNameChange), "oLabelChaneModel");
                    this.getView().getModel('oLabelChaneModel').setProperty("/aLabelChange", "Teco");
                    this.getView().getModel("oVisibleObject").setProperty("/visible1", true)
                } else {
                    var LabelNameChange = {
                        "TableData": "Save"
                    }
                    this.getView().setModel(new sap.ui.model.json.JSONModel(LabelNameChange), "oLabelChaneModel");
                    this.getView().getModel('oLabelChaneModel').setProperty("/aLabelChange", "Save");
                    this.getView().getModel("oVisibleObject").setProperty("/visible1", false)
                }
            },
            next:function(){
               
                
            },
            savedata1: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait"
                });
                oBusyDialog.open();

                var order = this.getView().byId("Proorder").getValue();
                var BeamNo = this.getView().byId("BeamNo").getValue();
                var Plant = this.getView().byId("Plant").getValue();
                var Vendorcode = this.getView().byId("combobox").getValue();
                var Proorder = this.getView().byId("Proorder").getValue();
                var beamgattingdate = this.getView().byId("beamgattingdate").getValue();
                var newdate1 =beamgattingdate;
                if (newdate1.length === 10) {
                    var yyyy = newdate1.slice(0, 4);
                    var mm = newdate1.slice(5, 7);
                    var dd = newdate1.slice(8, 10);
                    var dte8 =yyyy+mm+dd;
                }
                else if (newdate1.length === 9) {
                    var yyyy = newdate1.slice(0, 4);
                    var mm = newdate1.slice(5,7);
                    if(mm.slice(1,2) === '-'){
                        var mm = newdate1.slice(5, 6);
                        mm = "0" + mm;
                        var dd =newdate1.slice(7, 9);
                    }
                    else{
                        var mm = newdate1.slice(5,7);
                        var dd =newdate1.slice(8, 9);
                        dd = "0" + dd;
                    }
                    var dte8 =yyyy+mm+dd;
                }
                else if (newdate1.length === 8) {
                    var yyyy = newdate1.slice(0, 4);
                    var mm = newdate1.slice(5, 6);
                    mm = "0" + mm;
                    var dd = newdate1.slice(7, 8);
                    dd = "0" + dd;
                    var dte8 =yyyy+mm+dd;
                }

                beamgattingdate = dte8;

                var beamFalldate = this.getView().byId("beamFalldate").getValue();
                var newdate = beamFalldate;
                if (newdate.length === 10) {
                    var yyyy = newdate.slice(0, 4);
                    var mm = newdate.slice(5, 7);
                    var dd = newdate.slice(8, 10);
                    var dte8 =yyyy+mm+dd;
                }
                else if (newdate.length === 9) {
                    var yyyy = newdate.slice(0, 4);
                    var mm = newdate.slice(5,7);
                    if(mm.slice(1,2) === '-'){
                        var mm = newdate.slice(5, 6);
                        mm = "0" + mm;
                        var dd =newdate.slice(7, 9);
                    }
                    else{
                        var mm = newdate.slice(5,7);
                        var dd =newdate.slice(8, 9);
                        dd = "0" + dd;
                    }
                    var dte8 =yyyy+mm+dd;
                }
                else if (newdate.length === 8) {
                    var yyyy = newdate.slice(0, 4);
                    var mm = newdate.slice(5, 6);
                    mm = "0" + mm;
                    var dd = newdate.slice(7, 8);
                    dd = "0" + dd;
                    var dte8 =yyyy+mm+dd;
                }

                beamFalldate = dte8;

               
                var url = "/sap/bc/http/sap/ZTECO?";
    
                // var username = "nvlabap3";
                // var password = "Mike$1245";
                $.ajax({
                    url: url,
                    type: "post",
                    data: JSON.stringify({
                        BeamNo,
                        Plant,
                        Vendorcode,
                        Proorder,
                        beamgattingdate,
                        beamFalldate
                    }),
                    contentType: "application/json; charset=utf-8",
                    traditional: true,
                    success: function (result) {
                        var meta = result.slice(0, 5);
                        var k = result.slice(5, 80);
                        if (meta === "ERROR" || meta === "Error") {
                            MessageBox.error(k);
                        }
                        else {

                            if(order != ""){
                                oBusyDialog.close();
                                order = Number(order);
                                var navigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
                                navigationService.toExternal({
                                target: {semanticObject: "ProductionOrder", action: "change"},
                                params:{ProductionOrder:[order]} ,
                                });
                            }
                            else{
                                MessageBox.show(result, {
                                    onClose: function (oAction) {
                                        if (oAction === MessageBox.Action.OK) {
                                            window.location.reload();
                                        }
                                    }
                                });
                            }
                        }
                        oBusyDialog.close();
                    }.bind(this),
                    error: function (oresponse) {
                        MessageBox.show("Data Not Saved Successfully", {
                            title: "Warning!!!!!!",
                            icon: MessageBox.Icon.ERROR
                        });
                        oBusyDialog.close();
                    }
                });
            },


            // onCallingPartyCode:function()
            // {
            //     var oModel = this.getView().getModel();
            //     var oComboModel = this.getView().getModel("oComboModel");
            //     var oComboModelProperty = oComboModel.getProperty("/oComboModelData");

            //     var BeamNo = this.getView().byId("BeamNo").getValue();
            //     var Plant = this.getView().byId("Plant").getValue();
                
            //     var oFilter = new sap.ui.model.Filter("Beamno", "EQ", BeamNo)
            //     var oFilter1 = new sap.ui.model.Filter("Plant", "EQ", Plant)

            //     oModel.read("/Zsupplier", {
            //         filters: [oFilter, oFilter1],
            //         success: function (oresponse) {
            //             if (oresponse.results.length > 0) {

            //                 this.getView().getModel("oComboModel").setProperty("/oComboModelData", oresponse.results);
                         
            //             }
                      
            //         }.bind(this),
            //         error: function(oerr){

            //             return new MessageBox.error("Error : ", oerr);

            //         }.bind(this)
            //     })


            // }

            onCallingPartyCode: function () {
                var oModel = this.getView().getModel();
                var oComboModel = this.getView().getModel("oComboModel");
            
                var BeamNo = this.getView().byId("BeamNo").getValue();
                var Plant = this.getView().byId("Plant").getValue();
            
                var oFilter = new sap.ui.model.Filter("Batch", "EQ", BeamNo);
                var oFilter1 = new sap.ui.model.Filter("Plant", "EQ", Plant);
            
                oModel.read("/ZBEAM_SUPPLIER", {
                    filters: [oFilter, oFilter1],
                    success: function (oresponse) {
                        if (oresponse.results && oresponse.results.length >= 0) {
                            oComboModel.setProperty("/oComboModelData", oresponse.results);
                        } 
                        else
                         {
                            oComboModel.setProperty("/oComboModelData", []);
                            MessageBox.warning("No data found for the given filters.");
                        }
                    }.bind(this),
                    error: function (error) {
                        MessageBox.error("Error: " + (error.message || "An unknown error occurred."));
                    }
                });
            },

            handleChange: function (oEvent) {   
                var oValidatedComboBox = oEvent.getSource(),
                    sSelectedKey = oValidatedComboBox.getSelectedKey(),
                    sValue = oValidatedComboBox.getValue();


                if (!sSelectedKey && sValue) {
                    oValidatedComboBox.setValueState(ValueState.Error);
                    oValidatedComboBox.setValueStateText("Please enter a valid Party Code...!");
                } else {
                    oValidatedComboBox.setValueState(ValueState.None);
                }
            }


            
        });
    });
