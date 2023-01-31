"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = void 0;
const architect_1 = require("@angular-devkit/architect");
const normalize_optimization_1 = require("@angular-devkit/build-angular/src/utils/normalize-optimization");
const service_worker_1 = require("@angular-devkit/build-angular/src/utils/service-worker");
const fs = __importStar(require("fs"));
const ora_1 = __importDefault(require("ora"));
const path = __importStar(require("path"));
const piscina_1 = __importDefault(require("piscina"));
const utils_1 = require("./utils");
/**
 * Schedules the server and browser builds and returns their results if both builds are successful.
 */
async function _scheduleBuilds(options, context) {
  const browserTarget = (0, architect_1.targetFromTargetString)(options.browserTarget);
  const serverTarget = (0, architect_1.targetFromTargetString)(options.serverTarget);
  const browserTargetRun = await context.scheduleTarget(browserTarget, {
    watch: false,
    serviceWorker: false,
    // todo: handle service worker augmentation
  });
  const serverTargetRun = await context.scheduleTarget(serverTarget, {
    watch: false,
  });
  try {
    const [browserResult, serverResult] = await Promise.all([
      browserTargetRun.result,
      serverTargetRun.result,
    ]);
    const success = browserResult.success && serverResult.success && browserResult.baseOutputPath !== undefined;
    const error = browserResult.error || serverResult.error;
    return { success, error, browserResult, serverResult };
  }
  catch (e) {
    return { success: false, error: e.message };
  }
  finally {
    await Promise.all([browserTargetRun.stop(), serverTargetRun.stop()]);
  }
}
/**
 * Renders each route and writes them to
 * <route>/index.html for each output path in the browser result.
 */
async function _renderUniversal(routes, context, browserResult, serverResult, browserOptions, numProcesses) {
  var _a, _b;
  const projectName = context.target && context.target.project;
  if (!projectName) {
    throw new Error('The builder requires a target.');
  }
  const projectMetadata = await context.getProjectMetadata(projectName);
  const projectRoot = path.join(context.workspaceRoot, (_a = projectMetadata.root) !== null && _a !== void 0 ? _a : '');
  // Users can specify a different base html file e.g. "src/home.html"
  const indexFile = (0, utils_1.getIndexOutputFile)(browserOptions);
  const { styles: normalizedStylesOptimization } = (0, normalize_optimization_1.normalizeOptimization)(browserOptions.optimization);
  const zonePackage = require.resolve('zone.js', { paths: [context.workspaceRoot] });
  const { baseOutputPath = '' } = serverResult;
  const worker = new piscina_1.default({
    filename: path.join(__dirname, 'worker.js'),
    maxThreads: numProcesses,
    workerData: { zonePackage },
  });
  try {
    // We need to render the routes for each locale from the browser output.
    for (const outputPath of browserResult.outputPaths) {
      const localeDirectory = path.relative(browserResult.baseOutputPath, outputPath);
      const serverBundlePath = path.join(baseOutputPath, localeDirectory, 'main.js');
      if (!fs.existsSync(serverBundlePath)) {
        throw new Error(`Could not find the main bundle: ${serverBundlePath}`);
      }
      const routesLocale = [];
      for(const route of routes){
        if (route.indexOf('/'+localeDirectory)>-1){
          routesLocale.push(route.replace("/"+localeDirectory,""));
        }
      }
      const spinner = (0, ora_1.default)(`Prerendering ${routesLocale.length} route(s) to ${outputPath}...`).start();
      try {

        const results = (await Promise.all(routesLocale.map((route) => {
          const options = {
            indexFile,
            deployUrl: browserOptions.deployUrl || '',
            inlineCriticalCss: !!normalizedStylesOptimization.inlineCritical,
            minifyCss: !!normalizedStylesOptimization.minify,
            outputPath,
            route,
            serverBundlePath,
          };
          return worker.run(options);
        })));
        let numErrors = 0;
        for (const { errors, warnings } of results) {
          spinner.stop();
          errors === null || errors === void 0 ? void 0 : errors.forEach((e) => context.logger.error(e));
          warnings === null || warnings === void 0 ? void 0 : warnings.forEach((e) => context.logger.warn(e));
          spinner.start();
          numErrors += (_b = errors === null || errors === void 0 ? void 0 : errors.length) !== null && _b !== void 0 ? _b : 0;
        }
        if (numErrors > 0) {
          throw Error(`Rendering failed with ${numErrors} worker errors.`);
        }
      }
      catch (error) {
        spinner.fail(`Prerendering routes to ${outputPath} failed.`);
        return { success: false, error: error.message };
      }
      spinner.succeed(`Prerendering routes to ${outputPath} complete.`);
      if (browserOptions.serviceWorker) {
        spinner.start('Generating service worker...');
        try {
          await (0, service_worker_1.augmentAppWithServiceWorker)(projectRoot, context.workspaceRoot, outputPath, browserOptions.baseHref || '/', browserOptions.ngswConfigPath);
        }
        catch (error) {
          spinner.fail('Service worker generation failed.');
          return { success: false, error: error.message };
        }
        spinner.succeed('Service worker generation complete.');
      }
    }
  }
  finally {
    void worker.destroy();
  }
  return browserResult;
}
/**
 * Builds the browser and server, then renders each route in options.routes
 * and writes them to prerender/<route>/index.html for each output path in
 * the browser result.
 */
async function execute(options, context) {
  const browserTarget = (0, architect_1.targetFromTargetString)(options.browserTarget);
  const browserOptions = (await context.getTargetOptions(browserTarget));
  const tsConfigPath = typeof browserOptions.tsConfig === 'string' ? browserOptions.tsConfig : undefined;
  const routes = await (0, utils_1.getRoutes)(options, tsConfigPath, context);
  if (!routes.length) {
    throw new Error(`Could not find any routes to prerender.`);
  }
  const result = await _scheduleBuilds(options, context);
  const { success, error, browserResult, serverResult } = result;
  if (!success || !browserResult || !serverResult) {
    return { success, error };
  }
  return _renderUniversal(routes, context, browserResult, serverResult, browserOptions, options.numProcesses);
}
exports.execute = execute;
exports.default = (0, architect_1.createBuilder)(execute);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2J1aWxkZXJzL3NyYy9wcmVyZW5kZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCx5REFLbUM7QUFFbkMsMkdBQXVHO0FBQ3ZHLDJGQUFxRztBQUNyRyx1Q0FBeUI7QUFDekIsOENBQXNCO0FBQ3RCLDJDQUE2QjtBQUM3QixzREFBOEI7QUFFOUIsbUNBQXdEO0FBY3hEOztHQUVHO0FBQ0gsS0FBSyxVQUFVLGVBQWUsQ0FDNUIsT0FBZ0MsRUFDaEMsT0FBdUI7SUFFdkIsTUFBTSxhQUFhLEdBQUcsSUFBQSxrQ0FBc0IsRUFBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDcEUsTUFBTSxZQUFZLEdBQUcsSUFBQSxrQ0FBc0IsRUFBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFFbEUsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLE9BQU8sQ0FBQyxjQUFjLENBQUMsYUFBYSxFQUFFO1FBQ25FLEtBQUssRUFBRSxLQUFLO1FBQ1osYUFBYSxFQUFFLEtBQUs7UUFDcEIsMkNBQTJDO0tBQzVDLENBQUMsQ0FBQztJQUNILE1BQU0sZUFBZSxHQUFHLE1BQU0sT0FBTyxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUU7UUFDakUsS0FBSyxFQUFFLEtBQUs7S0FDYixDQUFDLENBQUM7SUFFSCxJQUFJO1FBQ0YsTUFBTSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDdEQsZ0JBQWdCLENBQUMsTUFBdUM7WUFDeEQsZUFBZSxDQUFDLE1BQXVDO1NBQ3hELENBQUMsQ0FBQztRQUVILE1BQU0sT0FBTyxHQUNYLGFBQWEsQ0FBQyxPQUFPLElBQUksWUFBWSxDQUFDLE9BQU8sSUFBSSxhQUFhLENBQUMs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SyxRQUFRLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUVwRixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUEsaUJBQVMsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9ELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1FBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMseUNBQXlDLENBQUMsQ0FBQztLQUM1RDtJQUVELE1BQU0sTUFBTSxHQUFHLE1BQU0sZUFBZSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN2RCxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBQy9ELElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxZQUFZLEVBQUU7UUFDL0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQW1CLENBQUM7S0FDNUM7SUFFRCxPQUFPLGdCQUFnQixDQUNyQixNQUFNLEVBQ04sT0FBTyxFQUNQLGFBQWEsRUFDYixZQUFZLEVBQ1osY0FBYyxFQUNkLE9BQU8sQ0FBQyxZQUFZLENBQ3JCLENBQUM7QUFDSixDQUFDO0FBOUJELDBCQThCQztBQUVELGtCQUFlLElBQUEseUJBQWEsRUFBQyxPQUFPLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBCdWlsZGVyQ29udGV4dCxcbiAgQnVpbGRlck91dHB1dCxcbiAgY3JlYXRlQnVpbGRlcixcbiAgdGFyZ2V0RnJvbVRhcmdldFN0cmluZyxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2FyY2hpdGVjdCc7XG5pbXBvcnQgeyBCcm93c2VyQnVpbGRlck9wdGlvbnMgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvYnVpbGQtYW5ndWxhcic7XG5pbXBvcnQgeyBub3JtYWxpemVPcHRpbWl6YXRpb24gfSBmcm9tICdAYW5ndWxhci1kZXZraXQvYnVpbGQtYW5ndWxhci9zcmMvdXRpbHMvbm9ybWFsaXplLW9wdGltaXphdGlvbic7XG5pbXBvcnQgeyBhdWdtZW50QXBwV2l0aFNlcnZpY2VXb3JrZXIgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvYnVpbGQtYW5ndWxhci9zcmMvdXRpbHMvc2VydmljZS13b3JrZXInO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IG9yYSBmcm9tICdvcmEnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBQaXNjaW5hIGZyb20gJ3Bpc2NpbmEnO1xuaW1wb3J0IHsgUHJlcmVuZGVyQnVpbGRlck9wdGlvbnMsIFByZXJlbmRlckJ1aWxkZXJPdXRwdXQgfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBnZXRJbmRleE91dHB1dEZpbGUsIGdldFJvdXRlcyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgUmVuZGVyT3B0aW9ucywgUmVuZGVyUmVzdWx0IH0gZnJvbSAnLi93b3JrZXInO1xuXG50eXBlIEJ1aWxkQnVpbGRlck91dHB1dCA9IEJ1aWxkZXJPdXRwdXQgJiB7XG4gIGJhc2VPdXRwdXRQYXRoOiBzdHJpbmc7XG4gIG91dHB1dFBhdGhzOiBzdHJpbmdbXTtcbiAgb3V0cHV0UGF0aDogc3RyaW5nO1xufTtcblxudHlwZSBTY2hlZHVsZUJ1aWxkc091dHB1dCA9IEJ1aWxkZXJPdXRwdXQgJiB7XG4gIHNlcnZlclJlc3VsdD86IEJ1aWxkQnVpbGRlck91dHB1dDtcbiAgYnJvd3NlclJlc3VsdD86IEJ1aWxkQnVpbGRlck91dHB1dDtcbn07XG5cbi8qKlxuICogU2NoZWR1bGVzIHRoZSBzZXJ2ZXIgYW5kIGJyb3dzZXIgYnVpbGRzIGFuZCByZXR1cm5zIHRoZWlyIHJlc3VsdHMgaWYgYm90aCBidWlsZHMgYXJlIHN1Y2Nlc3NmdWwuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIF9zY2hlZHVsZUJ1aWxkcyhcbiAgb3B0aW9uczogUHJlcmVuZGVyQnVpbGRlck9wdGlvbnMsXG4gIGNvbnRleHQ6IEJ1aWxkZXJDb250ZXh0LFxuKTogUHJvbWlzZTxTY2hlZHVsZUJ1aWxkc091dHB1dD4ge1xuICBjb25zdCBicm93c2VyVGFyZ2V0ID0gdGFyZ2V0RnJvbVRhcmdldFN0cmluZyhvcHRpb25zLmJyb3dzZXJUYXJnZXQpO1xuICBjb25zdCBzZXJ2ZXJUYXJnZXQgPSB0YXJnZXRGcm9tVGFyZ2V0U3RyaW5nKG9wdGlvbnMuc2VydmVyVGFyZ2V0KTtcblxuICBjb25zdCBicm93c2VyVGFyZ2V0UnVuID0gYXdhaXQgY29udGV4dC5zY2hlZHVsZVRhcmdldChicm93c2VyVGFyZ2V0LCB7XG4gICAgd2F0Y2g6IGZhbHNlLFxuICAgIHNlcnZpY2VXb3JrZXI6IGZhbHNlLFxuICAgIC8vIHRvZG86IGhhbmRsZSBzZXJ2aWNlIHdvcmtlciBhdWdtZW50YXRpb25cbiAgfSk7XG4gIGNvbnN0IHNlcnZlclRhcmdldFJ1biA9IGF3YWl0IGNvbnRleHQuc2NoZWR1bGVUYXJnZXQoc2VydmVyVGFyZ2V0LCB7XG4gICAgd2F0Y2g6IGZhbHNlLFxuICB9KTtcblxuICB0cnkge1xuICAgIGNvbnN0IFticm93c2VyUmVzdWx0LCBzZXJ2ZXJSZXN1bHRdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgYnJvd3NlclRhcmdldFJ1bi5yZXN1bHQgYXMgdW5rbm93biBhcyBCdWlsZEJ1aWxkZXJPdXRwdXQsXG4gICAgICBzZXJ2ZXJUYXJnZXRSdW4ucmVzdWx0IGFzIHVua25vd24gYXMgQnVpbGRCdWlsZGVyT3V0cHV0LFxuICAgIF0pO1xuXG4gICAgY29uc3Qgc3VjY2VzcyA9XG4gICAgICBicm93c2VyUmVzdWx0LnN1Y2Nlc3MgJiYgc2VydmVyUmVzdWx0LnN1Y2Nlc3MgJiYgYnJvd3NlclJlc3VsdC5iYXNlT3V0cHV0UGF0aCAhPT0gdW5kZWZpbmVkO1xuICAgIGNvbnN0IGVycm9yID0gYnJvd3NlclJlc3VsdC5lcnJvciB8fCAoc2VydmVyUmVzdWx0LmVycm9yIGFzIHN0cmluZyk7XG5cbiAgICByZXR1cm4geyBzdWNjZXNzLCBlcnJvciwgYnJvd3NlclJlc3VsdCwgc2VydmVyUmVzdWx0IH07XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGUubWVzc2FnZSB9O1xuICB9IGZpbmFsbHkge1xuICAgIGF3YWl0IFByb21pc2UuYWxsKFticm93c2VyVGFyZ2V0UnVuLnN0b3AoKSwgc2VydmVyVGFyZ2V0UnVuLnN0b3AoKV0pO1xuICB9XG59XG5cbi8qKlxuICogUmVuZGVycyBlYWNoIHJvdXRlIGFuZCB3cml0ZXMgdGhlbSB0b1xuICogPHJvdXRlPi9pbmRleC5odG1sIGZvciBlYWNoIG91dHB1dCBwYXRoIGluIHRoZSBicm93c2VyIHJlc3VsdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gX3JlbmRlclVuaXZlcnNhbChcbiAgcm91dGVzOiBzdHJpbmdbXSxcbiAgY29udGV4dDogQnVpbGRlckNvbnRleHQsXG4gIGJyb3dzZXJSZXN1bHQ6IEJ1aWxkQnVpbGRlck91dHB1dCxcbiAgc2VydmVyUmVzdWx0OiBCdWlsZEJ1aWxkZXJPdXRwdXQsXG4gIGJyb3dzZXJPcHRpb25zOiBCcm93c2VyQnVpbGRlck9wdGlvbnMsXG4gIG51bVByb2Nlc3Nlcz86IG51bWJlcixcbik6IFByb21pc2U8UHJlcmVuZGVyQnVpbGRlck91dHB1dD4ge1xuICBjb25zdCBwcm9qZWN0TmFtZSA9IGNvbnRleHQudGFyZ2V0ICYmIGNvbnRleHQudGFyZ2V0LnByb2plY3Q7XG4gIGlmICghcHJvamVjdE5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBidWlsZGVyIHJlcXVpcmVzIGEgdGFyZ2V0LicpO1xuICB9XG5cbiAgY29uc3QgcHJvamVjdE1ldGFkYXRhID0gYXdhaXQgY29udGV4dC5nZXRQcm9qZWN0TWV0YWRhdGEocHJvamVjdE5hbWUpO1xuICBjb25zdCBwcm9qZWN0Um9vdCA9IHBhdGguam9pbihcbiAgICBjb250ZXh0LndvcmtzcGFjZVJvb3QsXG4gICAgKHByb2plY3RNZXRhZGF0YS5yb290IGFzIHN0cmluZyB8IHVuZGVmaW5lZCkgPz8gJycsXG4gICk7XG5cbiAgLy8gVXNlcnMgY2FuIHNwZWNpZnkgYSBkaWZmZXJlbnQgYmFzZSBodG1sIGZpbGUgZS5nLiBcInNyYy9ob21lLmh0bWxcIlxuICBjb25zdCBpbmRleEZpbGUgPSBnZXRJbmRleE91dHB1dEZpbGUoYnJvd3Nlck9wdGlvbnMpO1xuICBjb25zdCB7IHN0eWxlczogbm9ybWFsaXplZFN0eWxlc09wdGltaXphdGlvbiB9ID0gbm9ybWFsaXplT3B0aW1pemF0aW9uKFxuICAgIGJyb3dzZXJPcHRpb25zLm9wdGltaXphdGlvbixcbiAgKTtcblxuICBjb25zdCB6b25lUGFja2FnZSA9IHJlcXVpcmUucmVzb2x2ZSgnem9uZS5qcycsIHsgcGF0aHM6IFtjb250ZXh0LndvcmtzcGFjZVJvb3RdIH0pO1xuXG4gIGNvbnN0IHsgYmFzZU91dHB1dFBhdGggPSAnJyB9ID0gc2VydmVyUmVzdWx0O1xuICBjb25zdCB3b3JrZXIgPSBuZXcgUGlzY2luYSh7XG4gICAgZmlsZW5hbWU6IHBhdGguam9pbihfX2Rpcm5hbWUsICd3b3JrZXIuanMnKSxcbiAgICBtYXhUaHJlYWRzOiBudW1Qcm9jZXNzZXMsXG4gICAgd29ya2VyRGF0YTogeyB6b25lUGFja2FnZSB9LFxuICB9KTtcblxuICB0cnkge1xuICAgIC8vIFdlIG5lZWQgdG8gcmVuZGVyIHRoZSByb3V0ZXMgZm9yIGVhY2ggbG9jYWxlIGZyb20gdGhlIGJyb3dzZXIgb3V0cHV0LlxuICAgIGZvciAoY29uc3Qgb3V0cHV0UGF0aCBvZiBicm93c2VyUmVzdWx0Lm91dHB1dFBhdGhzKSB7XG4gICAgICBjb25zdCBsb2NhbGVEaXJlY3RvcnkgPSBwYXRoLnJlbGF0aXZlKGJyb3dzZXJSZXN1bHQuYmFzZU91dHB1dFBhdGgsIG91dHB1dFBhdGgpO1xuICAgICAgY29uc3Qgc2VydmVyQnVuZGxlUGF0aCA9IHBhdGguam9pbihiYXNlT3V0cHV0UGF0aCwgbG9jYWxlRGlyZWN0b3J5LCAnbWFpbi5qcycpO1xuICAgICAgaWYgKCFmcy5leGlzdHNTeW5jKHNlcnZlckJ1bmRsZVBhdGgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgdGhlIG1haW4gYnVuZGxlOiAke3NlcnZlckJ1bmRsZVBhdGh9YCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNwaW5uZXIgPSBvcmEoYFByZXJlbmRlcmluZyAke3JvdXRlcy5sZW5ndGh9IHJvdXRlKHMpIHRvICR7b3V0cHV0UGF0aH0uLi5gKS5zdGFydCgpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXN1bHRzID0gKGF3YWl0IFByb21pc2UuYWxsKFxuICAgICAgICAgIHJvdXRlcy5tYXAoKHJvdXRlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcHRpb25zOiBSZW5kZXJPcHRpb25zID0ge1xuICAgICAgICAgICAgICBpbmRleEZpbGUsXG4gICAgICAgICAgICAgIGRlcGxveVVybDogYnJvd3Nlck9wdGlvbnMuZGVwbG95VXJsIHx8ICcnLFxuICAgICAgICAgICAgICBpbmxpbmVDcml0aWNhbENzczogISFub3JtYWxpemVkU3R5bGVzT3B0aW1pemF0aW9uLmlubGluZUNyaXRpY2FsLFxuICAgICAgICAgICAgICBtaW5pZnlDc3M6ICEhbm9ybWFsaXplZFN0eWxlc09wdGltaXphdGlvbi5taW5pZnksXG4gICAgICAgICAgICAgIG91dHB1dFBhdGgsXG4gICAgICAgICAgICAgIHJvdXRlLFxuICAgICAgICAgICAgICBzZXJ2ZXJCdW5kbGVQYXRoLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHdvcmtlci5ydW4ob3B0aW9ucyk7XG4gICAgICAgICAgfSksXG4gICAgICAgICkpIGFzIFJlbmRlclJlc3VsdFtdO1xuICAgICAgICBsZXQgbnVtRXJyb3JzID0gMDtcbiAgICAgICAgZm9yIChjb25zdCB7IGVycm9ycywgd2FybmluZ3MgfSBvZiByZXN1bHRzKSB7XG4gICAgICAgICAgc3Bpbm5lci5zdG9wKCk7XG4gICAgICAgICAgZXJyb3JzPy5mb3JFYWNoKChlKSA9PiBjb250ZXh0LmxvZ2dlci5lcnJvcihlKSk7XG4gICAgICAgICAgd2FybmluZ3M/LmZvckVhY2goKGUpID0+IGNvbnRleHQubG9nZ2VyLndhcm4oZSkpO1xuICAgICAgICAgIHNwaW5uZXIuc3RhcnQoKTtcbiAgICAgICAgICBudW1FcnJvcnMgKz0gZXJyb3JzPy5sZW5ndGggPz8gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobnVtRXJyb3JzID4gMCkge1xuICAgICAgICAgIHRocm93IEVycm9yKGBSZW5kZXJpbmcgZmFpbGVkIHdpdGggJHtudW1FcnJvcnN9IHdvcmtlciBlcnJvcnMuYCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHNwaW5uZXIuZmFpbChgUHJlcmVuZGVyaW5nIHJvdXRlcyB0byAke291dHB1dFBhdGh9IGZhaWxlZC5gKTtcblxuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfTtcbiAgICAgIH1cbiAgICAgIHNwaW5uZXIuc3VjY2VlZChgUHJlcmVuZGVyaW5nIHJvdXRlcyB0byAke291dHB1dFBhdGh9IGNvbXBsZXRlLmApO1xuXG4gICAgICBpZiAoYnJvd3Nlck9wdGlvbnMuc2VydmljZVdvcmtlcikge1xuICAgICAgICBzcGlubmVyLnN0YXJ0KCdHZW5lcmF0aW5nIHNlcnZpY2Ugd29ya2VyLi4uJyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgYXVnbWVudEFwcFdpdGhTZXJ2aWNlV29ya2VyKFxuICAgICAgICAgICAgcHJvamVjdFJvb3QsXG4gICAgICAgICAgICBjb250ZXh0LndvcmtzcGFjZVJvb3QsXG4gICAgICAgICAgICBvdXRwdXRQYXRoLFxuICAgICAgICAgICAgYnJvd3Nlck9wdGlvbnMuYmFzZUhyZWYgfHwgJy8nLFxuICAgICAgICAgICAgYnJvd3Nlck9wdGlvbnMubmdzd0NvbmZpZ1BhdGgsXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBzcGlubmVyLmZhaWwoJ1NlcnZpY2Ugd29ya2VyIGdlbmVyYXRpb24gZmFpbGVkLicpO1xuXG4gICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH07XG4gICAgICAgIH1cbiAgICAgICAgc3Bpbm5lci5zdWNjZWVkKCdTZXJ2aWNlIHdvcmtlciBnZW5lcmF0aW9uIGNvbXBsZXRlLicpO1xuICAgICAgfVxuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICB2b2lkIHdvcmtlci5kZXN0cm95KCk7XG4gIH1cblxuICByZXR1cm4gYnJvd3NlclJlc3VsdDtcbn1cblxuLyoqXG4gKiBCdWlsZHMgdGhlIGJyb3dzZXIgYW5kIHNlcnZlciwgdGhlbiByZW5kZXJzIGVhY2ggcm91dGUgaW4gb3B0aW9ucy5yb3V0ZXNcbiAqIGFuZCB3cml0ZXMgdGhlbSB0byBwcmVyZW5kZXIvPHJvdXRlPi9pbmRleC5odG1sIGZvciBlYWNoIG91dHB1dCBwYXRoIGluXG4gKiB0aGUgYnJvd3NlciByZXN1bHQuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlKFxuICBvcHRpb25zOiBQcmVyZW5kZXJCdWlsZGVyT3B0aW9ucyxcbiAgY29udGV4dDogQnVpbGRlckNvbnRleHQsXG4pOiBQcm9taXNlPFByZXJlbmRlckJ1aWxkZXJPdXRwdXQ+IHtcbiAgY29uc3QgYnJvd3NlclRhcmdldCA9IHRhcmdldEZyb21UYXJnZXRTdHJpbmcob3B0aW9ucy5icm93c2VyVGFyZ2V0KTtcbiAgY29uc3QgYnJvd3Nlck9wdGlvbnMgPSAoYXdhaXQgY29udGV4dC5nZXRUYXJnZXRPcHRpb25zKFxuICAgIGJyb3dzZXJUYXJnZXQsXG4gICkpIGFzIHVua25vd24gYXMgQnJvd3NlckJ1aWxkZXJPcHRpb25zO1xuICBjb25zdCB0c0NvbmZpZ1BhdGggPVxuICAgIHR5cGVvZiBicm93c2VyT3B0aW9ucy50c0NvbmZpZyA9PT0gJ3N0cmluZycgPyBicm93c2VyT3B0aW9ucy50c0NvbmZpZyA6IHVuZGVmaW5lZDtcblxuICBjb25zdCByb3V0ZXMgPSBhd2FpdCBnZXRSb3V0ZXMob3B0aW9ucywgdHNDb25maWdQYXRoLCBjb250ZXh0KTtcbiAgaWYgKCFyb3V0ZXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBhbnkgcm91dGVzIHRvIHByZXJlbmRlci5gKTtcbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IF9zY2hlZHVsZUJ1aWxkcyhvcHRpb25zLCBjb250ZXh0KTtcbiAgY29uc3QgeyBzdWNjZXNzLCBlcnJvciwgYnJvd3NlclJlc3VsdCwgc2VydmVyUmVzdWx0IH0gPSByZXN1bHQ7XG4gIGlmICghc3VjY2VzcyB8fCAhYnJvd3NlclJlc3VsdCB8fCAhc2VydmVyUmVzdWx0KSB7XG4gICAgcmV0dXJuIHsgc3VjY2VzcywgZXJyb3IgfSBhcyBCdWlsZGVyT3V0cHV0O1xuICB9XG5cbiAgcmV0dXJuIF9yZW5kZXJVbml2ZXJzYWwoXG4gICAgcm91dGVzLFxuICAgIGNvbnRleHQsXG4gICAgYnJvd3NlclJlc3VsdCxcbiAgICBzZXJ2ZXJSZXN1bHQsXG4gICAgYnJvd3Nlck9wdGlvbnMsXG4gICAgb3B0aW9ucy5udW1Qcm9jZXNzZXMsXG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZUJ1aWxkZXIoZXhlY3V0ZSk7XG4iXX0=
