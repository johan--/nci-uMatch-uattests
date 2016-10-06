require 'HTTParty'

class TreatmentArmMessageLoader
  include HTTParty

  LOCAL_TREATMENT_ARM_DATA_FOLDER = File.expand_path(File.join(__FILE__, '..', 'local_treatment_arm_data'))
  LOCAL_DYNAMODB_URL = 'http://localhost:8000'
  LOCAL_TREATMENT_ARM_API_URL = 'http://localhost:10235/api/v1/treatment_arms'

  def self.load_treatment_arm_to_local(message_file, wait_time)
    message_file = File.basename(message_file, '.json')
    raise 'message file must be valid' if message_file.nil? || message_file.length == 0
    file = File.read("#{LOCAL_TREATMENT_ARM_DATA_FOLDER}/#{message_file}.json")

    message_list = JSON.parse(file)
    p "There are #{message_list.length} json messages in treatment arm json file. Processing..."

    all_items = 0
    failure = 0
    message_list.each do |message|
      all_items += 1
      if message.key?('sleep')
        p "Sleep for #{message['sleep']} seconds"
        sleep(message['sleep'].to_f)
      else
        ta_id = message['id']
        stratum = message['stratum_id']
        version = message['version']
        curl_cmd ="curl -k -X POST -H \"Content-Type: application/json\""
        curl_cmd = curl_cmd + " -H \"Accept: application/json\"  -d '" + message.to_json
        curl_cmd = curl_cmd + "' #{LOCAL_TREATMENT_ARM_API_URL}/#{ta_id}/#{stratum}/#{version}"
        output = `#{curl_cmd}`
        p "Output from running No.#{all_items} curl: #{output}"
        unless output.downcase.include?'success'
          p 'Failed'
          puts JSON.pretty_generate(message)
          failure += 1
        end
        sleep(wait_time)
      end
    end

    pass = all_items - failure
    puts "#{all_items} messages processed, #{pass} passed and #{failure} failed"
  end
end
