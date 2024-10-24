message="$1"

folder="$(dirname "$0")"
file="live_message.txt"

echo -e "$message" > "$folder""/""$file"
