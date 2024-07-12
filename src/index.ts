import './lib/setup';
import { client } from './core/client';

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login();
		client.logger.info(`logged in`);
	} catch (error) {
		client.logger.fatal(error);
		await client.destroy();
		process.exit(1);
	}
};

void main();
