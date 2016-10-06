# ENV['DOCKER_HOSTNAME'] = 'pedmatch-int.nci.nih.gov'
# ENV['patient_api_PORT'] = '10240'
# ENV['patient_processor_PORT'] = '3010'
# ENV['treatment_arm_api_PORT'] = '10235'
# ENV['cog_mock_PORT'] = '3000'
# ENV['protocol'] = 'http'
# ENV['rules_PORT'] = '10250'
# ENV['PATIENT_ASSIGNMENT_JSON_LOCATION'] = '../../../../public'



ENV['rules_endpoint'] = 'https://pedmatch-int.nci.nih.gov/api/v1/rules'
ENV['patients_endpoint'] = 'https://pedmatch-int.nci.nih.gov/api/v1/patients'
ENV['treatment_arm_endpoint'] = 'https://pedmatch-int.nci.nih.gov'
ENV['cog_mock_endpoint'] = 'http://pedmatch-int.nci.nih.gov:3000'
ENV['ion_system_endpoint'] = 'https://pedmatch-int.nci.nih.gov/api/v1'
ENV['s3_bucket'] = 'pedmatch-int'

ENV['PATIENT_ASSIGNMENT_JSON_LOCATION'] = '../../../../public/patient_jsons_for_assignment_report_tests'
ENV['TAs_ASSIGNMENT_JSON_LOCATION'] = '../../../../public/TAs_for_assignment_report_tests'
ENV['rules_treatment_arm_location'] = '../../../../public/TAs_for_amoi_tests'