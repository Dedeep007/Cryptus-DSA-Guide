CREATE TABLE `doubt_responses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`doubt_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`response` text NOT NULL,
	`is_mentor` integer DEFAULT false,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `doubts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`problem_id` integer,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`code` text,
	`status` text DEFAULT 'open',
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `problems` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`topic_id` integer NOT NULL,
	`title` text NOT NULL,
	`difficulty` text NOT NULL,
	`description` text NOT NULL,
	`initial_code` text NOT NULL,
	`test_cases` text NOT NULL,
	`concept_explanation` text NOT NULL,
	`worked_example` text NOT NULL,
	`order` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`problem_id` integer NOT NULL,
	`code` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `topics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`order` integer NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `topics_slug_unique` ON `topics` (`slug`);