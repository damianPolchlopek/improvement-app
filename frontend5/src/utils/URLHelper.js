export const APP = "/app";

export const TRAINING = "training";
export const VIEW = "view";
export const EXERCISES = "exercises";
export const MAXIMUM = "maximum";
export const ADD = "add";
export const STATISTICS = "statistics";

export const HomeViewUrl = `${APP}/`;

export const TrainingViewUrl = `${APP}/${TRAINING}/${VIEW}`;
export const ExerciseViewUrl = `${APP}/${TRAINING}/${EXERCISES}`;
export const MaximumExerciseViewUrl = `${APP}/${TRAINING}/${MAXIMUM}`;
export const TrainingAddUrl = `${APP}/${TRAINING}/${ADD}`;
export const TrainingStatisticUrl = `${APP}/${TRAINING}/${STATISTICS}`;

export const FOOD = "food";
export const EDIT = "edit";
export const PRODUCTS = "products";

export const FoodViewUrl = `${APP}/${FOOD}/${VIEW}`;
export const FoodAddUrl = `${APP}/${FOOD}/${ADD}`;
export const CalculateIngredientsUrl = `${APP}/${FOOD}/${STATISTICS}`;
export const FoodProductUrl = `${APP}/${FOOD}/${PRODUCTS}`;

export const OTHER = "other";
export const SHOPPING = "shopping";
export const WEEKLY = "weekly";
export const DAILY = "daily";

export const ShoppingViewUrl = `${APP}/${OTHER}/${SHOPPING}`;
export const WeeklyViewUrl = `${APP}/${OTHER}/${WEEKLY}`;
export const DailyViewUrl = `${APP}/${OTHER}/${DAILY}`;

export const LoginUrl = `/login`;
export const SignUpUrl = `/sign-up`;
export const LogoutUrl = `/logout`;
export const VerifyEmailUrl = `/verify-email`;

export const FINANCE = "finance";
export const INFORMATION = "information";

export const FinanceViewUrl = `${APP}/${FINANCE}/${VIEW}`;
export const FinanceConfigUrl = `${APP}/${FINANCE}/${INFORMATION}`;

export const PROJECTS = "projects";
export const TimerChallenge = "timer-challenge";
export const HolidayPicker = "vacations";

export const TimerChallengeUrl = `${APP}/${PROJECTS}/${TimerChallenge}`;
export const HolidayPickerUrl = `${APP}/${PROJECTS}/${HolidayPicker}`;

export const AUDIT = "audit";
export const AuditFoodUrl = `${APP}/${AUDIT}`;