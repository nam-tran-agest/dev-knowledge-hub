import { getRequestConfig } from 'next-intl/server';
import messages from '../locales/en.json';

export default getRequestConfig(async () => {
    return {
        locale: 'en',
        messages
    };
});
