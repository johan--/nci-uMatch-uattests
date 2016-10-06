@demo_p1
Feature: api that provides access to patient data. This feature ensures the api is running

  Scenario Outline: Test to ensure that patient_api service is running
    When the patient service /version is called
    Then the version "<version>" is returned
    Examples:
      |version    |
      |0.0.1      |


  Scenario Outline: Test to ensure that patient_processor service is running
    When the patient processor service /version is called
    Then the version "<version>" is returned
    Examples:
      |version    |
      |0.0.1      |