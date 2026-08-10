CREATE INDEX `Job__Client__jobId__index` ON `Job__Client` (`jobId`);--> statement-breakpoint
CREATE INDEX `Job__Client__clientId__index` ON `Job__Client` (`clientId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Job__Client__jobId__clientId__unique` ON `Job__Client` (`jobId`,`clientId`);--> statement-breakpoint
CREATE INDEX `Trade__ServiceLead__tradeId__index` ON `Trade__ServiceLead` (`tradeId`);--> statement-breakpoint
CREATE INDEX `Trade__ServiceLead__serviceLeadId__index` ON `Trade__ServiceLead` (`serviceLeadId`);--> statement-breakpoint
CREATE UNIQUE INDEX `Trade__ServiceLead__tradeId__serviceLeadId__unique` ON `Trade__ServiceLead` (`tradeId`,`serviceLeadId`);