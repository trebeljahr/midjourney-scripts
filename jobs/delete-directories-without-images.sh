#!/bin/bash

# Check if the correct number of arguments are provided
if [ $# -ne 1 ]; then
  echo "Usage: $0 <directory>"
  exit 1
fi

# Directory to search in
dir="$1"

# Find all directories recursively and check if they have a PNG file in them
find "$dir" -type d | while read -r dir_path; do
  if [ -z "$(find "$dir_path" -type f -name '*.png' -print -quit)" ]; then
    echo "Deleting directory $dir_path"
    rm -rf "$dir_path"
  fi
done

echo "Deleted all directories without PNG files in $dir"