class PatientVariantFolderCreator
  TEMPLATE_ANI_FOLDER_PATH = "#{File.dirname(__FILE__)}/variant_file_templates/3366_moi/3366_ani"
  TEMPLATE_ANI_FOLDER_NAME = "3366_ani"
  ROOT_OUTPUT_FOLDER = "#{File.dirname(__FILE__)}/variant_file_templates/"
  @output_type = 'seed_data'

  def self.set_output_type(type)
    @output_type = type
  end

  def self.clear_all
    folder = ROOT_OUTPUT_FOLDER + 'seed_data'
    cmd = "rm -R #{folder}/*"
    `#{cmd}`
    folder = ROOT_OUTPUT_FOLDER + 'test_data'
    cmd = "rm -R #{folder}/*"
    `#{cmd}`
  end

  def self.create(moi, ani)
    output_folder = ROOT_OUTPUT_FOLDER + @output_type
    target_moi_folder = "#{output_folder}/#{moi}"
    target_ani_folder = "#{target_moi_folder}/#{ani}"
    if File.directory?(target_ani_folder)
      p "#{target_ani_folder} exists, skipping..."
      return
    end

    unless File.directory?(target_moi_folder)
      cmd = "mkdir #{target_moi_folder}"
      `#{cmd}`
    end
    cmd = "cp -R #{TEMPLATE_ANI_FOLDER_PATH} #{target_moi_folder}"
    `#{cmd}`
    cmd = "mv #{target_moi_folder}/#{TEMPLATE_ANI_FOLDER_NAME} #{target_ani_folder}"
    `#{cmd}`
    p "#{target_ani_folder} created!"
  end

  def self.create_default(patient_id, type)
    moi = case type
            when 'tissue' then '_MOI1'
            when 'blood' then '_BD_MOI1'
          end
    moi = patient_id + moi
    ani = patient_id + '_ANI1'

    create(moi, ani)
  end
end