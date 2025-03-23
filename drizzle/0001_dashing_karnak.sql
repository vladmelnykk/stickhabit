PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_habits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`daysOfWeek` text NOT NULL,
	`timesPerDay` integer DEFAULT (json_array()) NOT NULL,
	`color` text NOT NULL,
	`notificationTime` text DEFAULT (json_array()) NOT NULL,
	`completedDates` text DEFAULT (json_array()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_habits`("id", "title", "daysOfWeek", "timesPerDay", "color", "notificationTime", "completedDates") SELECT "id", "title", "daysOfWeek", "timesPerDay", "color", "notificationTime", "completedDates" FROM `habits`;--> statement-breakpoint
DROP TABLE `habits`;--> statement-breakpoint
ALTER TABLE `__new_habits` RENAME TO `habits`;--> statement-breakpoint
PRAGMA foreign_keys=ON;