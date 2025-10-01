e/chunks/dep-D_zLpgQd.js:52027:27)14:12:43 [vite] Internal server error: Failed to resolve import "../src/emails/EmailTemplate" from "src/emails/Co2Report.html.ts". Does the file exist?
  Plugin: vite:import-analysis
  File: /home/project/src/emails/Co2Report.html.ts:4:26
  1  |  import { Resend } from "resend";
  2  |  import EmailTemplate from "../src/emails/EmailTemplate";
     |                             ^
  3  |  const resend = new Resend(process.env.RESEND_API_KEY);
  4  |  const FROM = "Institute for AI Austria <co2@reports.institute-for-ai.com>";
      at TransformPluginContext._formatError (file:///home/project/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49308:41)
      at TransformPluginContext.error (file:///home/project/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49303:16)
      at normalizeUrl (file:///home/project/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:64356:23)
      at async eval (file:///home/project/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:64488:39)
      at async TransformPluginContext.transform (file:///home/project/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:64415:7)
      at async PluginContainer.transform (file:///home/project/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:49149:18)
      at async loadAndTransform (file:///home/project/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:52027:27)
      at async viteTransformMiddleware (file:///home/project/node_modules/vite/dist/node/chunks/dep-D_zLpgQd.js:62155:24)