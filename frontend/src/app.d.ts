// src/app.d.ts
declare global {
	namespace App {
		interface Locals {
			pb: import('pocketbase').default;
			user: any;
		}
	}
}
export {};
