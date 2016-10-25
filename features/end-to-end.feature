#/**
#*
#* Created by vivek.ramani 10/11/16
#*/
Feature: End-to-End patient assignment process tests


  Scenario Outline: Assign a Patient to a Treatment Arm
    Given patient registration message is received from COG with patient id "<patient_id>", and consumed by MATCHbox
    And tissue specimen received message is received from NCH with surgical event id "<se_id>" for patient id "<patient_id>"
    And tissue specimen shipped message is received from NCH with surgical event id "<se_id>", molecular id "<mol_id>" for the patient "<patient_id>"
    And slide shipment message is received from NCH with surgical event id "<se_id>", slide barcode "<slide_code>" for the patient "<patient_id>"
    And assay message is received from MDA with biomarker "<PTEN>", surgical event id "<se_id>" and result "INDETERMINATE" for the patient "<patient_id>"
    And assay message is received from MDA with biomarker "<MLH1>", surgical event id "<se_id>" and result "INDETERMINATE" for the patient "<patient_id>"
    And pathology reviewed message is received with status "<path_status>", surgical event id "<se_id>" for the patient "<patient_id>"
    And ion report is received with ion report id "mda", molecular id "<mol_id>", analysis id "job1" and tsv filename "<vcfFile>" for the patient "<patient_id>"
    When a user navigates to the variant report for the patient "<patient_id>" and surgical event "<se_id>" on the UI and clicks "confirm" button
    Examples:
      | patient_id | se_id    | mol_id | slide_code | PTEN     | MLH1     | path_status | vcfFile    |
      | E2E-01     | event-01 | mol-01 | sb-01      | ICCPTENs | ICCMLH1s |Y            |E2E-01.vcf  |
