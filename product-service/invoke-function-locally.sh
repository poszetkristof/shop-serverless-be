#!/bin/bash

function_name=$1

# Helper for checking your lambda functions locally, before deployment.
if [ -z $function_name ]
then
  echo -e "Missing argument.\nUsage: ./invoke-function-locally.sh <my-function>"
else
  serverless invoke local --function $function_name
fi
