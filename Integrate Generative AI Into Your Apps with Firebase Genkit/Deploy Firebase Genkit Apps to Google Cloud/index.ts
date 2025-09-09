
import { z, genkit } from 'genkit';
import { vertexAI } from '@genkit-ai/vertexai';
import { gemini20Flash001 } from '@genkit-ai/vertexai';
import { logger } from 'genkit/logging';
import { enableGoogleCloudTelemetry } from '@genkit-ai/google-cloud';
import { startFlowServer } from '@genkit-ai/express';


const ai = genkit({
    plugins: [
        // Load the Vertex AI plugin. You can optionally specify your project ID
        // by passing in a config object; if you don't, the Vertex AI plugin uses
        // the value from the GCLOUD_PROJECT environment variable.
        vertexAI({ location: 'us-east1' }),
    ],
});

logger.setLogLevel('debug');
enableGoogleCloudTelemetry();


export const menuSuggestionFlow = ai.defineFlow(
    {
        name: 'menuSuggestionFlow',
        inputSchema: z.string(),
        outputSchema: z.string(),
    },
    async (subject) => {
        const llmResponse = await ai.generate({
            prompt: `Suggest an item for the menu of a ${subject} themed restaurant`,
            model: gemini20Flash001,
            config: {
                temperature: 1,
            },
        });
        return llmResponse.text;
    }
);


startFlowServer({
    flows: [menuSuggestionFlow],
    port: 8080,
    cors: {
        origin: '*',
    },
});

