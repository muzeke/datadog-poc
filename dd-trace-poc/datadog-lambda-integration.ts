// Below is just the snippet of our datadog integration in our lambda
export const provisionDatadogIntegration = (
  scope: PrototypeBundleStackShape
) => {
  const bundlePascalId = upperCaseFirst(scope.bundleId);
  const bundleGroupId = getBundleGroupId(scope.bundleId);
  return new Datadog(scope, `Datadog${bundlePascalId}`, {
    nodeLayerVersion: 83,
    extensionLayerVersion: 28,
    site: "datadoghq.com",
    apiKeySecretArn: "<secret here>",
    env: "<environment>",
    captureLambdaPayload: true,
  });
};

export const datadogEnvironmentVariables = {
  DD_LOGS_CONFIG_PROCESSING_RULES: JSON.stringify([
    {
      type: "exclude_at_match",
      name: "exclude_start_and_end_logs",
      pattern: "(START|END) RequestId",
    },
  ]),
  // DD_LOGS_CONFIG_AUTO_MULTI_LINE_DETECTION: 'true',
  DD_LOG_LEVEL: "INFO",
  //DD_MERGE_XRAY_TRACES: 'true',
  DD_TRACE_SAMPLE_RATE: "1",
  //DD_TRACE_ENABLED: 'true',
};
