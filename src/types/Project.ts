/**
 * Represents the structured metadata for a Senior IC Project.
 * Optimized for the "Business-to-Metal" portfolio structure.
 */

export interface ProjectKPI {
  value: string; // e.g., "40%" or "ACID"
  label: string; // e.g., "Latency Reduction" or "Transactions"
}

export interface DesignRationale {
  title: string;       // e.g., "Storage Layer"
  description: string; // e.g., "Utilised Apache Iceberg over Parquet..."
}

export interface ProjectVideo {
  title: string; // Used as the heading
  desc: string;  // Detailed engineering context for the clip
  url?: string;  // Optional URL for the video source
}

export interface ProjectArtifacts {
  githubUrl: string; // Link to the source code or sanitized snippets
  adrUrl: string;    // Link to Technical Specs or ADRs
}

export interface AdditionalDiagram {
  name: string; // Display name for the thumbnail/overlay
  url: string;  // Path or URL to the diagram image
}

export interface Project {
  // Identification
  id: string;        // Used for selection state (e.g., "1", "2")
  name: string;      // Internal name/category (e.g., "GenAI" or "MLOps")
  title: string;     // Full display title
  emoji: string;     // A single emoji (e.g., "🤖")
  headline: string;  // High-level role/goal
  
  // Executive Summary
  summary: string;   // The "Why" and "What"
  stack: string[];   // e.g., ["Spark", "Trino"]
  kpis: ProjectKPI[];
  imageUrl: string;  // Path or URL to the project cover image
  
  // The "Brain" (Architecture)
  systemArchitectureUrl: string;       // Mandatory primary system diagram
  additionalDiagrams: AdditionalDiagram[]; // Optional array of supporting diagrams
  rationale: DesignRationale[];
  
  // The "Meat" (Implementation)
  videos: ProjectVideo[];
  
  // The "Proof"
  artifacts: ProjectArtifacts;
}
