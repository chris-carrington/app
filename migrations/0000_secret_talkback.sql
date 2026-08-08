CREATE TABLE `Contact` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text,
	`sendNewsletter` integer DEFAULT true,
	`sendJobOpportunityEmails` integer DEFAULT false,
	`phoneNumber` text,
	`sendJobOpportunityTexts` integer DEFAULT false
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Contact_email_unique` ON `Contact` (`email`);--> statement-breakpoint
CREATE TABLE `ContactUsMessage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`message` text NOT NULL,
	`personId` integer NOT NULL,
	FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Person` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`contactId` integer NOT NULL,
	FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON UPDATE no action ON DELETE cascade
);
