CREATE TABLE `ObjectiveActivity` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`objectiveId` integer NOT NULL,
	`typeId` integer NOT NULL,
	`actorId` integer,
	`assigneeId` integer,
	`fromColumnId` integer,
	`toColumnId` integer,
	`tagId` integer,
	`commentId` integer,
	`createdAt` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	FOREIGN KEY (`objectiveId`) REFERENCES `Objective`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`typeId`) REFERENCES `ObjectiveActivityType`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`actorId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`assigneeId`) REFERENCES `Person`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`fromColumnId`) REFERENCES `ObjectiveColumn`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`toColumnId`) REFERENCES `ObjectiveColumn`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`tagId`) REFERENCES `ObjectiveTag`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`commentId`) REFERENCES `ObjectiveComment`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `ObjectiveActivity__objectiveId__createdAt__index` ON `ObjectiveActivity` (`objectiveId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `ObjectiveActivity__typeId__index` ON `ObjectiveActivity` (`typeId`);--> statement-breakpoint
CREATE INDEX `ObjectiveActivity__actorId__index` ON `ObjectiveActivity` (`actorId`);--> statement-breakpoint
CREATE INDEX `ObjectiveActivity__assigneeId__index` ON `ObjectiveActivity` (`assigneeId`);--> statement-breakpoint
CREATE INDEX `ObjectiveActivity__tagId__index` ON `ObjectiveActivity` (`tagId`);--> statement-breakpoint
CREATE INDEX `ObjectiveActivity__commentId__index` ON `ObjectiveActivity` (`commentId`);--> statement-breakpoint
CREATE TABLE `ObjectiveActivityType` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`value` text NOT NULL,
	`isActive` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ObjectiveActivityType_value_unique` ON `ObjectiveActivityType` (`value`);