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
    And ion report is received with ion report id "mda", molecular id "<mol_id>", analysis id "job1" and tsv filename "<vcfFile>" for the patient "<patient_id>"
    When a user navigates to the variant report for the patient "<patient_id>" and surgical event "<se_id>" on the UI and clicks "confirm" button
    Then the patient status is changed to "PENDING_CONFIRMATION" for patient "<patient_id>"
    When a user navigates to the assignment report for the patient "<patient_id>" and analysis id "<analysis_id>" on the UI and clicks "confirm" button
    Then the patient status is changed to "PENDING_APPROVAL" for patient "<patient_id>"
    When COG sends a ON_TREATMENT_ARM message to MATCHBox for patient "<patient_id>" to treatment arm "<treatment_arm:stratum>"
    Then the patient status is changed to "ON_TREATMENT_ARM" for patient "<patient_id>"
    Then the user logs out of MATCHBox
    Examples:
      | patient_id | se_id    | mol_id | slide_code | PTEN     | MLH1     | vcfFile    | analysis_id | treatment_arm:stratum |
      | E2E-01     | event-01 | mol-01 | sb-01      | ICCPTENs | ICCMLH1s | E2E-01.vcf | job1        | APEC1621-A:100        |


  Scenario Outline: A treatment arm is choosen by MATCHBox, but COG sends a REQUEST ASSIGNMENT message
    Given patient registration message is received from COG with patient id "<patient_id>", and consumed by MATCHbox
    And tissue specimen received message is received from NCH with surgical event id "<se_id>" for patient id "<patient_id>"
    And tissue specimen shipped message is received from NCH with surgical event id "<se_id>", molecular id "<mol_id>" for the patient "<patient_id>"
    And slide shipment message is received from NCH with surgical event id "<se_id>", slide barcode "<slide_code>" for the patient "<patient_id>"
    And assay message is received from MDA with biomarker "<PTEN>", surgical event id "<se_id>" and result "INDETERMINATE" for the patient "<patient_id>"
    And assay message is received from MDA with biomarker "<MLH1>", surgical event id "<se_id>" and result "INDETERMINATE" for the patient "<patient_id>"
    And ion report is received with ion report id "mda", molecular id "<mol_id>", analysis id "<analysis_id>" and tsv filename "<vcfFile>" for the patient "<patient_id>"
    When a user navigates to the variant report for the patient "<patient_id>" and surgical event "<se_id>" on the UI and clicks "confirm" button
    Then the patient status is changed to "PENDING_CONFIRMATION" for patient "<patient_id>"
    When a user navigates to the assignment report for the patient "<patient_id>" and analysis id "<analysis_id>" on the UI and clicks "confirm" button
    Then the patient status is changed to "PENDING_APPROVAL" for patient "<patient_id>"
    When COG sends a REQUEST_ASSIGNMENT message to MATCHBox for patient "<patient_id>" with rebiopsy "N"
    Then the patient status is changed to "PENDING_CONFIRMATION" for patient "<patient_id>"
    When a user navigates to the assignment report for the patient "<patient_id>" and analysis id "<analysis_id>" on the UI and clicks "confirm" button
    Then the patient status is changed to "NO_TA_AVAILABLE" for patient "<patient_id>"
    When COG sends a REQUEST_NO_ASSIGNMENT message to MATCHBox for patient "<patient_id>"
    Then the patient status is changed to "REQUEST_NO_ASSIGNMENT" for patient "<patient_id>"
    Then the user logs out of MATCHBox
    Examples:
      | patient_id | se_id    | mol_id | slide_code | PTEN     | MLH1     | vcfFile    | analysis_id | treatment_arm:stratum |
      | E2E-02     | event-02 | mol-02 | sb-02      | ICCPTENs | ICCMLH1s | E2E-02.vcf | job2        | APEC1621-A:1          |


  Scenario Outline: Patient on a treatment arm receives a REQUEST ASSIGNMENT message from COG with rebiopsy flag set to N
    Given patient registration message is received from COG with patient id "<patient_id>", and consumed by MATCHbox
    And tissue specimen received message is received from NCH with surgical event id "<se_id>" for patient id "<patient_id>"
    And tissue specimen shipped message is received from NCH with surgical event id "<se_id>", molecular id "<mol_id>" for the patient "<patient_id>"
    And slide shipment message is received from NCH with surgical event id "<se_id>", slide barcode "<slide_code>" for the patient "<patient_id>"
    And assay message is received from MDA with biomarker "<PTEN>", surgical event id "<se_id>" and result "INDETERMINATE" for the patient "<patient_id>"
    And assay message is received from MDA with biomarker "<MLH1>", surgical event id "<se_id>" and result "INDETERMINATE" for the patient "<patient_id>"
    And ion report is received with ion report id "mda", molecular id "<mol_id>", analysis id "<analysis_id>" and tsv filename "<vcfFile>" for the patient "<patient_id>"
    When a user navigates to the variant report for the patient "<patient_id>" and surgical event "<se_id>" on the UI and clicks "confirm" button
    Then the patient status is changed to "PENDING_CONFIRMATION" for patient "<patient_id>"
    When a user navigates to the assignment report for the patient "<patient_id>" and analysis id "<analysis_id>" on the UI and clicks "confirm" button
    Then the patient status is changed to "PENDING_APPROVAL" for patient "<patient_id>"
    When COG sends a ON_TREATMENT_ARM message to MATCHBox for patient "<patient_id>" to treatment arm "<treatment_arm:stratum>"
    Then the patient status is changed to "ON_TREATMENT_ARM" for patient "<patient_id>"
    When COG sends a REQUEST_ASSIGNMENT message to MATCHBox for patient "<patient_id>" with rebiopsy "N"
    Then the patient status is changed to "PENDING_CONFIRMATION" for patient "<patient_id>"
    When a user navigates to the assignment report for the patient "<patient_id>" and analysis id "<analysis_id>" on the UI and clicks "confirm" button
    Then the patient status is changed to "NO_TA_AVAILABLE" for patient "<patient_id>"
    When COG sends a REQUEST_NO_ASSIGNMENT message to MATCHBox for patient "<patient_id>"
    Then the patient status is changed to "REQUEST_NO_ASSIGNMENT" for patient "<patient_id>"
    Then the user logs out of MATCHBox
    Examples:
      | patient_id | se_id    | mol_id | slide_code | PTEN     | MLH1     | vcfFile    | analysis_id | treatment_arm:stratum |
      | E2E-03     | event-03 | mol-03 | sb-03      | ICCPTENs | ICCMLH1s | E2E-03.vcf | job3        | APEC1621-A:1          |

#
#    Scenario Outline: Patient on a treatment arm receives a REQUEST ASSIGNMENT message from COG with rebiopsy flag set to Y
#
#    Scenario Outline: MATCHBox does not find a treatment arm for the patient


