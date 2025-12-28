PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`hash` text NOT NULL,
	`owner` text NOT NULL,
	`type` text DEFAULT 'personal' NOT NULL,
	`systemRole` text DEFAULT 'user' NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`isBanned` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	`updatedAt` integer,
	`deletedAt` integer
);
--> statement-breakpoint
INSERT INTO `__new_accounts`("id", "email", "hash", "owner", "type", "systemRole", "isActive", "isBanned", "createdAt", "updatedAt", "deletedAt") SELECT "id", "email", "hash", "owner", "type", "systemRole", "isActive", "isBanned", "createdAt", "updatedAt", "deletedAt" FROM `accounts`;--> statement-breakpoint
DROP TABLE `accounts`;--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_email_unique` ON `accounts` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_owner_unique` ON `accounts` (`owner`);--> statement-breakpoint
CREATE TABLE `__new_list_products` (
	`id` text PRIMARY KEY NOT NULL,
	`listId` text NOT NULL,
	`productId` text NOT NULL,
	`quantity` real NOT NULL,
	`isPurchased` integer DEFAULT false NOT NULL,
	`addedAt` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	`purchasedAt` integer,
	`updatedAt` integer,
	`removedAt` integer
);
--> statement-breakpoint
INSERT INTO `__new_list_products`("id", "listId", "productId", "quantity", "isPurchased", "addedAt", "purchasedAt", "updatedAt", "removedAt") SELECT "id", "listId", "productId", "quantity", "isPurchased", "addedAt", "purchasedAt", "updatedAt", "removedAt" FROM `list_products`;--> statement-breakpoint
DROP TABLE `list_products`;--> statement-breakpoint
ALTER TABLE `__new_list_products` RENAME TO `list_products`;--> statement-breakpoint
CREATE TABLE `__new_lists` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`usedTimes` integer DEFAULT 0 NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`isPublic` integer DEFAULT false NOT NULL,
	`canBeShared` integer DEFAULT false NOT NULL,
	`createdBy` text NOT NULL,
	`createdAt` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	`updatedAt` integer,
	`deletedAt` integer
);
--> statement-breakpoint
INSERT INTO `__new_lists`("id", "name", "description", "usedTimes", "isActive", "isPublic", "canBeShared", "createdBy", "createdAt", "updatedAt", "deletedAt") SELECT "id", "name", "description", "usedTimes", "isActive", "isPublic", "canBeShared", "createdBy", "createdAt", "updatedAt", "deletedAt" FROM `lists`;--> statement-breakpoint
DROP TABLE `lists`;--> statement-breakpoint
ALTER TABLE `__new_lists` RENAME TO `lists`;--> statement-breakpoint
CREATE TABLE `__new_prices` (
	`id` text PRIMARY KEY NOT NULL,
	`productId` text NOT NULL,
	`value` real NOT NULL,
	`storeName` text NOT NULL,
	`storeLocation` text,
	`observedAt` integer NOT NULL,
	`createdAt` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	`updatedAt` integer,
	`deletedAt` integer
);
--> statement-breakpoint
INSERT INTO `__new_prices`("id", "productId", "value", "storeName", "storeLocation", "observedAt", "createdAt", "updatedAt", "deletedAt") SELECT "id", "productId", "value", "storeName", "storeLocation", "observedAt", "createdAt", "updatedAt", "deletedAt" FROM `prices`;--> statement-breakpoint
DROP TABLE `prices`;--> statement-breakpoint
ALTER TABLE `__new_prices` RENAME TO `prices`;--> statement-breakpoint
CREATE TABLE `__new_products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`unit` text DEFAULT 'un' NOT NULL,
	`createdAt` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	`updatedAt` integer,
	`deletedAt` integer
);
--> statement-breakpoint
INSERT INTO `__new_products`("id", "name", "unit", "createdAt", "updatedAt", "deletedAt") SELECT "id", "name", "unit", "createdAt", "updatedAt", "deletedAt" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;