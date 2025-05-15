ALTER TABLE `habits` ADD `notificationIds` text DEFAULT (json_array()) NOT NULL;--> statement-breakpoint
ALTER TABLE `habits` ADD `isArchived` integer DEFAULT false NOT NULL;