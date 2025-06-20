import type { FieldValue } from "firebase/firestore";

export type Strike = {
	id: string;
	type: "Feature";
	geometry: {
		type: "Point";
		coordinates: [number, number]; // [longitude, latitude]
	};
	properties: {
		date: string;
		siteTargeted: string;
		status: string;
		threatLevel: "low" | "medium" | "high" | "critical";
	};
	createdAt: FieldValue;
};

export type TokenInfo = {
	id: string;
	token: string;
	createdAt: {
		seconds: number;
		nanoseconds: number;
	};
	device?: {
		platform?: string;
		version?: string;
	};
	browser?: {
		userAgent?: string;
		platform?: string;
		language?: string;
		vendor?: string;
	};
};
