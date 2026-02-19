"use client";

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DemographicsData {
    population?: { [year: string]: number };
    ethnicity?: { [group: string]: number };
    religion?: { [group: string]: number };
}

interface DemographicsChartsProps {
    data: DemographicsData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function DemographicsCharts({ data }: DemographicsChartsProps) {
    // Process Population Data
    const popData = data.population
        ? Object.entries(data.population).map(([year, count]) => ({
            name: year,
            nüfus: count
        })).sort((a, b) => parseInt(a.name) - parseInt(b.name))
        : [];

    // Process Ethnicity Data
    const ethData = data.ethnicity
        ? Object.entries(data.ethnicity).map(([name, value]) => ({ name, value }))
        : [];

    // Process Religion Data
    const relData = data.religion
        ? Object.entries(data.religion).map(([name, value]) => ({ name, value }))
        : [];

    return (
        <div className="space-y-8">
            {/* Population Chart */}
            {popData.length > 0 && (
                <div className="h-64 w-full bg-[var(--surface-bg)] p-4 rounded-lg border border-[var(--border-color)]">
                    <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-4 text-center">Nüfus Değişimi</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={popData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="name" stroke="#888" fontSize={12} />
                            <YAxis stroke="#888" fontSize={12} tickFormatter={(value) => value.toLocaleString()} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                                formatter={(value: any) => value !== undefined && value !== null ? value.toLocaleString() : ''}
                            />
                            <Bar dataKey="nüfus" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Ethnicity & Religion Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ethData.length > 0 && (
                    <div className="h-64 bg-[var(--surface-bg)] p-4 rounded-lg border border-[var(--border-color)]">
                        <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-2 text-center">Etnik Yapı (Tahmini)</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={ethData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={60}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {ethData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }} />
                                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {relData.length > 0 && (
                    <div className="h-64 bg-[var(--surface-bg)] p-4 rounded-lg border border-[var(--border-color)]">
                        <h4 className="text-sm font-bold text-[var(--text-secondary)] mb-2 text-center">Dini Dağılım (Tahmini)</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={relData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={60}
                                    fill="#82ca9d"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {relData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)' }} />
                                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {(popData.length === 0 && ethData.length === 0 && relData.length === 0) && (
                <div className="text-center text-[var(--text-muted)] py-8 italic">
                    Bu bölge için yeterli grafik verisi oluşturulamadı.
                </div>
            )}
        </div>
    );
}
