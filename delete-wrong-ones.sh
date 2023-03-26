#!/bin/bash

# Check if the correct number of arguments are provided
if [ $# -ne 1 ]; then
  echo "Usage: $0 <directory>"
  exit 1
fi

# Directory to search in
dir="$1"

# Find all files recursively that end with ".png_original" and delete them
find "$dir" -type f -name "*.png_original" -delete

echo "Deleted all files ending with '.png_original' in $dir"