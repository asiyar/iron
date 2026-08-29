CREATE TABLE `aiRecommendations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sourceFingerprint` varchar(64) NOT NULL,
	`recommendationJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aiRecommendations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coachPrograms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`authorId` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`summary` text NOT NULL,
	`goal` varchar(120) NOT NULL,
	`visibility` enum('private_link','public') NOT NULL DEFAULT 'private_link',
	`shareCode` varchar(32) NOT NULL,
	`templateJson` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coachPrograms_id` PRIMARY KEY(`id`),
	CONSTRAINT `coachPrograms_shareCode_unique` UNIQUE(`shareCode`)
);
