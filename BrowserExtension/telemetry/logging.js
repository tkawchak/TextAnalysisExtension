// "use strict";

const appInsightsInstrumentationKey = "1b6e6f01-1478-4a0c-baff-b9e17c414904";

// // Application insights setup: https://docs.microsoft.com/en-us/azure/azure-monitor/app/nodejs
// const appInsights = require('applicationinsights');
// // If the instrumentation key is set in the environment variable APPINSIGHTS_INSTRUMENTATIONKEY, .setup() can be called with no arguments.
// // This makes it easy to use different ikeys for different environments.
// appInsights
//   .setup(appInsightsInstrumentationKey)
//   .setAutoDependencyCorrelation(true)
//   .setAutoCollectRequests(true)
  // .setAutoCollectPerformance(true)
  // .setAutoCollectExceptions(true)
  // .setAutoCollectDependencies(true)
  // .setAutoCollectConsole(true)
  // .setSendLiveMetrics(true)
  // .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
  // .start();

// Configure Application insights
// For more options, see: https://docs.microsoft.com/en-us/azure/azure-monitor/app/javascript#configuration
// import { ApplicationInsights } from '@microsoft/applicationinsights-web'

// const appInsights = new ApplicationInsights({ config: {
//   instrumentationKey: appInsightsInstrumentationKey,
//   loggingLevelConsole: 0,
//   enableCorsCorrelation: true,
//   enableRequestHeaderTracking: true,
//   enableResponseHeaderTracking: true,
//   distributedTracingMode: DistributedTracingModes.AI_AND_W3C
// }});
// appInsights.loadAppInsights();
const appInsights = "";

class Logger {
  constructor(appInsights) {
    // this.appInsightsClient = appInsights.defaultClient;
  }

  debug(message, properties) {
    // this.appInsightsClient.trackTrace({
    //   message: message,
    //   severityLevel: SeverityLevel.Verbose,
    //   properties: properties
    // });
    console.log(message);
  }

  info(message, properties) {
    // this.appInsightsClient.trackTrace({
    //   message: message,
    //   severityLevel: SeverityLevel.Information,
    //   properties: properties
    // });
    console.log(message);
  }

  warning(message, properties) {
    // this.appInsightsClient.trackTrace({
    //   message: message,
    //   severityLevel: SeverityLevel.Warning,
    //   properties: properties
    // });
    console.log(message);
  }

  error(message, properties) {
    // this.appInsightsClient.trackTrace({
    //   message: message,
    //   severityLevel: SeverityLevel.Error,
    //   properties: properties
    // });
    console.log(message);
  }

  critical(message, properties) {
    // this.appInsightsClient.trackTrace({
    //   message: message,
    //   severityLevel: SeverityLevel.Critical,
    //   properties: properties
    // });
    console.log(message);
  }

  exception(exception, properties) {
    // this.appInsightsClient.trackTrace({
    //   exception: exception,
    //   properties: properties
    // });
    console.log(exception.message);
  }
}

var logger = new Logger(appInsights);
// logger.debug("hey");
// logger.info("hello");
// logger.warning("hi");
// logger.error("yo");
// logger.critical("wats guud?");

module.exports.logger = logger;