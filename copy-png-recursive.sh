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

# Initialize file counter
counter=1

# Find all PNG files recursively and copy them to the destination directory with new names
find "$src_dir" -iname '*.png' -type f | while read -r file; do
  new_filename=$(printf "%04d.png" $counter)
  cp "$file" "$dest_dir/$new_filename"
  echo "Copied $file to $dest_dir/$new_filename"
  ((counter++))
done

echo "PNG files copied from $src_dir to $dest_dir"
