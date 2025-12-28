CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`hash` text NOT NULL,
	`owner` text NOT NULL,
	`type` text DEFAULT 'personal' NOT NULL,
	`systemRole` text DEFAULT 'user' NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`isBanned` integer DEFAULT false NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text,
	`deletedAt` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_email_unique` ON `accounts` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_owner_unique` ON `accounts` (`owner`);--> statement-breakpoint
CREATE TABLE `list_products` (
	`id` text PRIMARY KEY NOT NULL,
	`listId` text NOT NULL,
	`productId` text NOT NULL,
	`quantity` real NOT NULL,
	`isPurchased` integer DEFAULT false NOT NULL,
	`addedAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`purchasedAt` text,
	`updatedAt` text,
	`removedAt` text
);
--> statement-breakpoint
CREATE TABLE `lists` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`usedTimes` integer DEFAULT 0 NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`isPublic` integer DEFAULT false NOT NULL,
	`canBeShared` integer DEFAULT false NOT NULL,
	`createdBy` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text,
	`deletedAt` text
);
--> statement-breakpoint
CREATE TABLE `prices` (
	`id` text PRIMARY KEY NOT NULL,
	`productId` text NOT NULL,
	`value` real NOT NULL,
	`storeName` text NOT NULL,
	`storeLocation` text,
	`observedAt` text NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text,
	`deletedAt` text
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`unit` text DEFAULT 'un' NOT NULL,
	`createdAt` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` text,
	`deletedAt` text
);
