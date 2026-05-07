"use strict";
// import { Client } from "@botpress/client";
// import { envVars } from "../../config/env.js";
// const client = new Client({
//   token: envVars.BOTPRESS.BOTPRESS_TOKEN,
//   botId: envVars.BOTPRESS.BOTPRESS_BOT_ID,
//   workspaceId: envVars.BOTPRESS.BOTPRESS_WORKSPACE_ID,
// });
// export const chatService = {
//   async sendMessage(message: string) {
//     try {
//       const { user } = await client.createUser({ tags: {} });
//       const { conversation } = await client.createConversation({
//         channel: "api",
//         tags: {},
//       });
//       const response = await client.createMessage({
//         conversationId: conversation.id,
//         userId: user.id,
//         type: "text",
//         tags: {},
//         payload: {
//           type: "text",
//           text: message,
//         },
//       });
//       return response;
//     } catch (error) {
//       console.error(error);
//       throw new Error("Botpress service failed");
//     }
//   },
// };
