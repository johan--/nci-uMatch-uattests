#encoding: utf-8

Feature: MATCH-1: New Treatment Arm Message
  Receive new treatment arm from COG in JSON format
  Consume the message within MATCH.
Note: start treatment-arm-processor RAILS_ENV=test bundle exec shoryuken -R
      start treatment-arm-api RAILS_ENV=test rails s

  Scenario Outline: 1.1 Validate the message received from EA layer for new treatment arm request
    Given that a new treatment arm is received from COG with version: "<version>" study_id: "<study_id>" id: "<id>" name: "<name>" description: "<description>" target_id: "<target_id>" target_name: "<target_name>" gene: "<gene>" and with one drug: "<drug>" and with tastatus: "<tastatus>" and with stratum_id "<stratum_id>"
    And with variant report
	"""
    {
    "snv_indels" : [
      {
        "variant_type": "snp",
        "gene" : "ALK",
        "identifier" : "COSM1686998",
        "protein" : "p.L858",
        "level_of_evidence" : 2.0,
        "chromosome" : "1",
        "position" : "11184573",
        "ocp_reference" : "G",
        "ocp_alternative" : "A",
        "public_med_ids" : [
                  "23724913"
        ],
        "inclusion" : true,
        "arm_specific" : false
      }
    ],
    "copy_number_variants" : [],
    "gene_fusions" : [],
    "non_hotspot_rules" : []
	}
	"""
    When creating a new treatment arm using post request
    Then a message with Status "<Status>" and message "<message>" is returned:
    Examples:
      |version    |study_id   |id			|name				|description	            |target_id	|target_name		|gene			|drug												|Status			|message									|timestamp						|tastatus | stratum_id |
      |2016-05-27 |APEC1621   |TA_test1		|Afatinib			|covalent inhibitor 		|1234		|EGFR Pathway	|ALK			|1,Afatinib,Afatinib,angiokinase inhibitor			|SUCCESS		|Saved to datastore.						|2014-06-29 11:34:20.179 GMT	|OPEN	  | 1          |
      |2016-05-27 |APEC1621   |TA_test2		|Afatinib			|covalent inhibitor         |1234		|EGFR Pathway	|ALK			|1,Afatinib,Afatinib,angiokinase inhibitor;2,tylenol,tylenol,angiokinase inhibitor	|SUCCESS|Saved to datastore.|2014-06-29 11:34:20.179 GMT	|OPEN	  | 1          |
      |2016-05-27 |APEC1621   |				|Afatinib			|covalent inhibitor 		|1234		|EGFR Pathway	|ALK			|1,Afatinib,Afatinib,angiokinase inhibitor			|FAILURE		|id may not be empty						|2014-06-29 11:34:20.179 GMT	|OPEN	  | 1          |
      |2016-05-27 |APEC1621   |TA_test5		|Afatinib			|covalent inhibitor 		|1234		|EGFR Pathway	|ALK			|1,,Afatinib,angiokinase inhibitor					|FAILURE		|treatmentArmDrugs[0].name may not be empty	|2014-06-29 11:34:20.179 GMT	|OPEN	  | 1          |
      |2016-05-27 |APEC1621   |TA_test6		|Afatinib			|covalent inhibitor 		|1234		|EGFR Pathway	|ALK			|1,null,Afatinib,angiokinase inhibitor				|FAILURE		|treatmentArmDrugs[0].name may not be empty |2014-06-29 11:34:20.179 GMT	|OPEN	  | 1          |

  Scenario: 1.2 Update a treatment arm with a newer version
	Given that treatment arm is received from COG:
	"""
	{"study_id":"APEC1621",
	"id":"TA_test1",
	"stratum_id":"1",
	"version":"2016-05-28",
	"gene":"ALK",
	"description":"Afatinib",
	"name":"Afatinib",
	"target_id":1234,
	"target_name":"HGFR Pathway",
	"treatment_arm_drugs":[{"drugClass":"angiokinase inhibitor","description":"Afatinib","name":"Afatinib","drugId":"1"}],
	"geneFusions":[],
	"nonHotspotRules":[],
	"snv_indels":[
	  {
	  "variant_type": "snp",
	  "gene":"ALK",
	  "identifier":"COSM1686998",
	  "chromosome":"1.0",
	  "position":"11184573",
	  "level_of_evidence":2.0,
	  "ocp_reference":"G",
	  "ocp_alternative":"A",
	  "inclusion":true,
	  "public_med_ids":["23724913"],
	  "protein" : "p.L858R"
	  }
	],
	"copy_number_variants":[]
	}
	"""
	When creating a new treatment arm using post request
	Then a message with Status "SUCCESS" and message "Save to datastore." is returned:

  Scenario: 1.3 Return failure message when treatment arm version is missing or empty
	Given that treatment arm is received from COG:
	"""
	{"study_id":"APEC1621",
	"id":"NoVersion",
	"stratum_id":"1",
	"gene":"ALK",
	"description":"Afatinib",
	"name":"Afatinib",
	"target_id":1234,
	"target_name":"HGFR Pathway",
	"treatment_arm_drugs":[{"drugClass":"angiokinase inhibitor","description":"Afatinib","name":"Afatinib","drugId":"1"}],
	"snv_indels":[
	  {
	  "variant_type": "snp",
	  "gene":"ALK",
	  "identifier":"COSM1686998",
	  "protein" : "p.L858R",
	  "level_of_evidence":2.0,
	  "chromosome":"1",
	  "position":"11184573",
	  "ocp_alternative":"A",
	  "ocp_reference":"G",
	  "inclusion":true,
	  "public_med_ids":["23724913"]
	  }],
	"copy_number_variants":[]
	}
	"""
	When creating a new treatment arm using post request
    Then a failure response code of "404" is returned

  Scenario: 1.6 Verify that a treatment arm when created is assigned a status of OPEN
    Given that treatment arm is received from COG:
	"""
		{
		"study_id":"APEC1621",
	    "id" : "TA_test3",
	    "stratum_id":"1",
	    "name" : "ta_test3",
	    "target_id" : 1234,
	    "target_name" : "ALK",
	    "version":"2016-05-25",
	    "gene" : "ALK",
	    "treatment_arm_drugs" : [
	        {
	            "drugId" : "1234",
	            "name" : "Curcumin",
	            "description" : "Treats stomach tumors"
	        }
	    ],
	    "exclusion_drugs" : [
				{
					"drugId" : "0",
					"name" : "Crizotinib"
				},
				{
					"drugId" : "0",
					"name" : "Ceritinib"
				},
				{
					"drugId" : "0",
					"name" : "Alectinib"
				},
				{
					"drugId" : "0",
					"name" : "AP26113"
				}
	    ],
        "snv_indels" : [
            {
                "variant_type": "snp",
                "public_med_ids" : [
                    "23724913"
                ],
                "gene" : "ALK",
                "chromosome" : "1",
                "position" : "11184573",
                "identifier" : "ta_test3",
                "ocp_reference" : "G",
                "ocp_alternative" : "A",
                "description" : "some description",
                "readDepth" : "0",
                "rare" : false,
                "alleleFrequency" : 0,
                "level_of_evidence" : 2,
                "inclusion" : true
            }
        ],
        "copy_number_variants" : [],
        "gene_fusions" : [],
        "non_hotspot_rules" : []
	}
	"""
    When creating a new treatment arm using post request
    Then a message with Status "SUCCESS" and message "Saved to datastore." is returned:
    Then the treatment_arm_status field has a value "OPEN" for the ta "TA_test3"

  Scenario: 1.7 Reposting the same treatment arm should fail
    Given template treatment arm json with an id: "APEC1621-DUP-1", stratum_id: "STRATUM1" and version: "2016-01-01"
    When creating a new treatment arm using post request
    Then a success message is returned
    Then wait for processor to complete request in "10" seconds
    When creating a new treatment arm using post request
    Then a failure response code of "500" is returned
    And a failure message is returned which contains: "already exists in the DataBase. Ignoring"
    Then wait for processor to complete request in "10" seconds
    When retrieve treatment arms with id: "APEC1621-DUP-1" and stratum_id: "STRATUM1" from API
    Then should return "1" of the records

  Scenario: 1.8. Update Treatment Arm with same "version" value should not be taken
    Given template treatment arm json with an id: "APEC1621-VS10-1", stratum_id: "stratum100" and version: "2016-06-03"
    And set template treatment arm json field: "gene" to value: "EGFR" in type: "string"
    When creating a new treatment arm using post request
    Then a success message is returned
    Then wait for processor to complete request in "10" seconds
    Then set template treatment arm json field: "gene" to value: "xxyyyy" in type: "string"
    When creating a new treatment arm using post request
    Then a failure response code of "500" is returned
    And a failure message is returned which contains: "already exists in the DataBase. Ignoring"
    Then retrieve the posted treatment arm from API
    Then the returned treatment arm has value: "EGFR" in field: "gene"
