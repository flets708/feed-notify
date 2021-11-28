#パラメータの読み込み
$TEMP_JSON = Get-Content -Path "sls-settings.json" | ConvertFrom-Json

#読み込んだパラメータのうち、Client側で使うものをセット
$env:REACT_APP_LIFF_ID_PROD = $TEMP_JSON.LIFF_ID_PROD
$env:REACT_APP_LIFF_ID_DEV = $TEMP_JSON.LIFF_ID_DEV

Set-Location server

serverless deploy --verbose
Write-Output "Server Deploy Finished"

$TEMP_SG = aws cloudformation describe-stacks --output text --stack-name feed-notify-dev --query 'Stacks[].Outputs[?OutputKey==`AppSecurityGroupId`].[OutputValue]'
aws ec2 authorize-security-group-egress --group-id $TEMP_SG --ip-permissions IpProtocol=tcp, FromPort=80, ToPort=80, IpRanges='[{CidrIp=0.0.0.0/0,Description="HTTP ACCESS for RSS Feed Subscribe"}]'
Write-Output "Outbound HTTP Access added to Security Group"

Set-Location ../client

$env:REACT_APP_API_URL_PROD = aws cloudformation describe-stacks --output text --stack-name feed-notify-dev --query 'Stacks[].Outputs[?OutputKey==`ServiceEndpoint`].[OutputValue]'
yarn build
Write-Output "Client App Built"

serverless deploy --verbose
Write-Output "Client App Deploy Finished"

$TEMP_CLIENT_URL = aws cloudformation describe-stacks --output text --stack-name feed-notify-client-dev --query 'Stacks[].Outputs[?OutputKey==`StaticContentsCloudFrontUrl`].[OutputValue]'

Set-Location ..
Get-Location

Write-Output "*********************************"
Write-Output "**LINE DEVELOPERS CONFIGURATION**"
Write-Output "Webhook URL for LINE Messaging API"
Write-Output $env:REACT_APP_API_URL_PROD/webhook
Write-Output "Endpoint URL for LIFF"
Write-Output $TEMP_CLIENT_URL
Write-Output "*********************************"