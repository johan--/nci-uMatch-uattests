#/**
#*
#* Created by vivek.ramani 10/11/16
#*/

Feature: Load treatment arms in to MATCHbox system

  Scenario Outline: Load Treatment Arms into Pediatric MATCHbox
    Given a treatment arm json file "<taFileName>" with id "<id>", stratum "<stratum>" and version "<version>" is submitted to treatment_arm service
    Then the treatment_arm "<id>" with stratum "<stratum>" is created in MatchBox with status as "<status>"
    Examples:
    |taFileName       |id               |stratum  |version    |status|
    |APEC1621-A.json  |APEC1621-A       |1        |2016-10-12 |OPEN  |
    |APEC1621-B.json  |APEC1621-B       |1        |2016-10-12 |OPEN  |
    |APEC1621-C.json  |APEC1621-C       |1        |2016-10-12 |OPEN  |




