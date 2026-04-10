/**
 * Project Enums - Synchronized with Backend Inventory
 */

export enum AdminUserHistoryFilter {
  All = 1,
  Grants = 2,
  Galas = 3,
}

export enum ApplicationListView {
  All = 1,
  Pending = 2,
  Approved = 3,
  Rejected = 4,
  PastEvents = 5,
}

export enum AdminPermission {
  ManageUsers = 1,
  ManageGalasAndGrants = 2,
  ReviewApplications = 3,
  ManageAdmins = 4,
}

export enum AdminRole {
  SuperAdmin = 1,
  SubAdmin = 2,
}

export enum BlockchainOperation {
  Subscribe = 1,
  RenewSubscription = 2,
  UpdateSubscription = 3,
  CancelSubscription = 4,
  CreateGrant = 5,
  CancelGrant = 6,
  ApplyForGrant = 7,
  ReleaseGrants = 8,
  UpdateGrantDeadline = 9,
  ActiveFlipSwitch = 10,
  PublishFlipSwitch = 11,
  AddPlan = 12,
  UpdatePlan = 13,
  AdminCancelSubscription = 14,
}

export enum GalaStatus {
  Draft = 1,
  Upcoming = 2,
  Active = 3,
  Completed = 4,
}

export enum GrantApplicationStatus {
  Draft = 1,
  Pending = 2,
  InReview = 3,
  Approved = 4,
  Rejected = 5,
  Winner = 6,
  ApprovedForInterview = 7,
}

export enum GrantStatus {
  Draft = 1,
  Upcoming = 2,
  Active = 3,
  Completed = 4,
  Closed = 5,
}

export enum InterviewScheduledBy {
  Applicant = 1,
  Admin = 2,
}

export enum JuryCriteriaType {
  Custom = 0,
  BusinessViability = 1,
  FinancialPotential = 2,
  MarketSize = 3,
  RevenueTrackRecord = 4,
  TeamExperience = 5,
  LeadershipQuality = 6,
  TeamDiversity = 7,
  InnovationLevel = 8,
  TechnicalFeasibility = 9,
  Scalability = 10,
  CompetitiveAdvantage = 11,
  SocialImpact = 12,
  EnvironmentalResponsibility = 13,
  CommunityEngagement = 14,
}

export enum NotificationChannel {
  InApp = 1,
  Sms = 2,
  Email = 3,
  All = 4,
}

export enum RejectionReason {
  IncompleteApplication = 1,
  NotEligible = 2,
  LowScore = 3,
  Other = 4,
}

export enum SubscriptionBillingCycle {
  None = 0,
  Monthly = 1,
  Yearly = 2,
}

export enum SubscriptionPlan {
  Free = 1,
  Pro = 2,
}

export enum SubscriptionStatus {
  Active = 1,
  Inactive = 2,
}

export enum TargetAudience {
  Users = 1,
  Admins = 2,
  Jury = 3,
}
