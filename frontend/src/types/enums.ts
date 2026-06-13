export enum RequirementStatus {
  Draft = 'draft',
  Open = 'open',
  Bidding = 'bidding',
  InProgress = 'in_progress',
  PendingReview = 'pending_review',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

export enum BidStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
  Withdrawn = 'withdrawn'
}

export enum ContractStatus {
  PendingSign = 'pending_sign',
  Active = 'active',
  PendingReview = 'pending_review',
  Completed = 'completed',
  Terminated = 'terminated'
}

export enum UserRole {
  Client = 'client',
  Freelancer = 'freelancer',
  Dual = 'dual'
}

export enum PaymentMode {
  Milestone = 'milestone',
  OneTime = 'one_time'
}

export enum NotificationType {
  BidAccepted = 'bid_accepted',
  ContractSigned = 'contract_signed',
  ContractCompleted = 'contract_completed',
  ContractTerminated = 'contract_terminated'
}

export enum NotificationRelatedType {
  Requirement = 'requirement',
  Contract = 'contract',
  Bid = 'bid'
}
