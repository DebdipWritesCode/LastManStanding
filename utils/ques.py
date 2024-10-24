import json
import os

# Define the file names and the output JavaScript variable names
levels = ["level1", "level2", "level3", "level4", "level5"]

def convert_json_to_js(levels, output_filename):
    with open(output_filename, 'w') as js_file:
        for level in levels:
            # Read each JSON file
            json_filename = f"{level}.json"
            if os.path.exists(json_filename):
                with open(json_filename, 'r') as json_file:
                    json_content = json.load(json_file)
                    
                    # Write the content to the JS file in the export const format
                    js_file.write(f"export const {level}Ques = {json.dumps(json_content, indent=4)};\n\n")
            else:
                print(f"Warning: {json_filename} not found!")

# Output JS file name
output_js_file = 'questions.js'

# Convert the JSON files to JS
convert_json_to_js(levels, output_js_file)

print(f"All levels have been combined into {output_js_file}")
