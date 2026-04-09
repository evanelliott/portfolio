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
  title: string; // Used as the reference for the video file and heading
  desc: string;  // Detailed engineering context for the clip
}

export interface ProjectArtifacts {
  githubUrl: string; // Link to the source code or sanitized snippets
  adrUrl: string;    // Link to Technical Specs or ADRs
}

export interface Project {
  // Identification
  id: string;        // Used for selection state (e.g., "1", "2")
  emoji: string;     // A single emoji representing the project (e.g., "⚽")
  title: string;     // Project name (e.g., "Football Data Lakehouse")
  headline: string;  // High-level role/goal (e.g., "End-to-End Sports Analytics")
  
  // Executive Summary
  summary: string;   // The "Why" and "What" (formerly useCase)
  stack: string[];   // e.g., ["Spark", "Trino"]
  kpis: ProjectKPI[];
  
  // The "Brain" (Architecture)
  mermaidDiagram: string;
  rationale: DesignRationale[];
  
  // The "Meat" (Implementation)
  videos: ProjectVideo[];
  
  // The "Proof"
  artifacts: ProjectArtifacts;
}
