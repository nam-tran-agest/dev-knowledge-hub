import type { OpenNextConfig } from '@opennextjs/cloudflare';

const config: OpenNextConfig = {
    default: {
        // Enable incremental cache if needed, currently disabled in sample
        // incrementalCache: () => ({
        //   loader: "s3-lite",
        //   options: {
        //     // ...
        //   }
        // }),
    },
};

export default config;
