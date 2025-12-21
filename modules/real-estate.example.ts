/**
 * Real Estate Module Example
 *
 * This file demonstrates how to create a snap-in module using the Module SDK.
 * Once the core platform is complete, this will be moved to apps/modules/real-estate/
 */

import { createModule, type ModuleDefinition } from '../packages/module-sdk/src';

export const realEstateModule: ModuleDefinition = createModule({
  // ============================================================================
  // Module Identity
  // ============================================================================
  metadata: {
    id: 'real-estate',
    name: 'Real Estate Hunter',
    description: 'Smart property search and comparison for houses, apartments, and commercial spaces. Capture tours, compare properties, and make confident decisions.',
    icon: '🏠',
    version: '1.0.0',
    author: 'Keven Markham',
    category: 'major-purchase',
    tags: ['property', 'housing', 'real-estate', 'apartments', 'commercial'],
    isPremium: false
  },

  // ============================================================================
  // Custom Fields for Properties
  // ============================================================================
  fields: [
    // Basic Property Info
    {
      key: 'address',
      label: 'Property Address',
      type: 'text',
      required: true,
      placeholder: '123 Main Street, City, State ZIP',
      showInComparison: true,
      icon: '📍',
      helpText: 'Full property address (auto-detected via GPS if available)'
    },
    {
      key: 'price',
      label: 'Asking Price',
      type: 'number',
      required: true,
      placeholder: '450000',
      showInComparison: true,
      icon: '💰',
      helpText: 'Listed price in dollars'
    },
    {
      key: 'propertyType',
      label: 'Property Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Single Family Home', value: 'house' },
        { label: 'Condo', value: 'condo' },
        { label: 'Townhouse', value: 'townhouse' },
        { label: 'Apartment', value: 'apartment' },
        { label: 'Multi-Family', value: 'multi-family' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Land', value: 'land' }
      ],
      defaultValue: 'house',
      showInComparison: true,
      icon: '🏘️'
    },

    // Property Specs
    {
      key: 'bedrooms',
      label: 'Bedrooms',
      type: 'number',
      placeholder: '3',
      showInComparison: true,
      icon: '🛏️'
    },
    {
      key: 'bathrooms',
      label: 'Bathrooms',
      type: 'number',
      placeholder: '2',
      showInComparison: true,
      icon: '🚿'
    },
    {
      key: 'squareFeet',
      label: 'Square Footage',
      type: 'number',
      placeholder: '1800',
      showInComparison: true,
      icon: '📐'
    },
    {
      key: 'lotSize',
      label: 'Lot Size',
      type: 'text',
      placeholder: '0.25 acres',
      showInComparison: true,
      icon: '🌳'
    },
    {
      key: 'yearBuilt',
      label: 'Year Built',
      type: 'number',
      placeholder: '2010',
      showInComparison: true,
      icon: '📅'
    },

    // Financial Details
    {
      key: 'hoaFees',
      label: 'HOA Fees (Monthly)',
      type: 'number',
      placeholder: '250',
      showInComparison: true,
      icon: '🏛️',
      helpText: 'Homeowners Association fees per month'
    },
    {
      key: 'propertyTax',
      label: 'Annual Property Tax',
      type: 'number',
      placeholder: '5000',
      showInComparison: true,
      icon: '💸'
    },

    // People & Logistics
    {
      key: 'realtorName',
      label: 'Realtor/Agent Name',
      type: 'text',
      placeholder: 'Jane Smith',
      icon: '👤'
    },
    {
      key: 'realtorPhone',
      label: 'Realtor Phone',
      type: 'text',
      placeholder: '555-123-4567',
      icon: '📞'
    },
    {
      key: 'realtorEmail',
      label: 'Realtor Email',
      type: 'text',
      placeholder: 'jane@realestate.com',
      icon: '📧'
    },
    {
      key: 'listingUrl',
      label: 'Listing URL',
      type: 'url',
      placeholder: 'https://zillow.com/...',
      icon: '🔗',
      helpText: 'Link to Zillow, Redfin, or other listing'
    },

    // Additional Features
    {
      key: 'parkingSpaces',
      label: 'Parking Spaces',
      type: 'number',
      placeholder: '2',
      showInComparison: true,
      icon: '🚗'
    },
    {
      key: 'hasGarage',
      label: 'Has Garage',
      type: 'boolean',
      defaultValue: false,
      showInComparison: true,
      icon: '🏠'
    },
    {
      key: 'hasBasement',
      label: 'Has Basement',
      type: 'boolean',
      defaultValue: false,
      showInComparison: true,
      icon: '⬇️'
    },
    {
      key: 'neighborhood',
      label: 'Neighborhood',
      type: 'text',
      placeholder: 'Downtown, Suburbs, etc.',
      showInComparison: true,
      icon: '🏘️'
    },
    {
      key: 'schoolDistrict',
      label: 'School District',
      type: 'text',
      placeholder: 'City School District',
      icon: '🎓'
    }
  ],

  // ============================================================================
  // Pre-configured Templates
  // ============================================================================
  templates: [
    {
      id: 'house-viewing',
      name: 'House Viewing',
      description: 'For touring single-family homes',
      icon: '🏡',
      defaultValues: {
        propertyType: 'house'
      },
      fields: ['address', 'price', 'bedrooms', 'bathrooms', 'squareFeet', 'lotSize', 'yearBuilt', 'realtorName']
    },
    {
      id: 'apartment-tour',
      name: 'Apartment/Condo Tour',
      description: 'For touring apartments, condos, and townhouses',
      icon: '🏢',
      defaultValues: {
        propertyType: 'apartment'
      },
      fields: ['address', 'price', 'bedrooms', 'bathrooms', 'squareFeet', 'hoaFees', 'parkingSpaces', 'realtorName']
    },
    {
      id: 'commercial-property',
      name: 'Commercial Property',
      description: 'For office, retail, or industrial spaces',
      icon: '🏬',
      defaultValues: {
        propertyType: 'commercial'
      },
      fields: ['address', 'price', 'squareFeet', 'propertyTax', 'realtorName', 'listingUrl']
    },
    {
      id: 'land-viewing',
      name: 'Land/Lot Viewing',
      description: 'For vacant land and building lots',
      icon: '🌄',
      defaultValues: {
        propertyType: 'land'
      },
      fields: ['address', 'price', 'lotSize', 'neighborhood', 'realtorName']
    }
  ],

  // ============================================================================
  // Custom Actions
  // ============================================================================
  actions: [
    {
      id: 'compare-properties',
      label: 'Compare Properties',
      icon: '📊',
      placement: 'toolbar',
      handler: async (context) => {
        // Trigger comparison view for selected properties
        console.log('Comparing properties:', context.selectedTranscripts);
      },
      disabled: (context) => {
        // Disable if less than 2 properties selected
        return !context.selectedTranscripts || context.selectedTranscripts.length < 2;
      }
    },
    {
      id: 'calculate-affordability',
      label: 'Calculate Affordability',
      icon: '💵',
      placement: 'detail-view',
      handler: async (context) => {
        const price = context.currentTranscript?.metadata?.moduleData?.price;
        const budget = context.userProfile?.preferences?.budget;

        if (price && budget) {
          const affordable = price <= budget.max && price >= budget.min;
          alert(affordable ? 'Within your budget! ✅' : 'Outside your budget range ⚠️');
        }
      }
    },
    {
      id: 'share-with-partner',
      label: 'Share with Partner',
      icon: '👥',
      placement: 'detail-view',
      handler: async (context) => {
        // Generate shareable link
        console.log('Sharing property:', context.currentTranscript);
      }
    },
    {
      id: 'export-comparison',
      label: 'Export Comparison Spreadsheet',
      icon: '📄',
      placement: 'toolbar',
      handler: async (context) => {
        // Export selected properties to Excel
        console.log('Exporting:', context.selectedTranscripts);
      }
    }
  ],

  // ============================================================================
  // Custom Export Formats
  // ============================================================================
  exportFormats: [
    {
      id: 'property-comparison',
      name: 'Property Comparison Spreadsheet',
      extension: 'csv',
      mimeType: 'text/csv',
      icon: '📊',
      export: async (data) => {
        // Generate CSV with property comparisons
        const headers = ['Address', 'Price', 'Beds', 'Baths', 'Sq Ft', 'Rating'].join(',');
        const row = [
          data.metadata.moduleData?.address || '',
          data.metadata.moduleData?.price || '',
          data.metadata.moduleData?.bedrooms || '',
          data.metadata.moduleData?.bathrooms || '',
          data.metadata.moduleData?.squareFeet || '',
          data.metadata.rating || ''
        ].join(',');

        return headers + '\n' + row;
      }
    },
    {
      id: 'property-report',
      name: 'Property Report',
      extension: 'pdf',
      mimeType: 'application/pdf',
      icon: '📄',
      export: async (data) => {
        // Generate PDF report with property details, pros/cons, transcript
        return new Blob(['PDF content would go here'], { type: 'application/pdf' });
      }
    }
  ],

  // ============================================================================
  // AI Enhancements
  // ============================================================================
  aiEnhancements: [
    {
      id: 'property-comparison',
      name: 'Property Comparison Analysis',
      description: 'Compare multiple properties and provide insights',
      promptTemplate: `You are a real estate advisor helping someone choose between properties.

User Profile:
- Budget: {userBudget}
- Preferred lifestyle: {userLifestyle}
- Priorities: {userPriorities}

Properties being compared:
{propertyList}

Based on the transcripts from property viewings, provide:
1. A brief summary of each property's strengths and weaknesses
2. Which property best matches the user's profile and why
3. Any red flags or concerns detected in the realtor's commentary
4. Questions the user should ask before making a decision

Format your response as JSON with keys: summary, recommendation, redFlags, questions`,
      processResponse: (response, transcript) => {
        try {
          return JSON.parse(response);
        } catch {
          return { summary: response };
        }
      },
      trigger: 'on-demand',
      autoRun: false
    },
    {
      id: 'property-pros-cons',
      name: 'Pros & Cons Extraction',
      description: 'Extract pros and cons from viewing transcript',
      promptTemplate: `Analyze this property viewing transcript and extract:

1. PROS (positive aspects mentioned by realtor or user)
2. CONS (negative aspects, concerns, or issues)

Include timestamps when possible.

Transcript:
{transcriptText}

Format as JSON: { "pros": [...], "cons": [...] }`,
      processResponse: (response) => {
        try {
          return JSON.parse(response);
        } catch {
          return { pros: [], cons: [] };
        }
      },
      trigger: 'on-upload',
      autoRun: true
    },
    {
      id: 'question-generator',
      name: 'Follow-up Questions',
      description: 'Generate important questions to ask the realtor',
      promptTemplate: `Based on this property viewing transcript, generate a list of important follow-up questions the buyer should ask the realtor or seller.

Focus on:
- Things mentioned but not fully explained
- Potential issues or concerns
- Important details not discussed
- Financial aspects (taxes, HOA, utilities, etc.)
- Maintenance and repair history

Transcript:
{transcriptText}

Property details:
{propertyData}

Return a JSON array of questions: ["question 1", "question 2", ...]`,
      processResponse: (response) => {
        try {
          const questions = JSON.parse(response);
          return { questions: Array.isArray(questions) ? questions : [] };
        } catch {
          return { questions: [] };
        }
      },
      trigger: 'on-upload',
      autoRun: true
    },
    {
      id: 'red-flag-detection',
      name: 'Red Flag Detection',
      description: 'Detect potential issues or concerning patterns',
      promptTemplate: `Analyze this property viewing transcript for potential red flags or concerns:

1. Evasive answers from the realtor
2. Repeated mentions of problems or issues
3. Unusual urgency or pressure tactics
4. Inconsistencies in information
5. Structural or maintenance concerns
6. Neighborhood issues

Transcript:
{transcriptText}

Return JSON: { "redFlags": [{"type": "...", "description": "...", "severity": "low|medium|high"}] }`,
      processResponse: (response) => {
        try {
          return JSON.parse(response);
        } catch {
          return { redFlags: [] };
        }
      },
      trigger: 'on-upload',
      autoRun: true
    }
  ],

  // ============================================================================
  // Module Settings
  // ============================================================================
  settings: [
    {
      key: 'autoDetectAddress',
      label: 'Auto-detect address via GPS',
      type: 'boolean',
      defaultValue: true,
      helpText: 'Automatically fill address field using device location'
    },
    {
      key: 'autoRunAIAnalysis',
      label: 'Automatically run AI analysis after recording',
      type: 'boolean',
      defaultValue: true,
      helpText: 'Generate pros/cons and questions immediately after viewing'
    },
    {
      key: 'showPropertyPhotos',
      label: 'Link property photos to transcript',
      type: 'boolean',
      defaultValue: true,
      helpText: 'Match photos to transcript timestamps'
    },
    {
      key: 'budgetWarnings',
      label: 'Warn if property exceeds budget',
      type: 'boolean',
      defaultValue: true,
      helpText: 'Show alert if property price is outside your budget range'
    }
  ],

  // ============================================================================
  // Lifecycle Hooks
  // ============================================================================
  hooks: {
    onActivate: async () => {
      console.log('Real Estate module activated!');
      // Could initialize any necessary data, check for GPS permissions, etc.
    },

    onDeactivate: async () => {
      console.log('Real Estate module deactivated');
    },

    onTranscriptCreate: async (transcript) => {
      console.log('New property viewing created:', transcript.metadata.fileName);

      // Check if property is within budget
      const price = transcript.metadata.moduleData?.price;
      // const budget = userProfile?.preferences?.budget;
      // if (price && budget && (price > budget.max || price < budget.min)) {
      //   showBudgetWarning(price, budget);
      // }
    },

    onTranscriptUpdate: async (transcript, updates) => {
      console.log('Property updated:', updates);
    },

    onProfileUpdate: async (profile) => {
      console.log('User profile updated, may affect property recommendations');
    }
  }
});

// Export for module registry
export default realEstateModule;
