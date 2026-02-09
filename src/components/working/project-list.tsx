'use client'

import React from 'react'
import { Project } from '@/types/working'
import { ProjectCard } from './project-card'
import { Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { CreateProjectModal } from './create-project-modal'

interface ProjectListProps {
    projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Create Project Button */}
            <CreateProjectModal />

            {/* Project Cards */}
            {projects.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                />
            ))}
        </div>
    )
}
