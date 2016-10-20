/**
 * Created by vivek.ramani on 10/11/16.
 */

'use strict';
const assert = require('assert');
var fs = require('fs');
var utilities = require('../../support/utilities.js')
var json = require('json-update');
const chai = require('chai');
module.exports = function () {

    this.Given(/^a treatment arm json file "([^"]*)" with id "([^"]*)", stratum "([^"]*)" and version "([^"]*)" is submitted to treatment_arm service$/, function (fname, ta_id, stratum, version, callback) {
        // Write code here that turns the phrase above into concrete actions
        console.log(process.env.PWD);
        var jsonBody = fs.readFileSync("public/TAs/"+fname).toString();
        console.log(jsonBody);
        var  uri = process.env.TA_HOSTNAME+"/"+ta_id+"/"+stratum+"/"+version;
        utilities.postMethod(uri,jsonBody,function(response){
            var resp;
            resp = response;
            assert.equal(resp['message'],"Message has been processed successfully");
            callback();
        });
    });


    this.Then(/^the treatment_arm "([^"]*)" with stratum "([^"]*)" is created in MatchBox with status as "([^"]*)"$/, function (ta_id, stratum, status, callback) {
        var  uri = process.env.TA_HOSTNAME + '/' +ta_id+"/"+stratum;
        var respMsg;
        var resp;
        utilities.getMethod_with_retry(uri, function(response){
            respMsg = JSON.stringify(response);
            resp = JSON.parse(respMsg);
            assert.equal(resp[0]["treatment_arm_status"], status);
            callback();
        });
    });

    this.Given(/^patient registration message is received from COG with patient id "([^"]*)", and consumed by MATCHbox$/, function (patient_id, callback) {

        var patient_registration_message_json = JSON.parse(fs.readFileSync('public/patient/patient_registration_message.json', 'utf8'));
        patient_registration_message_json["patient_id"] = patient_id;


        var  uri = process.env.PATIENT_HOSTNAME + '/' + patient_id;

        utilities.postMethod(uri,patient_registration_message_json,function(response){
            var resp;
            resp = response;
            assert.equal(resp['message'],"Message has been processed successfully");

        });

        var uri = process.env.PATIENT_HOSTNAME + '?projections=[current_status]&patient_id='+patient_id;

        utilities.getMethod_with_retry(uri, function(response) {
            var respMsg;
            var resp;
            respMsg = JSON.stringify(response);
            resp = JSON.parse(respMsg);
            console.log(resp);
            assert.equal(resp[0]["current_status"], "REGISTRATION");
            callback();
        });
    });

    this.Given(/^tissue specimen received message is received from NCH with surgical event id "([^"]*)" for patient id "([^"]*)"$/, function (se_id, patient_id, callback) {
        // Write code here that turns the phrase above into concrete actions
        var tissue_specimen_received_json = JSON.parse(fs.readFileSync('public/patient/tissue_specimen_received_message.json', 'utf8'));

        tissue_specimen_received_json["specimen_received"]["patient_id"] = patient_id;
        tissue_specimen_received_json["specimen_received"]["surgical_event_id"] = se_id;

        var  uri = process.env.PATIENT_HOSTNAME + '/' +patient_id;

        console.log(tissue_specimen_received_json);
        utilities.postMethod(uri,tissue_specimen_received_json,function(response){
            var resp;
            resp = response;
            assert.equal(resp['message'],"Message has been processed successfully");
        });

        var uri = process.env.PATIENT_HOSTNAME + '/' +patient_id+'/specimens?projections=[surgical_event_id]';

        utilities.getMethod_with_retry(uri, function(response) {
            var respMsg;
            var resp;
            respMsg = JSON.stringify(response);
            resp = JSON.parse(respMsg);
            assert.equal(resp[0]["surgical_event_id"], se_id);

            var uri = process.env.PATIENT_HOSTNAME + '?projections=[current_status]&patient_id='+patient_id;
            utilities.getMethod_with_retry(uri, function(response) {
                var respMsg;
                var resp;
                respMsg = JSON.stringify(response);
                resp = JSON.parse(respMsg);
                assert.equal(resp[0]["current_status"], "TISSUE_SPECIMEN_RECEIVED");

            });

            callback();
        });


    });

    this.Given(/^tissue specimen shipped message is received from NCH with surgical event id "([^"]*)", molecular id "([^"]*)" for the patient "([^"]*)"$/, function (se_id, mol_id, patient_id, callback) {
        // Write code here that turns the phrase above into concrete actions
        var tissue_specimen_shipped_json = JSON.parse(fs.readFileSync('public/patient/tissue_specimen_shipped_message.json', 'utf8'));

        tissue_specimen_shipped_json["specimen_shipped"]["patient_id"] = patient_id;
        tissue_specimen_shipped_json["specimen_shipped"]["surgical_event_id"] = se_id;
        tissue_specimen_shipped_json["specimen_shipped"]["molecular_id"] = mol_id;

        var  uri = process.env.PATIENT_HOSTNAME + '/' + patient_id;

        console.log(tissue_specimen_shipped_json);
        utilities.postMethod(uri,tissue_specimen_shipped_json,function(response){
            var resp;
            resp = response;
            assert.equal(resp['message'],"Message has been processed successfully");
        });

        var uri = process.env.PATIENT_HOSTNAME + '/shipments?projections=[molecular_dna_id]&molecular_id='+mol_id;
        utilities.getMethod_with_retry(uri, function(response) {
            var respMsg;
            var resp;
            respMsg = JSON.stringify(response);
            resp = JSON.parse(respMsg);
            assert.equal(resp[0]["molecular_dna_id"], "00012D");

            var uri = process.env.PATIENT_HOSTNAME + '?projections=[current_status]&patient_id='+patient_id;
            utilities.getMethod_with_retry(uri, function(response) {
                var respMsg;
                var resp;
                respMsg = JSON.stringify(response);
                resp = JSON.parse(respMsg);
                assert.equal(resp[0]["current_status"], "TISSUE_NUCLEIC_ACID_SHIPPED");
            });
            callback();
        });
    });

    this.Given(/^slide shipment message is received from NCH with surgical event id "([^"]*)", slide barcode "([^"]*)" for the patient "([^"]*)"$/, function (se_id, slide_code, patient_id, callback) {
        // Write code here that turns the phrase above into concrete actions
        var slide_shipped_json = JSON.parse(fs.readFileSync('public/patient/slide_shipment_message.json', 'utf8'));

        slide_shipped_json["specimen_shipped"]["patient_id"] = patient_id;
        slide_shipped_json["specimen_shipped"]["surgical_event_id"] = se_id;
        slide_shipped_json["specimen_shipped"]["slide_barcode"] = slide_code;

        var  uri = process.env.PATIENT_HOSTNAME +'/'+ patient_id;

        console.log(slide_shipped_json);
        utilities.postMethod(uri,slide_shipped_json,function(response){
            var resp;
            resp = response;
            assert.equal(resp['message'],"Message has been processed successfully");
        });

        var uri = process.env.PATIENT_HOSTNAME + '/shipments?projections=[slide_barcode]&slide_barcode='+slide_code;
        utilities.getMethod_with_retry(uri, function(response) {
            var respMsg;
            var resp;
            respMsg = JSON.stringify(response);
            resp = JSON.parse(respMsg);
            assert.equal(resp[0]["slide_barcode"], slide_code);

            var uri = process.env.PATIENT_HOSTNAME + '?projections=[current_status]&patient_id='+patient_id;
            utilities.getMethod_with_retry(uri, function(response) {
                var respMsg;
                var resp;
                respMsg = JSON.stringify(response);
                resp = JSON.parse(respMsg);
                assert.equal(resp[0]["current_status"], "TISSUE_SLIDE_SPECIMEN_SHIPPED");
            });
            callback();
        });
    });


    this.Given(/^assay message is received from MDA with biomarker "([^"]*)", surgical event id "([^"]*)" and result "([^"]*)" for the patient "([^"]*)"$/, function (biomarker, se_id, result, patient_id, callback) {
        // Write code here that turns the phrase above into concrete actions
        var assay_message_json = JSON.parse(fs.readFileSync('public/patient/assay_message.json', 'utf8'));

        assay_message_json["patient_id"] = patient_id;
        assay_message_json["surgical_event_id"] = se_id;
        assay_message_json["result"] = result;
        assay_message_json["biomarker"] = biomarker;

        var  uri = process.env.PATIENT_HOSTNAME + '/'+ patient_id;

        console.log(assay_message_json);
        utilities.postMethod(uri,assay_message_json,function(response){
            var resp;
            resp = response;
            assert.equal(resp['message'],"Message has been processed successfully");
        });

        var uri = process.env.PATIENT_HOSTNAME + '/'+patient_id+'/specimens?projections=[assays]&surgical_event_id='+se_id;
        utilities.getMethod_with_retry(uri, function(response) {
            var respMsg;
            var resp;
            var assays;
            respMsg = JSON.stringify(response);
            resp = JSON.parse(respMsg);
            assays = JSON.stringify(resp[0]);
            var assayJson = JSON.parse(assays);

            console.log(assayJson['assays'][0]['biomarker']);
            chai.assert.include(["ICCPTENs","ICCMLH1s"],assayJson['assays'][0]['biomarker'], "array contains value");

            var uri = process.env.PATIENT_HOSTNAME + '?projections=[current_status]&patient_id='+patient_id;
            utilities.getMethod_with_retry(uri, function(response) {
                var respMsg;
                var resp;
                respMsg = JSON.stringify(response);
                resp = JSON.parse(respMsg);
                assert.equal(resp[0]["current_status"], "ASSAY_RESULTS_RECEIVED");
            });
            callback();
        });
    });


    this.Given(/^pathology reviewed message is received with status "([^"]*)", surgical event id "([^"]*)" for the patient "([^"]*)"$/, function (path_status, se_id, patient_id, callback) {
        // Write code here that turns the phrase above into concrete actions
        var pathology_message_json = JSON.parse(fs.readFileSync('public/patient/pathology_reviewed_message.json', 'utf8'));

        pathology_message_json["patient_id"] = patient_id;
        pathology_message_json["surgical_event_id"] = se_id;
        pathology_message_json["status"] = path_status;

        var  uri = process.env.PATIENT_HOSTNAME + '/' +patient_id;

        console.log(pathology_message_json);
        utilities.postMethod(uri,pathology_message_json,function(response){
            var resp;
            resp = response;
            assert.equal(resp['message'],"Message has been processed successfully");
        });

        var uri = process.env.PATIENT_HOSTNAME + '/' +patient_id+'/specimens?projections=[pathology_status]&surgical_event_id='+se_id;
        utilities.getMethod_with_retry(uri, function(response) {
            var respMsg;
            var resp;

            respMsg = JSON.stringify(response);
            resp = JSON.parse(respMsg);

            console.log(resp[0]['pathology_status']);
            assert.equal(resp[0]["pathology_status"], path_status);

            var uri = process.env.PATIENT_HOSTNAME + '?projections=[current_status]&patient_id='+patient_id;
            utilities.getMethod_with_retry(uri, function(response) {
                var respMsg;
                var resp;
                respMsg = JSON.stringify(response);
                resp = JSON.parse(respMsg);
                assert.equal(resp[0]["current_status"], "PATHOLOGY_REVIEWED");
            });
            callback();
        });
    });

    this.Given(/^ion report is received with ion report id "([^"]*)", molecular id "([^"]*)", analysis id "([^"]*)" and tsv filename "([^"]*)" for the patient "([^"]*)"$/, function (ion_id, molecular_id, analysis_id, vcfFile, patient_id, callback) {
        // Write code here that turns the phrase above into concrete actions
        var ion_reporter_upload_json = JSON.parse(fs.readFileSync('public/patient/ion_reporter_upload.json', 'utf8'));

        ion_reporter_upload_json["site"]=ion_id;
        ion_reporter_upload_json["molecular_id"] = molecular_id;
        ion_reporter_upload_json["ion_reporter_id"] = ion_id;
        ion_reporter_upload_json["analysis_id"] = analysis_id;
        ion_reporter_upload_json["vcf_name"] = ion_id+'/'+molecular_id+'/'+analysis_id+'/'+vcfFile;
        ion_reporter_upload_json["dna_bam_name"] = ion_id+'/'+molecular_id+'/'+analysis_id+'/'+"dna.bam"
        ion_reporter_upload_json["cdna_bam_name"] = ion_id+'/'+molecular_id+'/'+analysis_id+'/'+"cdna.bam"

        var  uri = process.env.IR_HOSTNAME +  "/aliquot/"+molecular_id;
        console.log(ion_reporter_upload_json);

        utilities.putMethod(uri,ion_reporter_upload_json,function(response){
            var resp;
            resp = response;
            assert.equal(resp['message'],"Item updated");
            callback();
        });
    });
};
