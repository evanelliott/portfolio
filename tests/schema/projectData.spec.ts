import { describe, it, expect } from 'vitest'
import { z } from 'zod'
// Import the raw JSON data you created for your projects
import projectsData from '../../public/data/projects.json'
import { emoji } from 'zod/v4'

/**
 * Project Data Schema (Zod)
 * This mirrors your TypeScript 'Project' interface but provides 
 * runtime validation—a core Data Engineering best practice.
 */
const ProjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(3),
  emoji: z.string().emoji(), // Validate that it's a single emoji character
  valueProposition: z.string().max(500), // Keep it punchy for the CV
  mainAnimation: z.string().min(1),
  artifacts: z.object({
    githubUrl: z.string().url(),
    adrUrl: z.string().url()
  }),
  animations: z.array(
    z.object({
      fileName: z.string(),
      description: z.string().min(10)
    })
  ).min(1), // Ensure every project has at least one demo
  mermaidDiagram: z.string().optional(),
  furtherReading: z.array(
    z.object({
      label: z.string(),
      url: z.string().url()
    })
  ),
  techStack: z.array(z.string()).min(1),
  topics: z.array(z.string()).min(1),
  date: z.string().regex(/^\d{4}-\d{2}$/) // Validates YYYY-MM format
})

// Collection Schema
const ProjectsListSchema = z.array(ProjectSchema)

describe('Portfolio Data Integrity', () => {
  it('should have exactly 5 projects as per the design brief', () => {
    expect(projectsData.length).toBe(5)
  })

  it('should satisfy the strict Project Schema for all entries', () => {
    const result = ProjectsListSchema.safeParse(projectsData)
    
    if (!result.success) {
      // Print clear error messages in the CI/CD logs
      console.error('Data Validation Failed:', JSON.stringify(result.error.format(), null, 2))
    }
    
    expect(result.success).toBe(true)
  })

  it('should ensure all animation filenames are unique to prevent collisions', () => {
    const fileNames = projectsData.flatMap(p => p.animations.map(a => a.fileName))
    const uniqueFiles = new Set(fileNames)
    expect(fileNames.length).toBe(uniqueFiles.size)
  })
})
