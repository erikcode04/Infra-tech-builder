'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CreateProjectModal from './compontents/create';

export default function Dashboard() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleCreateProject = (projectName: string) => {
        console.log('Creating project:', projectName);
        // Here you would typically call an API to create the project
        setIsCreateModalOpen(false);
    };

    // Mock data for projects - in a real app this would come from an API
    const projects = [
        {
            id: 1,
            name: 'Project Alpha',
            description: 'Infrastructure automation pipeline for production environment.',
            status: 'Active',
            lastUpdated: '2h ago',
            environment: 'Production'
        },
        {
            id: 2,
            name: 'Data Lake',
            description: 'Centralized data storage solution with automated ingestion.',
            status: 'Building',
            lastUpdated: '1d ago',
            environment: 'Staging'
        },
        {
            id: 3,
            name: 'API Gateway',
            description: 'Microservices entry point with rate limiting and auth.',
            status: 'Maintenance',
            lastUpdated: '3d ago',
            environment: 'Development'
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans selection:bg-white selection:text-black">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-zinc-800 pb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-light tracking-tight text-white">Dashboard</h1>
                        <p className="text-zinc-500 mt-1 text-sm">Overview of your infrastructure projects</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="group flex items-center gap-2 bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-zinc-200 transition-all active:scale-95"
                    >
                        <span>Create Project</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                    </button>
                </div>

                {/* Stats Overview (Optional but nice for dashboards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Total Projects', value: '12', change: '+2 this week' },
                        { label: 'Active Deployments', value: '8', change: 'All systems operational' },
                        { label: 'Resource Usage', value: '64%', change: 'Within limits' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-zinc-900/30 border border-zinc-800 p-6">
                            <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2">{stat.label}</p>
                            <div className="flex items-end gap-3">
                                <span className="text-3xl font-light text-white">{stat.value}</span>
                                <span className="text-xs text-zinc-600 mb-1.5">{stat.change}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Projects Grid */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-light text-zinc-300">Current Projects</h2>
                        <div className="flex gap-2">
                            <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            </button>
                            <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project.id} className="group relative border border-zinc-800 bg-zinc-900/20 p-6 hover:border-zinc-600 hover:bg-zinc-900/40 transition-all duration-300 cursor-pointer">
                                <div className="absolute top-6 right-6">
                                    <div className={`w-2 h-2 rounded-full ${project.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                                        project.status === 'Building' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]' :
                                            'bg-zinc-500'
                                        }`}></div>
                                </div>

                                <div className="mb-6">
                                    <div className="h-10 w-10 border border-zinc-800 bg-zinc-900 flex items-center justify-center text-sm font-mono text-zinc-400 mb-4 group-hover:border-zinc-600 group-hover:text-white transition-colors">
                                        {project.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <h3 className="text-xl font-light text-white mb-2 group-hover:text-zinc-200">{project.name}</h3>
                                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">{project.description}</p>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-zinc-800/50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase tracking-wider text-zinc-600">Environment</span>
                                        <span className="text-xs text-zinc-400 font-mono mt-1">{project.environment}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] uppercase tracking-wider text-zinc-600">Updated</span>
                                        <span className="text-xs text-zinc-400 font-mono mt-1">{project.lastUpdated}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Create New Project Card */}
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="group border border-zinc-800 border-dashed bg-transparent p-6 flex flex-col items-center justify-center text-zinc-600 hover:border-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/20 transition-all duration-300 min-h-[240px]"
                        >
                            <div className="h-12 w-12 rounded-full border border-zinc-800 flex items-center justify-center mb-4 group-hover:border-zinc-500 group-hover:scale-110 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                            </div>
                            <span className="text-sm font-medium">Create New Project</span>
                        </button>
                    </div>
                </div>
            </div>
            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateProject}
            />
        </div>
    );
}
