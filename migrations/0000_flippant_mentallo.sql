CREATE TABLE `Contact` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`personId` integer NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer DEFAULT false,
	`sendNewsletter` integer DEFAULT true,
	`sendJobOpportunityEmails` integer DEFAULT false,
	`phoneNumber` text,
	`phoneNumberVerified` integer DEFAULT false,
	`sendJobOpportunityTexts` integer DEFAULT false,
	FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Contact__personId__unique` ON `Contact` (`personId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Contact__email__unique` ON `Contact` (`email`);--> statement-breakpoint
CREATE TABLE `ContactUsMessage` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`personId` integer NOT NULL,
	`message` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE cascade
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
	FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`statusId`) REFERENCES `LeadStatus`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `JobLead__statusId__index` ON `JobLead` (`statusId`);--> statement-breakpoint
CREATE UNIQUE INDEX `JobLead__jobId__unique` ON `JobLead` (`jobId`);--> statement-breakpoint
CREATE TABLE `JobStatus` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`description` text NOT NULL,
	`isActive` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Job__Client` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`jobId` integer NOT NULL,
	`clientId` integer NOT NULL,
	FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`clientId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `Job__Client__clientId__index` ON `Job__Client` (`clientId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Job__Client__jobId__clientId__unique` ON `Job__Client` (`jobId`,`clientId`);--> statement-breakpoint
CREATE TABLE `Job__Trade` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`jobId` integer NOT NULL,
	`tradeId` integer NOT NULL,
	FOREIGN KEY (`jobId`) REFERENCES `Job`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tradeId`) REFERENCES `Trade`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `Job__Trade__tradeId__index` ON `Job__Trade` (`tradeId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Job__Trade__jobId__tradeId__unique` ON `Job__Trade` (`jobId`,`tradeId`);--> statement-breakpoint
CREATE TABLE `LeadStatus` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`isActive` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `MagicToken` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`personId` integer NOT NULL,
	`tokenHash` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`used` integer DEFAULT false,
	FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `MagicToken__personId__index` ON `MagicToken` (`personId`);--> statement-breakpoint
CREATE INDEX `MagicToken__tokenHash__index` ON `MagicToken` (`tokenHash`);--> statement-breakpoint
CREATE TABLE `Objective` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`columnId` integer NOT NULL,
	`createdBy` integer NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`order` real NOT NULL,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`columnId`) REFERENCES `ObjectiveColumn`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`createdBy`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `Objective__columnId__index` ON `Objective` (`columnId`);--> statement-breakpoint
CREATE INDEX `Objective__order__index` ON `Objective` (`order`);--> statement-breakpoint
CREATE UNIQUE INDEX `Objective__title__unique` ON `Objective` (`title`);--> statement-breakpoint
CREATE TABLE `ObjectiveColumn` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`isActive` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ObjectiveComment` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`objectiveId` integer NOT NULL,
	`createdBy` integer NOT NULL,
	`value` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`objectiveId`) REFERENCES `Objective`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`createdBy`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ObjectiveComment__objectiveId__index` ON `ObjectiveComment` (`objectiveId`);--> statement-breakpoint
CREATE TABLE `ObjectiveComment__Assignee` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`commentId` integer NOT NULL,
	`personId` integer NOT NULL,
	FOREIGN KEY (`commentId`) REFERENCES `ObjectiveComment`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ObjectiveComment__Assignee__personId__index` ON `ObjectiveComment__Assignee` (`personId`);--> statement-breakpoint
CREATE UNIQUE INDEX `ObjectiveComment__Assignee__commentId__personId__unique` ON `ObjectiveComment__Assignee` (`commentId`,`personId`);--> statement-breakpoint
CREATE TABLE `ObjectiveTag` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`order` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Objective__Assignee` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`objectiveId` integer NOT NULL,
	`personId` integer NOT NULL,
	FOREIGN KEY (`objectiveId`) REFERENCES `Objective`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `Objective__Assignee__personId__index` ON `Objective__Assignee` (`personId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Objective__Assignee__objectiveId__personId__unique` ON `Objective__Assignee` (`objectiveId`,`personId`);--> statement-breakpoint
CREATE TABLE `Objective__Tag` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`objectiveId` integer NOT NULL,
	`tagId` integer NOT NULL,
	FOREIGN KEY (`objectiveId`) REFERENCES `Objective`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tagId`) REFERENCES `ObjectiveTag`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `Objective__Tag__tagId__index` ON `Objective__Tag` (`tagId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Objective__Tag__objectiveId__tagId__unique` ON `Objective__Tag` (`objectiveId`,`tagId`);--> statement-breakpoint
CREATE TABLE `Person` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`isActive` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Person__StaffPosition` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`personId` integer NOT NULL,
	`positionId` integer NOT NULL,
	`endReasonId` integer,
	`startDate` integer NOT NULL,
	`endDate` integer,
	FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`positionId`) REFERENCES `StaffPosition`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`endReasonId`) REFERENCES `StaffEndReason`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `Person__StaffPosition__positionId__index` ON `Person__StaffPosition` (`positionId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Person__StaffPosition__personId__positionId__unique` ON `Person__StaffPosition` (`personId`,`positionId`);--> statement-breakpoint
CREATE TABLE `Session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`personId` integer NOT NULL,
	`expiresAt` integer NOT NULL,
	`ipAddress` text NOT NULL,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `Session__personId__index` ON `Session` (`personId`);--> statement-breakpoint
CREATE TABLE `StaffEndReason` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`isActive` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `StaffLead` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`personId` integer NOT NULL,
	`statusId` integer NOT NULL,
	`positionId` integer NOT NULL,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`personId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`statusId`) REFERENCES `LeadStatus`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`positionId`) REFERENCES `StaffPosition`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `StaffPosition` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`isHiring` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Trade` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`isActive` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Trade__JobLead` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tradeId` integer NOT NULL,
	`jobLeadId` integer NOT NULL,
	FOREIGN KEY (`tradeId`) REFERENCES `Trade`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`jobLeadId`) REFERENCES `JobLead`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `Trade__JobLead__jobLeadId__index` ON `Trade__JobLead` (`jobLeadId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Trade__JobLead__tradeId__jobLeadId__unique` ON `Trade__JobLead` (`tradeId`,`jobLeadId`);