CREATE TABLE `MagicToken` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`personId` integer NOT NULL,
	`tokenHash` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`used` integer DEFAULT false,
	FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `MagicToken__personId__index` ON `MagicToken` (`personId`);--> statement-breakpoint
CREATE INDEX `MagicToken__tokenHash__index` ON `MagicToken` (`tokenHash`);--> statement-breakpoint
CREATE TABLE `Session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`personId` integer NOT NULL,
	`refreshTokenHash` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`ipAddress` text NOT NULL,
	FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `Session__personId__index` ON `Session` (`personId`);--> statement-breakpoint
CREATE INDEX `Session__refreshTokenHash__index` ON `Session` (`refreshTokenHash`);--> statement-breakpoint
ALTER TABLE `Contact` ADD `emailVerified` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `Contact` ADD `phoneNumberVerified` integer DEFAULT false;