/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: chatmessages
 * Interface for ChatMessages
 */
export interface ChatMessages {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  userMessageText?: string;
  /** @wixFieldType text */
  aiResponseText?: string;
  /** @wixFieldType datetime */
  timestamp?: Date | string;
  /** @wixFieldType text */
  senderType?: string;
  /** @wixFieldType text */
  conversationId?: string;
  /** @wixFieldType text */
  modelUsed?: string;
}


/**
 * Collection ID: curatedexercises
 * Interface for CuratedExercises
 */
export interface CuratedExercises {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  exerciseName?: string;
  /** @wixFieldType url */
  youtubeLink?: string;
  /** @wixFieldType text */
  suitableBodyShapes?: string;
  /** @wixFieldType text */
  focusBodyAreas?: string;
  /** @wixFieldType text */
  fitnessGoal?: string;
  /** @wixFieldType number */
  durationMinutes?: number;
  /** @wixFieldType text */
  difficultyLevel?: string;
  /** @wixFieldType text */
  description?: string;
}


/**
 * Collection ID: healthyrecipes
 * Interface for HealthyRecipesandSnacks
 */
export interface HealthyRecipesandSnacks {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType number */
  cookTime?: number;
  /** @wixFieldType text */
  recipeName?: string;
  /** @wixFieldType number */
  prepTime?: number;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  ingredients?: string;
  /** @wixFieldType text */
  instructions?: string;
  /** @wixFieldType number */
  caloriesPerServing?: number;
  /** @wixFieldType url */
  videoLink?: string;
  /** @wixFieldType image */
  dishImage?: string;
}


/**
 * Collection ID: teammembers
 * Interface for TeamMembers
 */
export interface TeamMembers {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  school?: string;
  /** @wixFieldType text */
  name?: string;
  /** @wixFieldType text */
  role?: string;
  /** @wixFieldType text */
  bio?: string;
  /** @wixFieldType image */
  photo?: string;
  /** @wixFieldType url */
  socialLink?: string;
}

