
require "json"

File.open("manifest.json", "rb") do |manifest_file|
  manifest_hash = JSON.load( manifest_file )


  File.open("resource.txt", "w") do |output_file|

    js_list = manifest_hash["web_accessible_resources"].select {|file_name| File.extname(file_name ) == ".js"} .group_by {|file_name| File.dirname(file_name)  }

    puts "java -jar " + js_list.map {|key, val|
        val.map {|x|"-js #{x}" }.join(' ') + " -js_output_file build/#{key}"
    }.join('')

  end
end


