if [[ $OSTYPE == darwin* ]]
then
  SED_EXTRA_ARGS='""';
fi

for f in /usr/share/nginx/html/*
do
    echo "Substituting Environment variables and other stuff in $f ...";
    # Add all environment variables that are read from html files
    sed -i $SED_EXTRA_ARGS "s?{{SEGMENT_ID}}?${SEGMENT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{CLARITY_PROJECT_ID}}?${CLARITY_PROJECT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{REFINER_PROJECT_ID}}?${REFINER_PROJECT_ID}?g" $f;

done

nginx -g "daemon off;"
