/**
 * Represents the structured metadata for a Data Science/Engineering project.
 * This interface mirrors the data required by the PortfolioHome and MarkdownView components.
 */

export interface ProjectAnimation {
  fileName: string;     // Reference to the .webm / .webp file in /public/animations/
  description: string;  // Context for the visual demo
}

export interface ProjectArtifacts {
  githubUrl: string;    // Link to the source code repository
  adrUrl: string;       // Link to the Architecture Decision Record (ADR)
}

export interface FurtherReading {
  label: string;        // Text to display for the link
  url: string;          // External link to documentation, blog post, or whitepaper
}

export interface Project {
  id: string;           // Unique identifier for selection state
  name: string;         // Official project title
  emoji: string;        // Single emoji representing the project theme
  valueProposition: string; // One-line "elevator pitch" for the CV
  
  // Content Pointers
  mainAnimation: string;    // Primary hero animation file name
  
  // Structured Data Sections
  artifacts: ProjectArtifacts;
  animations: ProjectAnimation[]; // Ordered series of demos
  mermaidDiagram: string;         // Raw Mermaid.js string or reference
  furtherReading: FurtherReading[];
  
  // Metadata for Filtering
  techStack: string[];       // e.g., ['Spark', 'Kubernetes', 'Python']
  topics: string[];         // e.g., ['Machine Learning', 'Data Engineering']
  date: string;         // YYYY-MM format for sorting
}