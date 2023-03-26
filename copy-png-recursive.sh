#!/bin/bash

# Check if the correct number of arguments are provided
if [ $# -ne 2 ]; then
  echo "Usage: $0 <source_directory> <destination_directory>"
  exit 1
fi

# Source and destination directories
src_dir="$1"
dest_dir="$2"

# Create the destination directory if it doesn't exist
mkdir -p "$dest_dir"

# Find all JSON files recursively and process them
find "$src_dir" -iname '*.json' -type f | while read -r json_file; do
  # Get the corresponding PNG file path
  json_file_path=$(dirname "$json_file")

  image_url=$(jq -r '.image_paths[0]' "$json_file")
  image_filename=$(basename "$image_url")

  png_file="$json_file_path/$image_filename"

  echo "$png_file"
  
  # Check if the PNG file exists
  if [ -f "$png_file" ]; then
    # Extract the prompt from the JSON file
    prompt=$(jq -r '.prompt' "$json_file")
    number=$(jq -r '.id' "$json_file")
    
    # Replace spaces with underscores and remove special characters
    new_filename=$(echo "$prompt" | tr -cd '[:alnum:] _')
    new_filename="$new_filename-$image_filename"
    
    # Copy the PNG file to the destination directory with the new name
    cp "$png_file" "$dest_dir/$new_filename"
    echo "Copied $png_file to $dest_dir/$new_filename"
  else
    echo "Warning: PNG file not found for $json_file"
  fi
done

echo "PNG files copied from $src_dir to $dest_dir"