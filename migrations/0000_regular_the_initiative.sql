CREATE TABLE `Contact` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`sendNewsletter` integer DEFAULT true,
	`sendJobOpportunityEmails` integer DEFAULT false,
	`phoneNumber` text,
	`sendJobOpportunityTexts` integer DEFAULT false
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
CREATE INDEX `Job__statusId__index` ON `Job` (`statusId`);--> statement-breakpoint
CREATE TABLE `JobLead` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`personId` integer NOT NULL,
	`statusId` integer NOT NULL,
	`jobId` integer,
	`description` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`statusId`) REFERENCES `LeadStatus`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `JobLead__statusId__index` ON `JobLead` (`statusId`);--> statement-breakpoint
CREATE UNIQUE INDEX `JobLead__jobId__unique` ON `JobLead` (`jobId`);--> statement-breakpoint
CREATE TABLE `JobStatus` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`isActive` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `Job__Client` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`jobId` integer NOT NULL,
	`clientId` integer NOT NULL,
	FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`clientId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `Job__Client__jobId__index` ON `Job__Client` (`jobId`);--> statement-breakpoint
CREATE INDEX `Job__Client__clientId__index` ON `Job__Client` (`clientId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Job__Client__jobId__clientId__unique` ON `Job__Client` (`jobId`,`clientId`);--> statement-breakpoint
CREATE TABLE `Job__Trade` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`jobId` integer NOT NULL,
	`tradeId` integer NOT NULL,
	FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tradeId`) REFERENCES `Trade`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `Job__Trade__tradeId__index` ON `Job__Trade` (`tradeId`);--> statement-breakpoint
CREATE INDEX `Job__Trade__jobId__index` ON `Job__Trade` (`jobId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Job__Trade__jobId__tradeId__unique` ON `Job__Trade` (`jobId`,`tradeId`);--> statement-breakpoint
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
CREATE TABLE `Person__StaffPosition` (
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
CREATE INDEX `Person__StaffPosition__personId__index` ON `Person__StaffPosition` (`personId`);--> statement-breakpoint
CREATE INDEX `Person__StaffPosition__positionId__index` ON `Person__StaffPosition` (`positionId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Person__StaffPosition__personId__positionId__unique` ON `Person__StaffPosition` (`personId`,`positionId`);--> statement-breakpoint
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
	`isActive` integer DEFAULT true,
	`isHiring` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `Trade` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`isActive` integer DEFAULT true
);
--> statement-breakpoint
CREATE TABLE `Trade__JobLead` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tradeId` integer NOT NULL,
	`jobLeadId` integer NOT NULL,
	FOREIGN KEY (`tradeId`) REFERENCES `Trade`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`jobLeadId`) REFERENCES `JobLead`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `Trade__JobLead__tradeId__index` ON `Trade__JobLead` (`tradeId`);--> statement-breakpoint
CREATE INDEX `Trade__JobLead__jobLeadId__index` ON `Trade__JobLead` (`jobLeadId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Trade__JobLead__tradeId__jobLeadId__unique` ON `Trade__JobLead` (`tradeId`,`jobLeadId`);