import { ReactNode, ComponentType } from 'react';

/**
 * Module Metadata
 * Describes the module's identity and capabilities
 */
export interface ModuleMetadata {
  /** Unique identifier for the module (e.g., "real-estate", "vehicle-hunter") */
  id: string;

  /** Display name shown to users */
  name: string;

  /** Short description of what this module does */
  description: string;

  /** Icon component or emoji for UI display */
  icon: string | ComponentType;

  /** Module version */
  version: string;

  /** Module author */
  author: string;

  /** Category for organization (e.g., "major-purchase", "education", "business") */
  category: ModuleCategory;

  /** Tags for search and filtering */
  tags?: string[];

  /** Is this module a premium/paid feature? */
  isPremium?: boolean;
}

export type ModuleCategory =
  | 'major-purchase'
  | 'education'
  | 'business'
  | 'travel'
  | 'personal'
  | 'productivity'
  | 'other';

/**
 * Module Configuration Schema
 * Defines what custom fields/metadata this module adds to transcripts
 */
export interface ModuleFieldSchema {
  /** Field identifier */
  key: string;

  /** Display label */
  label: string;

  /** Field type */
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'textarea' | 'boolean' | 'url';

  /** Is this field required? */
  required?: boolean;

  /** Placeholder text */
  placeholder?: string;

  /** Options for select/multiselect */
  options?: Array<{ label: string; value: string }>;

  /** Default value */
  defaultValue?: any;

  /** Validation rules */
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };

  /** Help text */
  helpText?: string;

  /** Should this field be shown in comparison views? */
  showInComparison?: boolean;

  /** Custom icon for this field */
  icon?: string | ComponentType;
}

/**
 * Module Template
 * Pre-configured templates for different scenarios within a module
 */
export interface ModuleTemplate {
  /** Template identifier */
  id: string;

  /** Template name */
  name: string;

  /** Template description */
  description?: string;

  /** Icon for the template */
  icon?: string | ComponentType;

  /** Pre-filled values for fields */
  defaultValues?: Record<string, any>;

  /** Which fields to show/hide */
  fields?: string[];
}

/**
 * Module Actions
 * Custom actions/buttons the module can provide
 */
export interface ModuleAction {
  /** Action identifier */
  id: string;

  /** Action label */
  label: string;

  /** Action icon */
  icon?: string | ComponentType;

  /** Where should this action appear? */
  placement: 'toolbar' | 'context-menu' | 'detail-view' | 'list-view';

  /** Action handler */
  handler: (context: ModuleActionContext) => void | Promise<void>;

  /** Should this action be disabled? */
  disabled?: boolean | ((context: ModuleActionContext) => boolean);

  /** Keyboard shortcut */
  shortcut?: string;
}

export interface ModuleActionContext {
  /** Selected transcript(s) */
  selectedTranscripts?: string[];

  /** Current transcript being viewed */
  currentTranscript?: any;

  /** User profile */
  userProfile?: any;

  /** Module-specific data */
  moduleData?: any;
}

/**
 * Module Export Format
 * Custom export formats the module can provide
 */
export interface ModuleExportFormat {
  /** Format identifier */
  id: string;

  /** Format name */
  name: string;

  /** File extension */
  extension: string;

  /** MIME type */
  mimeType: string;

  /** Icon */
  icon?: string | ComponentType;

  /** Export function */
  export: (data: ModuleExportData) => string | Blob | Promise<string | Blob>;

  /** Export options schema */
  options?: ModuleFieldSchema[];
}

export interface ModuleExportData {
  /** Transcript data */
  transcript: any;

  /** Module-specific metadata */
  metadata: Record<string, any>;

  /** Export options selected by user */
  exportOptions?: Record<string, any>;

  /** User profile */
  userProfile?: any;
}

/**
 * Module Analytics
 * Custom analytics/insights the module can display
 */
export interface ModuleAnalytics {
  /** Analytics component identifier */
  id: string;

  /** Analytics name */
  name: string;

  /** Component to render analytics */
  component: ComponentType<ModuleAnalyticsProps>;

  /** Where should this analytics view appear? */
  placement: 'sidebar' | 'dashboard' | 'detail-view';
}

export interface ModuleAnalyticsProps {
  /** Transcript data */
  transcript?: any;

  /** All transcripts in this module */
  allTranscripts?: any[];

  /** Module-specific metadata */
  metadata?: Record<string, any>;

  /** User profile */
  userProfile?: any;
}

/**
 * Module UI Components
 * Custom UI components the module provides
 */
export interface ModuleComponents {
  /** Custom detail view component */
  DetailView?: ComponentType<ModuleDetailViewProps>;

  /** Custom list item component */
  ListItem?: ComponentType<ModuleListItemProps>;

  /** Custom comparison view component */
  ComparisonView?: ComponentType<ModuleComparisonViewProps>;

  /** Custom settings panel */
  SettingsPanel?: ComponentType<ModuleSettingsPanelProps>;

  /** Custom onboarding/welcome screen */
  WelcomeScreen?: ComponentType<ModuleWelcomeScreenProps>;
}

export interface ModuleDetailViewProps {
  transcript: any;
  metadata: Record<string, any>;
  onUpdate: (updates: Record<string, any>) => void;
}

export interface ModuleListItemProps {
  transcript: any;
  metadata: Record<string, any>;
  isSelected: boolean;
  onSelect: () => void;
}

export interface ModuleComparisonViewProps {
  transcripts: any[];
  onSelect: (transcriptId: string) => void;
}

export interface ModuleSettingsPanelProps {
  settings: Record<string, any>;
  onChange: (settings: Record<string, any>) => void;
}

export interface ModuleWelcomeScreenProps {
  onComplete: () => void;
}

/**
 * AI Enhancement Configuration
 * Defines custom AI analysis the module provides
 */
export interface ModuleAIEnhancement {
  /** Enhancement identifier */
  id: string;

  /** Enhancement name */
  name: string;

  /** Enhancement description */
  description: string;

  /** AI prompt template */
  promptTemplate: string;

  /** How to process AI response */
  processResponse: (response: string, transcript: any) => Record<string, any>;

  /** When to run this enhancement */
  trigger: 'on-upload' | 'on-demand' | 'scheduled';

  /** Should this run automatically? */
  autoRun?: boolean;
}

/**
 * Module Hooks
 * Lifecycle hooks for the module
 */
export interface ModuleHooks {
  /** Called when module is first activated */
  onActivate?: () => void | Promise<void>;

  /** Called when module is deactivated */
  onDeactivate?: () => void | Promise<void>;

  /** Called when a new transcript is created in this module */
  onTranscriptCreate?: (transcript: any) => void | Promise<void>;

  /** Called when a transcript is updated */
  onTranscriptUpdate?: (transcript: any, updates: Record<string, any>) => void | Promise<void>;

  /** Called when a transcript is deleted */
  onTranscriptDelete?: (transcriptId: string) => void | Promise<void>;

  /** Called when user profile is updated */
  onProfileUpdate?: (profile: any) => void | Promise<void>;
}

/**
 * Module Definition
 * Complete definition of a snap-in module
 */
export interface ModuleDefinition {
  /** Module metadata */
  metadata: ModuleMetadata;

  /** Custom fields this module adds */
  fields: ModuleFieldSchema[];

  /** Pre-configured templates */
  templates?: ModuleTemplate[];

  /** Custom actions */
  actions?: ModuleAction[];

  /** Custom export formats */
  exportFormats?: ModuleExportFormat[];

  /** Custom analytics views */
  analytics?: ModuleAnalytics[];

  /** Custom UI components */
  components?: ModuleComponents;

  /** AI enhancements */
  aiEnhancements?: ModuleAIEnhancement[];

  /** Lifecycle hooks */
  hooks?: ModuleHooks;

  /** Module-specific settings schema */
  settings?: ModuleFieldSchema[];
}

/**
 * Module Registry
 * Central registry for all installed modules
 */
export class ModuleRegistry {
  private static modules = new Map<string, ModuleDefinition>();

  /**
   * Register a new module
   */
  static register(module: ModuleDefinition): void {
    if (this.modules.has(module.metadata.id)) {
      console.warn(`Module ${module.metadata.id} is already registered. Overwriting.`);
    }
    this.modules.set(module.metadata.id, module);

    // Call activation hook
    module.hooks?.onActivate?.();
  }

  /**
   * Unregister a module
   */
  static unregister(moduleId: string): void {
    const module = this.modules.get(moduleId);
    if (module) {
      // Call deactivation hook
      module.hooks?.onDeactivate?.();
      this.modules.delete(moduleId);
    }
  }

  /**
   * Get a module by ID
   */
  static get(moduleId: string): ModuleDefinition | undefined {
    return this.modules.get(moduleId);
  }

  /**
   * Get all registered modules
   */
  static getAll(): ModuleDefinition[] {
    return Array.from(this.modules.values());
  }

  /**
   * Get modules by category
   */
  static getByCategory(category: ModuleCategory): ModuleDefinition[] {
    return this.getAll().filter(m => m.metadata.category === category);
  }

  /**
   * Check if a module is registered
   */
  static has(moduleId: string): boolean {
    return this.modules.has(moduleId);
  }
}

/**
 * Helper function to create a module
 */
export function createModule(definition: ModuleDefinition): ModuleDefinition {
  return definition;
}
