CREATE TABLE `habits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`daysOfWeek` text NOT NULL,
	`timesPerDay` integer NOT NULL,
	`color` text NOT NULL,
	`notificationTime` text,
	`completedDates` text NOT NULL
);
