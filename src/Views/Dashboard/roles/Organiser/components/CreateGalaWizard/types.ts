export interface WizardGrant {
  name: string;
  prizeAmount: number;
  slots: number;
}

export interface WizardJuryAssignment {
  name: string;
  expertise: string;
  email: string;
}

export interface CreateGalaWizardValues {
  name: string;
  venue: string;
  city: string;
  eventDate: string;
  expectedAttendees: number;
  notes: string;
  grants: WizardGrant[];
  juryAssignments: WizardJuryAssignment[];
}
