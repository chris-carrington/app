CREATE TABLE `Contact` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`sendNewsletter` integer DEFAULT true,
	`sendJobOpportunityEmails` integer DEFAULT false,
	`phoneNumber` text,
	`sendJobOpportunityTexts` integer DEFAULT false,
	`sendServiceEmails` integer DEFAULT false
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Contact_email_unique` ON `Contact` (`email`);--> statement-breakpoint
CREATE TABLE `ContactUsMessage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`personId` integer NOT NULL,
	`message` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Job` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`statusId` integer NOT NULL,
	`description` text,
	`address` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`statusId`) REFERENCES `JobStatus`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `JobStatus` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`isActive` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `Job__Client` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clientId` integer NOT NULL,
	`jobId` integer NOT NULL,
	FOREIGN KEY (`clientId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `LeadStatus` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`isActive` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `Person` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`contactId` integer NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ServiceLead` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`personId` integer NOT NULL,
	`statusId` integer NOT NULL,
	`jobId` integer,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`statusId`) REFERENCES `LeadStatus`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `StaffEndReason` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`isActive` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `StaffLead` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`personId` integer NOT NULL,
	`statusId` integer NOT NULL,
	`positionId` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`statusId`) REFERENCES `LeadStatus`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`positionId`) REFERENCES `StaffPosition`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `StaffPosition` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`isActive` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `StaffTemporal` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`personId` integer NOT NULL,
	`positionId` integer NOT NULL,
	`endReasonId` integer,
	`startDate` integer NOT NULL,
	`endDate` integer,
	FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`positionId`) REFERENCES `StaffPosition`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`endReasonId`) REFERENCES `StaffEndReason`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Trade` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`isActive` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `Trade__ServiceLead` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tradeId` integer NOT NULL,
	`serviceLeadId` integer NOT NULL,
	FOREIGN KEY (`tradeId`) REFERENCES `Trade`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`serviceLeadId`) REFERENCES `ServiceLead`(`id`) ON UPDATE no action ON DELETE no action
);
