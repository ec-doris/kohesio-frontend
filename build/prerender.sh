#!/bin/bash
# Preprocessing all languages, by Raphael Domingues
echo $1

rm -Rf dist/
languages=("bg" "cs" "da" "de" "el" "es" "en" "et" "fi" "fr" "ga" "hr" "hu" "it" "lt" "lv" "mt" "nl" "pl" "pt" "ro" "sk" "sl" "sv")
i=1
CMD="run-p ";
ENV="${1:-development}";

for index in "${!languages[@]}"; do
  LANG=${languages[$index]}
  CMD+="'ng run kohesio-frontend:prerender:$ENV-$LANG' ";
  #CMD+="'ng version' ";
  if [[ "$i" == 2 || ${#languages[@]} == $(($index+1)) ]]; then
    echo "RUNNING COMMAND: $CMD"
    eval $CMD;
    i=0
    CMD="run-p ";
  fi
  ((i=i+1))
done
