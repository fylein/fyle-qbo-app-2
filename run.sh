if [[ $OSTYPE == darwin* ]]
then
  SED_EXTRA_ARGS='""';
fi

for f in /usr/share/nginx/html/*
do
    echo "Substituting Environment variables and other stuff in $f ...";
    sed -i $SED_EXTRA_ARGS "s?{{API_URL}}?${API_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{APP_URL}}?${APP_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{OLD_QBO_APP_URL}}?${OLD_QBO_APP_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{FYLE_APP_URL}}?${FYLE_APP_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{CALLBACK_URI}}?${CALLBACK_URI}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{FYLE_CLIENT_ID}}?${FYLE_CLIENT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{FYLE_URL}}?${FYLE_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{PRODUCTION}}?${PRODUCTION}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{QBO_APP_URL}}?${QBO_APP_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{QBO_AUTHORIZE_URI}}?${QBO_AUTHORIZE_URI}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{QBO_CLIENT_ID}}?${QBO_CLIENT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{QBO_SCOPE}}?${QBO_SCOPE}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{SEGMENT_ID}}?${SEGMENT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{SENTRY_DSN}}?${SENTRY_DSN}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{SENTRY_ENV}}?${SENTRY_ENV}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{RELEASE}}?${RELEASE}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{CLARITY_PROJECT_ID}}?${CLARITY_PROJECT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{REFINER_PROJECT_ID}}?${REFINER_PROJECT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{REFINER_ONBOARDING_DONE_SURVEY_ID}}?${REFINER_ONBOARDING_DONE_SURVEY_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{REFINER_EXPORT_DONE_SURVEY_ID}}?${REFINER_EXPORT_DONE_SURVEY_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{REFINER_CLONE_SETTINGS_SURVEY_ID}}?${REFINER_CLONE_SETTINGS_SURVEY_ID}?g" $f;

done

nginx -g "daemon off;"
