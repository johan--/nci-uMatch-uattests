@rules_p1
Feature: Ensure the rules are fired correctly and patients are assigned to the right treatment arm

  Scenario: PA_01: Matching inclusion gene fusion variant and inclusion disease - Assign to TA
    Given  the patient assignment json "patient_json_with_matching_inclusion_variant_inclusion_disease"
    And treatment arm json "Rules-Test1"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "SELECTED" for treatment arm "Rules-Test1"


  Scenario: PA_02: Matching inclusion gene fusion variant but does not match inclusion disease - Do not assign
    Given  the patient assignment json "patient_json_with_matching_inclusion_variant_and_not_inclusion_disease"
    And treatment arm json "Rules-Test1"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "NO_TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "RECORD_BASED_EXCLUSION" for treatment arm "Rules-Test1"


  Scenario: PA_03: Matching inclusion disease but does not match inclusion variant - Do not assign
    Given  the patient assignment json "patient_json_with_non_matching_inclusion_variant_matching_inclusion_disease"
    And treatment arm json "Rules-Test1"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "NO_TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "NO_VARIANT_MATCH_EXCLUSION" for treatment arm "Rules-Test1"


  Scenario: PA_04: Matching inclusion variant but treatment arm does not contain inclusion disease - Assign
    Given  the patient assignment json "patient_json_with_matching_inclusion_variant_inclusion_disease"
    And treatment arm json "Rules-Test1b"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "SELECTED" for treatment arm "Rules-Test1b"


  Scenario: PA_05: Matching exclusion variant - Don't assign to TA
    Given  the patient assignment json "patient_json_with_matching_exclusion_variant_inclusion_disease"
    And treatment arm json "Rules-Test2"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "NO_TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "RECORD_BASED_EXCLUSION" for treatment arm "Rules-Test2"


  Scenario: PA_06: Matching non-hotspot rule - oncomine variant class
    Given  the patient assignment json "patient_json_with_matching_non-hotspot-rules"
    And treatment arm json "Rules-Test3"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "SELECTED" for treatment arm "Rules-Test3"


  Scenario: PA_07: Matching non-hotspot rule - function
    Given  the patient assignment json "patient_json_with_matching_non-hotspot-rules_function-match"
    And treatment arm json "Rules-Test4"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "SELECTED" for treatment arm "Rules-Test4"


  Scenario: PA_08: Matching non-hotspot rule - gene and exon
    Given  the patient assignment json "patient_json_with_matching_non-hotspot-rules_gene-exon-match"
    And treatment arm json "Rules-Test5"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "SELECTED" for treatment arm "Rules-Test5"


  Scenario: PA_09: Matching exclusion disease - Do not assign
    Given  the patient assignment json "patient_json_with_matching_inclusion_variant_exclusion_disease"
    And treatment arm json "Rules-Test1"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "NO_TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "RECORD_BASED_EXCLUSION" for treatment arm "Rules-Test1"


  Scenario: PA_10: Matching exclusion drugs - Do not Assign
    Given  the patient assignment json "patient_json_with_matching_inclusion_variant_inclusion_disease_and_exclusion_drugs"
    And treatment arm json "Rules-Test1"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "NO_TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "RECORD_BASED_EXCLUSION" for treatment arm "Rules-Test1"


  Scenario: PA_11: Matching inclusion and exclusion variant on the same treatment arm - Do not assign
    Given  the patient assignment json "patient_json_with_matching_inclusion_and_exclusion_variant_inclusion_disease"
    And treatment arm json "Rules-Test2"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "NO_TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "RECORD_BASED_EXCLUSION" for treatment arm "Rules-Test2"
#--------------------------------------------------------------------------------------------------------------------------------------------
#  !!!!!!!!!!!!The patient ecosystem will only send confirmed variants to the rules ecosystem. Therefore, this test is invalid.!!!!!!!!!!!!
#  Scenario: Matching unconfirmed inclusion variant - Do not assign
#    Given  the patient assignment json "patient_json_with_matching_unconfirmed_inclusion_variant_inclusion_disease"
#    And treatment arm json "Rules-Test1"
#    When assignPatient service is called for patient "PID-1234"
#    Then a patient assignment json is returned with report_status "NO_TREATMENT_FOUND"
#    Then a patient assignment json is returned with reason category "NO_VARIANT_MATCH_EXCLUSION" for treatment arm "Rules-Test1"
#--------------------------------------------------------------------------------------------------------------------------------------------

  Scenario: PA_12: IHC:POS, Variant:PRE, Assay Result:POS, Matching Variant - Assign
    Given  the patient assignment json "Patient_json_with_assay_result_POS_matching_variant"
    And treatment arm json "Rules-Test6"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "SELECTED" for treatment arm "Rules-Test6"


  Scenario: PA_13: IHC:NEG, Variant:PRE, Assay Result:NEG, Matching Variant - Assign
    Given  the patient assignment json "Patient_json_with_assay_result_NEG_matching_variant"
    And treatment arm json "Rules-Test7"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "SELECTED" for treatment arm "Rules-Test7"


  Scenario: PA_14: IHC:POS, Variant:EMP, Assay Result:POS, No Matching Variant - Assign
    Given  the patient assignment json "Patient_json_with_assay_result_POS_no_matching_variant"
    And treatment arm json "Rules-Test8"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "SELECTED" for treatment arm "Rules-Test8"


  Scenario: PA_15: IHC:POS, Variant:NEG, Assay Result:POS, Matching Variant - Do not Assign
    Given  the patient assignment json "Patient_json_with_assay_result_POS_matching_variant"
    And treatment arm json "Rules-Test9"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "NO_TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "RECORD_BASED_EXCLUSION" for treatment arm "Rules-Test9"


  Scenario: PA_16: IHC:POS, Variant:PRE, Assay Result:POS, No Matching Variant - Do not Assign
    Given  the patient assignment json "Patient_json_with_assay_result_POS_no_matching_variant"
    And treatment arm json "Rules-Test6"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "NO_TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "NO_VARIANT_MATCH_EXCLUSION" for treatment arm "Rules-Test6"


  Scenario: PA_17: IHC:POS, Variant:NEG, Assay Result:POS, No Matching Variant - Assign
    Given  the patient assignment json "Patient_json_with_assay_result_POS_no_matching_variant"
    And treatment arm json "Rules-Test9"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "SELECTED" for treatment arm "Rules-Test9"


  Scenario: PA_18: IHC:POS, Variant:EMP, Assay Result:POS, Matching Variant - Assign
    Given  the patient assignment json "Patient_json_with_assay_result_POS_matching_variant"
    And treatment arm json "Rules-Test8"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "SELECTED" for treatment arm "Rules-Test8"


  Scenario: PA_19: IHC:NEG, Variant:PRE, Assay Result:POS, Matching Variant - Assign
    Given  the patient assignment json "Patient_json_with_assay_result_POS_matching_variant"
    And treatment arm json "Rules-Test7"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "SELECTED" for treatment arm "Rules-Test7"


  Scenario: PA_20: IHC:POS, Variant:PRE, Assay Result:NEG, Matching Variant - Assign
    Given  the patient assignment json "Patient_json_with_assay_result_NEG_matching_variant"
    And treatment arm json "Rules-Test6"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "SELECTED" for treatment arm "Rules-Test6"


  Scenario: PA_21: IHC:POS, Variant:EMP, Assay Result:NEG, Matching variant - assign
    Given  the patient assignment json "Patient_json_with_assay_result_NEG_matching_variant"
    And treatment arm json "Rules-Test8"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "SELECTED" for treatment arm "Rules-Test8"


  Scenario: PA_22: Matching exclusion non-hotspot variants - Do not assign
    Given  the patient assignment json "patient_json_with_matching_non-hotspot-rules_gene-exon-match"
    And treatment arm json "Rules-Test10"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "NO_TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "RECORD_BASED_EXCLUSION" for treatment arm "Rules-Test10"


  Scenario: PA_23: Matching both inclusion and exclusion non-hotspot variants - Do not assign
    Given  the patient assignment json "Patient_json_matching_exclusion_non-hotspot_rule_and_inclusion_variant"
    And treatment arm json "Rules-Test11"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "NO_TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "RECORD_BASED_EXCLUSION" for treatment arm "Rules-Test11"


  Scenario: PA_24: Matching at least one exclusion non-hotspot variant - Do not assign
    Given  the patient assignment json "patient_json_with_matching_non-hotspot-rules_gene-exon-match"
    And treatment arm json "Rules-Test12"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "NO_TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "RECORD_BASED_EXCLUSION" for treatment arm "Rules-Test12"


  Scenario: PA_25: Matching on a closed TA puts the patient on compassionate care
    Given  the patient assignment json "patient_json_with_matching_inclusion_variant_inclusion_disease"
    And treatment arm json "Rules-Test1-CLOSED"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "COMPASSIONATE_CARE"


  Scenario: PA_26: Matching on a suspended TA puts the patient on compassionate care
    Given  the patient assignment json "patient_json_with_matching_inclusion_variant_inclusion_disease"
    And treatment arm json "Rules-Test1-SUSPENDED"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "COMPASSIONATE_CARE"


  Scenario: PA_27: Tie-breaker - Level of Evidence: the lower the value the greater the level of evidence tie-breaker  is applied to choose a treatment arm.
    Given  the patient assignment json "Patient_tie-breaker"
    And treatment arm json "tie-breaker_LOE_TA"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "LEVEL_OF_EVIDENCE_TIE_BREAKER_BASED_EXCLUSION" for treatment arm "TB_LOE_Rules-Test1a"
    Then a patient assignment json is returned with reason category "SELECTED" for treatment arm "TB_LOE_Rules-Test1b"


  Scenario: PA_28: Tie-breaker - lesser accrued arm tie-breaker is applied to choose a treatment arm
    Given  the patient assignment json "Patient_tie-breaker"
    And treatment arm json "tie-breaker_lowest-accural_TA"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "SMALLEST_ACCRUED_NUMBER_TIE_BREAKER" for treatment arm "TB_LOE_Rules-Test1b"
    Then a patient assignment json is returned with reason category "SELECTED" for treatment arm "TB_LOE_Rules-Test1a"


  Scenario: PA_29: Tie-breaker - maximum number of patients is not used to determine patient assignment to TA
    Given  the patient assignment json "Patient_tie-breaker"
    And treatment arm json "tie-breaker_maxNumPatients_TA"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "SMALLEST_ACCRUED_NUMBER_TIE_BREAKER" for treatment arm "TB_LOE_Rules-Test1b"
    Then a patient assignment json is returned with reason category "SELECTED" for treatment arm "TB_LOE_Rules-Test1a"


  Scenario: PA_30: Tie-breaker - Allele frequency tie-breaker is applied to choose a treatment arm.
    Given  the patient assignment json "Patient_AF_tie-breaker"
    And treatment arm json "tie-breaker_AF_TA"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"
    Then a patient assignment json is returned with reason category "ALLELE_FREQUENCY_TIE_BREAKER" for treatment arm "TB_LOE_Rules-Test1a"
    Then a patient assignment json is returned with reason category "SELECTED" for treatment arm "TB_LOE_Rules-Test1b"


  Scenario: PA_31: Tie-breaker - Randomizer is applied to a choose a treatment arm
    Given  the patient assignment json "Patient_tie-breaker"
    And treatment arm json "tie-breaker_Randomizer_TA"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "TREATMENT_FOUND"

  Scenario: PA_32: The rules engine should not select the treatment arm for the patient if patient has already taken the arm.
    Given  the patient assignment json "patient_json_with_matching_inclusion_variant_to_prior_treatment_arm"
    And treatment arm json "Rules-Test1"
    When assignPatient service is called for patient "PID-1234"
    Then a patient assignment json is returned with report_status "NO_TREATMENT_FOUND"
    Then the patient assignment reason is "A match was found for prior treatment arm Rules-Test1 (100)."






