// TypeScript data model for infection control precautions
export interface InfectionControlPrecaution {
    id: number;
    name: string;
    description: string;
    primaryCategory: string;
    escalationRules: string;
    backgroundInfo: {
        virulence: string;
        colonization: string;
        biofilm: string;
    };
}

// Example list of precautions
export const precautions: InfectionControlPrecaution[] = [{
    id: 1,
    name: 'Hand Hygiene',
    description: 'Proper handwashing techniques and protocols.',
    primaryCategory: 'Basic',
    escalationRules: 'If contact with bodily fluids is expected.',
    backgroundInfo: {
        virulence: 'Low',
        colonization: 'Common in many environments',
        biofilm: 'Not applicable'
    }
}];