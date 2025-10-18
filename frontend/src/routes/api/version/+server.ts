import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const GET: RequestHandler = async () => {
	try {
		// Get current git commit hash
		const { stdout: currentHash } = await execAsync('git rev-parse HEAD', {
			cwd: process.cwd() + '/../..'
		});
		const current = currentHash.trim().substring(0, 7);

		// Try to fetch latest commit from remote
		let latest = current;
		let updateAvailable = false;

		try {
			// Fetch latest without pulling
			await execAsync('git fetch origin main', {
				cwd: process.cwd() + '/../..',
				timeout: 5000 // 5 second timeout
			});

			const { stdout: remoteHash } = await execAsync('git rev-parse origin/main', {
				cwd: process.cwd() + '/../..'
			});
			latest = remoteHash.trim().substring(0, 7);
			updateAvailable = current !== latest;
		} catch (error) {
			// If fetch fails (no internet, etc.), just return current version
			console.debug('Could not fetch remote version:', error);
		}

		return json({
			current,
			latest,
			updateAvailable,
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error('Version check error:', error);
		return json(
			{
				current: 'unknown',
				latest: 'unknown',
				updateAvailable: false,
				error: 'Could not determine version'
			},
			{ status: 500 }
		);
	}
};

