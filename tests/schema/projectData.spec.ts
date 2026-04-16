import { describe, it, expect } from 'vitest'
import { z } from 'zod'
// Import the raw JSON data
import projectsData from '../../public/data/projects.json'

/**
 * Updated Project Data Schema (Zod)
 * Reflects the shift from Mermaid strings to structured diagram URLs
 */
const ProjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  title: z.string().min(3),
  emoji: z.string(), 
  headline: z.string().max(200),
  summary: z.string().max(1000),
  stack: z.array(z.string()).min(1),
  kpis: z.array(
    z.object({
      value: z.string(),
      label: z.string()
    })
  ),
  imageUrl: z.string().url(),
  // New Diagram structure
  systemArchitectureUrl: z.string().url(),
  additionalDiagrams: z.array(
    z.object({
      name: z.string(),
      url: z.string().url()
    })
  ),
  rationale: z.array(
    z.object({
      title: z.string(),
      description: z.string()
    })
  ),
  videos: z.array(
    z.object({
      title: z.string(),
      desc: z.string(),
      url: z.string().url().optional()
    })
  ),
  artifacts: z.object({
    githubUrl: z.string().url(),
    adrUrl: z.string().url()
  })
})

const ProjectsListSchema = z.array(ProjectSchema)

describe('Portfolio Data Integrity', () => {
  it('should have exactly 5 projects as per the current projects.json', () => {
    expect(projectsData.length).toBe(5)
  })

  it('should satisfy the strict Project Schema for all entries', () => {
    const result = ProjectsListSchema.safeParse(projectsData)
    
    if (!result.success) {
      console.error('Data Validation Failed:', JSON.stringify(result.error.format(), null, 2))
    }
    
    expect(result.success).toBe(true)
  })

  it('should ensure all project IDs are unique', () => {
    const ids = projectsData.map(p => p.id)
    const uniqueIds = new Set(ids)
    expect(ids.length).toBe(uniqueIds.size)
  })
})
