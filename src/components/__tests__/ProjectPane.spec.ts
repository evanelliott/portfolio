import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ProjectPane from '../ProjectPane.vue'
import type { Project } from '@/types/Project'

/**
 * Unit test for the ProjectPane component.
 * Verifies UI state transitions and interaction contracts.
 */
describe('ProjectPane.vue', () => {
  // Mock data matching our Project schema
  const mockProject: Partial<Project> = {
    id: '1',
    name: 'Data Pipeline Ops',
    valueProposition: 'Automated ETL for high-volume telemetry.',
    techStack: ['Airflow', 'Spark', 'Python'],
    topics: ['Data Engineering', 'ETL']
  }

  it('renders project metadata correctly', () => {
    const wrapper = mount(ProjectPane, {
      props: {
        project: mockProject as Project,
        isActive: false
      }
    })

    // Assert: Verify text content displays as expected
    expect(wrapper.text()).toContain('Data Pipeline Ops')
  })

  it('emits a click event when the tile is pressed', async () => {
    const wrapper = mount(ProjectPane, {
      props: {
        project: mockProject as Project,
        isActive: false
      }
    })

    // Act: Simulate user interaction
    await wrapper.trigger('click')

    // Assert: Check the event contract with the parent
    expect(wrapper.emitted()).toHaveProperty('click')
  })

  it('applies "active" styling classes when isActive prop is true', () => {
    const wrapper = mount(ProjectPane, {
      props: {
        project: mockProject as Project,
        isActive: true
      }
    })

    // Assert: Verify conditional Tailwind classes for visual feedback
    const container = wrapper.find('.rounded-xl')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('border-indigo-100')
    expect(wrapper.classes()).toContain('ease-out')
    
    // Accessibility check: aria-selected should reflect active state
    expect(wrapper.attributes('aria-selected')).toBe('true')
  })
})
