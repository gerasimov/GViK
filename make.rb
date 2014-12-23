
require "json"

File.open("manifest.json", "rb") do |manifest_file|
  manifest_hash = JSON.load( manifest_file )


  File.open("resource.txt", "w") do |output_file|
    output_file.write(JSON.pretty_generate( manifest_hash["web_accessible_resources"] ))
  end

end


