DROP INDEX `Session__refreshTokenHash__index`;--> statement-breakpoint
ALTER TABLE `Session` ADD `createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL;--> statement-breakpoint
ALTER TABLE `Session` DROP COLUMN `refreshTokenHash`;